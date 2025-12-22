'use client';

import { useState } from 'react';

const categories = [
  { name: 'Computer Science', count: 2450, color: 'bg-blue-500' },
  { name: 'Fiction', count: 1890, color: 'bg-green-500' },
  { name: 'Science', count: 1560, color: 'bg-purple-500' },
  { name: 'History', count: 1280, color: 'bg-yellow-500' },
  { name: 'Business', count: 980, color: 'bg-pink-500' },
  { name: 'Others', count: 1296, color: 'bg-gray-500' },
];

export default function CategoryDistribution() {
  const total = categories.reduce((sum, cat) => sum + cat.count, 0);
  
  return (
    <div className="space-y-4">
      <div className="h-48 flex items-center justify-center">
        <div className="relative w-48 h-48">
          {categories.map((cat, index) => {
            const percentage = (cat.count / total) * 100;
            const startAngle = categories.slice(0, index).reduce((sum, c) => sum + (c.count / total) * 360, 0);
            
            return (
              <div
                key={cat.name}
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  clipPath: `conic-gradient(from ${startAngle}deg, ${cat.color} 0 ${percentage}%, transparent ${percentage}% 100%)`,
                }}
              />
            );
          })}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white dark:bg-gray-800 rounded-full" />
        </div>
      </div>
      
      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 ${cat.color} rounded mr-2`} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {cat.count} ({(cat.count / total * 100).toFixed(1)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}