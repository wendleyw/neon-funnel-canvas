import { useCallback, useEffect } from 'react';
import { FunnelProject } from '../../../types/funnel';
import { useWorkspace } from '../useWorkspace';
import { toast } from 'sonner';
import { useWorkspaceProjects } from '../useWorkspaceProjects';

interface UseProjectManagementHandlersProps {
  project: FunnelProject;
  setProject: React.Dispatch<React.SetStateAction<FunnelProject>>;
  currentProjectId: string | null;
  setCurrentProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  loadProjectData: (projectData: FunnelProject, projectId?: string) => void;
  resetProject: () => void;
  enterEditor: () => void;
}

// Auto-save when the project is modified (debounced)
const SAVE_DEBOUNCE_MS = 2000;

export const useProjectManagementHandlers = ({
  project,
  setProject,
  currentProjectId,
  setCurrentProjectId,
  loadProjectData,
  resetProject,
  enterEditor
}: UseProjectManagementHandlersProps) => {
  const { currentWorkspace, addProjectToWorkspace, workspaceProjects } = useWorkspace();

  useEffect(() => {
    if (currentWorkspace && currentProjectId && project.components.length > 0) {
      console.log('🔄 Project changed, triggering auto-save...');
      addProjectToWorkspace(project, currentWorkspace.id, currentProjectId, true); // true = isAutoSave
    }
  }, [project.components, project.connections, project.name, currentWorkspace, currentProjectId, addProjectToWorkspace]);

  const handleProjectSelect = useCallback((projectId: string) => {
    try {
      console.log('Loading project with ID:', projectId);
      
      const projectRecord = workspaceProjects.find(p => p.id === projectId);
      
      if (!projectRecord) {
        console.error('Project not found in workspaceProjects:', projectId);
        toast.error('Project not found');
        return;
      }

      console.log('Found project record:', projectRecord);
      
      const projectData = projectRecord.project_data as unknown as FunnelProject;
      
      if (!projectData || typeof projectData !== 'object') {
        console.error('Invalid project data:', projectData);
        toast.error('Invalid project data');
        return;
      }

      if (!projectData.id || !projectData.name || !Array.isArray(projectData.components) || !Array.isArray(projectData.connections)) {
        console.error('Project data missing required fields:', projectData);
        toast.error('Invalid project structure');
        return;
      }

      console.log('Loading project:', projectData.name);
      loadProjectData(projectData, projectId);
      toast.success(`Project "${projectData.name}" loaded successfully!`);
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Error loading project');
    }
  }, [workspaceProjects, loadProjectData]);

  const handleNewProject = useCallback(() => {
    resetProject();
    enterEditor();
  }, [resetProject, enterEditor]);

  const handleSave = useCallback(async () => {
    if (!currentWorkspace) {
      toast.error('No workspace selected');
      return;
    }

    // Ensure we're saving the most current project state with updated timestamp
    const projectToSave = {
      ...project,
      updatedAt: new Date().toISOString()
    };

    console.log('💾 Manual save requested for project:', projectToSave.name);

    const result = await addProjectToWorkspace(projectToSave, currentWorkspace.id, currentProjectId || undefined, false); // false = manual save
    if (result && result.success) {
      // Update local state to reflect saved project
      setProject(projectToSave);
      
      // Set current project ID if it's a new project
      if (result.projectId && !currentProjectId) {
        console.log('Setting new project ID:', result.projectId);
        setCurrentProjectId(result.projectId);
      }
    }
  }, [project, currentWorkspace, addProjectToWorkspace, currentProjectId, setCurrentProjectId, setProject]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Project exported!');
  }, [project]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedProject = JSON.parse(event.target?.result as string);
          
          // Validate imported project structure
          if (!importedProject.id || !importedProject.name || !Array.isArray(importedProject.components) || !Array.isArray(importedProject.connections)) {
            throw new Error('Invalid project structure');
          }
          
          // Generate new ID for imported project to avoid conflicts
          const newProject: FunnelProject = {
            ...importedProject,
            id: `project-${Date.now()}`,
            name: `${importedProject.name} (Imported)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          loadProjectData(newProject);
          toast.success('Project imported successfully!');
        } catch (error) {
          console.error('Error importing project:', error);
          toast.error('Error importing project. Please check if the file is valid.');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }, [loadProjectData]);

  const handleClear = useCallback(() => {
    if (confirm('Are you sure you want to clear all components? This action cannot be undone.')) {
      setProject(prev => ({
        ...prev,
        components: [],
        connections: [],
        updatedAt: new Date().toISOString()
      }));
      toast.success('Project cleared successfully!');
    }
  }, [setProject]);

  return {
    handleProjectSelect,
    handleNewProject,
    handleSave,
    handleExport,
    handleImport,
    handleClear
  };
};
