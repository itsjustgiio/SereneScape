'use client';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { day: 'Mon', uses: 2 },
  { day: 'Tue', uses: 1 },
  { day: 'Wed', uses: 3 },
  { day: 'Thu', uses: 2 },
  { day: 'Fri', uses: 1 },
  { day: 'Sat', uses: 2 },
  { day: 'Sun', uses: 3 },
];

export default function UserActivityGraph() {
  return (
    <div className="bg-card rounded-xl p-4 shadow-md w-full max-w-2xl mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-2">Weekly App Usage</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} domain={[0, 4]} />
          <Tooltip />
          <Line type="monotone" dataKey="uses" stroke="#6366f1" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}