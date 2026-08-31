import React from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction, Fab, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddIcon from '@mui/icons-material/Add';
import { useFinance } from '../context/FinanceContext.jsx';

const MobileBottomBar = () => {
  const { currentView, setCurrentView, setActiveModal } = useFinance();

  const navValueMap = {
    'dashboard': 0,
    'cash-flow': 1,
    'credit-cards': 3,
    'bills': 4
  };

  const currentTab = navValueMap[currentView] !== undefined ? navValueMap[currentView] : false;

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        setCurrentView('dashboard');
        break;
      case 1:
        setCurrentView('cash-flow');
        break;
      case 3:
        setCurrentView('credit-cards');
        break;
      case 4:
        setCurrentView('bills');
        break;
      default:
        break;
    }
  };

  return (
    <Paper
      elevation={10}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: { xs: 'block', md: 'none' },
        background: 'rgba(11, 7, 9, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 'env(safe-area-inset-bottom)'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Floating Center Action Button */}
        <Tooltip title="Add Transaction / Record">
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => setActiveModal('add-transaction')}
            sx={{
              position: 'absolute',
              top: -24,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.5)',
              zIndex: 1300,
              width: 48,
              height: 48,
              '&:hover': {
                background: 'linear-gradient(135deg, #059669, #047857)'
              }
            }}
          >
            <AddIcon sx={{ fontSize: 28, color: '#ffffff' }} />
          </Fab>
        </Tooltip>

        <BottomNavigation
          showLabels
          value={currentTab}
          onChange={handleChange}
          sx={{
            background: 'transparent',
            height: 60,
            '& .MuiBottomNavigationAction-root': {
              color: 'text.secondary',
              minWidth: 0,
              py: 0.5,
              '&.Mui-selected': {
                color: '#10b981',
                fontWeight: 700
              }
            }
          }}
        >
          <BottomNavigationAction label="Overview" icon={<DashboardIcon fontSize="small" />} />
          <BottomNavigationAction label="Cash" icon={<AttachMoneyIcon fontSize="small" />} />

          {/* Spacer for center floating Add Button */}
          <BottomNavigationAction disabled icon={<Box sx={{ width: 32 }} />} sx={{ pointerEvents: 'none' }} />

          <BottomNavigationAction label="Cards" icon={<CreditCardIcon fontSize="small" />} />
          <BottomNavigationAction label="Bills" icon={<AutorenewIcon fontSize="small" />} />
        </BottomNavigation>
      </Box>
    </Paper>
  );
};

export default MobileBottomBar;
