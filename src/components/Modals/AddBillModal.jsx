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
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFinance } from '../../context/FinanceContext.jsx';

const AddBillModal = () => {
  const { activeModal, setActiveModal, editingBill, setEditingBill, addBill, editBill } = useFinance();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Subscription',
    amount: '',
    dueDate: '5',
    status: 'DUE'
  });

  useEffect(() => {
    if (editingBill) {
      setFormData({
        name: editingBill.name || '',
        category: editingBill.category || 'Subscription',
        amount: editingBill.amount || '',
        dueDate: editingBill.dueDate || '5',
        status: editingBill.status || 'DUE'
      });
    }
  }, [editingBill]);

  if (activeModal !== 'add-bill') return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingBill(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(formData.amount) || 0;
    if (editingBill) {
      editBill(editingBill.id, { ...formData, amount: amt });
    } else {
      addBill({ ...formData, amount: amt });
    }
    handleClose();
    setFormData({ name: '', category: 'Subscription', amount: '', dueDate: '5', status: 'DUE' });
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        {editingBill ? '✏️ Edit Bill / Subscription' : '🔄 Add Bill / Subscription Tracker'}
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Bill / Service Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Netflix, Wifi, Electricity, Rent" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select value={formData.category} label="Category" onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <MenuItem value="Subscription">Subscription (OTT/Music)</MenuItem>
                  <MenuItem value="Utility">Utility Bill (Power/Water)</MenuItem>
                  <MenuItem value="Internet">Internet / Phone</MenuItem>
                  <MenuItem value="Rent">House Rent / Maintenance</MenuItem>
                  <MenuItem value="Insurance">Insurance Policy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Monthly Amount (₹)" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="e.g. 649" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Due Day of Month" type="number" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} placeholder="e.g. 5" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Status</InputLabel>
                <Select value={formData.status} label="Payment Status" onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <MenuItem value="DUE">DUE</MenuItem>
                  <MenuItem value="PAID">PAID</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save Bill Record</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddBillModal;
