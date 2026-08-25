/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Budget vs Actual Module
   ========================================================================== */

const BudgetModule = {
  render(container) {
    const data = window.StorageInstance.getData();
    const budgets = data.budgets;

    const totalBudgeted = budgets.reduce((sum, b) => sum + parseFloat(b.budget), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + parseFloat(b.spent), 0);
    const remaining = totalBudgeted - totalSpent;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">🎯 Budget vs Actual Category Tracking</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Category monthly budgets, actual spending & overrun warnings</p>
        </div>
      </div>

      <div class="grid-3" style="margin-bottom: 2rem;">
        <div class="glass-card glass-card-glow-blue">
          <div class="stat-widget">
            <div class="stat-label">Total Monthly Budget</div>
            <div class="stat-value">${Formatters.formatCurrency(totalBudgeted)}</div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-red">
          <div class="stat-widget">
            <div class="stat-label">Total Actual Spent</div>
            <div class="stat-value" style="color: var(--bear-red);">${Formatters.formatCurrency(totalSpent)}</div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Remaining Budget Pool</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(remaining)}</div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        ${budgets.map(b => {
          const pct = (b.spent / b.budget) * 100;
          let fillClass = 'safe';
          if (pct > 75) fillClass = 'warning';
          if (pct > 100) fillClass = 'danger';

          return `
            <div class="glass-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div>
                  <h3 style="font-size: 1.1rem; font-weight: 700;">${b.category}</h3>
                  <span style="font-size: 0.82rem; color: var(--text-muted);">Budget: ${Formatters.formatCurrency(b.budget)}</span>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 1.1rem; font-weight: 800; color: ${pct > 100 ? 'var(--bear-red)' : 'var(--text-main)'};">
                    ${Formatters.formatCurrency(b.spent)}
                  </span>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${pct.toFixed(0)}% Used</div>
                </div>
              </div>
              <div class="gauge-container">
                <div class="gauge-track">
                  <div class="gauge-fill ${fillClass}" style="width: ${Math.min(pct, 100)}%;"></div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};

window.BudgetModule = BudgetModule;
