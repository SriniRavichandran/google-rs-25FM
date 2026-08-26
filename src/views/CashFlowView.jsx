import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip,
  Button, IconButton, Tooltip, Table, TableHead,
  TableBody, TableCell, TableRow, TableContainer, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const CashFlowView = () => {
  const { selectedPeriod, filteredTx, setActiveModal, setEditingTx, deleteTransaction } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const totalIncome = filteredTx.filter(t => t.type === 'income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const totalExpense = filteredTx.filter(t => t.type === 'expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const netSavings = totalIncome - totalExpense;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>💰 Cash Flow ({selectedPeriod.toUpperCase()})</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Track income inflows, living expenses, and net savings</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-transaction')}>
          + Add Transaction
        </Button>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Inflow / Income</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalIncome)}</Typography>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>{filteredTx.filter(t => t.type === 'income').length} Income Entries</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Outflow / Expenses</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{formatCurrency(totalExpense)}</Typography>
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>{filteredTx.filter(t => t.type === 'expense').length} Expense Entries</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Net Savings Flow</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: netSavings >= 0 ? '#10b981' : '#ef4444', my: 0.5 }}>{formatCurrency(netSavings)}</Typography>
            <Typography variant="caption" sx={{ color: netSavings >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) + '% Saved' : 'No Income'}
            </Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>🧾 Transaction Log</Typography>
          </Box>
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
                  <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTx.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No transactions for {selectedPeriod}. Click <strong>"+ Add Transaction"</strong> to log!
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
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{t.description}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => { setEditingTx(t); setActiveModal('add-transaction'); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(t)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteTransaction(deleteTarget.id)}
        label={deleteTarget ? `transaction "${deleteTarget.category} (${deleteTarget.date})"` : ''}
      />
    </Box>
  );
};

export default CashFlowView;
