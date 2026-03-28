import { useState } from 'react';
import { Zap, Sun, Battery, ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import EnergyBreakdown from './EnergyBreakdown';
import { toast } from 'sonner';

const hourlyData = [
  { time: '00:00', usage: 1.2, solar: 0 },
  { time: '04:00', usage: 0.8, solar: 0 },
  { time: '08:00', usage: 2.5, solar: 1.5 },
  { time: '12:00', usage: 1.5, solar: 6.2 },
  { time: '16:00', usage: 3.2, solar: 3.8 },
  { time: '20:00', usage: 4.8, solar: 0.5 },
  { time: '23:59', usage: 2.1, solar: 0 },
];

const weeklyData = [
  { day: 'Mon', usage: 12, solar: 8 },
  { day: 'Tue', usage: 15, solar: 10 },
  { day: 'Wed', usage: 10, solar: 12 },
  { day: 'Thu', usage: 18, solar: 7 },
  { day: 'Fri', usage: 14, solar: 9 },
  { day: 'Sat', usage: 22, solar: 5 },
  { day: 'Sun', usage: 16, solar: 11 },
];

export default function EnergyPage() {
  const [timeRange, setTimeRange] = useState('Live');
  const [tips, setTips] = useState([
    { id: 1, title: 'Peak Hours Alert', text: 'Electricity rates are higher between 6 PM and 9 PM. Consider delaying heavy loads.', type: 'alert', color: 'bg-amber-50 border-amber-100 text-amber-800' },
    { id: 2, title: 'Solar Optimization', text: 'Your solar panels are at peak production. Good time to charge your EV.', type: 'info', color: 'bg-blue-50 border-blue-100 text-blue-800' },
  ]);

  const dismissTip = (id: number) => {
    setTips(prev => prev.filter(tip => tip.id !== id));
    toast.success('Tip dismissed');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">Energy Analytics</h1>
          <p className="text-gray-400 mt-1">Real-time power monitoring and efficiency</p>
        </div>
        <div className="flex bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-1 rounded-2xl shadow-sm overflow-x-auto w-full md:w-auto custom-scrollbar">
          {['Live', 'Day', 'Week', 'Month'].map((range) => (
            <button 
              key={range}
              onClick={() => {
                setTimeRange(range);
                toast.info(`Viewing ${range} data`);
              }}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                timeRange === range 
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10' 
                  : 'text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black dark:bg-zinc-900 p-6 rounded-3xl text-white border border-transparent dark:border-zinc-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Zap className="w-6 h-6" />
            </div>
            <span className="flex items-center text-emerald-400 text-xs font-bold">
              <ArrowDownRight className="w-3 h-3 mr-1" /> 12%
            </span>
          </div>
          <p className="text-white/60 text-sm font-medium">Total Consumption</p>
          <h2 className="text-3xl font-bold mt-1">245.8 <span className="text-sm font-normal opacity-60">kWh</span></h2>
        </div>

        <div className="bg-amber-500 p-6 rounded-3xl text-white shadow-lg shadow-amber-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Sun className="w-6 h-6" />
            </div>
            <span className="flex items-center text-white text-xs font-bold">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 24%
            </span>
          </div>
          <p className="text-white/80 text-sm font-medium">Solar Generation</p>
          <h2 className="text-3xl font-bold mt-1">182.4 <span className="text-sm font-normal opacity-80">kWh</span></h2>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl">
              <Battery className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">92%</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">Battery Storage</p>
          <h2 className="text-3xl font-bold mt-1 dark:text-white">13.2 <span className="text-sm font-normal text-gray-400">kWh</span></h2>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">Stable</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">Grid Efficiency</p>
          <h2 className="text-3xl font-bold mt-1 dark:text-white">98.4 <span className="text-sm font-normal text-gray-400">%</span></h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold dark:text-white">Power Flow ({timeRange})</h3>
              <div className="flex gap-4 text-sm font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-black dark:bg-white"></div>
                  <span className="dark:text-white">Usage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="dark:text-white">Solar</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="usage" stroke="#000" strokeWidth={3} fill="url(#usageGrad)" />
                  <Area type="monotone" dataKey="solar" stroke="#f59e0b" strokeWidth={3} fill="url(#solarGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xl font-bold mb-8 dark:text-white">Appliance Efficiency</h3>
            <div className="space-y-6">
              {[
                { name: 'Refrigerator', usage: '1.2 kWh/day', rating: 'A++', color: 'bg-emerald-500' },
                { name: 'Air Conditioner', usage: '4.5 kWh/day', rating: 'A', color: 'bg-emerald-400' },
                { name: 'Washing Machine', usage: '0.8 kWh/cycle', rating: 'B', color: 'bg-amber-400' },
                { name: 'EV Charger', usage: '12.4 kWh/charge', rating: 'A+', color: 'bg-emerald-450' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${item.color}`}></div>
                    <div>
                      <p className="font-bold dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.usage}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-gray-50 dark:bg-zinc-800 rounded-lg text-xs font-bold dark:text-white">
                    Rating: {item.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <EnergyBreakdown />
          
          <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Cost Prediction</h3>
              <p className="text-emerald-100 text-sm mb-6">Based on your current usage, your monthly bill is estimated at:</p>
              <div className="text-4xl font-bold mb-2">$142.50</div>
              <div className="flex items-center gap-2 text-emerald-200 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>4% lower than last month</span>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold mb-6 dark:text-white">Energy Tips</h3>
            <div className="space-y-4">
              {tips.length > 0 ? tips.map((tip) => (
                <div key={tip.id} className={`p-4 rounded-2xl border relative group ${tip.color}`}>
                  <button 
                    onClick={() => dismissTip(tip.id)}
                    className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5 rounded-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p className="text-xs font-bold mb-1">{tip.title}</p>
                  <p className="text-xs opacity-80">{tip.text}</p>
                </div>
              )) : (
                <p className="text-center text-gray-400 text-sm py-4">All caught up!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold dark:text-white">Weekly Performance</h3>
          <button 
            onClick={() => toast.info('Opening detailed history')}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Last 7 Days
          </button>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="usage" fill="#000" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="solar" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
