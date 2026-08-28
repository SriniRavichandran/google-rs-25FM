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

const LoansGivenView = () => {
  const { data, totalLoansGiven, setActiveModal, deleteLoanGiven, setEditingLoanGiven } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const totalPrincipal = data.loansGiven.reduce((s, l) => s + (parseFloat(l.amountGiven) || 0), 0);
  const totalRepaid = data.loansGiven.reduce((s, l) => s + (parseFloat(l.amountRepaid) || 0), 0);

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            🤝 Loans Given & Money Owed to Me
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Track money lent to friends/family/business, interest terms, repayment status, and outstanding dues
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingLoanGiven(null); setActiveModal('add-loan-given'); }}>
          Add Loan Given
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Principal Given</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalPrincipal)}</Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Capital Lent</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Outstanding Owed to Me</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalLoansGiven)}</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>{data.loansGiven.length} Active Loans</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Amount Repaid</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', my: 0.5 }}>{formatCurrency(totalRepaid)}</Typography>
              <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600 }}>Recovered Funds</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Recovery Rate %</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{totalPrincipal > 0 ? ((totalRepaid / totalPrincipal) * 100).toFixed(1) : '0.0'}%</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Repayment Progress</Typography>
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
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Borrower Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Amount Given</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Interest Rate (%)</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Date Given</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Repaid Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Outstanding Owed</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.loansGiven.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No loans recorded. Click <strong>"Add Loan Given"</strong> to track money lent!
                    </TableCell>
                  </TableRow>
                ) : data.loansGiven.map((l, idx) => {
                  const outstanding = parseFloat(l.outstandingOwed) || (parseFloat(l.amountGiven) - (parseFloat(l.amountRepaid) || 0));
                  const isPaid = outstanding <= 0;
                  return (
                    <TableRow key={l.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap' }}>{idx + 1}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>{l.borrowerName}</strong></TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(l.amountGiven)}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{l.interestRate || 0}%</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{l.dateGiven}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{l.dueDate || 'No Due Date'}</TableCell>
                      <TableCell sx={{ color: '#10b981', whiteSpace: 'nowrap' }}>{formatCurrency(l.amountRepaid || 0)}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: isPaid ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>{formatCurrency(outstanding)}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip label={isPaid ? 'REPAID' : 'ACTIVE'} size="small" color={isPaid ? 'success' : 'error'} sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="Edit Loan Given">
                            <IconButton
                              size="small"
                              sx={{
                                color: '#38bdf8',
                                background: 'rgba(56, 189, 248, 0.15)',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                '&:hover': { background: 'rgba(56, 189, 248, 0.3)' }
                              }}
                              onClick={() => { setEditingLoanGiven(l); setActiveModal('add-loan-given'); }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Loan Given">
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
        onConfirm={() => deleteTarget && deleteLoanGiven(deleteTarget.id)}
        label={deleteTarget ? `loan given to "${deleteTarget.borrowerName}"` : ''}
      />
    </Box>
  );
};

export default LoansGivenView;
