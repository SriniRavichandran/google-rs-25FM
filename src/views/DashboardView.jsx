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
    <Box sx={{ p: 3 }}>
      {/* Hero Banner */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.1))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, py: 2.5 }}>
          <img src="RS-25F Mind.png" alt="RS-25F MIND Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              RS-25F MIND Personal Finance Tracker
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              SMART FINANCE. BETTER LIFE. | Track. Plan. Save. Invest. Grow.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Net Worth
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>
                {formatCurrency(netWorth)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                Liquid + Investments + Loans - Debt
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Savings Rate ({selectedPeriod.toUpperCase()})
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', my: 0.5 }}>
                {savingsRate.toFixed(1)}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                Target: 30%+
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Liquid Cash Balance (Debit)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>
                {formatCurrency(totalBankBalance)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>
                Available Reserve
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Money Owed (Given Loan)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>
                {formatCurrency(totalLoansGiven)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                Lent Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Borrowed Debt (Taken Loan)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>
                {formatCurrency(totalLoansTaken)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                Payoff Dues
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-transaction')}>
          + Add Row / Amount
        </Button>
        <Button variant="outlined" color="inherit" onClick={() => setActiveModal('add-credit-card')}>+ Add Credit Card</Button>
        <Button variant="outlined" color="inherit" onClick={() => setActiveModal('add-bank-account')}>+ Add Bank Account</Button>
        <Button variant="outlined" color="inherit" onClick={() => setActiveModal('add-transaction')}>+ Add Transaction</Button>
        <Button variant="outlined" color="inherit" onClick={() => setActiveModal('add-trade')}>+ Log Trade / Asset</Button>
        <Button variant="outlined" color="inherit" onClick={() => setActiveModal('add-loan-given')}>+ Add Loan Given</Button>
        <Button variant="outlined" color="inherit" onClick={() => setActiveModal('add-loan-taken')}>+ Add Loan Taken</Button>
      </Box>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                🧾 Live Transaction Log ({selectedPeriod.toUpperCase()})
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Direct live sync & edit to Google Sheet1 / Cash
              </Typography>
            </Box>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Payment Method</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Account</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTx.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No records found for {selectedPeriod}. Click <strong>"+ Add Row / Amount"</strong> to add an entry!
                    </TableCell>
                  </TableRow>
                ) : filteredTx.map((t) => (
                  <TableRow key={t.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell><strong>{t.category}</strong></TableCell>
                    <TableCell>
                      <Chip
                        label={t.type.toUpperCase()}
                        size="small"
                        color={t.type === 'income' ? 'success' : t.type === 'expense' ? 'error' : 'info'}
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: t.type === 'income' ? '#10b981' : '#ef4444' }}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </TableCell>
                    <TableCell>{t.paymentMethod}</TableCell>
                    <TableCell>{t.account}</TableCell>
                    <TableCell align="right">
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
