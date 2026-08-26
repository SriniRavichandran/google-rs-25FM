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
  Typography,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { useFinance } from '../../context/FinanceContext.jsx';

const AddLoanGivenModal = () => {
  const { activeModal, setActiveModal, addLoanGiven, editLoanGiven, editingLoanGiven, setEditingLoanGiven } = useFinance();

  const defaultForm = {
    borrowerName: '',
    amountGiven: '',
    interestRate: '',
    dateGiven: new Date().toISOString().split('T')[0],
    dueDate: '',
    amountRepaid: ''
  };

  const [formData, setFormData] = useState(defaultForm);

  // Populate form when editing
  useEffect(() => {
    if (editingLoanGiven) {
      setFormData({
        borrowerName: editingLoanGiven.borrowerName || '',
        amountGiven: editingLoanGiven.amountGiven || '',
        interestRate: editingLoanGiven.interestRate || '',
        dateGiven: editingLoanGiven.dateGiven || new Date().toISOString().split('T')[0],
        dueDate: editingLoanGiven.dueDate || '',
        amountRepaid: editingLoanGiven.amountRepaid || ''
      });
    } else {
      setFormData(defaultForm);
    }
  }, [editingLoanGiven, activeModal]);

  if (activeModal !== 'add-loan-given') return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingLoanGiven(null);
    setFormData(defaultForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const given = parseFloat(formData.amountGiven) || 0;
    const repaid = parseFloat(formData.amountRepaid) || 0;
    const payload = {
      ...formData,
      amountGiven: given,
      amountRepaid: repaid,
      interestRate: parseFloat(formData.interestRate) || 0,
      outstandingOwed: given - repaid
    };

    if (editingLoanGiven) {
      editLoanGiven(editingLoanGiven.id, payload);
    } else {
      addLoanGiven(payload);
    }
    handleClose();
  };

  const given = parseFloat(formData.amountGiven) || 0;
  const repaid = parseFloat(formData.amountRepaid) || 0;
  const outstanding = given - repaid;

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { background: 'rgba(10, 20, 10, 0.97)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HandshakeIcon sx={{ color: '#10b981' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {editingLoanGiven ? '✏️ Edit Loan Given' : '🤝 Add Loan Given'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Receivable — Money you lent out, owed back to you
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      {/* Concept Banner */}
      <Box sx={{ mx: 3, mb: 1, p: 1.5, borderRadius: 2, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, display: 'block' }}>
          📌 Loan Given = RECEIVABLE (Asset) — You lent ₹ to someone → They owe you back
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          e.g. Friend borrowed ₹25,000 from you. Track principal, interest terms & repayment.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth size="small" label="Borrower Name *"
                value={formData.borrowerName}
                onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                placeholder="e.g. Rahul (Friend), Business Partner, Relative"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Principal Amount Given (₹) *" type="number"
                value={formData.amountGiven}
                onChange={(e) => setFormData({ ...formData, amountGiven: e.target.value })}
                placeholder="e.g. 25000"
                required
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Interest Rate (% per year)" type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="0 for interest-free"
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Date Given *" type="date"
                value={formData.dateGiven}
                onChange={(e) => setFormData({ ...formData, dateGiven: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Expected Repayment Date" type="date"
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
            {given > 0 && (
              <Grid item xs={12}>
                <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>LIVE SUMMARY</Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Lent</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#38bdf8' }}>
                        ₹{given.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Recovered</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#10b981' }}>
                        ₹{repaid.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Still Owed</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: outstanding <= 0 ? '#10b981' : '#ef4444' }}>
                        ₹{outstanding.toLocaleString('en-IN')} {outstanding <= 0 ? '✅ FULLY REPAID' : ''}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained"
            sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', fontWeight: 700 }}
          >
            {editingLoanGiven ? 'Update Loan Record' : '💾 Save Loan Given to Sheet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddLoanGivenModal;
