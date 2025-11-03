import React, { useState } from 'react';
import { X, Mail, Lock, User, Chrome } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { env } from '../config/env';

const AuthModal = ({ isOpen, onClose }) => {
    // Check if single-user mode is enabled
    const singleUserMode = !!env.app.authorizedEmail;
    const [isLogin, setIsLogin] = useState(true);
    const [showDevSignup, setShowDevSignup] = useState(false); // Hidden signup for testing
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, signInWithGoogle, error } = useAuthContext();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // In single-user mode, validate email
            if (singleUserMode && isLogin) {
                if (formData.email.toLowerCase() !== env.app.authorizedEmail.toLowerCase()) {
                    throw new Error('Unauthorized email address. This is a single-user system.');
                }
            }

            if (isLogin) {
                await signIn(formData.email, formData.password);
            } else {
                // Signup only allowed in dev mode or if not single-user
                if (singleUserMode && !showDevSignup) {
                    throw new Error('Sign up is disabled in single-user mode');
                }
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                await signUp(formData.email, formData.password, formData.displayName);
            }
            onClose();
        } catch (error) {
            console.error('Authentication error:', error);
            // Show error to user (error is already set in useAuth hook)
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            onClose();
        } catch (error) {
            console.error('Google sign-in error:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            displayName: '',
            confirmPassword: ''
        });
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleInputChange}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your full name"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                    required
                                    minLength="6"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Confirm your password"
                                        required={!isLogin}
                                        minLength="6"
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="mt-4 w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Chrome className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">Google</span>
                        </button>
                    </div>

                    {/* Hide signup toggle in single-user mode */}
                    {!singleUserMode && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={toggleMode}
                                    className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Single-user mode indicator */}
                    {singleUserMode && (
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                Single-user mode enabled
                            </p>
                            {/* Hidden dev signup access - press Ctrl+Shift+D */}
                            <button
                                onClick={(e) => {
                                    if (e.ctrlKey && e.shiftKey) {
                                        setShowDevSignup(!showDevSignup);
                                        setIsLogin(false);
                                    }
                                }}
                                className="text-xs text-gray-400 mt-2 hidden"
                            >
                                Dev Mode
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
