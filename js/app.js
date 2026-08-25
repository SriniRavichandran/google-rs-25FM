/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Main Application Engine & Router
   ========================================================================== */

class AppRouter {
  constructor() {
    this.currentView = 'dashboard';
    this.isAuthenticated = localStorage.getItem('g_access_token') !== null;

    this.modules = {
      'credit-cards': window.CreditCardsModule,
      'bank-accounts': window.BankAccountsModule,
      'cash-flow': window.CashFlowModule,
      'investments': window.InvestmentsModule,
      'budget': window.BudgetModule,
      'bills': window.BillsModule,
      'goals': window.GoalsModule,
      'reviews': window.ReviewsModule,
      'net-worth': window.NetWorthModule
    };

    this.init();
  }

  init() {
    // Set up sidebar navigation click handlers
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = item.dataset.view;
        if (targetView) {
          this.navigateTo(targetView);
        }
      });
    });

    // Time-Period Tracker Bar Handlers
    document.querySelectorAll('.period-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const period = pill.dataset.period;
        
        document.querySelectorAll('.period-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const customInputs = document.getElementById('custom-date-inputs');
        if (period === 'custom') {
          if (customInputs) customInputs.style.display = 'inline-flex';
        } else {
          if (customInputs) customInputs.style.display = 'none';
          window.StorageInstance.selectedPeriod = period;
          this.refreshCurrentModule();
        }
      });
    });

    // Custom Date Range Apply Button Handler
    const applyCustomBtn = document.getElementById('apply-custom-dates');
    if (applyCustomBtn) {
      applyCustomBtn.addEventListener('click', () => {
        const startVal = document.getElementById('custom-start-date')?.value || '';
        const endVal = document.getElementById('custom-end-date')?.value || '';

        window.StorageInstance.selectedPeriod = 'custom';
        window.StorageInstance.customStartDate = startVal;
        window.StorageInstance.customEndDate = endVal;
        this.refreshCurrentModule();
      });
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Modal close listeners
    document.querySelectorAll('.modal-close, [data-modal-dismiss]').forEach(btn => {
      btn.addEventListener('click', () => {
        const openModal = document.querySelector('.modal-overlay.open');
        if (openModal) openModal.classList.remove('open');
      });
    });

    // Handle Transaction Form Submit
    const txForm = document.getElementById('add-transaction-form');
    if (txForm) {
      txForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(txForm);
        const newTx = {
          date: formData.get('date') || new Date().toISOString().split('T')[0],
          type: formData.get('type'),
          category: formData.get('category'),
          amount: parseFloat(formData.get('amount')),
          paymentMethod: formData.get('paymentMethod'),
          account: formData.get('account'),
          description: formData.get('description')
        };
        
        window.StorageInstance.addTransaction(newTx);

        // Edit & Sync directly to Google Sheet
        if (window.GoogleSheetsHandler) {
          await window.GoogleSheetsHandler.appendRowToSheet([
            newTx.id, newTx.date, newTx.type, newTx.category, newTx.amount, newTx.paymentMethod, newTx.account, newTx.description
          ]);
        }

        this.closeModal('add-transaction-modal');
        txForm.reset();
        this.refreshCurrentModule();
      });
    }

    this.renderHeaderAuthState();
    this.navigateTo(this.currentView);
  }

  setAuthGatedState(authenticated) {
    this.isAuthenticated = authenticated;
    this.renderHeaderAuthState();
    this.refreshCurrentModule();
  }

  renderHeaderAuthState() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) loginBtn.style.display = this.isAuthenticated ? 'none' : 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = this.isAuthenticated ? 'inline-flex' : 'none';
  }

  navigateTo(viewId) {
    this.currentView = viewId;

    // Update sidebar nav items
    document.querySelectorAll('.nav-item').forEach(el => {
      if (el.dataset.view === viewId) el.classList.add('active');
      else el.classList.remove('active');
    });

    // Hide sidebar on mobile after navigation
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    // Update Top Header Page Title
    const titleEl = document.getElementById('page-title');
    if (titleEl) {
      const titles = {
        'dashboard': 'Dashboard Overview',
        'credit-cards': 'Credit Card Usage & Limits',
        'bank-accounts': 'Debit Card & Bank Accounts',
        'cash-flow': 'Cash Flow & Income / Expenses',
        'investments': 'Trade & Investment Portfolio',
        'budget': 'Budget vs Actual Tracking',
        'bills': 'Bills & Subscriptions Tracker',
        'goals': 'Financial Goals & Milestones',
        'reviews': 'Daily, Weekly & Monthly Reviews',
        'net-worth': 'Net-Worth & Wealth Tracker'
      };
      titleEl.textContent = titles[viewId] || 'RS-25F MIND';
    }

    // Switch view containers
    document.querySelectorAll('.page-view').forEach(view => {
      if (view.id === `${viewId}-view`) view.classList.add('active');
      else view.classList.remove('active');
    });

    // Render Module Content or Auth Gate
    const moduleContainer = document.getElementById(`${viewId}-view`);
    if (moduleContainer) {
      if (!this.isAuthenticated) {
        this.renderAuthGate(moduleContainer);
      } else if (viewId === 'dashboard') {
        this.renderDashboard(moduleContainer);
      } else if (this.modules[viewId]) {
        this.modules[viewId].render(moduleContainer);
      }
    }
  }

  refreshCurrentModule() {
    this.navigateTo(this.currentView);
  }

  renderAuthGate(container) {
    container.innerHTML = `
      <div class="auth-gate-wrapper">
        <div class="auth-card">
          <img src="RS-25F Mind.png" alt="RS-25F MIND Logo" class="auth-card-logo">
          <h2 class="auth-card-title">Connect RS-25F MIND Google Sheet</h2>
          <p class="auth-card-desc">
            Connect directly with your Google Sheet to view and update your financial records:
            <br><br>
            <a href="https://docs.google.com/spreadsheets/d/1vCTXo6Mu172AaTPKfOPNeqnXsJA1oIWfV5HEurXm0ik/edit" target="_blank" style="color: var(--bull-green); word-break: break-all; font-weight: 600;">
              https://docs.google.com/spreadsheets/d/1vCTXo6Mu172AaTPKfOPNeqnXsJA1oIWfV5HEurXm0ik/edit
            </a>
          </p>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%; max-width: 360px; margin-top: 0.5rem;">
            <button class="btn btn-primary" style="justify-content: center; width: 100%; padding: 0.9rem 1.5rem; font-size: 1.05rem;" onclick="googleLogin()">
              🔐 Connect Google Sheet & Open Dashboard
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderDashboard(container) {
    const data = window.StorageInstance.getData();
    const netWorth = window.StorageInstance.getTotalNetWorth();
    const savingsRate = window.StorageInstance.getSavingsRate();
    const creditUtil = window.StorageInstance.getCreditCardUtilization();
    const totalLiquid = data.bankAccounts.reduce((s, a) => s + parseFloat(a.balance), 0);
    const filteredTx = window.StorageInstance.getFilteredTransactions();

    container.innerHTML = `
      <!-- Hero Banner with RS-25F Mind Emblem -->
      <div class="hero-emblem-container shimmer-effect">
        <img src="RS-25F Mind.png" alt="RS-25F MIND Logo" class="hero-emblem-img">
        <div>
          <div class="hero-emblem-title">RS-25F MIND Personal Finance Tracker</div>
          <div class="hero-emblem-subtitle">SMART FINANCE. BETTER LIFE. | Track. Plan. Save. Invest. Grow.</div>
        </div>
      </div>

      <!-- Dashboard Key Metrics Grid -->
      <div class="grid-4">
        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Total Net Worth</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(netWorth)}</div>
            <div class="stat-change bull"><span>Liquid + Investments - Debt</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-gold">
          <div class="stat-widget">
            <div class="stat-label">Savings Rate (${window.StorageInstance.selectedPeriod.toUpperCase()})</div>
            <div class="stat-value" style="color: var(--amber-gold);">${savingsRate.toFixed(1)}%</div>
            <div class="stat-change bull"><span>Target: 30%+</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-blue">
          <div class="stat-widget">
            <div class="stat-label">Liquid Cash Balance</div>
            <div class="stat-value" style="color: var(--sapphire-blue);">${Formatters.formatCurrency(totalLiquid)}</div>
            <div class="stat-change bull"><span>Across ${data.bankAccounts.length} Bank Accounts</span></div>
          </div>
        </div>

        <div class="glass-card ${creditUtil > 50 ? 'glass-card-glow-red' : 'glass-card-glow-green'}">
          <div class="stat-widget">
            <div class="stat-label">Credit Card Utilization</div>
            <div class="stat-value" style="color: ${creditUtil > 50 ? 'var(--bear-red)' : 'var(--bull-green)'};">
              ${creditUtil.toFixed(1)}%
            </div>
            <div class="stat-change ${creditUtil > 50 ? 'bear' : 'bull'}">
              <span>Limit Health: ${creditUtil < 30 ? 'Optimal' : creditUtil < 50 ? 'Moderate' : 'High Alert'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Dynamic Spreadsheet Transaction Manager -->
      <div style="margin-top: 1.5rem;">
        <div class="section-header">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 700;">🧾 Google Sheet Live Transaction Log (${window.StorageInstance.selectedPeriod.toUpperCase()})</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Direct live sync to Google Sheet1</p>
          </div>
          <button class="btn btn-primary" onclick="AppRouter.openModal('add-transaction-modal')">
            <span>+ Add Row / Amount</span>
          </button>
        </div>

        <div class="glass-card">
          <div class="table-container">
            <table class="glass-table">
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
                ${filteredTx.length === 0 ? `
                  <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                      No records found for the selected period (<strong>${window.StorageInstance.selectedPeriod}</strong>). Click <strong>"+ Add Row / Amount"</strong> to add an entry!
                    </td>
                  </tr>
                ` : filteredTx.map(t => `
                  <tr>
                    <td>${Formatters.formatDate(t.date)}</td>
                    <td><strong>${t.category}</strong></td>
                    <td>
                      <span class="badge badge-${t.type}">${t.type.toUpperCase()}</span>
                    </td>
                    <td style="font-weight: 700; color: ${t.type === 'income' ? 'var(--bull-green)' : t.type === 'expense' ? 'var(--bear-red)' : 'var(--sapphire-blue)'};">
                      ${t.type === 'income' ? '+' : '-'}${Formatters.formatCurrency(t.amount)}
                    </td>
                    <td>${t.paymentMethod}</td>
                    <td>${t.account}</td>
                    <td>
                      <button class="btn btn-danger btn-sm" onclick="AppRouter.deleteTransaction('${t.id}')">
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this row/amount?')) {
      window.StorageInstance.deleteTransaction(id);
      this.refreshCurrentModule();
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.AppRouter = new AppRouter();
});
