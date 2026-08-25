/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Trade & Investments Module
   ========================================================================== */

const InvestmentsModule = {
  render(container) {
    const data = window.StorageInstance.getData();
    const investments = data.investments;

    const totalInvested = investments.reduce((sum, i) => sum + parseFloat(i.investedAmount), 0);
    const totalCurrentValue = investments.reduce((sum, i) => sum + parseFloat(i.currentValue), 0);
    const totalPnL = totalCurrentValue - totalInvested;
    const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">📈 Trade & Investment Portfolio</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Stocks, ETFs, Crypto, Mutual Funds buy/sell logs, P&L & portfolio value</p>
        </div>
        <button class="btn btn-primary" onclick="AppRouter.openModal('add-investment-modal')">
          <span>+ Log Trade / Asset</span>
        </button>
      </div>

      <div class="grid-4">
        <div class="glass-card glass-card-glow-blue">
          <div class="stat-widget">
            <div class="stat-label">Total Invested Principal</div>
            <div class="stat-value">${Formatters.formatCurrency(totalInvested)}</div>
            <div class="stat-change bull"><span>Original Purchase Value</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Current Portfolio Value</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(totalCurrentValue)}</div>
            <div class="stat-change bull"><span>Live Portfolio Worth</span></div>
          </div>
        </div>

        <div class="glass-card ${totalPnL >= 0 ? 'glass-card-glow-green' : 'glass-card-glow-red'}">
          <div class="stat-widget">
            <div class="stat-label">Total Realized & Unrealized P&L</div>
            <div class="stat-value" style="color: ${totalPnL >= 0 ? 'var(--bull-green)' : 'var(--bear-red)'};">
              ${totalPnL >= 0 ? '+' : ''}${Formatters.formatCurrency(totalPnL)}
            </div>
            <div class="stat-change ${totalPnL >= 0 ? 'bull' : 'bear'}">
              <span>Overall Return: ${Formatters.formatPercent(pnlPercent)}</span>
            </div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-gold">
          <div class="stat-widget">
            <div class="stat-label">Active Holdings</div>
            <div class="stat-value">${investments.length}</div>
            <div class="stat-change bull"><span>Across Stocks, ETFs, Crypto</span></div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <!-- Asset Allocation Chart -->
        <div class="glass-card">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Portfolio Asset Distribution</h3>
          <div style="height: 280px; position: relative;">
            <canvas id="portfolio-chart"></canvas>
          </div>
        </div>

        <!-- Holdings Table -->
        <div class="glass-card">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Asset Holdings & Returns</h3>
          <div class="table-container" style="max-height: 280px; overflow-y: auto;">
            <table class="glass-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Qty</th>
                  <th>Avg Price</th>
                  <th>Cur Price</th>
                  <th>P&L (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${investments.map(inv => {
                  const pnl = inv.currentValue - inv.investedAmount;
                  const pnlPct = inv.investedAmount > 0 ? (pnl / inv.investedAmount) * 100 : 0;
                  return `
                    <tr>
                      <td>
                        <strong>${inv.symbol}</strong><br>
                        <span style="font-size: 0.72rem; color: var(--text-muted);">${inv.type}</span>
                      </td>
                      <td>${inv.quantity}</td>
                      <td>${Formatters.formatCurrency(inv.avgBuyPrice)}</td>
                      <td>${Formatters.formatCurrency(inv.currentPrice)}</td>
                      <td style="font-weight: 700; color: ${pnl >= 0 ? 'var(--bull-green)' : 'var(--bear-red)'};">
                        ${pnl >= 0 ? '+' : ''}${Formatters.formatCurrency(pnl)}<br>
                        <span style="font-size: 0.72rem;">(${Formatters.formatPercent(pnlPct)})</span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      ChartManager.renderPortfolioChart('portfolio-chart', investments);
    }, 50);
  }
};

window.InvestmentsModule = InvestmentsModule;
