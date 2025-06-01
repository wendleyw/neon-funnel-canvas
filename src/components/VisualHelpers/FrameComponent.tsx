
import React, { useCallback, useState } from 'react';
import { Square, Edit3, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { FunnelComponent } from '../../types/funnel';
import { Input } from '../ui/input';

interface FrameComponentProps {
  component: FunnelComponent;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onDelete: () => void;
  onSelect: () => void;
}

export const FrameComponent: React.FC<FrameComponentProps> = ({
  component,
  isSelected,
  onUpdate,
  onDelete,
  onSelect
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(component.data.title);

  const frameColor = component.data.properties?.color || 'blue';
  const frameSize = component.data.properties?.size || 'medium';
  const borderStyle = component.data.properties?.borderStyle || 'solid';

  const colors = {
    blue: 'border-blue-400 bg-blue-900/10 text-blue-300',
    green: 'border-green-400 bg-green-900/10 text-green-300',
    purple: 'border-purple-400 bg-purple-900/10 text-purple-300',
    orange: 'border-orange-400 bg-orange-900/10 text-orange-300',
    red: 'border-red-400 bg-red-900/10 text-red-300',
    cyan: 'border-cyan-400 bg-cyan-900/10 text-cyan-300',
    white: 'border-white bg-white/5 text-white'
  };

  const glows = {
    blue: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    green: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    purple: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    orange: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]',
    red: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    cyan: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    white: 'shadow-[0_0_20px_rgba(255,255,255,0.2)]'
  };

  const sizes = {
    small: 'w-48 h-32',
    medium: 'w-64 h-48',
    large: 'w-80 h-64'
  };

  const borderStyles = {
    solid: 'border-2',
    dashed: 'border-2 border-dashed',
    dotted: 'border-2 border-dotted'
  };

  const handleTitleSave = useCallback(() => {
    onUpdate(component.id, {
      data: {
        ...component.data,
        title: tempTitle
      }
    });
    setIsEditingTitle(false);
  }, [component.id, component.data, tempTitle, onUpdate]);

  const handlePropertyChange = useCallback((property: string, value: string) => {
    onUpdate(component.id, {
      data: {
        ...component.data,
        properties: {
          ...component.data.properties,
          [property]: value
        }
      }
    });
  }, [component.id, component.data, onUpdate]);

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 rounded-lg backdrop-blur-sm
        ${sizes[frameSize as keyof typeof sizes]}
        ${colors[frameColor as keyof typeof colors]}
        ${glows[frameColor as keyof typeof glows]}
        ${borderStyles[borderStyle as keyof typeof borderStyles]}
        ${isSelected ? 'scale-105 ring-2 ring-white ring-opacity-50' : 'hover:scale-102'}
      `}
      onClick={onSelect}
    >
      {/* Frame title */}
      <div className="absolute -top-6 left-2">
        {isEditingTitle ? (
          <Input
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSave();
              if (e.key === 'Escape') {
                setTempTitle(component.data.title);
                setIsEditingTitle(false);
              }
            }}
            className="w-32 h-6 text-xs bg-black border-gray-600"
            autoFocus
          />
        ) : (
          <div
            className="text-xs font-medium px-2 py-1 bg-black rounded cursor-text"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
          >
            {component.data.title || 'Frame'}
          </div>
        )}
      </div>

      {/* Frame content area */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-center opacity-50">
          <Square className="w-8 h-8 mx-auto mb-2" />
          <p className="text-xs">Área do Frame</p>
          <p className="text-xs mt-1">{component.data.description || 'Organize seus componentes aqui'}</p>
        </div>
      </div>

      {/* Controls */}
      {isSelected && (
        <div className="absolute -top-12 right-0 bg-black bg-opacity-90 rounded-lg p-2 flex space-x-2">
          {/* Colors */}
          {Object.keys(colors).map((colorKey) => (
            <button
              key={colorKey}
              onClick={(e) => {
                e.stopPropagation();
                handlePropertyChange('color', colorKey);
              }}
              className={`w-4 h-4 rounded border-2 ${
                colorKey === frameColor ? 'border-white' : 'border-gray-600'
              }`}
              style={{
                backgroundColor: {
                  blue: '#3b82f6',
                  green: '#22c55e',
                  purple: '#a855f7',
                  orange: '#fb923c',
                  red: '#ef4444',
                  cyan: '#06b6d4',
                  white: '#ffffff'
                }[colorKey as keyof typeof colors]
              }}
            />
          ))}

          {/* Sizes */}
          {Object.keys(sizes).map((sizeKey) => (
            <button
              key={sizeKey}
              onClick={(e) => {
                e.stopPropagation();
                handlePropertyChange('size', sizeKey);
              }}
              className={`px-2 py-1 text-xs rounded ${
                sizeKey === frameSize
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {sizeKey === 'small' ? 'P' : sizeKey === 'medium' ? 'M' : 'G'}
            </button>
          ))}

          {/* Border styles */}
          {Object.keys(borderStyles).map((styleKey) => (
            <button
              key={styleKey}
              onClick={(e) => {
                e.stopPropagation();
                handlePropertyChange('borderStyle', styleKey);
              }}
              className={`px-2 py-1 text-xs rounded ${
                styleKey === borderStyle
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {styleKey === 'solid' ? '—' : styleKey === 'dashed' ? '- -' : '• •'}
            </button>
          ))}

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-6 h-6 bg-red-600 hover:bg-red-700 rounded flex items-center justify-center"
            title="Deletar"
          >
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};
