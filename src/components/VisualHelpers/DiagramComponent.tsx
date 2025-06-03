import React, { useCallback, useState } from 'react';
import { Edit3, Trash2, RotateCw, Maximize2, Minimize2 } from 'lucide-react';
import { FunnelComponent } from '../../types/funnel';
import { Input } from '../ui/input';

interface DiagramComponentProps {
  component: FunnelComponent;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onDelete: () => void;
  onSelect: () => void;
}

export const DiagramComponent: React.FC<DiagramComponentProps> = ({
  component,
  isSelected,
  onUpdate,
  onDelete,
  onSelect
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(component.data.title);

  // Get diagram properties
  const diagramType = component.data.properties?.originalDiagramType || 'rectangle';
  const backgroundColor = component.data.properties?.backgroundColor || '#3B82F6';
  const borderColor = component.data.properties?.borderColor || '#1E40AF';
  const width = component.data.properties?.width || 120;
  const height = component.data.properties?.height || 80;
  const text = component.data.title || diagramType;

  const handleTitleSave = useCallback(() => {
    onUpdate(component.id, {
      data: {
        ...component.data,
        title: tempTitle
      }
    });
    setIsEditingTitle(false);
  }, [component.id, component.data, tempTitle, onUpdate]);

  const handleResize = useCallback((newWidth: number, newHeight: number) => {
    onUpdate(component.id, {
      data: {
        ...component.data,
        properties: {
          ...component.data.properties,
          width: newWidth,
          height: newHeight
        }
      }
    });
  }, [component.id, component.data, onUpdate]);

  const handleColorChange = useCallback((color: string) => {
    onUpdate(component.id, {
      data: {
        ...component.data,
        properties: {
          ...component.data.properties,
          backgroundColor: color
        }
      }
    });
  }, [component.id, component.data, onUpdate]);

  // Size presets
  const sizePresets = [
    { label: 'P', width: 80, height: 60 },
    { label: 'M', width: 120, height: 80 },
    { label: 'G', width: 160, height: 120 },
    { label: 'XG', width: 200, height: 150 }
  ];

  // Color presets
  const colorPresets = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  // SVG Shape Renderers
  const renderShape = () => {
    const baseProps = {
      fill: backgroundColor,
      stroke: borderColor,
      strokeWidth: 2,
      style: { filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }
    };

    switch (diagramType) {
      case 'hexagon':
        const hexPoints = `${width * 0.25},${height * 0.1} ${width * 0.75},${height * 0.1} ${width * 0.9},${height * 0.5} ${width * 0.75},${height * 0.9} ${width * 0.25},${height * 0.9} ${width * 0.1},${height * 0.5}`;
        return <polygon points={hexPoints} {...baseProps} />;
      
      case 'star':
        const starPoints = `${width * 0.5},${height * 0.1} ${width * 0.61},${height * 0.35} ${width * 0.9},${height * 0.35} ${width * 0.68},${height * 0.57} ${width * 0.79},${height * 0.9} ${width * 0.5},${height * 0.7} ${width * 0.21},${height * 0.9} ${width * 0.32},${height * 0.57} ${width * 0.1},${height * 0.35} ${width * 0.39},${height * 0.35}`;
        return <polygon points={starPoints} {...baseProps} />;
      
      case 'diamond':
        const diamondPoints = `${width * 0.5},${height * 0.1} ${width * 0.9},${height * 0.5} ${width * 0.5},${height * 0.9} ${width * 0.1},${height * 0.5}`;
        return <polygon points={diamondPoints} {...baseProps} />;
      
      case 'circle':
        return <ellipse cx={width * 0.5} cy={height * 0.5} rx={width * 0.4} ry={height * 0.4} {...baseProps} />;
      
      case 'line':
        return <line x1={width * 0.1} y1={height * 0.5} x2={width * 0.9} y2={height * 0.5} {...baseProps} strokeWidth={4} />;
      
      case 'connector':
        return (
          <>
            <circle cx={width * 0.2} cy={height * 0.5} r={width * 0.08} {...baseProps} />
            <line x1={width * 0.28} y1={height * 0.5} x2={width * 0.72} y2={height * 0.5} {...baseProps} strokeWidth={3} />
            <circle cx={width * 0.8} cy={height * 0.5} r={width * 0.08} {...baseProps} />
          </>
        );
      
      case 'text':
        return <rect x={width * 0.1} y={height * 0.1} width={width * 0.8} height={height * 0.8} {...baseProps} rx={4} />;
      
      default: // rectangle
        return <rect x={width * 0.1} y={height * 0.1} width={width * 0.8} height={height * 0.8} {...baseProps} rx={4} />;
    }
  };

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 group
        ${isSelected ? 'ring-2 ring-white ring-opacity-60 scale-105' : 'hover:scale-102'}
      `}
      onClick={onSelect}
      style={{ width, height }}
    >
      {/* SVG Shape */}
      <svg
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ filter: isSelected ? 'brightness(1.2)' : 'brightness(1)' }}
      >
        {renderShape()}
        
        {/* Text */}
        <text
          x={width * 0.5}
          y={height * 0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white font-semibold text-sm pointer-events-none"
          style={{ fontSize: Math.min(width, height) * 0.12 }}
        >
          {text.length > 12 ? text.substring(0, 12) + '...' : text}
        </text>
      </svg>

      {/* Controls (show on hover/select) */}
      {(isSelected || false) && (
        <div className="absolute -top-8 left-0 right-0 flex justify-center space-x-1">
          {/* Size controls */}
          <div className="flex bg-black rounded px-1 space-x-1">
            {sizePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  handleResize(preset.width, preset.height);
                }}
                className="w-6 h-6 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color picker (show on hover/select) */}
      {(isSelected || false) && (
        <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
          <div className="flex bg-black rounded px-1 space-x-1">
            {colorPresets.map((color, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorChange(color);
                }}
                className="w-6 h-6 rounded border-2 border-gray-600 hover:border-white transition-colors"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Title editor */}
      {isEditingTitle && (
        <div className="absolute -top-12 left-0 right-0 flex justify-center">
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
        </div>
      )}

      {/* Edit title on double click */}
      <div
        className="absolute inset-0"
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditingTitle(true);
        }}
      />
    </div>
  );
}; 