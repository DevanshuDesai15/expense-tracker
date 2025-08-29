import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, X, Edit, Trash2, Star, Gift } from 'lucide-react';
import { CREDIT_CARD_TYPES, DEFAULT_EXPENSE_CATEGORIES } from '../data/defaultCategories';
import { useCreditCards } from '../hooks/useCreditCards';

const CreditCardManagement = () => {
    const { creditCards, addCreditCard, updateCreditCard, deleteCreditCard, loading } = useCreditCards();
    const [showCardModal, setShowCardModal] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        cardType: '',
        cashBackRates: {},
        rewardType: 'cash',
        isActive: true,
        customRates: {}
    });

    useEffect(() => {
        if (editingCard) {
            setFormData({
                name: editingCard.name,
                cardType: editingCard.cardType,
                cashBackRates: editingCard.cashBackRates || {},
                rewardType: editingCard.rewardType || 'cash',
                isActive: editingCard.isActive !== undefined ? editingCard.isActive : true,
                customRates: editingCard.customRates || {}
            });
        } else {
            setFormData({
                name: '',
                cardType: '',
                cashBackRates: {},
                rewardType: 'cash',
                isActive: true,
                customRates: {}
            });
        }
    }, [editingCard]);

    const handleCardTypeChange = (cardTypeId) => {
        const selectedCardType = CREDIT_CARD_TYPES.find(type => type.id === cardTypeId);
        if (selectedCardType) {
            setFormData(prev => ({
                ...prev,
                cardType: cardTypeId,
                name: prev.name || selectedCardType.name,
                cashBackRates: selectedCardType.cashBackRates,
                rewardType: selectedCardType.rewardType
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCard) {
                await updateCreditCard(editingCard.id, formData);
            } else {
                await addCreditCard(formData);
            }
            setShowCardModal(false);
            setEditingCard(null);
        } catch (error) {
            console.error('Error saving credit card:', error);
        }
    };

    const handleEdit = (card) => {
        setEditingCard(card);
        setShowCardModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this credit card?')) {
            try {
                await deleteCreditCard(id);
            } catch (error) {
                console.error('Error deleting credit card:', error);
            }
        }
    };

    const getCardTypeInfo = (cardTypeId) => {
        return CREDIT_CARD_TYPES.find(type => type.id === cardTypeId) || null;
    };

    const getCategoryName = (categoryId) => {
        const category = DEFAULT_EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const CardModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="rounded-lg max-w-2xl w-full p-6 border max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                            <CreditCard className="w-5 h-5 text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            {editingCard ? 'Edit' : 'Add'} <span className="text-yellow-400">Credit Card</span>
                        </h3>
                    </div>
                    <button
                        onClick={() => {
                            setShowCardModal(false);
                            setEditingCard(null);
                        }}
                        className="text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Card Type *
                            </label>
                            <select
                                name="cardType"
                                value={formData.cardType}
                                onChange={(e) => handleCardTypeChange(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg text-white"
                                style={{
                                    backgroundColor: '#0a0a0a',
                                    borderColor: '#555555'
                                }}
                            >
                                <option value="">Select card type</option>
                                {CREDIT_CARD_TYPES.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Custom Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg text-white placeholder-gray-400"
                                style={{
                                    backgroundColor: '#0a0a0a',
                                    borderColor: '#555555'
                                }}
                                placeholder="e.g., My Chase Sapphire"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Reward Type
                        </label>
                        <select
                            name="rewardType"
                            value={formData.rewardType}
                            onChange={(e) => setFormData(prev => ({ ...prev, rewardType: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-lg text-white"
                            style={{
                                backgroundColor: '#0a0a0a',
                                borderColor: '#555555'
                            }}
                        >
                            <option value="cash">Cash Back</option>
                            <option value="points">Points</option>
                            <option value="miles">Miles</option>
                        </select>
                    </div>

                    {/* Cash Back Rates */}
                    {formData.cardType && (
                        <div>
                            <h4 className="text-md font-semibold text-white mb-3">Cash Back Rates</h4>
                            <div className="space-y-3">
                                {Object.entries(formData.cashBackRates).map(([category, rate]) => (
                                    <div key={category} className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                                        <span className="text-gray-300">{getCategoryName(category)}</span>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                value={(rate * 100).toFixed(1)}
                                                onChange={(e) => {
                                                    const newRate = parseFloat(e.target.value) / 100;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        cashBackRates: {
                                                            ...prev.cashBackRates,
                                                            [category]: newRate
                                                        }
                                                    }));
                                                }}
                                                min="0"
                                                max="10"
                                                step="0.1"
                                                className="w-20 px-2 py-1 border rounded text-white text-sm"
                                                style={{
                                                    backgroundColor: '#0a0a0a',
                                                    borderColor: '#555555'
                                                }}
                                            />
                                            <span className="text-gray-400 text-sm">%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                            className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-300">
                            Active (show in expense forms)
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowCardModal(false);
                                setEditingCard(null);
                            }}
                            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
                            style={{ backgroundColor: '#0a0a0a' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors"
                            style={{ backgroundColor: '#1a1a1a' }}
                        >
                            {editingCard ? 'Update' : 'Add'} Card
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Credit <span className="text-yellow-400">Cards</span></h2>
                </div>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Credit <span className="text-yellow-400">Cards</span></h2>
                        <p className="text-gray-300 mt-1">Manage your credit cards and optimize cash back rewards</p>
                    </div>
                    <button
                        onClick={() => setShowCardModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors"
                        style={{ backgroundColor: '#1a1a1a' }}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Card</span>
                    </button>
                </div>

                {creditCards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {creditCards.map(card => {
                            const cardTypeInfo = getCardTypeInfo(card.cardType);
                            const maxCashBackRate = Math.max(...Object.values(card.cashBackRates || {}));

                            return (
                                <div key={card.id} className="p-4 rounded-lg border hover:opacity-80 transition-opacity"
                                    style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <CreditCard className="w-5 h-5 text-yellow-400" />
                                            <div>
                                                <h3 className="font-semibold text-white">
                                                    {card.name || (cardTypeInfo ? cardTypeInfo.name : 'Unknown Card')}
                                                </h3>
                                                <p className="text-sm text-gray-400">{card.rewardType === 'cash' ? 'Cash Back Card' : card.rewardType === 'points' ? 'Points Card' : 'Miles Card'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {!card.isActive && (
                                                <span className="px-2 py-1 text-xs rounded bg-gray-600 text-gray-300">Inactive</span>
                                            )}
                                            <button
                                                onClick={() => handleEdit(card)}
                                                className="p-2 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(card.id)}
                                                className="p-2 text-red-400 hover:bg-red-400 hover:text-black rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center space-x-2">
                                            <Star className="w-4 h-4 text-yellow-400" />
                                            <span className="text-sm text-gray-300">
                                                Up to {(maxCashBackRate * 100).toFixed(1)}% {card.rewardType}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Gift className="w-4 h-4 text-green-400" />
                                            <span className="text-sm text-gray-300">
                                                {card.rewardType === 'cash' ? 'Cash Back' :
                                                    card.rewardType === 'points' ? 'Points' : 'Miles'}
                                            </span>
                                        </div>
                                    </div>

                                    {card.cashBackRates && Object.keys(card.cashBackRates).length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-400 mb-2">Bonus Categories:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {Object.entries(card.cashBackRates).map(([category, rate]) => {
                                                    if (rate > 0.01) { // Only show rates higher than 1%
                                                        return (
                                                            <span
                                                                key={category}
                                                                className="px-2 py-1 text-xs rounded border"
                                                                style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24', color: '#fbbf24' }}
                                                            >
                                                                {getCategoryName(category)}: {(rate * 100).toFixed(1)}%
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 border rounded-lg" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400">No credit cards added</p>
                        <p className="text-sm text-gray-500 mt-1">Add your credit cards to optimize cash back rewards!</p>
                        <button
                            onClick={() => setShowCardModal(true)}
                            className="mt-4 px-4 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors"
                            style={{ backgroundColor: '#1a1a1a' }}
                        >
                            Add Your First Card
                        </button>
                    </div>
                )}
            </div>

            {showCardModal && <CardModal />}
        </>
    );
};

export default CreditCardManagement;
