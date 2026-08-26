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

const CreditCardsView = () => {
  const {
    data,
    totalCreditLimit,
    totalCreditOutstanding,
    creditUtil,
    setActiveModal,
    deleteTransaction,
    setEditingCreditCard
  } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>💳 Credit Card Usage & Limit Health</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Track total limits, outstanding dues, utilization %, and billing cycles</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingCreditCard(null); setActiveModal('add-credit-card'); }}>
          + Add Credit Card
        </Button>
      </Box>

      {/* Metrics */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Credit Limit</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalCreditLimit)}</Typography>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Across {data.creditCards.length} Cards</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Outstanding Dues</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{formatCurrency(totalCreditOutstanding)}</Typography>
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>Due for payment</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Available Credit</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalCreditLimit - totalCreditOutstanding)}</Typography>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Ready to use</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Utilization Rate</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: creditUtil > 50 ? '#ef4444' : '#10b981', my: 0.5 }}>{creditUtil.toFixed(1)}%</Typography>
            <Typography variant="caption" sx={{ color: creditUtil > 50 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
              {creditUtil < 30 ? 'Optimal' : creditUtil < 50 ? 'Moderate' : 'High Alert'}
            </Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Cards Table */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>💳 Registered Credit Cards</Typography>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Card Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Bank • Network</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total Limit</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Outstanding</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Utilization</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.creditCards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No credit cards added yet. <strong>+ Add Credit Card</strong> to begin.
                    </TableCell>
                  </TableRow>
                ) : data.creditCards.map(c => {
                  const util = c.limit > 0 ? (c.outstanding / c.limit) * 100 : 0;
                  return (
                    <TableRow key={c.id} hover>
                      <TableCell><strong>{c.name}</strong></TableCell>
                      <TableCell>{c.bank} • {c.network}</TableCell>
                      <TableCell>{formatCurrency(c.limit)}</TableCell>
                      <TableCell sx={{ color: '#ef4444', fontWeight: 700 }}>{formatCurrency(c.outstanding)}</TableCell>
                      <TableCell>
                        <Chip label={`${util.toFixed(1)}%`} size="small" color={util > 50 ? 'error' : 'success'} sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell>Day {c.dueDate}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Card">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setEditingCreditCard(c);
                              setActiveModal('add-credit-card');
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Card">
                          <IconButton size="small" color="error" onClick={() => setDeleteTarget(c)}>
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
        label={deleteTarget ? `credit card "${deleteTarget.name}"` : ''}
      />
    </Box>
  );
};

export default CreditCardsView;
