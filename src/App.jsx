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

import AddTransactionModal from './components/Modals/AddTransactionModal.jsx';
import AddCreditCardModal from './components/Modals/AddCreditCardModal.jsx';
import AddBankAccountModal from './components/Modals/AddBankAccountModal.jsx';
import AddTradeModal from './components/Modals/AddTradeModal.jsx';
import AddLoanGivenModal from './components/Modals/AddLoanGivenModal.jsx';
import AddLoanTakenModal from './components/Modals/AddLoanTakenModal.jsx';

const MainAppContent = () => {
  const { currentView, theme } = useFinance();
  const muiTheme = getMuiTheme(theme);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'credit-cards': return <CreditCardsView />;
      case 'bank-accounts': return <BankAccountsView />;
      case 'cash-flow': return <CashFlowView />;
      case 'investments': return <InvestmentsView />;
      case 'loans-given': return <LoansGivenView />;
      case 'loans-taken': return <LoansTakenView />;
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', overflowX: 'hidden' }}>
          <TopHeader />
          <PeriodTrackerBar />
          {renderCurrentView()}
        </Box>
        <AddTransactionModal />
        <AddCreditCardModal />
        <AddBankAccountModal />
        <AddTradeModal />
        <AddLoanGivenModal />
        <AddLoanTakenModal />
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
