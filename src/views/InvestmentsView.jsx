import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Chip,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useFinance } from '../context/FinanceContext.jsx';

const InvestmentsView = () => {
  const { data, totalInvested, totalPortfolioValue, setActiveModal } = useFinance();

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const totalPnL = totalPortfolioValue - totalInvested;
  const roi = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            📈 Trade & Investment Portfolio
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Track buy/sell positions, invested capital, current market value, and unrealized P&L
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-trade')}>
          + Log Trade / Asset
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Invested Capital</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalInvested)}</Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Principal Capital</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Current Portfolio Value</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalPortfolioValue)}</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Market Value</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Profit & Loss (P&L)</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: totalPnL >= 0 ? '#10b981' : '#ef4444', my: 0.5 }}>
                {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
              </Typography>
              <Typography variant="caption" sx={{ color: totalPnL >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>Returns</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Portfolio ROI %</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: roi >= 0 ? '#10b981' : '#ef4444', my: 0.5 }}>
                {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
              </Typography>
              <Typography variant="caption" sx={{ color: roi >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>Overall Gain</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Asset Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Avg Buy Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Current Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Invested Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Current Value</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>P&L (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.investments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No trade positions logged yet. Click <strong>"+ Log Trade / Asset"</strong> to add an investment!
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InvestmentsView;
