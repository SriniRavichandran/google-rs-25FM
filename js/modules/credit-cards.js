/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Credit Card Usage Module
   ========================================================================== */

class CreditCardsModule {
  render(container) {
    const cards = window.StorageInstance.getCreditCards();
    const totalLimit = window.StorageInstance.getTotalCreditLimit();
    const totalOutstanding = window.StorageInstance.getTotalCreditOutstanding();
    const utilization = window.StorageInstance.getCreditCardUtilization();
    const totalAvailable = totalLimit - totalOutstanding;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">💳 Credit Card Usage & Limit Health</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Track credit limits, outstanding dues, utilization %, and billing cycles</p>
        </div>
        <button class="btn btn-primary" onclick="AppRouter.openModal('add-credit-card-modal')">
          + Add New Credit Card
        </button>
      </div>

      <!-- Key Metrics Row -->
      <div class="grid-4">
        <div class="glass-card glass-card-glow-blue">
          <div class="stat-widget">
            <div class="stat-label">Total Credit Limit</div>
            <div class="stat-value" style="color: var(--sapphire-blue);">${Formatters.formatCurrency(totalLimit)}</div>
            <div class="stat-change bull"><span>Across ${cards.length} Cards</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-red">
          <div class="stat-widget">
            <div class="stat-label">Total Outstanding Dues</div>
            <div class="stat-value" style="color: var(--bear-red);">${Formatters.formatCurrency(totalOutstanding)}</div>
            <div class="stat-change bear"><span>Due for payment</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Available Credit Limit</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(totalAvailable)}</div>
            <div class="stat-change bull"><span>Ready to use</span></div>
          </div>
        </div>

        <div class="glass-card ${utilization > 50 ? 'glass-card-glow-red' : 'glass-card-glow-green'}">
          <div class="stat-widget">
            <div class="stat-label">Overall Utilization Rate</div>
            <div class="stat-value" style="color: ${utilization > 50 ? 'var(--bear-red)' : 'var(--bull-green)'};">
              ${utilization.toFixed(1)}%
            </div>
            <div class="stat-change ${utilization > 50 ? 'bear' : 'bull'}">
              <span>Limit Health: ${utilization < 30 ? 'Optimal' : utilization < 50 ? 'Moderate' : 'High Alert'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Credit Cards Grid Display -->
      <h3 style="font-size: 1.15rem; font-weight: 700; margin: 1.5rem 0 1rem;">💳 Your Registered Credit Cards</h3>
      <div class="grid-3">
        ${cards.length === 0 ? `
          <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <p style="color: var(--text-muted);">No credit cards added yet.</p>
            <button class="btn btn-primary" style="margin-top: 1rem;" onclick="AppRouter.openModal('add-credit-card-modal')">
              + Add New Credit Card
            </button>
          </div>
        ` : cards.map(c => {
          const cardUtil = c.limit > 0 ? (c.outstanding / c.limit) * 100 : 0;
          return `
            <div class="glass-card ${cardUtil > 50 ? 'glass-card-glow-red' : 'glass-card-glow-green'}">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div>
                  <h4 style="font-size: 1.1rem; font-weight: 700;">${c.name}</h4>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">${c.bank} • ${c.network}</span>
                </div>
                <span class="badge ${cardUtil > 50 ? 'badge-expense' : 'badge-income'}">${cardUtil.toFixed(1)}% Utilized</span>
              </div>

              <div style="margin-bottom: 1rem;">
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.25rem;">Outstanding Balance</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: var(--bear-red); font-family: 'JetBrains Mono';">
                  ${Formatters.formatCurrency(c.outstanding)}
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
                <div>Total Limit: <strong>${Formatters.formatCurrency(c.limit)}</strong></div>
                <div>Due Date: <strong>Day ${c.dueDate}</strong></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

window.CreditCardsModule = new CreditCardsModule();
