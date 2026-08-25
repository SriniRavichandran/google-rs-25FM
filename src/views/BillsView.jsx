import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useFinance } from '../context/FinanceContext.jsx';

const BillsView = () => {
  const { data, setActiveModal, setEditingBill, deleteBill } = useFinance();

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const totalMonthlyBills = data.bills.reduce((s, b) => s + (parseFloat(b.amount) || 0), 0);
  const totalPaid = data.bills.filter(b => b.status === 'PAID').reduce((s, b) => s + (parseFloat(b.amount) || 0), 0);
  const totalDue = data.bills.filter(b => b.status === 'DUE').reduce((s, b) => s + (parseFloat(b.amount) || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            🔄 Recurring Bills & Subscriptions
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Track monthly utilities, OTT subscriptions, rent, insurance, and due dates
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-bill')}>
          + Add Bill / Subscription
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Monthly Commitments</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalMonthlyBills)}</Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>{data.bills.length} Active Services</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Paid Bills</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalPaid)}</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Cleared for month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Upcoming Dues</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{formatCurrency(totalDue)}</Typography>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>Pending Payment</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bills Cards Grid */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📋 Subscriptions & Utilities List</Typography>
      <Grid container spacing={2.5}>
        {data.bills.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>No recurring bills added yet.</Typography>
              <Button variant="contained" color="primary" onClick={() => setActiveModal('add-bill')}>+ Add Bill / Subscription</Button>
            </Card>
          </Grid>
        ) : data.bills.map(b => (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
            <Card sx={{ borderLeft: `4px solid ${b.status === 'PAID' ? '#10b981' : '#ef4444'}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{b.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{b.category} • Due Day {b.dueDate}</Typography>
                  </Box>
                  <Chip label={b.status} size="small" color={b.status === 'PAID' ? 'success' : 'error'} sx={{ fontWeight: 700 }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#38bdf8' }}>{formatCurrency(b.amount)}</Typography>
                  <Box>
                    <Tooltip title="Edit Bill">
                      <IconButton size="small" color="primary" onClick={() => { setEditingBill(b); setActiveModal('add-bill'); }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Bill">
                      <IconButton size="small" color="error" onClick={() => deleteBill(b.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BillsView;
