import { Home, Settings, Shield, Zap, LayoutGrid, LogOut, User, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', id: 'dashboard' },
  { icon: Zap, label: 'Energy', id: 'energy' },
  { icon: Shield, label: 'Security', id: 'security' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeView, onViewChange, onLogout }: SidebarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex-col h-screen sticky top-0 z-50 transition-colors duration-300">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
            <Home className="text-white dark:text-black w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight dark:text-white">Smartly</span>
        </div>

        <div className="px-8 mb-8">
          <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Calendar className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{formatDate(currentTime)}</span>
            </div>
            <div className="text-xl font-bold tabular-nums tracking-tight dark:text-white">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeView === item.id
                  ? 'bg-black dark:bg-white text-white dark:text-black font-semibold shadow-lg shadow-black/10' 
                  : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-600 dark:hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeView === item.id ? '' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
          <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-900 shadow-sm">
              <img src="https://picsum.photos/seed/user/100" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate dark:text-white">Ahmed Sharf</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Premium</p>
            </div>
            <button 
              onClick={onLogout}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-zinc-800">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">System Online</span>
            </div>
            <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60 leading-relaxed">All devices are connected and operating normally.</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-t border-gray-100 dark:border-zinc-800 px-6 py-3 flex justify-between items-center z-50">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeView === item.id ? 'text-black dark:text-white scale-110' : 'text-gray-400'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
