/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Debit Card & Bank Accounts Module
   ========================================================================== */

class BankAccountsModule {
  render(container) {
    const accounts = window.StorageInstance.getBankAccounts();
    const totalLiquid = accounts.reduce((s, a) => s + parseFloat(a.balance), 0);

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">💳 Debit Cards & Bank Accounts</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Track liquid cash, bank balances, savings, and debit card accounts</p>
        </div>
        <button class="btn btn-primary" onclick="AppRouter.openModal('add-bank-account-modal')">
          + Add Bank Account
        </button>
      </div>

      <!-- Key Metrics Row -->
      <div class="grid-3">
        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Total Liquid Balance</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(totalLiquid)}</div>
            <div class="stat-change bull"><span>Available Cash</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-blue">
          <div class="stat-widget">
            <div class="stat-label">Bank Accounts Connected</div>
            <div class="stat-value" style="color: var(--sapphire-blue);">${accounts.length}</div>
            <div class="stat-change bull"><span>Active Liquidity</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-gold">
          <div class="stat-widget">
            <div class="stat-label">Average Balance / Account</div>
            <div class="stat-value" style="color: var(--amber-gold);">
              ${Formatters.formatCurrency(accounts.length ? totalLiquid / accounts.length : 0)}
            </div>
            <div class="stat-change bull"><span>Balanced Reserve</span></div>
          </div>
        </div>
      </div>

      <!-- Bank Accounts Grid -->
      <h3 style="font-size: 1.15rem; font-weight: 700; margin: 1.5rem 0 1rem;">🏦 Registered Bank & Debit Card Accounts</h3>
      <div class="grid-3">
        ${accounts.length === 0 ? `
          <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <p style="color: var(--text-muted);">No bank accounts added yet.</p>
            <button class="btn btn-primary" style="margin-top: 1rem;" onclick="AppRouter.openModal('add-bank-account-modal')">
              + Add Bank Account
            </button>
          </div>
        ` : accounts.map(a => `
          <div class="glass-card glass-card-glow-blue">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
              <div>
                <h4 style="font-size: 1.1rem; font-weight: 700;">${a.name}</h4>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${a.bank} • ${a.type}</span>
              </div>
              <span class="badge badge-income">**** ${a.accountNumber}</span>
            </div>

            <div style="margin-bottom: 0.5rem;">
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.25rem;">Available Balance</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--bull-green); font-family: 'JetBrains Mono';">
                ${Formatters.formatCurrency(a.balance)}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

window.BankAccountsModule = new BankAccountsModule();
