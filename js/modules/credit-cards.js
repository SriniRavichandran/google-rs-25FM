/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Credit Cards Module
   ========================================================================== */

const CreditCardsModule = {
  render(container) {
    const data = window.StorageInstance.getData();
    const cards = data.creditCards;

    const totalLimit = cards.reduce((sum, c) => sum + parseFloat(c.limit), 0);
    const totalOutstanding = cards.reduce((sum, c) => sum + parseFloat(c.outstanding), 0);
    const totalAvailable = totalLimit - totalOutstanding;
    const utilizationRate = totalLimit > 0 ? (totalOutstanding / totalLimit) * 100 : 0;

    let utilizationClass = 'safe';
    if (utilizationRate > 50) utilizationClass = 'warning';
    if (utilizationRate > 70) utilizationClass = 'danger';

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">💳 Credit Cards Usage & Utilization</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Monitor credit limits, statement due dates, outstanding debt & utilization %</p>
        </div>
        <button class="btn btn-primary" onclick="AppRouter.openModal('add-credit-card-modal')">
          <span>+ Add New Credit Card</span>
        </button>
      </div>

      <!-- Credit Cards Overview Cards -->
      <div class="grid-4">
        <div class="glass-card glass-card-glow-blue">
          <div class="stat-widget">
            <div class="stat-label">Total Credit Limit</div>
            <div class="stat-value">${Formatters.formatCurrency(totalLimit)}</div>
            <div class="stat-change bull"><span>Across ${cards.length} Credit Cards</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-red">
          <div class="stat-widget">
            <div class="stat-label">Total Outstanding</div>
            <div class="stat-value" style="color: var(--bear-red);">${Formatters.formatCurrency(totalOutstanding)}</div>
            <div class="stat-change bear"><span>Current Unpaid Debt</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Available Credit</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(totalAvailable)}</div>
            <div class="stat-change bull"><span>Ready to Use</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-gold">
          <div class="stat-widget">
            <div class="stat-label">Credit Utilization Rate</div>
            <div class="stat-value">${utilizationRate.toFixed(1)}%</div>
            <div class="gauge-container" style="margin-top: 0.5rem;">
              <div class="gauge-track">
                <div class="gauge-fill ${utilizationClass}" style="width: ${Math.min(utilizationRate, 100)}%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3D Interactive Cards Grid -->
      <div style="margin-top: 2rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Interactive 3D Physical Cards (Click Card to Flip)</h3>
        <div class="grid-3">
          ${cards.map(card => {
            const cardLimit = parseFloat(card.limit);
            const cardOut = parseFloat(card.outstanding);
            const cardUtil = cardLimit > 0 ? (cardOut / cardLimit) * 100 : 0;
            const daysLeft = Formatters.getDaysUntil(card.dueDate);

            return `
              <div class="glass-card">
                <div class="card-3d-scene" onclick="this.querySelector('.credit-card-3d').classList.toggle('flipped')">
                  <div class="credit-card-3d">
                    <!-- Front Face -->
                    <div class="card-face card-face-front ${card.network}">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="card-chip"></div>
                        <div class="card-vendor-logo">${card.network.toUpperCase()}</div>
                      </div>
                      <div class="card-number-display">•••• •••• •••• ${card.last4 || '1234'}</div>
                      <div class="card-holder-info">
                        <div>
                          <div class="card-sub-label">Card Name</div>
                          <div class="card-holder-name">${card.name}</div>
                        </div>
                        <div style="text-align: right;">
                          <div class="card-sub-label">Bank</div>
                          <div class="card-holder-name">${card.bank}</div>
                        </div>
                      </div>
                    </div>
                    <!-- Back Face -->
                    <div class="card-face card-face-back">
                      <div class="magnetic-strip"></div>
                      <div class="signature-cvv-box">CVV: ***</div>
                      <div style="margin-top: auto; font-size: 0.7rem; color: var(--text-muted); text-align: center;">
                        Statement Date: ${card.statementDate} | RS-25F MIND Secured Card
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Card Details -->
                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
                    <span style="color: var(--text-muted);">Outstanding:</span>
                    <strong style="color: var(--bear-red);">${Formatters.formatCurrency(cardOut)}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
                    <span style="color: var(--text-muted);">Credit Limit:</span>
                    <strong>${Formatters.formatCurrency(cardLimit)}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
                    <span style="color: var(--text-muted);">Payment Due Date:</span>
                    <span class="badge ${daysLeft <= 5 ? 'badge-expense' : 'badge-income'}">
                      ${Formatters.formatDate(card.dueDate)} (${daysLeft} days)
                    </span>
                  </div>
                  <div class="gauge-container">
                    <div class="gauge-header">
                      <span style="font-size: 0.75rem; color: var(--text-muted);">Card Utilization</span>
                      <span style="font-size: 0.75rem; font-weight: 700;">${cardUtil.toFixed(1)}%</span>
                    </div>
                    <div class="gauge-track">
                      <div class="gauge-fill ${cardUtil > 50 ? 'danger' : 'safe'}" style="width: ${Math.min(cardUtil, 100)}%;"></div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
};

window.CreditCardsModule = CreditCardsModule;
