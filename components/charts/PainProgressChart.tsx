'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface PainProgressChartProps {
  data: ChartDataPoint[];
  height?: number;
}

const ORANGE = '#FF6B35';

/** VAS pain trend area chart, clean and minimal like the mockup. */
export default function PainProgressChart({
  data,
  height = 160,
}: PainProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: -20, right: 8, top: 4 }}>
        <defs>
          <linearGradient id="vasGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ORANGE} stopOpacity={0.25} />
            <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 9, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
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
          formatter={(value) => [`${value}/10`, 'VAS']}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={ORANGE}
          strokeWidth={2.5}
          fill="url(#vasGradient)"
          dot={{ fill: ORANGE, strokeWidth: 0, r: 3.5 }}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
