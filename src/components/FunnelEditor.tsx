import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import ReactFlowCanvasWrapper from './ReactFlowCanvas';
import { Toolbar } from './Toolbar';
import { CreateProjectModal } from './ProjectCreator/CreateProjectModal';
import { OpenProjectModal } from './OpenProjectModal';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import { FunnelProject, FunnelComponent, ComponentTemplate, Connection } from '../types/funnel';
import { DrawingShape } from '../types/drawing';
import { canvasAddService } from '../services/CanvasAddService';
import { useProjectHandlers } from '../hooks/useProjectHandlers';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { useIsMobile } from '../hooks/use-mobile';
import { useHotkeys } from 'react-hotkeys-hook';
import { Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getCanvasViewport, 
  getSmartPosition, 
  focusOnPosition,
  type Position 
} from '../utils/canvasPositioning';

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
  const [enableConnectionValidation, setEnableConnectionValidation] = useState(false);
  
  // Unsaved changes detection
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  
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

  // Track unsaved changes
  const { hasUnsavedChanges, markAsSaved, resetTracking } = useUnsavedChanges({
    project,
    currentProjectId
  });

  // Enhanced save handler that marks as saved
  const handleSave = useCallback(async () => {
    try {
      await projectHandlers.handleSave();
      markAsSaved();
      toast.success('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Error saving project. Please try again.');
    }
  }, [projectHandlers, markAsSaved]);

  // Enhanced back to workspace handler with unsaved changes check
  const handleBackToWorkspace = useCallback(() => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => onBackToWorkspace);
      setIsUnsavedChangesModalOpen(true);
    } else {
      resetTracking();
      onBackToWorkspace();
    }
  }, [hasUnsavedChanges, onBackToWorkspace, resetTracking]);

  // Handle unsaved changes modal actions
  const handleUnsavedChangesSave = useCallback(async () => {
    await handleSave();
    setIsUnsavedChangesModalOpen(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  }, [handleSave, pendingNavigation]);

  const handleUnsavedChangesDiscard = useCallback(() => {
    resetTracking();
    setIsUnsavedChangesModalOpen(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  }, [resetTracking, pendingNavigation]);

  const handleUnsavedChangesCancel = useCallback(() => {
    setIsUnsavedChangesModalOpen(false);
    setPendingNavigation(null);
  }, []);

  // Update hotkeys to use enhanced save handler
  useHotkeys('ctrl+s, command+s', (e) => {
    e.preventDefault();
    handleSave();
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
      toast.error('Error starting drag. Please try again.');
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

  const handleCompleteTemplateAdd = useCallback((components: FunnelComponent[], connections: Connection[]) => {
    if (!components || components.length === 0) {
      console.error('No components provided in handleCompleteTemplateAdd');
      return;
    }

    try {
      // Get smart position based on current viewport for the first component
      let basePosition: Position = { x: 300, y: 200 };

      const canvasElement = document.querySelector('.canvas-container') as HTMLElement;
      if (canvasElement) {
        const viewport = getCanvasViewport(canvasElement);
        
        if (viewport) {
          const existingPositions = project.components?.map(comp => comp.position) || [];
          basePosition = getSmartPosition(viewport, {
            avoidOverlap: true,
            existingPositions,
            offsetAmount: 100
          });
        }
      }

      // Adjust positions of all components relative to the base position
      const adjustedComponents = components.map((component, index) => ({
        ...component,
        id: `component-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        position: {
          x: basePosition.x + (component.position?.x || 0),
          y: basePosition.y + (component.position?.y || 0)
        }
      }));

      // Add all components
      adjustedComponents.forEach(component => {
        projectHandlers.handleComponentAdd(component);
      });

      // Add all connections if provided
      if (connections && connections.length > 0) {
        connections.forEach(connection => {
          projectHandlers.handleConnectionAdd(connection);
        });
      }

      toast.success(`Complete template added with ${adjustedComponents.length} components!`);
    } catch (error) {
      console.error('Error adding complete template:', error);
      toast.error('Error adding complete template. Please try again.');
    }
  }, [projectHandlers, project.components]);

  const handleShapeAdd = useCallback((shape: any) => {
    if (!shape) {
      console.error('Shape is undefined in handleShapeAdd');
      return;
    }

    try {
      // Get smart position based on current viewport (same logic as handleComponentAdd)
      let position: Position = { x: 350, y: 250 }; // Slightly different fallback position

      // Try to get the canvas element and calculate smart positioning
      const canvasElement = document.querySelector('.canvas-container') as HTMLElement;
      if (canvasElement) {
        const viewport = getCanvasViewport(canvasElement);
        
        if (viewport) {
          // Get existing component positions to avoid overlap
          const existingPositions = project.components?.map(comp => comp.position) || [];
          
          position = getSmartPosition(viewport, {
            avoidOverlap: true,
            existingPositions,
            offsetAmount: 80 // Slightly larger offset for shapes
          });
        }
      }

      // Convert shape to component format with smart positioning
      const shapeComponent: FunnelComponent = {
        id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'custom-shape' as FunnelComponent['type'],
        position,
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
      
      // Optional: Auto-focus on the new shape
      setTimeout(() => {
        const canvasElement = document.querySelector('.canvas-container') as HTMLElement;
        if (canvasElement) {
          focusOnPosition(canvasElement, position, 1.2);
        }
      }, 100);
      
      toast.success(`${shape.name || 'Shape'} added to the center of your visualization!`);
    } catch (error) {
      console.error('Error adding shape:', error);
      toast.error('Error adding shape. Please try again.');
    }
  }, [projectHandlers, project.components]);

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

      // Get smart position based on current viewport
      let position: Position = { x: 300, y: 200 }; // Fallback position

      // Try to get the canvas element and calculate smart positioning
      const canvasElement = document.querySelector('.canvas-container') as HTMLElement;
      if (canvasElement) {
        const viewport = getCanvasViewport(canvasElement);
        
        if (viewport) {
          // Get existing component positions to avoid overlap
          const existingPositions = project.components?.map(comp => comp.position) || [];
          
          position = getSmartPosition(viewport, {
            avoidOverlap: true,
            existingPositions,
            offsetAmount: 60
          });
          
          console.log('🎯 Smart positioning:', {
            viewport,
            calculatedPosition: position,
            existingCount: existingPositions.length
          });
        } else {
          console.warn('⚠️ Could not get viewport info, using fallback position');
        }
      } else {
        console.warn('⚠️ Canvas element not found, using fallback position');
      }

      // Create component from template with smart positioning
      const newComponent: FunnelComponent = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type as FunnelComponent['type'],
        position,
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
      
      // Optional: Auto-focus on the new component after a short delay
      setTimeout(() => {
        const canvasElement = document.querySelector('.canvas-container') as HTMLElement;
        if (canvasElement) {
          focusOnPosition(canvasElement, position, 1.2);
        }
      }, 100);
      
      toast.success(`${template.label} added to the center of your visualization!`);
    } catch (error) {
      console.error('Error adding component:', error);
      toast.error('Error adding component. Please try again.');
    }
  }, [projectHandlers, project.components]);

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
          onAddCompleteTemplate={handleCompleteTemplateAdd}
          onShapeAdd={handleShapeAdd}
          onTemplateClick={handleComponentAdd}
          onPanelStateChange={handlePanelStateChange}
        />
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${isMobile ? 'w-full' : ''}`}>
        {/* Toolbar with unsaved changes indicator */}
        <div className="flex-shrink-0 border-b border-gray-800">
          <Toolbar 
            onSave={handleSave}
            onLoad={handleLoad}
            onExport={projectHandlers.handleExport}
            onClear={projectHandlers.handleClear}
            onBackToWorkspace={handleBackToWorkspace}
            projectName={project.name}
            onProjectNameChange={handleProjectNameChange}
            workspaceName={currentWorkspace?.name || ''}
            componentsCount={project.components.length}
            project={project}
            enableConnectionValidation={enableConnectionValidation}
            onToggleConnectionValidation={() => setEnableConnectionValidation(!enableConnectionValidation)}
            hasUnsavedChanges={hasUnsavedChanges}
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
            enableConnectionValidation={enableConnectionValidation}
          />
        </div>
      </div>

      {/* Modals */}
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

      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onSave={handleUnsavedChangesSave}
        onDiscard={handleUnsavedChangesDiscard}
        onCancel={handleUnsavedChangesCancel}
        projectName={project.name}
      />
    </div>
  );
};
