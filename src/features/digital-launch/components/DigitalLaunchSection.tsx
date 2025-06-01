
import React from 'react';
import { ComponentTemplateItem } from '../../../components/Sidebar/ComponentTemplateItem';
import { useDigitalLaunchTemplates } from '../hooks/useDigitalLaunchTemplates';
import { Button } from '../../../components/ui/button';
import { Rocket, Zap, Target } from 'lucide-react';

interface DigitalLaunchSectionProps {
  onDragStart: (template: any) => void;
  onAddCompleteTemplate?: (components: any[], connections: any[]) => void;
}

export const DigitalLaunchSection: React.FC<DigitalLaunchSectionProps> = ({
  onDragStart,
  onAddCompleteTemplate
}) => {
  const { digitalLaunchTemplates, createCompleteDigitalLaunchFunnel, createQuickLaunchTemplate } = useDigitalLaunchTemplates();

  const handleCreateCompleteFunnel = () => {
    const { components, connections } = createCompleteDigitalLaunchFunnel();
    onAddCompleteTemplate?.(components, connections);
  };

  const handleCreateQuickTemplate = (type: 'mvp' | 'complete' | 'advanced') => {
    const { components, connections } = createQuickLaunchTemplate(type);
    onAddCompleteTemplate?.(components, connections);
  };

  return (
    <div className="space-y-4">
      {/* Quick Templates */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Templates Prontos
        </h3>
        
        <div className="space-y-2">
          <Button
            onClick={() => handleCreateQuickTemplate('mvp')}
            className="w-full justify-start text-left bg-green-700 hover:bg-green-600 text-white"
            size="sm"
          >
            <Target className="w-4 h-4 mr-2" />
            MVP Básico
          </Button>
          
          <Button
            onClick={() => handleCreateQuickTemplate('complete')}
            className="w-full justify-start text-left bg-blue-700 hover:bg-blue-600 text-white"
            size="sm"
          >
            <Zap className="w-4 h-4 mr-2" />
            Lançamento Completo
          </Button>
          
          <Button
            onClick={handleCreateCompleteFunnel}
            className="w-full justify-start text-left bg-purple-700 hover:bg-purple-600 text-white"
            size="sm"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Funil Avançado
          </Button>
        </div>
      </div>

      {/* Individual Components */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Componentes Individuais
        </h3>
        
        <div className="grid grid-cols-1 gap-2">
          {digitalLaunchTemplates.map((template) => (
            <ComponentTemplateItem
              key={template.type}
              template={template}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
