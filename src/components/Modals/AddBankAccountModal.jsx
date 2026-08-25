import React, { useState } from 'react';
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

const AddBankAccountModal = () => {
  const { activeModal, setActiveModal, addBankAccount } = useFinance();

  const [formData, setFormData] = useState({
    name: '',
    bank: '',
    type: 'Savings',
    balance: '',
    accountNumber: ''
  });

  if (activeModal !== 'add-bank-account') return null;

  const handleClose = () => setActiveModal(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    addBankAccount({
      ...formData,
      balance: parseFloat(formData.balance) || 0
    });
    handleClose();
    setFormData({ name: '', bank: '', type: 'Savings', balance: '', accountNumber: '' });
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        🏦 Add Bank Account / Debit Card
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Account Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Salary Savings Account" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Bank Name" value={formData.bank} onChange={(e) => setFormData({ ...formData, bank: e.target.value })} placeholder="e.g. ICICI Bank" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Account Type</InputLabel>
                <Select value={formData.type} label="Account Type" onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <MenuItem value="Savings">Savings Account</MenuItem>
                  <MenuItem value="Current">Current Account</MenuItem>
                  <MenuItem value="Salary">Salary Account</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Available Balance (₹)" type="number" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} placeholder="e.g. 85000" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Account Number (Last 4)" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} placeholder="e.g. 4321" required />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Add Account</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddBankAccountModal;
