import React from 'react';
import { Container, Typography, Paper } from '@material-ui/core';

function TermsOfService() {
  return (
    <Container maxWidth="md" style={{ marginTop: 32, marginBottom: 32 }}>
      <Paper elevation={3} style={{ padding: 24, borderRadius: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          利用規約
        </Typography>
        <Typography variant="body1" paragraph>
          本ウェブサイト（以下、「当サイト」といいます。）のご利用にあたっては、以下の利用規約（以下、「本規約」といいます。）をよくお読みいただき、ご同意の上でご利用ください。
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          第1条（免責事項）
        </Typography>
        <Typography variant="body1" paragraph>
          当サイトで提供するシミュレーション結果は、入力された数値に基づく概算値です。実際の返済額とは異なる場合がありま��。当サイトの利用によって生じたいかなる損害についても、当方は一切の責任を負いません。
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          第2条（著作権）
        </Typography>
        <Typography variant="body1" paragraph>
          当サイトのコンテンツの著作権は、当方に帰属します。私的利用など法律で認められる範囲を超えて、無断で複製、改変、転用することはできません。
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          第3条（本規約の変更）
        </Typography>
        <Typography variant="body1" paragraph>
          当方は、必要に応じて本規約を変更することがあります。変更後の本規約は、当サイトに掲載された時点から効力を生じるものとします。
        </Typography>
      </Paper>
    </Container>
  );
}

export default TermsOfService;
