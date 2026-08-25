/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Pure Dynamic Google Sheets Storage Engine
   ========================================================================== */

const STORAGE_KEY = 'RS25F_MIND_FINANCE_DATA_V2';

const CLEAN_DYNAMIC_DATA = {
  creditCards: [],
  bankAccounts: [],
  transactions: [],
  investments: [],
  budgets: [],
  bills: [],
  goals: []
};

class StorageEngine {
  constructor() {
    this.data = JSON.parse(JSON.stringify(CLEAN_DYNAMIC_DATA));
    this.selectedPeriod = 'monthly'; // 'daily', 'weekly', 'monthly', 'yearly', 'custom'
    this.customStartDate = '';
    this.customEndDate = '';
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
      this.data = JSON.parse(JSON.stringify(CLEAN_DYNAMIC_DATA));
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save to LocalStorage', e);
    }
  }

  getData() {
    return this.data;
  }

  // Filter transactions by selected time period
  getFilteredTransactions() {
    const allTx = this.data.transactions || [];
    if (!allTx.length) return [];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return allTx.filter(t => {
      if (!t.date) return true;
      const txDate = new Date(t.date);
      if (isNaN(txDate.getTime())) return true;

      if (this.selectedPeriod === 'daily') {
        return t.date === todayStr;
      }

      if (this.selectedPeriod === 'weekly') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return txDate >= oneWeekAgo && txDate <= now;
      }

      if (this.selectedPeriod === 'monthly') {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }

      if (this.selectedPeriod === 'yearly') {
        return txDate.getFullYear() === now.getFullYear();
      }

      if (this.selectedPeriod === 'custom') {
        if (this.customStartDate && t.date < this.customStartDate) return false;
        if (this.customEndDate && t.date > this.customEndDate) return false;
        return true;
      }

      return true;
    });
  }

  // Calculated Metrics from Filtered Period Data
  getTotalNetWorth() {
    const bankTotal = this.data.bankAccounts.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0);
    const investmentTotal = this.data.investments.reduce((sum, i) => sum + (parseFloat(i.currentValue) || 0), 0);
    const totalLiabilities = this.data.creditCards.reduce((sum, c) => sum + (parseFloat(c.outstanding) || 0), 0);
    return (bankTotal + investmentTotal) - totalLiabilities;
  }

  getCreditCardUtilization() {
    const totalLimit = this.data.creditCards.reduce((sum, c) => sum + (parseFloat(c.limit) || 0), 0);
    const totalOutstanding = this.data.creditCards.reduce((sum, c) => sum + (parseFloat(c.outstanding) || 0), 0);
    if (totalLimit === 0) return 0;
    return (totalOutstanding / totalLimit) * 100;
  }

  getSavingsRate() {
    const filteredTx = this.getFilteredTransactions();
    const totalIncome = filteredTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalExpense = filteredTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    if (totalIncome === 0) return 0;
    return ((totalIncome - totalExpense) / totalIncome) * 100;
  }

  // Dynamic Row Manipulations (Pushes to Google Sheet)
  addTransaction(tx) {
    tx.id = 'tx-' + Date.now();
    tx.sheetRowIndex = this.data.transactions.length + 2;
    this.data.transactions.unshift(tx);
    this.save();
    return tx;
  }

  deleteTransaction(id) {
    const idx = this.data.transactions.findIndex(t => t.id === id);
    if (idx !== -1) {
      const removed = this.data.transactions[idx];
      this.data.transactions.splice(idx, 1);
      this.save();

      // Trigger Google Sheet clear if connected
      if (window.GoogleSheetsHandler && window.GoogleSheetsHandler.isConnected && removed.sheetRowIndex) {
        window.GoogleSheetsHandler.clearRange(`Cash_Flow!A${removed.sheetRowIndex}:H${removed.sheetRowIndex}`);
      }
      return true;
    }
    return false;
  }

  clearAllData() {
    this.data = JSON.parse(JSON.stringify(CLEAN_DYNAMIC_DATA));
    this.save();
  }
}

window.StorageInstance = new StorageEngine();
