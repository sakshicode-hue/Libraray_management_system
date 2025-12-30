"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI, memberAPI } from '@/lib/api';

export default function AddMemberPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        membership_type: 'standard',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Step 1: Register User
            console.log('Registering user...');
            await authAPI.register({
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                role: 'member' // Default role for library members
            });

            // We need user_id to create member profile. 
            // Problem: authAPI.register might not log us in or return user_id in a way we can immediately use if we are admin.
            // Wait, `register_user` controller returns: { "message": "...", "user_id": "..." }
            // So we CAN get it from the response!

            // Let's modify authAPI.register to return the JSON response.
            // api.ts: `return handleResponse(response);` -> returns the JSON.
            // So yes, we get user_id.

            // Re-running register to capture ID
            // Actually, I can't re-run it. I need to assume the previous call returned it.
            // Let's fix the call above.

        } catch (err: any) {
            console.error('Registration failed:', err);
            setError(err.message || 'Failed to register user. Email might already exist.');
            setLoading(false);
            return;
        }

        try {
            // We need to re-login? No, we are Admin addding a member.
            // We just need to find the user_id.
            // Wait, if I call `authAPI.register`, it returns the object.
            // I need to capture it.
        } catch (err) {
            // ...
        }
    };

    // Rewrite handleSubmit to be correct
    const handleSubmitFixed = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Register User
            const registerRes = await authAPI.register({
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                role: 'member'
            });

            if (!registerRes.user_id) {
                throw new Error('Failed to get User ID from registration.');
            }

            // 2. Create Member Profile
            await memberAPI.createMember({
                user_id: registerRes.user_id,
                phone: formData.phone,
                address: formData.address,
                membership_type: formData.membership_type
            });

            console.log('Member created successfully');
            router.push('/members');

        } catch (err: any) {
            console.error('Error adding member:', err);
            setError(err.message || 'Failed to add member. Please check details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Add New Member
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Register a new library member and create their account.
                        </p>
                    </div>
                    <Link
                        href="/members"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    >
                        ← Back to Members
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmitFixed} className="space-y-8">
                            {/* Personal Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">1</span>
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Full Name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="full_name"
                                                id="full_name"
                                                required
                                                value={formData.full_name}
                                                onChange={handleChange}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Phone Number
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 transition-colors"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-6">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Address
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="address"
                                                name="address"
                                                rows={3}
                                                required
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 transition-colors"
                                                placeholder="123 Library St, City, Country"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-8"></div>

                            {/* Account Setup */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm">2</span>
                                    Account Setup
                                </h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email Address
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Initial Password
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 transition-colors"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-8"></div>

                            {/* Membership Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm">3</span>
                                    Membership Plan
                                </h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="membership_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Plan Type
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="membership_type"
                                                name="membership_type"
                                                value={formData.membership_type}
                                                onChange={handleChange}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 transition-colors"
                                            >
                                                <option value="standard">Standard (5 Books)</option>
                                                <option value="premium">Premium (10 Books)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-5">
                                <div className="flex justify-end">
                                    <Link
                                        href="/members"
                                        className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`
                      inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white 
                      bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all
                      ${loading ? 'opacity-75 cursor-not-allowed' : ''}
                    `}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating Member...
                                            </>
                                        ) : (
                                            'Create Member'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
