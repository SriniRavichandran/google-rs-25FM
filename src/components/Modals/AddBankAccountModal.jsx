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

const AddBankAccountModal = () => {
  const {
    activeModal,
    setActiveModal,
    addBankAccount,
    editBankAccount,
    editingBankAccount,
    setEditingBankAccount
  } = useFinance();

  const defaultForm = {
    name: '',
    bank: '',
    type: 'Savings',
    balance: '',
    accountNumber: ''
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (editingBankAccount) {
      setFormData({
        name: editingBankAccount.name || '',
        bank: editingBankAccount.bank || '',
        type: editingBankAccount.type || 'Savings',
        balance: editingBankAccount.balance !== undefined ? editingBankAccount.balance : '',
        accountNumber: editingBankAccount.accountNumber || ''
      });
    } else {
      setFormData(defaultForm);
    }
  }, [editingBankAccount, activeModal]);

  if (activeModal !== 'add-bank-account') return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingBankAccount(null);
    setFormData(defaultForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      balance: parseFloat(formData.balance) || 0
    };

    if (editingBankAccount) {
      editBankAccount(editingBankAccount.id, payload);
    } else {
      addBankAccount(payload);
    }
    handleClose();
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        {editingBankAccount ? '✏️ Edit Bank Account / Debit Card' : '🏦 Add Bank Account / Debit Card'}
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Account Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Salary Savings Account, Main Checking"
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
                placeholder="e.g. ICICI Bank, HDFC Bank, SBI"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Account Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="Savings">Savings Account</MenuItem>
                  <MenuItem value="Current">Current Account</MenuItem>
                  <MenuItem value="Salary">Salary Account</MenuItem>
                  <MenuItem value="Fixed Deposit">Fixed Deposit (FD)</MenuItem>
                  <MenuItem value="Digital Wallet">Digital Wallet (UPI/Paytm)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Available Balance (₹) *"
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                placeholder="e.g. 85000"
                required
                inputProps={{ step: 'any' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Account Number (Last 4) *"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="e.g. 4321"
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {editingBankAccount ? 'Update Account' : 'Save Account to Sheet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddBankAccountModal;
