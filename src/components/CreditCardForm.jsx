import React, { useState, useEffect } from 'react';
import { X, CreditCard } from 'lucide-react';

const CreditCardForm = ({ isOpen, onClose, onSubmit, card = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        balance: '',
        statementBalance: '',
        minPayment: '',
        dueDate: '',
    });

    useEffect(() => {
        if (card) {
            setFormData({
                name: card.name || '',
                balance: card.balance?.toString() || '',
                statementBalance: card.statementBalance?.toString() || '',
                minPayment: card.minPayment?.toString() || '',
                dueDate: card.dueDate || '',
            });
        } else {
            setFormData({
                name: '',
                balance: '',
                statementBalance: '',
                minPayment: '',
                dueDate: '',
            });
        }
    }, [card]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const cardData = {
            name: formData.name,
            balance: parseFloat(formData.balance),
            statementBalance: parseFloat(formData.statementBalance),
            minPayment: parseFloat(formData.minPayment),
            dueDate: formData.dueDate,
        };

        onSubmit(cardData);
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
                    <h2 className="text-xl font-semibold text-white">{card ? 'Edit Credit Card' : 'Add New Credit Card'}</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-700">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Card Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                            placeholder="e.g., Chase Sapphire Preferred"
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
                                placeholder="2500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Statement Balance *</label>
                            <input
                                type="number"
                                name="statementBalance"
                                value={formData.statementBalance}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                                placeholder="1200"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Payment *</label>
                            <input
                                type="number"
                                name="minPayment"
                                value={formData.minPayment}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                                placeholder="50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Due Date *</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg text-white bg-gray-800 border border-gray-600 focus:ring-yellow-400"
                            />
                        </div>
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
                            {card ? 'Update Card' : 'Add Card'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreditCardForm;
