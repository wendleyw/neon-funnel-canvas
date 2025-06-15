import React from 'react';
import { ComponentTemplateItem } from '../../sidebar/components/ComponentTemplateItem';
import { useDigitalLaunchTemplates } from '../../shared/hooks/useDigitalLaunchTemplates';

interface DigitalLaunchSectionProps {
  onDragStart: (template: any) => void;
  onAddCompleteTemplate?: (components: any[], connections: any[]) => void;
}

export const DigitalLaunchSection: React.FC<DigitalLaunchSectionProps> = ({
  onDragStart
}) => {
  const { digitalLaunchTemplates } = useDigitalLaunchTemplates();

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Lançamento Digital
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
  );
};
