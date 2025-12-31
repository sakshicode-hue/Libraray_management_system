export default function SystemHealth({ health }: { health: any }) {
  const isHealthy = health?.status === 'healthy';
  const dbStatus = health?.database || 'unknown';

  const systems = [
    { name: 'Database', status: dbStatus === 'healthy' ? 'healthy' : 'error', label: dbStatus === 'healthy' ? 'Connected' : 'Disconnected' },
    { name: 'API Server', status: 'healthy', label: 'Online' }, // If we are rendering this, API is reachable
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h3>
      <div className="space-y-4">
        {systems.map(system => (
          <div key={system.name} className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${system.status === 'healthy' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                  system.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                }`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{system.name}</span>
            </div>
            <div className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {system.label}
            </div>
          </div>
        ))}
      </div>

      {health?.collections && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Database Stats</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm flex justify-between">
              <span className="text-gray-500">Users:</span>
              <span className="font-mono">{health.collections.users?.toLocaleString() || '-'}</span>
            </div>
            <div className="text-sm flex justify-between">
              <span className="text-gray-500">Books:</span>
              <span className="font-mono">{health.collections.books?.toLocaleString() || '-'}</span>
            </div>
            <div className="text-sm flex justify-between">
              <span className="text-gray-500">Transactions:</span>
              <span className="font-mono">{health.collections.transactions?.toLocaleString() || '-'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 text-center">
        Last checked: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}