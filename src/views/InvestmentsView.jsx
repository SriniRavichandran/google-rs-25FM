import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip,
  Button, IconButton, Tooltip, Table, TableHead,
  TableBody, TableCell, TableRow, TableContainer, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const InvestmentsView = () => {
  const {
    data,
    totalInvested,
    totalPortfolioValue,
    setActiveModal,
    deleteTransaction,
    setEditingTrade
  } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const totalPnL = totalPortfolioValue - totalInvested;
  const overallRoi = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>📈 Investments, Stocks & Assets</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Track equity portfolios, mutual funds, crypto, buy prices, and unrealized P&L</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingTrade(null); setActiveModal('add-trade'); }}>
          + Log Trade / Asset
        </Button>
      </Box>

      {/* Metrics */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Invested Capital</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalInvested)}</Typography>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Principal Capital</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Portfolio Value</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalPortfolioValue)}</Typography>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Market Value</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Unrealized P&L</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: totalPnL >= 0 ? '#10b981' : '#ef4444', my: 0.5 }}>
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            </Typography>
            <Typography variant="caption" sx={{ color: totalPnL >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {overallRoi.toFixed(2)}% Overall Returns
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Tracked Positions</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#a855f7', my: 0.5 }}>{data.investments.length}</Typography>
            <Typography variant="caption" sx={{ color: '#a855f7', fontWeight: 600 }}>Active Assets</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Portfolio Table */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📈 Portfolio Holdings & Asset Performance</Typography>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Asset Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Buy Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Current Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Invested Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Current Value</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>P&L</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.investments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No trade positions logged yet. Click <strong>"+ Log Trade / Asset"</strong> to add!
                    </TableCell>
                  </TableRow>
                ) : data.investments.map((inv) => {
                  const itemPnL = inv.currentValue - inv.investedAmount;
                  const itemRoi = inv.investedAmount > 0 ? (itemPnL / inv.investedAmount) * 100 : 0;
                  return (
                    <TableRow key={inv.id} hover>
                      <TableCell><strong>{inv.name}</strong></TableCell>
                      <TableCell><Chip label={inv.type} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                      <TableCell>{inv.quantity}</TableCell>
                      <TableCell>{formatCurrency(inv.buyPrice)}</TableCell>
                      <TableCell>{formatCurrency(inv.currentPrice)}</TableCell>
                      <TableCell>{formatCurrency(inv.investedAmount)}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(inv.currentValue)}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: itemPnL >= 0 ? '#10b981' : '#ef4444' }}>
                        {itemPnL >= 0 ? '+' : ''}{formatCurrency(itemPnL)} ({itemRoi.toFixed(1)}%)
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Trade">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setEditingTrade(inv);
                              setActiveModal('add-trade');
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Trade">
                          <IconButton size="small" color="error" onClick={() => setDeleteTarget(inv)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteTransaction(deleteTarget.id)}
        label={deleteTarget ? `trade position "${deleteTarget.name}"` : ''}
      />
    </Box>
  );
};

export default InvestmentsView;
