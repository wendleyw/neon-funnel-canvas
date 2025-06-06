import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { 
  X
} from 'lucide-react';
import { 
  SourceComponentRenderer, 
  PageComponentRenderer, 
  ActionComponentRenderer,
  detectComponentType 
} from './renderers';
import { ComponentTemplate } from '../../../types/funnel';

// Template information map
const getTemplateInfo = (type: string) => {
  const templateMap: Record<string, { icon: string; color: string; label: string; category?: string }> = {
    'landing-page': { icon: '🎯', color: '#3B82F6', label: 'Landing Page' },
    'quiz': { icon: '❓', color: '#8B5CF6', label: 'Quiz' },
    'form': { icon: '📝', color: '#10B981', label: 'Formulário' },
    'email-sequence': { icon: '📧', color: '#F59E0B', label: 'E-mail Sequence' },
    'checkout': { icon: '💳', color: '#EF4444', label: 'Checkout' },
    'sales-page': { icon: '📈', color: '#DC2626', label: 'Sales Page' },
    
    // Traffic Sources
    'facebook-ads': { icon: '📱', color: '#1877F2', label: 'Facebook Ads', category: 'traffic-source' },
    'instagram-ads': { icon: '📸', color: '#E4405F', label: 'Instagram Ads', category: 'traffic-source' },
    'google-ads': { icon: '🔍', color: '#4285F4', label: 'Google Ads', category: 'traffic-source' },
    'email-marketing': { icon: '📧', color: '#F59E0B', label: 'Email Marketing', category: 'traffic-source' },
    'sms-marketing': { icon: '📱', color: '#10B981', label: 'SMS Marketing', category: 'traffic-source' },
    
    // Actions
    'webhook': { icon: '🔗', color: '#8B5CF6', label: 'Webhook' },
    'api-call': { icon: '🔌', color: '#10B981', label: 'API Call' },
    'action-sequence': { icon: '⚡', color: '#F59E0B', label: 'Action Sequence' },
    'traffic-source': { icon: '🚀', color: '#10B981', label: 'Traffic Source' },
  };
  
  return templateMap[type] || { icon: '🔧', color: '#6B7280', label: type.replace(/-/g, ' '), category: 'unknown' };
};

// Edit Modal Component
const EditNodeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  nodeData: any;
  onSave: (data: any) => void;
}> = ({ isOpen, onClose, nodeData, onSave }) => {
  const [title, setTitle] = React.useState(nodeData.title || '');
  const [description, setDescription] = React.useState(nodeData.description || '');
  const [customImage, setCustomImage] = React.useState(nodeData.customImage || '');

  const handleSave = () => {
    onSave({
      ...nodeData,
      title,
      description,
      customImage,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
      }}
    >
      <div 
        className="bg-gray-900 rounded-lg p-6 w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Edit Component</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Component name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              placeholder="Component description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Image URL
            </label>
            <input
              type="text"
              value={customImage}
              onChange={(e) => setCustomImage(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main CustomNode Component
export const CustomNode: React.FC<NodeProps> = React.memo(({ data, selected, id }) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isConnectionTarget, setIsConnectionTarget] = React.useState(false);
  const reactFlowInstance = useReactFlow();
  
  const template = getTemplateInfo(data.originalType || 'default');
  
  // Create a component template object for our renderers
  const componentTemplate: ComponentTemplate = {
    type: data.originalType || 'default',
    icon: template.icon,
    label: template.label,
    color: template.color,
    category: template.category || 'unknown',
    originalType: data.originalType || 'default',
    defaultProps: data
  };

  // Create a component object for our renderers
  const component = {
    id,
    type: data.originalType || 'default',
    position: { x: 0, y: 0 }, // Position handled by ReactFlow
    data: {
      title: data.title || template.label,
      description: data.description,
      image: data.image,
      status: data.status,
      properties: data.properties || {}
    },
    connections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Monitor connection state to show drop feedback
  React.useEffect(() => {
    const checkConnectionState = () => {
      const connectionInProgress = (window as any).__reactflow__connection_in_progress;
      const isTarget = connectionInProgress && 
                      connectionInProgress.nodeId !== id && 
                      Date.now() - connectionInProgress.startTime < 10000; // 10 second timeout
      setIsConnectionTarget(!!isTarget);
    };
    
    const interval = setInterval(checkConnectionState, 100);
    return () => clearInterval(interval);
  }, [id]);

  const handleEdit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDuplicate = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Create a duplicate node
    const nodes = reactFlowInstance.getNodes();
    const newNode = {
      ...nodes.find(n => n.id === id)!,
      id: `${id}-copy-${Date.now()}`,
      position: {
        x: nodes.find(n => n.id === id)!.position.x + 50,
        y: nodes.find(n => n.id === id)!.position.y + 50,
      },
      data: {
        ...data,
        title: `${data.title || template.label} (Copy)`
      }
    };
    
    reactFlowInstance.setNodes([...nodes, newNode]);
  };

  const handleDelete = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Add confirmation logic if necessary
    if (confirm('Are you sure you want to delete this component?')) {
      // Remove the node
      const nodes = reactFlowInstance.getNodes();
      const filteredNodes = nodes.filter(node => node.id !== id);
      reactFlowInstance.setNodes(filteredNodes);
      
      // Remove connected edges
      const edges = reactFlowInstance.getEdges();
      const filteredEdges = edges.filter(edge => 
        edge.source !== id && edge.target !== id
      );
      reactFlowInstance.setEdges(filteredEdges);
    }
  };

  const handleConnection = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Connection logic can be handled by ReactFlow
    console.log('Connection clicked for node:', id);
  };

  const handleSaveEdit = (newData: any) => {
    const nodes = reactFlowInstance.getNodes();
    const updatedNodes = nodes.map(node => {
      if (node.id === id) {
        return { ...node, data: newData };
      }
      return node;
    });
    reactFlowInstance.setNodes(updatedNodes);
    setIsEditModalOpen(false);
  };

  // Detect component type using our utility
  const componentType = detectComponentType(componentTemplate);

  // Debug log only once per component load (not on every render)
  React.useEffect(() => {
    console.log('🎨 [CustomNode] Component type detection:', {
      componentId: id,
      componentTitle: data.title,
      templateLabel: template.label,
      originalType: data.originalType,
      category: template.category,
      detectedType: componentType
    });
  }, [id, data.originalType, componentType]); // Only log when these values change

  // Render specialized component based on type
  const renderSpecializedComponent = () => {
    const commonProps = {
      component,
      template: componentTemplate,
      isSelected: selected || false,
      isConnecting: false,
      canConnect: isConnectionTarget,
      onEditClick: handleEdit,
      onDeleteClick: handleDelete,
      onConnectionClick: handleConnection,
      onDuplicateClick: handleDuplicate
    };

    switch (componentType) {
      case 'source':
        return <SourceComponentRenderer {...commonProps} />;
      
      case 'page':
        return <PageComponentRenderer {...commonProps} />;
      
      case 'action':
        return <ActionComponentRenderer {...commonProps} />;
      
      default:
        return <ActionComponentRenderer {...commonProps} />;
    }
  };

  return (
    <>
      <div className="group relative">
        {/* Connection handles - positioned to work with all renderer types */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-blue-500 !border-2 !border-blue-300 hover:!scale-110 transition-transform"
          style={{ left: -6, top: '50%', transform: 'translateY(-50%)' }}
        />
        
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 !bg-green-500 !border-2 !border-green-300 hover:!scale-110 transition-transform"
          style={{ right: -6, top: '50%', transform: 'translateY(-50%)' }}
        />

        {/* Render specialized component */}
        {renderSpecializedComponent()}
      </div>

      {/* Edit Modal */}
      <EditNodeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        nodeData={data}
        onSave={handleSaveEdit}
      />
    </>
  );
});

export default CustomNode; 