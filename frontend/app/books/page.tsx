import PageHeader from '@/components/PageHeader';
import Link from 'next/link';

export default function BooksPage() {
  return (
    <div>
      <PageHeader
        title="Book Catalog"
        description="Manage and browse all books in the library"
        action={
          <Link
            href="/books/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Book
          </Link>
        }
      />
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-400">Book catalog will be displayed here...</p>
      </div>
    </div>
  );
}


