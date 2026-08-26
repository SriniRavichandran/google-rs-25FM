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
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useFinance } from '../../context/FinanceContext.jsx';

const AddBillModal = () => {
  const { activeModal, setActiveModal, editingBill, setEditingBill, addBill, editBill } = useFinance();

  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getNextMonthStr = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  };

  const defaultForm = {
    name: '',
    category: 'Subscription',
    amount: '',
    startDate: getTodayStr(),
    endDate: getNextMonthStr(),
    status: 'ACTIVE'
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (editingBill) {
      setFormData({
        name: editingBill.name || '',
        category: editingBill.category || 'Subscription',
        amount: editingBill.amount || '',
        startDate: editingBill.startDate || getTodayStr(),
        endDate: editingBill.endDate || getNextMonthStr(),
        status: editingBill.status || 'ACTIVE'
      });
    } else {
      setFormData({
        name: '',
        category: 'Subscription',
        amount: '',
        startDate: getTodayStr(),
        endDate: getNextMonthStr(),
        status: 'ACTIVE'
      });
    }
  }, [editingBill, activeModal]);

  if (activeModal !== 'add-bill') return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingBill(null);
    setFormData(defaultForm);
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

    return {
      totalDays: totalDays > 0 ? totalDays : 0,
      daysRemaining,
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
              Track active duration between Start Date & End Date
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
                placeholder="e.g. Netflix 4K, Amazon Prime, Wifi Broadband, Gym, House Rent"
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
                label="Recurring Billing Amount (₹) *"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g. 649"
                required
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Start Date *"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="End Date / Renewal Date *"
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

            {/* Live Validity Summary */}
            {validity && (
              <Grid item xs={12}>
                <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    SUBSCRIPTION DURATION & VALIDITY
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Billing Cycle:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#38bdf8' }}>
                        {formData.startDate} → {formData.endDate} ({validity.totalDays} Days)
                      </Typography>
                    </Box>
                    <Box>
                      <Chip
                        label={
                          validity.isExpired
                            ? `Expired ${Math.abs(validity.daysRemaining)} days ago`
                            : validity.daysRemaining === 0
                            ? 'Renews Today'
                            : `${validity.daysRemaining} Days Remaining`
                        }
                        size="small"
                        color={validity.isExpired ? 'error' : validity.isDueSoon ? 'warning' : 'success'}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                  </Box>
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
            {editingBill ? 'Update Subscription' : '💾 Save to Sheet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddBillModal;
