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

const AddTradeModal = () => {
  const {
    activeModal,
    setActiveModal,
    addTrade,
    editTrade,
    editingTrade,
    setEditingTrade
  } = useFinance();

  const defaultForm = {
    name: '',
    type: 'Equity',
    action: 'BUY',
    quantity: '',
    buyPrice: '',
    currentPrice: ''
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (editingTrade) {
      setFormData({
        name: editingTrade.name || '',
        type: editingTrade.type || 'Equity',
        action: editingTrade.action || 'BUY',
        quantity: editingTrade.quantity !== undefined ? editingTrade.quantity : '',
        buyPrice: editingTrade.buyPrice !== undefined ? editingTrade.buyPrice : '',
        currentPrice: editingTrade.currentPrice !== undefined ? editingTrade.currentPrice : ''
      });
    } else {
      setFormData(defaultForm);
    }
  }, [editingTrade, activeModal]);

  if (activeModal !== 'add-trade') return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingTrade(null);
    setFormData(defaultForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = parseFloat(formData.quantity) || 0;
    const buyPx = parseFloat(formData.buyPrice) || 0;
    const curPx = parseFloat(formData.currentPrice) || 0;

    const payload = {
      ...formData,
      quantity: qty,
      buyPrice: buyPx,
      currentPrice: curPx,
      investedAmount: qty * buyPx,
      currentValue: qty * curPx,
      pnl: (qty * curPx) - (qty * buyPx)
    };

    if (editingTrade) {
      editTrade(editingTrade.id, payload);
    } else {
      addTrade(payload);
    }
    handleClose();
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        {editingTrade ? '✏️ Edit Trade / Asset Position' : '📈 Log Trade / Asset Position'}
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Asset / Stock Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. NIFTY 50 ETF, RELIANCE, Bitcoin, S&P 500"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Asset Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Asset Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="Equity">Equity Stock</MenuItem>
                  <MenuItem value="Mutual Fund">Mutual Fund / ETF</MenuItem>
                  <MenuItem value="Crypto">Cryptocurrency</MenuItem>
                  <MenuItem value="Gold">Gold / Commodity</MenuItem>
                  <MenuItem value="Bonds">Bonds / Debt</MenuItem>
                  <MenuItem value="Real Estate">Real Estate / REIT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Trade Action</InputLabel>
                <Select
                  value={formData.action}
                  label="Trade Action"
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                >
                  <MenuItem value="BUY">BUY</MenuItem>
                  <MenuItem value="SELL">SELL</MenuItem>
                  <MenuItem value="HOLD">HOLD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Quantity *"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g. 50"
                required
                inputProps={{ step: 'any' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Avg Buy Price (₹) *"
                type="number"
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                placeholder="e.g. 2450"
                required
                inputProps={{ step: 'any' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Current Price (₹) *"
                type="number"
                value={formData.currentPrice}
                onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                placeholder="e.g. 2680"
                required
                inputProps={{ step: 'any' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {editingTrade ? 'Update Position' : 'Save Position to Sheet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTradeModal;
