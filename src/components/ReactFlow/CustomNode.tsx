import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { 
  Edit2, 
  Trash2, 
  Copy, 
  Play,
  Pause,
  Settings,
  Zap,
  X,
  Image as ImageIcon
} from 'lucide-react';

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
  };
  
  return templateMap[type] || { icon: '🔧', color: '#6B7280', label: type.replace(/-/g, ' '), category: 'unknown' };
};

// Check if component is a traffic source
const isTrafficSource = (type: string): boolean => {
  const template = getTemplateInfo(type);
  return template.category === 'traffic-source';
};

// Check if component is a page type
const isPageComponent = (type: string): boolean => {
  const pageTypes = ['landing-page', 'sales-page', 'checkout', 'quiz', 'form'];
  return pageTypes.includes(type);
};

// Traffic Source Widget
const TrafficSourceWidget: React.FC<{ 
  type: string; 
  title?: string; 
}> = ({ type, title }) => {
  const template = getTemplateInfo(type);

  return (
    <div className="w-full h-16 flex items-center justify-center p-2">
      <div 
        className="w-full h-full rounded-lg border flex items-center px-3 gap-3 bg-gray-900"
        style={{ 
          borderColor: template.color,
          boxShadow: `0 0 8px ${template.color}20`
        }}
      >
        <div 
          className="w-8 h-8 rounded flex items-center justify-center text-sm flex-shrink-0"
          style={{
            backgroundColor: template.color + '20',
            color: template.color
            }}
          >
            {template.icon}
          </div>
          <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-sm leading-tight break-words">
              {title || template.label}
            </h3>
              </div>
              </div>
    </div>
  );
};

// Simple Action Button
const SimpleActionButton: React.FC<{ type: string; title?: string; color: string }> = ({ type, title, color }) => {
  const template = getTemplateInfo(type);
  
  return (
    <div className="w-full h-16 flex items-center justify-center p-2">
      <div 
        className="w-full h-full rounded-md font-medium text-white text-center transition-all duration-150 hover:opacity-95 cursor-pointer flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
          <div className="text-sm font-medium leading-tight">
            {title || template.label}
        </div>
      </div>
    </div>
  );
};

// Basic mockup for other components
const BasicMockup: React.FC<{ type: string; customImage?: string }> = ({ type, customImage }) => {
  if (customImage) {
    return (
      <div className="w-full h-32 rounded border border-gray-600 overflow-hidden">
        <img 
          src={customImage} 
          alt="Custom preview" 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-32 bg-gray-800 rounded border border-gray-600 overflow-hidden">
          <div className="p-2 space-y-1">
            <div className="w-full h-2 bg-gray-500 rounded-sm"></div>
              <div className="w-4/5 h-1 bg-gray-400 rounded-sm"></div>
              <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
              <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
        <div className="space-y-1 mt-2">
              <div className="flex gap-1">
            <div className="w-1/2 h-8 bg-gray-700 rounded-sm"></div>
            <div className="w-1/2 h-8 bg-gray-700 rounded-sm"></div>
                </div>
          <div className="w-2/3 h-6 bg-gray-500 rounded-sm"></div>
                </div>
          </div>
        </div>
      );
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
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 h-20 resize-none"
              placeholder="Component description"
            />
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Image URL
              </label>
              <input
              type="url"
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
  
  // Get status info
  const getStatusInfo = () => {
    const status = data.status;
    switch (status) {
      case 'active': return { color: '#10B981', icon: Play, text: 'Active' };
      case 'inactive': return { color: '#F59E0B', icon: Pause, text: 'Inactive' };
      case 'draft': return { color: '#6B7280', icon: Settings, text: 'Draft' };
      case 'test': return { color: '#8B5CF6', icon: Zap, text: 'Test' };
      case 'published': return { color: '#10B981', icon: Play, text: 'Published' };
      default: return { color: '#8B5CF6', icon: Zap, text: 'Ready' };
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add confirmation logic if necessary // Translated comment
    if (confirm('Are you sure you want to delete this component?')) { // Translated confirmation
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

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  
  // Render component content based on type
  const renderContent = () => {
    if (isTrafficSource(data.originalType || '')) {
      return <TrafficSourceWidget type={data.originalType || ''} title={data.title} />;
    }
    
    const isAction = ['webhook', 'api-call'].includes(data.originalType || '');
    if (isAction) {
      return <SimpleActionButton type={data.originalType || ''} title={data.title} color={template.color} />;
    }
    
    return <BasicMockup type={data.originalType || ''} customImage={data.customImage} />;
  };

  return (
    <>
      <div className="group relative">
        {/* Enhanced selection and connection target indicator */}
        {selected && (
          <div className="absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-blue-500 rounded-xl bg-blue-500/5"></div>
        )}
        
        {/* Connection target indicator */}
        {isConnectionTarget && (
          <div className="absolute -top-3 -left-3 -right-3 -bottom-3 border-2 border-dashed border-green-400 rounded-xl bg-green-400/10 animate-pulse">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              Drop to connect
            </div>
          </div>
        )}
        
        {/* Connection handles - always visible for easy connections */}
          <Handle
            type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-blue-500 !border-2 !border-blue-300 hover:!scale-110 transition-transform"
          style={{ left: -6 }}
          />
          
          <Handle
            type="source"
            position={Position.Right}
          className="w-3 h-3 !bg-green-500 !border-2 !border-green-300 hover:!scale-110 transition-transform"
          style={{ right: -6 }}
        />

        {/* Node content */}
        <div
          className={`
            relative w-64 bg-gray-900 rounded-lg border-2 overflow-hidden 
            transition-all duration-200 hover:shadow-lg
            ${selected ? 'border-blue-500 shadow-blue-500/20' : 'border-gray-700'}
            ${isConnectionTarget ? 'border-green-400 shadow-green-400/20' : ''}
          `}
        >
          {/* Header with template color */}
          <div 
            className="h-1 w-full"
            style={{ backgroundColor: template.color }}
          />

            <div className="p-4">
            {/* Title for page components */}
            {isPageComponent(data.originalType || '') && (
              <div className="mb-3">
                <h3 className="font-semibold text-white text-center text-sm leading-tight">
                  {data.title || template.label}
                </h3>
              </div>
            )}

            {/* Component preview */}
              <div className="mb-3">
              {renderContent()}
              </div>

            {/* Status indicator */}
            <div className="flex justify-center mb-3">
                <div className="flex items-center gap-1">
                  <StatusIcon className="w-3 h-3" style={{ color: statusInfo.color }} />
                  <span className="text-xs" style={{ color: statusInfo.color }}>
                    {statusInfo.text}
                  </span>
                  
                {selected && (
                  <span className="text-xs text-blue-400 flex items-center gap-1 ml-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                    Selected
                    </span>
                  )}
                </div>
              </div>

            {/* Action buttons - only when selected */}
            {selected && (
              <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleEdit}
                  className="px-3 py-1.5 bg-blue-600/20 border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white rounded-md transition-all duration-200 flex items-center gap-1 nodrag"
                  title="Edit component"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-xs">Edit</span>
                    </button>

                    <button
                  onClick={handleDuplicate}
                  className="px-3 py-1.5 bg-purple-600/20 border border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white rounded-md transition-all duration-200 flex items-center gap-1 nodrag"
                  title="Duplicate component"
                    >
                      <Copy className="w-4 h-4" />
                  <span className="text-xs">Copy</span>
                    </button>
                  
                  <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-red-600/20 border border-red-500 text-red-400 hover:bg-red-600 hover:text-white rounded-md transition-all duration-200 flex items-center gap-1 nodrag"
                  title="Delete component"
                  >
                    <Trash2 className="w-4 h-4" />
                  <span className="text-xs">Delete</span>
                  </button>
                </div>
              )}
            </div>
        </div>
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

CustomNode.displayName = 'CustomNode';

export default CustomNode; 