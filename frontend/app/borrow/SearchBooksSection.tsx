'use client';

import { useState } from 'react';

interface Book {
  id: string | number;
  title: string;
  author: string;
  isbn: string;
  availableCopies: number;
  totalCopies: number;
}

interface SearchBooksSectionProps {
  books: Book[];
}

export default function SearchBooksSection({ books }: SearchBooksSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredBooks(books.slice(0, 4));
    } else {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.isbn.includes(term)
      ).slice(0, 4);
      setFilteredBooks(filtered);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Search Books</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Find books by title, author, or ISBN</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center">
            <span className="mr-2">🎯</span> Advanced
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center">
            <span className="mr-2">📷</span> Scan ISBN
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for books by title, author, or ISBN..."
          className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <span className="text-gray-500">🔍</span>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <span className="text-sm text-gray-500">Press Enter to search</span>
        </div>
      </div>

      {searchTerm && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Search Results</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map(book => (
              <div key={book.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">{book.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                    <p className="text-xs text-gray-500 mt-1">ISBN: {book.isbn}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${book.availableCopies > 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                      {book.availableCopies} available
                    </span>
                  </div>
                </div>
                <button className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
                  Select to Borrow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searchTerm && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recently Borrowed</h4>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {books.slice(0, 3).map(book => (
              <div key={book.id} className="min-w-[200px] p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg flex items-center justify-center mb-3">
                  📚
                </div>
                <h5 className="font-medium text-gray-900 dark:text-white truncate">{book.title}</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{book.author}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">{book.availableCopies} left</span>
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    Quick Borrow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}