'use client';

import { useState } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  availableCopies: number;
  totalCopies: number;
}

interface Member {
  id: number;
  name: string;
  email: string;
  membershipId: string;
  maxBooks: number;
  currentBorrowed: number;
  status: string;
}

interface BorrowBookFormProps {
  books: Book[];
  members: Member[];
}

export default function BorrowBookForm({ books, members }: BorrowBookFormProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [borrowDate, setBorrowDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const calculateDueDate = (days: number) => {
    const date = new Date(borrowDate);
    date.setDate(date.getDate() + days);
    setDueDate(date.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Book "${selectedBook?.title}" borrowed to ${selectedMember?.name}`);
    // Reset form
    setSelectedBook(null);
    setSelectedMember(null);
    setDueDate('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Book *
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            onChange={(e) => setSelectedBook(books.find(b => b.id === parseInt(e.target.value)) || null)}
            required
          >
            <option value="">Search or select a book</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author} ({book.availableCopies} available)
              </option>
            ))}
          </select>
        </div>

        {/* Member Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Member *
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            onChange={(e) => setSelectedMember(members.find(m => m.id === parseInt(e.target.value)) || null)}
            required
          >
            <option value="">Search or select a member</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.membershipId}) - {member.currentBorrowed}/{member.maxBooks}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Info */}
      {(selectedBook || selectedMember) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedBook && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Selected Book</h4>
              <p className="font-medium">{selectedBook.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">by {selectedBook.author}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                ISBN: {selectedBook.isbn} | Available: {selectedBook.availableCopies}/{selectedBook.totalCopies} copies
              </p>
            </div>
          )}
          
          {selectedMember && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Selected Member</h4>
              <p className="font-medium">{selectedMember.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">ID: {selectedMember.membershipId}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Status: {selectedMember.status} | Borrowed: {selectedMember.currentBorrowed}/{selectedMember.maxBooks} books
              </p>
            </div>
          )}
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Borrow Date *
          </label>
          <input
            type="date"
            value={borrowDate}
            onChange={(e) => setBorrowDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date *
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            required
          />
          <div className="flex space-x-2 mt-2">
            {[7, 14, 21].map(days => (
              <button
                key={days}
                type="button"
                onClick={() => calculateDueDate(days)}
                className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {days} days
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration
          </label>
          <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
            {dueDate ? (
              <span className="font-medium">
                {Math.ceil((new Date(dueDate).getTime() - new Date(borrowDate).getTime()) / (1000 * 3600 * 24))} days
              </span>
            ) : (
              <span className="text-gray-500">Select dates</span>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          rows={3}
          placeholder="Add any special instructions or notes..."
        />
      </div>

      {/* Terms */}
      <div className="flex items-start">
        <input
          type="checkbox"
          id="terms"
          className="mt-1 mr-3"
          required
        />
        <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
          I confirm that the member has agreed to the borrowing terms and conditions, 
          including late return fines of ₹10 per day per book.
        </label>
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => {
            setSelectedBook(null);
            setSelectedMember(null);
            setDueDate('');
            setNotes('');
          }}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={!selectedBook || !selectedMember || !dueDate}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium"
        >
          Issue Book
        </button>
      </div>
    </form>
  );
}