import React, { useState } from 'react';
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
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const LoansTakenView = () => {
  const { data, totalLoansTaken, setActiveModal, deleteLoanTaken, setEditingLoanTaken } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const totalPrincipal = data.loansTaken.reduce((s, l) => s + (parseFloat(l.amountTaken) || 0), 0);
  const totalRepaid = data.loansTaken.reduce((s, l) => s + (parseFloat(l.amountRepaid) || 0), 0);

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            💸 Loans Taken & Borrowed Liabilities
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Track personal loans, bank loans, money borrowed from others, interest rates, and payoff progress
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingLoanTaken(null); setActiveModal('add-loan-taken'); }}>
          Add Loan Taken
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Borrowed Principal</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{formatCurrency(totalPrincipal)}</Typography>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>Total Debt Incurred</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Outstanding Debt Remaining</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{formatCurrency(totalLoansTaken)}</Typography>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>{data.loansTaken.length} Active Debts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Debt Repaid</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalRepaid)}</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Paid Off Funds</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Payoff Progress %</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{totalPrincipal > 0 ? ((totalRepaid / totalPrincipal) * 100).toFixed(1) : '0.0'}%</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Debt Repayment</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      <Card sx={{ width: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent', width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ fontWeight: 700, width: 60, whiteSpace: 'nowrap' }}>S.No</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Lender / Bank Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Amount Borrowed</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Interest Rate (%)</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Date Taken</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Amount Repaid</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Outstanding Debt</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.loansTaken.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No borrowed loans recorded. Click <strong>"Add Loan Taken"</strong> to track liabilities!
                    </TableCell>
                  </TableRow>
                ) : data.loansTaken.map((l, idx) => {
                  const outstanding = parseFloat(l.outstandingBalance) || (parseFloat(l.amountTaken) - (parseFloat(l.amountRepaid) || 0));
                  const isPaid = outstanding <= 0;
                  return (
                    <TableRow key={l.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap' }}>{idx + 1}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>{l.lenderName}</strong></TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(l.amountTaken)}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{l.interestRate || 0}%</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{l.dateTaken}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{l.dueDate || 'No Due Date'}</TableCell>
                      <TableCell sx={{ color: '#10b981', whiteSpace: 'nowrap' }}>{formatCurrency(l.amountRepaid || 0)}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: isPaid ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>{formatCurrency(outstanding)}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip label={isPaid ? 'PAID OFF' : 'ACTIVE DEBT'} size="small" color={isPaid ? 'success' : 'error'} sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="Edit Borrowed Debt Loan">
                            <IconButton
                              size="small"
                              sx={{
                                color: '#38bdf8',
                                background: 'rgba(56, 189, 248, 0.15)',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                '&:hover': { background: 'rgba(56, 189, 248, 0.3)' }
                              }}
                              onClick={() => { setEditingLoanTaken(l); setActiveModal('add-loan-taken'); }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Borrowed Debt Loan">
                            <IconButton
                              size="small"
                              sx={{
                                color: '#ef4444',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                '&:hover': { background: 'rgba(239, 68, 68, 0.3)' }
                              }}
                              onClick={() => setDeleteTarget(l)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteLoanTaken(deleteTarget.id)}
        label={deleteTarget ? `loan taken from "${deleteTarget.lenderName}"` : ''}
      />
    </Box>
  );
};

export default LoansTakenView;
