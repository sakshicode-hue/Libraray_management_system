"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/app/dashboard/StatCard';
import ActivityTimeline from '@/app/dashboard/ActivityTimeline';
import OverdueBooksTable from '@/app/dashboard/OverdueBooksTable';
import PopularBooksCarousel from '@/app/dashboard/PopularBooksCarousel';
import QuickActions from '@/app/dashboard/QuickAction';
import SystemHealth from '@/app/dashboard/SystemHealth';
import { bookAPI, transactionAPI, memberAPI, reportAPI, systemAPI } from '@/lib/api';

const quickActions = [
  { id: 1, title: "Borrow Book", icon: "📖", path: "/borrow", color: "bg-blue-500" },
  { id: 2, title: "Return Book", icon: "↩️", path: "/returns", color: "bg-green-500" },
  { id: 3, title: "Add New Book", icon: "➕", path: "/books/add", color: "bg-purple-500" },
  { id: 4, title: "Manage Members", icon: "👥", path: "/members", color: "bg-yellow-500" },
  { id: 5, title: "E-Books", icon: "📱", path: "/ebooks", color: "bg-indigo-500" },
  { id: 6, title: "Settings", icon: "⚙️", path: "/settings", color: "bg-gray-500" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<any[]>([]);
  const [popularBooks, setPopularBooks] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user info
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Execute all independent fetch requests in parallel
      const [
        booksData,
        membersData,
        historyData,
        overdueData,
        popularBooksRes,
        healthData
      ] = await Promise.all([
        bookAPI.getBooks({ page_size: 1 }),
        memberAPI.getMembers(1, 1),
        transactionAPI.getHistory(undefined, 1, 5), // Get 5 most recent transactions
        transactionAPI.getOverdue(),
        reportAPI.getPopularBooks(5),
        systemAPI.healthCheck()
      ]);

      // 1. Process Stats
      // Calculate active borrows (count of transactions without return date)
      // Note: getHistory only returns paged results, so for accurate "Total Active Borrows" 
      // we might need a dedicated endpoint or stats object if the dataset is huge.
      // For now, let's use the 'active' count from 'overdueData' if available, or just omit if unsure.
      // Actually, 'overdueData' often contains general stats in some APIs. 
      // Let's stick to what we know: Total Books, Total Members. 

      // Let's try to get a more accurate borrow count if possible, 
      // or just use "Overdue" as a key metric.

      const statsData = [
        {
          id: 1,
          title: "Total Books",
          value: booksData.total?.toLocaleString() || "0",
          icon: "📚",
          color: "blue"
        },
        {
          id: 2,
          title: "Members",
          value: membersData.total?.toLocaleString() || "0",
          icon: "👥",
          color: "green"
        },
        // We use Overdue Count from the dedicated endpoint
        {
          id: 3,
          title: "Overdue Books",
          value: overdueData.overdue_books_count?.toString() || "0",
          icon: "⏰",
          color: "red"
        },
        // Using System Health db status as a "stat" or just showing E-books count if we had it.
        // Let's show "Healthy" for system status here for quick visibility
        {
          id: 4,
          title: "System Status",
          value: healthData.status === 'healthy' ? "Online" : "Issues",
          icon: "🖥️",
          color: healthData.status === 'healthy' ? "emerald" : "orange"
        }
      ];
      setStats(statsData);

      // 2. Process Recent Activity
      const activities = (historyData.transactions || []).map((t: any) => ({
        id: t.transaction_id,
        user: t.member_name || 'Unknown User',
        action: t.return_date ? 'returned' : 'borrowed',
        book: t.book_title || 'Unknown Book',
        time: new Date(t.issue_date).toLocaleDateString(), // Simplification
        type: t.return_date ? 'return' : 'borrow'
      }));
      setRecentActivities(activities);

      // 3. Process Overdue Books
      const overdueList = (overdueData.overdue_books || []).slice(0, 5).map((b: any) => ({
        id: b.transaction_id,
        title: b.book_title,
        member: b.member_name,
        dueDate: new Date(b.due_date).toLocaleDateString(),
        daysOverdue: b.days_overdue,
        fine: `₹${b.fine_amount || 0}`
      }));
      setOverdueBooks(overdueList);

      // 4. Process Popular Books
      const booksArray = popularBooksRes?.data?.books || [];
      const popList = booksArray.map((b: any) => ({
        id: b.book_id || b._id,
        title: b.title,
        author: b.author,
        borrows: b.borrow_count,
        coverColor: "bg-blue-100", // Fallback
        textColor: "text-blue-600"
      }));
      setPopularBooks(popList);

      // 5. System Health
      setSystemHealth(healthData);

    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl font-semibold animate-pulse text-blue-600">
          Loading Library Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-bold">Library Dashboard</h1>
          <p className="mt-2 opacity-90 text-lg">
            Welcome back, {user?.full_name || 'Admin'}! Here is your library's overview.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm opacity-75 uppercase tracking-wider font-semibold">Current Date</p>
          <p className="text-2xl font-mono">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map(action => (
                <QuickActions key={action.id} {...action} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
            </div>
            {recentActivities.length > 0 ? (
              <ActivityTimeline activities={recentActivities} />
            ) : (
              <div className="text-center py-8 text-gray-400">No recent activity found.</div>
            )}
          </div>

          {/* Overdue Books Table */}
          {overdueBooks.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 border-l-4 border-red-500">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Overdue Books</h2>
                  <p className="text-sm text-gray-500">Items that require attention</p>
                </div>
              </div>
              <OverdueBooksTable books={overdueBooks} />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Popular Books Carousel */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">🔥 Most Popular</h3>
            {popularBooks.length > 0 ? (
              <PopularBooksCarousel books={popularBooks} />
            ) : (
              <p className="opacity-75 italic text-sm">No data available yet.</p>
            )}
          </div>

          {/* System Health */}
          <SystemHealth health={systemHealth} />

          {/* Guidelines / Tip Widget */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm uppercase mb-1">Did you know?</h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                  You can seed the database with e-books using the <code>add_ebooks.py</code> script provided in the project root.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}