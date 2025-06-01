
import React, { useState } from 'react';
import { Connection } from '../types/funnel';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Trash2, Palette } from 'lucide-react';

interface ConnectionEditorProps {
  connection: Connection;
  position: { x: number; y: number };
  onUpdate: (connectionId: string, updates: Partial<Connection>) => void;
  onDelete: (connectionId: string) => void;
  onClose: () => void;
}

const predefinedColors = [
  { name: 'Sucesso', value: '#10B981', type: 'success' },
  { name: 'Falha', value: '#EF4444', type: 'failure' },
  { name: 'Condicional', value: '#F59E0B', type: 'conditional' },
  { name: 'Azul', value: '#3B82F6', type: 'custom' },
  { name: 'Roxo', value: '#8B5CF6', type: 'custom' },
  { name: 'Rosa', value: '#EC4899', type: 'custom' },
  { name: 'Verde Claro', value: '#22C55E', type: 'custom' },
  { name: 'Laranja', value: '#F97316', type: 'custom' },
];

export const ConnectionEditor: React.FC<ConnectionEditorProps> = ({
  connection,
  position,
  onUpdate,
  onDelete,
  onClose
}) => {
  const [customColor, setCustomColor] = useState(connection.customColor || '#6B7280');
  const [animated, setAnimated] = useState(connection.animated || false);

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

  const handleAnimationToggle = (enabled: boolean) => {
    setAnimated(enabled);
    onUpdate(connection.id, { animated: enabled });
  };

  const handleDelete = () => {
    onDelete(connection.id);
    onClose();
  };

  return (
    <div
      className="absolute z-50 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 min-w-[320px]"
      style={{
        left: position.x - 160,
        top: position.y - 100,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Editar Conexão</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          ×
        </button>
      </div>

      {/* Preview da cor atual */}
      <div className="mb-6">
        <label className="text-sm text-gray-300 mb-2 block">Preview</label>
        <div className="flex items-center gap-3">
          <div
            className={`w-20 h-3 rounded-full ${animated ? 'animate-pulse' : ''}`}
            style={{ backgroundColor: getCurrentColor() }}
          />
          <span className="text-xs text-gray-400">
            {animated ? 'Animado' : 'Estático'}
          </span>
        </div>
      </div>

      {/* Cores predefinidas */}
      <div className="mb-4">
        <label className="text-sm text-gray-300 mb-3 block">Cores Predefinidas</label>
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

      {/* Seletor de cor customizada */}
      <div className="mb-4">
        <label className="text-sm text-gray-300 mb-2 block">Cor Personalizada</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-10 border-gray-600 bg-gray-800 hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <Palette size={16} />
                <div
                  className="w-4 h-4 rounded border border-gray-500"
                  style={{ backgroundColor: customColor }}
                />
                <span className="text-sm">{customColor}</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 bg-gray-800 border-gray-700">
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

      {/* Controle de animação */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-300">Animação</label>
          <Switch
            checked={animated}
            onCheckedChange={handleAnimationToggle}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Ativa o efeito pulsante na linha de conexão
        </p>
      </div>

      {/* Ações */}
      <div className="flex gap-2">
        <Button
          onClick={handleDelete}
          variant="destructive"
          size="sm"
          className="flex-1"
        >
          <Trash2 size={14} className="mr-1" />
          Deletar
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Fechar
        </Button>
      </div>
    </div>
  );
};
