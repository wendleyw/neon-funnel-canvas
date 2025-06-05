import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { FunnelProject } from '../types/funnel';
import { Database } from '../integrations/supabase/types';
import { useWorkspaceContext } from '../contexts/WorkspaceContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import { useWorkspaceProjects } from '../hooks/useWorkspaceProjects';

// Define WorkspaceProject type
type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];

interface OpenProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectOpen: (project: FunnelProject) => void;
  onCreateNew: () => void;
}

export const OpenProjectModal: React.FC<OpenProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectOpen,
  onCreateNew,
}) => {
  const { user } = useAuth();
  const { workspaceProjects, loading, loadProjects } = useWorkspaceProjects();
  const { currentWorkspace } = useWorkspaceContext();

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen, loadProjects]);

  const handleProjectSelect = (project: WorkspaceProject) => {
    const projectData = project.project_data as unknown as FunnelProject | null;

    if (projectData && typeof projectData === 'object' && projectData.id && projectData.name) {
      try {
        onProjectOpen(projectData);
        onClose();
      } catch (error) {
        console.error('Error processing project data:', error);
        toast.error("Error processing project data. The project might be corrupted.");
        onClose();
      }
    } else {
      console.error('Selected project has no valid data (project.project_data is missing or not a FunnelProject structure):', project);
      toast.error("Selected project data is missing or invalid.");
      onClose();
    }
  };

  const filteredProjects = (currentWorkspace && workspaceProjects
    ? workspaceProjects.filter(p => p.workspace_id === currentWorkspace.id)
    : workspaceProjects
  ).sort((a,b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex items-center justify-center text-gray-500 py-4">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-3">No saved projects found.</p>
              <Button onClick={onCreateNew}>
                <Plus className="mr-2 h-4 w-4" /> Create New Project
              </Button>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-3 border border-gray-700 hover:border-blue-600 bg-gray-800 hover:bg-gray-750 rounded-md cursor-pointer transition-colors duration-150"
                onClick={() => handleProjectSelect(project)}
              >
                <h3 className="font-medium text-white truncate" title={project.name || 'Untitled Project'}>{project.name || 'Untitled Project'}</h3>
                <p className="text-sm text-gray-400">
                  {project.components_count || 0} components • {project.connections_count || 0} connections
                </p>
                <p className="text-xs text-gray-500">
                  Last modified: {new Date(project.updated_at || '').toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
