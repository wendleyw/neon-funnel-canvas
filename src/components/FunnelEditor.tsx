import React, { useCallback, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import ReactFlowCanvasWrapper from './ReactFlowCanvas';
import { Toolbar } from './Toolbar';
import { CreateProjectModal } from './ProjectCreator/CreateProjectModal';
import { OpenProjectModal } from './OpenProjectModal';
import { FunnelProject, FunnelComponent, ComponentTemplate } from '../types/funnel';
import { DrawingShape } from '../types/drawing';
import { canvasAddService } from '../services/CanvasAddService';
import { useProjectHandlers } from '../hooks/useProjectHandlers';
import { useIsMobile } from '../hooks/use-mobile';
import { useHotkeys } from 'react-hotkeys-hook';
import { Menu, X } from 'lucide-react';
import { toast } from 'sonner';

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

  const handleDragStart = useCallback((template: ComponentTemplate) => {
    if (!template) {
      console.error('Template is undefined in handleDragStart');
      return;
    }

    try {
      const templateData = JSON.stringify(template);
      
      // Set the data for the drag operation
      const dragEvent = new DragEvent('dragstart', {
        dataTransfer: new DataTransfer()
      });
      
      dragEvent.dataTransfer?.setData('application/json', templateData);
      dragEvent.dataTransfer?.setData('text/plain', template.label);
      
      // Set drag effect
      if (dragEvent.dataTransfer) {
        dragEvent.dataTransfer.effectAllowed = 'copy';
      }

      // Mobile detection for enhanced debugging
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (typeof dragEvent.dataTransfer?.setData === 'function') {
        // DataTransfer API is available
      } else {
        console.warn('DataTransfer API not available - this might be a mobile device or older browser');
      }

      // Store template globally as fallback for mobile/touch devices
      (window as any).__dragTemplate = template;
      
    } catch (error) {
      console.error('Error in handleDragStart:', error);
      toast.error('Erro ao iniciar drag. Tente novamente.');
    }
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

  const handleComponentAdd = useCallback((template: ComponentTemplate) => {
    if (!template) {
      console.error('Template is undefined in handleComponentAdd');
      return;
    }

    try {
      if (typeof projectHandlers.handleComponentAdd !== 'function') {
        console.error('handleComponentAdd is not a function:', typeof projectHandlers.handleComponentAdd);
        return;
      }

      // Create component from template
      const newComponent: FunnelComponent = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type as FunnelComponent['type'],
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        connections: [],
        data: {
          title: template.defaultProps?.title || template.label,
          description: template.defaultProps?.description || '',
          image: template.defaultProps?.image || '',
          url: template.defaultProps?.url || '',
          status: template.defaultProps?.status || 'draft',
          properties: template.defaultProps?.properties || {}
        }
      };

      projectHandlers.handleComponentAdd(newComponent);
      
      toast.success(`${template.label} adicionado ao canvas!`);
    } catch (error) {
      console.error('Error adding component:', error);
      toast.error('Erro ao adicionar componente. Tente novamente.');
    }
  }, [projectHandlers]);

  const handleShapeAdd = useCallback((shape: any) => {
    if (!shape) {
      console.error('Shape is undefined in handleShapeAdd');
      return;
    }

    try {
      // Convert shape to component format
      const shapeComponent: FunnelComponent = {
        id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'custom-shape' as FunnelComponent['type'],
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        connections: [],
        data: {
          title: shape.name || 'Custom Shape',
          description: shape.description || '',
          image: '',
          url: '',
          status: 'draft',
          properties: {
            shapeType: shape.type,
            shapeData: shape
          }
        }
      };

      projectHandlers.handleComponentAdd(shapeComponent);
      
      toast.success(`${shape.name || 'Shape'} adicionado ao canvas!`);
    } catch (error) {
      console.error('Error adding shape:', error);
      toast.error('Erro ao adicionar forma. Tente novamente.');
    }
  }, [projectHandlers]);

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
