// components/borrow/RecentBorrowsTable.tsx

interface Transaction {
  id: string | number;
  memberName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  status: string; // Relaxed to accept API status values
}

interface RecentBorrowsTableProps {
  transactions: Transaction[];
}

export default function RecentBorrowsTable({ transactions }: RecentBorrowsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'borrowed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'returned': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'renewed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // If no transactions, show empty state
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">📭</div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Recent Transactions</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">No books have been borrowed recently.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Borrows</h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Showing {transactions.length} transactions
        </span>
      </div>

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Member
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Book
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Borrow Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Due Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full font-medium">
                    {transaction.memberName.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.memberName}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white font-medium">
                  {transaction.bookTitle}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ID: TXN-{transaction.id.toString().padStart(3, '0')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">{transaction.borrowDate}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(transaction.borrowDate).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm font-medium ${transaction.status.toLowerCase() === 'overdue'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-900 dark:text-white'
                  }`}>
                  {transaction.dueDate}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {(() => {
                    const due = new Date(transaction.dueDate);
                    const today = new Date();
                    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));

                    const status = transaction.status.toLowerCase();
                    if (status === 'overdue') {
                      return `${Math.abs(diffDays)} days overdue`;
                    } else if (status === 'active' || status === 'borrowed') {
                      return diffDays > 0 ? `${diffDays} days left` : 'Due today';
                    }
                    return 'Completed';
                  })()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {(transaction.status.toLowerCase() === 'active' || transaction.status.toLowerCase() === 'borrowed') && '🔄'}
                  {transaction.status.toLowerCase() === 'returned' && '✅'}
                  {transaction.status.toLowerCase() === 'overdue' && '⚠️'}
                  {transaction.status.toLowerCase() === 'renewed' && '↩️'}
                  <span className="ml-1">{transaction.status}</span>
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {(transaction.status.toLowerCase() === 'active' || transaction.status.toLowerCase() === 'borrowed') && (
                  <div className="flex space-x-2">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-md text-sm transition-colors">
                      Renew
                    </button>
                    <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-md text-sm transition-colors">
                      Return
                    </button>
                  </div>
                )}
                {transaction.status === 'Overdue' && (
                  <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-md text-sm transition-colors">
                    Send Reminder
                  </button>
                )}
                {transaction.status === 'Returned' && (
                  <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md text-sm transition-colors">
                    View Details
                  </button>
                )}
                {transaction.status === 'Renewed' && (
                  <button className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-md text-sm transition-colors">
                    View History
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination/Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">1-{transactions.length}</span> of <span className="font-medium">{transactions.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}