/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Bank Accounts & Debit Cards Module
   ========================================================================== */

const BankAccountsModule = {
  render(container) {
    const data = window.StorageInstance.getData();
    const accounts = data.bankAccounts;
    const totalLiquidCash = accounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">💳 Bank Accounts & Debit Cards</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Track checking, savings, salary, and liquid cash balances</p>
        </div>
        <button class="btn btn-primary" onclick="AppRouter.openModal('add-bank-account-modal')">
          <span>+ Add Bank Account</span>
        </button>
      </div>

      <div class="grid-3" style="margin-bottom: 2rem;">
        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Total Liquid Cash</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(totalLiquidCash)}</div>
            <div class="stat-change bull"><span>Available across ${accounts.length} Accounts</span></div>
          </div>
        </div>
      </div>

      <div class="grid-3">
        ${accounts.map(acc => `
          <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
              <div>
                <span class="badge badge-investment">${acc.type}</span>
                <h3 style="font-size: 1.15rem; font-weight: 700; margin-top: 0.4rem;">${acc.name}</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">${acc.bank}</p>
              </div>
              <div style="font-size: 1.5rem;">🏦</div>
            </div>

            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
              <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-dim); font-weight: 600;">Current Balance</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--bull-green); font-family: 'JetBrains Mono', monospace; margin: 0.2rem 0;">
                ${Formatters.formatCurrency(acc.balance)}
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted); display: flex; justify-content: space-between;">
                <span>Account No:</span>
                <strong>${acc.accountNo}</strong>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
};

window.BankAccountsModule = BankAccountsModule;
