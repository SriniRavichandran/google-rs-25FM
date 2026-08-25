import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useFinance } from '../context/FinanceContext.jsx';

const CreditCardsView = () => {
  const { data, totalCreditLimit, totalCreditOutstanding, creditUtil, setActiveModal } = useFinance();

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            💳 Credit Card Usage & Limit Health
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Track total limits, outstanding dues, utilization %, and billing cycles
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-credit-card')}>
          + Add New Credit Card
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Credit Limit</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalCreditLimit)}</Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Across {data.creditCards.length} Cards</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Outstanding Dues</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{formatCurrency(totalCreditOutstanding)}</Typography>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>Due for payment</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Available Credit Limit</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalCreditLimit - totalCreditOutstanding)}</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Ready to use</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Overall Utilization Rate</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: creditUtil > 50 ? '#ef4444' : '#10b981', my: 0.5 }}>{creditUtil.toFixed(1)}%</Typography>
              <Typography variant="caption" sx={{ color: creditUtil > 50 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                {creditUtil < 30 ? 'Optimal Limit' : creditUtil < 50 ? 'Moderate' : 'High Alert'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Credit Cards Grid */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>💳 Your Registered Credit Cards</Typography>
      <Grid container spacing={2.5}>
        {data.creditCards.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>No credit cards added yet.</Typography>
              <Button variant="contained" color="primary" onClick={() => setActiveModal('add-credit-card')}>+ Add New Credit Card</Button>
            </Card>
          </Grid>
        ) : data.creditCards.map(c => {
          const util = c.limit > 0 ? (c.outstanding / c.limit) * 100 : 0;
          return (
            <Grid item xs={12} sm={6} md={4} key={c.id}>
              <Card sx={{ borderLeft: `4px solid ${util > 50 ? '#ef4444' : '#10b981'}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{c.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.bank} • {c.network}</Typography>
                    </Box>
                    <Chip label={`${util.toFixed(1)}% Utilized`} size="small" color={util > 50 ? 'error' : 'success'} sx={{ fontWeight: 700 }} />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Outstanding Balance</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', fontFamily: 'JetBrains Mono' }}>{formatCurrency(c.outstanding)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Total Limit: <strong>{formatCurrency(c.limit)}</strong></Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Due Date: <strong>Day {c.dueDate}</strong></Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CreditCardsView;
