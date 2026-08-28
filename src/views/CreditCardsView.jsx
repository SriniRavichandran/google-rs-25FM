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
    deleteCreditCard,
    setEditingCreditCard
  } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>💳 Credit Card Usage & Limit Health</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Track total limits, outstanding dues, utilization %, and billing cycles</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingCreditCard(null); setActiveModal('add-credit-card'); }}>
          Add Credit Card
        </Button>
      </Box>

      {/* Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Credit Limit</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalCreditLimit)}</Typography>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Across {data.creditCards.length} Cards</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Outstanding Dues</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{formatCurrency(totalCreditOutstanding)}</Typography>
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>Due for payment</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Available Credit</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalCreditLimit - totalCreditOutstanding)}</Typography>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Ready to use</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Utilization Rate</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: creditUtil > 50 ? '#ef4444' : '#10b981', my: 0.5 }}>{creditUtil.toFixed(1)}%</Typography>
            <Typography variant="caption" sx={{ color: creditUtil > 50 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
              {creditUtil < 30 ? 'Optimal' : creditUtil < 50 ? 'Moderate' : 'High Alert'}
            </Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Cards Table */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>💳 Registered Credit Cards</Typography>
      <Card sx={{ width: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent', width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ fontWeight: 700, width: 60, whiteSpace: 'nowrap' }}>S.No</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Card Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Bank • Network</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Total Limit</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Outstanding</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Utilization</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Due Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.creditCards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No credit cards added yet. Click <strong>"Add Credit Card"</strong> to begin.
                    </TableCell>
                  </TableRow>
                ) : data.creditCards.map((c, idx) => {
                  const util = c.limit > 0 ? (c.outstanding / c.limit) * 100 : 0;
                  return (
                    <TableRow key={c.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap' }}>{idx + 1}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>{c.name}</strong></TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{c.bank} • {c.network}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(c.limit)}</TableCell>
                      <TableCell sx={{ color: '#ef4444', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatCurrency(c.outstanding)}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip label={`${util.toFixed(1)}%`} size="small" color={util > 50 ? 'error' : 'success'} sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Day {c.dueDate}</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
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
        onConfirm={() => deleteTarget && deleteCreditCard(deleteTarget.id)}
        label={deleteTarget ? `credit card "${deleteTarget.name}"` : ''}
      />
    </Box>
  );
};

export default CreditCardsView;
