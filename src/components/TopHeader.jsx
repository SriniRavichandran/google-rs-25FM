import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Button,
  Box,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import SyncIcon from '@mui/icons-material/Sync';
import { useFinance } from '../context/FinanceContext.jsx';

const TopHeader = () => {
  const {
    currentView,
    theme,
    setTheme,
    isAuthenticated,
    handleGoogleLogin,
    handleGoogleLogout,
    setActiveModal,
    refreshData,
    isLoading
  } = useFinance();

  const titleMap = {
    'dashboard': 'Dashboard Overview',
    'credit-cards': 'Credit Cards',
    'bank-accounts': 'Debit Cards & Bank Accounts',
    'cash-flow': 'Cash Flow',
    'investments': 'Trade & Investments',
    'loans-given': 'Loans Given',
    'loans-taken': 'Loans Taken',
    'budget': 'Budget vs Actual Tracking',
    'bills': 'Bills & Subscriptions Tracker',
    'goals': 'Financial Goals & Milestones',
    'reviews': 'Daily, Weekly & Monthly Reviews',
    'net-worth': 'Net-Worth & Wealth Tracker'
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(11, 7, 9, 0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        ml: { sm: '280px' }
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {titleMap[currentView] || 'RS-25F MIND'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Manual Google Sheet Sync Button */}
          {isAuthenticated && (
            <Tooltip title="Force Sync All Sheet Tabs & Headers">
              <Button
                variant="outlined"
                color="info"
                size="small"
                startIcon={<SyncIcon className={isLoading ? 'spin' : ''} />}
                onClick={() => refreshData()}
                sx={{ borderRadius: 3 }}
              >
                Sync Sheet Headers
              </Button>
            </Tooltip>
          )}

          {/* Theme Selector */}
          <Select
            size="small"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            sx={{
              borderRadius: 3,
              fontSize: '0.85rem',
              background: 'rgba(255,255,255,0.05)',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }
            }}
          >
            <MenuItem value="relentless">🔥 RS-25 Crimson</MenuItem>
            <MenuItem value="cyber">🎨 Cyber Cyan</MenuItem>
            <MenuItem value="purple">💜 Purple Velvet</MenuItem>
            <MenuItem value="emerald">🟢 Emerald Mint</MenuItem>
            <MenuItem value="sunset">🌅 Sunset Amber</MenuItem>
            <MenuItem value="ocean">🌊 Ocean Sapphire</MenuItem>
            <MenuItem value="rose">🌸 Rose Gold</MenuItem>
            <MenuItem value="lime">⚡ Neon Lime</MenuItem>
            <MenuItem value="slate">🪙 Titanium Slate</MenuItem>
          </Select>

          {/* Google Auth Buttons */}
          {!isAuthenticated ? (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LockIcon />}
              onClick={handleGoogleLogin}
              sx={{ borderRadius: 3 }}
            >
              Sign in with Google
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<LogoutIcon />}
              onClick={handleGoogleLogout}
              sx={{ borderRadius: 3 }}
            >
              Sign Out
            </Button>
          )}

          {/* Add Row Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setActiveModal('add-transaction')}
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}
          >
            Add Row / Amount
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopHeader;
