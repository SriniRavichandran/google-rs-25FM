import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';

const Sidebar = () => {
  const { currentView, setCurrentView, isAuthenticated, handleGoogleLogin } = useFinance();
  const [mobileOpen, setMobileOpen] = useState(false);

  const coreNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'credit-cards', label: 'Credit Cards (Credit)', icon: '💳' },
    { id: 'bank-accounts', label: 'Debit Cards & Bank (Debit)', icon: '💳' },
    { id: 'cash-flow', label: 'Cash Flow (Cash)', icon: '💰' },
    { id: 'investments', label: 'Trade & Investments (Trade)', icon: '📈' },
    { id: 'loans-given', label: 'Loans Given (Given_Loan)', icon: '🤝' },
    { id: 'loans-taken', label: 'Loans Taken (Taken_Loan)', icon: '💸' },
  ];

  const analyticsNavItems = [
    { id: 'budget', label: 'Budget vs Actual', icon: '🎯' },
    { id: 'bills', label: 'Bills & Subscriptions', icon: '🔄' },
    { id: 'goals', label: 'Financial Goals', icon: '🏆' },
    { id: 'reviews', label: 'Daily/Weekly Review', icon: '📅' },
    { id: 'net-worth', label: 'Net-Worth Tracker', icon: '📈' },
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <img src="RS-25F Mind.png" alt="RS-25F MIND Emblem" className="sidebar-logo" />
        <div>
          <div className="brand-title">RS-25F MIND</div>
          <div className="brand-tagline">SMART FINANCE</div>
        </div>
      </div>

      <div className="sidebar-nav-container">
        <div className="nav-section-title">Core Modules</div>
        <ul className="nav-menu">
          {coreNavItems.map(item => (
            <li key={item.id}>
              <a
                href="#"
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView(item.id);
                  setMobileOpen(false);
                }}
              >
                <span className="nav-icon">{item.icon}</span> {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-section-title">Analytics & Tools</div>
        <ul className="nav-menu">
          {analyticsNavItems.map(item => (
            <li key={item.id}>
              <a
                href="#"
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView(item.id);
                  setMobileOpen(false);
                }}
              >
                <span className="nav-icon">{item.icon}</span> {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="sheet-status-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className={`sync-dot ${isAuthenticated ? 'online' : 'offline'}`}></div>
            <span className="status-text">{isAuthenticated ? 'Connected' : 'Sign In Required'}</span>
          </div>
          {!isAuthenticated && (
            <button className="btn btn-google" style={{ padding: '0.35rem 0.6rem', fontSize: '0.72rem' }} onClick={handleGoogleLogin}>
              Connect Sheet
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
