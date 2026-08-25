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

  // Google Sheets API v4 Helper Call
  const apiCall = async (url, options = {}) => {
    const token = accessToken || localStorage.getItem('g_access_token');
    if (!token) return null;
    options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
    const r = await fetch(url, options);
    if (!r.ok) throw new Error(`Google API Error (${r.status}): ${await r.text()}`);
    return r.json();
  };

  // Auto-restore session & load Google Sheet on mount
  useEffect(() => {
    const token = localStorage.getItem('g_access_token');
    const expiresAt = localStorage.getItem('g_token_expires');

    if (token && expiresAt && Date.now() < (parseInt(expiresAt, 10) - 60000)) {
      setAccessToken(token);
      setIsAuthenticated(true);
      loadSheetData(token);
    }
  }, []);

  // Load Sheet Data from Google Sheet
  const loadSheetData = async (tokenOverride = null) => {
    const token = tokenOverride || accessToken || localStorage.getItem('g_access_token');
    if (!token) return;

    try {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:H`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const json = await res.json();
      const rawValues = json.values || [];

      if (rawValues.length > 1) {
        const parsedTx = rawValues.slice(1).map((r, idx) => ({
          id: r[0] || `row-${idx + 2}`,
          sheetRowIndex: idx + 2,
          date: r[1] || new Date().toISOString().split('T')[0],
          type: (r[2] || 'expense').toLowerCase(),
          category: r[3] || 'General',
          amount: parseFloat(r[4]) || 0,
          paymentMethod: r[5] || 'Cash',
          account: r[6] || 'Main Account',
          description: r[7] || ''
        }));

        setData(prev => ({ ...prev, transactions: parsedTx }));
      }
    } catch (err) {
      console.warn("Load sheet data warning:", err);
    }
  };

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

        loadSheetData(r.access_token);
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

  // Google Sheet API Operations (Append, Update, Delete)
  const appendRowToSheet = async (values, targetSheet = 'Sheet1') => {
    const token = accessToken || localStorage.getItem('g_access_token');
    if (!token) return;
    try {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(targetSheet)}!A:Z:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [values] })
      });
      console.log(`Appended row live to Google Sheet ${targetSheet}`);
    } catch (e) {
      console.warn(`Append row error on ${targetSheet}:`, e);
    }
  };

  const updateRowInSheet = async (sheetTabName, rowIndex, values) => {
    const token = accessToken || localStorage.getItem('g_access_token');
    if (!token) return;
    try {
      const range = `${sheetTabName}!A${rowIndex}:H${rowIndex}`;
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ range, values: [values] })
      });
      console.log(`Updated row ${rowIndex} live in Google Sheet ${sheetTabName}`);
    } catch (e) {
      console.warn(`Update row error on ${sheetTabName}:`, e);
    }
  };

  const deleteRowInSheet = async (sheetTabName, rowIndex) => {
    const token = accessToken || localStorage.getItem('g_access_token');
    if (!token) return;
    try {
      const range = `${sheetTabName}!A${rowIndex}:Z${rowIndex}`;
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:clear`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      console.log(`Cleared row ${rowIndex} live in Google Sheet ${sheetTabName}`);
    } catch (e) {
      console.warn(`Clear row error on ${sheetTabName}:`, e);
    }
  };

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

  // CRUD Operations with Live Google Sheet Sync
  const addTransaction = (tx) => {
    const newTx = { ...tx, id: 'tx-' + Date.now(), sheetRowIndex: data.transactions.length + 2 };
    setData(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));

    appendRowToSheet([
      newTx.id, newTx.date, newTx.type, newTx.category, newTx.amount, newTx.paymentMethod, newTx.account, newTx.description
    ], 'Sheet1');
  };

  const editTransaction = (id, updated) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => {
        if (t.id === id) {
          const item = { ...t, ...updated };
          updateRowInSheet('Sheet1', item.sheetRowIndex || 2, [
            item.id, item.date, item.type, item.category, item.amount, item.paymentMethod, item.account, item.description
          ]);
          return item;
        }
        return t;
      })
    }));
  };

  const deleteTransaction = (id) => {
    const target = data.transactions.find(t => t.id === id);
    if (target && target.sheetRowIndex) {
      deleteRowInSheet('Sheet1', target.sheetRowIndex);
    }
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const addCreditCard = (card) => {
    const newCard = { ...card, id: 'card-' + Date.now() };
    setData(prev => ({ ...prev, creditCards: [...prev.creditCards, newCard] }));
    appendRowToSheet([newCard.id, newCard.name, newCard.bank, newCard.network, newCard.limit, newCard.outstanding, newCard.dueDate], 'Credit');
  };

  const addBankAccount = (bank) => {
    const newBank = { ...bank, id: 'bank-' + Date.now() };
    setData(prev => ({ ...prev, bankAccounts: [...prev.bankAccounts, newBank] }));
    appendRowToSheet([newBank.id, newBank.name, newBank.bank, newBank.type, newBank.balance, newBank.accountNumber], 'Debit');
  };

  const addTrade = (trade) => {
    const newTrade = { ...trade, id: 'inv-' + Date.now() };
    setData(prev => ({ ...prev, investments: [...prev.investments, newTrade] }));
    appendRowToSheet([newTrade.id, newTrade.name, newTrade.type, newTrade.quantity, newTrade.buyPrice, newTrade.currentPrice], 'Trade');
  };

  const addLoanGiven = (loan) => {
    const newLoan = { ...loan, id: 'loan-given-' + Date.now() };
    setData(prev => ({ ...prev, loansGiven: [newLoan, ...prev.loansGiven] }));
    appendRowToSheet([newLoan.id, newLoan.borrowerName, newLoan.amountGiven, newLoan.interestRate, newLoan.dateGiven, newLoan.dueDate, newLoan.amountRepaid, newLoan.outstandingOwed], 'Given_Loan');
  };

  const addLoanTaken = (loan) => {
    const newLoan = { ...loan, id: 'loan-taken-' + Date.now() };
    setData(prev => ({ ...prev, loansTaken: [newLoan, ...prev.loansTaken] }));
    appendRowToSheet([newLoan.id, newLoan.lenderName, newLoan.amountTaken, newLoan.interestRate, newLoan.dateTaken, newLoan.dueDate, newLoan.amountRepaid, newLoan.outstandingBalance], 'Taken_Loan');
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
