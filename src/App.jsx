import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { FinanceProvider, useFinance } from './context/FinanceContext.jsx';
import { getMuiTheme } from './theme.js';
import ThreeBackground from './components/ThreeBackground.jsx';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import PeriodTrackerBar from './components/PeriodTrackerBar.jsx';
import DashboardView from './views/DashboardView.jsx';
import AddTransactionModal from './components/Modals/AddTransactionModal.jsx';

const MainAppContent = () => {
  const { theme } = useFinance();
  const muiTheme = getMuiTheme(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', overflowX: 'hidden' }}>
          <TopHeader />
          <PeriodTrackerBar />
          <DashboardView />
        </Box>
        <AddTransactionModal />
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
