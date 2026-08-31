import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const DashboardView = () => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState('tx'); // 'tx', 'card', 'bank', 'trade'
  const [activeTab, setActiveTab] = useState('cash');

  const {
    data,
    netWorth,
    savingsRate,
    totalBankBalance,
    totalLoansGiven,
    totalLoansTaken,
    selectedPeriod,
    filteredTx,
    setActiveModal,
    setEditingTx,
    setEditingCreditCard,
    setEditingBankAccount,
    setEditingTrade,
    setEditingLoanGiven,
    setEditingLoanTaken,
    deleteTransaction,
    deleteCreditCard,
    deleteBankAccount,
    deleteTrade
  } = useFinance();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteType === 'tx') deleteTransaction(deleteTarget.id);
    else if (deleteType === 'card') deleteCreditCard(deleteTarget.id);
    else if (deleteType === 'bank') deleteBankAccount(deleteTarget.id);
    else if (deleteType === 'trade') deleteTrade(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Hero Banner */}
      <Card sx={{ mb: 2, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.1))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
          <img src="RS-25F Mind.png" alt="RS-25F MIND Logo" style={{ width: 42, height: 42, objectFit: 'contain' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '0.95rem', sm: '1.3rem', md: '1.5rem' }, background: 'linear-gradient(135deg, #10b981, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
              RS-25F MIND Personal Finance Tracker
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.85rem' } }}>
              SMART FINANCE. BETTER LIFE. | Track. Save. Invest.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Metrics Grid (2 per row on mobile xs={6}) */}
      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        <Grid item xs={6} sm={6} md={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Total Net Worth
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5, fontSize: { xs: '1.05rem', sm: '1.35rem', md: '1.5rem' } }}>
                {formatCurrency(netWorth)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, fontSize: { xs: '0.62rem', sm: '0.72rem' }, display: 'block' }}>
                Liquid + Invested - Debt
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Savings Rate ({selectedPeriod.toUpperCase()})
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', my: 0.5, fontSize: { xs: '1.05rem', sm: '1.35rem', md: '1.5rem' } }}>
                {savingsRate.toFixed(1)}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600, fontSize: { xs: '0.62rem', sm: '0.72rem' }, display: 'block' }}>
                Target: 30%+
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Liquid Cash (Debit)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5, fontSize: { xs: '1.05rem', sm: '1.35rem', md: '1.5rem' } }}>
                {formatCurrency(totalBankBalance)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600, fontSize: { xs: '0.62rem', sm: '0.72rem' }, display: 'block' }}>
                Available Reserve
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Money Owed (Loan)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5, fontSize: { xs: '1.05rem', sm: '1.35rem', md: '1.5rem' } }}>
                {formatCurrency(totalLoansGiven)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, fontSize: { xs: '0.62rem', sm: '0.72rem' }, display: 'block' }}>
                Lent Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Borrowed Debt
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5, fontSize: { xs: '1.05rem', sm: '1.35rem', md: '1.5rem' } }}>
                {formatCurrency(totalLoansTaken)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, fontSize: { xs: '0.62rem', sm: '0.72rem' }, display: 'block' }}>
                Payoff Dues
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Add Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        <Button size="small" variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingTx(null); setActiveModal('add-transaction'); }}>
          Add Transaction (Cash)
        </Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => { setEditingCreditCard(null); setActiveModal('add-credit-card'); }}>Add Credit Card</Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => { setEditingBankAccount(null); setActiveModal('add-bank-account'); }}>Add Bank Account (Debit)</Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => { setEditingTrade(null); setActiveModal('add-trade'); }}>Log Trade / Asset</Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => { setEditingLoanGiven(null); setActiveModal('add-loan-given'); }}>Add Loan Given</Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => { setEditingLoanTaken(null); setActiveModal('add-loan-taken'); }}>Add Loan Taken</Button>
      </Box>

      {/* Multi-Tab Financial Data Manager */}
      <Card sx={{ width: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1.5, sm: 2 } }}>
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': { fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem' }, py: 1.5 }
              }}
            >
              <Tab value="cash" label={`💵 Cash & Transactions (${filteredTx.length})`} />
              <Tab value="credit" label={`💳 Credit Cards (${data.creditCards.length})`} />
              <Tab value="debit" label={`🏦 Bank Accounts & Debit (${data.bankAccounts.length})`} />
              <Tab value="trade" label={`📈 Trade & Assets (${data.investments.length})`} />
            </Tabs>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent', width: '100%', overflowX: 'auto' }}>
            {activeTab === 'cash' && (
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
                        No transaction records found for {selectedPeriod}. Click <strong>"Add Transaction (Cash)"</strong> to add an entry!
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon fontSize="small" />}
                            onClick={() => { setEditingTx(t); setActiveModal('add-transaction'); }}
                            sx={{
                              color: '#38bdf8',
                              borderColor: 'rgba(56, 189, 248, 0.5)',
                              background: 'rgba(56, 189, 248, 0.1)',
                              '&:hover': {
                                borderColor: '#38bdf8',
                                background: 'rgba(56, 189, 248, 0.25)'
                              },
                              fontWeight: 700,
                              textTransform: 'none',
                              px: 1.2,
                              py: 0.3
                            }}
                          >
                            Edit
                          </Button>
                          <Tooltip title="Delete Cash Transaction">
                            <IconButton
                              size="small"
                              sx={{
                                color: '#ef4444',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                '&:hover': { background: 'rgba(239, 68, 68, 0.25)' }
                              }}
                              onClick={() => { setDeleteTarget(t); setDeleteType('tx'); }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {activeTab === 'credit' && (
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                    <TableCell sx={{ fontWeight: 700, width: 60, whiteSpace: 'nowrap' }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Card Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Bank • Network</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Total Limit</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Outstanding</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Utilization</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Due Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.creditCards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No credit cards logged. Click <strong>"Add Credit Card"</strong> to register!
                      </TableCell>
                    </TableRow>
                  ) : data.creditCards.map((c, idx) => {
                    const util = c.limit > 0 ? (c.outstanding / c.limit) * 100 : 0;
                    return (
                      <TableRow key={c.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap' }}>{idx + 1}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>{c.name}</strong></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{c.bank} • {c.network}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(c.limit)}</TableCell>
                        <TableCell sx={{ color: '#ef4444', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatCurrency(c.outstanding)}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Chip label={`${util.toFixed(1)}%`} size="small" color={util > 50 ? 'error' : 'success'} sx={{ fontWeight: 700 }} />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Day {c.dueDate}</TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditIcon fontSize="small" />}
                              onClick={() => { setEditingCreditCard(c); setActiveModal('add-credit-card'); }}
                              sx={{
                                color: '#38bdf8',
                                borderColor: 'rgba(56, 189, 248, 0.5)',
                                background: 'rgba(56, 189, 248, 0.1)',
                                '&:hover': {
                                  borderColor: '#38bdf8',
                                  background: 'rgba(56, 189, 248, 0.25)'
                                },
                                fontWeight: 700,
                                textTransform: 'none',
                                px: 1.2,
                                py: 0.3
                              }}
                            >
                              Edit
                            </Button>
                            <Tooltip title="Delete Credit Card">
                              <IconButton
                                size="small"
                                sx={{
                                  color: '#ef4444',
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  '&:hover': { background: 'rgba(239, 68, 68, 0.25)' }
                                }}
                                onClick={() => { setDeleteTarget(c); setDeleteType('card'); }}
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
            )}

            {activeTab === 'debit' && (
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                    <TableCell sx={{ fontWeight: 700, width: 60, whiteSpace: 'nowrap' }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Account Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Bank</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Account No.</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Balance</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.bankAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No bank accounts logged. Click <strong>"Add Bank Account (Debit)"</strong> to register!
                      </TableCell>
                    </TableRow>
                  ) : data.bankAccounts.map((a, idx) => (
                    <TableRow key={a.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap' }}>{idx + 1}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>{a.name}</strong></TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{a.bank}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}><Chip label={a.type} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>**** {a.accountNumber}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#10b981', whiteSpace: 'nowrap' }}>{formatCurrency(a.balance)}</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon fontSize="small" />}
                            onClick={() => { setEditingBankAccount(a); setActiveModal('add-bank-account'); }}
                            sx={{
                              color: '#38bdf8',
                              borderColor: 'rgba(56, 189, 248, 0.5)',
                              background: 'rgba(56, 189, 248, 0.1)',
                              '&:hover': {
                                borderColor: '#38bdf8',
                                background: 'rgba(56, 189, 248, 0.25)'
                              },
                              fontWeight: 700,
                              textTransform: 'none',
                              px: 1.2,
                              py: 0.3
                            }}
                          >
                            Edit
                          </Button>
                          <Tooltip title="Delete Bank Account">
                            <IconButton
                              size="small"
                              sx={{
                                color: '#ef4444',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                '&:hover': { background: 'rgba(239, 68, 68, 0.25)' }
                              }}
                              onClick={() => { setDeleteTarget(a); setDeleteType('bank'); }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {activeTab === 'trade' && (
              <Table sx={{ minWidth: 750 }}>
                <TableHead>
                  <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                    <TableCell sx={{ fontWeight: 700, width: 60, whiteSpace: 'nowrap' }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Asset Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Qty</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Buy Price</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Current Price</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Current Value</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>P&L</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.investments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No trade positions logged. Click <strong>"Log Trade / Asset"</strong> to register!
                      </TableCell>
                    </TableRow>
                  ) : data.investments.map((inv, idx) => {
                    const itemPnL = inv.currentValue - inv.investedAmount;
                    const itemRoi = inv.investedAmount > 0 ? (itemPnL / inv.investedAmount) * 100 : 0;
                    return (
                      <TableRow key={inv.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap' }}>{idx + 1}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>{inv.name}</strong></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}><Chip label={inv.type} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}><Chip label={inv.action || 'BUY'} size="small" color="info" sx={{ fontWeight: 700 }} /></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{inv.quantity}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(inv.buyPrice)}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(inv.currentPrice)}</TableCell>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{formatCurrency(inv.currentValue)}</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: itemPnL >= 0 ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>
                          {itemPnL >= 0 ? '+' : ''}{formatCurrency(itemPnL)} ({itemRoi.toFixed(1)}%)
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditIcon fontSize="small" />}
                              onClick={() => { setEditingTrade(inv); setActiveModal('add-trade'); }}
                              sx={{
                                color: '#38bdf8',
                                borderColor: 'rgba(56, 189, 248, 0.5)',
                                background: 'rgba(56, 189, 248, 0.1)',
                                '&:hover': {
                                  borderColor: '#38bdf8',
                                  background: 'rgba(56, 189, 248, 0.25)'
                                },
                                fontWeight: 700,
                                textTransform: 'none',
                                px: 1.2,
                                py: 0.3
                              }}
                            >
                              Edit
                            </Button>
                            <Tooltip title="Delete Trade / Asset">
                              <IconButton
                                size="small"
                                sx={{
                                  color: '#ef4444',
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  '&:hover': { background: 'rgba(239, 68, 68, 0.25)' }
                                }}
                                onClick={() => { setDeleteTarget(inv); setDeleteType('trade'); }}
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
            )}
          </TableContainer>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        label={
          deleteTarget
            ? deleteType === 'tx'
              ? `transaction "${deleteTarget.category} (${deleteTarget.date})"`
              : deleteType === 'card'
              ? `credit card "${deleteTarget.name}"`
              : deleteType === 'bank'
              ? `bank account "${deleteTarget.name}"`
              : `trade asset "${deleteTarget.name}"`
            : ''
        }
      />
    </Box>
  );
};

export default DashboardView;
