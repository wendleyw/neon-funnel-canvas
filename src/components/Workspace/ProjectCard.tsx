
import React from 'react';
import { Edit } from 'lucide-react';
import { Database } from '../../integrations/supabase/types';

type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];

interface ProjectCardProps {
  project: WorkspaceProject;
  onSelect: (projectId: string) => void;
  onEdit: (project: WorkspaceProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onEdit
}) => {
  const handleCardClick = () => {
    onSelect(project.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(project);
  };

  return (
    <div
      onClick={handleCardClick}
      className="p-4 bg-gray-900 rounded border border-gray-700 hover:border-gray-600 cursor-pointer transition-colors group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium flex-1">{project.name}</h3>
        <button
          onClick={handleEditClick}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-white rounded"
          title="Editar projeto"
        >
          <Edit size={16} />
        </button>
      </div>
      
      <div className="text-xs text-gray-400 space-y-1">
        <p>{project.components_count || 0} componentes</p>
        <p>{project.connections_count || 0} conexões</p>
        <p>Atualizado: {new Date(project.updated_at).toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
};
