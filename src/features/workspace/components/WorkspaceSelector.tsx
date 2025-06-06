import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useWorkspaceContext } from '../../../contexts/WorkspaceContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useLoadingHealthCheck } from '@/features/shared/hooks/useLoadingHealthCheck';
import { Plus, FolderOpen, User, LogIn } from 'lucide-react';
import { WorkspaceCard } from './WorkspaceCard';
import { ProjectCard } from './ProjectCard';
import { ProjectEditModal } from './ProjectEditModal';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { ProfileModal } from '@/features/auth/components/ProfileModal';
import { ErrorBoundary } from '@/features/shared/components/ErrorBoundary';
import { LoadingSpinner } from '@/features/shared/components/LoadingSpinner';
import { Database } from '../../../integrations/supabase/types';

type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];

/**
 * Props interface for the WorkspaceSelector component
 */
interface WorkspaceSelectorProps {
  onProjectSelect: (projectId: string) => void;
  onNewProject: () => void;
}

/**
 * WorkspaceSelector component - Manages workspace and project selection
 * This component provides the main interface for users to manage their workspaces
 * and projects before entering the funnel builder
 */
export const WorkspaceSelector = React.memo<WorkspaceSelectorProps>(({
  onProjectSelect,
  onNewProject
}) => {
  const { user, loading: authLoading } = useAuth();
  const {
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    createWorkspace,
    deleteWorkspace,
    updateProjectName,
    deleteProject,
    getWorkspaceProjects,
    loading: workspaceLoading
  } = useWorkspaceContext();

  // Modal states - managing various modal dialogs
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<WorkspaceProject | null>(null);

  /**
   * Health check to detect loading issues and prevent infinite loading states
   */
  const { isHealthy, forceRecovery } = useLoadingHealthCheck(
    { authLoading, workspaceLoading, user },
    {
      timeout: 10000, // 10 second timeout
      onTimeout: () => {
        console.warn('Loading timeout detected - forcing recovery');
        forceRecovery();
      }
    }
  );

  /**
   * Handler for creating a new workspace
   */
  const handleCreateWorkspace = useCallback(async (name: string, description?: string) => {
    try {
      const workspace = await createWorkspace(name, description);
      if (workspace) {
        setCurrentWorkspace(workspace);
        console.log('✅ Workspace created successfully:', workspace.name);
      }
    } catch (error) {
      console.error('❌ Error creating workspace:', error);
    } finally {
      setShowCreateForm(false);
    }
  }, [createWorkspace, setCurrentWorkspace]);

  /**
   * Handler for deleting a workspace with confirmation
   */
  const handleDeleteWorkspace = useCallback((workspaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const confirmMessage = 'Are you sure you want to delete this workspace? This action cannot be undone.';
    if (window.confirm(confirmMessage)) {
      deleteWorkspace(workspaceId);
      console.log('🗑️ Workspace deleted:', workspaceId);
    }
  }, [deleteWorkspace]);

  /**
   * Toggle create workspace form visibility
   */
  const handleToggleCreateForm = useCallback(() => {
    setShowCreateForm(prev => !prev);
  }, []);

  /**
   * Navigate back to workspaces list
   */
  const handleBackToWorkspaces = useCallback(() => {
    setCurrentWorkspace(null);
    console.log('🔙 Navigated back to workspaces list');
  }, [setCurrentWorkspace]);

  /**
   * Open project edit modal
   */
  const handleProjectEdit = useCallback((project: WorkspaceProject) => {
    setProjectToEdit(project);
    console.log('✏️ Editing project:', project.name);
  }, []);

  /**
   * Close project edit modal
   */
  const handleCloseEditModal = useCallback(() => {
    setProjectToEdit(null);
  }, []);

  /**
   * Get projects for the current workspace - memoized for performance
   */
  const projects = useMemo(() => {
    return currentWorkspace ? getWorkspaceProjects(currentWorkspace.id) : [];
  }, [currentWorkspace, getWorkspaceProjects]);

  /**
   * Render loading state while authentication or workspace data is loading
   */
  if (authLoading || workspaceLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black text-white min-h-screen">
        <LoadingSpinner 
          message="Loading workspaces..." 
          size="lg" 
        />
      </div>
    );
  }

  /**
   * Render authentication required state for non-authenticated users
   */
  if (!user) {
    return (
      <ErrorBoundary>
        <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-8">
          <div className="max-w-md w-full text-center">
            <h1 className="text-3xl font-bold mb-4">Funnel Builder</h1>
            <p className="text-gray-400 mb-8">
              Create and manage your sales funnels visually and intuitively
            </p>
            
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full flex items-center justify-center gap-2 p-4 bg-white text-black rounded hover:bg-gray-200 transition-colors font-medium"
              aria-label="Sign in or create account"
            >
              <LogIn size={20} />
              Sign In / Create Account
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              Log in to access your workspaces and projects
            </p>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </ErrorBoundary>
    );
  }

  /**
   * Render workspaces list when no workspace is selected
   */
  if (!currentWorkspace) {
    return (
      <ErrorBoundary>
        <div className="flex-1 flex flex-col bg-black text-white">
          {/* Header with user info */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Workspaces</h1>
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors p-2 rounded"
              aria-label="Open user profile"
            >
              <User size={20} />
              <span className="text-sm">{user.email}</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="max-w-md w-full">
              {workspaces.length === 0 ? (
                <div className="text-center mb-8">
                  <p className="text-gray-400 mb-4">No workspaces found</p>
                  <p className="text-sm text-gray-500">Create your first workspace to get started</p>
                </div>
              ) : (
                <div className="space-y-2 mb-8">
                  {workspaces.map((workspace) => (
                    <WorkspaceCard
                      key={workspace.id}
                      workspace={workspace}
                      onSelect={setCurrentWorkspace}
                      onDelete={handleDeleteWorkspace}
                    />
                  ))}
                </div>
              )}

              <CreateWorkspaceModal
                showCreateForm={showCreateForm}
                onToggleForm={handleToggleCreateForm}
                onCreate={handleCreateWorkspace}
              />
            </div>
          </div>
        </div>

        <ProfileModal 
          isOpen={showProfileModal} 
          onClose={() => setShowProfileModal(false)} 
        />
      </ErrorBoundary>
    );
  }

  /**
   * Render projects list for the selected workspace
   */
  return (
    <ErrorBoundary>
      <div className="flex-1 flex flex-col bg-black text-white">
        {/* Workspace Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleBackToWorkspaces}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Back to workspaces"
            >
              <FolderOpen size={16} />
              <span className="text-sm">Back to Workspaces</span>
            </button>
            
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors p-2 rounded"
              aria-label="Open user profile"
            >
              <User size={20} />
              <span className="text-sm">{user.email}</span>
            </button>
          </div>
          
          <h1 className="text-2xl font-bold">{currentWorkspace.name}</h1>
          {currentWorkspace.description && (
            <p className="text-gray-400 text-sm">{currentWorkspace.description}</p>
          )}
        </div>

        {/* Projects Content */}
        <div className="flex-1 p-4">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No projects in this workspace</p>
              <p className="text-sm text-gray-500 mb-6">
                Create your first project to start building funnels
              </p>
              <button
                onClick={onNewProject}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                aria-label="Create new project"
              >
                <Plus size={20} />
                Create Project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Projects ({projects.length})</h2>
                <button
                  onClick={onNewProject}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  aria-label="Create new project"
                >
                  <Plus size={16} />
                  New Project
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={onProjectSelect}
                    onEdit={handleProjectEdit}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <ProfileModal 
          isOpen={showProfileModal} 
          onClose={() => setShowProfileModal(false)} 
        />
        
        {projectToEdit && (
          <ProjectEditModal
            isOpen={true}
            project={projectToEdit}
            onClose={handleCloseEditModal}
            onUpdateName={updateProjectName}
            onDelete={deleteProject}
          />
        )}
      </div>
    </ErrorBoundary>
  );
});

WorkspaceSelector.displayName = 'WorkspaceSelector';
