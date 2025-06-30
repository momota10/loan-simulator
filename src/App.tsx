import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';
import TermsOfService from './TermsOfService';

const theme = createTheme({
  palette: {
    primary: {
      main: lightGreen[300],
    },
    background: {
      // @ts-ignore
      default: '#f7f9f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      color: '#424242',
    },
    h5: {
      fontWeight: 600,
      color: '#424242',
    },
  },
});

interface YearlyBreakdown {
  year: number;
  principalPaid: number;
  interestPaid: number;
  yearlyPayment: number;
  remainingBalance: number;
}

type RepaymentMethod = 'equal_principal_and_interest' | 'equal_principal';

function LoanSimulator() {
  const [loanAmount, setLoanAmount] = useState<number>(30000000);
  const [displayLoanAmount, setDisplayLoanAmount] = useState<string>(loanAmount.toLocaleString());
  const [interestRate, setInterestRate] = useState<number>(1.5);
  const [loanTerm, setLoanTerm] = useState<number>(35);
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>('equal_principal_and_interest');

  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [firstMonthPayment, setFirstMonthPayment] = useState<number | null>(null);
  const [lastMonthPayment, setLastMonthPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<YearlyBreakdown[]>([]);

  useEffect(() => {
    const calculateLoan = () => {
      const principal = loanAmount;
      const monthlyInterestRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;

      if (principal <= 0 || interestRate <= 0 || loanTerm <= 0) {
        setMonthlyPayment(null);
        setFirstMonthPayment(null);
        setLastMonthPayment(null);
        setTotalPayment(null);
        setTotalInterest(null);
        setYearlyBreakdown([]);
        return;
      }

      const breakdown: YearlyBreakdown[] = [];
      let newTotalPayment = 0;
      let newTotalInterest = 0;

      if (repaymentMethod === 'equal_principal_and_interest') {
        const monthly = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        newTotalPayment = monthly * numberOfPayments;
        newTotalInterest = newTotalPayment - principal;

        setMonthlyPayment(monthly);
        setFirstMonthPayment(null);
        setLastMonthPayment(null);

        let remainingBalance = principal;
        for (let year = 1; year <= loanTerm; year++) {
          let yearlyPrincipalPaid = 0;
          let yearlyInterestPaid = 0;
          for (let month = 1; month <= 12; month++) {
            const interestForMonth = remainingBalance * monthlyInterestRate;
            const principalForMonth = monthly - interestForMonth;
            yearlyInterestPaid += interestForMonth;
            yearlyPrincipalPaid += principalForMonth;
            remainingBalance -= principalForMonth;
          }
          breakdown.push({
            year,
            principalPaid: yearlyPrincipalPaid,
            interestPaid: yearlyInterestPaid,
            yearlyPayment: yearlyPrincipalPaid + yearlyInterestPaid,
            remainingBalance: remainingBalance > 0 ? remainingBalance : 0,
          });
        }
      } else if (repaymentMethod === 'equal_principal') {
        const monthlyPrincipalPayment = principal / numberOfPayments;
        let remainingBalance = principal;
        
        const firstPaymentInterest = remainingBalance * monthlyInterestRate;
        setFirstMonthPayment(monthlyPrincipalPayment + firstPaymentInterest);

        let tempTotalInterest = 0;
        for (let i = 0; i < numberOfPayments; i++) {
          tempTotalInterest += (principal - monthlyPrincipalPayment * i) * monthlyInterestRate;
        }
        newTotalInterest = tempTotalInterest;
        newTotalPayment = principal + newTotalInterest;
        
        const lastPaymentInterest = (principal - monthlyPrincipalPayment * (numberOfPayments - 1)) * monthlyInterestRate;
        setLastMonthPayment(monthlyPrincipalPayment + lastPaymentInterest);
        setMonthlyPayment(null);

        remainingBalance = principal;
        for (let year = 1; year <= loanTerm; year++) {
          let yearlyPrincipalPaid = 0;
          let yearlyInterestPaid = 0;
          for (let month = 1; month <= 12; month++) {
            const paymentIndex = (year - 1) * 12 + month -1;
            const interestForMonth = (principal - monthlyPrincipalPayment * paymentIndex) * monthlyInterestRate;
            yearlyInterestPaid += interestForMonth;
            yearlyPrincipalPaid += monthlyPrincipalPayment;
          }
          remainingBalance -= yearlyPrincipalPaid;
          breakdown.push({
            year,
            principalPaid: yearlyPrincipalPaid,
            interestPaid: yearlyInterestPaid,
            yearlyPayment: yearlyPrincipalPaid + yearlyInterestPaid,
            remainingBalance: remainingBalance > 0 ? remainingBalance : 0,
          });
        }
      }
      
      setTotalPayment(newTotalPayment);
      setTotalInterest(newTotalInterest);
      setYearlyBreakdown(breakdown);
    };

    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, repaymentMethod]);

  const handleNumericInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setter: React.Dispatch<React.SetStateAction<number>>,
    displaySetter?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value;
    const halfWidthValue = value.replace(/[０-９．]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    const sanitizedValue = halfWidthValue.replace(/[^0-9.]/g, '');
    
    if (displaySetter) {
      displaySetter(sanitizedValue);
      const numericValue = Number(sanitizedValue.replace(/,/g, ''));
      if (!isNaN(numericValue)) {
        setter(numericValue);
      }
    } else {
      if (!isNaN(Number(sanitizedValue))) {
        setter(Number(sanitizedValue));
      }
    }
  };

  const handleLoanAmountBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      setLoanAmount(numberValue);
      setDisplayLoanAmount(numberValue.toLocaleString());
    }
  };

  const exportToCsv = () => {
    const headers = ['年', '元利返済額', '元本返済額', '利息支払額', '年末残高'];
    const csvContent = [
      headers.join(','),
      ...yearlyBreakdown.map(item => [
        item.year,
        Math.round(item.yearlyPayment),
        Math.round(item.principalPaid),
        Math.round(item.interestPaid),
        Math.round(item.remainingBalance)
      ].join(','))
    ].join('\n');

    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'repayment_breakdown.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: 32, marginBottom: 32 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        ローンシミュレーター
      </Typography>
      <Paper elevation={3} style={{ padding: 24, borderRadius: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="loanAmount"
              label="借入額（円）"
              value={displayLoanAmount}
              onChange={(e) => handleNumericInputChange(e, setLoanAmount, setDisplayLoanAmount)}
              onBlur={handleLoanAmountBlur}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="interestRate"
              label="年利率（%）"
              value={interestRate}
              onChange={(e) => handleNumericInputChange(e, setInterestRate)}
              variant="outlined"
              type="number"
              inputProps={{ step: "0.1" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="loanTerm"
              label="返済期間（年）"
              value={loanTerm}
              onChange={(e) => handleNumericInputChange(e, setLoanTerm)}
              variant="outlined"
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <RadioGroup
              row
              aria-label="repayment-method"
              name="repayment-method"
              value={repaymentMethod}
              onChange={(e) => setRepaymentMethod(e.target.value as RepaymentMethod)}
            >
              <FormControlLabel value="equal_principal_and_interest" control={<Radio />} label="元利均等返済" />
              <FormControlLabel value="equal_principal" control={<Radio />} label="元金均等返済" />
            </RadioGroup>
          </Grid>
        </Grid>
      </Paper>

      {totalPayment !== null && (
        <>
          <Paper elevation={3} style={{ padding: 24, marginTop: 32, borderRadius: 8 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              計算結果
            </Typography>
            <List>
              {repaymentMethod === 'equal_principal_and_interest' && monthlyPayment !== null && (
                <ListItem>
                  <ListItemText primary="毎月の返済額" />
                  <Typography variant="body1">{Math.round(monthlyPayment).toLocaleString()} 円</Typography>
                </ListItem>
              )}
              {repaymentMethod === 'equal_principal' && firstMonthPayment !== null && lastMonthPayment !== null && (
                <>
                  <ListItem>
                    <ListItemText primary="初回返済額" />
                    <Typography variant="body1">{Math.round(firstMonthPayment).toLocaleString()} 円</Typography>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText primary="最終回返済額" />
                    <Typography variant="body1">{Math.round(lastMonthPayment).toLocaleString()} 円</Typography>
                  </ListItem>
                </>
              )}
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="総返済額" />
                <Typography variant="body1">{Math.round(totalPayment).toLocaleString()} 円</Typography>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="利息総額" />
                <Typography variant="body1">{Math.round(totalInterest!).toLocaleString()} 円</Typography>
              </ListItem>
            </List>
          </Paper>

          <Paper elevation={3} style={{ padding: 24, marginTop: 32, borderRadius: 8 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                年次返済内訳
              </Typography>
              <Button variant="contained" color="primary" onClick={exportToCsv}>
                CSVエクスポート
              </Button>
            </Box>
            <TableContainer>
              <Table stickyHeader aria-label="repayment breakdown table">
                <TableHead>
                  <TableRow>
                    <TableCell>年</TableCell>
                    <TableCell align="right">元利返済額</TableCell>
                    <TableCell align="right">元本返済額</TableCell>
                    <TableCell align="right">利息支払額</TableCell>
                    <TableCell align="right">年末残高</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {yearlyBreakdown.map((item) => (
                    <TableRow key={item.year} hover>
                      <TableCell component="th" scope="row">{item.year}</TableCell>
                      <TableCell align="right">{Math.round(item.yearlyPayment).toLocaleString()} 円</TableCell>
                      <TableCell align="right">{Math.round(item.principalPaid).toLocaleString()} 円</TableCell>
                      <TableCell align="right">{Math.round(item.interestPaid).toLocaleString()} 円</TableCell>
                      <TableCell align="right">{Math.round(item.remainingBalance).toLocaleString()} 円</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Container>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoanSimulator />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
        <Box textAlign="center" my={4}>
          <Link to="/terms">利用規約</Link>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;

