import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

const STORAGE_KEY = 'RS25F_MIND_FINANCE_DATA_V2';

const INITIAL_DATA = {
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

export const FinanceProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_DATA;
    } catch (e) {
      return INITIAL_DATA;
    }
  });

  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('g_access_token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
  const [currentView, setCurrentView] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'relentless');
  const [activeModal, setActiveModal] = useState(null);
  const [editingTx, setEditingTx] = useState(null);

  const sheetId = "1vCTXo6Mu172AaTPKfOPNeqnXsJA1oIWfV5HEurXm0ik";
  const clientId = "223951688164-fpfp028pti606lavi5iel7rihgts878v.apps.googleusercontent.com";
  const scopes = "https://www.googleapis.com/auth/spreadsheets";

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }, [data]);

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    const THEMES = {
      relentless: { "--bg-dark": "#0b0709", "--bull-green": "#10b981", "--bear-red": "#ef4444", "--amber-gold": "#f59e0b" },
      cyber: { "--bg-dark": "#040b14", "--bull-green": "#06b6d4", "--bear-red": "#ef4444", "--amber-gold": "#f59e0b" },
      purple: { "--bg-dark": "#0b0616", "--bull-green": "#a855f7", "--bear-red": "#ef4444", "--amber-gold": "#fbbf24" },
      emerald: { "--bg-dark": "#020f0a", "--bull-green": "#10b981", "--bear-red": "#ef4444", "--amber-gold": "#f59e0b" },
      sunset: { "--bg-dark": "#120903", "--bull-green": "#f59e0b", "--bear-red": "#ef4444", "--amber-gold": "#fbbf24" },
      ocean: { "--bg-dark": "#040d18", "--bull-green": "#38bdf8", "--bear-red": "#ef4444", "--amber-gold": "#f59e0b" },
      rose: { "--bg-dark": "#12050b", "--bull-green": "#f43f5e", "--bear-red": "#ef4444", "--amber-gold": "#fbbf24" },
      lime: { "--bg-dark": "#070e03", "--bull-green": "#84cc16", "--bear-red": "#ef4444", "--amber-gold": "#f59e0b" },
      slate: { "--bg-dark": "#0f172a", "--bull-green": "#64748b", "--bear-red": "#ef4444", "--amber-gold": "#f59e0b" }
    };
    const activeColors = THEMES[theme] || THEMES.relentless;
    Object.keys(activeColors).forEach(k => {
      document.documentElement.style.setProperty(k, activeColors[k]);
    });
  }, [theme]);

  // Google Sign In
  const handleGoogleLogin = () => {
    if (typeof window.google === 'undefined' || !window.google.accounts?.oauth2) {
      alert("Google API loading... Please check internet connection.");
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: scopes,
      callback: async r => {
        if (r.error) return alert("OAuth Error: " + JSON.stringify(r));
        setAccessToken(r.access_token);
        setIsAuthenticated(true);

        const expiresInSec = r.expires_in ? parseInt(r.expires_in, 10) : 3500;
        const expiresAt = Date.now() + expiresInSec * 1000;
        localStorage.setItem("g_access_token", r.access_token);
        localStorage.setItem("g_token_expires", expiresAt.toString());
      }
    });
    client.requestAccessToken({ prompt: 'consent' });
  };

  const handleGoogleLogout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("g_access_token");
    localStorage.removeItem("g_token_expires");
  };

  // Filtered Transactions by period
  const getFilteredTransactions = () => {
    const allTx = data.transactions || [];
    if (!allTx.length) return [];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return allTx.filter(t => {
      if (!t.date) return true;
      const txDate = new Date(t.date);
      if (isNaN(txDate.getTime())) return true;

      if (selectedPeriod === 'daily') return t.date === todayStr;
      if (selectedPeriod === 'weekly') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return txDate >= oneWeekAgo && txDate <= now;
      }
      if (selectedPeriod === 'monthly') {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }
      if (selectedPeriod === 'yearly') return txDate.getFullYear() === now.getFullYear();
      if (selectedPeriod === 'custom') {
        if (customStartDate && t.date < customStartDate) return false;
        if (customEndDate && t.date > customEndDate) return false;
        return true;
      }
      return true;
    });
  };

  // Calculated Metrics
  const totalBankBalance = data.bankAccounts.reduce((s, a) => s + (parseFloat(a.balance) || 0), 0);
  const totalInvested = data.investments.reduce((s, i) => s + (parseFloat(i.investedAmount) || 0), 0);
  const totalPortfolioValue = data.investments.reduce((s, i) => s + (parseFloat(i.currentValue) || 0), 0);
  const totalLoansGiven = data.loansGiven.reduce((s, l) => s + (parseFloat(l.outstandingOwed) || parseFloat(l.amountGiven) || 0), 0);
  const totalCreditLimit = data.creditCards.reduce((s, c) => s + (parseFloat(c.limit) || 0), 0);
  const totalCreditOutstanding = data.creditCards.reduce((s, c) => s + (parseFloat(c.outstanding) || 0), 0);
  const totalLoansTaken = data.loansTaken.reduce((s, l) => s + (parseFloat(l.outstandingBalance) || parseFloat(l.amountTaken) || 0), 0);

  const netWorth = (totalBankBalance + totalPortfolioValue + totalLoansGiven) - (totalCreditOutstanding + totalLoansTaken);
  const creditUtil = totalCreditLimit > 0 ? (totalCreditOutstanding / totalCreditLimit) * 100 : 0;

  const filteredTx = getFilteredTransactions();
  const totalIncome = filteredTx.filter(t => t.type === 'income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const totalExpense = filteredTx.filter(t => t.type === 'expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // CRUD Operations
  const addTransaction = (tx) => {
    const newTx = { ...tx, id: 'tx-' + Date.now() };
    setData(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
  };

  const editTransaction = (id, updated) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => t.id === id ? { ...t, ...updated } : t)
    }));
  };

  const deleteTransaction = (id) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const addCreditCard = (card) => {
    const newCard = { ...card, id: 'card-' + Date.now() };
    setData(prev => ({ ...prev, creditCards: [...prev.creditCards, newCard] }));
  };

  const addBankAccount = (bank) => {
    const newBank = { ...bank, id: 'bank-' + Date.now() };
    setData(prev => ({ ...prev, bankAccounts: [...prev.bankAccounts, newBank] }));
  };

  const addTrade = (trade) => {
    const newTrade = { ...trade, id: 'inv-' + Date.now() };
    setData(prev => ({ ...prev, investments: [...prev.investments, newTrade] }));
  };

  const addLoanGiven = (loan) => {
    const newLoan = { ...loan, id: 'loan-given-' + Date.now() };
    setData(prev => ({ ...prev, loansGiven: [newLoan, ...prev.loansGiven] }));
  };

  const addLoanTaken = (loan) => {
    const newLoan = { ...loan, id: 'loan-taken-' + Date.now() };
    setData(prev => ({ ...prev, loansTaken: [newLoan, ...prev.loansTaken] }));
  };

  return (
    <FinanceContext.Provider value={{
      data,
      selectedPeriod, setSelectedPeriod,
      customStartDate, setCustomStartDate,
      customEndDate, setCustomEndDate,
      isAuthenticated,
      handleGoogleLogin,
      handleGoogleLogout,
      currentView, setCurrentView,
      theme, setTheme,
      activeModal, setActiveModal,
      editingTx, setEditingTx,
      netWorth,
      savingsRate,
      totalBankBalance,
      totalLoansGiven,
      totalLoansTaken,
      totalCreditLimit,
      totalCreditOutstanding,
      totalInvested,
      totalPortfolioValue,
      creditUtil,
      filteredTx,
      addTransaction,
      editTransaction,
      deleteTransaction,
      addCreditCard,
      addBankAccount,
      addTrade,
      addLoanGiven,
      addLoanTaken
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
