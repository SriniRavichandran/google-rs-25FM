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

  // Helper to compute end date given start date, period unit (DAYS, MONTHS, YEARS), count, and optional due day of month
  const computeEndDate = (startStr, unit, value, dueDay) => {
    if (!startStr) return '';
    const d = new Date(startStr);
    if (isNaN(d.getTime())) return '';

    const count = parseInt(value, 10) || 1;

    if (unit === 'DAYS') {
      d.setDate(d.getDate() + count);
    } else if (unit === 'YEARS') {
      d.setFullYear(d.getFullYear() + count);
      if (dueDay && dueDay >= 1 && dueDay <= 31) {
        d.setDate(Math.min(dueDay, 28));
      }
    } else {
      // Default: MONTHS
      d.setMonth(d.getMonth() + count);
      if (dueDay && dueDay >= 1 && dueDay <= 31) {
        const targetMonth = d.getMonth();
        d.setDate(dueDay);
        // Handle month end overflow
        if (d.getMonth() !== targetMonth) {
          d.setDate(0);
        }
      }
    }

    return d.toISOString().split('T')[0];
  };

  const defaultForm = {
    name: '',
    category: 'Subscription',
    amount: '',
    periodUnit: 'MONTHS', // 'DAYS' | 'MONTHS' | 'YEARS'
    periodValue: 1,       // e.g. 1, 2, 3, 6, 12, 15, 30
    dueDayOfMonth: 5,     // Specific due day of month e.g. 5
    startDate: getTodayStr(),
    endDate: computeEndDate(getTodayStr(), 'MONTHS', 1, 5),
    status: 'ACTIVE'
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (editingBill) {
      const initialStart = editingBill.startDate || getTodayStr();
      const unit = editingBill.periodUnit || (editingBill.billingCycle?.endsWith('Y') ? 'YEARS' : editingBill.billingCycle?.endsWith('D') ? 'DAYS' : 'MONTHS');
      const val = editingBill.periodValue || (editingBill.billingCycle === '2M' ? 2 : editingBill.billingCycle === '3M' ? 3 : editingBill.billingCycle === '6M' ? 6 : editingBill.billingCycle === '1Y' ? 1 : 1);
      const dueDay = editingBill.dueDayOfMonth || editingBill.dueDay || 5;

      setFormData({
        name: editingBill.name || '',
        category: editingBill.category || 'Subscription',
        amount: editingBill.amount !== undefined ? editingBill.amount : '',
        periodUnit: unit,
        periodValue: val,
        dueDayOfMonth: dueDay,
        startDate: initialStart,
        endDate: editingBill.endDate || computeEndDate(initialStart, unit, val, dueDay),
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

  const handleUnitOrValueChange = (newUnit, newValue, newDueDay = formData.dueDayOfMonth) => {
    const newEnd = computeEndDate(formData.startDate, newUnit, newValue, newDueDay);
    setFormData({
      ...formData,
      periodUnit: newUnit,
      periodValue: newValue,
      dueDayOfMonth: newDueDay,
      endDate: newEnd
    });
  };

  const handleStartDateChange = (newStart) => {
    const newEnd = computeEndDate(newStart, formData.periodUnit, formData.periodValue, formData.dueDayOfMonth);
    setFormData({
      ...formData,
      startDate: newStart,
      endDate: newEnd
    });
  };

  const handlePresetSelect = (unit, val) => {
    handleUnitOrValueChange(unit, val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(formData.amount) || 0;
    const count = parseInt(formData.periodValue, 10) || 1;

    // Derived legacy billing cycle key for backwards compatibility
    let cycleKey = `${count}${formData.periodUnit[0]}`;
    if (formData.periodUnit === 'MONTHS' && count === 1) cycleKey = '1M';

    const payload = {
      ...formData,
      amount: amt,
      billingCycle: cycleKey,
      dueDay: formData.dueDayOfMonth
    };

    if (editingBill) {
      editBill(editingBill.id, payload);
    } else {
      addBill(payload);
    }
    handleClose();
  };

  // Calculate validity duration & cost breakdown
  const calculateValidity = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    const totalAmt = parseFloat(formData.amount) || 0;
    const count = parseInt(formData.periodValue, 10) || 1;

    let monthlyCost = totalAmt;
    if (formData.periodUnit === 'MONTHS') {
      monthlyCost = totalAmt / count;
    } else if (formData.periodUnit === 'YEARS') {
      monthlyCost = totalAmt / (count * 12);
    } else if (formData.periodUnit === 'DAYS') {
      monthlyCost = (totalAmt / count) * 30;
    }

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
          backdropFilter: 'blur(20px)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, py: 1.5, px: { xs: 2, sm: 3 }, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutorenewIcon sx={{ color: '#38bdf8' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {editingBill ? 'Edit Subscription / Bill' : 'Add Bill / Subscription Tracker'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Configure Frequency (Day / Month / Year), Duration & Due Day
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
        <DialogContent
          sx={{
            flex: 1,
            overflowY: 'auto',
            py: 2,
            px: { xs: 2, sm: 3 },
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(56, 189, 248, 0.3)',
              borderRadius: 3
            }
          }}
        >
          <Grid container spacing={1.5}>
            {/* Bill Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Bill / Service Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Netflix, Airtel OTT, Wifi Broadband, Gym, House Rent"
                required
              />
            </Grid>

            {/* Category */}
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

            {/* Subscription Dues Amount */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Subscription Amount (₹)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g. 4000"
                required
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>

            {/* FREQUENCY UNIT & DURATION SELECTION */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Frequency Unit</InputLabel>
                <Select
                  value={formData.periodUnit}
                  label="Frequency Unit"
                  onChange={(e) => handleUnitOrValueChange(e.target.value, formData.periodValue)}
                >
                  <MenuItem value="DAYS">📅 Day(s)</MenuItem>
                  <MenuItem value="MONTHS">📆 Month(s)</MenuItem>
                  <MenuItem value="YEARS">🗓️ Year(s)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label={`Duration (${formData.periodUnit})`}
                type="number"
                value={formData.periodValue}
                onChange={(e) => handleUnitOrValueChange(formData.periodUnit, Math.max(1, parseInt(e.target.value, 10) || 1))}
                required
                inputProps={{ min: 1, step: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Due Day of Month (1-31)"
                type="number"
                value={formData.dueDayOfMonth}
                onChange={(e) => handleUnitOrValueChange(formData.periodUnit, formData.periodValue, Math.min(31, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                placeholder="e.g. 5"
                inputProps={{ min: 1, max: 31, step: 1 }}
              />
            </Grid>

            {/* QUICK PRESETS BAR */}
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.8 }}>
                ⚡ QUICK PRESETS:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                <Chip
                  label="1 Month"
                  clickable
                  color={formData.periodUnit === 'MONTHS' && formData.periodValue === 1 ? 'primary' : 'default'}
                  onClick={() => handlePresetSelect('MONTHS', 1)}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="2 Months"
                  clickable
                  color={formData.periodUnit === 'MONTHS' && formData.periodValue === 2 ? 'primary' : 'default'}
                  onClick={() => handlePresetSelect('MONTHS', 2)}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="3 Months"
                  clickable
                  color={formData.periodUnit === 'MONTHS' && formData.periodValue === 3 ? 'primary' : 'default'}
                  onClick={() => handlePresetSelect('MONTHS', 3)}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="6 Months"
                  clickable
                  color={formData.periodUnit === 'MONTHS' && formData.periodValue === 6 ? 'primary' : 'default'}
                  onClick={() => handlePresetSelect('MONTHS', 6)}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="1 Year"
                  clickable
                  color={formData.periodUnit === 'YEARS' && formData.periodValue === 1 ? 'primary' : 'default'}
                  onClick={() => handlePresetSelect('YEARS', 1)}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="15 Days"
                  clickable
                  color={formData.periodUnit === 'DAYS' && formData.periodValue === 15 ? 'primary' : 'default'}
                  onClick={() => handlePresetSelect('DAYS', 15)}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label="30 Days"
                  clickable
                  color={formData.periodUnit === 'DAYS' && formData.periodValue === 30 ? 'primary' : 'default'}
                  onClick={() => handlePresetSelect('DAYS', 30)}
                  sx={{ fontWeight: 700 }}
                />
              </Box>
            </Grid>

            {/* DATES */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Start Date"
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
                label="End Date / Next Renewal"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* STATUS */}
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
                <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800, display: 'block', mb: 0.8, letterSpacing: 0.5 }}>
                    SUBSCRIPTION DUES & COST BREAKDOWN
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Configured Plan</Typography>
                      <Chip
                        label={`Every ${formData.periodValue} ${formData.periodUnit.toLowerCase()}`}
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
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(10, 16, 28, 0.98)', gap: 1 }}>
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
