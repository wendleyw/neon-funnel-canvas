import React, { useState, useCallback } from 'react';
import { FunnelContent } from './FunnelContent';
import { ComponentTemplate } from '../../types/funnel';
import { DrawingTool, DrawingShape } from '../../types/drawing';
import { Square, Circle, Diamond, ArrowRight, Minus, Plus, Target } from 'lucide-react';

interface ShapeItem {
  id: string;
  type: DrawingTool;
  icon: React.ComponentType<any>;
  name: string;
  color: string;
}

const shapes: ShapeItem[] = [
  { id: 'rectangle', type: 'rectangle', icon: Square, name: 'Rectangle', color: '#3B82F6' },
  { id: 'circle', type: 'circle', icon: Circle, name: 'Circle', color: '#10B981' },
  { id: 'diamond', type: 'diamond', icon: Diamond, name: 'Diamond', color: '#F59E0B' },
  { id: 'arrow', type: 'arrow', icon: ArrowRight, name: 'Arrow', color: '#8B5CF6' },
  { id: 'line', type: 'line', icon: Minus, name: 'Line', color: '#6B7280' }
];

interface CreateContentProps {
  searchQuery: string;
  favorites: string[];
  favoriteTemplates: ComponentTemplate[];
  filteredCategories: any[];
  onSearchChange: (query: string) => void;
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  onToggleFavorite: (templateType: string) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

export const CreateContent: React.FC<CreateContentProps> = ({
  onDragStart,
  onShapeAdd,
  onTemplateClick
}) => {
  const [activeTab, setActiveTab] = useState<'marketing' | 'shapes'>('marketing');

  const handleAddShape = useCallback((shape: ShapeItem) => {
    if (!onShapeAdd) return;

    const newShape: DrawingShape = {
      id: `shape-${Date.now()}`,
      type: shape.type,
      position: { x: 400, y: 300 },
      size: { width: 100, height: 60 },
      style: {
        fill: '#FFFFFF',
        stroke: shape.color,
        strokeWidth: 2,
        opacity: 1
      },
      text: 'Text',
      textStyle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        align: 'center',
        verticalAlign: 'middle'
      }
    };

    onShapeAdd(newShape);
  }, [onShapeAdd]);

  // Enhanced shape card to match component style
  const ShapeCard = ({ shape }: { shape: ShapeItem }) => (
    <div
      onClick={() => handleAddShape(shape)}
      className="group relative component-card flex flex-col gap-3 p-4 rounded-xl border border-gray-700/60 bg-gradient-to-br from-gray-800/40 to-gray-900/60 hover:from-gray-700/50 hover:to-gray-800/70 hover:border-gray-600 transition-all duration-300 cursor-pointer backdrop-blur-sm"
    >
      {/* Header with icon and action */}
      <div className="flex items-center justify-between">
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{ 
            backgroundColor: `${shape.color}15`,
            color: shape.color,
            border: `1px solid ${shape.color}30`,
            boxShadow: `0 4px 12px ${shape.color}20`
          }}
        >
          <shape.icon className="w-6 h-6" />
        </div>
        
        {/* Action indicator */}
        <div className="flex items-center gap-2">
          <Target className="w-3 h-3 text-blue-400" />
          <Plus className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="font-semibold text-white text-sm group-hover:text-white transition-colors">
            {shape.name}
          </div>
          <span 
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ 
              backgroundColor: `${shape.color}20`,
              color: shape.color,
              border: `1px solid ${shape.color}30`
            }}
          >
            Shape
          </span>
        </div>
        
        <div className="text-xs text-gray-400 mb-2">
          Basic {shape.name.toLowerCase()} shape
        </div>

        {/* Additional info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Drawing Tool
          </span>
          <span className="text-gray-400 font-medium">
            Visual
          </span>
        </div>
      </div>

      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${shape.color}10, transparent 70%)`
        }}
      />
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Elegant tabs */}
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('marketing')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'marketing' 
                ? 'bg-white text-black shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎯 Marketing
          </button>
          <button
            onClick={() => setActiveTab('shapes')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'shapes' 
                ? 'bg-white text-black shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🔷 Shapes
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'marketing' ? (
        <FunnelContent
          onDragStart={onDragStart}
          onTemplateClick={onTemplateClick}
        />
      ) : (
        <div className="flex-1 overflow-y-auto sidebar-scroll">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-gray-500 rounded-full glow-effect" />
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                Basic Shapes
              </span>
            </div>
            <div className="space-y-2">
              {shapes.map(shape => (
                <ShapeCard key={shape.id} shape={shape} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 