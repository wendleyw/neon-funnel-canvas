
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card';
import { Badge } from '@/features/shared/ui/badge';
import { Button } from '@/features/shared/ui/button';
import { Calendar, Target, DollarSign, TrendingUp, Edit, Archive } from 'lucide-react';
import { LaunchProject } from '../../../types/launch';

interface LaunchProjectCardProps {
  project: LaunchProject;
  onEdit: (project: LaunchProject) => void;
  onArchive: (projectId: string) => void;
  onViewDetails: (project: LaunchProject) => void;
}

export const LaunchProjectCard: React.FC<LaunchProjectCardProps> = ({
  project,
  onEdit,
  onArchive,
  onViewDetails
}) => {
  const getStatusColor = (status: LaunchProject['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: LaunchProject['type']) => {
    const labels = {
      'seed': 'Semente',
      'internal': 'Interno',
      'perpetual': 'Perpétuo',
      'campaign': 'Campanha',
      'product': 'Produto'
    };
    return labels[type] || type;
  };

  const completedObjectives = project.objectives.filter(obj => obj.completed).length;
  const completedTasks = project.checklist.filter(task => task.completed).length;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {project.name}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(project.status)}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
              <Badge variant="outline">
                {getTypeLabel(project.type)}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(project)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onArchive(project.id)}>
              <Archive className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {project.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Objetivos</p>
              <p className="text-sm font-medium">{completedObjectives}/{project.objectives.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">ROI</p>
              <p className="text-sm font-medium">{project.metrics.roi.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Progresso das tarefas */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Progresso</span>
            <span className="text-xs text-gray-600">
              {completedTasks}/{project.checklist.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${project.checklist.length > 0 ? (completedTasks / project.checklist.length) * 100 : 0}%` 
              }}
            />
          </div>
        </div>

        {/* Datas */}
        {(project.startDate || project.endDate) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {project.startDate && new Date(project.startDate).toLocaleDateString('pt-BR')}
              {project.startDate && project.endDate && ' - '}
              {project.endDate && new Date(project.endDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}

        {/* Orçamento */}
        {project.budget && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: project.currency || 'BRL'
              }).format(project.budget)}
            </span>
          </div>
        )}

        <Button 
          onClick={() => onViewDetails(project)}
          className="w-full"
          variant="outline"
        >
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );
};
