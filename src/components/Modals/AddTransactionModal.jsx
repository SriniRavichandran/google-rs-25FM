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

const AddTransactionModal = () => {
  const { activeModal, setActiveModal, editingTx, setEditingTx, addTransaction, editTransaction } = useFinance();

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food & Dining',
    paymentMethod: 'Credit Card',
    account: '',
    description: ''
  });

  useEffect(() => {
    if (editingTx) {
      setFormData({
        type: editingTx.type || 'expense',
        amount: editingTx.amount || '',
        date: editingTx.date || new Date().toISOString().split('T')[0],
        category: editingTx.category || 'Food & Dining',
        paymentMethod: editingTx.paymentMethod || 'Credit Card',
        account: editingTx.account || '',
        description: editingTx.description || ''
      });
    }
  }, [editingTx]);

  const handleClose = () => {
    setActiveModal(null);
    setEditingTx(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTx) {
      editTransaction(editingTx.id, formData);
    } else {
      addTransaction(formData);
    }
    handleClose();
  };

  return (
    <Dialog open={activeModal === 'add-transaction'} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        {editingTx ? '✏️ Edit Row / Amount' : '➕ Add Row / Amount to Google Sheet'}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Transaction Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <MenuItem value="expense">Expense (-)</MenuItem>
                  <MenuItem value="income">Income (+)</MenuItem>
                  <MenuItem value="investment">Investment Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Amount (₹)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.paymentMethod}
                  label="Payment Method"
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  required
                >
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Debit Card">Debit Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Account / Card Used"
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                placeholder="e.g. HDFC Regalia Gold"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Description / Note"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. Dinner with family"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save to Sheet & App</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTransactionModal;
