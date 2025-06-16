import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { 
  X,
  Globe,
  Loader2,
  Eye
} from 'lucide-react';
import { 
  SourceComponentRenderer, 
  PageComponentRenderer, 
  ActionComponentRenderer,
  detectComponentType 
} from './renderers';
import UrlPreviewCard from '../../shared/components/UrlPreviewCard';
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

// Helper function to validate and clean URLs
const getValidUrl = (url: string | null | undefined): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Remove any whitespace
  url = url.trim();

  // Check if it's a valid HTTP/HTTPS URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      new URL(url);
      return url;
    } catch {
      return '';
    }
  }

  // If it's not a valid URL or is a data URL, base64, etc., return empty
  if (url.startsWith('data:') || url.includes('base64') || url.length > 2000) {
    return '';
  }

  return '';
};

// Edit Modal Component
const EditNodeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  nodeData: any;
  onSave: (data: any) => void;
}> = ({ isOpen, onClose, nodeData, onSave }) => {
  
  const [formData, setFormData] = React.useState({
    title: nodeData.title || '',
    description: nodeData.description || '',
    url: getValidUrl(nodeData.customImage) || getValidUrl(nodeData.url) || '',
  });
  const [previewData, setPreviewData] = React.useState<any>(nodeData.properties?.previewData || null);
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);

  // Effect to reset form state when modal opens with new data
  React.useEffect(() => {
    if (isOpen) {
      const cleanUrl = getValidUrl(nodeData.customImage) || getValidUrl(nodeData.url) || '';
      console.log(`[EditNodeModal] Setting clean URL: "${cleanUrl}" from nodeData:`, {
        customImage: nodeData.customImage,
        url: nodeData.url,
        image: nodeData.image
      });
      
      setFormData({
        title: nodeData.title || '',
        description: nodeData.description || '',
        url: cleanUrl,
      });
      setPreviewData(nodeData.properties?.previewData || null);
      setIsPreviewLoading(false);
    }
  }, [isOpen, nodeData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    let finalImage = null;

    // Logic to determine the final image URL
    if (formData.url) {
      if (previewData?.images?.length) {
        finalImage = previewData.images[0];
      } else if (previewData?.image) {
        finalImage = previewData.image;
      } else if (/\.(jpeg|jpg|gif|png|webp|svg)$/i.test(formData.url)) {
        // If it's a direct image link, use it.
        finalImage = formData.url;
      }
    }

    const saveData = {
      ...nodeData,
      title: formData.title || previewData?.title,
      description: formData.description || previewData?.description,
      customImage: formData.url,
      image: finalImage,
      properties: {
        ...nodeData.properties,
        customMockup: formData.url,
        previewData: previewData,
      },
    };

    console.log(`[EditNodeModal] Saving node data for ${nodeData.id}:`, {
      nodeId: nodeData.id,
      originalData: nodeData,
      formData: formData,
      previewData: previewData,
      finalSaveData: saveData,
      finalImage: finalImage,
      willSavePreviewData: !!previewData
    });

    onSave(saveData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
      }}
    >
      <div 
        className="bg-gray-900/95 backdrop-blur-lg rounded-xl border border-gray-700/50 w-full max-w-lg max-h-[95vh] flex flex-col shadow-2xl mt-4 sm:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50 shrink-0">
          <h3 className="text-lg font-semibold text-white">Edit Component</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
          <div className="p-4 sm:p-6 space-y-5">
            {/* Title Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-800/70 transition-all text-sm sm:text-base"
                placeholder="Component name"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-800/70 transition-all resize-none text-sm sm:text-base"
                rows={3}
                placeholder="Component description"
              />
            </div>

            {/* URL Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Custom Image URL or Website URL
              </label>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-800/70 transition-all text-sm sm:text-base"
                placeholder="https://example.com"
              />
              
              {/* Help Text */}
              <div className="bg-gray-800/30 rounded-lg p-3 space-y-2">
                <p className="text-xs text-gray-400">
                  Paste any image URL or website URL to generate a preview
                </p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1 text-green-400">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    Images (.jpg, .png, .gif)
                  </span>
                  <span className="flex items-center gap-1 text-blue-400">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Websites (http/https)
                  </span>
                </div>
              </div>
            </div>

            {/* URL Preview Component */}
            {(formData.url && getValidUrl(formData.url)) || previewData ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-300">
                  🌐 Website Preview
                </label>
                <div className="bg-gray-800/50 border-2 border-green-500/50 rounded-lg p-4 min-h-[200px]">
                  <div className="w-full">
                    {/* Preview metadata */}
                    {previewData && (
                      <div className="mb-4 p-3 bg-green-900/30 border border-green-500/30 rounded text-green-100 text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="w-4 h-4" />
                          <strong>Live Preview:</strong> {previewData.title}
                        </div>
                        <div className="text-green-200">
                          <div><strong>Domain:</strong> {previewData.domain}</div>
                          <div><strong>Description:</strong> {previewData.description?.substring(0, 100)}...</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Actual UrlPreviewCard component */}
                    <div className="border border-white/20 rounded-lg overflow-hidden min-h-[120px] bg-white/5">
                      <UrlPreviewCard
                        key={`preview-${nodeData.id || 'new'}-${formData.url || 'existing'}`}
                        initialUrl={formData.url || ''}
                        initialPreviewData={previewData}
                        showUrlInput={false}
                        compact={true}
                        onPreviewFetched={(data) => {
                          if (data) {
                            console.log(`[Modal] Preview loaded: ${data.domain}`);
                            setPreviewData(data);
                          }
                        }}
                        onLoadingChange={setIsPreviewLoading}
                        className="preview-card-dark w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Show empty preview area when there's a URL but no preview yet
              formData.url && getValidUrl(formData.url) && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Preview
                  </label>
                  <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-3 min-h-[120px] flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      {isPreviewLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading preview...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <span>Waiting for preview...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex gap-3 p-4 sm:p-6 border-t border-gray-700/50 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700/50 hover:bg-gray-600/70 text-white py-2.5 px-4 rounded-lg transition-all font-medium text-sm sm:text-base backdrop-blur-sm border border-gray-600/30"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPreviewLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-all font-medium text-sm sm:text-base shadow-lg hover:shadow-blue-600/25 flex items-center justify-center disabled:bg-blue-500/50 disabled:cursor-not-allowed"
          >
            {isPreviewLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Carregando...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main CustomNode Component
export const CustomNode: React.FC<NodeProps<CustomNodeData>> = React.memo(({ 
  data, 
  selected, 
  id 
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isConnectionTarget, setIsConnectionTarget] = React.useState(false);
  const reactFlowInstance = useReactFlow();
  
  const template: ComponentTemplate = useMemo(() => {
    const foundTemplate = componentTemplates.find(t => t.type === data.originalType);
    
    if (!foundTemplate) {
      return {
        id: `custom-${data.originalType}`,
        name: data.title || 'Unknown',
        type: data.originalType || 'unknown',
        category: 'custom',
        icon: '🔧',
        description: data.description || 'Custom component',
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          properties: {}
        }
      };
    }
    
    return foundTemplate;
  }, [data, componentTemplates]);

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
    if (newData.properties?.previewData) {
      console.log(`[CustomNode] ${id}: Saving with live preview from ${newData.properties.previewData.domain}`);
    }

    const allNodes = reactFlowInstance.getNodes();
    const allEdges = reactFlowInstance.getEdges();

    const updatedNodes = allNodes.map(n =>
      n.id === id
        ? {
            ...n,
            data: {
              ...n.data,
              ...newData,
              // Ensure customImage is also updated if it's the source
              customImage: newData.customImage || n.data.customImage,
            },
          }
        : n
    );
    
    reactFlowInstance.setNodes(updatedNodes);
    reactFlowInstance.setEdges(allEdges);
    setIsEditModalOpen(false);
  };

  // Detect component type using our utility
  const componentType = detectComponentType(componentTemplate);

  // Debug log only once per component load (not on every render)
  React.useEffect(() => {
    console.log(`🎨 [CustomNode] ${id}: ${data.originalType} → ${componentType}`, {
      componentId: id,
      componentTitle: data.title,
      templateLabel: template.label,
      originalType: data.originalType,
      category: template.category,
      detectedType: componentType,
      renderingAs: componentType === 'source' ? 'SourceComponentRenderer' :
                   componentType === 'page' ? 'PageComponentRenderer' :
                   'ActionComponentRenderer'
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
          id="left-target"
          className="w-3 h-3 !bg-blue-500 !border-2 !border-blue-300 hover:!scale-110 transition-transform"
          style={{ left: -6, top: '50%', transform: 'translateY(-50%)' }}
        />
        
        <Handle
          type="target"
          position={Position.Top}
          id="top-target"
          className="w-3 h-3 !bg-blue-500 !border-2 !border-blue-300 hover:!scale-110 transition-transform"
          style={{ top: -6, left: '50%', transform: 'translateX(-50%)' }}
        />
        
        <Handle
          type="target"
          position={Position.Bottom}
          id="bottom-target"
          className="w-3 h-3 !bg-blue-500 !border-2 !border-blue-300 hover:!scale-110 transition-transform"
          style={{ bottom: -6, left: '50%', transform: 'translateX(-50%)' }}
        />
        
        <Handle
          type="source"
          position={Position.Right}
          id="right-source"
          className="w-3 h-3 !bg-green-500 !border-2 !border-green-300 hover:!scale-110 transition-transform"
          style={{ right: -6, top: '50%', transform: 'translateY(-50%)' }}
        />
        
        <Handle
          type="source"
          position={Position.Top}
          id="top-source"
          className="w-3 h-3 !bg-green-500 !border-2 !border-green-300 hover:!scale-110 transition-transform"
          style={{ top: -6, left: '50%', transform: 'translateX(-50%)' }}
        />
        
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom-source"
          className="w-3 h-3 !bg-green-500 !border-2 !border-green-300 hover:!scale-110 transition-transform"
          style={{ bottom: -6, left: '50%', transform: 'translateX(-50%)' }}
        />
        
        <Handle
          type="source"
          position={Position.Left}
          id="left-source"
          className="w-3 h-3 !bg-green-500 !border-2 !border-green-300 hover:!scale-110 transition-transform"
          style={{ left: -6, top: '50%', transform: 'translateY(-50%)' }}
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
