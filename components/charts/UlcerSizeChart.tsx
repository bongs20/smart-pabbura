'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface UlcerSizeChartProps {
  data: ChartDataPoint[];
  height?: number;
}

const NAVY = '#1E3A5F';

/** Ulcer size (cm) bar chart, navy, minimal like the mockup. */
export default function UlcerSizeChart({
  data,
  height = 160,
}: UlcerSizeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 9, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 9, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v} cm`}
        />
        <Tooltip
          cursor={{ fill: '#F8FAFC' }}
          contentStyle={{
            borderRadius: 12,
            border: 'none',
            boxShadow: '0 4px 12px rgba(30,58,95,0.12)',
            fontSize: 12,
          }}
          formatter={(value) => [`${value} cm`, 'Ulser']}
        />
        <Bar dataKey="value" fill={NAVY} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
