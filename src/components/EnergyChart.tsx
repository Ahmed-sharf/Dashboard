import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: '00:00', grid: 2.1, solar: 0 },
  { name: '04:00', grid: 1.8, solar: 0 },
  { name: '08:00', grid: 3.5, solar: 1.2 },
  { name: '12:00', grid: 1.2, solar: 5.8 },
  { name: '16:00', grid: 2.8, solar: 3.1 },
  { name: '20:00', grid: 4.5, solar: 0.2 },
  { name: '23:59', grid: 3.2, solar: 0 },
];

export default function EnergyChart() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 h-[400px] shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold dark:text-white">Power Distribution</h3>
          <p className="text-sm text-gray-400">Grid vs Solar generation (kWh)</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-xs font-semibold bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg shadow-black/10">Today</button>
          <button className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-full">History</button>
        </div>
      </div>
      
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? "#fff" : "#000"} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={isDark ? "#fff" : "#000"} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#27272a" : "#f0f0f0"} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                color: isDark ? '#ffffff' : '#000000'
              }} 
              itemStyle={{ color: isDark ? '#ffffff' : '#000000' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              height={36}
              formatter={(value) => <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{value}</span>}
            />
            <Area 
              type="monotone" 
              dataKey="grid" 
              name="Grid Power"
              stroke={isDark ? "#fff" : "#000"} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorGrid)" 
            />
            <Area 
              type="monotone" 
              dataKey="solar" 
              name="Solar Power"
              stroke="#fbbf24" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSolar)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
