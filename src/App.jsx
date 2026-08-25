import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { FinanceProvider, useFinance } from './context/FinanceContext.jsx';
import { getMuiTheme } from './theme.js';
import ThreeBackground from './components/ThreeBackground.jsx';
import MuiSidebar from './components/MuiSidebar.jsx';
import MuiTopHeader from './components/MuiTopHeader.jsx';
import PeriodTrackerBar from './components/PeriodTrackerBar.jsx';
import MuiDashboardView from './views/MuiDashboardView.jsx';
import MuiAddTransactionModal from './components/Modals/MuiAddTransactionModal.jsx';

const MainAppContent = () => {
  const { theme } = useFinance();
  const muiTheme = getMuiTheme(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <MuiSidebar />
        <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', overflowX: 'hidden' }}>
          <MuiTopHeader />
          <PeriodTrackerBar />
          <MuiDashboardView />
        </Box>
        <MuiAddTransactionModal />
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
