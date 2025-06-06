import React, { useState } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { DrawingShape } from '../../../types/drawing';
import { useIsMobile } from '@/features/shared/hooks/use-mobile';
import { useTranslation } from '../../../lib/i18n';
import { SourcesTab } from '../tabs/SourcesTab';
import { PagesTab } from '../tabs/PagesTab';
import { ActionsTab } from '../tabs/ActionsTab';
import { Globe, FileText, Zap } from 'lucide-react';

interface CreateMenuContentProps {
  onDragStart: (template: ComponentTemplate) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

type TabType = 'sources' | 'pages' | 'actions';

interface Tab {
  id: TabType;
  label: string;
  count: number;
  icon: any;
  description: string;
}

export const CreateMenuContent: React.FC<CreateMenuContentProps> = ({
  onDragStart,
  onShapeAdd,
  onTemplateClick
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('sources');
  const isMobile = useIsMobile();

  // Dynamic tabs with translations
  const tabs: Tab[] = [
    { 
      id: 'sources', 
      label: t('sidebar.sources'), 
      count: 8, 
      icon: Globe,
      description: t('sources.title')
    },
    { 
      id: 'pages', 
      label: t('sidebar.pages'), 
      count: 15, 
      icon: FileText,
      description: t('pages.title')
    },
    { 
      id: 'actions', 
      label: t('sidebar.actions'), 
      count: 6, 
      icon: Zap,
      description: t('actions.title')
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sources':
        return (
          <SourcesTab 
            onDragStart={(e, template) => onDragStart(template)}
            onTemplateClick={onTemplateClick}
            onTemplateSelect={onTemplateClick || ((template) => {})}
            onCustomCreate={() => {}}
          />
        );
      case 'pages':
        return (
          <PagesTab 
            onDragStart={(e, template) => onDragStart(template)}
            onTemplateClick={onTemplateClick}
          />
        );
      case 'actions':
        return (
          <ActionsTab 
            onDragStart={(e, template) => onDragStart(template)}
            onTemplateClick={onTemplateClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800 bg-gray-900/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-3 text-xs font-medium transition-colors border-b-2 ${
                isActive 
                  ? 'text-white border-blue-500 bg-gray-800/50' 
                  : 'text-gray-400 border-transparent hover:text-gray-300 hover:bg-gray-800/30'
              }`}
              title={tab.description}
            >
              <Icon className="w-3 h-3" />
              <span className={isMobile ? 'hidden' : 'block'}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
}; 