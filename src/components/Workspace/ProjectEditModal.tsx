
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Trash2 } from 'lucide-react';
import { Database } from '../../integrations/supabase/types';

type WorkspaceProject = Database['public']['Tables']['workspace_projects']['Row'];

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: WorkspaceProject;
  onUpdateName: (projectId: string, newName: string) => Promise<boolean>;
  onDelete: (projectId: string) => Promise<boolean>;
}

export const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateName,
  onDelete
}) => {
  const [newName, setNewName] = useState(project.name);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateName = async () => {
    if (newName.trim() === '' || newName === project.name) {
      return;
    }

    setIsUpdating(true);
    const success = await onUpdateName(project.id, newName.trim());
    setIsUpdating(false);
    
    if (success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
      setIsDeleting(true);
      const success = await onDelete(project.id);
      setIsDeleting(false);
      
      if (success) {
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Nome do Projeto</Label>
            <Input
              id="project-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Digite o nome do projeto"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              {isDeleting ? 'Excluindo...' : 'Excluir Projeto'}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleUpdateName}
                disabled={isUpdating || newName.trim() === '' || newName === project.name}
              >
                {isUpdating ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
