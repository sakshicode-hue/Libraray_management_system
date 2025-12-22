'use client';

import { useState } from 'react';

export default function OverdueAlerts() {
  const [alerts, setAlerts] = useState([
    { id: 1, member: 'John Doe', book: 'The Catcher in the Rye', daysOverdue: 5, fine: '₹50' },
    { id: 2, member: 'Jane Smith', book: 'Pride and Prejudice', daysOverdue: 3, fine: '₹30' },
  ]);
  
  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
  if (alerts.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg p-4 text-white">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="p-2 bg-white/20 rounded-lg mr-3">
            <span className="text-xl">⚠️</span>
          </div>
          <div>
            <h3 className="font-semibold">Overdue Books Alert</h3>
            <p className="text-sm opacity-90">{alerts.length} books need immediate attention</p>
          </div>
        </div>
        <button
          onClick={() => setAlerts([])}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm"
        >
          Dismiss All
        </button>
      </div>
      
      <div className="space-y-2">
        {alerts.map(alert => (
          <div key={alert.id} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <div>
              <p className="font-medium">{alert.member}</p>
              <p className="text-sm opacity-90">{alert.book}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium">{alert.daysOverdue} days overdue</span>
              <span className="font-medium">{alert.fine}</span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm">
                  Send Reminder
                </button>
                <button 
                  onClick={() => dismissAlert(alert.id)}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}