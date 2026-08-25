/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Loans Taken / Borrowed Debt Module
   ========================================================================== */

class LoansTakenModule {
  render(container) {
    const loans = window.StorageInstance.getLoansTaken();
    const totalPrincipal = loans.reduce((s, l) => s + (parseFloat(l.amountTaken) || 0), 0);
    const totalRepaid = loans.reduce((s, l) => s + (parseFloat(l.amountRepaid) || 0), 0);
    const totalOutstanding = loans.reduce((s, l) => s + (parseFloat(l.outstandingBalance) || (parseFloat(l.amountTaken) - (parseFloat(l.amountRepaid) || 0))), 0);
    const activeDebts = loans.filter(l => (parseFloat(l.outstandingBalance) || 1) > 0).length;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">💸 Loans Taken & Borrowed Liabilities</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Track personal loans, bank loans, money borrowed from others, interest rates, and payoff progress</p>
        </div>
        <button class="btn btn-primary" onclick="AppRouter.openModal('add-loan-taken-modal')">
          + Add Loan Taken
        </button>
      </div>

      <!-- Key Metrics Row -->
      <div class="grid-4">
        <div class="glass-card glass-card-glow-red">
          <div class="stat-widget">
            <div class="stat-label">Total Borrowed Principal</div>
            <div class="stat-value" style="color: var(--bear-red);">${Formatters.formatCurrency(totalPrincipal)}</div>
            <div class="stat-change bear"><span>Total Debt Incurred</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-red">
          <div class="stat-widget">
            <div class="stat-label">Outstanding Debt Remaining</div>
            <div class="stat-value" style="color: var(--bear-red);">${Formatters.formatCurrency(totalOutstanding)}</div>
            <div class="stat-change bear"><span>${activeDebts} Active Debts</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Total Debt Repaid</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(totalRepaid)}</div>
            <div class="stat-change bull"><span>Paid Off Funds</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Payoff Progress %</div>
            <div class="stat-value" style="color: var(--bull-green);">
              ${totalPrincipal > 0 ? ((totalRepaid / totalPrincipal) * 100).toFixed(1) : '0.0'}%
            </div>
            <div class="stat-change bull"><span>Debt Repayment</span></div>
          </div>
        </div>
      </div>

      <!-- Loans Taken Table -->
      <h3 style="font-size: 1.15rem; font-weight: 700; margin: 1.5rem 0 1rem;">📋 Active Liabilities & Lenders</h3>
      <div class="glass-card">
        <div class="table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th>Lender / Bank Name</th>
                <th>Amount Borrowed</th>
                <th>Interest Rate (%)</th>
                <th>Date Taken</th>
                <th>Due Date</th>
                <th>Amount Repaid</th>
                <th>Outstanding Debt</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${loans.length === 0 ? `
                <tr>
                  <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
                    No borrowed loans recorded. Click <strong>"+ Add Loan Taken"</strong> to track liabilities!
                  </td>
                </tr>
              ` : loans.map(l => {
                const outstanding = parseFloat(l.outstandingBalance) || (parseFloat(l.amountTaken) - (parseFloat(l.amountRepaid) || 0));
                const isPaid = outstanding <= 0;
                return `
                  <tr>
                    <td><strong>${l.lenderName}</strong></td>
                    <td>${Formatters.formatCurrency(l.amountTaken)}</td>
                    <td>${l.interestRate || 0}%</td>
                    <td>${Formatters.formatDate(l.dateTaken)}</td>
                    <td>${l.dueDate ? Formatters.formatDate(l.dueDate) : 'No Due Date'}</td>
                    <td style="color: var(--bull-green);">${Formatters.formatCurrency(l.amountRepaid || 0)}</td>
                    <td style="font-weight: 800; color: ${isPaid ? 'var(--bull-green)' : 'var(--bear-red)'};">
                      ${Formatters.formatCurrency(outstanding)}
                    </td>
                    <td>
                      <span class="badge ${isPaid ? 'badge-income' : 'badge-expense'}">
                        ${isPaid ? 'PAID OFF' : 'ACTIVE DEBT'}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-danger btn-sm" onclick="LoansTakenModule.deleteLoan('${l.id}')">
                        🗑️ Delete
                      </button>
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

  static deleteLoan(id) {
    if (confirm('Are you sure you want to delete this borrowed loan record?')) {
      window.StorageInstance.deleteLoanTaken(id);
      if (window.AppRouter) window.AppRouter.refreshCurrentModule();
    }
  }
}

window.LoansTakenModule = new LoansTakenModule();
