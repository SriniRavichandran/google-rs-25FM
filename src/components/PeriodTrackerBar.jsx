import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TuneIcon from '@mui/icons-material/Tune';
import { useFinance } from '../context/FinanceContext.jsx';

const PeriodTrackerBar = () => {
  const {
    selectedPeriod,
    setSelectedPeriod,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate
  } = useFinance();

  const periods = [
    { id: 'daily', label: 'Daily', icon: <CalendarTodayIcon sx={{ fontSize: 14 }} /> },
    { id: 'weekly', label: 'Weekly', icon: <DateRangeIcon sx={{ fontSize: 14 }} /> },
    { id: 'monthly', label: 'Monthly', icon: <CalendarTodayIcon sx={{ fontSize: 14 }} /> },
    { id: 'yearly', label: 'Yearly', icon: <DateRangeIcon sx={{ fontSize: 14 }} /> },
    { id: 'custom', label: 'Custom Range', icon: <TuneIcon sx={{ fontSize: 14 }} /> }
  ];

  return (
    <Box
      sx={{
        py: 1,
        px: { xs: 1.5, sm: 3 },
        background: 'rgba(11, 7, 9, 0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        ml: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        width: '100%'
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 800,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: 1,
          whiteSpace: 'nowrap',
          fontSize: '0.7rem'
        }}
      >
        PERIOD:
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          overflowX: 'auto',
          maxWidth: '100%',
          py: 0.5,
          px: 0.5,
          '&::-webkit-scrollbar': { height: 3 },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.2)', borderRadius: 2 }
        }}
      >
        {periods.map((p) => {
          const isActive = selectedPeriod === p.id;
          return (
            <Box
              key={p.id}
              onClick={() => setSelectedPeriod(p.id)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                py: 0.5,
                px: 1.5,
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                userSelect: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                border: isActive
                  ? '1px solid #10b981'
                  : '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: isActive ? '0 2px 10px rgba(16, 185, 129, 0.35)' : 'none',
                '&:hover': {
                  background: isActive
                    ? 'linear-gradient(135deg, #059669, #047857)'
                    : 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  borderColor: isActive ? '#10b981' : 'rgba(255, 255, 255, 0.3)'
                },
                '& svg': {
                  color: 'inherit',
                  display: 'block'
                }
              }}
            >
              {p.icon}
              <span>{p.label}</span>
            </Box>
          );
        })}
      </Box>

      {selectedPeriod === 'custom' && (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, ml: { sm: 1 }, flexWrap: 'nowrap', flexShrink: 0 }}>
          <TextField
            size="small"
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            sx={{
              width: 130,
              '& .MuiInputBase-input': { py: 0.4, px: 1, fontSize: '0.72rem', color: '#ffffff' },
              '& .MuiOutlinedInput-root': { borderRadius: 2, background: 'rgba(255,255,255,0.06)' }
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>to</Typography>
          <TextField
            size="small"
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            sx={{
              width: 130,
              '& .MuiInputBase-input': { py: 0.4, px: 1, fontSize: '0.72rem', color: '#ffffff' },
              '& .MuiOutlinedInput-root': { borderRadius: 2, background: 'rgba(255,255,255,0.06)' }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PeriodTrackerBar;
