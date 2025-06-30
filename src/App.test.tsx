import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loan simulator title', () => {
  render(<App />);
  const titleElement = screen.getByText(/ローンシミュレーター/i);
  expect(titleElement).toBeInTheDocument();
});
