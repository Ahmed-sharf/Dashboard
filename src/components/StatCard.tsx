import { Thermometer, Droplets, Zap } from 'lucide-react';
import { Stat } from '../types';

const iconMap = {
  temp: Thermometer,
  humidity: Droplets,
  energy: Zap,
};

export default function StatCard({ stat }: { stat: Stat; key?: string | number }) {
  const Icon = iconMap[stat.icon as keyof typeof iconMap] || Zap;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
        <Icon className="w-6 h-6 text-black" />
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{stat.value}</span>
          <span className="text-sm text-gray-400 font-medium">{stat.unit}</span>
        </div>
      </div>
    </div>
  );
}
