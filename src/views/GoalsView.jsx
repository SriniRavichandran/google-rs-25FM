import React, { useState } from 'react';
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
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const GoalsView = () => {
  const { data, setActiveModal, setEditingGoal, deleteGoal } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const totalTarget = data.goals.reduce((s, g) => s + (parseFloat(g.targetAmount) || 0), 0);
  const totalSaved = data.goals.reduce((s, g) => s + (parseFloat(g.savedAmount) || 0), 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            🏆 Financial Goals & Milestones
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Set long-term savings goals, target dates, emergency funds, and track progress
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingGoal(null); setActiveModal('add-goal'); }}>
          Create Financial Goal
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Target Capital</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalTarget)}</Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Across {data.goals.length} Goals</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Currently Accumulated</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalSaved)}</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Saved Capital</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Overall Goal Progress</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#fbbf24', my: 0.5 }}>{overallProgress.toFixed(1)}%</Typography>
              <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 600 }}>Target Completion</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Goals Grid */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>🎯 Active Financial Milestones</Typography>
      <Grid container spacing={2}>
        {data.goals.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>No financial goals created yet.</Typography>
              <Button variant="contained" color="primary" onClick={() => { setEditingGoal(null); setActiveModal('add-goal'); }}>Create Financial Goal</Button>
            </Card>
          </Grid>
        ) : data.goals.map((g, idx) => {
          const target = parseFloat(g.targetAmount) || 1;
          const saved = parseFloat(g.savedAmount) || 0;
          const progress = Math.min((saved / target) * 100, 100);

          return (
            <Grid item xs={12} sm={6} md={4} key={g.id}>
              <Card sx={{ borderLeft: `4px solid ${progress >= 100 ? '#10b981' : '#fbbf24'}`, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={`#${idx + 1}`} size="small" sx={{ fontWeight: 800, fontSize: '0.72rem', height: 22, background: 'rgba(255,255,255,0.08)' }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>{g.title}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit Goal">
                        <IconButton
                          size="small"
                          sx={{
                            color: '#38bdf8',
                            background: 'rgba(56, 189, 248, 0.15)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            '&:hover': { background: 'rgba(56, 189, 248, 0.3)' }
                          }}
                          onClick={() => { setEditingGoal(g); setActiveModal('add-goal'); }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Goal">
                        <IconButton
                          size="small"
                          sx={{
                            color: '#ef4444',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            '&:hover': { background: 'rgba(239, 68, 68, 0.3)' }
                          }}
                          onClick={() => setDeleteTarget(g)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap' }}>
                      <span>Saved: <strong>{formatCurrency(saved)}</strong></span>
                      <span>Target: <strong>{formatCurrency(target)}</strong></span>
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} color={progress >= 100 ? 'success' : 'warning'} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>{progress.toFixed(1)}% Achieved</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Target Date: <strong>{g.targetDate}</strong></Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteGoal(deleteTarget.id)}
        label={deleteTarget ? `goal "${deleteTarget.title}"` : ''}
      />
    </Box>
  );
};

export default GoalsView;
