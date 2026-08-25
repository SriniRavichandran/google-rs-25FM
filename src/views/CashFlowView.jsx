import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Chip,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useFinance } from '../context/FinanceContext.jsx';

const CashFlowView = () => {
  const { selectedPeriod, filteredTx, setActiveModal } = useFinance();

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const totalIncome = filteredTx.filter(t => t.type === 'income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const totalExpense = filteredTx.filter(t => t.type === 'expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const netSavings = totalIncome - totalExpense;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            💰 Cash Flow ({selectedPeriod.toUpperCase()})
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Track income inflows, living expenses, investments, and net savings
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-transaction')}>
          + Add Transaction
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Inflow / Income</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalIncome)}</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>{filteredTx.filter(t => t.type === 'income').length} Income Entries</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Outflow / Expenses</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{formatCurrency(totalExpense)}</Typography>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>{filteredTx.filter(t => t.type === 'expense').length} Expense Entries</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Net Savings Flow</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: netSavings >= 0 ? '#10b981' : '#ef4444', my: 0.5 }}>{formatCurrency(netSavings)}</Typography>
              <Typography variant="caption" sx={{ color: netSavings >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                {totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) + '% Saved' : 'No Income'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Account</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTx.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No cash flow transactions recorded for {selectedPeriod}. Click <strong>"+ Add Transaction"</strong> to log entries!
                    </TableCell>
                  </TableRow>
                ) : filteredTx.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell>{t.date}</TableCell>
                    <TableCell><strong>{t.category}</strong></TableCell>
                    <TableCell><Chip label={t.type.toUpperCase()} size="small" color={t.type === 'income' ? 'success' : 'error'} sx={{ fontWeight: 700 }} /></TableCell>
                    <TableCell sx={{ fontWeight: 700, color: t.type === 'income' ? '#10b981' : '#ef4444' }}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </TableCell>
                    <TableCell>{t.paymentMethod}</TableCell>
                    <TableCell>{t.account}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CashFlowView;
