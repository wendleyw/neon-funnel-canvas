import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { 
  Edit2, 
  Trash2, 
  Link, 
  Copy, 
  Play,
  Pause,
  Settings,
  Zap
} from 'lucide-react';

// Mock dos templates - você pode melhorar isso depois
const getTemplateInfo = (type: string) => {
  const templateMap: Record<string, { icon: string; color: string; label: string }> = {
    'landing-page': { icon: '🎯', color: '#3B82F6', label: 'Landing Page' },
    'quiz': { icon: '❓', color: '#8B5CF6', label: 'Quiz' },
    'form': { icon: '📝', color: '#10B981', label: 'Formulário' },
    'email-sequence': { icon: '📧', color: '#F59E0B', label: 'E-mail Sequence' },
    'checkout': { icon: '💳', color: '#EF4444', label: 'Checkout' },
    'sales-page': { icon: '💰', color: '#DC2626', label: 'Sales Page' },
    'note': { icon: '📝', color: '#FBBF24', label: 'Nota' },
    'arrow': { icon: '➡️', color: '#3B82F6', label: 'Seta' },
    'frame': { icon: '⬜', color: '#6B7280', label: 'Frame' },
    'webinar-live': { icon: '🎥', color: '#EF4444', label: 'Webinar Live' },
    'webinar-replay': { icon: '🎬', color: '#7C2D12', label: 'Webinar Replay' },
    'opt-in-page': { icon: '📥', color: '#8B5CF6', label: 'Opt-in Page' },
    'download-page': { icon: '📥', color: '#8B5CF6', label: 'Download Page' },
    'thank-you-page': { icon: '✅', color: '#10B981', label: 'Thank You Page' },
    'calendar-page': { icon: '📅', color: '#3B82F6', label: 'Calendar Page' },
    'default': { icon: '🔧', color: '#6B7280', label: 'Componente' }
  };
  
  return templateMap[type] || templateMap.default;
};

// Component to create simple, clean mockups for different page types in canvas nodes
const ComponentPreviewMockup: React.FC<{ type: string; className?: string }> = ({ type, className = '' }) => {
  const getMockupContent = () => {
    switch (type) {
      case 'landing-page':
        return (
          <div className="w-full h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden">
            <div className="h-1 bg-blue-500"></div>
            <div className="p-1 space-y-0.5">
              <div className="w-full h-1.5 bg-blue-500 rounded-sm"></div>
              <div className="w-3/4 h-0.5 bg-gray-500 rounded-sm"></div>
              <div className="w-8 h-1 bg-green-500 rounded-sm mt-1"></div>
            </div>
          </div>
        );

      case 'sales-page':
        return (
          <div className="w-full h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden">
            <div className="h-0.5 bg-red-500"></div>
            <div className="p-1 space-y-0.5">
              <div className="w-full h-1.5 bg-red-500 rounded-sm"></div>
              <div className="w-4/5 h-1.5 bg-red-500 rounded-sm"></div>
              <div className="w-full h-0.5 bg-gray-500 rounded-sm"></div>
              <div className="w-6 h-1 bg-yellow-400 rounded-sm"></div>
              <div className="w-8 h-0.5 bg-red-500 rounded-sm"></div>
            </div>
          </div>
        );

      case 'opt-in-page':
      case 'download-page':
        return (
          <div className="w-full h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden">
            <div className="p-1 space-y-0.5 text-center">
              <div className="w-3 h-0.5 bg-purple-500 rounded-sm mx-auto"></div>
              <div className="w-full h-1 bg-purple-500 rounded-sm"></div>
              <div className="w-full h-0.5 bg-gray-600 border border-gray-500 rounded-sm mt-1"></div>
              <div className="w-6 h-0.5 bg-purple-500 rounded-sm mx-auto"></div>
            </div>
          </div>
        );

      case 'webinar-live':
      case 'webinar-replay':
        return (
          <div className="w-full h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-2 h-0.5 bg-red-500 rounded-sm"></div>
              <div className="w-full h-2.5 bg-gray-700 rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="w-full h-0.5 bg-gray-500 rounded-sm"></div>
              <div className="w-6 h-0.5 bg-red-500 rounded-sm"></div>
            </div>
          </div>
        );

      case 'thank-you-page':
        return (
          <div className="w-full h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden">
            <div className="p-1 space-y-0.5 text-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                <div className="w-0.5 h-0.5 bg-white rounded-sm"></div>
              </div>
              <div className="w-2/3 h-1 bg-green-500 rounded-sm mx-auto"></div>
              <div className="w-full h-0.5 bg-gray-500 rounded-sm"></div>
            </div>
          </div>
        );

      case 'calendar-page':
        return (
          <div className="w-full h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-3/4 h-0.5 bg-blue-500 rounded-sm"></div>
              <div className="grid grid-cols-4 gap-0.5">
                <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                <div className="w-full h-0.5 bg-blue-500 rounded-sm"></div>
                <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
              </div>
              <div className="w-6 h-0.5 bg-blue-500 rounded-sm"></div>
            </div>
          </div>
        );

      case 'email-sequence':
        return (
          <div className="w-full h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                <div className="w-3/4 h-0.5 bg-yellow-500 rounded-sm"></div>
              </div>
              <div className="w-full h-0.5 bg-gray-500 rounded-sm"></div>
              <div className="w-2/3 h-0.5 bg-gray-500 rounded-sm"></div>
              <div className="w-4 h-0.5 bg-yellow-500 rounded-sm"></div>
            </div>
          </div>
        );

      case 'checkout':
        return (
          <div className="w-full h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-3/4 h-0.5 bg-red-500 rounded-sm"></div>
              <div className="flex gap-1">
                <div className="w-1/2 h-1 bg-gray-600 border border-gray-500 rounded-sm"></div>
                <div className="w-1/2 h-1 bg-gray-600 border border-gray-500 rounded-sm"></div>
              </div>
              <div className="w-full h-1 bg-green-500 rounded-sm"></div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="w-full h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-full h-1 bg-purple-500 rounded-sm"></div>
              <div className="space-y-0.5">
                <div className="w-3/4 h-0.5 bg-gray-600 border border-gray-500 rounded-sm"></div>
                <div className="w-3/4 h-0.5 bg-gray-600 border border-gray-500 rounded-sm"></div>
              </div>
              <div className="w-6 h-0.5 bg-purple-500 rounded-sm"></div>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="w-full h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-2/3 h-0.5 bg-green-500 rounded-sm"></div>
              <div className="space-y-0.5">
                <div className="w-full h-0.5 bg-gray-600 border border-gray-500 rounded-sm"></div>
                <div className="w-full h-0.5 bg-gray-600 border border-gray-500 rounded-sm"></div>
                <div className="w-full h-0.5 bg-gray-600 border border-gray-500 rounded-sm"></div>
              </div>
              <div className="w-8 h-0.5 bg-green-500 rounded-sm"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-16 bg-gray-800 rounded border border-gray-600 overflow-hidden">
            <div className="p-1 space-y-0.5">
              <div className="w-full h-1.5 bg-gray-500 rounded-sm"></div>
              <div className="w-4/5 h-0.5 bg-gray-500 rounded-sm"></div>
              <div className="w-6 h-1 bg-gray-500 rounded-sm mt-1"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {getMockupContent()}
    </div>
  );
};

// Connection validation helper
const isValidConnection = (connection: any, nodeType: string) => {
  return true; // Simplified for now
};

// Add render counter at the top of the file
let customNodeRenderCount = 0;

export const CustomNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  // IMMEDIATE DEBUG - Track all render attempts with enhanced visibility
  customNodeRenderCount++;
  console.log('🏗️ ===== CUSTOM NODE RENDER =====');
  console.log('🏗️ Render Count:', customNodeRenderCount);
  console.log('🏗️ Node ID:', id);
  console.log('🏗️ Original Type:', data.originalType);
  console.log('🏗️ Title:', data.title);
  console.log('🏗️ Selected:', selected);
  console.log('🏗️ Handles should be rendered: 4 (top, right, bottom, left)');
  console.log('🏗️ ===============================');
  
  const template = getTemplateInfo(data.originalType || 'default');
  const reactFlowInstance = useReactFlow();
  
  // Enhanced debug logging
  React.useEffect(() => {
    console.log('🎨 CustomNode rendering:', {
      id,
      type: data.originalType,
      title: data.title,
      position: { x: 'calculated by ReactFlow', y: 'calculated by ReactFlow' },
      template: template.label,
      selected
    });
  }, [id, data.originalType, data.title, template.label, selected]);
  
  // Debug logging
  React.useEffect(() => {
    if (selected) {
      console.log('✅ Component selected:', id, data.title || template.label);
    }
  }, [selected, id, data.title, template.label]);
  
  // Get status info
  const getStatusInfo = () => {
    const status = data.status;
    switch (status) {
      case 'active':
        return { color: '#10B981', icon: Play, text: 'Active' };
      case 'inactive':
        return { color: '#F59E0B', icon: Pause, text: 'Inactive' };
      case 'draft':
        return { color: '#6B7280', icon: Settings, text: 'Draft' };
      case 'test':
        return { color: '#8B5CF6', icon: Zap, text: 'Test' };
      case 'published':
        return { color: '#10B981', icon: Play, text: 'Published' };
      default:
        return { color: '#8B5CF6', icon: Zap, text: 'Ready' };
    }
  };

  // Handle click to connect
  const handleNodeClick = () => {
    console.log('🎯 Node clicked for connection:', id);
    
    // Get connection state from global store or context if available
    const connectionState = (window as any).__connectionState || {};
    
    if (connectionState.isConnecting && connectionState.sourceNodeId) {
      // We're in connection mode and have a source, create connection
      if (connectionState.sourceNodeId !== id) {
        console.log('✨ Creating connection from', connectionState.sourceNodeId, 'to', id);
        
        // Create connection using AnimatedNodeEdge
        const newEdge = {
          id: `edge-${Date.now()}`,
          source: connectionState.sourceNodeId,
          target: id,
          type: 'animatedNode',
          data: { 
            node: `lead-${Date.now()}`,
            label: 'Lead' 
          },
          animated: true,
          style: { 
            stroke: '#10B981', 
            strokeWidth: 2 
          },
        };
        
        // Add edge to the flow
        const edges = reactFlowInstance.getEdges();
        reactFlowInstance.setEdges([...edges, newEdge]);
        
        console.log('✅ Created animated connection:', newEdge);
        
        // Clear connection state
        (window as any).__connectionState = { isConnecting: false, sourceNodeId: null };
        
        // Notify parent component if callback exists
        if ((window as any).__onConnectionAdd) {
          (window as any).__onConnectionAdd({
            id: newEdge.id,
            from: newEdge.source,
            to: newEdge.target,
            type: 'lead',
            color: '#10B981',
            animated: true,
          });
        }
      } else {
        console.log('❌ Cannot connect to same node');
      }
    } else {
      // Start connection mode
      (window as any).__connectionState = { isConnecting: true, sourceNodeId: id };
      console.log('🎯 Starting connection from:', id);
    }
  };

  // Handle action buttons
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('✏️ Edit component:', id);
    alert('Função de edição será implementada em breve!');
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('📋 Duplicate component:', id);
    alert('Função de duplicação será implementada em breve!');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🗑️ Delete component:', id);
    if (confirm('Tem certeza que deseja excluir este componente?')) {
      // Call parent delete function if available
      if ((window as any).__onComponentDelete) {
        (window as any).__onComponentDelete(id);
      } else {
        alert('Função de exclusão será implementada em breve!');
      }
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  
  // Check if this node is the source of an active connection
  const connectionState = (window as any).__connectionState || {};
  const isConnectionSource = connectionState.isConnecting && connectionState.sourceNodeId === id;
  const isInConnectionMode = connectionState.isConnecting;

  return (
    <div className="group relative">
      {/* Selection indicator */}
      {selected && (
        <div className="absolute -top-3 -left-3 -right-3 -bottom-3 border-2 border-blue-500 rounded-xl bg-blue-500/5 animate-pulse z-10"></div>
      )}

      {/* Connection indicator */}
      {isConnectionSource && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm z-30 animate-pulse shadow-lg">
          <div className="text-center">
            <div className="font-semibold">🔗 Modo Conexão</div>
            <div className="text-xs mt-1">Clique em outro componente</div>
          </div>
        </div>
      )}
      
      {/* Connection mode overlay */}
      {isInConnectionMode && !isConnectionSource && (
        <div className="absolute inset-0 border-2 border-dashed border-green-500 rounded-lg bg-green-500/10 animate-pulse cursor-pointer z-20 flex items-center justify-center"
             onClick={handleNodeClick}
        >
          <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
            🎯 Clique aqui para conectar
          </div>
        </div>
      )}

      {/* Card Simplificado */}
      <div
        className={`
          relative w-64 bg-gray-900 rounded-lg shadow-lg border-2 overflow-hidden 
          transition-all duration-200 ease-out hover:shadow-xl
          ${selected ? 'border-blue-500 shadow-blue-500/30 ring-2 ring-blue-500/20' : 'border-gray-700 hover:border-gray-600'}
          ${isConnectionSource ? 'border-blue-500 shadow-blue-500/50 ring-2 ring-blue-500/30' : ''}
          ${isInConnectionMode && !isConnectionSource ? 'hover:border-green-500 hover:shadow-green-500/30' : ''}
        `}
      >
        {/* Enhanced Handles with better positioning and tooltips */}
        
        {/* Top handles */}
        <Handle
          id="top-target"
          type="target"
          position={Position.Top}
          className="w-5 h-5 !bg-blue-500 !border-3 !border-blue-300 hover:!bg-blue-400 hover:!border-blue-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
          style={{ 
            top: -12, 
            left: '30%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: '#3B82F6 !important',
            border: '3px solid #60A5FA !important',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8) !important'
          }}
          title="🔵 INPUT - Arraste de outro componente para cá"
        />
        
        <Handle
          id="top-source"
          type="source"
          position={Position.Top}
          className="w-5 h-5 !bg-green-500 !border-3 !border-green-300 hover:!bg-green-400 hover:!border-green-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
          style={{ 
            top: -12, 
            left: '70%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: '#10B981 !important',
            border: '3px solid #34D399 !important',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.8) !important'
          }}
          title="🟢 OUTPUT - Arraste daqui para outro componente"
        />
        
        {/* Right handles */}
        <Handle
          id="right-target"
          type="target"
          position={Position.Right}
          className="w-5 h-5 !bg-blue-500 !border-3 !border-blue-300 hover:!bg-blue-400 hover:!border-blue-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
          style={{ 
            right: -12, 
            top: '30%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            background: '#3B82F6 !important',
            border: '3px solid #60A5FA !important',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8) !important'
          }}
          title="🔵 INPUT - Arraste de outro componente para cá"
        />
        
        <Handle
          id="right-source"
          type="source"
          position={Position.Right}
          className="w-5 h-5 !bg-green-500 !border-3 !border-green-300 hover:!bg-green-400 hover:!border-green-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
          style={{ 
            right: -12, 
            top: '70%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            background: '#10B981 !important',
            border: '3px solid #34D399 !important',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.8) !important'
          }}
          title="🟢 OUTPUT - Arraste daqui para outro componente"
        />
        
        {/* Bottom handles */}
        <Handle
          id="bottom-target"
          type="target"
          position={Position.Bottom}
          className="w-5 h-5 !bg-blue-500 !border-3 !border-blue-300 hover:!bg-blue-400 hover:!border-blue-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
          style={{ 
            bottom: -12, 
            left: '30%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: '#3B82F6 !important',
            border: '3px solid #60A5FA !important',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8) !important'
          }}
          title="🔵 INPUT - Arraste de outro componente para cá"
        />
        
        <Handle
          id="bottom-source"
          type="source"
          position={Position.Bottom}
          className="w-5 h-5 !bg-green-500 !border-3 !border-green-300 hover:!bg-green-400 hover:!border-green-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
          style={{ 
            bottom: -12, 
            left: '70%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: '#10B981 !important',
            border: '3px solid #34D399 !important',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.8) !important'
          }}
          title="🟢 OUTPUT - Arraste daqui para outro componente"
        />
        
        {/* Left handles */}
        <Handle
          id="left-target"
          type="target"
          position={Position.Left}
          className="w-5 h-5 !bg-blue-500 !border-3 !border-blue-300 hover:!bg-blue-400 hover:!border-blue-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
          style={{ 
            left: -12, 
            top: '30%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            background: '#3B82F6 !important',
            border: '3px solid #60A5FA !important',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8) !important'
          }}
          title="🔵 INPUT - Arraste de outro componente para cá"
        />
        
        <Handle
          id="left-source"
          type="source"
          position={Position.Left}
          className="w-5 h-5 !bg-green-500 !border-3 !border-green-300 hover:!bg-green-400 hover:!border-green-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
          style={{ 
            left: -12, 
            top: '70%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            background: '#10B981 !important',
            border: '3px solid #34D399 !important',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.8) !important'
          }}
          title="🟢 OUTPUT - Arraste daqui para outro componente"
        />

        {/* Header Colorido */}
        <div 
          className="h-1 w-full"
          style={{ backgroundColor: template.color }}
        />

        {/* Conteúdo Principal */}
        <div className="p-4">
          {/* Ícone e Título */}
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-semibold border-2"
              style={{ 
                backgroundColor: `${template.color}20`,
                borderColor: `${template.color}40`,
                color: template.color
              }}
            >
              {template.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm leading-tight truncate">
                {data.title || template.label}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <StatusIcon className="w-3 h-3" style={{ color: statusInfo.color }} />
                  <span className="text-xs" style={{ color: statusInfo.color }}>
                    {statusInfo.text}
                  </span>
                </div>
                {/* Connection mode indicator */}
                {isInConnectionMode && (
                  <span className="text-xs text-blue-400 animate-pulse">
                    {isConnectionSource ? '📡 Conectando...' : '🎯 Clique'}
                  </span>
                )}
                
                {/* Selection indicator */}
                {selected && !isInConnectionMode && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    Selecionado
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Preview Mockup */}
          <div className="mb-3">
            <ComponentPreviewMockup type={data.originalType || 'default'} />
          </div>

          {/* Preview/Descrição */}
          {data.description && (
            <div className="mb-3">
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                {data.description}
              </p>
            </div>
          )}

          {/* AÇÕES CONDICIONAIS - mostrar apenas quando selecionado */}
          {selected && (
            <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2 border border-gray-700 transition-all duration-300 animate-in slide-in-from-bottom">
              <div className="flex items-center gap-1">
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-all duration-200 flex items-center justify-center"
                  title="Editar componente"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick();
                  }}
                  className={`p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-md transition-all duration-200 flex items-center justify-center ${
                    isConnectionSource ? 'bg-blue-600 text-white' : ''
                  }`}
                  title="Conectar com outro componente"
                >
                  <Link className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDuplicate}
                  className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-md transition-all duration-200 flex items-center justify-center"
                  title="Duplicar componente"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-md transition-all duration-200 flex items-center justify-center"
                title="Excluir componente"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomNode; 