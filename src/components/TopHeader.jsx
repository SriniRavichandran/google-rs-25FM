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
import MenuIcon from '@mui/icons-material/Menu';
import { useFinance } from '../context/FinanceContext.jsx';

const TopHeader = ({ onMobileNavToggle }) => {
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
        ml: { md: '280px', xs: 0 },
        width: { md: 'calc(100% - 280px)', xs: '100%' },
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 0.5, px: { xs: 1.5, sm: 2 }, minHeight: '56px !important', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMobileNavToggle}
            sx={{ mr: 1, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              fontSize: { xs: '0.95rem', sm: '1.25rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {titleMap[currentView] || 'RS-25F MIND'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
          {/* Theme Selector */}
          <Select
            size="small"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            sx={{
              borderRadius: 3,
              fontSize: '0.78rem',
              height: 34,
              maxWidth: { xs: 100, sm: 130 },
              background: 'rgba(255,255,255,0.05)',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
              '& .MuiSelect-select': { py: 0.6, px: 1 }
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
              sx={{ borderRadius: 2, whiteSpace: 'nowrap', fontSize: '0.78rem', height: 34, px: { xs: 1, sm: 1.5 } }}
            >
              Sign In
            </Button>
          ) : (
            <Tooltip title="Sign Out of Google">
              <IconButton
                color="error"
                size="small"
                onClick={handleGoogleLogout}
                sx={{ border: '1px solid rgba(239,68,68,0.5)', borderRadius: 2, display: { xs: 'flex', sm: 'none' } }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {isAuthenticated && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleGoogleLogout}
              sx={{
                borderRadius: 2,
                whiteSpace: 'nowrap',
                fontSize: '0.78rem',
                height: 34,
                borderColor: 'rgba(239,68,68,0.5)',
                display: { xs: 'none', sm: 'inline-flex' }
              }}
            >
              Sign Out
            </Button>
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
              px: { xs: 1, sm: 1.5 },
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              flexShrink: 0
            }}
          >
            Add Row
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopHeader;
