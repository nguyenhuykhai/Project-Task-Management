import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyLineChartProps {
  data: { name: string; points: number }[];
}

const MonthlyLineChart: React.FC<MonthlyLineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
        <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
        <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
        <Tooltip />
        <Area type="monotone" dataKey="points" name="Points Completed" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPoints)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MonthlyLineChart;
