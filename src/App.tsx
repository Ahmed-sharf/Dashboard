import { useState, useMemo, useEffect } from 'react';
import { Search, Bell, Plus, LayoutGrid, Sofa, Utensils, BedDouble, Bath, X, Zap, Sun, Wallet, Shield, Lock, Home, LogOut, User, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'sonner';
import Sidebar from './components/Sidebar';
import DeviceCard from './components/DeviceCard';
import EnergyChart from './components/EnergyChart';
import EnergyBreakdown from './components/EnergyBreakdown';
import EnergyPage from './components/EnergyPage';
import SecurityPage from './components/SecurityPage';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import { Device, Room, Stat, DeviceType } from './types';
import StatCard from './components/StatCard';

const INITIAL_DEVICES: Device[] = [
  { id: '1', name: 'Main Light', type: 'light', room: 'Living Room', isOn: true, consumption: 45 },
  { id: '2', name: 'Smart TV', type: 'tv', room: 'Living Room', isOn: false, consumption: 120 },
  { id: '3', name: 'Air Conditioner', type: 'ac', room: 'Bedroom', isOn: true, value: 22, consumption: 1800 },
  { id: '4', name: 'Sound System', type: 'speaker', room: 'Living Room', isOn: true, consumption: 60 },
  { id: '5', name: 'Smart Fridge', type: 'fridge', room: 'Kitchen', isOn: true, consumption: 150 },
  { id: '6', name: 'EV Charger', type: 'ev-charger', room: 'Garage', isOn: false, consumption: 7200 },
  { id: '7', name: 'Wi-Fi Router', type: 'wifi', room: 'Office', isOn: true, consumption: 15 },
  { id: '8', name: 'Washing Machine', type: 'washer', room: 'Laundry', isOn: false, consumption: 500 },
];

const ROOMS: Room[] = [
  { id: 'all', name: 'All Rooms', icon: 'LayoutGrid' },
  { id: 'living', name: 'Living Room', icon: 'Sofa' },
  { id: 'bedroom', name: 'Bedroom', icon: 'BedDouble' },
  { id: 'kitchen', name: 'Kitchen', icon: 'Utensils' },
  { id: 'bathroom', name: 'Bathroom', icon: 'Bath' },
];

const StatCardLocal = ({ stat }: { stat: any; key?: any }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'energy': return <Zap className="w-6 h-6" />;
      case 'temp': return <Sun className="w-6 h-6" />;
      case 'humidity': return <Wallet className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
        stat.label === 'Solar Power' ? 'bg-amber-50 text-amber-500 dark:bg-amber-500/10' : 
        stat.label === 'Daily Cost' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-black dark:bg-white text-white dark:text-black'
      }`}>
        {getIcon(stat.icon)}
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold dark:text-white">{stat.value}</span>
          <span className="text-sm text-gray-400 font-medium">{stat.unit}</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<string | null>(localStorage.getItem('smartly_user'));
  const [activeView, setActiveView] = useState('dashboard');
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [selectedRoom, setSelectedRoom] = useState('All Rooms');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [securityMode, setSecurityMode] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [newDevice, setNewDevice] = useState<{ name: string; type: DeviceType; room: string; consumption: number }>({
    name: '',
    type: 'light',
    room: 'Living Room',
    consumption: 50,
  });

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('smartly_user', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('smartly_user');
    toast.info('Logged out successfully');
  };

  const [stats, setStats] = useState<{ label: string; value: string; unit: string; icon: string }[]>([
    { label: 'Current Load', value: '2.1', unit: 'kW', icon: 'energy' },
    { label: 'Solar Power', value: '4.8', unit: 'kW', icon: 'temp' },
    { label: 'Daily Cost', value: '3.45', unit: '$', icon: 'humidity' },
  ]);

  const totalConsumption = useMemo(() => {
    return devices.reduce((acc, d) => acc + (d.isOn ? d.consumption : 0), 0) / 1000;
  }, [devices]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => prev.map(stat => {
        if (stat.label === 'Current Load') {
          return { ...stat, value: totalConsumption.toFixed(2) };
        }
        if (stat.label === 'Solar Power') {
          const base = 4.8;
          const noise = (Math.random() - 0.5) * 0.5;
          return { ...stat, value: Math.max(0, base + noise).toFixed(1) };
        }
        if (stat.label === 'Daily Cost') {
          const rate = 0.15;
          const currentCost = parseFloat(stat.value);
          const incremental = (totalConsumption * rate) / 3600;
          return { ...stat, value: (currentCost + incremental).toFixed(2) };
        }
        return stat;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [totalConsumption]);

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesRoom = selectedRoom === 'All Rooms' || device.room === selectedRoom;
      const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRoom && matchesSearch;
    });
  }, [devices, selectedRoom, searchQuery]);

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        const newState = !d.isOn;
        toast.success(`${d.name} turned ${newState ? 'on' : 'off'}`);
        return { ...d, isOn: newState };
      }
      return d;
    }));
  };

  const updateDeviceValue = (id: string, value: number) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, value } : d));
  };

  const handleAddDevice = () => {
    if (!newDevice.name) return;
    const device: Device = {
      id: Math.random().toString(36).substr(2, 9),
      ...newDevice,
      isOn: false,
    };
    setDevices(prev => [...prev, device]);
    setIsAddModalOpen(false);
    setNewDevice({ name: '', type: 'light', room: 'Living Room', consumption: 50 });
    toast.success(`${device.name} added successfully`);
  };

  const getRoomIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sofa': return <Sofa className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'BedDouble': return <BedDouble className="w-5 h-5" />;
      case 'Bath': return <Bath className="w-5 h-5" />;
      default: return <LayoutGrid className="w-5 h-5" />;
    }
  };

  const handleSceneClick = (sceneName: string) => {
    toast.success(`Scene "${sceneName}" activated`);
    
    setDevices(prev => prev.map(device => {
      if (sceneName === 'Movie Night') {
        if (device.type === 'tv') return { ...device, isOn: true };
        if (device.type === 'light' && device.room === 'Living Room') return { ...device, isOn: true, value: 20 };
        if (device.type === 'speaker') return { ...device, isOn: true, value: 40 };
      }
      if (sceneName === 'Leaving Home') {
        if (device.type !== 'security' && device.type !== 'fridge' && device.type !== 'wifi') {
          return { ...device, isOn: false };
        }
      }
      if (sceneName === 'Good Night') {
        if (device.room !== 'Bedroom' && device.type !== 'security' && device.type !== 'fridge' && device.type !== 'wifi') {
          return { ...device, isOn: false };
        }
        if (device.type === 'light' && device.room === 'Bedroom') return { ...device, isOn: true, value: 10 };
      }
      if (sceneName === 'Arriving') {
        if (device.type === 'light' && (device.room === 'Living Room' || device.room === 'Garage')) {
          return { ...device, isOn: true, value: 80 };
        }
        if (device.type === 'ac') return { ...device, isOn: true, value: 22 };
      }
      return device;
    }));

    if (sceneName === 'Leaving Home') setSecurityMode('Away');
    if (sceneName === 'Good Night') setSecurityMode('Night');
    if (sceneName === 'Arriving') setSecurityMode('Home');
  };

  if (!user) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'energy':
        return <EnergyPage />;
      case 'security':
        return <SecurityPage securityMode={securityMode} setSecurityMode={setSecurityMode} />;
      case 'settings':
        return (
          <SettingsPage 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode} 
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
          />
        );
      default:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Row: Stats & Weather */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <StatCardLocal key={stat.label} stat={stat} />
                ))}
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-500/20 flex flex-col justify-between min-h-[160px]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/80 text-sm font-medium">Cairo, Egypt</p>
                    <h3 className="text-2xl font-bold">Sunny</h3>
                  </div>
                  <Sun className="w-10 h-10 text-amber-300" />
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold">28°</span>
                  <p className="text-white/60 text-xs mt-1">H: 30° L: 22° • Humidity: 45%</p>
                </div>
              </div>
            </div>

            {/* Quick Scenes & Security Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Quick Scenes</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Movie Night', icon: '🎬', color: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:border-purple-500/20' },
                    { name: 'Leaving Home', icon: '🚗', color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20' },
                    { name: 'Good Night', icon: '🌙', color: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20' },
                    { name: 'Arriving', icon: '🏠', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' },
                  ].map((scene) => (
                    <button
                      key={scene.name}
                      onClick={() => handleSceneClick(scene.name)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all hover:scale-105 active:scale-95 ${scene.color}`}
                    >
                      <span className="text-3xl">{scene.icon}</span>
                      <span className="font-bold text-sm">{scene.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h2 className="text-xl font-bold mb-6 dark:text-white">Security Mode</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Disarmed', icon: Lock, color: 'text-red-600 bg-red-50 border-red-100 dark:bg-red-500/10 dark:border-red-500/20' },
                    { name: 'Home', icon: Shield, color: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' },
                    { name: 'Away', icon: Shield, color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20' },
                    { name: 'Night', icon: Lock, color: 'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20' },
                  ].map((mode) => (
                    <button
                      key={mode.name}
                      onClick={() => {
                        setSecurityMode(mode.name);
                        toast.success(`Security mode set to ${mode.name}`);
                      }}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                        securityMode === mode.name ? mode.color : 'border-gray-50 dark:border-zinc-800 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      <mode.icon className="w-4 h-4" />
                      <span className="font-bold text-xs">{mode.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h3 className="text-xl font-bold dark:text-white">Energy Distribution</h3>
                    <div className="flex gap-4 text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-black dark:bg-white"></div> Grid</span>
                      <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Solar</span>
                    </div>
                  </div>
                  <EnergyChart />
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold dark:text-white">Connected Devices</h2>
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto custom-scrollbar">
                      {ROOMS.map((room) => (
                        <button
                          key={room.id}
                          onClick={() => setSelectedRoom(room.name)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                            selectedRoom === room.name
                              ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10'
                              : 'bg-white dark:bg-zinc-900 text-gray-400 border border-gray-100 dark:border-zinc-800 hover:border-gray-200'
                          }`}
                        >
                          {room.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filteredDevices.map((device) => (
                        <DeviceCard 
                          key={device.id} 
                          device={device} 
                          onToggle={toggleDevice}
                          onValueChange={updateDeviceValue}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Sidebar Analytics */}
              <div className="space-y-8">
                <EnergyBreakdown />
                
                <div className="bg-black dark:bg-zinc-900 p-8 rounded-3xl text-white relative overflow-hidden group border border-transparent dark:border-zinc-800">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Smart Saving</h3>
                    <p className="text-white/60 text-sm mb-6">You can save up to $12/month by optimizing your HVAC schedule.</p>
                    <button className="px-6 py-3 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-2xl font-bold text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all">
                      Optimize Now
                    </button>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 dark:text-white">Grid Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
                      <span className="text-sm font-medium dark:text-gray-300">Frequency</span>
                      <span className="text-sm font-bold dark:text-white">50.02 Hz</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
                      <span className="text-sm font-medium dark:text-gray-300">Voltage</span>
                      <span className="text-sm font-bold dark:text-white">230.4 V</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-2xl">
                      <span className="text-sm font-medium">Status</span>
                      <span className="text-sm font-bold">Stable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    };

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-white dark' : 'bg-gray-50/50 text-black'}`}>
      <Toaster position="top-right" richColors />
      
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 left-0 z-[70] transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar activeView={activeView} onViewChange={(view) => { setActiveView(view); setIsSidebarOpen(false); }} onLogout={handleLogout} />
      </div>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800"
            >
              <Menu className="w-6 h-6 dark:text-white" />
            </button>
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
              <Home className="text-white dark:text-black w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight dark:text-white">Smartly</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-900 shadow-sm">
              <img src="https://picsum.photos/seed/user/100" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight capitalize dark:text-white">{activeView === 'dashboard' ? 'Smart Home' : activeView}</h1>
              <p className="text-gray-400 mt-1">
                {activeView === 'dashboard' 
                  ? `Welcome back, ${user} • ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}` 
                  : `Manage your ${activeView} settings`}
              </p>
            </div>
            {activeView === 'dashboard' && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-widest">System Secure</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {activeView === 'dashboard' && (
              <>
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search devices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all dark:text-white"
                  />
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl hover:bg-black/90 transition-colors shadow-lg shadow-black/10"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-bold text-sm">Add Device</span>
                </button>
              </>
            )}
            <button className="p-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all relative">
              <Bell className="w-5 h-5 dark:text-white" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            </button>
          </div>
        </header>

        {/* Mobile View Title (Only on mobile) */}
        <div className="lg:hidden mb-8">
          <h1 className="text-3xl font-bold tracking-tight capitalize dark:text-white">{activeView === 'dashboard' ? 'Smart Home' : activeView}</h1>
          <p className="text-gray-400 mt-1">
            {activeView === 'dashboard' 
              ? `Welcome back, ${user}` 
              : `Manage your ${activeView}`}
          </p>
        </div>

        <div className="flex-1">
          {renderContent()}
        </div>
      </main>

      {/* Add Device Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Add New Device</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Device Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Living Room Lamp"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Type</label>
                    <select
                      value={newDevice.type}
                      onChange={(e) => setNewDevice(prev => ({ ...prev, type: e.target.value as DeviceType }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                    >
                      <option value="light">Light</option>
                      <option value="tv">TV</option>
                      <option value="ac">AC</option>
                      <option value="fridge">Fridge</option>
                      <option value="washer">Washer</option>
                      <option value="ev-charger">EV Charger</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Consumption (W)</label>
                    <input
                      type="number"
                      value={newDevice.consumption}
                      onChange={(e) => setNewDevice(prev => ({ ...prev, consumption: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Room</label>
                  <select
                    value={newDevice.room}
                    onChange={(e) => setNewDevice(prev => ({ ...prev, room: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                  >
                    {ROOMS.filter(r => r.id !== 'all').map(room => (
                      <option key={room.id} value={room.name}>{room.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddDevice}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/90 transition-all shadow-lg shadow-black/10"
                >
                  Add Device
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
