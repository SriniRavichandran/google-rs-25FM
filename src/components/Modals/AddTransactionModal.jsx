import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext.jsx';

const AddTransactionModal = () => {
  const { activeModal, setActiveModal, editingTx, setEditingTx, addTransaction, editTransaction } = useFinance();

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food & Dining',
    paymentMethod: 'Credit Card',
    account: '',
    description: ''
  });

  useEffect(() => {
    if (editingTx) {
      setFormData({
        type: editingTx.type || 'expense',
        amount: editingTx.amount || '',
        date: editingTx.date || new Date().toISOString().split('T')[0],
        category: editingTx.category || 'Food & Dining',
        paymentMethod: editingTx.paymentMethod || 'Credit Card',
        account: editingTx.account || '',
        description: editingTx.description || ''
      });
    }
  }, [editingTx]);

  if (activeModal !== 'add-transaction') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTx) {
      editTransaction(editingTx.id, formData);
      setEditingTx(null);
    } else {
      addTransaction(formData);
    }
    setActiveModal(null);
  };

  return (
    <div className="modal-overlay open">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{editingTx ? '✏️ Edit Row / Amount' : '➕ Add Row / Amount to Google Sheet'}</h3>
          <button className="modal-close" onClick={() => { setActiveModal(null); setEditingTx(null); }}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Transaction Type</label>
              <select className="form-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required>
                <option value="expense">Expense (-)</option>
                <option value="income">Income (+)</option>
                <option value="investment">Investment Transfer</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" step="0.01" className="form-input" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} placeholder="e.g. 1500" required />
              </div>
              <div className="form-group">
                <label class="form-label">Date</label>
                <input type="date" class="form-input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <input type="text" className="form-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Food, Salary, Rent" required />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="form-select" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} required>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account / Card Used</label>
              <input type="text" className="form-input" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value })} placeholder="e.g. HDFC Regalia Gold" required />
            </div>

            <div className="form-group">
              <label className="form-label">Description / Note</label>
              <input type="text" className="form-input" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="e.g. Dinner with friends" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => { setActiveModal(null); setEditingTx(null); }}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save to Sheet & App</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
