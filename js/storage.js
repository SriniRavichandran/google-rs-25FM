/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Pure Dynamic Google Sheets Storage Engine
   ========================================================================== */

const STORAGE_KEY = 'RS25F_MIND_FINANCE_DATA_V2';

const CLEAN_DYNAMIC_DATA = {
  creditCards: [],
  bankAccounts: [],
  transactions: [],
  investments: [],
  loansGiven: [],
  loansTaken: [],
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
        if (!this.data.loansGiven) this.data.loansGiven = [];
        if (!this.data.loansTaken) this.data.loansTaken = [];
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

  // Helper getters
  getCreditCards() { return this.data.creditCards || []; }
  getBankAccounts() { return this.data.bankAccounts || []; }
  getInvestments() { return this.data.investments || []; }
  getLoansGiven() { return this.data.loansGiven || []; }
  getLoansTaken() { return this.data.loansTaken || []; }
  getBills() { return this.data.bills || []; }
  getBudgets() { return this.data.budgets || []; }

  getTotalCreditLimit() {
    return this.getCreditCards().reduce((sum, c) => sum + (parseFloat(c.limit) || 0), 0);
  }

  getTotalCreditOutstanding() {
    return this.getCreditCards().reduce((sum, c) => sum + (parseFloat(c.outstanding) || 0), 0);
  }

  getTotalInvestedAmount() {
    return this.getInvestments().reduce((sum, i) => sum + (parseFloat(i.investedAmount) || 0), 0);
  }

  getTotalPortfolioValue() {
    return this.getInvestments().reduce((sum, i) => sum + (parseFloat(i.currentValue) || 0), 0);
  }

  getTotalLoansGiven() {
    return this.getLoansGiven().reduce((sum, l) => sum + (parseFloat(l.outstandingOwed) || parseFloat(l.amountGiven) || 0), 0);
  }

  getTotalLoansTaken() {
    return this.getLoansTaken().reduce((sum, l) => sum + (parseFloat(l.outstandingBalance) || parseFloat(l.amountTaken) || 0), 0);
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
    const loansOwedToMe = this.getTotalLoansGiven();
    const creditCardDebt = this.getTotalCreditOutstanding();
    const loansTakenDebt = this.getTotalLoansTaken();
    
    return (bankTotal + investmentTotal + loansOwedToMe) - (creditCardDebt + loansTakenDebt);
  }

  getCreditCardUtilization() {
    const totalLimit = this.getTotalCreditLimit();
    const totalOutstanding = this.getTotalCreditOutstanding();
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

  // Dynamic Row Manipulations
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

      if (window.GoogleSheetsHandler && window.GoogleSheetsHandler.isConnected && removed.sheetRowIndex) {
        window.GoogleSheetsHandler.clearRange(`Cash_Flow!A${removed.sheetRowIndex}:H${removed.sheetRowIndex}`);
      }
      return true;
    }
    return false;
  }

  addLoanGiven(loan) {
    loan.id = 'loan-given-' + Date.now();
    this.data.loansGiven.unshift(loan);
    this.save();
    return loan;
  }

  deleteLoanGiven(id) {
    const idx = this.data.loansGiven.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.data.loansGiven.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  addLoanTaken(loan) {
    loan.id = 'loan-taken-' + Date.now();
    this.data.loansTaken.unshift(loan);
    this.save();
    return loan;
  }

  deleteLoanTaken(id) {
    const idx = this.data.loansTaken.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.data.loansTaken.splice(idx, 1);
      this.save();
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
