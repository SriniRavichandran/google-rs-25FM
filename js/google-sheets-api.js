/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Google Sheets API Engine
   Auto-Creates All Module Tabs & Headers on Single Sheet (1vCTXo6Mu172AaTPKfOPNeqnXsJA1oIWfV5HEurXm0ik)
   ========================================================================== */

class GoogleSheetsHandler {
  constructor() {
    this.accessToken = null;
    this.currentSheet = window.CONFIG?.SHEET_NAME || "Expense Tracking";
    this.availableSheets = [];
    this.sheetMap = {};
    this.sheetId = window.CONFIG?.GOOGLE_SHEET_ID || "1vCTXo6Mu172AaTPKfOPNeqnXsJA1oIWfV5HEurXm0ik";
    this.clientId = window.CONFIG?.GOOGLE_CLIENT_ID || "223951688164-fpfp028pti606lavi5iel7rihgts878v.apps.googleusercontent.com";
    this.scopes = window.CONFIG?.SCOPES || "https://www.googleapis.com/auth/spreadsheets";

    this.initAutoSession();
  }

  initAutoSession() {
    window.addEventListener('DOMContentLoaded', async () => {
      const savedToken = localStorage.getItem("g_access_token");
      const expiresAt = localStorage.getItem("g_token_expires");

      if (savedToken && expiresAt && Date.now() < (parseInt(expiresAt, 10) - 60000)) {
        this.accessToken = savedToken;
        this.updateAuthUI(true, "Connected");
        try {
          await this.fetchSheetTabs();
          await this.autoCreateAllModuleSheets();
          await this.loadSheet();
        } catch (e) {
          console.warn("Auto-restore session error:", e);
        }
      } else {
        this.updateAuthUI(false, "Sign In Required");
      }
    });
  }

  googleLogin() {
    if (typeof google === 'undefined' || !google.accounts?.oauth2) {
      alert("Google API library loading. Please check internet connection.");
      return;
    }

    const client = google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: this.scopes,
      callback: async r => {
        if (r.error) return alert("OAuth Error: " + JSON.stringify(r));
        
        this.accessToken = r.access_token;

        const expiresInSec = r.expires_in ? parseInt(r.expires_in, 10) : 3500;
        const expiresAt = Date.now() + expiresInSec * 1000;
        localStorage.setItem("g_access_token", this.accessToken);
        localStorage.setItem("g_token_expires", expiresAt.toString());

        this.updateAuthUI(true, "Connected");
        
        try {
          await this.fetchSheetTabs();
          await this.autoCreateAllModuleSheets();
          await this.loadSheet();
        } catch (e) {
          console.error("Login sheet load error:", e);
        }
      }
    });
    client.requestAccessToken({ prompt: 'consent' });
  }

  googleLogout() {
    if (this.accessToken && typeof google !== 'undefined' && google.accounts?.oauth2) {
      try { google.accounts.oauth2.revoke(this.accessToken, () => {}); } catch(e){}
    }
    this.accessToken = null;
    localStorage.removeItem("g_access_token");
    localStorage.removeItem("g_token_expires");

    this.updateAuthUI(false, "Sign In Required");
    window.StorageInstance.clearAllData();
    if (window.AppRouter) {
      window.AppRouter.setAuthGatedState(false);
    }
  }

  updateAuthUI(connected, text) {
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const syncDot = document.getElementById("syncDot");
    const syncText = document.getElementById("syncText");

    if (loginBtn) loginBtn.style.display = connected ? "none" : "inline-flex";
    if (logoutBtn) logoutBtn.style.display = connected ? "inline-flex" : "none";
    if (syncDot) syncDot.className = `sync-dot ${connected ? "online" : "offline"}`;
    if (syncText) syncText.textContent = text;

    if (window.AppRouter) {
      window.AppRouter.setAuthGatedState(connected);
    }
  }

  async api(url, options = {}) {
    if (!this.accessToken) {
      this.googleLogin();
      throw new Error("Please sign in with Google to sync with online Google Sheets.");
    }
    options.headers = { ...options.headers, Authorization: `Bearer ${this.accessToken}` };
    const r = await fetch(url, options);

    if (r.status === 401 || r.status === 403) {
      this.accessToken = null;
      localStorage.removeItem("g_access_token");
      localStorage.removeItem("g_token_expires");

      this.updateAuthUI(false, "Session Expired");
      throw new Error("Google Token Expired. Please click 'Sign in with Google' again.");
    }

    if (!r.ok) throw new Error(`Google API Error (${r.status}): ${await r.text()}`);
    return r.json();
  }

  /* Fetch Sheet Tabs Dynamically from Google Sheets API */
  async fetchSheetTabs() {
    if (!this.accessToken) return;
    try {
      const res = await this.api(`https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}?fields=sheets.properties(sheetId,title)`);
      if (res.sheets && res.sheets.length) {
        this.sheetMap = {};
        this.availableSheets = res.sheets.map(s => {
          this.sheetMap[s.properties.title] = s.properties.sheetId;
          return s.properties.title;
        });
        if (!this.availableSheets.includes(this.currentSheet)) {
          this.currentSheet = this.availableSheets[0] || "Sheet1";
        }
      }
    } catch (e) {
      console.warn("Could not fetch sheets:", e);
    }
  }

  colName(n) {
    let s = "";
    while (n > 0) {
      let r = (n - 1) % 26;
      s = String.fromCharCode(65 + r) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  }

  /* Automatically creates all missing module tabs & headers on Google Sheet */
  async autoCreateAllModuleSheets() {
    if (!this.accessToken) return;

    const requiredSheets = [
      { title: 'Debit', headers: ['ID', 'Account Name', 'Bank', 'Account Type', 'Balance', 'Account No'] },
      { title: 'Credit', headers: ['ID', 'Card Name', 'Bank', 'Network', 'Limit', 'Outstanding', 'Due Date', 'Last 4'] },
      { title: 'Cash', headers: ['ID', 'Date', 'Type', 'Category', 'Amount', 'Payment Method', 'Account', 'Description'] },
      { title: 'Trade', headers: ['ID', 'Symbol', 'Asset Name', 'Type', 'Quantity', 'Avg Buy Price', 'Current Price', 'Invested Amount', 'Current Value', 'P&L'] },
      { title: 'Given_Loan', headers: ['ID', 'Borrower Name', 'Amount Given', 'Interest Rate %', 'Date Given', 'Due Date', 'Amount Repaid', 'Outstanding Owed', 'Status'] },
      { title: 'Taken_Loan', headers: ['ID', 'Lender Name', 'Amount Borrowed', 'Interest Rate %', 'Date Taken', 'Due Date', 'Amount Repaid', 'Outstanding Debt', 'Status'] },
      { title: 'Bills_Subscriptions', headers: ['ID', 'Name', 'Category', 'Amount', 'Due Date', 'Status'] },
      { title: 'Budget_vs_Actual', headers: ['ID', 'Category', 'Monthly Budget', 'Current Spent'] },
      { title: 'Goals', headers: ['ID', 'Goal Name', 'Target Amount', 'Current Saved', 'Target Date'] },
      { title: 'Reviews', headers: ['Review Period', 'Savings Rate %', 'Budget Adherence', 'Notes'] },
      { title: 'Net_Worth', headers: ['Date', 'Total Assets', 'Total Liabilities', 'Net Worth'] }
    ];

    const missingSheets = requiredSheets.filter(req => !this.availableSheets.includes(req.title));

    if (missingSheets.length === 0) return;

    console.log(`Auto-creating ${missingSheets.length} module sheet tabs on Google Sheet 1vCTXo6Mu172AaTPKfOPNeqnXsJA1oIWfV5HEurXm0ik...`);

    const requests = missingSheets.map(s => ({
      addSheet: {
        properties: { title: s.title }
      }
    }));

    try {
      await this.api(`https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}:batchUpdate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requests })
      });

      for (const s of missingSheets) {
        try {
          await this.api(`https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${encodeURIComponent(s.title)}!A1:${this.colName(s.headers.length)}1?valueInputOption=USER_ENTERED`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ range: `${s.title}!A1`, values: [s.headers] })
          });
        } catch (hErr) {}
      }

      await this.fetchSheetTabs();
    } catch (err) {
      console.warn("Auto-create sheets warning:", err);
    }
  }

  /* Load Active Sheet Records from Google Sheets API v4 */
  async loadSheet() {
    if (!this.accessToken) return;

    try {
      this.updateAuthUI(true, "Syncing...");
      const range = `'${this.currentSheet}'`;
      let res;
      try {
        res = await this.api(`https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${encodeURIComponent(range)}`);
      } catch (err) {
        res = await this.api(`https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/Sheet1!A:H`);
      }

      const rawValues = res.values || [];

      // Auto-initialize header row & starter entries if sheet is completely empty
      if (rawValues.length === 0) {
        console.log("Empty sheet detected. Initializing headers on Google Sheet...");
        const initialRows = [
          ["ID", "Date", "Type", "Category", "Amount", "Payment Method", "Account", "Description"],
          ["TX-1001", new Date().toISOString().split('T')[0], "income", "Salary", "75000", "Bank Transfer", "HDFC Savings", "Monthly Salary Credit"],
          ["TX-1002", new Date().toISOString().split('T')[0], "expense", "Food & Dining", "1250", "UPI", "GooglePay (HDFC)", "Dinner with family"],
          ["TX-1003", new Date().toISOString().split('T')[0], "investment", "Mutual Funds", "10000", "Bank Transfer", "Zerodha Coin", "Monthly SIP Investment"]
        ];

        try {
          await this.api(`https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/Sheet1!A1:H4?valueInputOption=USER_ENTERED`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ range: "Sheet1!A1:H4", values: initialRows })
          });
          console.log("Successfully initialized headers and starter rows on Google Sheet!");
          return await this.loadSheet();
        } catch (initErr) {
          console.warn("Auto header init warning:", initErr);
        }
      }

      if (rawValues.length > 1) {
        const parsedTransactions = rawValues.slice(1).map((r, idx) => ({
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

        window.StorageInstance.data.transactions = parsedTransactions;
        window.StorageInstance.save();
      }

      this.updateAuthUI(true, "Connected");
      if (window.AppRouter) {
        window.AppRouter.refreshCurrentModule();
      }
    } catch (e) {
      this.updateAuthUI(true, "Sync Error");
      console.error("Load sheet error:", e);
    }
  }

  /* Append Row directly to Google Sheet via API v4 */
  async appendRowToSheet(values) {
    if (!this.accessToken) {
      this.googleLogin();
      return false;
    }

    const rangesToTry = [
      `'${this.currentSheet}'!A:H`,
      'Sheet1!A:H',
      'Cash!A:H',
      'Expense Tracking!A:H'
    ];

    for (const range of rangesToTry) {
      try {
        await this.api(`https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values: [values] })
        });
        console.log(`Successfully appended row to ${range}`);
        await this.loadSheet();
        return true;
      } catch (e) {
        console.warn(`Append error on ${range}:`, e);
      }
    }
    return false;
  }

  /* Clear Row Range in Google Sheet */
  async clearRange(range) {
    if (!this.accessToken) return false;
    try {
      await this.api(`https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${encodeURIComponent(range)}:clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      return true;
    } catch (err) {
      console.error(`Error clearing ${range}:`, err);
      return false;
    }
  }
}

window.GoogleSheetsHandler = new GoogleSheetsHandler();
window.googleLogin = () => window.GoogleSheetsHandler.googleLogin();
window.googleLogout = () => window.GoogleSheetsHandler.googleLogout();
window.refreshAll = () => window.GoogleSheetsHandler.loadSheet();
