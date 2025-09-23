import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const SavingsAllocation = ({ savingsAccounts = [], onAdd }) => {
    const totalSavingsBalance = savingsAccounts.reduce((total, account) => total + account.balance, 0);

    return (
        <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Savings Allocation</h2>
                <button onClick={onAdd} className="flex items-center space-x-2 px-4 py-2 text-black font-medium rounded-lg" style={{ backgroundColor: '#fbbf24' }}>
                    <Plus className="w-4 h-4" />
                    <span>Add Savings Goal</span>
                </button>
            </div>
            <div className="space-y-4">
                {savingsAccounts.map((account) => (
                    <div key={account.id} className="p-4 rounded-lg" style={{ backgroundColor: '#0a0a0a' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-white">{account.name}</p>
                                <p className="text-sm text-gray-400">
                                    Goal: ${account.goal.toLocaleString()} | Contribution: ${account.contribution.toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <p className="text-lg font-bold text-blue-400">${account.balance.toLocaleString()}</p>
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
                        <div className="mt-2">
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${(account.balance / account.goal) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: '#333333' }}>
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">Total Savings Balance</p>
                    <p className="text-2xl font-bold text-blue-400">${totalSavingsBalance.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default SavingsAllocation;
