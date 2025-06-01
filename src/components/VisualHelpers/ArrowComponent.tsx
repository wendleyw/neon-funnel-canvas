
import React, { useCallback } from 'react';
import { ArrowRight, ArrowDown, ArrowLeft, ArrowUp, RotateCw, Trash2 } from 'lucide-react';
import { FunnelComponent } from '../../types/funnel';

interface ArrowComponentProps {
  component: FunnelComponent;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onDelete: () => void;
  onSelect: () => void;
}

export const ArrowComponent: React.FC<ArrowComponentProps> = ({
  component,
  isSelected,
  onUpdate,
  onDelete,
  onSelect
}) => {
  const direction = component.data.properties?.direction || 'right';
  const color = component.data.properties?.color || 'blue';
  const size = component.data.properties?.size || 'medium';

  const directions = {
    right: ArrowRight,
    down: ArrowDown,
    left: ArrowLeft,
    up: ArrowUp
  };

  const colors = {
    blue: 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)]',
    green: 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]',
    purple: 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]',
    orange: 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.7)]',
    red: 'text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]',
    cyan: 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]'
  };

  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const ArrowIcon = directions[direction as keyof typeof directions];

  const rotateDirection = useCallback(() => {
    const directionOrder = ['right', 'down', 'left', 'up'];
    const currentIndex = directionOrder.indexOf(direction);
    const nextDirection = directionOrder[(currentIndex + 1) % directionOrder.length];
    
    onUpdate(component.id, {
      data: {
        ...component.data,
        properties: {
          ...component.data.properties,
          direction: nextDirection
        }
      }
    });
  }, [component.id, component.data, direction, onUpdate]);

  const changeColor = useCallback((newColor: string) => {
    onUpdate(component.id, {
      data: {
        ...component.data,
        properties: {
          ...component.data.properties,
          color: newColor
        }
      }
    });
  }, [component.id, component.data, onUpdate]);

  const changeSize = useCallback((newSize: string) => {
    onUpdate(component.id, {
      data: {
        ...component.data,
        properties: {
          ...component.data.properties,
          size: newSize
        }
      }
    });
  }, [component.id, component.data, onUpdate]);

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 flex items-center justify-center
        ${isSelected ? 'scale-110' : 'hover:scale-105'}
      `}
      onClick={onSelect}
    >
      <ArrowIcon 
        className={`
          ${sizes[size as keyof typeof sizes]}
          ${colors[color as keyof typeof colors]}
          transition-all duration-300 animate-pulse
          ${isSelected ? 'animate-bounce' : ''}
        `}
      />

      {/* Controls */}
      {isSelected && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 rounded-lg p-2 flex space-x-2">
          {/* Rotate */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotateDirection();
            }}
            className="w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
            title="Rotacionar"
          >
            <RotateCw className="w-3 h-3 text-white" />
          </button>

          {/* Colors */}
          {Object.keys(colors).map((colorKey) => (
            <button
              key={colorKey}
              onClick={(e) => {
                e.stopPropagation();
                changeColor(colorKey);
              }}
              className={`w-4 h-4 rounded-full border-2 ${
                colorKey === color ? 'border-white' : 'border-gray-600'
              }`}
              style={{
                backgroundColor: {
                  blue: '#3b82f6',
                  green: '#22c55e',
                  purple: '#a855f7',
                  orange: '#fb923c',
                  red: '#ef4444',
                  cyan: '#06b6d4'
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
                changeSize(sizeKey);
              }}
              className={`px-2 py-1 text-xs rounded ${
                sizeKey === size 
                  ? 'bg-white text-black' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {sizeKey[0].toUpperCase()}
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
