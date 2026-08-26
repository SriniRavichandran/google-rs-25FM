import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Button,
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Chip
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
    'cash-flow': 'Cash Flow',
    'bank-accounts': 'Debit Cards & Bank Accounts',
    'credit-cards': 'Credit Cards',
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
        background: 'rgba(11, 7, 9, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        ml: { sm: '280px' },
        width: { sm: 'calc(100% - 280px)' },
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 0.5, px: 2, minHeight: '56px !important', flexWrap: 'nowrap', gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {titleMap[currentView] || 'RS-25F MIND'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, flexWrap: 'nowrap' }}>

          {/* Theme Selector */}
          <Select
            size="small"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            sx={{
              borderRadius: 3,
              fontSize: '0.78rem',
              height: 34,
              background: 'rgba(255,255,255,0.05)',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
              '& .MuiSelect-select': { py: 0.6 }
            }}
          >
            <MenuItem value="relentless">🔥 Crimson</MenuItem>
            <MenuItem value="cyber">🎨 Cyan</MenuItem>
            <MenuItem value="purple">💜 Purple</MenuItem>
            <MenuItem value="emerald">🟢 Emerald</MenuItem>
            <MenuItem value="sunset">🌅 Amber</MenuItem>
            <MenuItem value="ocean">🌊 Ocean</MenuItem>
            <MenuItem value="rose">🌸 Rose</MenuItem>
            <MenuItem value="lime">⚡ Lime</MenuItem>
            <MenuItem value="slate">🪙 Slate</MenuItem>
          </Select>

          {/* Sync Button (only when authenticated) */}
          {isAuthenticated && (
            <Tooltip title="Force Sync All Sheet Tabs & Headers">
              <IconButton
                size="small"
                color="info"
                onClick={() => refreshData()}
                sx={{ border: '1px solid rgba(56,189,248,0.4)', borderRadius: 2 }}
              >
                <SyncIcon
                  fontSize="small"
                  sx={{
                    animation: isLoading ? 'spin 1s linear infinite' : 'none'
                  }}
                />
              </IconButton>
            </Tooltip>
          )}

          {/* Google Auth */}
          {!isAuthenticated ? (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<LockIcon />}
              onClick={handleGoogleLogin}
              sx={{ borderRadius: 2, whiteSpace: 'nowrap', fontSize: '0.78rem', height: 34 }}
            >
              Sign In
            </Button>
          ) : (
            <Tooltip title="Sign Out of Google">
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={handleGoogleLogout}
                sx={{ borderRadius: 2, whiteSpace: 'nowrap', fontSize: '0.78rem', height: 34, borderColor: 'rgba(239,68,68,0.5)' }}
              >
                Sign Out
              </Button>
            </Tooltip>
          )}

          {/* Add Row Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setActiveModal('add-transaction')}
            sx={{
              borderRadius: 2,
              whiteSpace: 'nowrap',
              fontSize: '0.78rem',
              height: 34,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              flexShrink: 0
            }}
          >
            + Add Row
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopHeader;
