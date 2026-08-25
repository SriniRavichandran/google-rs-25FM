/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Financial Goals Module
   ========================================================================== */

const GoalsModule = {
  render(container) {
    const data = window.StorageInstance.getData();
    const goals = data.goals;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">🏆 Financial Goals & Wealth Milestones</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Track progress towards long-term savings goals & target dates</p>
        </div>
      </div>

      <div class="grid-3">
        ${goals.map(g => {
          const pct = (g.current / g.target) * 100;
          return `
            <div class="glass-card glass-card-glow-green">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
                <div>
                  <h3 style="font-size: 1.15rem; font-weight: 700;">${g.name}</h3>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">Target Date: ${Formatters.formatDate(g.targetDate)}</span>
                </div>
                <div style="font-size: 1.5rem;">🎯</div>
              </div>

              <div style="margin-top: 1rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
                  <span style="color: var(--text-muted);">Saved: ${Formatters.formatCurrency(g.current)}</span>
                  <strong style="color: var(--bull-green);">${pct.toFixed(0)}%</strong>
                </div>
                <div class="gauge-container">
                  <div class="gauge-track">
                    <div class="gauge-fill safe" style="width: ${Math.min(pct, 100)}%;"></div>
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-dim); margin-top: 0.4rem;">
                  <span>Target: ${Formatters.formatCurrency(g.target)}</span>
                  <span>Needed: ${Formatters.formatCurrency(g.target - g.current)}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};

window.GoalsModule = GoalsModule;
