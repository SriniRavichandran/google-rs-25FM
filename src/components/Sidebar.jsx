import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Button
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HandshakeIcon from '@mui/icons-material/Handshake';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useFinance } from '../context/FinanceContext.jsx';

const drawerWidth = 280;

const Sidebar = () => {
  const { currentView, setCurrentView, isAuthenticated, handleGoogleLogin } = useFinance();

  const coreNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon color="primary" /> },
    { id: 'cash-flow', label: 'Cash Flow', icon: <AttachMoneyIcon style={{ color: '#10b981' }} /> },
    { id: 'bank-accounts', label: 'Debit Cards & Bank', icon: <AccountBalanceIcon style={{ color: '#38bdf8' }} /> },
    { id: 'credit-cards', label: 'Credit Cards', icon: <CreditCardIcon style={{ color: '#ef4444' }} /> },
    { id: 'investments', label: 'Trade & Investments', icon: <TrendingUpIcon style={{ color: '#f59e0b' }} /> },
    { id: 'loans-given', label: 'Loans Given', icon: <HandshakeIcon style={{ color: '#10b981' }} /> },
    { id: 'loans-taken', label: 'Loans Taken', icon: <MoneyOffIcon style={{ color: '#ef4444' }} /> },
  ];

  const analyticsNavItems = [
    { id: 'budget', label: 'Budget vs Actual', icon: <TrackChangesIcon style={{ color: '#a855f7' }} /> },
    { id: 'bills', label: 'Bills & Subscriptions', icon: <AutorenewIcon style={{ color: '#38bdf8' }} /> },
    { id: 'goals', label: 'Financial Goals', icon: <EmojiEventsIcon style={{ color: '#fbbf24' }} /> },
    { id: 'reviews', label: 'Daily/Weekly Review', icon: <EventNoteIcon style={{ color: '#84cc16' }} /> },
    { id: 'net-worth', label: 'Net-Worth Tracker', icon: <ShowChartIcon style={{ color: '#10b981' }} /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'rgba(11, 7, 9, 0.92)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)'
        },
      }}
    >
      {/* Sidebar Header Brand Logo */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <img src="logo.png" alt="RS-25F MIND Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, background: 'linear-gradient(135deg, #10b981, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            RS-25F MIND
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>
            SMART FINANCE
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      <Box sx={{ overflowY: 'auto', flex: 1, p: 1.5 }}>
        <Typography variant="caption" sx={{ px: 1.5, py: 1, display: 'block', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
          Core Modules
        </Typography>
        <List disablePadding>
          {coreNavItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={currentView === item.id}
                onClick={() => setCurrentView(item.id)}
                sx={{
                  borderRadius: 3,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.15))',
                    borderLeft: '4px solid #10b981'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: currentView === item.id ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        <Typography variant="caption" sx={{ px: 1.5, py: 1, display: 'block', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
          Analytics & Tools
        </Typography>
        <List disablePadding>
          {analyticsNavItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={currentView === item.id}
                onClick={() => setCurrentView(item.id)}
                sx={{
                  borderRadius: 3,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.15))',
                    borderLeft: '4px solid #10b981'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: currentView === item.id ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer Sheet Connection Status */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0,0,0,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: isAuthenticated ? '#10b981' : '#ef4444', boxShadow: isAuthenticated ? '0 0 8px #10b981' : 'none' }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {isAuthenticated ? 'Connected' : 'Sign In Required'}
            </Typography>
          </Box>
        </Box>
        {!isAuthenticated && (
          <Button variant="outlined" color="primary" fullWidth size="small" onClick={handleGoogleLogin} sx={{ mt: 0.5, borderRadius: 2 }}>
            Connect Sheet
          </Button>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
