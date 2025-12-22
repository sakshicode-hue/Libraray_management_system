'use client';

import { useState } from 'react';

export default function BorrowingChart() {
  const [period, setPeriod] = useState('30d');
  
  const data = {
    '7d': [45, 52, 38, 61, 55, 48, 60],
    '30d': [120, 135, 110, 145, 130, 125, 140, 155, 130, 125, 140, 150, 130, 135, 140, 145, 150, 140, 135, 130, 125, 140, 145, 150, 155, 160, 155, 150, 145, 140],
    '90d': [150, 145, 160, 155, 170, 165, 160, 155, 150, 145, 140, 135, 130, 140, 150, 160, 170, 165, 160, 155]
  };

  const currentData = data[period as keyof typeof data] || data['30d'];
  const maxValue = Math.max(...currentData);
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentData.reduce((a, b) => a + b, 0)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total borrows this period</p>
        </div>
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm rounded-lg ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64 mt-8 flex items-end space-x-1">
        {currentData.map((value, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center"
            style={{ height: '100%' }}
          >
            <div
              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:opacity-80 transition-opacity cursor-pointer"
              style={{ height: `${(value / maxValue) * 90}%` }}
              title={`${value} borrows`}
            />
            <div className="text-xs text-gray-500 mt-2">
              {period === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] : index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}