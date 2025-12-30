"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { memberAPI } from '@/lib/api';

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const data = await memberAPI.getMemberProfile(id);
        setMember(data);
      } catch (err: any) {
        console.error('Error fetching member:', err);
        setError('Failed to load member profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error || !member) return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
      <p className="text-gray-600 mb-6">{error || 'Member not found'}</p>
      <Link href="/members" className="text-blue-600 hover:underline">← Back to Members</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/members" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Members
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 dark:text-white font-medium">{member.user_details?.full_name}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Member Profile</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/members/edit/${id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            ✏️ Edit Profile
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {member.user_details?.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {member.user_details?.full_name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {member.membership_id}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Contact Info</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400">Email</label>
                      <p className="font-medium text-gray-900 dark:text-gray-200">{member.user_details?.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Phone</label>
                      <p className="font-medium text-gray-900 dark:text-gray-200">{member.phone}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Address</label>
                      <p className="font-medium text-gray-900 dark:text-gray-200">{member.address}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Membership Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400">Plan</label>
                      <p className="font-medium text-purple-600 dark:text-purple-400 capitalize">{member.membership_type}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Detailed Status</label>
                      <p className="font-medium text-gray-900 dark:text-gray-200">{member.is_active ? 'Currently Active' : 'Suspended/Inactive'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Member Since</label>
                      <p className="font-medium text-gray-900 dark:text-gray-200">
                        {new Date(member.membership_start).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Library Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400">Max Books</span>
                <span className="font-bold text-gray-900 dark:text-white">{member.max_books_allowed}</span>
              </div>
              {/* Placeholders for now */}
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400">Currently Borrowed</span>
                <span className="font-bold text-blue-600">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400">Total Fines</span>
                <span className="font-bold text-green-600">₹0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
