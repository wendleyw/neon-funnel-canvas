import React, { useCallback, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { CreateProjectModal } from './ProjectCreator/CreateProjectModal';
import { OpenProjectModal } from './OpenProjectModal';
import { FunnelProject, FunnelComponent } from '../types/funnel';
import { DrawingShape } from '../types/drawing';
import { canvasAddService } from '../services/CanvasAddService';
import { useProjectHandlers } from '../hooks/useProjectHandlers';
import { useIsMobile } from '../hooks/use-mobile';
import { useHotkeys } from 'react-hotkeys-hook';
import { Menu, X } from 'lucide-react';

interface FunnelEditorProps {
  project: FunnelProject;
  setProject: React.Dispatch<React.SetStateAction<FunnelProject>>;
  currentProjectId: string | null;
  setCurrentProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  loadProjectData: (projectData: FunnelProject, projectId?: string) => void;
  resetProject: () => void;
  enterEditor: () => void;
  onBackToWorkspace: () => void;
  handleProjectNameChange: (name: string) => void;
  currentWorkspace?: { id: string; name: string; description?: string } | null;
}

export const FunnelEditor: React.FC<FunnelEditorProps> = ({
  project,
  setProject,
  currentProjectId,
  setCurrentProjectId,
  loadProjectData,
  resetProject,
  enterEditor,
  onBackToWorkspace,
  handleProjectNameChange,
  currentWorkspace
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const isMobile = useIsMobile();

  const projectHandlers = useProjectHandlers({
    project,
    setProject,
    currentProjectId,
    setCurrentProjectId,
    loadProjectData,
    resetProject,
    enterEditor
  });

  // Handle sidebar panel state change
  const handlePanelStateChange = useCallback((isExpanded: boolean) => {
    if (!isMobile) {
      setIsSidebarOpen(isExpanded);
    }
  }, [isMobile]);

  // Toggle mobile sidebar
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  // Close mobile sidebar when clicking outside or selecting template
  const closeMobileSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  const handleDragStart = useCallback((template: any) => {
    console.log('🚀 [FunnelEditor] Drag started for template:', template);
  }, []);

  const handleProjectCreate = useCallback((newProject: FunnelProject) => {
    loadProjectData(newProject);
    setIsCreateModalOpen(false);
  }, [loadProjectData]);

  const handleProjectOpen = useCallback((loadedProject: FunnelProject) => {
    loadProjectData(loadedProject);
    setIsOpenModalOpen(false);
  }, [loadProjectData]);

  const handleLoad = useCallback(() => {
    setIsOpenModalOpen(true);
  }, []);

  // Simplified component addition using the new service
  const handleComponentAdd = useCallback((template: any) => {
    console.log('🚀 [FunnelEditor] Component add requested:', template);
    
    const success = canvasAddService.addComponentTemplate(
      template,
      projectHandlers.handleComponentAdd,
      { position: { x: 400, y: 300 } }
    );
    
    if (success) {
      console.log('✅ [FunnelEditor] Component added successfully');
      closeMobileSidebar(); // Close mobile sidebar after adding component
    } else {
      console.error('❌ [FunnelEditor] Failed to add component');
    }
  }, [projectHandlers.handleComponentAdd, closeMobileSidebar]);

  // Simplified shape addition using the new service
  const handleShapeAdd = useCallback((shape: DrawingShape) => {
    console.log('🚀 [FunnelEditor] Shape add requested:', shape);
    
    const success = canvasAddService.addDiagramShape(
      shape,
      projectHandlers.handleComponentAdd,
      { position: shape.position || { x: 400, y: 300 } }
    );
    
    if (success) {
      console.log('✅ [FunnelEditor] Shape added successfully');
      closeMobileSidebar(); // Close mobile sidebar after adding shape
    } else {
      console.error('❌ [FunnelEditor] Failed to add shape');
    }
  }, [projectHandlers.handleComponentAdd, closeMobileSidebar]);

  // Debug methods for testing
  const addTestComponent = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding test component...');
    console.log('🧪 [FunnelEditor] Current project components before:', project.components.length);
    
    const success = canvasAddService.addTestComponent(projectHandlers.handleComponentAdd);
    
    // Check state after a short delay
    setTimeout(() => {
      console.log('🧪 [FunnelEditor] Project components after timeout:', project.components.length);
    }, 100);
    
    if (success) {
      console.log('✅ [FunnelEditor] Test component added successfully');
    } else {
      console.error('❌ [FunnelEditor] Failed to add test component');
    }
  }, [projectHandlers.handleComponentAdd, project.components.length]);

  const debugProjectState = useCallback(() => {
    console.log('🔍 [FunnelEditor] Current project state:', {
      components: project.components.map(c => ({
        id: c.id,
        type: c.type,
        title: c.data.title,
        position: c.position
      })),
      connectionsCount: project.connections.length,
      projectName: project.name
    });
  }, [project]);

  // Clear all components for fresh start
  const clearAllComponents = useCallback(() => {
    console.log('🧹 [FunnelEditor] Clearing all components...');
    setProject(prev => ({
      ...prev,
      components: [],
      connections: [],
      updatedAt: new Date().toISOString()
    }));
    console.log('✅ [FunnelEditor] All components cleared');
  }, [setProject]);

  // Individual component type tests - ALL REAL COMPONENTS FROM THE SYSTEM
  const addTestLandingPage = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Landing Page component...');
    const template = {
      type: 'landing-page',
      label: 'Landing Page',
      icon: '🎯',
      color: '#3B82F6',
      defaultProps: {
        title: 'Landing Page',
        description: 'Página de aterrissagem para capturar leads',
        status: 'active',
        properties: {}
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestQuiz = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Quiz component...');
    const template = {
      type: 'quiz',
      label: 'Quiz',
      icon: '❓',
      color: '#8B5CF6',
      defaultProps: {
        title: 'Quiz Interativo',
        description: 'Quiz para engajar e qualificar leads',
        status: 'active',
        properties: {}
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestForm = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Form component...');
    const template = {
      type: 'form',
      label: 'Formulário',
      icon: '📝',
      color: '#10B981',
      defaultProps: {
        title: 'Formulário',
        description: 'Formulário de captura de dados',
        status: 'active',
        properties: {}
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestEmailSequence = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Email Sequence component...');
    const template = {
      type: 'email-sequence',
      label: 'E-mail Sequence',
      icon: '📧',
      color: '#F59E0B',
      defaultProps: {
        title: 'Sequência de E-mails',
        description: 'Automação de e-mails para nutrição',
        status: 'active',
        properties: {}
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestCheckout = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Checkout component...');
    const template = {
      type: 'checkout',
      label: 'Checkout',
      icon: '💳',
      color: '#EF4444',
      defaultProps: {
        title: 'Página de Checkout',
        description: 'Finalização da compra',
        status: 'active',
        properties: {}
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestWebinarVSL = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Webinar/VSL component...');
    const template = {
      type: 'webinar-vsl',
      label: 'Webinar/VSL',
      icon: '🎥',
      color: '#6366F1',
      defaultProps: {
        title: 'Webinar/VSL',
        description: 'Webinar ou Video Sales Letter',
        status: 'active',
        properties: {}
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestSalesPage = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Sales Page component...');
    const template = {
      type: 'sales-page',
      label: 'Sales Page',
      icon: '💰',
      color: '#DC2626',
      defaultProps: {
        title: 'Página de Vendas',
        description: 'Página de vendas persuasiva',
        status: 'active',
        properties: {}
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestConversion = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Conversion component...');
    const template = {
      type: 'conversion',
      label: 'Conversion',
      icon: '📈',
      color: '#059669',
      defaultProps: {
        title: 'Conversão',
        description: 'Componente de conversão',
        status: 'active',
        properties: {}
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestCustom = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Custom component...');
    const template = {
      type: 'custom',
      label: 'Custom',
      icon: '⚙️',
      color: '#6B7280',
      defaultProps: {
        title: 'Componente Personalizado',
        description: 'Componente personalizado',
        status: 'active',
        properties: {}
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  // Visual Helper Components (Real ones from componentTemplates.ts)
  const addTestNote = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Note component...');
    const template = {
      type: 'note',
      label: 'Nota Adesiva',
      icon: '📝',
      color: '#FBBF24',
      defaultProps: {
        title: 'Nota',
        description: 'Clique para adicionar uma nota...',
        status: 'active',
        properties: { color: 'yellow' }
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestArrow = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Arrow component...');
    const template = {
      type: 'arrow',
      label: 'Seta',
      icon: '➡️',
      color: '#3B82F6',
      defaultProps: {
        title: 'Seta Direcional',
        description: 'Seta para indicar fluxo',
        status: 'active',
        properties: { direction: 'right', color: 'blue', size: 'medium' }
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestFrame = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Frame component...');
    const template = {
      type: 'frame',
      label: 'Frame',
      icon: '⬜',
      color: '#6B7280',
      defaultProps: {
        title: 'Frame',
        description: 'Organize seus componentes aqui',
        status: 'active',
        properties: { color: 'blue', size: 'medium', borderStyle: 'solid' }
      }
    };
    canvasAddService.addComponentTemplate(template, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  // ALL REAL DIAGRAM SHAPES (from DrawingTool types)
  const addTestRectangle = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Rectangle diagram...');
    const testShape: DrawingShape = {
      id: `rectangle-${Date.now()}`,
      type: 'rectangle',
      position: { x: 300, y: 200 },
      size: { width: 120, height: 80 },
      style: { fill: '#3B82F6', stroke: '#1E40AF', strokeWidth: 2 },
      text: 'Rectangle'
    };
    canvasAddService.addDiagramShape(testShape, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestCircle = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Circle diagram...');
    const testShape: DrawingShape = {
      id: `circle-${Date.now()}`,
      type: 'circle',
      position: { x: 450, y: 200 },
      size: { width: 80, height: 80 },
      style: { fill: '#10B981', stroke: '#059669', strokeWidth: 2 },
      text: 'Circle'
    };
    canvasAddService.addDiagramShape(testShape, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestDiamond = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Diamond diagram...');
    const testShape: DrawingShape = {
      id: `diamond-${Date.now()}`,
      type: 'diamond',
      position: { x: 600, y: 200 },
      size: { width: 100, height: 100 },
      style: { fill: '#F59E0B', stroke: '#D97706', strokeWidth: 2 },
      text: 'Diamond'
    };
    canvasAddService.addDiagramShape(testShape, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestArrowDiagram = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Arrow diagram...');
    const testShape: DrawingShape = {
      id: `arrow-${Date.now()}`,
      type: 'arrow',
      position: { x: 750, y: 200 },
      size: { width: 100, height: 40 },
      style: { fill: '#8B5CF6', stroke: '#7C3AED', strokeWidth: 2 },
      text: 'Arrow'
    };
    canvasAddService.addDiagramShape(testShape, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestFunnel = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Funnel diagram...');
    const testShape: DrawingShape = {
      id: `funnel-${Date.now()}`,
      type: 'funnel',
      position: { x: 900, y: 150 },
      size: { width: 120, height: 100 },
      style: { fill: '#EF4444', stroke: '#DC2626', strokeWidth: 2 },
      text: 'Funnel'
    };
    canvasAddService.addDiagramShape(testShape, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestText = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Text diagram...');
    const testShape: DrawingShape = {
      id: `text-${Date.now()}`,
      type: 'text',
      position: { x: 300, y: 350 },
      size: { width: 120, height: 40 },
      style: { fill: '#6B7280', stroke: '#374151', strokeWidth: 1 },
      text: 'Text Element'
    };
    canvasAddService.addDiagramShape(testShape, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestLine = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Line diagram...');
    const testShape: DrawingShape = {
      id: `line-${Date.now()}`,
      type: 'line',
      position: { x: 450, y: 350 },
      size: { width: 150, height: 6 },
      style: { fill: '#374151', stroke: '#374151', strokeWidth: 2 },
      text: 'Line'
    };
    canvasAddService.addDiagramShape(testShape, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestHexagon = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Hexagon diagram...');
    const testShape: DrawingShape = {
      id: `hexagon-${Date.now()}`,
      type: 'hexagon',
      position: { x: 620, y: 350 },
      size: { width: 90, height: 90 },
      style: { fill: '#EC4899', stroke: '#DB2777', strokeWidth: 2 },
      text: 'Hexagon'
    };
    canvasAddService.addDiagramShape(testShape, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestStar = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Star diagram...');
    const testShape: DrawingShape = {
      id: `star-${Date.now()}`,
      type: 'star',
      position: { x: 750, y: 350 },
      size: { width: 80, height: 80 },
      style: { fill: '#F59E0B', stroke: '#D97706', strokeWidth: 2 },
      text: 'Star'
    };
    canvasAddService.addDiagramShape(testShape, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  const addTestConnector = useCallback(() => {
    console.log('🧪 [FunnelEditor] Adding Connector diagram...');
    const testShape: DrawingShape = {
      id: `connector-${Date.now()}`,
      type: 'connector',
      position: { x: 880, y: 350 },
      size: { width: 100, height: 20 },
      style: { fill: '#059669', stroke: '#047857', strokeWidth: 2 },
      text: 'Connector'
    };
    canvasAddService.addDiagramShape(testShape, projectHandlers.handleComponentAdd);
  }, [projectHandlers.handleComponentAdd]);

  useHotkeys('ctrl+s, command+s', (e) => {
    e.preventDefault();
    projectHandlers.handleSave();
  });

  // Debug hotkey
  useHotkeys('d', () => setShowDebugPanel(prev => !prev), {
    enableOnFormTags: false,
    preventDefault: true
  });

  return (
    <div className="h-screen w-screen bg-black text-white flex overflow-hidden relative">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Debug Panel - Only on desktop */}
      {!isMobile && showDebugPanel && (
        <div className="fixed right-4 top-4 bottom-4 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-40 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Debug Panel</h3>
              <button
                onClick={() => setShowDebugPanel(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Debug controls go here - keeping existing debug code */}
            <div className="space-y-3">
              <button
                onClick={debugProjectState}
                className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                🔍 Debug State
              </button>
              <button
                onClick={clearAllComponents}
                className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                🧹 Clear All
              </button>
              <button
                onClick={addTestComponent}
                className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                🧪 Add Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-40 w-96 transform transition-transform duration-300 ease-in-out ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : `flex-shrink-0 border-r border-gray-800 transition-all duration-300 ${
              isSidebarOpen ? 'w-96' : 'w-16'
            }`
        }
      `}>
        <Sidebar 
          onDragStart={handleDragStart} 
          onAddCompleteTemplate={handleComponentAdd}
          onShapeAdd={handleShapeAdd}
          onTemplateClick={handleComponentAdd}
          onPanelStateChange={handlePanelStateChange}
        />
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${isMobile ? 'w-full' : ''}`}>
        {/* Toolbar */}
        <div className="flex-shrink-0 border-b border-gray-800">
          <Toolbar 
            onSave={projectHandlers.handleSave}
            onLoad={handleLoad}
            onExport={projectHandlers.handleExport}
            onClear={projectHandlers.handleClear}
            onBackToWorkspace={onBackToWorkspace}
            projectName={project.name}
            onProjectNameChange={handleProjectNameChange}
            workspaceName={currentWorkspace?.name || ''}
            componentsCount={project.components.length}
            project={project}
          />
        </div>
        
        {/* Canvas Area - Takes full remaining space */}
        <div className="flex-1 relative overflow-hidden">
          <Canvas
            components={project.components}
            connections={project.connections}
            onComponentAdd={projectHandlers.handleComponentAdd}
            onComponentUpdate={projectHandlers.handleComponentUpdate}
            onComponentDelete={projectHandlers.handleComponentDelete}
            onConnectionAdd={projectHandlers.handleConnectionAdd}
            onConnectionDelete={projectHandlers.handleConnectionDelete}
            onConnectionUpdate={projectHandlers.handleConnectionUpdate}
          />
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleProjectCreate}
      />

      <OpenProjectModal
        isOpen={isOpenModalOpen}
        onClose={() => setIsOpenModalOpen(false)}
        onProjectOpen={handleProjectOpen}
      />
    </div>
  );
};
