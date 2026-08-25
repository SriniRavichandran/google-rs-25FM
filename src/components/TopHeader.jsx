import React from 'react';
import { useFinance } from '../context/FinanceContext.jsx';

const TopHeader = () => {
  const { currentView, theme, setTheme, isAuthenticated, handleGoogleLogin, handleGoogleLogout, setActiveModal } = useFinance();

  const titleMap = {
    'dashboard': 'Dashboard Overview',
    'credit-cards': 'Credit Cards (Credit)',
    'bank-accounts': 'Debit Cards & Bank Accounts (Debit)',
    'cash-flow': 'Cash Flow (Cash)',
    'investments': 'Trade & Investments (Trade)',
    'loans-given': 'Loans Given (Given_Loan)',
    'loans-taken': 'Loans Taken (Taken_Loan)',
    'budget': 'Budget vs Actual Tracking',
    'bills': 'Bills & Subscriptions Tracker',
    'goals': 'Financial Goals & Milestones',
    'reviews': 'Daily, Weekly & Monthly Reviews',
    'net-worth': 'Net-Worth & Wealth Tracker'
  };

  return (
    <header className="top-header">
      <div className="header-title-container">
        <h1 className="page-title">{titleMap[currentView] || 'RS-25F MIND'}</h1>
      </div>

      <div className="header-actions">
        <select value={theme} onChange={(e) => setTheme(e.target.value)} className="theme-picker" title="Choose Color Theme Preference">
          <option value="relentless">🔥 RS-25 Crimson</option>
          <option value="cyber">🎨 Cyber Cyan</option>
          <option value="purple">💜 Purple Velvet</option>
          <option value="emerald">🟢 Emerald Mint</option>
          <option value="sunset">🌅 Sunset Amber</option>
          <option value="ocean">🌊 Ocean Sapphire</option>
          <option value="rose">🌸 Rose Gold</option>
          <option value="lime">⚡ Neon Lime</option>
          <option value="slate">🪙 Titanium Slate</option>
        </select>

        {!isAuthenticated ? (
          <button className="btn btn-google" onClick={handleGoogleLogin}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/></svg>
            Sign in with Google
          </button>
        ) : (
          <button className="btn btn-danger btn-sm" onClick={handleGoogleLogout}>Sign Out</button>
        )}

        <button className="btn btn-primary" onClick={() => setActiveModal('add-transaction')}>
          <span>+ Add Row / Amount</span>
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
