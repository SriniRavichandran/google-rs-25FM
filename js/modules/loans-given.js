/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Loans Given / Money Owed Module
   ========================================================================== */

class LoansGivenModule {
  render(container) {
    const loans = window.StorageInstance.getLoansGiven();
    const totalPrincipal = loans.reduce((s, l) => s + (parseFloat(l.amountGiven) || 0), 0);
    const totalRepaid = loans.reduce((s, l) => s + (parseFloat(l.amountRepaid) || 0), 0);
    const totalOutstanding = loans.reduce((s, l) => s + (parseFloat(l.outstandingOwed) || (parseFloat(l.amountGiven) - (parseFloat(l.amountRepaid) || 0))), 0);
    const activeBorrowers = loans.filter(l => (parseFloat(l.outstandingOwed) || 1) > 0).length;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">🤝 Loans Given & Money Owed to Me</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Track money lent to friends/family/business, interest terms, repayment status, and outstanding dues</p>
        </div>
        <button class="btn btn-primary" onclick="AppRouter.openModal('add-loan-modal')">
          + Add Loan Given
        </button>
      </div>

      <!-- Key Metrics Row -->
      <div class="grid-4">
        <div class="glass-card glass-card-glow-blue">
          <div class="stat-widget">
            <div class="stat-label">Total Principal Given</div>
            <div class="stat-value" style="color: var(--sapphire-blue);">${Formatters.formatCurrency(totalPrincipal)}</div>
            <div class="stat-change bull"><span>Capital Lent</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Outstanding Owed to Me</div>
            <div class="stat-value" style="color: var(--bull-green);">${Formatters.formatCurrency(totalOutstanding)}</div>
            <div class="stat-change bull"><span>${activeBorrowers} Active Loans</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-gold">
          <div class="stat-widget">
            <div class="stat-label">Total Amount Repaid</div>
            <div class="stat-value" style="color: var(--amber-gold);">${Formatters.formatCurrency(totalRepaid)}</div>
            <div class="stat-change bull"><span>Recovered Funds</span></div>
          </div>
        </div>

        <div class="glass-card glass-card-glow-green">
          <div class="stat-widget">
            <div class="stat-label">Recovery Rate %</div>
            <div class="stat-value" style="color: var(--bull-green);">
              ${totalPrincipal > 0 ? ((totalRepaid / totalPrincipal) * 100).toFixed(1) : '0.0'}%
            </div>
            <div class="stat-change bull"><span>Repayment Progress</span></div>
          </div>
        </div>
      </div>

      <!-- Loans Given Table -->
      <h3 style="font-size: 1.15rem; font-weight: 700; margin: 1.5rem 0 1rem;">📋 Active Loan Records & Debtors</h3>
      <div class="glass-card">
        <div class="table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th>Borrower Name</th>
                <th>Amount Given</th>
                <th>Interest Rate (%)</th>
                <th>Date Given</th>
                <th>Due Date</th>
                <th>Repaid Amount</th>
                <th>Outstanding Owed</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${loans.length === 0 ? `
                <tr>
                  <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
                    No loans recorded. Click <strong>"+ Add Loan Given"</strong> to track money lent!
                  </td>
                </tr>
              ` : loans.map(l => {
                const outstanding = parseFloat(l.outstandingOwed) || (parseFloat(l.amountGiven) - (parseFloat(l.amountRepaid) || 0));
                const isPaid = outstanding <= 0;
                return `
                  <tr>
                    <td><strong>${l.borrowerName}</strong></td>
                    <td>${Formatters.formatCurrency(l.amountGiven)}</td>
                    <td>${l.interestRate || 0}%</td>
                    <td>${Formatters.formatDate(l.dateGiven)}</td>
                    <td>${l.dueDate ? Formatters.formatDate(l.dueDate) : 'No Due Date'}</td>
                    <td style="color: var(--bull-green);">${Formatters.formatCurrency(l.amountRepaid || 0)}</td>
                    <td style="font-weight: 800; color: ${isPaid ? 'var(--bull-green)' : 'var(--bear-red)'};">
                      ${Formatters.formatCurrency(outstanding)}
                    </td>
                    <td>
                      <span class="badge ${isPaid ? 'badge-income' : 'badge-expense'}">
                        ${isPaid ? 'REPAID' : 'ACTIVE'}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-danger btn-sm" onclick="LoansGivenModule.deleteLoan('${l.id}')">
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
    if (confirm('Are you sure you want to delete this loan record?')) {
      window.StorageInstance.deleteLoanGiven(id);
      if (window.AppRouter) window.AppRouter.refreshCurrentModule();
    }
  }
}

window.LoansGivenModule = new LoansGivenModule();
