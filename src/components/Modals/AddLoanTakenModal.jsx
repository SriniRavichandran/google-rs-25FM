import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { useFinance } from '../../context/FinanceContext.jsx';

const AddLoanTakenModal = () => {
  const { activeModal, setActiveModal, addLoanTaken, editLoanTaken, editingLoanTaken, setEditingLoanTaken } = useFinance();

  const defaultForm = {
    lenderName: '',
    amountTaken: '',
    interestRate: '',
    dateTaken: new Date().toISOString().split('T')[0],
    dueDate: '',
    amountRepaid: ''
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (editingLoanTaken) {
      setFormData({
        lenderName: editingLoanTaken.lenderName || '',
        amountTaken: editingLoanTaken.amountTaken || '',
        interestRate: editingLoanTaken.interestRate || '',
        dateTaken: editingLoanTaken.dateTaken || new Date().toISOString().split('T')[0],
        dueDate: editingLoanTaken.dueDate || '',
        amountRepaid: editingLoanTaken.amountRepaid || ''
      });
    } else {
      setFormData(defaultForm);
    }
  }, [editingLoanTaken, activeModal]);

  if (activeModal !== 'add-loan-taken') return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingLoanTaken(null);
    setFormData(defaultForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taken = parseFloat(formData.amountTaken) || 0;
    const repaid = parseFloat(formData.amountRepaid) || 0;
    const payload = {
      ...formData,
      amountTaken: taken,
      amountRepaid: repaid,
      interestRate: parseFloat(formData.interestRate) || 0,
      outstandingBalance: taken - repaid
    };

    if (editingLoanTaken) {
      editLoanTaken(editingLoanTaken.id, payload);
    } else {
      addLoanTaken(payload);
    }
    handleClose();
  };

  const taken = parseFloat(formData.amountTaken) || 0;
  const repaid = parseFloat(formData.amountRepaid) || 0;
  const outstanding = taken - repaid;

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { background: 'rgba(20, 5, 5, 0.97)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MoneyOffIcon sx={{ color: '#ef4444' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {editingLoanTaken ? '✏️ Edit Loan Taken' : '💸 Add Loan Taken'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Liability — Money you borrowed, must repay with interest
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      {/* Concept Banner */}
      <Box sx={{ mx: 3, mb: 1, p: 1.5, borderRadius: 2, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700, display: 'block' }}>
          📌 Loan Taken = LIABILITY (Debt) — You borrowed ₹ from someone → You owe them back
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          e.g. Personal loan, borrowed from friend, bank EMI. Track principal, interest & repayment.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth size="small" label="Lender / Bank Name *"
                value={formData.lenderName}
                onChange={(e) => setFormData({ ...formData, lenderName: e.target.value })}
                placeholder="e.g. HDFC Personal Loan, Friend Suresh, Relative"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Principal Amount Borrowed (₹) *" type="number"
                value={formData.amountTaken}
                onChange={(e) => setFormData({ ...formData, amountTaken: e.target.value })}
                placeholder="e.g. 100000"
                required
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Interest Rate (% per year)" type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="e.g. 10.5 or 0 for interest-free"
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Date Borrowed *" type="date"
                value={formData.dateTaken}
                onChange={(e) => setFormData({ ...formData, dateTaken: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Repayment Due Date" type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth size="small" label="Amount Already Repaid (₹)" type="number"
                value={formData.amountRepaid}
                onChange={(e) => setFormData({ ...formData, amountRepaid: e.target.value })}
                placeholder="Enter 0 if nothing repaid yet"
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>

            {/* Live Summary */}
            {taken > 0 && (
              <Grid item xs={12}>
                <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>LIVE DEBT SUMMARY</Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Borrowed</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#ef4444' }}>
                        ₹{taken.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Paid Back</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#10b981' }}>
                        ₹{repaid.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Still Owe</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: outstanding <= 0 ? '#10b981' : '#ef4444' }}>
                        ₹{outstanding.toLocaleString('en-IN')} {outstanding <= 0 ? '✅ CLEARED!' : ''}
                      </Typography>
                    </Box>
                    {formData.interestRate > 0 && taken > 0 && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Annual Interest</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                          ₹{((outstanding * parseFloat(formData.interestRate)) / 100).toLocaleString('en-IN')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="error"
            sx={{ fontWeight: 700 }}
          >
            {editingLoanTaken ? 'Update Debt Record' : '💾 Save Loan Taken to Sheet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddLoanTakenModal;
