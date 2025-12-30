"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { memberAPI } from '@/lib/api';

export default function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        membership_type: 'standard',
        is_active: true,
    });

    // Fetch initial data
    useEffect(() => {
        const fetchMember = async () => {
            try {
                const data = await memberAPI.getMemberProfile(id);
                console.log("Fetched Member:", data);
                setFormData({
                    phone: data.phone || '',
                    address: data.address || '',
                    membership_type: data.membership_type || 'standard',
                    is_active: data.is_active,
                });
            } catch (err: any) {
                console.error('Error fetching member:', err);
                setError('Failed to load member profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchMember();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await memberAPI.updateMember(id, formData);
            router.push('/members');
        } catch (err: any) {
            console.error('Update failed:', err);
            setError('Failed to update member.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Edit Member
                        </h1>
                    </div>
                    <Link
                        href="/members"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        Cancel
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Phone Number
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5"
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
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5"
                                        />
                                    </div>
                                </div>

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
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5"
                                        >
                                            <option value="standard">Standard (5 Books)</option>
                                            <option value="premium">Premium (10 Books)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Account Status
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="is_active"
                                            name="is_active"
                                            value={formData.is_active ? 'true' : 'false'}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                            </div>

                            <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className={`
                      inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white 
                      bg-blue-600 hover:bg-blue-700
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all
                      ${saving ? 'opacity-75 cursor-not-allowed' : ''}
                    `}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
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
