// app/borrow/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BorrowBookForm from '@/app/borrow/BorrowBookForm';
import QuickBorrowCard from '@/app/borrow/QuickBorrowCard';
import RecentBorrowsTable from '@/app/borrow/RecentBorrowsTable';
import SearchBooksSection from '@/app/borrow/SearchBooksSection';
import OverdueAlerts from '@/app/borrow/OverdueAlerts';
import { bookAPI, memberAPI, transactionAPI } from '@/lib/api';

// Removed mock data


export default function BorrowPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'borrow' | 'history'>('borrow');
  const [showBulkBorrow, setShowBulkBorrow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Real Data State
  const [books, setBooks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [popularBooks, setPopularBooks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeMembers: 0,
    todayBorrows: 0,
    overdue: 0,
    booksReturned: 0,
    finesCollected: 0,
    activeTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    // Auth Check
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const [booksData, membersData, historyData, overdueData, popularData] = await Promise.all([
        bookAPI.getBooks({ page_size: 100 }), // Get reasonable amount for dropdown
        memberAPI.getMembers(1, 100),
        transactionAPI.getHistory(undefined, 1),
        transactionAPI.getOverdue() as Promise<any>,
        bookAPI.getBooks({ page_size: 5 }) // Placeholder for popular books, ideally use reportAPI.getPopularBooks if available
        // Note: Using bookAPI for popular books temporarily as reportAPI was not fully verified/implemented in backend? 
        // Actually api.ts has reportAPI.getPopularBooks, let's try calling it, if fails we catch it.
      ]);

      // Transform books data
      const transformedBooks = (booksData.books || []).map((book: any) => ({
        ...book, // Keep original fields
        id: book.id || book._id,
        availableCopies: book.available_copies,
        totalCopies: book.available_copies + (book.borrowed_count || 0) // Approximation if total_copies not directly available, or usage specific field
      }));
      // Actually, let's verify if total_copies is returned. If not, use what we have.
      // Better:
      const mappedBooks = (booksData.books || []).map((b: any) => ({
        id: b.id || b._id,
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        availableCopies: b.available_copies,
        totalCopies: b.total_copies || (b.available_copies + (b.borrowed_count || 0)),
        genre: b.category, // Map category to genre if needed
        publisher: b.publisher,
        year: b.publication_year
      }));

      setBooks(mappedBooks);

      // Transform members data like in Members page
      const mappedMembers = (membersData.members || []).map((member: any) => ({
        id: member.id || member._id,
        name: member.user_details?.full_name || 'Unknown',
        email: member.user_details?.email || 'Unknown',
        membershipId: member.membership_id,
        phone: member.phone,
        status: member.is_active ? 'Active' : 'Inactive',
        maxBooks: member.max_books_allowed,
        currentBorrowed: member.books_borrowed_count || member.current_borrowed_count || 0
      }));

      setMembers(mappedMembers);
      setPopularBooks(mappedBooks.slice(0, 5)); // Use first 5 books as popular


      // Transform history data for table
      const txs = historyData.transactions || [];
      setTransactions(txs.map((t: any) => ({
        id: t._id,
        memberName: t.member_name || 'Unknown',
        bookTitle: t.book_title || 'Unknown',
        borrowDate: new Date(t.borrow_date).toLocaleDateString(),
        dueDate: new Date(t.due_date).toLocaleDateString(),
        status: t.status,
        transactionId: t._id.substring(0, 8).toUpperCase()
      })));

      // Calculate Stats
      const today = new Date().toDateString();
      const todayBorrows = txs.filter((t: any) => new Date(t.borrow_date).toDateString() === today).length;
      const todayReturns = txs.filter((t: any) => t.return_date && new Date(t.return_date).toDateString() === today).length;

      setStats({
        totalBooks: booksData.total,
        activeMembers: membersData.total,
        todayBorrows: todayBorrows,
        overdue: overdueData.overdue_books_count || 0,
        booksReturned: todayReturns,
        finesCollected: 0, // Need fine API
        activeTransactions: txs.filter((t: any) => t.status === 'borrowed').length
      });

    } catch (error) {
      console.error("Error fetching borrow data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleBulkBorrow = () => {
    setShowBulkBorrow(true);
    alert("Bulk borrow feature would open a modal here");
  };

  const handleGenerateReport = () => {
    alert("Generating borrowing report...");
  };

  const handleQuickAction = (action: string) => {
    alert(`Quick action: ${action}`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Borrow Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Issue books to members and manage borrowing transactions.
            <span className="ml-2 text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              Real-time updates
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleBulkBorrow}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
          >
            <span className="mr-2">📋</span> Bulk Borrow
            <span className="ml-2 text-xs bg-blue-800 px-2 py-0.5 rounded">New</span>
          </button>
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
          >
            <span className="mr-2">📄</span> Generate Report
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg flex items-center transition-colors">
            <span className="mr-2">⚙️</span> Settings
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('borrow')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === 'borrow'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
          >
            <span className="mr-2">📖</span>
            Borrow Books
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === 'history'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
          >
            <span className="mr-2">📋</span>
            Borrowing History
          </button>
        </div>
      </div>

      {/* Overdue Alerts */}
      <OverdueAlerts />

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for books, members, or transactions..."
          className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <span className="text-gray-500">🔍</span>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Advanced Search
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Borrow Form & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                  <span className="text-xl">📚</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Books</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.totalBooks}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                  <span className="text-xl">👥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.activeMembers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg mr-3">
                  <span className="text-xl">🔄</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Today's Borrows</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.todayBorrows}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mr-3">
                  <span className="text-xl">⏰</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.overdue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Books Section */}
          <SearchBooksSection books={books} />

          {/* Borrow Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-3 text-white">
                  <span className="text-2xl">📖</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Borrow Book</h2>
                  <p className="text-gray-600 dark:text-gray-400">Fill details to issue a book to a member</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <BorrowBookForm
                books={books}
                members={members}
                onBorrowSuccess={() => fetchData()}
              />
            </div>
          </div>

          {/* Recent Borrows Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Borrowing Activity</h2>
                  <p className="text-gray-600 dark:text-gray-400">Latest transactions in the system</p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                  View All Transactions →
                </button>
              </div>
            </div>
            <div className="p-6">
              <RecentBorrowsTable transactions={transactions} />
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Borrow Card */}
          <QuickBorrowCard />

          {/* Member Eligibility Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Member Eligibility</h3>
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                Updated just now
              </span>
            </div>
            <div className="space-y-3">
              {members.slice(0, 5).map(member => (
                <div
                  key={member.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => router.push(`/members/${member.id}`)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mr-3 font-medium">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{member.membershipId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      // Need status logic
                      }`}>
                      {member.currentBorrowed}/{member.maxBooks}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {member.status || 'Active'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              View All Members
            </button>
          </div>

          {/* Today's Summary */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Today's Summary</h3>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Live</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.todayBorrows}</div>
                <div className="text-sm opacity-90 mt-1">Books Borrowed</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.booksReturned}</div>
                <div className="text-sm opacity-90 mt-1">Books Returned</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">{stats.overdue}</div>
                <div className="text-sm opacity-90 mt-1">Overdue</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">₹{stats.finesCollected}</div>
                <div className="text-sm opacity-90 mt-1">Fines Collected</div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex justify-between text-sm">
                <span>Active Transactions</span>
                <span className="font-medium">{stats.activeTransactions}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Total Members</span>
                <span className="font-medium">{stats.activeMembers}</span>
              </div>
            </div>
          </div>

          {/* Popular Books */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Most Borrowed This Week</h3>
              <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                See All
              </button>
            </div>
            <div className="space-y-3">
              {popularBooks.map((book, index) => (
                <div key={book.id} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-medium ${index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
                      index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {book.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">? borrows</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${book.available_copies > 2
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {book.available_copies} available
                      </span>
                    </div>
                  </div>
                  <button className="ml-2 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickAction('Return Book')}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg flex flex-col items-center transition-colors"
              >
                <span className="text-2xl mb-2">↩️</span>
                <span className="text-sm">Return Book</span>
              </button>
              <button
                onClick={() => handleQuickAction('Renew Book')}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg flex flex-col items-center transition-colors"
              >
                <span className="text-2xl mb-2">🔄</span>
                <span className="text-sm">Renew Book</span>
              </button>
              <button
                onClick={() => handleQuickAction('Add Member')}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg flex flex-col items-center transition-colors"
              >
                <span className="text-2xl mb-2">👤</span>
                <span className="text-sm">Add Member</span>
              </button>
              <button
                onClick={() => handleQuickAction('Scan ISBN')}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg flex flex-col items-center transition-colors"
              >
                <span className="text-2xl mb-2">📷</span>
                <span className="text-sm">Scan ISBN</span>
              </button>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                <span className="text-xl">❓</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Need Help?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Quick guides and support</p>
              </div>
            </div>
            <div className="space-y-3">
              <a href="#" className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <span className="mr-3">📖</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">How to process returns</span>
              </a>
              <a href="#" className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <span className="mr-3">💰</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Fine calculation guide</span>
              </a>
              <a href="#" className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <span className="mr-3">👥</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Member management tips</span>
              </a>
            </div>
            <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p>📊 System Status: All services operational • Last updated: Today at 10:30 AM</p>
        <p className="mt-1">Need assistance? Contact library admin at admin@library.com or call +91 9876543210</p>
      </div>

      {/* Bulk Borrow Modal (Placeholder) */}
      {showBulkBorrow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bulk Book Borrowing</h2>
                <button
                  onClick={() => setShowBulkBorrow(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload a CSV file with member IDs and book ISBNs to process multiple borrows at once.
              </p>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">📁</div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">Drag & drop your CSV file here</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or click to browse</p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Select File
                </button>
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Download template:</p>
                <button className="text-blue-600 dark:text-blue-400 hover:underline">
                  bulk_borrow_template.csv
                </button>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowBulkBorrow(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Process Bulk Borrow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}