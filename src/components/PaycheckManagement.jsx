import React from 'react';
import { DollarSign, Plus, Edit, Trash2 } from 'lucide-react';

const PaycheckManagement = ({ incomeEntries = [], onAdd }) => {
    const totalPaycheckAmount = incomeEntries.reduce((total, paycheck) => total + paycheck.amount, 0);

    return (
        <div className="rounded-xl shadow-lg border p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Paycheck Management</h2>
                <button onClick={onAdd} className="flex items-center space-x-2 px-4 py-2 text-black font-medium rounded-lg" style={{ backgroundColor: '#fbbf24' }}>
                    <Plus className="w-4 h-4" />
                    <span>Add Paycheck</span>
                </button>
            </div>
            <div className="space-y-4">
                {incomeEntries.map((paycheck) => (
                    <div key={paycheck.id} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#0a0a0a' }}>
                        <div>
                            <p className="font-semibold text-white">{paycheck.source}</p>
                            <p className="text-sm text-gray-400">{paycheck.date}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <p className="text-lg font-bold text-green-400">${paycheck.amount.toLocaleString()}</p>
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
                    <p className="text-lg font-semibold text-white">Total Paycheck Amount</p>
                    <p className="text-2xl font-bold text-green-400">${totalPaycheckAmount.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default PaycheckManagement;
