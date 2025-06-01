
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Workspace } from '../../types/workspace';

interface WorkspaceCardProps {
  workspace: Workspace;
  onSelect: (workspace: Workspace) => void;
  onDelete: (workspaceId: string, e: React.MouseEvent) => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  onSelect,
  onDelete
}) => {
  return (
    <div
      onClick={() => onSelect(workspace)}
      className="p-4 bg-gray-900 rounded border border-gray-700 hover:border-gray-600 cursor-pointer transition-colors flex items-center justify-between"
    >
      <div>
        <h3 className="font-medium">{workspace.name}</h3>
        {workspace.description && (
          <p className="text-sm text-gray-400">{workspace.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {workspace.projects.length} projeto(s)
        </p>
      </div>
      <button
        onClick={(e) => onDelete(workspace.id, e)}
        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
