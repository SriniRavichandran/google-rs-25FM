/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Daily, Weekly & Monthly Reviews
   ========================================================================== */

const ReviewsModule = {
  render(container) {
    const data = window.StorageInstance.getData();
    const savingsRate = window.StorageInstance.getSavingsRate();

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">📅 Financial Checkups & Reviews</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Daily 1-minute check, weekly velocity review & monthly audit</p>
        </div>
      </div>

      <div class="grid-3">
        <!-- Daily Check -->
        <div class="glass-card glass-card-glow-green">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">📅 Daily Finance Check</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">1-Minute habit to maintain financial hygiene.</p>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.88rem;">
            <li><label style="cursor: pointer;"><input type="checkbox" checked> Log today's cash & card expenses</label></li>
            <li><label style="cursor: pointer;"><input type="checkbox" checked> Check bank balances & notifications</label></li>
            <li><label style="cursor: pointer;"><input type="checkbox"> Verify pending UPI transfers</label></li>
          </ul>
        </div>

        <!-- Weekly Review -->
        <div class="glass-card glass-card-glow-blue">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">📆 Weekly Review</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Assess spending speed vs weekly baseline.</p>
          <div style="font-size: 0.88rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <div>Weekly Velocity: <strong style="color: var(--bull-green);">On Pace (-8% vs target)</strong></div>
            <div>Credit Card Debt Built This Week: <strong>₹5,400</strong></div>
          </div>
        </div>

        <!-- Monthly Review -->
        <div class="glass-card glass-card-glow-gold">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">📅 Monthly Audit</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">End-of-month wealth building score.</p>
          <div style="font-size: 0.88rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <div>Monthly Savings Rate: <strong style="color: var(--amber-gold);">${savingsRate.toFixed(1)}%</strong></div>
            <div>Financial Health Grade: <strong style="color: var(--bull-green);">A (Excellent)</strong></div>
          </div>
        </div>
      </div>
    `;
  }
};

window.ReviewsModule = ReviewsModule;
