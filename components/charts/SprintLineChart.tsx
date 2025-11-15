import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SprintLineChartProps {
  data: { name: string; ideal: number; actual?: number }[];
}

const SprintLineChart: React.FC<SprintLineChartProps> = ({ data }) => {
    if(!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No tasks in this view to show progress.</div>;
    }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
        <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
        <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ideal" name="Ideal Burndown" stroke="#8884d8" strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="actual" name="Actual Burndown" stroke="#82ca9d" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SprintLineChart;
