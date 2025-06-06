import React, { useState } from 'react';
import { Connection } from '../../../types/funnel';
import { Button } from '@/features/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/features/shared/ui/popover';
import { Trash2, Palette } from 'lucide-react';

interface ConnectionEditorProps {
  connection: Connection;
  position: { x: number; y: number };
  onUpdate: (connectionId: string, updates: Partial<Connection>) => void;
  onDelete: (connectionId: string) => void;
  onClose: () => void;
}

const predefinedColors = [
  { name: 'Success', value: '#10B981', type: 'success' },
  { name: 'Failure', value: '#EF4444', type: 'failure' },
  { name: 'Conditional', value: '#F59E0B', type: 'conditional' },
  { name: 'Blue', value: '#3B82F6', type: 'custom' },
  { name: 'Purple', value: '#8B5CF6', type: 'custom' },
  { name: 'Pink', value: '#EC4899', type: 'custom' },
  { name: 'Light Green', value: '#22C55E', type: 'custom' },
  { name: 'Orange', value: '#F97316', type: 'custom' },
];

export const ConnectionEditor: React.FC<ConnectionEditorProps> = ({
  connection,
  position,
  onUpdate,
  onDelete,
  onClose
}) => {
  const [customColor, setCustomColor] = useState(connection.customColor || '#6B7280');

  const getCurrentColor = () => {
    if (connection.customColor) return connection.customColor;
    
    switch (connection.type) {
      case 'success': return '#10B981';
      case 'failure': return '#EF4444';
      case 'conditional': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const handleColorSelect = (color: string, type: string) => {
    if (type === 'custom') {
      onUpdate(connection.id, { 
        customColor: color, 
        type: connection.type 
      });
    } else {
      onUpdate(connection.id, { 
        type: type as Connection['type'], 
        customColor: undefined 
      });
    }
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onUpdate(connection.id, { 
      customColor: color,
      type: connection.type
    });
  };

  const handleDelete = () => {
    onDelete(connection.id);
    onClose();
  };

  return (
    <div
      className="fixed bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl p-6 min-w-[320px] pointer-events-auto"
      style={{
        left: position.x - 160,
        top: position.y - 100,
        zIndex: 10000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Edit Connection</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded"
        >
          ×
        </button>
      </div>

      {/* Current color preview with neon effect */}
      <div className="mb-6">
        <label className="text-sm text-gray-300 mb-2 block font-medium">Preview</label>
        <div className="flex items-center gap-3">
          <div
            className="w-20 h-3 rounded-full transition-all duration-300 animate-pulse shadow-lg"
            style={{ 
              backgroundColor: getCurrentColor(),
              boxShadow: `0 0 15px ${getCurrentColor()}`
            }}
          />
          <span className="text-xs text-cyan-400">
            ⚡ Neon Active (Global Control)
          </span>
        </div>
      </div>

      {/* Predefined colors */}
      <div className="mb-4">
        <label className="text-sm text-gray-300 mb-3 block font-medium">Predefined Colors</label>
        <div className="grid grid-cols-4 gap-2">
          {predefinedColors.map((color) => (
            <button
              key={color.value}
              className={`group relative w-full h-10 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                getCurrentColor() === color.value ? 'border-white shadow-lg' : 'border-gray-600'
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorSelect(color.value, color.type)}
              title={color.name}
            >
              <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              {getCurrentColor() === color.value && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom color selector */}
      <div className="mb-6">
        <label className="text-sm text-gray-300 mb-2 block font-medium">Custom Color</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-10 border-gray-600 bg-gray-800 hover:bg-gray-700 text-white"
            >
              <div className="flex items-center gap-2">
                <Palette size={16} />
                <div
                  className="w-4 h-4 rounded border border-gray-600"
                  style={{ backgroundColor: customColor }}
                />
                <span className="text-sm">{customColor}</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 bg-gray-800 border-gray-600">
            <div className="space-y-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-full h-10 rounded border-0 cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="#000000"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Global Animation Info */}
      <div className="mb-6 p-4 bg-cyan-900/20 border border-cyan-700/30 rounded-lg">
        <div className="text-sm text-cyan-300 font-medium mb-1">
          ⚡ Neon Animation
        </div>
        <p className="text-xs text-cyan-400">
          Animations are controlled globally via the toggle in the top toolbar. All connections have neon effects enabled by default.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleDelete}
          variant="destructive"
          size="sm"
          className="flex-1"
        >
          <Trash2 size={14} className="mr-1" />
          Delete
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          size="sm"
          className="flex-1 border-gray-600 bg-gray-800 hover:bg-gray-700 text-white"
        >
          Close
        </Button>
      </div>
    </div>
  );
};
