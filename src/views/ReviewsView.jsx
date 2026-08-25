import React from 'react';
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
import { useFinance } from '../context/FinanceContext.jsx';

const ReviewsView = () => {
  const { data, setActiveModal, setEditingReview, deleteReview } = useFinance();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            📝 Daily, Weekly & Monthly Reviews
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Log checkups, reflect on spending habits, self-grade financial performance, and record action plans
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-review')}>
          + Log Review Note
        </Button>
      </Box>

      {/* Review Entries */}
      <Grid container spacing={2.5}>
        {data.reviews.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>No review entries logged yet.</Typography>
              <Button variant="contained" color="primary" onClick={() => setActiveModal('add-review')}>+ Log Review Note</Button>
            </Card>
          </Grid>
        ) : data.reviews.map(r => (
          <Grid item xs={12} md={6} key={r.id}>
            <Card sx={{ borderLeft: '4px solid #84cc16' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{r.type}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Date: {r.date}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={`Grade ${r.grade}`} size="small" color="success" sx={{ fontWeight: 800 }} />
                    <Tooltip title="Edit Note">
                      <IconButton size="small" color="primary" onClick={() => { setEditingReview(r); setActiveModal('add-review'); }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Note">
                      <IconButton size="small" color="error" onClick={() => deleteReview(r.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: 'pre-line', p: 2, background: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                  {r.notes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReviewsView;
