import React from 'react';
import { 
  MousePointer2, 
  Square, 
  Circle, 
  ArrowRight, 
  Minus, 
  Type, 
  Diamond, 
  Hexagon, 
  Star,
  Zap,
  Link,
  LayoutGrid,
  Layers,
  Download,
  Upload,
  Undo,
  Redo,
  Copy,
  Clipboard,
  Trash2
} from 'lucide-react';
import { DrawingTool } from '../../../types/drawing';
import { Button } from '@/features/shared/ui/button';
import { Separator } from '@/features/shared/ui/separator';
import { Badge } from '@/features/shared/ui/badge';

interface DrawingToolbarProps {
  activeTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onToggleGrid?: () => void;
  onToggleLayers?: () => void;
  showGrid?: boolean;
  showLayers?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  hasSelection?: boolean;
  hasClipboard?: boolean;
}

const toolGroups = [
  {
    name: 'Selection',
    tools: [
      { id: 'select' as DrawingTool, icon: MousePointer2, label: 'Select', shortcut: 'V' }
    ]
  },
  {
    name: 'Basic Shapes',
    tools: [
      { id: 'rectangle' as DrawingTool, icon: Square, label: 'Rectangle', shortcut: 'R' },
      { id: 'circle' as DrawingTool, icon: Circle, label: 'Circle', shortcut: 'C' },
      { id: 'diamond' as DrawingTool, icon: Diamond, label: 'Diamond', shortcut: 'D' },
      { id: 'hexagon' as DrawingTool, icon: Hexagon, label: 'Hexagon', shortcut: 'H' },
      { id: 'star' as DrawingTool, icon: Star, label: 'Star', shortcut: 'S' }
    ]
  },
  {
    name: 'Lines & Arrows',
    tools: [
      { id: 'line' as DrawingTool, icon: Minus, label: 'Line', shortcut: 'L' },
      { id: 'arrow' as DrawingTool, icon: ArrowRight, label: 'Arrow', shortcut: 'A' },
      { id: 'connector' as DrawingTool, icon: Link, label: 'Connector', shortcut: 'N' }
    ]
  },
  {
    name: 'Funnel Tools',
    tools: [
      { id: 'funnel' as DrawingTool, icon: Zap, label: 'Funnel Shape', shortcut: 'F' },
      { id: 'text' as DrawingTool, icon: Type, label: 'Text', shortcut: 'T' }
    ]
  }
];

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onDelete,
  onExport,
  onImport,
  onToggleGrid,
  onToggleLayers,
  showGrid = false,
  showLayers = false,
  canUndo = false,
  canRedo = false,
  hasSelection = false,
  hasClipboard = false
}) => {
  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 shadow-2xl">
      {/* Action Buttons */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white disabled:opacity-30"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-700/50" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            disabled={!hasSelection}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white disabled:opacity-30"
            title="Copy (Ctrl+C)"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onPaste}
            disabled={!hasClipboard}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white disabled:opacity-30"
            title="Paste (Ctrl+V)"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={!hasSelection}
            className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 disabled:opacity-30"
            title="Delete (Delete)"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-700/50" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleGrid}
            className={`h-8 w-8 p-0 transition-colors ${
              showGrid 
                ? 'text-cyan-400 bg-cyan-500/20' 
                : 'text-gray-400 hover:text-white'
            }`}
            title="Toggle Grid (Ctrl+G)"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleLayers}
            className={`h-8 w-8 p-0 transition-colors ${
              showLayers 
                ? 'text-purple-400 bg-purple-500/20' 
                : 'text-gray-400 hover:text-white'
            }`}
            title="Toggle Layers Panel"
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-700/50" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onImport}
            className="h-8 w-8 p-0 text-gray-400 hover:text-green-400"
            title="Import Template"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400"
            title="Export Diagram"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="bg-gray-700/50 mb-3" />

      {/* Drawing Tools */}
      <div className="space-y-4">
        {toolGroups.map((group, groupIndex) => (
          <div key={group.name}>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {group.name}
              </h3>
              <div className="flex-1 h-px bg-gray-700/30" />
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              {group.tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                
                return (
                  <Button
                    key={tool.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onToolChange(tool.id)}
                    className={`h-10 flex flex-col items-center justify-center gap-1 transition-all duration-200 relative group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                    title={`${tool.label} (${tool.shortcut})`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : ''}`} />
                    <span className="text-xs leading-none">{tool.label}</span>
                    
                    {/* Keyboard shortcut badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-gray-700/80 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {tool.shortcut}
                    </Badge>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Current Tool Display */}
      <div className="mt-4 pt-3 border-t border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">
            Active: <span className="text-cyan-400 font-medium">
              {toolGroups
                .flatMap(g => g.tools)
                .find(t => t.id === activeTool)?.label || 'Unknown'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
