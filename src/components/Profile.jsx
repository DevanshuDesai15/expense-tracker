import React, { useState } from 'react';
import {
    User,
    Settings,
    Tag,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    DollarSign,
    AlertCircle,
    CheckCircle,
    CreditCard
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useAuthContext } from '../contexts/AuthContext';
import CreditCardManagement from './CreditCardManagement';

const Profile = () => {
    const { user } = useAuthContext();
    const {
        allCategories,
        userCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        loading,
        error,
        connectionError,
        forceInitializeCategories,
        hasUserCategories,
        cleanupDuplicateCategories,
        isInitializing,
        isUsingFallback
    } = useCategories();

    // In Profile page, only show actual Firebase categories (not fallback defaults)
    // Filter to only include categories with docId (from Firebase)
    const manageableCategories = userCategories
        .filter(cat => cat.docId) // Only categories with Firebase document ID
        .map(cat => ({
            id: cat.categoryId || cat.id,
            name: cat.name,
            budgetAmount: cat.budgetAmount || 0,
            isCustom: !cat.isDefault,
            docId: cat.docId // Include document ID for editing/deleting
        }));

    console.log('Profile - userCategories:', userCategories);
    console.log('Profile - manageableCategories:', manageableCategories);

    const [activeTab, setActiveTab] = useState('categories');
    const [editingCategory, setEditingCategory] = useState(null);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', budgetAmount: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleUpdateCategory = async (categoryDocId, categoryData) => {
        try {
            await updateCategory(categoryDocId, categoryData);
            setEditingCategory(null);
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Failed to update category. Please try again.');
        }
    };

    const handleDeleteCategory = async (category) => {
        try {
            console.log('Attempting to delete category:', category);
            console.log('Manageable categories:', manageableCategories);

            // Prevent deleting the last category
            if (manageableCategories.length <= 1) {
                alert('Cannot delete the last category. You must have at least one category to track expenses.');
                setDeleteConfirm(null);
                return;
            }

            // All categories now have docId since they're all stored in Firebase
            if (category.docId) {
                await deleteCategory(category.docId);
                console.log(`Successfully deleted category: ${category.name}`);
            } else {
                console.error('No document ID found for category:', category);
                console.error('Available manageable categories:', manageableCategories);
                alert('Unable to delete category: Missing document ID.');
                return;
            }
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category. Please try again.');
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.name.trim()) return;

        try {
            await addCategory({
                name: newCategory.name.trim(),
                budgetAmount: parseFloat(newCategory.budgetAmount) || 0
            });
            setNewCategory({ name: '', budgetAmount: '' });
            setShowAddCategory(false);
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category. Please try again.');
        }
    };

    // Check for duplicate categories
    const duplicateCategories = React.useMemo(() => {
        const categoryNames = manageableCategories.map(cat => cat.name);
        const duplicates = categoryNames.filter((name, index) => categoryNames.indexOf(name) !== index);
        return [...new Set(duplicates)]; // Remove duplicates from duplicates list
    }, [manageableCategories]);

    const CategoryRow = ({ category, isEditing, onEdit, onSave, onCancel, onDelete, totalCategories }) => {
        const [editData, setEditData] = useState({
            name: category.name,
            budgetAmount: category.budgetAmount
        });

        if (isEditing) {
            return (
                <tr className="border-b transition-colors" style={{ borderColor: '#333333', backgroundColor: '#2a2a2a' }}>
                    <td className="px-6 py-4">
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-lg transition-all text-white placeholder-gray-400 focus:ring-2"
                            style={{
                                backgroundColor: '#0a0a0a',
                                borderColor: '#555555',
                                focusRingColor: '#fbbf24'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#fbbf24';
                                e.target.style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#555555';
                                e.target.style.boxShadow = 'none';
                            }}
                            placeholder="Category name"
                        />
                    </td>
                    <td className="px-6 py-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 font-medium">$</span>
                            <input
                                type="number"
                                value={editData.budgetAmount}
                                onChange={(e) => setEditData(prev => ({ ...prev, budgetAmount: e.target.value }))}
                                min="0"
                                step="0.01"
                                className="w-full pl-8 pr-3 py-2 border rounded-lg transition-all text-white placeholder-gray-400 focus:ring-2"
                                style={{
                                    backgroundColor: '#0a0a0a',
                                    borderColor: '#555555'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#fbbf24';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#555555';
                                    e.target.style.boxShadow = 'none';
                                }}
                                placeholder="0.00"
                            />
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${category.isCustom
                            ? 'text-purple-300'
                            : 'text-gray-300'
                            }`}
                            style={{
                                backgroundColor: category.isCustom ? '#581c87' : '#333333',
                                borderColor: category.isCustom ? '#7c3aed' : '#555555'
                            }}>
                            {category.isCustom ? 'Custom' : 'Default'}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => onSave(category.docId, {
                                    name: editData.name,
                                    budgetAmount: parseFloat(editData.budgetAmount) || 0
                                })}
                                className="p-2 text-green-400 hover:bg-green-400 hover:text-black rounded-lg transition-all"
                                title="Save changes"
                            >
                                <Save className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onCancel}
                                className="p-2 text-gray-400 hover:bg-gray-600 rounded-lg transition-colors"
                                title="Cancel editing"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }

        return (
            <tr className="border-b transition-colors" style={{ borderColor: '#333333', backgroundColor: '#1a1a1a' }} onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#2a2a2a'} onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = '#1a1a1a'}>
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                            <Tag className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="font-medium text-white">{category.name}</span>
                    </div>
                </td>
                <td className="px-6 py-4 text-gray-300 font-medium">
                    ${category.budgetAmount?.toLocaleString() || '0'}
                </td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${category.isCustom
                        ? 'text-purple-300'
                        : 'text-gray-300'
                        }`}
                        style={{
                            backgroundColor: category.isCustom ? '#581c87' : '#333333',
                            borderColor: category.isCustom ? '#7c3aed' : '#555555'
                        }}>
                        {category.isCustom ? 'Custom' : 'Default'}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onEdit(category)}
                            className="p-2 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-lg transition-all"
                            title="Edit category"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(category)}
                            disabled={totalCategories <= 1}
                            className={`p-2 rounded-lg transition-all ${totalCategories <= 1
                                ? 'text-gray-500 cursor-not-allowed'
                                : 'text-red-400 hover:bg-red-400 hover:text-black'
                                }`}
                            title={
                                totalCategories <= 1
                                    ? "Cannot delete the last category"
                                    : category.isCustom
                                        ? "Delete category"
                                        : "Delete default category"
                            }
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    const tabs = [
        { id: 'categories', label: 'Categories', icon: Tag },
        { id: 'credit-cards', label: 'Credit Cards', icon: CreditCard },
        { id: 'account', label: 'Account', icon: User },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white"><span className="text-yellow-400">Pennyworth's</span> Settings</h1>
                <p className="text-gray-300 mt-1">Configure your financial management preferences with butler-level precision</p>
            </div>

            {/* Tabs */}
            <div className="rounded-xl shadow-lg border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                <div className="border-b" style={{ borderColor: '#333333' }}>
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                                    ? 'border-blue-400 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'categories' && (
                        <div className="space-y-6">
                            {/* Category Management Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Expense <span className="text-yellow-400">Categories</span></h2>
                                    <p className="text-gray-300 mt-1">
                                        Manage your expense categories and monthly budgets
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAddCategory(true)}
                                    disabled={connectionError || error}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${connectionError || error
                                        ? 'bg-gray-400 text-gray-300 cursor-not-allowed border-gray-400'
                                        : 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
                                        }`}
                                    style={!(connectionError || error) ? { backgroundColor: '#1a1a1a' } : {}}
                                    title={connectionError || error ? 'Cannot add categories while offline' : 'Add Category'}
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Category</span>
                                </button>
                            </div>

                            {/* Firebase Connection Error */}
                            {(connectionError || error) && (
                                <div className="bg-red-900 border border-red-700 rounded-lg p-6 mb-6">
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-red-200 mb-2">
                                                Firebase Connection Issue
                                            </h3>
                                            <p className="text-red-700 mb-3">
                                                Unable to connect to Firebase database.
                                                {error && ` Error: ${error}`}
                                            </p>
                                            <div className="space-y-2">
                                                <p className="text-sm text-red-300">
                                                    <strong>Current status:</strong> Using default categories as fallback (read-only)
                                                </p>
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => window.location.reload()}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Reload Page
                                                    </button>
                                                    <button
                                                        onClick={forceInitializeCategories}
                                                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                                    >
                                                        Retry Connection
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Using Fallback Categories */}
                            {isUsingFallback && !connectionError && (
                                <div className="bg-amber-900 border border-amber-700 rounded-lg p-6 mb-6">
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="w-5 h-5 text-amber-300 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-lg font-medium text-amber-200 mb-2">
                                                Using Fallback Categories
                                            </h3>
                                            <p className="text-amber-700 mb-3">
                                                Showing default categories while we set up your personal category system.
                                                You can use these for now, but changes won't be saved until the connection is restored.
                                            </p>
                                            <button
                                                onClick={forceInitializeCategories}
                                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                            >
                                                Retry Setup
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Migration Help Message */}
                            {!loading && !isInitializing && !connectionError && !error && manageableCategories.length === 0 && (
                                <div className="bg-amber-900 border border-amber-700 rounded-lg p-6 mb-6">
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="w-5 h-5 text-amber-300 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-lg font-medium text-amber-200 mb-2">Setting up your categories</h3>
                                            <p className="text-amber-700 mb-4">
                                                We're setting up your personal category system. This includes all the default categories
                                                you can customize, plus the ability to add your own.
                                            </p>
                                            <button
                                                onClick={forceInitializeCategories}
                                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                            >
                                                Initialize Categories Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Duplicate Categories Warning */}
                            {duplicateCategories.length > 0 && (
                                <div className="bg-red-900 border border-red-700 rounded-lg p-6 mb-6">
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-red-200 mb-2">
                                                Duplicate Categories Detected
                                            </h3>
                                            <p className="text-red-700 mb-3">
                                                We found {duplicateCategories.length} duplicate categories: {duplicateCategories.join(', ')}.
                                                This can happen during account setup. Click below to automatically remove duplicates.
                                            </p>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await cleanupDuplicateCategories();
                                                        alert('Duplicate categories have been cleaned up successfully!');
                                                    } catch (error) {
                                                        alert('Failed to clean up duplicates. Please try again.');
                                                    }
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                Fix Duplicate Categories
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Categories Table */}
                            <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                                <table className="min-w-full divide-y" style={{ color: '#f3f4f6' }}>
                                    <thead style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                                                Category Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                                                Monthly Budget
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                                        {(loading || isInitializing) ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-gray-300">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                                                    {isInitializing ? 'Setting up your categories...' : 'Loading categories...'}
                                                </td>
                                            </tr>
                                        ) : (connectionError || error) && isUsingFallback ? (
                                            // Show fallback categories when Firebase is down
                                            allCategories.map((category) => (
                                                <tr key={category.id} className="border-b hover:opacity-80" style={{ borderColor: '#333333', backgroundColor: '#1a1a1a' }}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}>
                                                                <Tag className="w-4 h-4 text-gray-400" />
                                                            </div>
                                                            <span className="font-medium text-white">{category.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-300 font-medium">
                                                        ${category.budgetAmount?.toLocaleString() || '0'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: '#333333', borderColor: '#555555', color: '#d1d5db' }}>
                                                            Fallback
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm text-gray-400">Read-only</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : manageableCategories.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                    <div className="text-center">
                                                        <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                        <p className="mb-4">No categories found.</p>
                                                        <button
                                                            onClick={forceInitializeCategories}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3"
                                                        >
                                                            Setup Default Categories
                                                        </button>
                                                        <button
                                                            onClick={() => setShowAddCategory(true)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            Add First Category
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            manageableCategories.map((category) => (
                                                <CategoryRow
                                                    key={category.id}
                                                    category={category}
                                                    isEditing={editingCategory?.id === category.id}
                                                    onEdit={(cat) => setEditingCategory(cat)}
                                                    onSave={handleUpdateCategory}
                                                    onCancel={() => setEditingCategory(null)}
                                                    onDelete={(cat) => setDeleteConfirm(cat)}
                                                    totalCategories={manageableCategories.length}
                                                />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Butler's Advisory Panel */}
                            <div className="border rounded-lg p-6" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                                <div className="flex items-start space-x-4">
                                    <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-semibold mb-3 text-base">
                                            <span className="text-yellow-400">Pennyworth's</span> Category Management Guidelines
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                                            <div className="flex items-start space-x-2">
                                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Edit any category with butler-level precision</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Budget tracking for Wayne-level financial oversight</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Minimum one category required for operations</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Changes synchronized across all records</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-3 border-t" style={{ borderColor: '#333333' }}>
                                            <p className="text-xs text-gray-400 italic">
                                                "Organization and attention to detail are the hallmarks of proper financial management." - Alfred Pennyworth
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'credit-cards' && (
                        <div className="space-y-6">
                            <CreditCardManagement />
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Master Wayne's <span className="text-yellow-400">Account</span></h2>
                                <p className="text-gray-300 mt-1">Your personal details under Pennyworth's watchful care</p>
                            </div>

                            <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="p-3 rounded-full border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                                        <User className="w-8 h-8 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white">
                                            {user?.displayName || 'User'}
                                        </h3>
                                        <p className="text-sm text-gray-300">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.displayName || ''}
                                            disabled
                                            className="w-full px-3 py-2 border rounded-lg text-gray-400 cursor-not-allowed"
                                            style={{
                                                backgroundColor: '#0a0a0a',
                                                borderColor: '#555555'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="w-full px-3 py-2 border rounded-lg text-gray-400 cursor-not-allowed"
                                            style={{
                                                backgroundColor: '#0a0a0a',
                                                borderColor: '#555555'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t" style={{ borderColor: '#333333' }}>
                                    <p className="text-sm text-gray-300">
                                        Account settings are managed through your authentication provider.
                                        Contact support if you need to make changes to your account information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Category Modal */}
            {showAddCategory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="rounded-xl shadow-xl max-w-md w-full border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}>
                        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#333333' }}>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg border" style={{ backgroundColor: '#0a0a0a', borderColor: '#fbbf24' }}>
                                    <Tag className="w-5 h-5 text-yellow-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Add New <span className="text-yellow-400">Category</span></h3>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddCategory(false);
                                    setNewCategory({ name: '', budgetAmount: '' });
                                }}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-lg transition-all text-white placeholder-gray-400 focus:ring-2"
                                    style={{
                                        backgroundColor: '#0a0a0a',
                                        borderColor: '#555555'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#fbbf24';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.2)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#555555';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    placeholder="e.g., Pet Supplies, Home Improvement"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Monthly Budget Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 font-medium">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        value={newCategory.budgetAmount}
                                        onChange={(e) => setNewCategory(prev => ({ ...prev, budgetAmount: e.target.value }))}
                                        min="0"
                                        step="0.01"
                                        className="w-full pl-8 pr-3 py-2 border rounded-lg transition-all text-white placeholder-gray-400 focus:ring-2"
                                        style={{
                                            backgroundColor: '#0a0a0a',
                                            borderColor: '#555555'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#fbbf24';
                                            e.target.style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.2)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#555555';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                        placeholder="0.00"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Optional: Set a monthly budget for this category
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowAddCategory(false);
                                        setNewCategory({ name: '', budgetAmount: '' });
                                    }}
                                    className="px-4 py-2 text-gray-300 border border-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                                    style={{ backgroundColor: '#0a0a0a' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddCategory}
                                    className="px-4 py-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-lg transition-all"
                                    style={{ backgroundColor: '#1a1a1a' }}
                                >
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to delete the category "{deleteConfirm.name}"?
                                This action cannot be undone.
                            </p>

                            {/* Different warnings for default vs custom categories */}
                            {deleteConfirm.isCustom ? (
                                <p className="text-sm text-amber-300 bg-amber-900 p-3 rounded-lg">
                                    <strong>Note:</strong> Existing expenses in this category will still be visible,
                                    but you won't be able to create new expenses in this category.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm text-red-300 bg-red-900 p-3 rounded-lg">
                                        <strong>⚠️ Warning:</strong> You're deleting a default category that came with the system.
                                        This may affect your budget tracking and analytics.
                                    </p>
                                    <p className="text-sm text-amber-300 bg-amber-900 p-3 rounded-lg">
                                        <strong>Impact:</strong> Existing expenses in this category will still be visible,
                                        but you won't be able to create new expenses in this category. You can always recreate
                                        it later as a custom category.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 p-6 pt-0">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-300 border border-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                                style={{ backgroundColor: '#0a0a0a' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteCategory(deleteConfirm)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                {deleteConfirm.isCustom ? 'Delete Category' : 'Delete Default Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
