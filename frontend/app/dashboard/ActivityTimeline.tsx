interface Activity {
  id: number;
  user: string;
  action: string;
  book?: string;
  amount?: string;
  count?: string;
  time: string;
  type: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getIcon = (type: string) => {
    switch(type) {
      case 'borrow': return '📖';
      case 'return': return '↩️';
      case 'add': return '➕';
      case 'renew': return '🔄';
      case 'payment': return '💰';
      default: return '📝';
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case 'borrow': return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      case 'return': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'add': return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300';
      case 'renew': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300';
      case 'payment': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <div key={activity.id} className="flex items-start">
          <div className={`p-2 rounded-lg ${getColor(activity.type)} mr-3`}>
            <span className="text-lg">{getIcon(activity.type)}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="font-medium text-gray-900 dark:text-white">
                <span className="font-semibold">{activity.user}</span> {activity.action}
                {activity.book && <span className="font-semibold ml-1">"{activity.book}"</span>}
                {activity.amount && <span className="ml-1">of {activity.amount}</span>}
                {activity.count && <span className="ml-1">to {activity.count}</span>}
              </p>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}