'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface PhHistoryChartProps {
  data: ChartDataPoint[];
  height?: number;
}

const ORANGE = '#FF6B35';

/** pH history line chart (analysis page) with mockup-clean styling. */
export default function PhHistoryChart({
  data,
  height = 180,
}: PhHistoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: -20, right: 8, top: 4 }}>
        <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 9, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          domain={[4, 8]}
          ticks={[4, 5, 6, 7, 8]}
          tick={{ fontSize: 9, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: 'none',
            boxShadow: '0 4px 12px rgba(30,58,95,0.12)',
            fontSize: 12,
          }}
          formatter={(value) => [`${value}`, 'pH']}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={ORANGE}
          strokeWidth={2.5}
          dot={{ fill: ORANGE, strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
