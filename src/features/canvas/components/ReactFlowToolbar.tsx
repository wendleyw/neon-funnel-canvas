import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Layers, 
  Link, 
  Navigation, 
  Zap, 
  Settings, 
  RotateCcw,
  Group,
  Ungroup,
  ArrowRight,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { useReactFlow } from 'reactflow';
import { useReactFlowHelpers } from '@/features/shared/hooks/useReactFlowHelpers';
import { FunnelComponent, Connection } from '../../../types/funnel';

interface ReactFlowToolbarProps {
  components: FunnelComponent[];
  connections: Connection[];
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  className?: string;
}

export const ReactFlowToolbar: React.FC<ReactFlowToolbarProps> = ({
  components,
  connections,
  onComponentUpdate,
  className = ''
}) => {
  const reactFlowInstance = useReactFlow();
  const helpers = useReactFlowHelpers({ components, connections, onComponentUpdate });
  const [isValidationEnabled, setIsValidationEnabled] = useState(true);
  const [showGroupingPanel, setShowGroupingPanel] = useState(false);
  const [groupName, setGroupName] = useState('');

  // Layout options
  const handleAutoLayout = (type: 'horizontal' | 'vertical' | 'radial') => {
    helpers.autoLayoutNodes(type);
    console.log(`🎯 Applied ${type} layout`);
  };

  // Grouping functionality
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    
    helpers.groupSelectedNodes({
      groupId: `group-${Date.now()}`,
      groupLabel: groupName,
      backgroundColor: '#1F2937',
      borderColor: '#3B82F6'
    });
    
    setGroupName('');
    setShowGroupingPanel(false);
  };

  // Connection validation
  const handleValidateConnections = () => {
    const edges = reactFlowInstance?.getEdges() || [];
    let validConnections = 0;
    let invalidConnections = 0;
    
    edges.forEach(edge => {
      const connection = { 
        source: edge.source, 
        target: edge.target,
        sourceHandle: null,
        targetHandle: null
      };
      if (helpers.validateConnection(connection)) {
        validConnections++;
      } else {
        invalidConnections++;
      }
    });
    
    alert(`✅ Valid: ${validConnections}\n❌ Invalid: ${invalidConnections}`);
  };

  // Reset view
  const handleResetView = () => {
    reactFlowInstance?.fitView({ padding: 0.1 });
  };

  // Get selected nodes count
  const selectedNodesCount = reactFlowInstance?.getNodes().filter(node => node.selected).length || 0;

  return (
    <div className={`bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg ${className}`}>
      {/* Layout Section */}
      <div className="mb-4">
        <h3 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" />
          Auto Layout
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleAutoLayout('horizontal')}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            title="Arrange components horizontally"
          >
            <ArrowRight className="w-3 h-3" />
            Horizontal
          </button>
          <button
            onClick={() => handleAutoLayout('vertical')}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            title="Arrange components vertically"
          >
            <ArrowRight className="w-3 h-3 transform rotate-90" />
            Vertical
          </button>
          <button
            onClick={() => handleAutoLayout('radial')}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            title="Arrange components in a circle"
          >
            <Navigation className="w-3 h-3" />
            Radial
          </button>
        </div>
      </div>

      {/* Grouping Section */}
      <div className="mb-4">
        <h3 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Grouping
          {selectedNodesCount > 0 && (
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
              {selectedNodesCount} selected
            </span>
          )}
        </h3>
        
        {!showGroupingPanel ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowGroupingPanel(true)}
              disabled={selectedNodesCount < 2}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
              title="Group selected components"
            >
              <Group className="w-3 h-3" />
              Group
            </button>
            <button
              onClick={() => {/* TODO: Implement ungroup logic */}}
              className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors"
              title="Ungroup selected group"
            >
              <Ungroup className="w-3 h-3" />
              Ungroup
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name..."
              className="w-full px-2 py-1 text-xs bg-gray-700 text-white border border-gray-600 rounded"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateGroup}
                className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowGroupingPanel(false);
                  setGroupName('');
                }}
                className="flex-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Connection Validation Section */}
      <div className="mb-4">
        <h3 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
          <Link className="w-4 h-4" />
          Connections
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="validation-toggle"
              checked={isValidationEnabled}
              onChange={(e) => setIsValidationEnabled(e.target.checked)}
              className="w-3 h-3"
            />
            <label htmlFor="validation-toggle" className="text-white text-xs">
              Enable validation
            </label>
          </div>
          <button
            onClick={handleValidateConnections}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors w-full"
            title="Validate all connections"
          >
            <CheckCircle className="w-3 h-3" />
            Validate All
          </button>
        </div>
      </div>

      {/* Utility Section */}
      <div className="mb-4">
        <h3 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Utilities
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleResetView}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
            title="Reset view to fit all components"
          >
            <RotateCcw className="w-3 h-3" />
            Reset View
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-gray-600 pt-3">
        <h3 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Statistics
        </h3>
        <div className="space-y-1 text-xs text-gray-300">
          <div className="flex justify-between">
            <span>Components:</span>
            <span className="text-blue-400">{components.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Connections:</span>
            <span className="text-green-400">{connections.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Selected:</span>
            <span className="text-yellow-400">{selectedNodesCount}</span>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="border-t border-gray-600 pt-3 mt-3">
        <div className="text-xs text-gray-400 space-y-1">
          <div>💡 <strong>Tip:</strong> Hold Shift to select multiple components</div>
          <div>🎯 <strong>Tip:</strong> Use Ctrl+Z to undo changes</div>
          <div>🔗 <strong>Tip:</strong> Drag from green handles to connect</div>
        </div>
      </div>
    </div>
  );
}; 