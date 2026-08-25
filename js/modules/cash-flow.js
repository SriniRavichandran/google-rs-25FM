/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Cash Flow Module
   ========================================================================== */

class CashFlowModule {
  render(container) {
    const transactions = window.StorageInstance.getFilteredTransactions();
    const period = window.StorageInstance.selectedPeriod.toUpperCase();

    const incomeTx = transactions.filter(t => t.type === 'income');
    const expenseTx = transactions.filter(t => t.type === 'expense');

    const totalIncome = incomeTx.reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalExpense = expenseTx.reduce((s, t) => s + parseFloat(t.amount), 0);
    const netSavings = totalIncome - totalExpense;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">💰 Cash Flow (${period})</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Track monthly income, living expenses, investments, and net savings</p>
        </div>
        <button class="btn btn-primary" onclick="AppRouter.openModal('add-cashflow-modal')">
          + Add Transaction
        </button>
      </div>

      <!-- Key Metrics Row -->
      <div class="grid-3">
        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Total Inflow / Income</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(totalIncome)}</div>
            <div class="stat-change bull"><span>${incomeTx.length} Income Entries</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-red">
          <div class="stat-widget">
            <div class="stat-label">Total Outflow / Expenses</div>
            <div class="stat-value" style="color: var(--bear-red);">${Formatters.formatCurrency(totalExpense)}</div>
            <div class="stat-change bear"><span>${expenseTx.length} Expense Entries</span></div>
          </div>
        </div>

        <div class="glass-card ${netSavings >= 0 ? 'glass-card-glow-green' : 'glass-card-glow-red'}">
          <div class="stat-widget">
            <div class="stat-label">Net Savings Flow</div>
            <div class="stat-value" style="color: ${netSavings >= 0 ? 'var(--bull-green)' : 'var(--bear-red)'};">
              ${Formatters.formatCurrency(netSavings)}
            </div>
            <div class="stat-change ${netSavings >= 0 ? 'bull' : 'bear'}">
              <span>${totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) + '% Saved' : 'No Income'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Log -->
      <h3 style="font-size: 1.15rem; font-weight: 700; margin: 1.5rem 0 1rem;">🧾 Cash Flow Records</h3>
      <div class="glass-card">
        <div class="table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Account</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                    No transactions recorded for ${period}. Click <strong>"+ Add Transaction"</strong> to log entries!
                  </td>
                </tr>
              ` : transactions.map(t => `
                <tr>
                  <td>${Formatters.formatDate(t.date)}</td>
                  <td><strong>${t.category}</strong></td>
                  <td><span class="badge badge-${t.type}">${t.type.toUpperCase()}</span></td>
                  <td style="font-weight: 700; color: ${t.type === 'income' ? 'var(--bull-green)' : 'var(--bear-red)'};">
                    ${t.type === 'income' ? '+' : '-'}${Formatters.formatCurrency(t.amount)}
                  </td>
                  <td>${t.paymentMethod}</td>
                  <td>${t.account}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="AppRouter.deleteTransaction('${t.id}')">
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

window.CashFlowModule = new CashFlowModule();
