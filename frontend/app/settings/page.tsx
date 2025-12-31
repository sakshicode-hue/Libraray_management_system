"use client";

import { useState, useEffect } from 'react';
import { systemAPI } from '@/lib/api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Settings State (Key-Value map)
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Staff State
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [newStaff, setNewStaff] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'librarian'
  });

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsData, staffData] = await Promise.all([
        systemAPI.getSettings(),
        systemAPI.getStaff()
      ]);

      // Transform settings list to object map
      const settingsMap: Record<string, string> = {};
      const returnedSettings = settingsData.settings || [];
      returnedSettings.forEach((s: any) => {
        settingsMap[s.key] = s.value;
      });

      // Set defaults for missing keys
      const defaults = {
        'library_name': 'Central Public Library',
        'library_email': 'contact@library.com',
        'library_phone': '+1 234 567 8900',
        'loan_period_days': '14',
        'max_books_per_member': '5',
        'fine_per_day': '1.0',
        'currency': '$',
        'allow_renewals': 'true'
      };

      setSettings({ ...defaults, ...settingsMap });
      setStaffMembers(staffData.staff || []);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setMessage({ type: 'error', text: 'Failed to load settings. Ensure you are an Admin.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Update each setting one by one (or batch if API supported it, here we loop)
      const updates = Object.entries(settings).map(([key, value]) =>
        systemAPI.updateSettings(key, value)
      );

      await Promise.all(updates);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newStaff.email || !newStaff.password || !newStaff.full_name) {
        setMessage({ type: 'error', text: 'Please fill in all staff fields' });
        return;
      }

      await systemAPI.addStaff(newStaff);

      // Refresh staff list
      const staffData = await systemAPI.getStaff();
      setStaffMembers(staffData.staff || []);

      // Reset form
      setNewStaff({
        email: '',
        full_name: '',
        password: '',
        role: 'librarian'
      });

      setMessage({ type: 'success', text: 'Staff member added successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to add staff member' });
    }
  };

  // Tabs Configuration
  const tabs = [
    { id: 'general', label: '⚙️ General' },
    { id: 'borrowing', label: '📚 Borrowing' },
    { id: 'fines', label: '💰 Fines' },
    { id: 'staff', label: '👥 Staff' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            System Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage library configuration and staff access.
          </p>
        </div>
        {activeTab !== 'staff' && (
          <button
            onClick={saveSettings}
            disabled={saving}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg ${saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl hover:scale-105'
              }`}
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        )}
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
          }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-md border border-blue-100 dark:border-blue-900'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Library Information</h2>

            <div>
              <label className="block text-sm font-semibold mb-2">Library Name</label>
              <input
                type="text"
                value={settings.library_name || ''}
                onChange={(e) => handleSettingChange('library_name', e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  value={settings.library_email || ''}
                  onChange={(e) => handleSettingChange('library_email', e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number</label>
                <input
                  type="text"
                  value={settings.library_phone || ''}
                  onChange={(e) => handleSettingChange('library_phone', e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency || '$'}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                className="w-24 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Borrowing Settings */}
        {activeTab === 'borrowing' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Borrowing Rules</h2>

            <div>
              <label className="block text-sm font-semibold mb-2">Default Loan Period (Days)</label>
              <input
                type="number"
                value={settings.loan_period_days || ''}
                onChange={(e) => handleSettingChange('loan_period_days', e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Max Books Per Member</label>
              <input
                type="number"
                value={settings.max_books_per_member || ''}
                onChange={(e) => handleSettingChange('max_books_per_member', e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                checked={settings.allow_renewals === 'true'}
                onChange={(e) => handleSettingChange('allow_renewals', String(e.target.checked))}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">Allow Book Renewals</span>
            </div>
          </div>
        )}

        {/* Fines Settings */}
        {activeTab === 'fines' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Fine Configuration</h2>

            <div>
              <label className="block text-sm font-semibold mb-2">Late Fee Per Day ({settings.currency})</label>
              <input
                type="number"
                step="0.1"
                value={settings.fine_per_day || ''}
                onChange={(e) => handleSettingChange('fine_per_day', e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <p className="text-sm text-gray-500 mt-2">
                Amount charged for each day a book is overdue.
              </p>
            </div>
          </div>
        )}

        {/* Staff Management */}
        {activeTab === 'staff' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Staff List */}
              <div>
                <h2 className="text-xl font-bold mb-6">Staff Members</h2>
                <div className="space-y-4">
                  {staffMembers.map((staff) => (
                    <div key={staff.email} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div>
                        <div className="font-bold">{staff.full_name}</div>
                        <div className="text-sm text-gray-500">{staff.email}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${staff.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}>
                        {staff.role.toUpperCase()}
                      </span>
                    </div>
                  ))}
                  {staffMembers.length === 0 && (
                    <div className="text-gray-500 italic">No staff members found.</div>
                  )}
                </div>
              </div>

              {/* Add Staff Form */}
              <div>
                <h2 className="text-xl font-bold mb-6">Add New Staff</h2>
                <form onSubmit={handleAddStaff} className="space-y-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={newStaff.full_name}
                      onChange={(e) => setNewStaff({ ...newStaff, full_name: e.target.value })}
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                      placeholder="Ex: John Librarian"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                      placeholder="staff@library.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <input
                      type="password"
                      value={newStaff.password}
                      onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Role</label>
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <option value="librarian">Librarian</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                  >
                    + Add Staff Member
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}