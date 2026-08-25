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

const AddTradeModal = () => {
  const { activeModal, setActiveModal, addTrade } = useFinance();

  const [formData, setFormData] = useState({
    name: '',
    type: 'Equity',
    action: 'BUY',
    quantity: '',
    buyPrice: '',
    currentPrice: ''
  });

  if (activeModal !== 'add-trade') return null;

  const handleClose = () => setActiveModal(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = parseFloat(formData.quantity) || 0;
    const buyPx = parseFloat(formData.buyPrice) || 0;
    const curPx = parseFloat(formData.currentPrice) || 0;
    addTrade({
      ...formData,
      quantity: qty,
      buyPrice: buyPx,
      currentPrice: curPx,
      investedAmount: qty * buyPx,
      currentValue: qty * curPx,
      pnl: (qty * curPx) - (qty * buyPx)
    });
    handleClose();
    setFormData({ name: '', type: 'Equity', action: 'BUY', quantity: '', buyPrice: '', currentPrice: '' });
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        📈 Log Trade / Asset Position
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Asset / Stock Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. NIFTY 50 ETF, RELIANCE, Bitcoin" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Asset Type</InputLabel>
                <Select value={formData.type} label="Asset Type" onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <MenuItem value="Equity">Equity Stock</MenuItem>
                  <MenuItem value="Mutual Fund">Mutual Fund / ETF</MenuItem>
                  <MenuItem value="Crypto">Cryptocurrency</MenuItem>
                  <MenuItem value="Gold">Gold / Commodity</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Trade Action</InputLabel>
                <Select value={formData.action} label="Trade Action" onChange={(e) => setFormData({ ...formData, action: e.target.value })}>
                  <MenuItem value="BUY">BUY</MenuItem>
                  <MenuItem value="SELL">SELL</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth size="small" label="Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="e.g. 50" required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth size="small" label="Avg Buy Price (₹)" type="number" value={formData.buyPrice} onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })} placeholder="e.g. 2450" required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth size="small" label="Current Price (₹)" type="number" value={formData.currentPrice} onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })} placeholder="e.g. 2680" required />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save Trade Position</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTradeModal;
