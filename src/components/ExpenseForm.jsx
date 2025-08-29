import React, { useState, useEffect } from 'react';
import { X, Plus, Calculator, Tag } from 'lucide-react';
import { PAYMENT_METHODS, CASH_BACK_RATES } from '../data/defaultCategories';
import { format } from 'date-fns';
import { useCategories } from '../hooks/useCategories';
import { useCreditCards } from '../hooks/useCreditCards';

const ExpenseForm = ({ isOpen, onClose, onSubmit, expense = null, onOpenSettings }) => {
  const { allCategories, loading: categoriesLoading } = useCategories();
  const { creditCards, loading: cardsLoading } = useCreditCards();

  const [formData, setFormData] = useState({
    vendor: '',
    category: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    paymentMethod: 'Credit Card',
    cardUsed: '',
    cashBackRate: 0,
    description: ''
  });

  const [calculatedCashBack, setCalculatedCashBack] = useState(0);

  useEffect(() => {
    if (expense) {
      setFormData({
        vendor: expense.vendor || '',
        category: expense.category || '',
        amount: expense.amount?.toString() || '',
        date: expense.date ? format(new Date(expense.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: expense.paymentMethod || 'Credit Card',
        cardUsed: expense.cardUsed || '',
        cashBackRate: expense.cashBackRate || 0,
        description: expense.description || ''
      });
    } else {
      setFormData({
        vendor: '',
        category: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: 'Credit Card',
        cardUsed: '',
        cashBackRate: 0,
        description: ''
      });
    }
  }, [expense]);

  // Auto-calculate cash back rate based on selected credit card and category
  useEffect(() => {
    if (formData.cardUsed && formData.category && creditCards.length > 0) {
      const selectedCard = creditCards.find(card => card.id === formData.cardUsed);
      if (selectedCard && selectedCard.cashBackRates) {
        // Check for category-specific rate first, then default rate
        const categoryRate = selectedCard.cashBackRates[formData.category] || selectedCard.cashBackRates['default'] || 0;
        setFormData(prev => ({ ...prev, cashBackRate: categoryRate }));
      }
    }
  }, [formData.cardUsed, formData.category, creditCards]);

  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0;
    const cashBack = amount * formData.cashBackRate;
    setCalculatedCashBack(cashBack);
  }, [formData.amount, formData.cashBackRate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const expenseData = {
      vendor: formData.vendor,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      cardUsed: formData.cardUsed,
      cashBackRate: formData.cashBackRate,
      cashBackEarned: calculatedCashBack,
      description: formData.description
    };

    onSubmit(expenseData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category' && value === 'manage-categories') {
      if (onOpenSettings) {
        onClose(); // Close the expense form
        onOpenSettings(); // Open settings page
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'cashBackRate' ? parseFloat(value) : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1a1a1a' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#333333' }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg border" style={{ backgroundColor: '#1a1a1a', borderColor: '#fbbf24' }}>
              <Plus className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {expense ? 'Expense Ledger Update' : <>Record New <span className="text-yellow-400">Expense</span></>}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendor */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vendor *
              </label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter vendor name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={categoriesLoading}
              >
                <option value="">Select category</option>
                {allCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} {category.isCustom ? '(Custom)' : ''}
                  </option>
                ))}
                <option value="manage-categories" className="text-blue-300 font-medium">
                  ⚙️ Manage Categories
                </option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Used */}
            {formData.paymentMethod === 'Credit Card' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Credit Card
                </label>
                <select
                  name="cardUsed"
                  value={formData.cardUsed}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-white transition-colors"
                  style={{
                    backgroundColor: '#0a0a0a',
                    borderColor: '#555555'
                  }}
                >
                  <option value="">Select credit card</option>
                  {creditCards
                    .filter(card => card.isActive !== false)
                    .map(card => (
                      <option key={card.id} value={card.id}>
                        {card.name || 'Unknown Card'} (•••• {card.lastFourDigits})
                      </option>
                    ))}
                  {creditCards.length === 0 && (
                    <option value="" disabled>No credit cards added</option>
                  )}
                </select>
                {creditCards.length === 0 && (
                  <p className="text-xs text-yellow-400 mt-1">
                    Add credit cards in Profile → Credit Cards for automatic cash back calculation
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Cash Back Section */}
          <div className="rounded-lg p-4 space-y-4 border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
            <h3 className="font-medium text-yellow-400 flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Cash Back Calculation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cash Back Rate
                  {formData.cardUsed && formData.category && (
                    <span className="text-xs text-yellow-400 ml-2">(Auto-calculated)</span>
                  )}
                </label>
                <select
                  name="cashBackRate"
                  value={formData.cashBackRate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-white transition-colors"
                  style={{
                    backgroundColor: '#0a0a0a',
                    borderColor: '#555555'
                  }}
                  disabled={formData.cardUsed && formData.category}
                >
                  {CASH_BACK_RATES.map(rate => (
                    <option key={rate.value} value={rate.value}>
                      {rate.label}
                    </option>
                  ))}
                </select>
                {formData.cardUsed && formData.category && (
                  <p className="text-xs text-green-400 mt-1">
                    Rate automatically set based on your credit card
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cash Back Earned
                </label>
                <div className="px-3 py-2 border rounded-lg" style={{ backgroundColor: '#0a0a0a', borderColor: '#555555' }}>
                  <span className="text-green-400 font-semibold">
                    ${calculatedCashBack.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t" style={{ borderColor: '#333333' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {expense ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>


    </div>
  );
};

export default ExpenseForm;