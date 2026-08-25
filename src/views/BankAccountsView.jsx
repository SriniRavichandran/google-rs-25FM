import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useFinance } from '../context/FinanceContext.jsx';

const BankAccountsView = () => {
  const { data, totalBankBalance, setActiveModal } = useFinance();

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            💳 Debit Cards & Bank Accounts
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Track liquid cash, bank balances, savings, and debit card accounts
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-bank-account')}>
          + Add Bank Account
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Liquid Balance</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalBankBalance)}</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Available Cash</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Bank Accounts Connected</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{data.bankAccounts.length}</Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Active Accounts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Average Balance / Account</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', my: 0.5 }}>{formatCurrency(data.bankAccounts.length ? totalBankBalance / data.bankAccounts.length : 0)}</Typography>
              <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600 }}>Balanced Reserve</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bank Accounts Grid */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>🏦 Registered Bank & Debit Card Accounts</Typography>
      <Grid container spacing={2.5}>
        {data.bankAccounts.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>No bank accounts added yet.</Typography>
              <Button variant="contained" color="primary" onClick={() => setActiveModal('add-bank-account')}>+ Add Bank Account</Button>
            </Card>
          </Grid>
        ) : data.bankAccounts.map(a => (
          <Grid item xs={12} sm={6} md={4} key={a.id}>
            <Card sx={{ borderLeft: '4px solid #38bdf8' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{a.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{a.bank} • {a.type}</Typography>
                  </Box>
                  <Chip label={`**** ${a.accountNumber}`} size="small" color="primary" sx={{ fontWeight: 700 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Available Balance</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono' }}>{formatCurrency(a.balance)}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BankAccountsView;
