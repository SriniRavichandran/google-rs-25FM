import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip,
  Button, IconButton, Tooltip, Table, TableHead,
  TableBody, TableCell, TableRow, TableContainer, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const BankAccountsView = () => {
  const { data, totalBankBalance, setActiveModal, deleteTransaction } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>🏦 Debit Cards & Bank Accounts</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Track liquid cash, bank balances, savings, and debit card accounts</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-bank-account')}>
          + Add Bank Account
        </Button>
      </Box>

      {/* Metrics */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Liquid Balance</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalBankBalance)}</Typography>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Available Cash</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Bank Accounts</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{data.bankAccounts.length}</Typography>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Active Accounts</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Avg Balance / Account</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', my: 0.5 }}>{formatCurrency(data.bankAccounts.length ? totalBankBalance / data.bankAccounts.length : 0)}</Typography>
            <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600 }}>Balanced Reserve</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Accounts Table */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>🏦 Registered Bank & Debit Card Accounts</Typography>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Account Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Bank</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Account No.</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Balance</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.bankAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No bank accounts added yet. <strong>+ Add Bank Account</strong> to begin.
                    </TableCell>
                  </TableRow>
                ) : data.bankAccounts.map(a => (
                  <TableRow key={a.id} hover>
                    <TableCell><strong>{a.name}</strong></TableCell>
                    <TableCell>{a.bank}</TableCell>
                    <TableCell><Chip label={a.type} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                    <TableCell>**** {a.accountNumber}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#10b981' }}>{formatCurrency(a.balance)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete Account">
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(a)}>
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
        label={deleteTarget ? `bank account "${deleteTarget.name}"` : ''}
      />
    </Box>
  );
};

export default BankAccountsView;
