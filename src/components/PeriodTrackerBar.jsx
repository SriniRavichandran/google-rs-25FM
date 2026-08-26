import React from 'react';
import { Box, Typography, Button, TextField, Stack } from '@mui/material';
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
    { id: 'daily', label: 'Daily', icon: <CalendarTodayIcon sx={{ fontSize: 15 }} /> },
    { id: 'weekly', label: 'Weekly', icon: <DateRangeIcon sx={{ fontSize: 15 }} /> },
    { id: 'monthly', label: 'Monthly', icon: <CalendarTodayIcon sx={{ fontSize: 15 }} /> },
    { id: 'yearly', label: 'Yearly', icon: <DateRangeIcon sx={{ fontSize: 15 }} /> },
    { id: 'custom', label: 'Custom Range', icon: <TuneIcon sx={{ fontSize: 15 }} /> }
  ];

  return (
    <Box
      sx={{
        py: 1,
        px: 3,
        background: 'rgba(11, 7, 9, 0.65)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        ml: { sm: '280px' },
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap'
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
        Tracking Period:
      </Typography>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
        {periods.map((p) => {
          const isActive = selectedPeriod === p.id;
          return (
            <Button
              key={p.id}
              size="small"
              variant={isActive ? 'contained' : 'outlined'}
              color={isActive ? 'primary' : 'inherit'}
              startIcon={p.icon}
              onClick={() => setSelectedPeriod(p.id)}
              sx={{
                borderRadius: 3,
                fontSize: '0.78rem',
                py: 0.4,
                px: 1.5,
                fontWeight: isActive ? 700 : 500,
                borderColor: isActive ? 'primary.main' : 'rgba(255,255,255,0.15)',
                background: isActive ? undefined : 'rgba(255,255,255,0.03)',
                '&:hover': {
                  background: isActive ? undefined : 'rgba(255,255,255,0.08)',
                  borderColor: isActive ? 'primary.dark' : 'rgba(255,255,255,0.3)'
                }
              }}
            >
              {p.label}
            </Button>
          );
        })}
      </Stack>

      {selectedPeriod === 'custom' && (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, ml: { sm: 1 } }}>
          <TextField
            size="small"
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            sx={{
              width: 140,
              '& .MuiInputBase-input': { py: 0.5, px: 1, fontSize: '0.78rem' },
              '& .MuiOutlinedInput-root': { borderRadius: 2, background: 'rgba(255,255,255,0.05)' }
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>to</Typography>
          <TextField
            size="small"
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            sx={{
              width: 140,
              '& .MuiInputBase-input': { py: 0.5, px: 1, fontSize: '0.78rem' },
              '& .MuiOutlinedInput-root': { borderRadius: 2, background: 'rgba(255,255,255,0.05)' }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PeriodTrackerBar;
