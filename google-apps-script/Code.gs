/**
 * RS-25F MIND Personal Finance Tracker — Google Apps Script
 * Sheet URL: https://docs.google.com/spreadsheets/d/1vCTXo6Mu172AaTPKfOPNeqnXsJA1oIWfV5HEurXm0ik/edit
 * 
 * Instructions:
 * 1. Open Google Sheet: https://docs.google.com/spreadsheets/d/1vCTXo6Mu172AaTPKfOPNeqnXsJA1oIWfV5HEurXm0ik/edit
 * 2. Click "Extensions" > "Apps Script".
 * 3. Paste this code into `Code.gs` and save.
 * 4. Run `setupSheetStructure()` to automatically create all sidebar module tabs & headers!
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('💳 RS-25F MIND')
    .addItem('📊 Open Finance Sidebar', 'showFinanceSidebar')
    .addSeparator()
    .addItem('🛠️ Auto-Setup Sheet Tabs & Headers', 'setupSheetStructure')
    .addToUi();
}

function showFinanceSidebar() {
  var html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
    <head>
      <base target="_top">
      <style>
        body { font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 15px; margin: 0; }
        .logo { width: 60px; display: block; margin: 0 auto 10px; }
        .title { font-size: 16px; font-weight: bold; text-align: center; color: #10b981; margin-bottom: 15px; }
        .btn { display: block; width: 100%; padding: 10px; margin-bottom: 8px; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 6px; cursor: pointer; text-align: left; font-weight: bold; }
        .btn:hover { background: #334155; border-color: #10b981; }
      </style>
    </head>
    <body>
      <div class="title">RS-25F MIND Navigation</div>
      <button class="btn" onclick="activateTab('Dashboard')">📊 Dashboard</button>
      <button class="btn" onclick="activateTab('Debit')">💳 Debit (Bank Accounts)</button>
      <button class="btn" onclick="activateTab('Credit')">💳 Credit (Credit Cards)</button>
      <button class="btn" onclick="activateTab('Cash')">💰 Cash (Cash Flow)</button>
      <button class="btn" onclick="activateTab('Trade')">📈 Trade (Investments)</button>
      <button class="btn" onclick="activateTab('Given_Loan')">🤝 Given Loan (Money Owed)</button>
      <button class="btn" onclick="activateTab('Taken_Loan')">💸 Taken Loan (Borrowed Debt)</button>
      <button class="btn" onclick="activateTab('Bills_Subscriptions')">🔄 Bills & Subscriptions</button>
      <button class="btn" onclick="activateTab('Budget_vs_Actual')">🎯 Budget vs Actual</button>
      <button class="btn" onclick="activateTab('Goals')">🏆 Financial Goals</button>
      <button class="btn" onclick="activateTab('Reviews')">📅 Checkups & Reviews</button>
      <button class="btn" onclick="activateTab('Net_Worth')">📈 Net-Worth Tracker</button>

      <script>
        function activateTab(name) {
          google.script.run.gotoSheet(name);
        }
      </script>
    </body>
    </html>
  `)
  .setTitle('RS-25F MIND Menu')
  .setWidth(300);
  
  SpreadsheetApp.getUi().showSidebar(html);
}

function gotoSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (sheet) {
    ss.setActiveSheet(sheet);
  }
}

/**
 * Automatically creates all module tabs in the Google Sheet matching the user's modules
 */
function setupSheetStructure() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var tabs = [
    { name: 'Dashboard', headers: ['Metric', 'Value', 'Status / Notes'] },
    { name: 'Debit', headers: ['ID', 'Account Name', 'Bank', 'Account Type', 'Balance', 'Account No'] },
    { name: 'Credit', headers: ['ID', 'Card Name', 'Bank', 'Network', 'Limit', 'Outstanding', 'Due Date', 'Last 4'] },
    { name: 'Cash', headers: ['ID', 'Date', 'Type', 'Category', 'Amount', 'Payment Method', 'Account', 'Description'] },
    { name: 'Trade', headers: ['ID', 'Symbol', 'Asset Name', 'Type', 'Quantity', 'Avg Buy Price', 'Current Price', 'Invested Amount', 'Current Value', 'P&L'] },
    { name: 'Given_Loan', headers: ['ID', 'Borrower Name', 'Amount Given', 'Interest Rate %', 'Date Given', 'Due Date', 'Amount Repaid', 'Outstanding Owed', 'Status'] },
    { name: 'Taken_Loan', headers: ['ID', 'Lender Name', 'Amount Borrowed', 'Interest Rate %', 'Date Taken', 'Due Date', 'Amount Repaid', 'Outstanding Debt', 'Status'] },
    { name: 'Bills_Subscriptions', headers: ['ID', 'Name', 'Category', 'Amount', 'Due Date', 'Status'] },
    { name: 'Budget_vs_Actual', headers: ['ID', 'Category', 'Monthly Budget', 'Current Spent'] },
    { name: 'Goals', headers: ['ID', 'Goal Name', 'Target Amount', 'Current Saved', 'Target Date'] },
    { name: 'Reviews', headers: ['Review Period', 'Savings Rate %', 'Budget Adherence', 'Notes'] },
    { name: 'Net_Worth', headers: ['Date', 'Total Assets', 'Total Liabilities', 'Net Worth'] }
  ];

  tabs.forEach(function(t) {
    var sheet = ss.getSheetByName(t.name);
    if (!sheet) {
      sheet = ss.insertSheet(t.name);
    }
    sheet.getRange(1, 1, 1, t.headers.length).setValues([t.headers])
      .setFontWeight('bold')
      .setBackground('#0f172a')
      .setFontColor('#10b981');
    sheet.setFrozenRows(1);
  });

  SpreadsheetApp.getUi().alert('✅ RS-25F MIND Sheet tabs and sidebar menu setup successfully!');
}
