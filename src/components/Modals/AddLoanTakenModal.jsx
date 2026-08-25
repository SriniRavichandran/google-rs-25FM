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

const AddLoanTakenModal = () => {
  const { activeModal, setActiveModal, addLoanTaken } = useFinance();

  const [formData, setFormData] = useState({
    lenderName: '',
    amountTaken: '',
    interestRate: '',
    dateTaken: new Date().toISOString().split('T')[0],
    dueDate: '',
    amountRepaid: ''
  });

  if (activeModal !== 'add-loan-taken') return null;

  const handleClose = () => setActiveModal(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taken = parseFloat(formData.amountTaken) || 0;
    const repaid = parseFloat(formData.amountRepaid) || 0;
    addLoanTaken({
      ...formData,
      amountTaken: taken,
      amountRepaid: repaid,
      interestRate: parseFloat(formData.interestRate) || 0,
      outstandingBalance: taken - repaid
    });
    handleClose();
    setFormData({ lenderName: '', amountTaken: '', interestRate: '', dateTaken: new Date().toISOString().split('T')[0], dueDate: '', amountRepaid: '' });
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        💸 Log Loan Taken / Borrowed Debt
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Lender / Bank Name" value={formData.lenderName} onChange={(e) => setFormData({ ...formData, lenderName: e.target.value })} placeholder="e.g. HDFC Personal Loan, Friend" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Amount Borrowed (₹)" type="number" value={formData.amountTaken} onChange={(e) => setFormData({ ...formData, amountTaken: e.target.value })} placeholder="e.g. 100000" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Interest Rate (%)" type="number" value={formData.interestRate} onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })} placeholder="e.g. 10.5" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Date Taken" type="date" value={formData.dateTaken} onChange={(e) => setFormData({ ...formData, dateTaken: e.target.value })} InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Due Date" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Already Repaid Debt (₹)" type="number" value={formData.amountRepaid} onChange={(e) => setFormData({ ...formData, amountRepaid: e.target.value })} placeholder="e.g. 20000" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save Borrowed Debt</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddLoanTakenModal;
