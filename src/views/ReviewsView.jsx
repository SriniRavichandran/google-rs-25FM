import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

const ReviewsView = () => {
  const { data, setActiveModal, setEditingReview, deleteReview } = useFinance();
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            📝 Daily, Weekly & Monthly Reviews
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Log checkups, reflect on spending habits, self-grade financial performance, and record action plans
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setEditingReview(null); setActiveModal('add-review'); }}>
          Log Review Note
        </Button>
      </Box>

      {/* Review Entries */}
      <Grid container spacing={2}>
        {data.reviews.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>No review entries logged yet.</Typography>
              <Button variant="contained" color="primary" onClick={() => { setEditingReview(null); setActiveModal('add-review'); }}>Log Review Note</Button>
            </Card>
          </Grid>
        ) : data.reviews.map((r, idx) => (
          <Grid item xs={12} md={6} key={r.id}>
            <Card sx={{ borderLeft: '4px solid #84cc16', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={`#${idx + 1}`} size="small" sx={{ fontWeight: 800, fontSize: '0.72rem', height: 22, background: 'rgba(255,255,255,0.08)' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>{r.type}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Date: {r.date}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={`Grade ${r.grade}`} size="small" color="success" sx={{ fontWeight: 800 }} />
                    <Tooltip title="Edit Note">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          '&:hover': { background: 'rgba(56, 189, 248, 0.3)' }
                        }}
                        onClick={() => { setEditingReview(r); setActiveModal('add-review'); }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Note">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#ef4444',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          '&:hover': { background: 'rgba(239, 68, 68, 0.3)' }
                        }}
                        onClick={() => setDeleteTarget(r)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: 'pre-line', p: 2, background: 'rgba(255,255,255,0.03)', borderRadius: 2, fontSize: '0.85rem' }}>
                  {r.notes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteReview(deleteTarget.id)}
        label={deleteTarget ? `review note "${deleteTarget.type} (${deleteTarget.date})"` : ''}
      />
    </Box>
  );
};

export default ReviewsView;
