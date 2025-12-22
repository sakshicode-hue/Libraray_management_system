export default function SystemHealth() {
  const systems = [
    { name: 'Database', status: 'healthy', uptime: '99.9%' },
    { name: 'API Server', status: 'healthy', uptime: '99.8%' },
    { name: 'File Storage', status: 'warning', uptime: '98.5%' },
    { name: 'Email Service', status: 'healthy', uptime: '99.7%' },
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h3>
      <div className="space-y-4">
        {systems.map(system => (
          <div key={system.name} className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                system.status === 'healthy' ? 'bg-green-500' :
                system.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{system.name}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-900 dark:text-white">{system.uptime}</span>
              <span className="text-gray-500 ml-1">uptime</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Last Backup:</span>
          <span className="font-medium text-gray-900 dark:text-white">Today, 02:00 AM</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600 dark:text-gray-400">Storage Used:</span>
          <span className="font-medium text-gray-900 dark:text-white">1.2 GB / 5 GB</span>
        </div>
      </div>
    </div>
  );
}