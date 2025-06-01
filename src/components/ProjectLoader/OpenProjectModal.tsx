
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { FunnelProject } from '../../types/funnel';

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
  const [savedProjects, setSavedProjects] = useState<FunnelProject[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Carregar projetos salvos do localStorage
      const projects: FunnelProject[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('funnel-project')) {
          try {
            const project = JSON.parse(localStorage.getItem(key) || '');
            projects.push(project);
          } catch (error) {
            console.error('Erro ao carregar projeto:', error);
          }
        }
      }
      setSavedProjects(projects);
    }
  }, [isOpen]);

  const handleProjectSelect = (project: FunnelProject) => {
    onProjectOpen(project);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abrir Projeto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {savedProjects.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum projeto salvo encontrado
            </p>
          ) : (
            savedProjects.map((project) => (
              <div
                key={project.id}
                className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => handleProjectSelect(project)}
              >
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-500">
                  {project.components.length} componentes • {project.connections.length} conexões
                </p>
                <p className="text-xs text-gray-400">
                  Atualizado em: {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
