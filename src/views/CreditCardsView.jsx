import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip,
  Button, IconButton, Tooltip, Table, TableHead,
  TableBody, TableCell, TableRow, TableContainer, Paper,
  LinearProgress, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const CreditCardsView = () => {
  const {
    data,
    totalCreditLimit,
    totalCreditOutstanding,
    creditUtil,
    setActiveModal,
    deleteCreditCard,
    setEditingCreditCard
  } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [displayMode, setDisplayMode] = useState('both'); // 'both', 'cards', 'table'

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>💳 Credit Card Usage & Limit Health</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Track total limits, outstanding dues, utilization %, and billing cycles</Typography>
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
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingCreditCard(null); setActiveModal('add-credit-card'); }}>
            Add Credit Card
          </Button>
        </Box>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Credit Limit</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalCreditLimit)}</Typography>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Across {data.creditCards.length} Cards</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Outstanding Dues</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{formatCurrency(totalCreditOutstanding)}</Typography>
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>Due for payment</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Available Credit</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalCreditLimit - totalCreditOutstanding)}</Typography>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Ready to use</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Utilization Rate</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: creditUtil > 50 ? '#ef4444' : '#10b981', my: 0.5 }}>{creditUtil.toFixed(1)}%</Typography>
            <Typography variant="caption" sx={{ color: creditUtil > 50 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
              {creditUtil < 30 ? 'Optimal' : creditUtil < 50 ? 'Moderate' : 'High Alert'}
            </Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Visual Credit Cards Grid View */}
      {(displayMode === 'both' || displayMode === 'cards') && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            💳 Registered Credit Cards (Visual Grid)
          </Typography>
          {data.creditCards.length === 0 ? (
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>No credit cards added yet.</Typography>
              <Button variant="contained" color="primary" onClick={() => { setEditingCreditCard(null); setActiveModal('add-credit-card'); }}>Add Credit Card</Button>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {data.creditCards.map((c) => {
                const util = c.limit > 0 ? (c.outstanding / c.limit) * 100 : 0;
                return (
                  <Grid item xs={12} sm={6} md={4} key={c.id}>
                    <Card
                      sx={{
                        height: '100%',
                        position: 'relative',
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        overflow: 'hidden'
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        {/* Top Bar with Bank & Edit/Delete Action Icons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#38bdf8', letterSpacing: 0.5 }}>
                              {c.bank}
                            </Typography>
                            <Chip label={c.network || 'Visa'} size="small" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.68rem', height: 20 }} />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Edit Credit Card">
                              <IconButton
                                size="small"
                                sx={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', '&:hover': { background: 'rgba(56, 189, 248, 0.25)' } }}
                                onClick={() => {
                                  setEditingCreditCard(c);
                                  setActiveModal('add-credit-card');
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Credit Card">
                              <IconButton
                                size="small"
                                sx={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.12)', '&:hover': { background: 'rgba(239, 68, 68, 0.25)' } }}
                                onClick={() => setDeleteTarget(c)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Card Name */}
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, fontSize: '1.1rem' }}>
                          {c.name}
                        </Typography>

                        {/* Numbers */}
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>Outstanding</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 800, color: '#ef4444' }}>{formatCurrency(c.outstanding)}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>Total Limit</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 800, color: '#38bdf8' }}>{formatCurrency(c.limit)}</Typography>
                          </Box>
                        </Box>

                        {/* Utilization Bar */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Utilization</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: util > 50 ? '#ef4444' : '#10b981' }}>{util.toFixed(1)}%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min(util, 100)} color={util > 50 ? 'error' : 'success'} sx={{ height: 6, borderRadius: 3 }} />
                        </Box>

                        {/* Card Footer with Due Date and Edit Action Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Due Day: <strong>Day {c.dueDate}</strong>
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<EditIcon fontSize="small" />}
                            onClick={() => {
                              setEditingCreditCard(c);
                              setActiveModal('add-credit-card');
                            }}
                            sx={{ fontWeight: 700, textTransform: 'none', py: 0.2 }}
                          >
                            Edit Card
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}

      {/* Cards Table View */}
      {(displayMode === 'both' || displayMode === 'table') && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>💳 Registered Credit Cards (Table View)</Typography>
          <Card sx={{ width: '100%', overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent', width: '100%', overflowX: 'auto' }}>
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
                          No credit cards added yet. Click <strong>"Add Credit Card"</strong> to begin.
                        </TableCell>
                      </TableRow>
                    ) : data.creditCards.map((c, idx) => {
                      const util = c.limit > 0 ? (c.outstanding / c.limit) * 100 : 0;
                      return (
                        <TableRow key={c.id} hover>
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
                                onClick={() => {
                                  setEditingCreditCard(c);
                                  setActiveModal('add-credit-card');
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
                              <Tooltip title="Delete Credit Card">
                                <IconButton
                                  size="small"
                                  sx={{
                                    color: '#ef4444',
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    '&:hover': { background: 'rgba(239, 68, 68, 0.25)' }
                                  }}
                                  onClick={() => setDeleteTarget(c)}
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
        </Box>
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteCreditCard(deleteTarget.id)}
        label={deleteTarget ? `credit card "${deleteTarget.name}"` : ''}
      />
    </Box>
  );
};

export default CreditCardsView;
