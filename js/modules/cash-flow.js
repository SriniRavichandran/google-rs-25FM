/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Cash Flow Module
   ========================================================================== */

const CashFlowModule = {
  render(container) {
    const data = window.StorageInstance.getData();
    const transactions = data.transactions;

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalInvested = transactions
      .filter(t => t.type === 'investment')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const netCashFlow = totalIncome - (totalExpense + totalInvested);
    const savingsRate = window.StorageInstance.getSavingsRate();

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">💰 Cash Flow & Income-Expense Tracking</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Income, daily expenses, investments, closing balance & savings rate</p>
        </div>
        <button class="btn btn-primary" onclick="AppRouter.openModal('add-transaction-modal')">
          <span>+ Add Transaction</span>
        </button>
      </div>

      <div class="grid-4">
        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Total Monthly Income</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(totalIncome)}</div>
            <div class="stat-change bull"><span>Earnings & Inflows</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-red">
          <div class="stat-widget">
            <div class="stat-label">Total Monthly Expenses</div>
            <div class="stat-value" style="color: var(--bear-red);">${Formatters.formatCurrency(totalExpense)}</div>
            <div class="stat-change bear"><span>Living & Daily Costs</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-blue">
          <div class="stat-widget">
            <div class="stat-label">Total Investments</div>
            <div class="stat-value" style="color: var(--sapphire-blue);">${Formatters.formatCurrency(totalInvested)}</div>
            <div class="stat-change bull"><span>SIPs & Stocks</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-gold">
          <div class="stat-widget">
            <div class="stat-label">Savings Rate</div>
            <div class="stat-value" style="color: var(--amber-gold);">${savingsRate.toFixed(1)}%</div>
            <div class="gauge-container" style="margin-top: 0.5rem;">
              <div class="gauge-track">
                <div class="gauge-fill safe" style="width: ${Math.min(Math.max(savingsRate, 0), 100)}%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart & Log -->
      <div class="grid-2">
        <div class="glass-card">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Monthly Cash Breakdown</h3>
          <div style="height: 280px; position: relative;">
            <canvas id="cashflow-chart"></canvas>
          </div>
        </div>

        <div class="glass-card">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Recent Transactions Log</h3>
          <div class="table-container" style="max-height: 280px; overflow-y: auto;">
            <table class="glass-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${transactions.slice(0, 6).map(t => `
                  <tr>
                    <td>${Formatters.formatDate(t.date)}</td>
                    <td><strong>${t.category}</strong></td>
                    <td>
                      <span class="badge badge-${t.type}">${t.type.toUpperCase()}</span>
                    </td>
                    <td style="font-weight: 700; color: ${t.type === 'income' ? 'var(--bull-green)' : t.type === 'expense' ? 'var(--bear-red)' : 'var(--sapphire-blue)'};">
                      ${t.type === 'income' ? '+' : '-'}${Formatters.formatCurrency(t.amount)}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      ChartManager.renderCashFlowChart('cashflow-chart', transactions);
    }, 50);
  }
};

window.CashFlowModule = CashFlowModule;
