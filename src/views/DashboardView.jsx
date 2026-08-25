import React from 'react';
import { useFinance } from '../context/FinanceContext.jsx';

const DashboardView = () => {
  const {
    netWorth,
    savingsRate,
    totalBankBalance,
    totalLoansGiven,
    totalLoansTaken,
    selectedPeriod,
    filteredTx,
    setActiveModal,
    setEditingTx,
    deleteTransaction
  } = useFinance();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="page-view active">
      {/* Hero Banner */}
      <div className="hero-emblem-container shimmer-effect">
        <img src="RS-25F Mind.png" alt="RS-25F MIND Logo" className="hero-emblem-img" />
        <div>
          <div className="hero-emblem-title">RS-25F MIND Personal Finance Tracker</div>
          <div className="hero-emblem-subtitle">SMART FINANCE. BETTER LIFE. | Track. Plan. Save. Invest. Grow.</div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid-4">
        <div className="glass-card glass-card-glow-green">
          <div className="stat-widget">
            <div className="stat-label">Total Net Worth</div>
            <div className="stat-value" style={{ color: 'var(--bull-green)' }}>{formatCurrency(netWorth)}</div>
            <div className="stat-change bull"><span>Liquid + Investments + Loans - Debt</span></div>
          </div>
        </div>

        <div className="glass-card glass-card-glow-gold">
          <div className="stat-widget">
            <div className="stat-label">Savings Rate ({selectedPeriod.toUpperCase()})</div>
            <div className="stat-value" style={{ color: 'var(--amber-gold)' }}>{savingsRate.toFixed(1)}%</div>
            <div className="stat-change bull"><span>Target: 30%+</span></div>
          </div>
        </div>

        <div className="glass-card glass-card-glow-blue">
          <div className="stat-widget">
            <div className="stat-label">Liquid Cash Balance (Debit)</div>
            <div className="stat-value" style={{ color: 'var(--sapphire-blue)' }}>{formatCurrency(totalBankBalance)}</div>
            <div className="stat-change bull"><span>Available Reserve</span></div>
          </div>
        </div>

        <div className="glass-card glass-card-glow-green">
          <div className="stat-widget">
            <div className="stat-label">Money Owed to Me (Given Loan)</div>
            <div className="stat-value" style={{ color: 'var(--bull-green)' }}>{formatCurrency(totalLoansGiven)}</div>
            <div className="stat-change bull"><span>Lent Assets</span></div>
          </div>
        </div>

        <div className="glass-card glass-card-glow-red">
          <div className="stat-widget">
            <div className="stat-label">Borrowed Debt (Taken Loan)</div>
            <div className="stat-value" style={{ color: 'var(--bear-red)' }}>{formatCurrency(totalLoansTaken)}</div>
            <div className="stat-change bear"><span>Payoff Dues</span></div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => setActiveModal('add-transaction')}>+ Add Row / Amount</button>
        <button className="btn btn-secondary" onClick={() => setActiveModal('add-credit-card')}>+ Add Credit Card</button>
        <button className="btn btn-secondary" onClick={() => setActiveModal('add-bank-account')}>+ Add Bank Account</button>
        <button className="btn btn-secondary" onClick={() => setActiveModal('add-cashflow')}>+ Add Transaction</button>
        <button className="btn btn-secondary" onClick={() => setActiveModal('add-trade')}>+ Log Trade / Asset</button>
        <button className="btn btn-secondary" onClick={() => setActiveModal('add-loan-given')}>+ Add Loan Given</button>
        <button className="btn btn-secondary" onClick={() => setActiveModal('add-loan-taken')}>+ Add Loan Taken</button>
      </div>

      {/* Transaction Log */}
      <div>
        <div className="section-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>🧾 Live Transaction Log ({selectedPeriod.toUpperCase()})</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Direct live sync to Google Sheet1</p>
          </div>
        </div>

        <div className="glass-card">
          <div className="table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Account</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No records found for {selectedPeriod}. Click <strong>"+ Add Row / Amount"</strong> to add an entry!
                    </td>
                  </tr>
                ) : filteredTx.map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td><strong>{t.category}</strong></td>
                    <td><span className={`badge badge-${t.type}`}>{t.type.toUpperCase()}</span></td>
                    <td style={{ fontWeight: 700, color: t.type === 'income' ? 'var(--bull-green)' : 'var(--bear-red)' }}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td>{t.paymentMethod}</td>
                    <td>{t.account}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingTx(t); setActiveModal('add-transaction'); }}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteTransaction(t.id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
