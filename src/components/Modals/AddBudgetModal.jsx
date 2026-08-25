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

const AddBudgetModal = () => {
  const { activeModal, setActiveModal, editingBudget, setEditingBudget, addBudget, editBudget } = useFinance();

  const [formData, setFormData] = useState({
    category: '',
    budgetAmount: ''
  });

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.category || '',
        budgetAmount: editingBudget.budgetAmount || ''
      });
    }
  }, [editingBudget]);

  if (activeModal !== 'add-budget') return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingBudget(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bAmt = parseFloat(formData.budgetAmount) || 0;
    if (editingBudget) {
      editBudget(editingBudget.id, { ...formData, budgetAmount: bAmt });
    } else {
      addBudget({ ...formData, budgetAmount: bAmt });
    }
    handleClose();
    setFormData({ category: '', budgetAmount: '' });
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        {editingBudget ? '✏️ Edit Category Budget' : '🎯 Set Category Monthly Budget'}
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Category Name" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Food & Dining, Rent, Shopping" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Monthly Target Budget (₹)" type="number" value={formData.budgetAmount} onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })} placeholder="e.g. 15000" required />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save Budget Target</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddBudgetModal;
