import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip,
  Button, IconButton, Tooltip, Table, TableHead,
  TableBody, TableCell, TableRow, TableContainer, Paper,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const BankAccountsView = () => {
  const {
    data,
    totalBankBalance,
    setActiveModal,
    deleteBankAccount,
    setEditingBankAccount
  } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [displayMode, setDisplayMode] = useState('both'); // 'both', 'cards', 'table'

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>🏦 Debit Cards & Bank Accounts</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Track liquid cash, bank balances, savings, and debit card accounts</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            size="small"
            value={displayMode}
            exclusive
            onChange={(e, val) => val && setDisplayMode(val)}
            sx={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <ToggleButton value="both"><ViewModuleIcon fontSize="small" sx={{ mr: 0.5 }} /> Cards + Table</ToggleButton>
            <ToggleButton value="cards"><ViewModuleIcon fontSize="small" sx={{ mr: 0.5 }} /> Cards Only</ToggleButton>
            <ToggleButton value="table"><ViewListIcon fontSize="small" sx={{ mr: 0.5 }} /> Table Only</ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingBankAccount(null); setActiveModal('add-bank-account'); }}>
            Add Bank Account
          </Button>
        </Box>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Liquid Balance</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalBankBalance)}</Typography>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Available Cash</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Bank Accounts</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{data.bankAccounts.length}</Typography>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Active Accounts</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Avg Balance / Account</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', my: 0.5 }}>{formatCurrency(data.bankAccounts.length ? totalBankBalance / data.bankAccounts.length : 0)}</Typography>
            <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600 }}>Balanced Reserve</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Visual Debit & Bank Account Cards Grid View */}
      {(displayMode === 'both' || displayMode === 'cards') && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            🏦 Registered Bank & Debit Card Accounts (Visual Grid)
          </Typography>
          {data.bankAccounts.length === 0 ? (
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>No bank accounts added yet.</Typography>
              <Button variant="contained" color="primary" onClick={() => { setEditingBankAccount(null); setActiveModal('add-bank-account'); }}>Add Bank Account</Button>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {data.bankAccounts.map((a) => (
                <Grid item xs={12} sm={6} md={4} key={a.id}>
                  <Card
                    sx={{
                      height: '100%',
                      position: 'relative',
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.95))',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      overflow: 'hidden'
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      {/* Card Top Header with Bank & Action Icons */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#10b981', letterSpacing: 0.5 }}>
                            {a.bank}
                          </Typography>
                          <Chip label={a.type} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.68rem', height: 20 }} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit Bank Account">
                            <IconButton
                              size="small"
                              sx={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', '&:hover': { background: 'rgba(16, 185, 129, 0.25)' } }}
                              onClick={() => {
                                setEditingBankAccount(a);
                                setActiveModal('add-bank-account');
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Bank Account">
                            <IconButton
                              size="small"
                              sx={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.12)', '&:hover': { background: 'rgba(239, 68, 68, 0.25)' } }}
                              onClick={() => setDeleteTarget(a)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Account Name */}
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, fontSize: '1.1rem' }}>
                        {a.name}
                      </Typography>

                      {/* Balance & Account No. */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>Available Balance</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>{formatCurrency(a.balance)}</Typography>
                      </Box>

                      {/* Footer with Masked Account No and Edit Action Button */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          Account: <strong>•••• {a.accountNumber}</strong>
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<EditIcon fontSize="small" />}
                          onClick={() => {
                            setEditingBankAccount(a);
                            setActiveModal('add-bank-account');
                          }}
                          sx={{ fontWeight: 700, textTransform: 'none', py: 0.2 }}
                        >
                          Edit Account
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Accounts Table View */}
      {(displayMode === 'both' || displayMode === 'table') && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>🏦 Registered Bank & Debit Card Accounts (Table View)</Typography>
          <Card sx={{ width: '100%', overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent', width: '100%', overflowX: 'auto' }}>
                <Table sx={{ minWidth: 600 }}>
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
                          No bank accounts added yet. Click <strong>"Add Bank Account"</strong> to begin.
                        </TableCell>
                      </TableRow>
                    ) : data.bankAccounts.map((a, idx) => (
                      <TableRow key={a.id} hover>
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
                              onClick={() => {
                                setEditingBankAccount(a);
                                setActiveModal('add-bank-account');
                              }}
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
                                onClick={() => setDeleteTarget(a)}
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
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteBankAccount(deleteTarget.id)}
        label={deleteTarget ? `bank account "${deleteTarget.name}"` : ''}
      />
    </Box>
  );
};

export default BankAccountsView;
