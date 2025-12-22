// app/dashboard/page.tsx
import StatCard from '@/app/dashboard/StatCard';
import ActivityTimeline from '@/app/dashboard/ActivityTimeline';
import BorrowingChart from '@/app/dashboard/BorrowingChart';
import CategoryDistribution from '@/app/dashboard/CategoryDistribution';
import OverdueBooksTable from '@/app/dashboard/OverdueBooksTable';
import PopularBooksCarousel from '@/app/dashboard/PopularBooksCarousel';
import QuickActions from '@/app/dashboard/QuickAction';
import SystemHealth from '@/app/dashboard/SystemHealth';

// Mock data
const dashboardStats = [
  { id: 1, title: "Total Books", value: "12,456", icon: "📚", trend: { value: '8.2%', isPositive: true }, color: "blue" },
  { id: 2, title: "Active Members", value: "2,345", icon: "👥", trend: { value: '12.5%', isPositive: true }, color: "green" },
  { id: 3, title: "Books Borrowed Today", value: "156", icon: "📖", trend: { value: '5.3%', isPositive: true }, color: "purple" },
  { id: 4, title: "Overdue Books", value: "23", icon: "⏰", trend: { value: '2.1%', isPositive: false }, color: "red" },
  { id: 5, title: "Pending Returns", value: "89", icon: "↩️", trend: { value: '3.4%', isPositive: false }, color: "yellow" },
  { id: 6, title: "Total Fines", value: "₹12,450", icon: "💰", trend: { value: '15.7%', isPositive: true }, color: "indigo" },
  { id: 7, title: "E-Books", value: "2,345", icon: "📱", trend: { value: '25.3%', isPositive: true }, color: "pink" },
  { id: 8, title: "Reservations", value: "45", icon: "📌", trend: { value: '7.8%', isPositive: true }, color: "orange" },
];

const recentActivities = [
  { id: 1, user: "John Doe", action: "borrowed", book: "The Great Gatsby", time: "10 min ago", type: "borrow" },
  { id: 2, user: "Jane Smith", action: "returned", book: "1984", time: "25 min ago", type: "return" },
  { id: 3, user: "Admin", action: "added new book", book: "Deep Learning", time: "1 hour ago", type: "add" },
  { id: 4, user: "Bob Johnson", action: "renewed", book: "Python Crash Course", time: "2 hours ago", type: "renew" },
  { id: 5, user: "Alice Brown", action: "paid fine", amount: "₹250", time: "3 hours ago", type: "payment" },
  { id: 6, user: "System", action: "sent overdue reminders", count: "15 members", time: "4 hours ago", type: "system" },
];

const overdueBooks = [
  { id: 1, title: "The Catcher in the Rye", member: "John Doe", dueDate: "2024-01-20", daysOverdue: 5, fine: "₹50" },
  { id: 2, title: "Pride and Prejudice", member: "Jane Smith", dueDate: "2024-01-22", daysOverdue: 3, fine: "₹30" },
  { id: 3, title: "To Kill a Mockingbird", member: "Bob Johnson", dueDate: "2024-01-18", daysOverdue: 7, fine: "₹70" },
  { id: 4, title: "The Great Gatsby", member: "Alice Brown", dueDate: "2024-01-15", daysOverdue: 10, fine: "₹100" },
  { id: 5, title: "1984", member: "Charlie Wilson", dueDate: "2024-01-25", daysOverdue: 0, fine: "₹0" },
];

const popularBooks = [
  { id: 1, title: "Python Programming", author: "John Doe", borrows: 145, coverColor: "bg-blue-100", textColor: "text-blue-600" },
  { id: 2, title: "Data Structures", author: "Jane Smith", borrows: 128, coverColor: "bg-green-100", textColor: "text-green-600" },
  { id: 3, title: "Machine Learning", author: "Bob Johnson", borrows: 112, coverColor: "bg-purple-100", textColor: "text-purple-600" },
  { id: 4, title: "Web Development", author: "Alice Brown", borrows: 98, coverColor: "bg-pink-100", textColor: "text-pink-600" },
  { id: 5, title: "Database Systems", author: "Charlie Wilson", borrows: 87, coverColor: "bg-orange-100", textColor: "text-orange-600" },
];

const quickActions = [
  { id: 1, title: "Borrow Book", icon: "📖", path: "/borrow", color: "bg-blue-500" },
  { id: 2, title: "Return Book", icon: "↩️", path: "/returns", color: "bg-green-500" },
  { id: 3, title: "Add New Book", icon: "➕", path: "/books/add", color: "bg-purple-500" },
  { id: 4, title: "Manage Fines", icon: "💰", path: "/fines", color: "bg-yellow-500" },
  { id: 5, title: "Generate Report", icon: "📊", path: "/reports", color: "bg-indigo-500" },
  { id: 6, title: "Search Catalog", icon: "🔍", path: "/search", color: "bg-pink-500" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Library Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here's what's happening in your library today.
            <span className="ml-2 text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              Last updated: Today, 10:30 AM
            </span>
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center">
            <span className="mr-2">📅</span> Date Range
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center">
            <span className="mr-2">📥</span> Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map(stat => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Borrowing Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Borrowing Trends</h2>
              <p className="text-gray-600 dark:text-gray-400">Last 30 days activity</p>
            </div>
            <select className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <BorrowingChart />
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Books by Category</h2>
          <CategoryDistribution />
        </div>
      </div>

      {/* Tables and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                View All Activity
              </button>
            </div>
            <ActivityTimeline activities={recentActivities} />
          </div>

          {/* Overdue Books Table */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Overdue Books</h2>
                <p className="text-gray-600 dark:text-gray-400">Require immediate attention</p>
              </div>
              <button className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg font-medium">
                Send Reminders
              </button>
            </div>
            <OverdueBooksTable books={overdueBooks} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(action => (
                <QuickActions key={action.id} {...action} />
              ))}
            </div>
          </div>

          {/* System Health */}
          <SystemHealth />

          {/* Popular Books Carousel */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Most Popular Books</h3>
            <PopularBooksCarousel books={popularBooks} />
          </div>

          {/* Daily Target */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Target</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Books to Process</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fines Collection</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Member Support</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-white/20 rounded-lg mr-3">
                <span className="text-xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold">AI Insights</h3>
            </div>
            <p className="text-sm opacity-90 mb-3">Based on recent patterns:</p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <span className="mr-2">📈</span>
                <span>Computer Science books borrows increased by 25% this week</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">👥</span>
                <span>New member registrations peak on Mondays</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💰</span>
                <span>Consider adding more Data Science books - high demand</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}