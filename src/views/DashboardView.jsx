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
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const DashboardView = () => {
  const [
    deleteTarget, setDeleteTarget
  ] = React.useState(null);

  const {
    netWorth,
    savingsRate,
    totalBankBalance,
    totalLoansGiven,
    totalLoansTaken,
    selectedPeriod,
    filteredTx,
    setActiveModal,
    setEditingTx,
    deleteTransaction
  } = useFinance();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
      {/* Hero Banner */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.1))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, py: 2.5 }}>
          <img src="RS-25F Mind.png" alt="RS-25F MIND Logo" style={{ width: 56, height: 56, objectFit: 'contain' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.15rem', sm: '1.5rem' }, background: 'linear-gradient(135deg, #10b981, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              RS-25F MIND Personal Finance Tracker
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
              SMART FINANCE. BETTER LIFE. | Track. Plan. Save. Invest. Grow.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Net Worth
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5, fontSize: { xs: '1.35rem', sm: '1.5rem' } }}>
                {formatCurrency(netWorth)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.72rem' }}>
                Liquid + Invested + Loans - Debt
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Savings Rate ({selectedPeriod.toUpperCase()})
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', my: 0.5, fontSize: { xs: '1.35rem', sm: '1.5rem' } }}>
                {savingsRate.toFixed(1)}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.72rem' }}>
                Target: 30%+
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Liquid Cash Balance (Debit)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5, fontSize: { xs: '1.35rem', sm: '1.5rem' } }}>
                {formatCurrency(totalBankBalance)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.72rem' }}>
                Available Reserve
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Money Owed (Given Loan)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5, fontSize: { xs: '1.35rem', sm: '1.5rem' } }}>
                {formatCurrency(totalLoansGiven)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.72rem' }}>
                Lent Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Borrowed Debt (Taken Loan)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5, fontSize: { xs: '1.35rem', sm: '1.5rem' } }}>
                {formatCurrency(totalLoansTaken)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, fontSize: '0.72rem' }}>
                Payoff Dues
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        <Button size="small" variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingTx(null); setActiveModal('add-transaction'); }}>
          Add Row / Amount
        </Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => { setActiveModal('add-credit-card'); }}>Add Credit Card</Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => { setActiveModal('add-bank-account'); }}>Add Bank Account</Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => { setEditingTx(null); setActiveModal('add-transaction'); }}>Add Transaction</Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => { setActiveModal('add-trade'); }}>Log Trade / Asset</Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => { setActiveModal('add-loan-given'); }}>Add Loan Given</Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => { setActiveModal('add-loan-taken'); }}>Add Loan Taken</Button>
      </Box>

      {/* Table */}
      <Card sx={{ width: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                🧾 Live Transaction Log ({selectedPeriod.toUpperCase()})
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Direct live sync & edit to Google Sheet1 / Cash
              </Typography>
            </Box>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent', width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ fontWeight: 700, width: 60, whiteSpace: 'nowrap' }}>S.No</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Payment Method</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Account</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTx.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No records found for {selectedPeriod}. Click <strong>"Add Row / Amount"</strong> to add an entry!
                    </TableCell>
                  </TableRow>
                ) : filteredTx.map((t, idx) => (
                  <TableRow key={t.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap' }}>{idx + 1}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{t.date}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>{t.category}</strong></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Chip
                        label={t.type.toUpperCase()}
                        size="small"
                        color={t.type === 'income' ? 'success' : t.type === 'expense' ? 'error' : 'info'}
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: t.type === 'income' ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{t.paymentMethod}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{t.account}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title="Edit Row">
                        <IconButton size="small" color="primary" onClick={() => { setEditingTx(t); setActiveModal('add-transaction'); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Row">
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

export default DashboardView;
