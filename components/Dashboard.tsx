import React from 'react';
import type { Sprint, Task } from '../types';
import { useChartData } from '../hooks/useChartData';
import WorkloadCapacityChart from './charts/WorkloadCapacityChart';
import MonthlyLineChart from './charts/MonthlyLineChart';

const ChartCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => (
  <div
    className={`
      bg-card border border-border rounded-xl shadow-sm
      hover:shadow-xl transition-all duration-300
      p-5 flex flex-col h-80
      ${className}
    `}
  >
    <h3 className="text-lg font-semibold text-foreground mb-4 tracking-tight">{title}</h3>
    <div className="flex-1 min-h-0">{children}</div>
  </div>
);

// KPI Card with gradient & glow
const KPICard: React.FC<{
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ title, value, trend = 'neutral' }) => {
  const trendColor =
    trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-card to-card/90
        border border-border rounded-xl
        p-6 flex flex-col justify-center items-center
        shadow-md hover:shadow-xl transition-all duration-300
        group cursor-default
      `}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
      <p className="text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        {value}
      </p>
      {trend !== 'neutral' && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${trendColor}`}>
          {trend === 'up' ? '↑' : '↓'} Trending
        </p>
      )}
    </div>
  );
};

const Dashboard: React.FC<{ tasks: Task[]; sprints: Sprint[] }> = ({ tasks, sprints }) => {
  const { memberAvgCapacity, teamAvgCapacity, statusDistribution, monthlyProgress } = useChartData(
    tasks,
    sprints,
  );

  return (
    <div className="space-y-6">
      {/* Row 1: Team Average Capacity + Monthly Points Trend */}
      <div className="grid grid-cols-1 gap-6">
        {/* Right Column: KPI + Status Doughnut */}
        <div className="col-span-6 grid grid-cols-2 gap-6">
          <KPICard
            title="Team Average Capacity"
            value={teamAvgCapacity.toFixed(1)}
            trend={teamAvgCapacity > 3 ? 'down' : teamAvgCapacity < 2 ? 'up' : 'neutral'}
          />
          <ChartCard title="Monthly Points Trend" className="h-96">
            <MonthlyLineChart data={monthlyProgress} />
          </ChartCard>
        </div>
      </div>

      {/* Row 2: Member Average Capacity */}
      <div className="grid grid-cols-1 gap-6">
        {/* Placeholder for future card */}
        <ChartCard title="Member Average Capacity">
          <WorkloadCapacityChart data={memberAvgCapacity} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
