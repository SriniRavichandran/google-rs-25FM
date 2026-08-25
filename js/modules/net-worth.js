/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Net-Worth Tracker Module
   ========================================================================== */

const NetWorthModule = {
  render(container) {
    const data = window.StorageInstance.getData();

    const bankTotal = data.bankAccounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);
    const investmentTotal = data.investments.reduce((sum, i) => sum + parseFloat(i.currentValue), 0);
    const totalAssets = bankTotal + investmentTotal;

    const totalLiabilities = data.creditCards.reduce((sum, c) => sum + parseFloat(c.outstanding), 0);
    const netWorth = totalAssets - totalLiabilities;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">📈 Net-Worth & Wealth Tracker</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Total Assets (Liquid Cash + Investments) minus Total Debt (Credit Cards)</p>
        </div>
      </div>

      <div class="grid-3" style="margin-bottom: 2rem;">
        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Total Net Worth</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(netWorth)}</div>
            <div class="stat-change bull"><span>Assets Minus Debt</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-blue">
          <div class="stat-widget">
            <div class="stat-label">Total Assets</div>
            <div class="stat-value" style="color: var(--sapphire-blue);">${Formatters.formatCurrency(totalAssets)}</div>
            <div class="stat-change bull"><span>Bank Balances & Investments</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-red">
          <div class="stat-widget">
            <div class="stat-label">Total Liabilities</div>
            <div class="stat-value" style="color: var(--bear-red);">${Formatters.formatCurrency(totalLiabilities)}</div>
            <div class="stat-change bear"><span>Unpaid Credit Card Debt</span></div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="glass-card">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Asset Breakdown</h3>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; justify-content: space-between;">
              <span>Bank & Liquid Cash</span>
              <strong>${Formatters.formatCurrency(bankTotal)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Stocks & Investment Portfolio</span>
              <strong>${Formatters.formatCurrency(investmentTotal)}</strong>
            </div>
          </div>
        </div>

        <div class="glass-card">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Liabilities Breakdown</h3>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; justify-content: space-between;">
              <span>Credit Card Outstanding Debt</span>
              <strong style="color: var(--bear-red);">${Formatters.formatCurrency(totalLiabilities)}</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

window.NetWorthModule = NetWorthModule;
