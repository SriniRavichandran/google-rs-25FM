import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import { useFinance } from '../context/FinanceContext.jsx';

const NetWorthView = () => {
  const {
    netWorth,
    totalBankBalance,
    totalPortfolioValue,
    totalLoansGiven,
    totalCreditOutstanding,
    totalLoansTaken
  } = useFinance();

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const totalAssets = totalBankBalance + totalPortfolioValue + totalLoansGiven;
  const totalLiabilities = totalCreditOutstanding + totalLoansTaken;

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          📊 Net-Worth & Wealth Breakdown
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Complete balance sheet analysis: Total Assets minus Total Liabilities
        </Typography>
      </Box>

      {/* Hero Net Worth Card */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.15))', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
        <CardContent sx={{ py: 3, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 2 }}>
            TOTAL NET WORTH
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#10b981', my: 1, fontFamily: 'JetBrains Mono', fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
            {formatCurrency(netWorth)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
            Assets ({formatCurrency(totalAssets)}) - Liabilities ({formatCurrency(totalLiabilities)})
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Assets Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981', mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            🟢 Total Assets ({formatCurrency(totalAssets)})
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Liquid Cash & Bank Reserves</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Savings & Debit Card Balances</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#38bdf8' }}>{formatCurrency(totalBankBalance)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Trade & Investment Portfolio</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Equity, Mutual Funds & Crypto</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>{formatCurrency(totalPortfolioValue)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Loans Given (Money Owed to Me)</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Lent Capital Assets</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#f59e0b' }}>{formatCurrency(totalLoansGiven)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Liabilities Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444', mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            🔴 Total Liabilities ({formatCurrency(totalLiabilities)})
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Credit Card Outstanding Dues</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Unpaid Card Statements</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444' }}>{formatCurrency(totalCreditOutstanding)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Loans Taken (Borrowed Debt)</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Personal & Bank Debt</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444' }}>{formatCurrency(totalLoansTaken)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NetWorthView;
