import React from 'react';
import { useFinance } from '../context/FinanceContext.jsx';

const PeriodTrackerBar = () => {
  const { selectedPeriod, setSelectedPeriod, customStartDate, setCustomStartDate, customEndDate, setCustomEndDate } = useFinance();

  return (
    <div className="period-tracker-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tracking Period:</span>
        <button className={`period-pill ${selectedPeriod === 'daily' ? 'active' : ''}`} onClick={() => setSelectedPeriod('daily')}>📅 Daily</button>
        <button className={`period-pill ${selectedPeriod === 'weekly' ? 'active' : ''}`} onClick={() => setSelectedPeriod('weekly')}>📆 Weekly</button>
        <button className={`period-pill ${selectedPeriod === 'monthly' ? 'active' : ''}`} onClick={() => setSelectedPeriod('monthly')}>📅 Monthly</button>
        <button className={`period-pill ${selectedPeriod === 'yearly' ? 'active' : ''}`} onClick={() => setSelectedPeriod('yearly')}>📆 Yearly</button>
        <button className={`period-pill ${selectedPeriod === 'custom' ? 'active' : ''}`} onClick={() => setSelectedPeriod('custom')}>⚙️ Custom Range</button>

        {selectedPeriod === 'custom' && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
            <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="form-input" style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem', width: '130px' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>to</span>
            <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="form-input" style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem', width: '130px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PeriodTrackerBar;
