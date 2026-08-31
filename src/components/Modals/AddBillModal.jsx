import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Box,
  Typography,
  Chip,
  ButtonGroup
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useFinance } from '../../context/FinanceContext.jsx';

const AddBillModal = () => {
  const { activeModal, setActiveModal, editingBill, setEditingBill, addBill, editBill } = useFinance();

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // Helper to compute end date given a start date and cycle key
  const computeEndDate = (startStr, cycleKey) => {
    if (!startStr) return '';
    const d = new Date(startStr);
    if (isNaN(d.getTime())) return '';

    if (cycleKey === '1M') d.setMonth(d.getMonth() + 1);
    else if (cycleKey === '2M') d.setMonth(d.getMonth() + 2);
    else if (cycleKey === '3M') d.setMonth(d.getMonth() + 3);
    else if (cycleKey === '6M') d.setMonth(d.getMonth() + 6);
    else if (cycleKey === '1Y') d.setFullYear(d.getFullYear() + 1);
    else d.setMonth(d.getMonth() + 1);

    return d.toISOString().split('T')[0];
  };

  const defaultForm = {
    name: '',
    category: 'Subscription',
    amount: '',
    billingCycle: '1M',
    startDate: getTodayStr(),
    endDate: computeEndDate(getTodayStr(), '1M'),
    status: 'ACTIVE'
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (editingBill) {
      const initialStart = editingBill.startDate || getTodayStr();
      const initialCycle = editingBill.billingCycle || '1M';
      setFormData({
        name: editingBill.name || '',
        category: editingBill.category || 'Subscription',
        amount: editingBill.amount !== undefined ? editingBill.amount : '',
        billingCycle: initialCycle,
        startDate: initialStart,
        endDate: editingBill.endDate || computeEndDate(initialStart, initialCycle),
        status: editingBill.status || 'ACTIVE'
      });
    } else {
      setFormData(defaultForm);
    }
  }, [editingBill, activeModal]);

  if (activeModal !== 'add-bill') return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingBill(null);
    setFormData(defaultForm);
  };

  const handleCycleChange = (newCycle) => {
    const newEnd = computeEndDate(formData.startDate, newCycle);
    setFormData({
      ...formData,
      billingCycle: newCycle,
      endDate: newEnd
    });
  };

  const handleStartDateChange = (newStart) => {
    const newEnd = computeEndDate(newStart, formData.billingCycle);
    setFormData({
      ...formData,
      startDate: newStart,
      endDate: newEnd
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(formData.amount) || 0;
    const payload = {
      ...formData,
      amount: amt
    };

    if (editingBill) {
      editBill(editingBill.id, payload);
    } else {
      addBill(payload);
    }
    handleClose();
  };

  // Calculate validity duration & days remaining
  const calculateValidity = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    const totalAmt = parseFloat(formData.amount) || 0;
    let monthsInCycle = 1;
    if (formData.billingCycle === '2M') monthsInCycle = 2;
    else if (formData.billingCycle === '3M') monthsInCycle = 3;
    else if (formData.billingCycle === '6M') monthsInCycle = 6;
    else if (formData.billingCycle === '1Y') monthsInCycle = 12;

    const monthlyCost = totalAmt / monthsInCycle;

    return {
      totalDays: totalDays > 0 ? totalDays : 0,
      daysRemaining,
      monthlyCost,
      isExpired: daysRemaining < 0,
      isDueSoon: daysRemaining >= 0 && daysRemaining <= 7
    };
  };

  const validity = calculateValidity();

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(10, 16, 28, 0.97)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 3,
          backdropFilter: 'blur(20px)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutorenewIcon sx={{ color: '#38bdf8' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {editingBill ? '✏️ Edit Subscription / Bill' : '🔄 Add Bill / Subscription Tracker'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Select 1 Month, 2 Months, 3 Months, 6 Months, or 1 Year Subscription Dues
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Bill / Service Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Netflix, Airtel OTT, Wifi Broadband, Gym, House Rent"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="Subscription">Subscription (OTT / Music / Media)</MenuItem>
                  <MenuItem value="SaaS / Software">SaaS / Software / Cloud</MenuItem>
                  <MenuItem value="Internet">Internet / Mobile / Phone</MenuItem>
                  <MenuItem value="Utility">Utility Bill (Power / Water / Gas)</MenuItem>
                  <MenuItem value="Rent">House Rent / Maintenance</MenuItem>
                  <MenuItem value="Gym / Fitness">Gym / Health / Fitness</MenuItem>
                  <MenuItem value="Insurance">Insurance / Policy</MenuItem>
                  <MenuItem value="Other">Other Recurring Service</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Subscription Dues Amount (₹) *"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g. 4000"
                required
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>

            {/* Quick Billing Cycle Selector */}
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 1 }}>
                SUBSCRIPTION CYCLE / DURATION PRESET *
              </Typography>
              <ButtonGroup fullWidth size="small" variant="outlined" sx={{ mb: 1 }}>
                <Button
                  onClick={() => handleCycleChange('1M')}
                  variant={formData.billingCycle === '1M' ? 'contained' : 'outlined'}
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  1 Month
                </Button>
                <Button
                  onClick={() => handleCycleChange('2M')}
                  variant={formData.billingCycle === '2M' ? 'contained' : 'outlined'}
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  2 Months
                </Button>
                <Button
                  onClick={() => handleCycleChange('3M')}
                  variant={formData.billingCycle === '3M' ? 'contained' : 'outlined'}
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  3 Months
                </Button>
                <Button
                  onClick={() => handleCycleChange('6M')}
                  variant={formData.billingCycle === '6M' ? 'contained' : 'outlined'}
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  6 Months
                </Button>
                <Button
                  onClick={() => handleCycleChange('1Y')}
                  variant={formData.billingCycle === '1Y' ? 'contained' : 'outlined'}
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  1 Year
                </Button>
              </ButtonGroup>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Start Date *"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="End Date / Next Renewal *"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Subscription Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Subscription Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="ACTIVE">🟢 ACTIVE</MenuItem>
                  <MenuItem value="PAUSED">🟡 PAUSED</MenuItem>
                  <MenuItem value="EXPIRED">🔴 EXPIRED</MenuItem>
                  <MenuItem value="CANCELLED">⚪ CANCELLED</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Live Validity & Cost Breakdown Summary */}
            {validity && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800, display: 'block', mb: 1, letterSpacing: 0.5 }}>
                    SUBSCRIPTION DUES & COST BREAKDOWN
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Plan Cycle</Typography>
                      <Chip
                        label={
                          formData.billingCycle === '1M'
                            ? '1 Month (Monthly)'
                            : formData.billingCycle === '2M'
                            ? '2 Months'
                            : formData.billingCycle === '3M'
                            ? '3 Months (Quarterly)'
                            : formData.billingCycle === '6M'
                            ? '6 Months (Half-Yearly)'
                            : '1 Year (Annual)'
                        }
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 800, fontSize: '0.7rem' }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Total Cycle Dues</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#38bdf8' }}>
                        ₹{(parseFloat(formData.amount) || 0).toLocaleString('en-IN')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Monthly Equivalent</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#10b981' }}>
                        ₹{Math.round(validity.monthlyCost).toLocaleString('en-IN')}/mo
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Renewal Due In</Typography>
                      <Chip
                        label={
                          validity.isExpired
                            ? `Expired ${Math.abs(validity.daysRemaining)}d ago`
                            : validity.daysRemaining === 0
                            ? 'Due Today'
                            : `${validity.daysRemaining} Days Left`
                        }
                        size="small"
                        color={validity.isExpired ? 'error' : validity.isDueSoon ? 'warning' : 'success'}
                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #38bdf8, #0284c7)', fontWeight: 700 }}
          >
            {editingBill ? 'Update Subscription' : '💾 Save Bill Record'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddBillModal;
