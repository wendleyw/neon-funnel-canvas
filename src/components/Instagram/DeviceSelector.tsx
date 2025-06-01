
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';

export interface DeviceOption {
  id: string;
  name: string;
  type: 'android' | 'ios';
  width: number;
  height: number;
  borderRadius: string;
  statusBarHeight: number;
}

export const DEVICE_OPTIONS: DeviceOption[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    type: 'ios',
    width: 320,
    height: 692,
    borderRadius: 'rounded-[3rem]',
    statusBarHeight: 44
  },
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    type: 'ios',
    width: 350,
    height: 760,
    borderRadius: 'rounded-[3rem]',
    statusBarHeight: 44
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    type: 'android',
    width: 330,
    height: 720,
    borderRadius: 'rounded-[2.5rem]',
    statusBarHeight: 32
  },
  {
    id: 'pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    type: 'android',
    width: 325,
    height: 710,
    borderRadius: 'rounded-[2.5rem]',
    statusBarHeight: 32
  }
];

interface DeviceSelectorProps {
  selectedDevice: DeviceOption;
  onDeviceChange: (device: DeviceOption) => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  selectedDevice,
  onDeviceChange
}) => {
  return (
    <Card className="p-4 bg-gray-800 border-gray-700">
      <h4 className="text-white font-medium mb-3">Select Device</h4>
      <Select 
        value={selectedDevice.id} 
        onValueChange={(value) => {
          const device = DEVICE_OPTIONS.find(d => d.id === value);
          if (device) onDeviceChange(device);
        }}
      >
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          {DEVICE_OPTIONS.map((device) => (
            <SelectItem 
              key={device.id} 
              value={device.id}
              className="text-white hover:bg-gray-600"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  device.type === 'ios' ? 'bg-blue-500' : 'bg-green-500'
                }`}></span>
                {device.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
};
