
import React from 'react';
import { WorkspaceProject } from '../../types/workspace';

interface ProjectCardProps {
  project: WorkspaceProject;
  onSelect: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect
}) => {
  return (
    <div
      onClick={() => onSelect(project.id)}
      className="p-4 bg-gray-900 rounded border border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
    >
      <h3 className="font-medium mb-2">{project.name}</h3>
      <div className="text-xs text-gray-400 space-y-1">
        <p>{project.componentsCount} componentes</p>
        <p>{project.connectionsCount} conexões</p>
        <p>Atualizado: {new Date(project.updatedAt).toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
};
