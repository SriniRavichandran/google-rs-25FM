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

const AddCreditCardModal = () => {
  const {
    activeModal,
    setActiveModal,
    addCreditCard,
    editCreditCard,
    editingCreditCard,
    setEditingCreditCard
  } = useFinance();

  const defaultForm = {
    name: '',
    bank: '',
    network: 'Visa',
    limit: '',
    outstanding: '',
    dueDate: '15'
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (editingCreditCard) {
      setFormData({
        name: editingCreditCard.name || '',
        bank: editingCreditCard.bank || '',
        network: editingCreditCard.network || 'Visa',
        limit: editingCreditCard.limit !== undefined ? editingCreditCard.limit : '',
        outstanding: editingCreditCard.outstanding !== undefined ? editingCreditCard.outstanding : '',
        dueDate: editingCreditCard.dueDate !== undefined ? editingCreditCard.dueDate : '15'
      });
    } else {
      setFormData(defaultForm);
    }
  }, [editingCreditCard, activeModal]);

  if (activeModal !== 'add-credit-card') return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingCreditCard(null);
    setFormData(defaultForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      limit: parseFloat(formData.limit) || 0,
      outstanding: parseFloat(formData.outstanding) || 0,
      dueDate: parseInt(formData.dueDate, 10) || 1
    };

    if (editingCreditCard) {
      editCreditCard(editingCreditCard.id, payload);
    } else {
      addCreditCard(payload);
    }
    handleClose();
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        {editingCreditCard ? '✏️ Edit Credit Card' : '💳 Add New Credit Card'}
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Card Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. HDFC Regalia Gold, ICICI Coral"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Bank Name *"
                value={formData.bank}
                onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                placeholder="e.g. HDFC Bank, Axis Bank"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Card Network</InputLabel>
                <Select
                  value={formData.network}
                  label="Card Network"
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                >
                  <MenuItem value="Visa">Visa</MenuItem>
                  <MenuItem value="Mastercard">Mastercard</MenuItem>
                  <MenuItem value="RuPay">RuPay</MenuItem>
                  <MenuItem value="Amex">American Express</MenuItem>
                  <MenuItem value="Diners Club">Diners Club</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Total Credit Limit (₹) *"
                type="number"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                placeholder="e.g. 300000"
                required
                inputProps={{ step: 'any' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Outstanding Dues (₹) *"
                type="number"
                value={formData.outstanding}
                onChange={(e) => setFormData({ ...formData, outstanding: e.target.value })}
                placeholder="e.g. 45000"
                required
                inputProps={{ step: 'any' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Bill Due Date (Day of Month) *"
                type="number"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                placeholder="e.g. 15"
                required
                inputProps={{ min: 1, max: 31 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {editingCreditCard ? 'Update Credit Card' : 'Save Credit Card to Sheet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCreditCardModal;
