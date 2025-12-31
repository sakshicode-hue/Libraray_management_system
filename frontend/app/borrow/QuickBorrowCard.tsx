'use client';

import { useState } from 'react';

interface QuickBorrowCardProps {
  books?: any[];
  members?: any[];
}

export default function QuickBorrowCard({ books = [], members = [] }: QuickBorrowCardProps) {
  const [search, setSearch] = useState('');

  // Use first few items
  const quickBooks = books.slice(0, 4).map(b => ({
    id: b.id,
    title: b.title,
    author: b.author,
    available: b.availableCopies || b.available_copies || 0
  }));

  const quickMembers = members.slice(0, 3).map(m => ({
    id: m.id,
    name: m.name || m.user_details?.full_name,
    idNumber: m.membershipId || m.membership_id
  }));

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Quick Borrow</h3>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Scan barcode or type ISBN..."
          className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg placeholder-white/70 text-white"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2 opacity-90">Quick Pick Books</h4>
          <div className="space-y-2">
            {quickBooks.length > 0 ? quickBooks.map(book => (
              <button
                key={book.id}
                className="w-full flex justify-between items-center p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => alert(`Selected book: ${book.title}. (Logic to move to form coming soon)`)}
              >
                <div className="text-left w-2/3">
                  <p className="font-medium truncate">{book.title}</p>
                  <p className="text-xs opacity-80 truncate">{book.author}</p>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded whitespace-nowrap">
                  {book.available} left
                </span>
              </button>
            )) : <p className="text-xs opacity-70">No books available</p>}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 opacity-90">Frequent Members</h4>
          <div className="space-y-2">
            {quickMembers.length > 0 ? quickMembers.map(member => (
              <button
                key={member.id}
                className="w-full flex justify-between items-center p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => alert(`Selected member: ${member.name}. (Logic to move to form coming soon)`)}
              >
                <div className="text-left">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs opacity-80">{member.idNumber}</p>
                </div>
                <span className="text-xs">Select</span>
              </button>
            )) : <p className="text-xs opacity-70">No members available</p>}
          </div>
        </div>
      </div>

      <button className="w-full mt-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100">
        Quick Issue with Last Settings
      </button>
    </div>
  );
}