import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'HVAC', value: 45, color: '#000000' },
  { name: 'Appliances', value: 30, color: '#4b5563' },
  { name: 'Lighting', value: 15, color: '#9ca3af' },
  { name: 'Other', value: 10, color: '#e5e7eb' },
];

const darkData = [
  { name: 'HVAC', value: 45, color: '#ffffff' },
  { name: 'Appliances', value: 30, color: '#a1a1aa' },
  { name: 'Lighting', value: 15, color: '#71717a' },
  { name: 'Other', value: 10, color: '#3f3f46' },
];

export default function EnergyBreakdown() {
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

  const chartData = isDark ? darkData : data;

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 h-[350px] shadow-sm transition-colors duration-300">
      <h3 className="text-lg font-bold mb-2 dark:text-white">Consumption Breakdown</h3>
      <p className="text-sm text-gray-400 mb-6">Usage by category</p>
      
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
