
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { FunnelProject } from '../../types/funnel';
import { useSupabaseWorkspace } from '../../hooks/useSupabaseWorkspace';
import { useAuth } from '../../contexts/AuthContext';

interface OpenProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectOpen: (project: FunnelProject) => void;
}

export const OpenProjectModal: React.FC<OpenProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectOpen
}) => {
  const { user } = useAuth();
  const { workspaceProjects, currentWorkspace, loadWorkspaces } = useSupabaseWorkspace();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      loadWorkspaces().finally(() => setLoading(false));
    }
  }, [isOpen, user, loadWorkspaces]);

  const handleProjectSelect = (projectRecord: any) => {
    try {
      console.log('Project record selected:', projectRecord);
      
      // Extrair os dados do projeto
      const projectData = projectRecord.project_data as FunnelProject;
      
      if (!projectData || typeof projectData !== 'object') {
        console.error('Invalid project data:', projectData);
        return;
      }

      console.log('Loading project data:', projectData);
      onProjectOpen(projectData);
      onClose();
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
    }
  };

  // Filtrar projetos do workspace atual ou todos se não houver workspace selecionado
  const availableProjects = currentWorkspace 
    ? workspaceProjects.filter(p => p.workspace_id === currentWorkspace.id)
    : workspaceProjects;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abrir Projeto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-500">Carregando projetos...</p>
            </div>
          ) : availableProjects.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum projeto salvo encontrado
            </p>
          ) : (
            availableProjects.map((project) => (
              <div
                key={project.id}
                className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => handleProjectSelect(project)}
              >
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-500">
                  {project.components_count || 0} componentes • {project.connections_count || 0} conexões
                </p>
                <p className="text-xs text-gray-400">
                  Atualizado em: {new Date(project.updated_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
