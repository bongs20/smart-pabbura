'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface HealingProgressChartProps {
  data: ChartDataPoint[];
  height?: number;
}

const NAVY = '#1E3A5F';
const ORANGE = '#FF6B35';

/** Alternating navy/orange bars like the mockup healing chart. */
export default function HealingProgressChart({
  data,
  height = 170,
}: HealingProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barCategoryGap="32%" barGap={3}>
        <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 9, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          domain={[0, 12]}
          ticks={[0, 4, 8, 12]}
          tick={{ fontSize: 9, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: '#F8FAFC' }}
          contentStyle={{
            borderRadius: 12,
            border: 'none',
            boxShadow: '0 4px 12px rgba(30,58,95,0.12)',
            fontSize: 12,
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? NAVY : ORANGE} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
