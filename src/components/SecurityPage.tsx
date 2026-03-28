import { useState } from 'react';
import { Shield, Lock, Eye, Bell, AlertTriangle, CheckCircle2, MoreHorizontal, ShieldCheck, Unlock, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const cameras = [
  { id: 1, name: 'Main Entrance', status: 'Live', url: 'https://picsum.photos/seed/entrance/800/450' },
  { id: 2, name: 'Backyard', status: 'Live', url: 'https://picsum.photos/seed/backyard/800/450' },
  { id: 3, name: 'Garage', status: 'Live', url: 'https://picsum.photos/seed/garage/800/450' },
  { id: 4, name: 'Living Room', status: 'Live', url: 'https://picsum.photos/seed/livingroom/800/450' },
];

interface SecurityPageProps {
  securityMode: string;
  setSecurityMode: (mode: string) => void;
}

export default function SecurityPage({ securityMode, setSecurityMode }: SecurityPageProps) {
  const [locks, setLocks] = useState([
    { id: 1, name: 'Front Door', status: 'Locked', battery: '85%' },
    { id: 2, name: 'Garage Door', status: 'Locked', battery: '92%' },
    { id: 3, name: 'Back Door', status: 'Unlocked', battery: '78%' },
  ]);

  const [activityLogs, setActivityLogs] = useState([
    { id: 1, event: 'Main Door Unlocked', time: '10:24 AM', user: 'Ahmed Sharf', status: 'success' },
    { id: 2, event: 'Motion Detected', time: '09:15 AM', user: 'Backyard Camera', status: 'warning' },
    { id: 3, event: 'System Armed', time: '08:00 AM', user: 'System', status: 'success' },
    { id: 4, event: 'Window Opened', time: '07:45 AM', user: 'Bedroom 1', status: 'info' },
  ]);

  const toggleLock = (id: number) => {
    setLocks(prev => prev.map(lock => {
      if (lock.id === id) {
        const newStatus = lock.status === 'Locked' ? 'Unlocked' : 'Locked';
        toast.success(`${lock.name} ${newStatus}`);
        
        // Add to log
        const newLog = {
          id: Date.now(),
          event: `${lock.name} ${newStatus}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: 'Ahmed Sharf',
          status: newStatus === 'Locked' ? 'success' : 'info'
        };
        setActivityLogs(prevLogs => [newLog, ...prevLogs]);
        
        return { ...lock, status: newStatus };
      }
      return lock;
    }));
  };

  const handleModeChange = (mode: string) => {
    setSecurityMode(mode);
    toast.success(`Security mode changed to ${mode}`);
    
    const newLog = {
      id: Date.now(),
      event: `System ${mode}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: 'Ahmed Sharf',
      status: mode === 'Disarmed' ? 'warning' : 'success'
    };
    setActivityLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const handlePanic = () => {
    toast.error('PANIC ALERT ACTIVATED!', {
      description: 'Emergency services have been notified.',
      duration: 5000,
    });
    
    const newLog = {
      id: Date.now(),
      event: 'PANIC BUTTON PRESSED',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: 'Ahmed Sharf',
      status: 'warning'
    };
    setActivityLogs(prevLogs => [newLog, ...prevLogs]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 lg:pb-0">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">Security Center</h1>
          <p className="text-gray-400 mt-1">Protecting your home and privacy</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm ${
            securityMode === 'Disarmed' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          }`}>
            <ShieldCheck className="w-4 h-4" />
            {securityMode === 'Disarmed' ? 'System Disarmed' : 'System Secure'}
          </div>
          <button 
            onClick={handlePanic}
            className="flex-1 md:flex-none px-6 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95"
          >
            Panic Button
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Camera Feeds */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold dark:text-white">Live Cameras</h2>
            <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cameras.map((camera) => (
              <div key={camera.id} className="group relative aspect-video bg-gray-100 dark:bg-zinc-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm">
                <img 
                  src={camera.url} 
                  alt={camera.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  {camera.status}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold text-sm">{camera.name}</p>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toast.info(`Viewing ${camera.name} full screen`)}
                    className="p-2 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/40"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toast.success(`Recording started for ${camera.name}`)}
                    className="p-2 bg-red-500/80 backdrop-blur-md text-white rounded-xl hover:bg-red-600"
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Smart Locks */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold dark:text-white">Smart Locks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {locks.map((lock) => (
                <div key={lock.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between gap-4 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl ${lock.status === 'Locked' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                      {lock.status === 'Locked' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Battery: {lock.battery}</span>
                  </div>
                  <div>
                    <h3 className="font-bold dark:text-white">{lock.name}</h3>
                    <p className={`text-xs font-medium ${lock.status === 'Locked' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{lock.status}</p>
                  </div>
                  <button 
                    onClick={() => toggleLock(lock.id)}
                    className={`w-full py-3 rounded-2xl font-bold text-xs transition-all ${
                      lock.status === 'Locked' ? 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90'
                    }`}
                  >
                    {lock.status === 'Locked' ? 'Unlock' : 'Lock'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Modes & Logs */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
            <h2 className="text-lg font-bold mb-6 dark:text-white">Security Modes</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Disarmed', icon: Shield, color: 'text-red-600 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20' },
                { id: 'Home', icon: Shield, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' },
                { id: 'Away', icon: Shield, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20' },
                { id: 'Night', icon: Lock, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    securityMode === mode.id ? mode.color : 'border-gray-50 dark:border-zinc-800 text-gray-400 hover:border-gray-200 dark:hover:border-zinc-700'
                  }`}
                >
                  <mode.icon className="w-5 h-5" />
                  <span className="font-bold text-xs">{mode.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
            <h2 className="text-lg font-bold mb-6 dark:text-white">Emergency Contacts</h2>
            <div className="space-y-4">
              {[
                { name: 'Local Police', phone: '911', type: 'Emergency' },
                { name: 'Ahmed (Owner)', phone: '+20 123 456 789', type: 'Primary' },
                { name: 'Sara (Wife)', phone: '+20 987 654 321', type: 'Secondary' },
              ].map((contact) => (
                <div key={contact.name} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors">
                  <div>
                    <p className="text-sm font-bold dark:text-white">{contact.name}</p>
                    <p className="text-xs text-gray-400">{contact.phone}</p>
                  </div>
                  <button 
                    onClick={() => toast.success(`Calling ${contact.name}...`)}
                    className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold dark:text-white">Activity Log</h2>
              <button 
                onClick={() => setActivityLogs([])}
                className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white"
              >
                Clear
              </button>
            </div>
            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {activityLogs.length > 0 ? activityLogs.map((log) => (
                <div key={log.id} className="flex gap-4">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    log.status === 'success' ? 'bg-emerald-500' : 
                    log.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold leading-none dark:text-white">{log.event}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{log.time} • {log.user}</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-400 text-sm py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
