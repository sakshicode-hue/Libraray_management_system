import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your library management system" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value="1,234"
          icon="📚"
          trend={{ value: '12%', isPositive: true }}
        />
        <StatCard
          title="Active Members"
          value="456"
          icon="👥"
          trend={{ value: '8%', isPositive: true }}
        />
        <StatCard
          title="Borrowed Books"
          value="89"
          icon="📖"
          trend={{ value: '5%', isPositive: false }}
        />
        <StatCard
          title="Pending Returns"
          value="23"
          icon="↩️"
          trend={{ value: '3%', isPositive: false }}
        />
      </div>
    </div>
  );
}


