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
  Button,
  Tooltip,
  Select,
  MenuItem
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
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
import PaletteIcon from '@mui/icons-material/Palette';
import { useFinance } from '../context/FinanceContext.jsx';

const drawerWidth = 280;
const collapsedWidth = 72;

const Sidebar = ({ mobileOpen, onClose, desktopOpen = true, onDesktopClose }) => {
  const { currentView, setCurrentView, isAuthenticated, handleGoogleLogin, theme, setTheme } = useFinance();

  const handleNavClick = (id) => {
    setCurrentView(id);
    if (onClose) {
      onClose();
    }
  };

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

  const renderDrawerContent = (isCollapsed = false) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar Header Brand Logo + Mobile Close (X) & Desktop Collapse (<) Buttons */}
      <Box
        sx={{
          p: isCollapsed ? 1.5 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between'
        }}
      >
        <Box
          onClick={isCollapsed ? onDesktopClose : undefined}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: isCollapsed ? 'pointer' : 'default'
          }}
        >
          <Tooltip title={isCollapsed ? "Click to Expand Sidebar" : ""} placement="right">
            <img src="logo.png" alt="RS-25F MIND Logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          </Tooltip>
          {!isCollapsed && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, background: 'linear-gradient(135deg, #10b981, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                RS-25F MIND
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>
                SMART FINANCE
              </Typography>
            </Box>
          )}
        </Box>

        {!isCollapsed && (
          <>
            {/* Mobile Close Icon Button (X) */}
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                '&:hover': { background: 'rgba(239, 68, 68, 0.25)' }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            {/* Desktop Collapse Icon Button (<) */}
            <IconButton
              onClick={onDesktopClose}
              size="small"
              sx={{
                display: { xs: 'none', md: 'flex' },
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                '&:hover': { background: 'rgba(56, 189, 248, 0.25)' }
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      <Box sx={{ overflowY: 'auto', flex: 1, p: isCollapsed ? 1 : 1.5 }}>
        {!isCollapsed && (
          <Typography variant="caption" sx={{ px: 1.5, py: 1, display: 'block', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            Core Modules
          </Typography>
        )}
        <List disablePadding>
          {coreNavItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={isCollapsed ? item.label : ""} placement="right">
                <ListItemButton
                  selected={currentView === item.id}
                  onClick={() => handleNavClick(item.id)}
                  sx={{
                    borderRadius: 3,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 1 : 2,
                    minHeight: 44,
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.15))',
                      borderLeft: isCollapsed ? 'none' : '4px solid #10b981',
                      border: isCollapsed ? '1px solid #10b981' : undefined
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 38, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: currentView === item.id ? 700 : 500 }} />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        {!isCollapsed && (
          <Typography variant="caption" sx={{ px: 1.5, py: 1, display: 'block', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            Analytics & Tools
          </Typography>
        )}
        <List disablePadding>
          {analyticsNavItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={isCollapsed ? item.label : ""} placement="right">
                <ListItemButton
                  selected={currentView === item.id}
                  onClick={() => handleNavClick(item.id)}
                  sx={{
                    borderRadius: 3,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 1 : 2,
                    minHeight: 44,
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.15))',
                      borderLeft: isCollapsed ? 'none' : '4px solid #10b981',
                      border: isCollapsed ? '1px solid #10b981' : undefined
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 38, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: currentView === item.id ? 700 : 500 }} />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Theme Selector in Sidebar Footer */}
      {!isCollapsed && (
        <Box sx={{ px: 2, py: 1, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>
            🎨 APP THEME COLOR:
          </Typography>
          <Select
            size="small"
            fullWidth
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            sx={{
              borderRadius: 2,
              fontSize: '0.78rem',
              height: 32,
              background: 'rgba(255,255,255,0.05)',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
              '& .MuiSelect-select': { py: 0.4, px: 1 }
            }}
          >
            <MenuItem value="relentless">🔥 Crimson Red</MenuItem>
            <MenuItem value="cyber">🎨 Cyber Cyan</MenuItem>
            <MenuItem value="purple">💜 Neon Purple</MenuItem>
            <MenuItem value="emerald">🟢 Emerald Green</MenuItem>
            <MenuItem value="sunset">🌅 Sunset Amber</MenuItem>
            <MenuItem value="ocean">🌊 Deep Ocean</MenuItem>
            <MenuItem value="rose">🌸 Passion Rose</MenuItem>
            <MenuItem value="lime">⚡ Electric Lime</MenuItem>
            <MenuItem value="slate">🪙 Metallic Slate</MenuItem>
          </Select>
        </Box>
      )}

      {/* Footer Sheet Connection Status */}
      <Box sx={{ p: isCollapsed ? 1.5 : 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Tooltip title={isAuthenticated ? "Google Sheet Connected" : "Sign In Required"} placement="right">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%' }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: isAuthenticated ? '#10b981' : '#ef4444', boxShadow: isAuthenticated ? '0 0 8px #10b981' : 'none' }} />
            {!isCollapsed && (
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {isAuthenticated ? 'Connected' : 'Sign In Required'}
              </Typography>
            )}
          </Box>
        </Tooltip>
        {!isCollapsed && !isAuthenticated && (
          <Button variant="outlined" color="primary" fullWidth size="small" onClick={handleGoogleLogin} sx={{ mt: 0.5, borderRadius: 2 }}>
            Connect Sheet
          </Button>
        )}
      </Box>
    </Box>
  );

  const activeWidth = desktopOpen ? drawerWidth : collapsedWidth;

  return (
    <Box component="nav" sx={{ width: { md: activeWidth }, flexShrink: { md: 0 }, transition: 'width 0.3s ease' }}>
      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'rgba(11, 7, 9, 0.96)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)'
          },
        }}
      >
        {renderDrawerContent(false)}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: activeWidth,
            boxSizing: 'border-box',
            background: 'rgba(11, 7, 9, 0.92)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'width 0.3s ease',
            overflowX: 'hidden'
          },
        }}
        open
      >
        {renderDrawerContent(!desktopOpen)}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
