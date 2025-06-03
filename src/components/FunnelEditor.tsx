import React, { useCallback, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import ReactFlowCanvasWrapper from './ReactFlowCanvas';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
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
    console.log('🚀 [FunnelEditor] Template type:', typeof template);
    console.log('🚀 [FunnelEditor] Template keys:', Object.keys(template || {}));
    
    // Marcar que um drag está ativo para melhor UX
    setIsDragActive(true);
    
    // Adicionar verificação se o template tem a estrutura esperada
    if (template && template.type && template.label) {
      console.log('✅ [FunnelEditor] Template structure looks good');
    } else {
      console.warn('⚠️ [FunnelEditor] Template structure may be invalid:', template);
    }
    
    // Add enhanced debugging for drag events
    console.log('🔍 [FunnelEditor] Drag debugging:');
    console.log('  - Browser:', navigator.userAgent);
    console.log('  - Touch device:', 'ontouchstart' in window);
    console.log('  - Mobile detected:', isMobile);
    
    // Test if we can access clipboard/dataTransfer APIs
    try {
      const testTransfer = new DataTransfer();
      console.log('  - DataTransfer API:', 'Available');
    } catch (e) {
      console.warn('  - DataTransfer API:', 'Not available', e);
    }
  }, [isMobile]);

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
    console.log('🚀 [FunnelEditor] Template structure check:');
    console.log('  - Type:', template?.type);
    console.log('  - Label:', template?.label);
    console.log('  - DefaultProps:', template?.defaultProps);
    console.log('  - Has projectHandlers.handleComponentAdd:', typeof projectHandlers.handleComponentAdd);
    
    try {
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
    } catch (error) {
      console.error('❌ [FunnelEditor] Error in handleComponentAdd:', error);
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

  useHotkeys('ctrl+s, command+s', (e) => {
    e.preventDefault();
    projectHandlers.handleSave();
  });

  // Quando o drag terminar, resetar o estado
  useEffect(() => {
    const handleDragEnd = () => {
      setIsDragActive(false);
    };

    // Adicionar listener global para detectar quando o drag termina
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('drop', handleDragEnd);

    return () => {
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('drop', handleDragEnd);
    };
  }, []);

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
        
        {/* Canvas Area - React Flow is now the main canvas */}
        <div className="flex-1 relative overflow-hidden">
          <ReactFlowCanvasWrapper
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
