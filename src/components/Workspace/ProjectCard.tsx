
import React from 'react';
import { Database } from '../../integrations/supabase/types';

type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];

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
        <p>{project.components_count || 0} componentes</p>
        <p>{project.connections_count || 0} conexões</p>
        <p>Atualizado: {new Date(project.updated_at).toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
};
