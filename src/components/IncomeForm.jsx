import React, { useState, useEffect } from 'react';
import { X, Plus, DollarSign } from 'lucide-react';
import { INCOME_SOURCES } from '../data/defaultCategories';
import { format } from 'date-fns';

const IncomeForm = ({ isOpen, onClose, onSubmit, income = null }) => {
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    recurring: false,
    frequency: 'monthly'
  });

  useEffect(() => {
    if (income) {
      setFormData({
        source: income.source || '',
        amount: income.amount?.toString() || '',
        date: income.date ? format(new Date(income.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        description: income.description || '',
        recurring: income.recurring || false,
        frequency: income.frequency || 'monthly'
      });
    } else {
      setFormData({
        source: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        recurring: false,
        frequency: 'monthly'
      });
    }
  }, [income]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const incomeData = {
      source: formData.source,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description,
      recurring: formData.recurring,
      frequency: formData.frequency
    };

    onSubmit(incomeData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1a1a1a' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid #333333' }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#0a0a0a', border: '1px solid #fbbf24' }}>
              <Plus className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {income ? 'Edit Wayne Enterprises Income' : 'Add New Wayne Enterprises Income'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:text-white"
            style={{ color: '#9ca3af' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0a0a0a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Income Source *
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #555555'
                }}
                placeholder="e.g., Salary, Freelance"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400">
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
                  className="w-full pl-8 pr-3 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
                  style={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #555555'
                  }}
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
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #555555'
                }}
              />
            </div>

            {/* Frequency (if recurring) */}
            {formData.recurring && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
                  style={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #555555'
                  }}
                >
                  <option value="weekly" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>Weekly</option>
                  <option value="bi-weekly" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>Bi-weekly</option>
                  <option value="monthly" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>Monthly</option>
                  <option value="quarterly" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>Quarterly</option>
                  <option value="yearly" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>Yearly</option>
                </select>
              </div>
            )}
          </div>

          {/* Recurring checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="recurring"
              id="recurring"
              checked={formData.recurring}
              onChange={handleChange}
              className="rounded focus:ring-yellow-400 focus:ring-2"
              style={{
                backgroundColor: '#0a0a0a',
                borderColor: '#555555',
                color: '#fbbf24'
              }}
            />
            <label htmlFor="recurring" className="text-sm font-medium text-gray-300">
              This is a recurring Wayne Enterprises income stream
            </label>
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
              className="w-full px-3 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #555555'
              }}
              placeholder="Add any additional notes about this income stream..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4" style={{ borderTop: '1px solid #333333' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 rounded-lg transition-all duration-200 hover:text-white"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #555555'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.borderColor = '#777777';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0a0a0a';
                e.currentTarget.style.borderColor = '#555555';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-black font-medium rounded-lg transition-all duration-200"
              style={{
                backgroundColor: '#fbbf24',
                border: '1px solid #fbbf24'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f59e0b';
                e.currentTarget.style.borderColor = '#f59e0b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fbbf24';
                e.currentTarget.style.borderColor = '#fbbf24';
              }}
            >
              {income ? 'Update Income' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeForm;