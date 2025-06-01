
import React, { useState, useEffect, useRef } from 'react';
import { Connection } from '../types/funnel';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Trash2, Palette, X } from 'lucide-react';

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
  const editorRef = useRef<HTMLDivElement>(null);

  // Calcular posição otimizada para evitar sair da tela
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = position.x - 180; // Centralizar horizontalmente
      let newY = position.y - 120; // Posicionar acima do ponto

      // Ajustar se sair da tela pela direita
      if (newX + 360 > viewportWidth) {
        newX = viewportWidth - 380;
      }
      
      // Ajustar se sair da tela pela esquerda
      if (newX < 20) {
        newX = 20;
      }
      
      // Ajustar se sair da tela por cima
      if (newY < 20) {
        newY = position.y + 40; // Posicionar abaixo do ponto
      }
      
      // Ajustar se sair da tela por baixo
      if (newY + 400 > viewportHeight) {
        newY = viewportHeight - 420;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position]);

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
    <>
      {/* Overlay para fechar ao clicar fora */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        style={{ zIndex: 10000 }}
        onClick={onClose}
      />
      
      {/* Editor principal com z-index alto mas controlado */}
      <div
        ref={editorRef}
        className="fixed bg-gray-900/98 backdrop-blur-md border border-gray-600/50 rounded-2xl shadow-2xl p-6 min-w-[360px] max-w-[400px] animate-in fade-in-0 scale-in-95 duration-200"
        style={{
          left: adjustedPosition.x,
          top: adjustedPosition.y,
          zIndex: 10001,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com gradiente */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: getCurrentColor() }}
            />
            <h3 className="text-white font-semibold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Editar Conexão
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all duration-200 p-2 hover:bg-gray-800/50 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        {/* Preview melhorado */}
        <div className="mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
          <label className="text-sm text-gray-300 mb-3 block font-medium">Preview da Conexão</label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={`w-24 h-4 rounded-full transition-all duration-300 ${animated ? 'animate-pulse' : ''}`}
                style={{ 
                  backgroundColor: getCurrentColor(),
                  boxShadow: `0 0 20px ${getCurrentColor()}40`
                }}
              />
              {animated && (
                <div
                  className="absolute top-1 left-1 w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: getCurrentColor() }}
                />
              )}
            </div>
            <div className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
              {animated ? '🎯 Animado' : '⚡ Estático'}
            </div>
          </div>
        </div>

        {/* Cores predefinidas com design melhorado */}
        <div className="mb-6">
          <label className="text-sm text-gray-300 mb-3 block font-medium">Cores Predefinidas</label>
          <div className="grid grid-cols-4 gap-3">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                className={`group relative w-full h-12 rounded-xl border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  getCurrentColor() === color.value 
                    ? 'border-white shadow-lg ring-2 ring-white/30' 
                    : 'border-gray-600/50 hover:border-gray-400'
                }`}
                style={{ 
                  backgroundColor: color.value,
                  boxShadow: getCurrentColor() === color.value ? `0 0 20px ${color.value}60` : 'none'
                }}
                onClick={() => handleColorSelect(color.value, color.type)}
                title={color.name}
              >
                <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-all duration-200" />
                {getCurrentColor() === color.value && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Seletor de cor customizada melhorado */}
        <div className="mb-6">
          <label className="text-sm text-gray-300 mb-3 block font-medium">Cor Personalizada</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Palette size={18} />
                  <div
                    className="w-6 h-6 rounded-lg border border-gray-500 shadow-inner"
                    style={{ backgroundColor: customColor }}
                  />
                  <span className="text-sm font-mono">{customColor}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4 bg-gray-800 border-gray-700" style={{ zIndex: 10002 }}>
              <div className="space-y-4">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-full h-12 rounded-lg border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white font-mono"
                  placeholder="#000000"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Controle de animação melhorado */}
        <div className="mb-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-300 font-medium">Animação Dinâmica</label>
            <Switch
              checked={animated}
              onCheckedChange={handleAnimationToggle}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          <p className="text-xs text-gray-500">
            {animated ? '🎯 Ativa o efeito pulsante e movimento na linha' : '⚡ Conexão estática sem animações'}
          </p>
        </div>

        {/* Ações com design melhorado */}
        <div className="flex gap-3">
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            className="flex-1 bg-red-600/80 hover:bg-red-600 transition-all duration-200"
          >
            <Trash2 size={16} className="mr-2" />
            Deletar
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="flex-1 border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200"
          >
            Concluído
          </Button>
        </div>
      </div>
    </>
  );
};
