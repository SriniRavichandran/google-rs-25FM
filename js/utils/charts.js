/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Chart Utilities
   ========================================================================== */

const ChartManager = {
  instances: {},

  destroyChart(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  renderCashFlowChart(canvasId, transactions) {
    if (typeof Chart === 'undefined') return;
    this.destroyChart(canvasId);

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Process last 6 months or last transactions
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const investment = transactions.filter(t => t.type === 'investment').reduce((s, t) => s + t.amount, 0);

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expenses', 'Investments'],
        datasets: [{
          label: 'Amount (₹)',
          data: [income, expense, investment],
          backgroundColor: [
            'rgba(16, 185, 129, 0.75)',
            'rgba(239, 68, 68, 0.75)',
            'rgba(59, 130, 246, 0.75)'
          ],
          borderColor: [
            '#10b981',
            '#ef4444',
            '#3b82f6'
          ],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#94a3b8' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
  },

  renderPortfolioChart(canvasId, investments) {
    if (typeof Chart === 'undefined') return;
    this.destroyChart(canvasId);

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const labels = investments.map(i => i.symbol);
    const values = investments.map(i => i.currentValue);

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#10b981',
            '#3b82f6',
            '#f59e0b',
            '#8b5cf6',
            '#ec4899'
          ],
          borderColor: '#0f172a',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#f8fafc', font: { family: 'Outfit' } }
          }
        },
        cutout: '70%'
      }
    });
  }
};

window.ChartManager = ChartManager;
