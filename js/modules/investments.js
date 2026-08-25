/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Trade & Investments Module
   ========================================================================== */

class InvestmentsModule {
  render(container) {
    const investments = window.StorageInstance.getInvestments();
    const totalInvested = window.StorageInstance.getTotalInvestedAmount();
    const totalValue = window.StorageInstance.getTotalPortfolioValue();
    const totalPnL = totalValue - totalInvested;
    const pnlPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">📈 Trade & Investment Portfolio</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Track buy/sell positions, invested capital, current market value, and unrealized P&L</p>
        </div>
        <button class="btn btn-primary" onclick="AppRouter.openModal('add-trade-modal')">
          + Log Trade / Asset
        </button>
      </div>

      <!-- Key Metrics Row -->
      <div class="grid-4">
        <div class="glass-card glass-card-glow-blue">
          <div class="stat-widget">
            <div class="stat-label">Total Invested Capital</div>
            <div class="stat-value" style="color: var(--sapphire-blue);">${Formatters.formatCurrency(totalInvested)}</div>
            <div class="stat-change bull"><span>Principal Capital</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Current Portfolio Value</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(totalValue)}</div>
            <div class="stat-change bull"><span>Market Value</span></div>
          </div>
        </div>

        <div class="glass-card ${totalPnL >= 0 ? 'glass-card-glow-green' : 'glass-card-glow-red'}">
          <div class="stat-widget">
            <div class="stat-label">Total Profit & Loss (P&L)</div>
            <div class="stat-value" style="color: ${totalPnL >= 0 ? 'var(--bull-green)' : 'var(--bear-red)'};">
              ${totalPnL >= 0 ? '+' : ''}${Formatters.formatCurrency(totalPnL)}
            </div>
            <div class="stat-change ${totalPnL >= 0 ? 'bull' : 'bear'}">
              <span>Returns</span>
            </div>
          </div>
        </div>

        <div class="glass-card ${pnlPercentage >= 0 ? 'glass-card-glow-green' : 'glass-card-glow-red'}">
          <div class="stat-widget">
            <div class="stat-label">Portfolio ROI %</div>
            <div class="stat-value" style="color: ${pnlPercentage >= 0 ? 'var(--bull-green)' : 'var(--bear-red)'};">
              ${pnlPercentage >= 0 ? '+' : ''}${pnlPercentage.toFixed(2)}%
            </div>
            <div class="stat-change ${pnlPercentage >= 0 ? 'bull' : 'bear'}">
              <span>Overall Gain</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Investment Holdings Table -->
      <h3 style="font-size: 1.15rem; font-weight: 700; margin: 1.5rem 0 1rem;">💼 Active Holdings & Positions</h3>
      <div class="glass-card">
        <div class="table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Avg Buy Price</th>
                <th>Current Price</th>
                <th>Invested Amount</th>
                <th>Current Value</th>
                <th>P&L (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${investments.length === 0 ? `
                <tr>
                  <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                    No trade positions logged yet. Click <strong>"+ Log Trade / Asset"</strong> to add an investment!
                  </td>
                </tr>
              ` : investments.map(inv => {
                const itemPnL = inv.currentValue - inv.investedAmount;
                const itemRoi = inv.investedAmount > 0 ? (itemPnL / inv.investedAmount) * 100 : 0;
                return `
                  <tr>
                    <td><strong>${inv.name}</strong></td>
                    <td><span class="badge badge-investment">${inv.type}</span></td>
                    <td>${inv.quantity}</td>
                    <td>${Formatters.formatCurrency(inv.buyPrice)}</td>
                    <td>${Formatters.formatCurrency(inv.currentPrice)}</td>
                    <td>${Formatters.formatCurrency(inv.investedAmount)}</td>
                    <td style="font-weight: 700;">${Formatters.formatCurrency(inv.currentValue)}</td>
                    <td style="font-weight: 800; color: ${itemPnL >= 0 ? 'var(--bull-green)' : 'var(--bear-red)'};">
                      ${itemPnL >= 0 ? '+' : ''}${Formatters.formatCurrency(itemPnL)} (${itemRoi.toFixed(1)}%)
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

window.InvestmentsModule = new InvestmentsModule();
