import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { FinanceProvider, useFinance } from './context/FinanceContext.jsx';
import { getMuiTheme } from './theme.js';

import ThreeBackground from './components/ThreeBackground.jsx';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import PeriodTrackerBar from './components/PeriodTrackerBar.jsx';

import DashboardView from './views/DashboardView.jsx';
import CreditCardsView from './views/CreditCardsView.jsx';
import BankAccountsView from './views/BankAccountsView.jsx';
import CashFlowView from './views/CashFlowView.jsx';
import InvestmentsView from './views/InvestmentsView.jsx';
import LoansGivenView from './views/LoansGivenView.jsx';
import LoansTakenView from './views/LoansTakenView.jsx';
import BudgetView from './views/BudgetView.jsx';
import BillsView from './views/BillsView.jsx';
import GoalsView from './views/GoalsView.jsx';
import ReviewsView from './views/ReviewsView.jsx';
import NetWorthView from './views/NetWorthView.jsx';

import AddTransactionModal from './components/Modals/AddTransactionModal.jsx';
import AddCreditCardModal from './components/Modals/AddCreditCardModal.jsx';
import AddBankAccountModal from './components/Modals/AddBankAccountModal.jsx';
import AddTradeModal from './components/Modals/AddTradeModal.jsx';
import AddLoanGivenModal from './components/Modals/AddLoanGivenModal.jsx';
import AddLoanTakenModal from './components/Modals/AddLoanTakenModal.jsx';
import AddBudgetModal from './components/Modals/AddBudgetModal.jsx';
import AddBillModal from './components/Modals/AddBillModal.jsx';
import AddGoalModal from './components/Modals/AddGoalModal.jsx';
import AddReviewModal from './components/Modals/AddReviewModal.jsx';

const MainAppContent = () => {
  const { currentView, theme } = useFinance();
  const muiTheme = getMuiTheme(theme);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'credit-cards': return <CreditCardsView />;
      case 'bank-accounts': return <BankAccountsView />;
      case 'cash-flow': return <CashFlowView />;
      case 'investments': return <InvestmentsView />;
      case 'loans-given': return <LoansGivenView />;
      case 'loans-taken': return <LoansTakenView />;
      case 'budget': return <BudgetView />;
      case 'bills': return <BillsView />;
      case 'goals': return <GoalsView />;
      case 'reviews': return <ReviewsView />;
      case 'net-worth': return <NetWorthView />;
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
        <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
          <TopHeader onMobileNavToggle={handleDrawerToggle} />
          <PeriodTrackerBar />
          {renderCurrentView()}
        </Box>
        <AddTransactionModal />
        <AddCreditCardModal />
        <AddBankAccountModal />
        <AddTradeModal />
        <AddLoanGivenModal />
        <AddLoanTakenModal />
        <AddBudgetModal />
        <AddBillModal />
        <AddGoalModal />
        <AddReviewModal />
      </Box>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <FinanceProvider>
      <ThreeBackground />
      <MainAppContent />
    </FinanceProvider>
  );
};

export default App;
