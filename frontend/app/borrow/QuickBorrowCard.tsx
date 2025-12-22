'use client';

import { useState } from 'react';

export default function QuickBorrowCard() {
  const [search, setSearch] = useState('');
  
  const quickBooks = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', available: 3 },
    { id: 2, title: '1984', author: 'George Orwell', available: 5 },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', available: 2 },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', available: 1 },
  ];
  
  const quickMembers = [
    { id: 1, name: 'John Doe', idNumber: 'MEM001' },
    { id: 2, name: 'Jane Smith', idNumber: 'MEM002' },
    { id: 3, name: 'Bob Johnson', idNumber: 'MEM003' },
  ];
  
  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Quick Borrow</h3>
      
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Scan barcode or type ISBN..."
          className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg placeholder-white/70"
        />
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2 opacity-90">Quick Pick Books</h4>
          <div className="space-y-2">
            {quickBooks.map(book => (
              <button
                key={book.id}
                className="w-full flex justify-between items-center p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium">{book.title}</p>
                  <p className="text-xs opacity-80">{book.author}</p>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {book.available} left
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2 opacity-90">Frequent Members</h4>
          <div className="space-y-2">
            {quickMembers.map(member => (
              <button
                key={member.id}
                className="w-full flex justify-between items-center p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs opacity-80">{member.idNumber}</p>
                </div>
                <span className="text-xs">Select</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <button className="w-full mt-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100">
        Quick Issue with Last Settings
      </button>
    </div>
  );
}