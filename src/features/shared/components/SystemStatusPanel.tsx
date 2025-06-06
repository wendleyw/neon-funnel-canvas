import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useUnifiedWorkspace } from '../../../contexts/UnifiedWorkspaceContext';
import { useUnifiedFavorites } from '../../sidebar/hooks/useUnifiedFavorites';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Database, 
  User, 
  Folder, 
  Heart,
  RefreshCw,
  Bug
} from 'lucide-react';

interface SystemStatusPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ isOpen, onClose }) => {
  const { user, loading: authLoading } = useAuth();
  const workspace = useUnifiedWorkspace();
  const favorites = useUnifiedFavorites();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const runSaveTest = async () => {
    try {
      // Test project save
      if (workspace.currentWorkspace) {
        const testProject = {
          name: 'Test Project ' + Date.now(),
          components: [],
          connections: [],
        };
        
        const result = await workspace.saveProject(testProject, workspace.currentWorkspace.id);
        setTestResults(prev => ({ ...prev, projectSave: result.success }));
        
        if (result.success && result.projectId) {
          // Clean up test project
          await workspace.deleteProject(result.projectId);
        }
      }

      // Test favorites save
      const testTemplate = {
        type: 'test-template',
        label: 'Test Template',
        icon: '🧪',
        color: '#00ff00',
      };
      
      favorites.addFavorite(testTemplate as any, 'page');
      const isFav = favorites.isFavorite(testTemplate as any, 'page');
      setTestResults(prev => ({ ...prev, favoritesSave: isFav }));
      
      if (isFav) {
        favorites.removeFavorite(testTemplate as any, 'page');
      }

    } catch (error) {
      console.error('Save test failed:', error);
      setTestResults(prev => ({ ...prev, projectSave: false, favoritesSave: false }));
    }
  };

  const StatusItem: React.FC<{ 
    label: string; 
    status: 'success' | 'error' | 'warning' | 'loading'; 
    details?: string;
    icon: React.ReactNode;
  }> = ({ label, status, details, icon }) => {
    const getStatusIcon = () => {
      switch (status) {
        case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
        case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
        case 'loading': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      }
    };

    const getStatusColor = () => {
      switch (status) {
        case 'success': return 'bg-green-100 text-green-800 border-green-200';
        case 'error': return 'bg-red-100 text-red-800 border-red-200';
        case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'loading': return 'bg-blue-100 text-blue-800 border-blue-200';
      }
    };

    return (
      <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <div className="text-sm font-medium text-white">{label}</div>
            {details && <div className="text-xs text-gray-400">{details}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Badge className={getStatusColor()}>
            {status}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-neutral-900 border-neutral-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Bug className="w-5 h-5" />
            System Status & Diagnostics
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Authentication Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Authentication
            </h3>
            <StatusItem
              label="User Authentication"
              status={authLoading ? 'loading' : user ? 'success' : 'error'}
              details={user ? `Logged in as: ${user.email}` : 'No user authenticated'}
              icon={<User className="w-4 h-4" />}
            />
          </div>

          {/* Workspace Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Workspace Management
            </h3>
            <StatusItem
              label="Workspace Loading"
              status={workspace.loading ? 'loading' : workspace.isInitialized ? 'success' : 'warning'}
              details={`${workspace.workspaces.length} workspaces, current: ${workspace.currentWorkspace?.name || 'none'}`}
              icon={<Folder className="w-4 h-4" />}
            />
            <StatusItem
              label="Project Management"
              status={workspace.loading ? 'loading' : 'success'}
              details={`${workspace.projects.length} projects loaded`}
              icon={<Database className="w-4 h-4" />}
            />
          </div>

          {/* Favorites Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Favorites System
            </h3>
            <StatusItem
              label="Favorites Management"
              status={favorites.isInitialized ? 'success' : 'warning'}
              details={`${favorites.favorites.length} favorites stored`}
              icon={<Heart className="w-4 h-4" />}
            />
          </div>

          {/* Save Tests */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Save Tests
            </h3>
            
            {testResults.projectSave !== undefined && (
              <StatusItem
                label="Project Save Test"
                status={testResults.projectSave ? 'success' : 'error'}
                details={testResults.projectSave ? 'Project save/delete working' : 'Project save failed'}
                icon={<Database className="w-4 h-4" />}
              />
            )}
            
            {testResults.favoritesSave !== undefined && (
              <StatusItem
                label="Favorites Save Test"
                status={testResults.favoritesSave ? 'success' : 'error'}
                details={testResults.favoritesSave ? 'Favorites save/remove working' : 'Favorites save failed'}
                icon={<Heart className="w-4 h-4" />}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-neutral-700">
            <Button 
              onClick={runSaveTest}
              disabled={!user || !workspace.currentWorkspace}
              className="flex-1"
            >
              Run Save Tests
            </Button>
            <Button 
              onClick={() => {
                workspace.loadProjects();
                favorites.loadFavorites();
              }}
              variant="outline"
              className="flex-1"
            >
              Refresh Data
            </Button>
          </div>

          {/* Debug Info */}
          <div className="pt-4 border-t border-neutral-700">
            <details className="text-xs text-gray-400">
              <summary className="cursor-pointer hover:text-white">Debug Information</summary>
              <pre className="mt-2 p-2 bg-neutral-800 rounded text-xs overflow-auto">
{JSON.stringify({
  user: user ? { id: user.id, email: user.email } : null,
  workspace: {
    current: workspace.currentWorkspace?.id,
    loading: workspace.loading,
    saving: workspace.saving,
    lastSaved: workspace.lastSaved,
    projectCount: workspace.projects.length,
    workspaceCount: workspace.workspaces.length,
  },
  favorites: {
    count: favorites.favorites.length,
    loading: favorites.loading,
    isInitialized: favorites.isInitialized,
  }
}, null, 2)}
              </pre>
            </details>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 