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
  LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const BillsView = () => {
  const { data, setActiveModal, setEditingBill, deleteBill } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const billsWithMetrics = data.bills.map((b) => {
    const start = b.startDate ? new Date(b.startDate) : null;
    const end = b.endDate ? new Date(b.endDate) : null;

    let totalDays = 30;
    let daysRemaining = 0;
    let progress = 0;
    let isExpired = false;
    let isDueSoon = false;

    if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
      totalDays = Math.max(Math.ceil((end - start) / (1000 * 60 * 60 * 24)), 1);
      daysRemaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      const elapsed = Math.max(Math.ceil((today - start) / (1000 * 60 * 60 * 24)), 0);
      progress = Math.min(Math.max((elapsed / totalDays) * 100, 0), 100);
      isExpired = daysRemaining < 0;
      isDueSoon = daysRemaining >= 0 && daysRemaining <= 7;
    }

    return {
      ...b,
      totalDays,
      daysRemaining,
      progress,
      isExpired,
      isDueSoon
    };
  });

  const activeBills = billsWithMetrics.filter((b) => b.status === 'ACTIVE' && !b.isExpired);
  const expiringSoonBills = billsWithMetrics.filter((b) => b.status === 'ACTIVE' && b.isDueSoon);
  const expiredBills = billsWithMetrics.filter((b) => b.status === 'EXPIRED' || b.isExpired);

  const totalMonthlyCommitments = activeBills.reduce((s, b) => s + (parseFloat(b.amount) || 0), 0);
  const totalAllBillsCost = billsWithMetrics.reduce((s, b) => s + (parseFloat(b.amount) || 0), 0);

  const getStatusColor = (status, isExpired, isDueSoon) => {
    if (status === 'CANCELLED') return 'default';
    if (status === 'PAUSED') return 'warning';
    if (status === 'EXPIRED' || isExpired) return 'error';
    if (isDueSoon) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            🔄 Bills & Subscriptions Tracker
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Track recurring OTT platforms, utilities, SaaS software, rent, and duration between Start & End Dates
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setActiveModal('add-bill')}
          sx={{ background: 'linear-gradient(135deg, #38bdf8, #0284c7)', fontWeight: 700 }}
        >
          + Add Bill / Subscription
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Active Subscriptions Cost
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>
                {formatCurrency(totalMonthlyCommitments)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>
                {activeBills.length} Active Services
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Tracked Services
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>
                {data.bills.length}
              </Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                Total: {formatCurrency(totalAllBillsCost)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Expiring Soon (≤ 7 Days)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: expiringSoonBills.length > 0 ? '#f59e0b' : '#10b981', my: 0.5 }}>
                {expiringSoonBills.length}
              </Typography>
              <Typography variant="caption" sx={{ color: expiringSoonBills.length > 0 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>
                {expiringSoonBills.length > 0 ? 'Action required for renewal' : 'All subscriptions healthy'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Expired / Inactive
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: expiredBills.length > 0 ? '#ef4444' : '#94a3b8', my: 0.5 }}>
                {expiredBills.length}
              </Typography>
              <Typography variant="caption" sx={{ color: expiredBills.length > 0 ? '#ef4444' : '#94a3b8', fontWeight: 600 }}>
                Past End Date
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Subscriptions Table */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        📋 Active Subscriptions & Validity Cycles
      </Typography>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Service / Bill Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>End Date / Renewal</TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Cycle & Validity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billsWithMetrics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      No subscriptions or bills added yet. Click <strong>"+ Add Bill / Subscription"</strong> to start tracking!
                    </TableCell>
                  </TableRow>
                ) : (
                  billsWithMetrics.map((b) => {
                    const color = getStatusColor(b.status, b.isExpired, b.isDueSoon);
                    return (
                      <TableRow key={b.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {b.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={b.category} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.75rem' }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#38bdf8', fontFamily: 'JetBrains Mono' }}>
                          {formatCurrency(b.amount)}
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                          {b.startDate || '—'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {b.endDate || '—'}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                                {b.isExpired
                                  ? `Expired ${Math.abs(b.daysRemaining)}d ago`
                                  : b.daysRemaining === 0
                                  ? 'Renews Today'
                                  : `${b.daysRemaining} days left`}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                                {b.totalDays}d cycle
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={b.progress}
                              color={color === 'default' ? 'inherit' : color}
                              sx={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={b.isExpired ? 'EXPIRED' : b.status}
                            size="small"
                            color={color}
                            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit Subscription">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                setEditingBill(b);
                                setActiveModal('add-bill');
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Subscription">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteTarget(b)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteBill(deleteTarget.id)}
        label={deleteTarget ? `subscription "${deleteTarget.name}"` : ''}
      />
    </Box>
  );
};

export default BillsView;
