import React, { useState, useEffect } from 'react';
import { X, Plus, Calculator } from 'lucide-react';
import { DEFAULT_EXPENSE_CATEGORIES, PAYMENT_METHODS, CASH_BACK_RATES } from '../data/defaultCategories';
import { format } from 'date-fns';

const ExpenseForm = ({ isOpen, onClose, onSubmit, expense = null }) => {
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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cashBackRate' ? parseFloat(value) : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {expense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select category</option>
                {DEFAULT_EXPENSE_CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Used
              </label>
              <input
                type="text"
                name="cardUsed"
                value={formData.cardUsed}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Chase Sapphire"
              />
            </div>
          </div>

          {/* Cash Back Section */}
          <div className="bg-green-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-green-900 flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Cash Back Calculation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Cash Back Rate
                </label>
                <select
                  name="cashBackRate"
                  value={formData.cashBackRate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  {CASH_BACK_RATES.map(rate => (
                    <option key={rate.value} value={rate.value}>
                      {rate.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Cash Back Earned
                </label>
                <div className="px-3 py-2 bg-white border border-green-300 rounded-lg text-green-900 font-semibold">
                  ${calculatedCashBack.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
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