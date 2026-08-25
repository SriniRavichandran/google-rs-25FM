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

const LoansTakenView = () => {
  const { data, totalLoansTaken, setActiveModal } = useFinance();

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const totalPrincipal = data.loansTaken.reduce((s, l) => s + (parseFloat(l.amountTaken) || 0), 0);
  const totalRepaid = data.loansTaken.reduce((s, l) => s + (parseFloat(l.amountRepaid) || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            💸 Loans Taken & Borrowed Liabilities
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Track personal loans, bank loans, money borrowed from others, interest rates, and payoff progress
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setActiveModal('add-loan-taken')}>
          + Add Loan Taken
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Borrowed Principal</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{formatCurrency(totalPrincipal)}</Typography>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>Total Debt Incurred</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Outstanding Debt Remaining</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{formatCurrency(totalLoansTaken)}</Typography>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>{data.loansTaken.length} Active Debts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Total Debt Repaid</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{formatCurrency(totalRepaid)}</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Paid Off Funds</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Payoff Progress %</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{totalPrincipal > 0 ? ((totalRepaid / totalPrincipal) * 100).toFixed(1) : '0.0'}%</Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>Debt Repayment</Typography>
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
                  <TableCell sx={{ fontWeight: 700 }}>Lender / Bank Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount Borrowed</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Interest Rate (%)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date Taken</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount Repaid</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Outstanding Debt</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.loansTaken.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No borrowed loans recorded. Click <strong>"+ Add Loan Taken"</strong> to track liabilities!
                    </TableCell>
                  </TableRow>
                ) : data.loansTaken.map((l) => {
                  const outstanding = parseFloat(l.outstandingBalance) || (parseFloat(l.amountTaken) - (parseFloat(l.amountRepaid) || 0));
                  const isPaid = outstanding <= 0;
                  return (
                    <TableRow key={l.id} hover>
                      <TableCell><strong>{l.lenderName}</strong></TableCell>
                      <TableCell>{formatCurrency(l.amountTaken)}</TableCell>
                      <TableCell>{l.interestRate || 0}%</TableCell>
                      <TableCell>{l.dateTaken}</TableCell>
                      <TableCell>{l.dueDate || 'No Due Date'}</TableCell>
                      <TableCell sx={{ color: '#10b981' }}>{formatCurrency(l.amountRepaid || 0)}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: isPaid ? '#10b981' : '#ef4444' }}>{formatCurrency(outstanding)}</TableCell>
                      <TableCell>
                        <Chip label={isPaid ? 'PAID OFF' : 'ACTIVE DEBT'} size="small" color={isPaid ? 'success' : 'error'} sx={{ fontWeight: 700 }} />
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

export default LoansTakenView;
