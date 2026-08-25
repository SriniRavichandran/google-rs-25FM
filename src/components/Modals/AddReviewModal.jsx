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

const AddReviewModal = () => {
  const { activeModal, setActiveModal, editingReview, setEditingReview, addReview, editReview } = useFinance();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Weekly Review',
    grade: 'A',
    notes: ''
  });

  useEffect(() => {
    if (editingReview) {
      setFormData({
        date: editingReview.date || new Date().toISOString().split('T')[0],
        type: editingReview.type || 'Weekly Review',
        grade: editingReview.grade || 'A',
        notes: editingReview.notes || ''
      });
    }
  }, [editingReview]);

  if (activeModal !== 'add-review') return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingReview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingReview) {
      editReview(editingReview.id, formData);
    } else {
      addReview(formData);
    }
    handleClose();
    setFormData({ date: new Date().toISOString().split('T')[0], type: 'Weekly Review', grade: 'A', notes: '' });
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        {editingReview ? '✏️ Edit Review Note' : '📝 Log Daily / Weekly Review Note'}
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Review Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Review Type</InputLabel>
                <Select value={formData.type} label="Review Type" onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <MenuItem value="Daily Checkup">Daily Checkup</MenuItem>
                  <MenuItem value="Weekly Review">Weekly Review</MenuItem>
                  <MenuItem value="Monthly Audit">Monthly Audit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Financial Grade / Score</InputLabel>
                <Select value={formData.grade} label="Financial Grade / Score" onChange={(e) => setFormData({ ...formData, grade: e.target.value })}>
                  <MenuItem value="A+">A+ (Outstanding Discipline)</MenuItem>
                  <MenuItem value="A">A (Great Savings & Budgeting)</MenuItem>
                  <MenuItem value="B">B (On Track, Minor Impulse)</MenuItem>
                  <MenuItem value="C">C (High Impulse Expenses)</MenuItem>
                  <MenuItem value="D">D (Overbudget)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} size="small" label="Review Reflections / Action Items" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="e.g. Spent ₹500 less on dining out. Increased SIP investment." required />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save Review</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddReviewModal;
