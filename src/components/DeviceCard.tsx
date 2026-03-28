import { Lightbulb, Tv, ShieldCheck, Speaker, Wind, Wifi, MoreVertical, Minus, Plus, Zap, Refrigerator, WashingMachine, Car } from 'lucide-react';
import { motion } from 'motion/react';
import { Device } from '../types';

const iconMap = {
  light: Lightbulb,
  tv: Tv,
  security: ShieldCheck,
  speaker: Speaker,
  ac: Wind,
  wifi: Wifi,
  fridge: Refrigerator,
  washer: WashingMachine,
  'ev-charger': Car,
};

export default function DeviceCard({ device, onToggle, onValueChange }: { device: Device; onToggle: (id: string) => void; onValueChange?: (id: string, value: number) => void; key?: string | number }) {
  const Icon = iconMap[device.type] || Zap;

  const handleValueChange = (delta: number) => {
    if (onValueChange && device.value !== undefined) {
      onValueChange(device.id, device.value + delta);
    }
  };

  return (
    <motion.div
      layout
      className={`p-5 rounded-3xl border transition-all duration-300 ${
        device.isOn 
          ? 'bg-black border-black text-white shadow-xl shadow-black/10' 
          : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-black dark:text-white hover:border-gray-200 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex justify-between items-start mb-8">
        <div className={`p-3 rounded-2xl ${device.isOn ? 'bg-white/10' : 'bg-gray-50 dark:bg-zinc-800'}`}>
          <Icon className={`w-6 h-6 ${device.isOn ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${device.isOn ? 'bg-white/10 text-white' : 'bg-gray-50 dark:bg-zinc-800 text-gray-400'}`}>
          <Zap className="w-3 h-3" />
          {device.isOn ? device.consumption : 0}W
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-lg">{device.name}</h3>
        <p className={`text-sm ${device.isOn ? 'text-white/60' : 'text-gray-400'}`}>
          {device.room}
        </p>
      </div>

      {device.type === 'ac' && device.isOn && device.value !== undefined && (
        <div className="mt-6 flex items-center justify-between bg-white/10 rounded-2xl p-3">
          <button 
            onClick={() => handleValueChange(-1)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="text-center">
            <span className="text-xl font-bold">{device.value}</span>
            <span className="text-xs ml-1 opacity-60">°C</span>
          </div>
          <button 
            onClick={() => handleValueChange(1)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm font-medium">
          {device.isOn ? 'Active' : 'Inactive'}
        </span>
        <button
          onClick={() => onToggle(device.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            device.isOn ? 'bg-white' : 'bg-gray-200 dark:bg-zinc-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
              device.isOn ? 'translate-x-6 bg-black' : 'translate-x-1 bg-white'
            }`}
          />
        </button>
      </div>
    </motion.div>
  );
}
