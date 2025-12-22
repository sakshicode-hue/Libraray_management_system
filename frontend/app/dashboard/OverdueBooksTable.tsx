interface OverdueBook {
  id: number;
  title: string;
  member: string;
  dueDate: string;
  daysOverdue: number;
  fine: string;
}

interface OverdueBooksTableProps {
  books: OverdueBook[];
}

export default function OverdueBooksTable({ books }: OverdueBooksTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Book</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Member</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Days Overdue</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Fine</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900 dark:text-white">{book.title}</div>
              </td>
              <td className="py-3 px-4">
                <div className="text-gray-700 dark:text-gray-300">{book.member}</div>
              </td>
              <td className="py-3 px-4">
                <div className="text-gray-700 dark:text-gray-300">{book.dueDate}</div>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  book.daysOverdue > 7 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {book.daysOverdue} days
                </span>
              </td>
              <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{book.fine}</td>
              <td className="py-3 px-4">
                <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800">
                  Contact
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}