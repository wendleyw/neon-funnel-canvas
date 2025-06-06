import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/features/shared/ui/dialog';
import { Button } from '@/features/shared/ui/button';
import { Input } from '@/features/shared/ui/input';
import { FolderOpen, Search, Calendar, Loader2, Plus } from 'lucide-react';
import { useUnifiedWorkspace } from '../../../contexts/UnifiedWorkspaceContext';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '../../../integrations/supabase/types';

type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];

interface OpenProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectSelect: (projectId: string) => void;
  onCreateNew: () => void;
}

export const OpenProjectModal: React.FC<OpenProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectSelect,
  onCreateNew
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const workspace = useUnifiedWorkspace();

  // Load projects when modal opens
  useEffect(() => {
    if (isOpen && user) {
      workspace.loadProjects();
    }
  }, [isOpen, user, workspace]);

  // Filter projects based on search term and current workspace
  const filteredProjects = useMemo(() => {
    let projects = workspace.projects;
    
    // Filter by current workspace if available
    if (workspace.currentWorkspace) {
      projects = workspace.getProjectsByWorkspace(workspace.currentWorkspace.id);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      projects = projects.filter(project => 
        project.name.toLowerCase().includes(term)
      );
    }
    
    // Sort by last updated
    return projects.sort((a, b) => 
      new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
    );
  }, [workspace.projects, workspace.currentWorkspace, workspace.getProjectsByWorkspace, searchTerm]);

  const handleProjectSelect = (project: WorkspaceProject) => {
    try {
      onProjectSelect(project.id);
      onClose();
    } catch (error) {
      console.error('Error selecting project:', error);
      toast.error("Error opening project");
    }
  };

  const handleCreateNew = () => {
    onCreateNew();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Open Project
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Projects List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {workspace.loading ? (
              <div className="flex items-center justify-center text-gray-500 py-8">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading projects...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No projects match your search.' : 'No saved projects found.'}
                </p>
                <Button onClick={handleCreateNew} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Project
                </Button>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border border-gray-700 hover:border-blue-500 bg-gray-800 hover:bg-gray-750 rounded-lg cursor-pointer transition-colors duration-200"
                  onClick={() => handleProjectSelect(project)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate mb-1" title={project.name}>
                        {project.name || 'Untitled Project'}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {project.components_count || 0} components • {project.connections_count || 0} connections
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        Last modified: {new Date(project.updated_at || '').toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between pt-4 border-t border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 