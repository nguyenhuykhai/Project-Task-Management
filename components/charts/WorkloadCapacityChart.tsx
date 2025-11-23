import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface WorkloadCapacityChartProps {
  data: { name: string; wipAverage: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
        <p className="font-bold text-gray-800 dark:text-gray-200">{`${label}`}</p>
        <p className="text-blue-500">{`Capacity: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const WorkloadCapacityChart: React.FC<WorkloadCapacityChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No 'Completed' tasks to calculate WIP average.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
        <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
        <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }} />
        <Legend iconType="circle" color="#3b82f6" />
        <Bar dataKey="wipAverage" name="Capacity Average">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.wipAverage > 10 ? '#ef4444' : '#3b82f6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WorkloadCapacityChart;
