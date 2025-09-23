import React, { useState, useEffect } from 'react';
import { X, PiggyBank } from 'lucide-react';

const SavingsForm = ({ isOpen, onClose, onSubmit, account = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        balance: '',
        goal: '',
        contribution: '',
    });

    useEffect(() => {
        if (account) {
            setFormData({
                name: account.name || '',
                balance: account.balance?.toString() || '',
                goal: account.goal?.toString() || '',
                contribution: account.contribution?.toString() || '',
            });
        } else {
            setFormData({
                name: '',
                balance: '',
                goal: '',
                contribution: '',
            });
        }
    }, [account]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const accountData = {
            name: formData.name,
            balance: parseFloat(formData.balance),
            goal: parseFloat(formData.goal),
            contribution: parseFloat(formData.contribution),
        };

        onSubmit(accountData);
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
                    <h2 className="text-xl font-semibold text-white">{account ? 'Edit Savings Goal' : 'Add New Savings Goal'}</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-700">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Goal Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                            placeholder="e.g., Emergency Fund"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Current Balance *</label>
                            <input
                                type="number"
                                name="balance"
                                value={formData.balance}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                                placeholder="10000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Savings Goal *</label>
                            <input
                                type="number"
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                                placeholder="20000"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Contribution *</label>
                        <input
                            type="number"
                            name="contribution"
                            value={formData.contribution}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                            placeholder="500"
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
                            {account ? 'Update Goal' : 'Add Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SavingsForm;
