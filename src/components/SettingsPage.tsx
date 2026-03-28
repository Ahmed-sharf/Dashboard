import { User, Bell, Shield, Smartphone, Globe, Cloud, HelpCircle, ChevronRight, LogOut, Cpu, Wifi, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsPageProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
}

export default function SettingsPage({ 
  isDarkMode, 
  setIsDarkMode, 
  notificationsEnabled, 
  setNotificationsEnabled 
}: SettingsPageProps) {

  const handleToggle = (label: string) => {
    if (label === 'Dark Mode') {
      setIsDarkMode(!isDarkMode);
      toast.success(`Dark mode ${!isDarkMode ? 'enabled' : 'disabled'}`);
    } else if (label === 'Notifications') {
      setNotificationsEnabled(!notificationsEnabled);
      toast.success(`Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
    } else {
      toast.info(`${label} setting updated`);
    }
  };

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Information', desc: 'Ahmed Sharf • ahmdshrfshrfahmd@gmail.com' },
        { 
          icon: Bell, 
          label: 'Notifications', 
          desc: 'Manage alerts and push notifications', 
          toggle: true, 
          active: notificationsEnabled 
        },
        { icon: Shield, label: 'Privacy & Security', desc: 'Password and two-factor auth' },
      ]
    },
    {
      title: 'System',
      items: [
        { icon: Smartphone, label: 'Connected Devices', desc: '4 active devices' },
        { icon: Globe, label: 'Network Settings', desc: 'Wi-Fi: Home_5G • Stable' },
        { icon: Cloud, label: 'Cloud Storage', desc: '85% of 50GB used' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: isDarkMode ? Moon : Sun, 
          label: 'Dark Mode', 
          desc: 'Switch between light and dark themes', 
          toggle: true, 
          active: isDarkMode 
        },
        { icon: Globe, label: 'Language', desc: 'English (US)', select: true },
      ]
    },
    {
      title: 'System Health',
      items: [
        { icon: Cpu, label: 'CPU Usage', desc: '12% - Normal', status: 'normal' },
        { icon: Wifi, label: 'Network Latency', desc: '24ms - Stable', status: 'stable' },
        { icon: Smartphone, label: 'Firmware', desc: 'v2.4.0 - Up to date', status: 'latest' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and system preferences</p>
      </header>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-900 shadow-lg">
            <img src="https://picsum.photos/seed/user/200" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold dark:text-white">Ahmed Sharf</h2>
            <p className="text-gray-400">ahmdshrfshrfahmd@gmail.com</p>
          </div>
          <button 
            onClick={() => toast.info('Profile editing coming soon!')}
            className="w-full md:w-auto px-6 py-3 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all active:scale-95"
          >
            Edit Profile
          </button>
        </div>

        <div className="p-4 space-y-8">
          {settingsGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    onClick={() => !item.toggle && toast.info(`${item.label} settings`)}
                    className="w-full flex items-center gap-5 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white dark:group-hover:bg-zinc-700 group-hover:text-black dark:group-hover:text-white transition-all">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                    {item.status && (
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'normal' || item.status === 'stable' || item.status === 'latest' 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                      }`}>
                        {item.status}
                      </div>
                    )}
                    {item.toggle && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(item.label);
                        }}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${item.active ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-zinc-700'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${item.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                    )}
                    {item.select ? (
                      <span className="text-xs font-bold text-gray-400">{item.desc}</span>
                    ) : !item.toggle && (
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black dark:group-hover:text-white transition-all" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-zinc-800/30">
          <button 
            onClick={() => toast.error('Sign out initiated')}
            className="w-full flex items-center gap-5 p-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
              <LogOut className="w-6 h-6" />
            </div>
            <span className="font-bold">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-xs text-gray-400">Smartly Dashboard v2.4.0 • Made with ❤️ for Ahmed</p>
      </div>
    </div>
  );
}
