import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFinance } from '../../context/FinanceContext.jsx';

const AddLoanGivenModal = () => {
  const { activeModal, setActiveModal, addLoanGiven } = useFinance();

  const [formData, setFormData] = useState({
    borrowerName: '',
    amountGiven: '',
    interestRate: '',
    dateGiven: new Date().toISOString().split('T')[0],
    dueDate: '',
    amountRepaid: ''
  });

  if (activeModal !== 'add-loan-given') return null;

  const handleClose = () => setActiveModal(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const given = parseFloat(formData.amountGiven) || 0;
    const repaid = parseFloat(formData.amountRepaid) || 0;
    addLoanGiven({
      ...formData,
      amountGiven: given,
      amountRepaid: repaid,
      interestRate: parseFloat(formData.interestRate) || 0,
      outstandingOwed: given - repaid
    });
    handleClose();
    setFormData({ borrowerName: '', amountGiven: '', interestRate: '', dateGiven: new Date().toISOString().split('T')[0], dueDate: '', amountRepaid: '' });
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        🤝 Log Loan Given / Money Owed
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Borrower Name" value={formData.borrowerName} onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })} placeholder="e.g. John Doe, Business Partner" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Amount Given (₹)" type="number" value={formData.amountGiven} onChange={(e) => setFormData({ ...formData, amountGiven: e.target.value })} placeholder="e.g. 25000" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Interest Rate (%)" type="number" value={formData.interestRate} onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })} placeholder="e.g. 0 or 12" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Date Given" type="date" value={formData.dateGiven} onChange={(e) => setFormData({ ...formData, dateGiven: e.target.value })} InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Due Date" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Already Repaid Amount (₹)" type="number" value={formData.amountRepaid} onChange={(e) => setFormData({ ...formData, amountRepaid: e.target.value })} placeholder="e.g. 5000" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save Loan Record</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddLoanGivenModal;
