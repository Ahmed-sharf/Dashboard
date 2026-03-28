export type DeviceType = 'light' | 'ac' | 'tv' | 'security' | 'speaker' | 'wifi' | 'fridge' | 'washer' | 'ev-charger';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: string;
  isOn: boolean;
  value?: number; // e.g., brightness or temperature
  consumption: number; // Current consumption in Watts
}

export interface Room {
  id: string;
  name: string;
  icon: string;
}

export interface Stat {
  label: string;
  value: string;
  unit: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
}
