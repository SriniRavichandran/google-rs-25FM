import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useFinance } from '../context/FinanceContext.jsx';

const BudgetView = () => {
  const { data, filteredTx, setActiveModal, setEditingBudget, deleteBudget } = useFinance();

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  // Group actual expenses by category
  const actualCategorySpent = filteredTx.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.category] = (acc[t.category] || 0) + (parseFloat(t.amount) || 0);
    }
    return acc;
  }, {});

  const totalBudgeted = data.budgets.reduce((s, b) => s + (parseFloat(b.budgetAmount) || 0), 0);
  const totalActual = Object.values(actualCategorySpent).reduce((s, a) => s + a, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            🎯 Budget vs Actual Spending Tracker
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Set category monthly spending budgets and compare against live actual expenses
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-budget')}>
          + Set Category Budget
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Budget Target</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalBudgeted)}</Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Planned Spend</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Actual Expense</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: totalActual > totalBudgeted ? '#ef4444' : '#10b981', my: 0.5 }}>{formatCurrency(totalActual)}</Typography>
              <Typography variant="caption" sx={{ color: totalActual > totalBudgeted ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                {totalBudgeted > 0 ? ((totalActual / totalBudgeted) * 100).toFixed(1) + '% Budget Used' : 'No Budget'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Remaining Budget Margin</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: totalBudgeted - totalActual >= 0 ? '#10b981' : '#ef4444', my: 0.5 }}>{formatCurrency(totalBudgeted - totalActual)}</Typography>
              <Typography variant="caption" sx={{ color: totalBudgeted - totalActual >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                {totalBudgeted - totalActual >= 0 ? 'Within Budget' : 'Overbudget Alert'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Budget Cards Grid */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📊 Category Budget Breakdown</Typography>
      <Grid container spacing={2.5}>
        {data.budgets.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>No category budgets set yet.</Typography>
              <Button variant="contained" color="primary" onClick={() => setActiveModal('add-budget')}>+ Set Category Budget</Button>
            </Card>
          </Grid>
        ) : data.budgets.map(b => {
          const spent = actualCategorySpent[b.category] || 0;
          const budget = parseFloat(b.budgetAmount) || 1;
          const progress = Math.min((spent / budget) * 100, 100);
          const isOver = spent > budget;

          return (
            <Grid item xs={12} sm={6} md={4} key={b.id}>
              <Card sx={{ borderLeft: `4px solid ${isOver ? '#ef4444' : '#10b981'}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{b.category}</Typography>
                    <Box>
                      <Tooltip title="Edit Budget">
                        <IconButton size="small" color="primary" onClick={() => { setEditingBudget(b); setActiveModal('add-budget'); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Budget">
                        <IconButton size="small" color="error" onClick={() => deleteBudget(b.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <span>Spent: <strong>{formatCurrency(spent)}</strong></span>
                      <span>Target: <strong>{formatCurrency(budget)}</strong></span>
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} color={isOver ? 'error' : 'success'} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: isOver ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                    {isOver ? `Overby ${formatCurrency(spent - budget)}` : `${(100 - progress).toFixed(0)}% Left (${formatCurrency(budget - spent)})`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default BudgetView;
