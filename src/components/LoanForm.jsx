import React, { useState, useEffect } from 'react';
import { X, Plus, DollarSign } from 'lucide-react';

const LoanForm = ({ isOpen, onClose, onSubmit, loan = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        balance: '',
        interestRate: '',
        minPayment: '',
    });

    useEffect(() => {
        if (loan) {
            setFormData({
                name: loan.name || '',
                balance: loan.balance?.toString() || '',
                interestRate: loan.interestRate?.toString() || '',
                minPayment: loan.minPayment?.toString() || '',
            });
        } else {
            setFormData({
                name: '',
                balance: '',
                interestRate: '',
                minPayment: '',
            });
        }
    }, [loan]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const loanData = {
            name: formData.name,
            balance: parseFloat(formData.balance),
            interestRate: parseFloat(formData.interestRate),
            minPayment: parseFloat(formData.minPayment),
        };

        onSubmit(loanData);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="rounded-xl shadow-xl max-w-lg w-full" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#333333' }}>
                    <h2 className="text-xl font-semibold text-white">{loan ? 'Edit Loan' : 'Add New Loan'}</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-700">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Loan Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                            placeholder="e.g., Student Loan"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Total Balance *</label>
                            <input
                                type="number"
                                name="balance"
                                value={formData.balance}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                                placeholder="25000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Interest Rate (%) *</label>
                            <input
                                type="number"
                                name="interestRate"
                                value={formData.interestRate}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                                placeholder="5.5"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Payment *</label>
                        <input
                            type="number"
                            name="minPayment"
                            value={formData.minPayment}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                            placeholder="250"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-black font-medium rounded-lg bg-yellow-400 hover:bg-yellow-500"
                        >
                            {loan ? 'Update Loan' : 'Add Loan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanForm;
