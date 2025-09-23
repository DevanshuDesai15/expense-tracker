import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const CreditCardPayment = ({ creditCards = [], onAdd }) => {
    const totalCreditCardBalance = creditCards.reduce((total, card) => total + (card.balance || 0), 0);
    const totalStatementBalance = creditCards.reduce((total, card) => total + (card.statementBalance || 0), 0);

    return (
        <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Credit Card Payments</h2>
                <button onClick={onAdd} className="flex items-center space-x-2 px-4 py-2 text-black font-medium rounded-lg" style={{ backgroundColor: '#fbbf24' }}>
                    <Plus className="w-4 h-4" />
                    <span>Add Card</span>
                </button>
            </div>
            <div className="space-y-4">
                {creditCards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#0a0a0a' }}>
                        <div>
                            <p className="font-semibold text-white">{card.name}</p>
                            <p className="text-sm text-gray-400">
                                Due: {card.dueDate || 'N/A'} | Min: ${card.minPayment ? card.minPayment.toLocaleString() : 'N/A'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div>
                                <p className="text-sm text-gray-400">Statement</p>
                                <p className="text-lg font-bold text-yellow-400">${(card.statementBalance || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Current</p>
                                <p className="text-lg font-bold text-red-400">${(card.balance || 0).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-400 hover:text-yellow-400 rounded-lg">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-400 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: '#333333' }}>
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">Total Credit Card Balance</p>
                    <p className="text-2xl font-bold text-red-400">${totalCreditCardBalance.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default CreditCardPayment;
