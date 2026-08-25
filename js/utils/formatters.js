/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Formatters Utility
   ========================================================================== */

const Formatters = {
  formatCurrency(amount, currency = 'INR') {
    const num = parseFloat(amount) || 0;
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(num);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  },

  formatNumber(val) {
    const num = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN').format(num);
  },

  formatPercent(val) {
    const num = parseFloat(val) || 0;
    return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  getDaysUntil(dateStr) {
    if (!dateStr) return 0;
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
};

window.Formatters = Formatters;
