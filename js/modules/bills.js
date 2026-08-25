/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Bills & Subscriptions Module
   ========================================================================== */

const BillsModule = {
  render(container) {
    const data = window.StorageInstance.getData();
    const bills = data.bills;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">🔄 Bills & Subscriptions Tracker</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Upcoming recurring payments, utility bills, subscriptions & due dates</p>
        </div>
      </div>

      <div class="grid-3">
        ${bills.map(b => {
          const daysLeft = Formatters.getDaysUntil(b.dueDate);
          return `
            <div class="glass-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div>
                  <span class="badge badge-transfer">${b.category}</span>
                  <h3 style="font-size: 1.1rem; font-weight: 700; margin-top: 0.3rem;">${b.name}</h3>
                </div>
                <div style="font-size: 1.4rem;">📅</div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 1rem;">
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Amount Due</div>
                  <div style="font-size: 1.5rem; font-weight: 800; color: var(--bear-red); font-family: 'JetBrains Mono';">
                    ${Formatters.formatCurrency(b.amount)}
                  </div>
                </div>
                <div style="text-align: right;">
                  <span class="badge ${daysLeft <= 3 ? 'badge-expense' : 'badge-income'}">
                    Due in ${daysLeft} days
                  </span>
                  <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 0.2rem;">${Formatters.formatDate(b.dueDate)}</div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};

window.BillsModule = BillsModule;
