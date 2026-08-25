import React, { useState, useEffect } from 'react';
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

const AddGoalModal = () => {
  const { activeModal, setActiveModal, editingGoal, setEditingGoal, addGoal, editGoal } = useFinance();

  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    savedAmount: '',
    targetDate: ''
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title || '',
        targetAmount: editingGoal.targetAmount || '',
        savedAmount: editingGoal.savedAmount || '',
        targetDate: editingGoal.targetDate || ''
      });
    }
  }, [editingGoal]);

  if (activeModal !== 'add-goal') return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingGoal(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tAmt = parseFloat(formData.targetAmount) || 0;
    const sAmt = parseFloat(formData.savedAmount) || 0;
    if (editingGoal) {
      editGoal(editingGoal.id, { ...formData, targetAmount: tAmt, savedAmount: sAmt });
    } else {
      addGoal({ ...formData, targetAmount: tAmt, savedAmount: sAmt });
    }
    handleClose();
    setFormData({ title: '', targetAmount: '', savedAmount: '', targetDate: '' });
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        {editingGoal ? '✏️ Edit Financial Goal' : '🏆 Create Financial Goal & Milestone'}
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Goal Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Emergency Fund, New Car, House Deposit" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Target Goal Amount (₹)" type="number" value={formData.targetAmount} onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })} placeholder="e.g. 500000" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Currently Saved Amount (₹)" type="number" value={formData.savedAmount} onChange={(e) => setFormData({ ...formData, savedAmount: e.target.value })} placeholder="e.g. 150000" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Target Completion Date" type="date" value={formData.targetDate} onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })} InputLabelProps={{ shrink: true }} required />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save Financial Goal</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddGoalModal;
