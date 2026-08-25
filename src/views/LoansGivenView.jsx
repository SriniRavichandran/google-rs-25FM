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
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useFinance } from '../context/FinanceContext.jsx';

const LoansGivenView = () => {
  const { data, totalLoansGiven, setActiveModal } = useFinance();

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const totalPrincipal = data.loansGiven.reduce((s, l) => s + (parseFloat(l.amountGiven) || 0), 0);
  const totalRepaid = data.loansGiven.reduce((s, l) => s + (parseFloat(l.amountRepaid) || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            🤝 Loans Given & Money Owed to Me
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Track money lent to friends/family/business, interest terms, repayment status, and outstanding dues
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-loan-given')}>
          + Add Loan Given
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Principal Given</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{formatCurrency(totalPrincipal)}</Typography>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600 }}>Capital Lent</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Outstanding Owed to Me</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalLoansGiven)}</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>{data.loansGiven.length} Active Loans</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Amount Repaid</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', my: 0.5 }}>{formatCurrency(totalRepaid)}</Typography>
              <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600 }}>Recovered Funds</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Recovery Rate %</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{totalPrincipal > 0 ? ((totalRepaid / totalPrincipal) * 100).toFixed(1) : '0.0'}%</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Repayment Progress</Typography>
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
                  <TableCell sx={{ fontWeight: 700 }}>Borrower Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount Given</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Interest Rate (%)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date Given</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Repaid Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Outstanding Owed</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.loansGiven.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No loans recorded. Click <strong>"+ Add Loan Given"</strong> to track money lent!
                    </TableCell>
                  </TableRow>
                ) : data.loansGiven.map((l) => {
                  const outstanding = parseFloat(l.outstandingOwed) || (parseFloat(l.amountGiven) - (parseFloat(l.amountRepaid) || 0));
                  const isPaid = outstanding <= 0;
                  return (
                    <TableRow key={l.id} hover>
                      <TableCell><strong>{l.borrowerName}</strong></TableCell>
                      <TableCell>{formatCurrency(l.amountGiven)}</TableCell>
                      <TableCell>{l.interestRate || 0}%</TableCell>
                      <TableCell>{l.dateGiven}</TableCell>
                      <TableCell>{l.dueDate || 'No Due Date'}</TableCell>
                      <TableCell sx={{ color: '#10b981' }}>{formatCurrency(l.amountRepaid || 0)}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: isPaid ? '#10b981' : '#ef4444' }}>{formatCurrency(outstanding)}</TableCell>
                      <TableCell>
                        <Chip label={isPaid ? 'REPAID' : 'ACTIVE'} size="small" color={isPaid ? 'success' : 'error'} sx={{ fontWeight: 700 }} />
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

export default LoansGivenView;
