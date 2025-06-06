import React from 'react';
import { Link } from 'react-router-dom';
import { WorkspaceSelector } from '@/features/workspace/components/WorkspaceSelector';
import { FunnelEditor } from '@/features/editor/components/FunnelEditor';
import { useWorkspace } from '@/features/workspace/hooks/useWorkspace';
import { useWorkspaceContext } from '../contexts/WorkspaceContext';
import { useProjectStore, useIsInEditor } from '../store/projectStore';

const Index = () => {
  const { currentWorkspace } = useWorkspace();
  const { loadProject } = useWorkspaceContext();
  const isInEditor = useIsInEditor();
  
  const {
    loadProjectData,
    enterEditor,
    exitEditor
  } = useProjectStore();

  // Project handlers for workspace selector
  const handleProjectSelect = (projectId: string) => {
    try {
      console.log('🔍 Attempting to load project with ID:', projectId);
      
      // Fetch the full project data by ID
      const projectRecord = loadProject(projectId);
      
      console.log('📄 Project record found:', projectRecord ? 'YES' : 'NO');
      
      if (projectRecord && projectRecord.project_data) {
        // Extract the actual project data from the database record
        const projectData = projectRecord.project_data;
        
        console.log('📊 Project data structure:', {
          hasId: !!projectData.id,
          hasName: !!projectData.name,
          componentsCount: projectData.components?.length || 0,
          connectionsCount: projectData.connections?.length || 0,
          type: typeof projectData
        });
        
        loadProjectData(projectData, projectId);
        console.log('✅ Project loading initiated for:', projectData.name);
      } else {
        console.error('❌ Project not found or has no data:', projectId);
        console.error('Available workspaceProjects:', loadProject.toString());
      }
    } catch (error) {
      console.error('❌ Error loading project:', error);
    }
  };

  const handleNewProject = () => {
    enterEditor();
  };

  if (!isInEditor) {
    return (
      <div className="relative">
        <WorkspaceSelector
          onProjectSelect={handleProjectSelect}
          onNewProject={handleNewProject}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <FunnelEditor
        onBackToWorkspace={exitEditor}
        currentWorkspace={currentWorkspace}
      />
    </div>
  );
};

export default Index;
