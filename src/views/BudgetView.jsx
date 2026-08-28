import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography,
  LinearProgress, Button, IconButton, Tooltip, Table,
  TableHead, TableBody, TableCell, TableRow, TableContainer, Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const BudgetView = () => {
  const { data, filteredTx, setActiveModal, setEditingBudget, deleteBudget } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const actualCategorySpent = filteredTx.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.category] = (acc[t.category] || 0) + (parseFloat(t.amount) || 0);
    }
    return acc;
  }, {});

  const totalBudgeted = data.budgets.reduce((s, b) => s + (parseFloat(b.budgetAmount) || 0), 0);
  const totalActual = Object.values(actualCategorySpent).reduce((s, a) => s + a, 0);

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>🎯 Budget vs Actual Spending Tracker</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Set category monthly spending budgets and compare against live actual expenses</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingBudget(null); setActiveModal('add-budget'); }}>
          Set Category Budget
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Budget Target</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalBudgeted)}</Typography>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Planned Spend</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Actual Expense</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: totalActual > totalBudgeted ? '#ef4444' : '#10b981', my: 0.5 }}>{formatCurrency(totalActual)}</Typography>
            <Typography variant="caption" sx={{ color: totalActual > totalBudgeted ? '#ef4444' : '#10b981', fontWeight: 600 }}>
              {totalBudgeted > 0 ? ((totalActual / totalBudgeted) * 100).toFixed(1) + '% Budget Used' : 'No Budget'}
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Remaining Margin</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: totalBudgeted - totalActual >= 0 ? '#10b981' : '#ef4444', my: 0.5 }}>{formatCurrency(totalBudgeted - totalActual)}</Typography>
            <Typography variant="caption" sx={{ color: totalBudgeted - totalActual >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {totalBudgeted - totalActual >= 0 ? 'Within Budget' : 'Overbudget Alert'}
            </Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>📊 Category Budget Breakdown</Typography>

      {data.budgets.length === 0 ? (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>No category budgets set yet.</Typography>
          <Button variant="contained" color="primary" onClick={() => { setEditingBudget(null); setActiveModal('add-budget'); }}>Set Category Budget</Button>
        </Card>
      ) : (
        <Card sx={{ width: '100%', overflow: 'hidden' }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent', width: '100%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                    <TableCell sx={{ fontWeight: 700, width: 60, whiteSpace: 'nowrap' }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Budget Target</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Actual Spent</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Remaining</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 140, whiteSpace: 'nowrap' }}>Progress</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.budgets.map((b, idx) => {
                    const spent = actualCategorySpent[b.category] || 0;
                    const budget = parseFloat(b.budgetAmount) || 1;
                    const progress = Math.min((spent / budget) * 100, 100);
                    const isOver = spent > budget;
                    return (
                      <TableRow key={b.id} hover>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap' }}>{idx + 1}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>{b.category}</strong></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(budget)}</TableCell>
                        <TableCell sx={{ color: isOver ? '#ef4444' : 'inherit', fontWeight: isOver ? 700 : 400, whiteSpace: 'nowrap' }}>{formatCurrency(spent)}</TableCell>
                        <TableCell sx={{ color: isOver ? '#ef4444' : '#10b981', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatCurrency(budget - spent)}</TableCell>
                        <TableCell>
                          <LinearProgress variant="determinate" value={progress} color={isOver ? 'error' : 'success'} sx={{ height: 8, borderRadius: 4 }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{progress.toFixed(0)}%</Typography>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Typography variant="caption" sx={{ color: isOver ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                            {isOver ? `Over by ${formatCurrency(spent - budget)}` : `${formatCurrency(budget - spent)} left`}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Tooltip title="Edit Budget">
                            <IconButton size="small" color="primary" onClick={() => { setEditingBudget(b); setActiveModal('add-budget'); }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Budget">
                            <IconButton size="small" color="error" onClick={() => setDeleteTarget(b)}>
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
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteBudget(deleteTarget.id)}
        label={deleteTarget ? `budget for "${deleteTarget.category}"` : ''}
      />
    </Box>
  );
};

export default BudgetView;
