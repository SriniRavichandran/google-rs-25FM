import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

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
  const [data, setData] = useState(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);

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

  // Google API fetch wrapper
  const apiFetch = async (url, options = {}, tokenOverride = null) => {
    const token = tokenOverride || accessToken || localStorage.getItem('g_access_token');
    if (!token) return null;
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
    const r = await fetch(url, options);
    if (!r.ok) {
      const errText = await r.text();
      console.warn(`Google Sheets API Warning (${r.status}):`, errText);
      return null;
    }
    return r.json();
  };

  // Ensure all 11 required module sheet tabs exist in Google Sheets
  const autoCreateModuleTabs = async (tokenOverride = null) => {
    const token = tokenOverride || accessToken || localStorage.getItem('g_access_token');
    if (!token) return;

    try {
      const meta = await apiFetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`, {}, token);
      if (!meta || !meta.sheets) return;

      const existingTitles = meta.sheets.map(s => s.properties.title);
      const requiredTabs = [
        'Sheet1', 'Credit', 'Debit', 'Cash', 'Trade', 'Given_Loan', 'Taken_Loan', 'Bills_Subscriptions', 'Budget_vs_Actual', 'Goals', 'Reviews'
      ];

      const missing = requiredTabs.filter(t => !existingTitles.includes(t));
      if (missing.length > 0) {
        const requests = missing.map(title => ({
          addSheet: { properties: { title } }
        }));
        await apiFetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requests })
        }, token);
        console.log("Auto-created missing sheet tabs:", missing);
      }
    } catch (err) {
      console.warn("Auto create tabs warning:", err);
    }
  };

  // Load ALL data directly from Google Sheets API v4 (Source of Truth)
  const loadAllSheetsFromGoogle = async (tokenOverride = null) => {
    const token = tokenOverride || accessToken || localStorage.getItem('g_access_token');
    if (!token) return;

    setIsLoading(true);
    await autoCreateModuleTabs(token);

    try {
      // Batch fetch values from Sheet1, Credit, Debit, Trade, Given_Loan, Taken_Loan
      const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?ranges=Sheet1!A:H&ranges=Credit!A:G&ranges=Debit!A:F&ranges=Trade!A:H&ranges=Given_Loan!A:H&ranges=Taken_Loan!A:H`;
      const json = await apiFetch(batchUrl, {}, token);

      if (json && json.valueRanges) {
        const ranges = json.valueRanges;

        // 1. Transactions (Sheet1)
        const txRows = (ranges[0]?.values || []).slice(1);
        const parsedTx = txRows.map((r, idx) => ({
          id: r[0] || `tx-${idx + 2}`,
          sheetRowIndex: idx + 2,
          date: r[1] || new Date().toISOString().split('T')[0],
          type: (r[2] || 'expense').toLowerCase(),
          category: r[3] || 'General',
          amount: parseFloat(r[4]) || 0,
          paymentMethod: r[5] || 'Cash',
          account: r[6] || 'Main Account',
          description: r[7] || ''
        }));

        // 2. Credit Cards (Credit)
        const creditRows = (ranges[1]?.values || []).slice(1);
        const parsedCredit = creditRows.map((r, idx) => ({
          id: r[0] || `card-${idx + 2}`,
          sheetRowIndex: idx + 2,
          name: r[1] || 'Credit Card',
          bank: r[2] || 'Bank',
          network: r[3] || 'Visa',
          limit: parseFloat(r[4]) || 0,
          outstanding: parseFloat(r[5]) || 0,
          dueDate: parseInt(r[6], 10) || 15
        }));

        // 3. Debit / Bank Accounts (Debit)
        const bankRows = (ranges[2]?.values || []).slice(1);
        const parsedBank = bankRows.map((r, idx) => ({
          id: r[0] || `bank-${idx + 2}`,
          sheetRowIndex: idx + 2,
          name: r[1] || 'Bank Account',
          bank: r[2] || 'Bank',
          type: r[3] || 'Savings',
          balance: parseFloat(r[4]) || 0,
          accountNumber: r[5] || '0000'
        }));

        // 4. Trade / Investments (Trade)
        const tradeRows = (ranges[3]?.values || []).slice(1);
        const parsedTrade = tradeRows.map((r, idx) => ({
          id: r[0] || `inv-${idx + 2}`,
          sheetRowIndex: idx + 2,
          name: r[1] || 'Asset',
          type: r[2] || 'Equity',
          action: r[3] || 'BUY',
          quantity: parseFloat(r[4]) || 0,
          buyPrice: parseFloat(r[5]) || 0,
          currentPrice: parseFloat(r[6]) || 0,
          investedAmount: (parseFloat(r[4]) || 0) * (parseFloat(r[5]) || 0),
          currentValue: (parseFloat(r[4]) || 0) * (parseFloat(r[6]) || 0)
        }));

        // 5. Loans Given (Given_Loan)
        const givenRows = (ranges[4]?.values || []).slice(1);
        const parsedGiven = givenRows.map((r, idx) => ({
          id: r[0] || `given-${idx + 2}`,
          sheetRowIndex: idx + 2,
          borrowerName: r[1] || 'Borrower',
          amountGiven: parseFloat(r[2]) || 0,
          interestRate: parseFloat(r[3]) || 0,
          dateGiven: r[4] || '',
          dueDate: r[5] || '',
          amountRepaid: parseFloat(r[6]) || 0,
          outstandingOwed: parseFloat(r[7]) || ((parseFloat(r[2]) || 0) - (parseFloat(r[6]) || 0))
        }));

        // 6. Loans Taken (Taken_Loan)
        const takenRows = (ranges[5]?.values || []).slice(1);
        const parsedTaken = takenRows.map((r, idx) => ({
          id: r[0] || `taken-${idx + 2}`,
          sheetRowIndex: idx + 2,
          lenderName: r[1] || 'Lender',
          amountTaken: parseFloat(r[2]) || 0,
          interestRate: parseFloat(r[3]) || 0,
          dateTaken: r[4] || '',
          dueDate: r[5] || '',
          amountRepaid: parseFloat(r[6]) || 0,
          outstandingBalance: parseFloat(r[7]) || ((parseFloat(r[2]) || 0) - (parseFloat(r[6]) || 0))
        }));

        setData({
          transactions: parsedTx,
          creditCards: parsedCredit,
          bankAccounts: parsedBank,
          investments: parsedTrade,
          loansGiven: parsedGiven,
          loansTaken: parsedTaken,
          budgets: [],
          bills: [],
          goals: []
        });
      }
    } catch (err) {
      console.warn("Load all sheets error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Restore session & load Google Sheet on mount
  useEffect(() => {
    const token = localStorage.getItem('g_access_token');
    const expiresAt = localStorage.getItem('g_token_expires');

    if (token && expiresAt && Date.now() < (parseInt(expiresAt, 10) - 60000)) {
      setAccessToken(token);
      setIsAuthenticated(true);
      loadAllSheetsFromGoogle(token);
    }
  }, []);

  // Google Sign In
  const handleGoogleLogin = () => {
    if (typeof window.google === 'undefined' || !window.google.accounts?.oauth2) {
      alert("Google OAuth API loading... Please check internet connection.");
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

        loadAllSheetsFromGoogle(r.access_token);
      }
    });
    client.requestAccessToken({ prompt: 'consent' });
  };

  const handleGoogleLogout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("g_access_token");
    localStorage.removeItem("g_token_expires");
    setData(INITIAL_DATA);
  };

  // Live Append Row to Google Sheet
  const appendRowToSheet = async (values, sheetTabName) => {
    const token = accessToken || localStorage.getItem('g_access_token');
    if (!token) return;
    try {
      await apiFetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetTabName)}!A:Z:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [values] })
        },
        token
      );
      console.log(`Live appended row to Google Sheet tab: ${sheetTabName}`);
    } catch (e) {
      console.warn(`Append error on ${sheetTabName}:`, e);
    }
  };

  // Live Update Row in Google Sheet
  const updateRowInSheet = async (sheetTabName, rowIndex, values) => {
    const token = accessToken || localStorage.getItem('g_access_token');
    if (!token) return;
    try {
      const range = `${sheetTabName}!A${rowIndex}:H${rowIndex}`;
      await apiFetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ range, values: [values] })
        },
        token
      );
      console.log(`Live updated row ${rowIndex} in Google Sheet tab: ${sheetTabName}`);
    } catch (e) {
      console.warn(`Update error on ${sheetTabName}:`, e);
    }
  };

  // Live Clear / Delete Row in Google Sheet
  const deleteRowInSheet = async (sheetTabName, rowIndex) => {
    const token = accessToken || localStorage.getItem('g_access_token');
    if (!token) return;
    try {
      const range = `${sheetTabName}!A${rowIndex}:Z${rowIndex}`;
      await apiFetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:clear`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        },
        token
      );
      console.log(`Live cleared row ${rowIndex} in Google Sheet tab: ${sheetTabName}`);
    } catch (e) {
      console.warn(`Clear error on ${sheetTabName}:`, e);
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

  // Live CRUD Handlers targeting Google Sheets API v4
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
    appendRowToSheet([newTrade.id, newTrade.name, newTrade.type, newTrade.action, newTrade.quantity, newTrade.buyPrice, newTrade.currentPrice], 'Trade');
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
      isLoading,
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
      addLoanTaken,
      refreshData: loadAllSheetsFromGoogle
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
