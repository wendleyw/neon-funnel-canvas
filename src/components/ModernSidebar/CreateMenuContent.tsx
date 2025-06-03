import React, { useState } from 'react';
import { ComponentTemplate } from '../../types/funnel';
import { DrawingShape } from '../../types/drawing';
import { useIsMobile } from '../../hooks/use-mobile';
import { SourcesTab } from './tabs/SourcesTab';
import { PagesTab } from './tabs/PagesTab';
import { ActionsTab } from './tabs/ActionsTab';

interface CreateMenuContentProps {
  onDragStart: (template: ComponentTemplate) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

type TabId = 'sources' | 'pages' | 'actions';

interface Tab {
  id: TabId;
  label: string;
  count?: number;
  icon?: string;
  description?: string;
}

// Funnel journey: Dive → Exploration → Treasure
const tabs: Tab[] = [
  { 
    id: 'sources', 
    label: 'Sources', 
    count: 8, 
    icon: '🏊‍♂️',
    description: 'Journey start - lead capture'
  },
  { 
    id: 'pages', 
    label: 'Pages', 
    count: 15, 
    icon: '🐠',
    description: 'Navigation - funnel pages'
  },
  { 
    id: 'actions', 
    label: 'Actions', 
    count: 6, 
    icon: '💎',
    description: 'Conversion - actions and results'
  },
];

export const CreateMenuContent: React.FC<CreateMenuContentProps> = ({
  onDragStart,
  onShapeAdd,
  onTemplateClick
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('sources');
  const isMobile = useIsMobile();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sources':
        return (
          <SourcesTab
            onDragStart={onDragStart}
            onTemplateClick={onTemplateClick}
          />
        );
      
      case 'pages':
        return (
          <PagesTab
            onDragStart={onDragStart}
            onTemplateClick={onTemplateClick}
          />
        );
      
      case 'actions':
        return (
          <ActionsTab
            onDragStart={onDragStart}
            onShapeAdd={onShapeAdd}
            onTemplateClick={onTemplateClick}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation - Jornada do Funil */}
      <div className="border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
        <nav className="flex w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-3 py-3 text-sm font-medium text-center relative transition-all duration-200 group min-w-0
                ${activeTab === tab.id
                  ? 'text-blue-400 bg-gray-800/70'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                }
              `}
              title={tab.description}
            >
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {tab.icon && <span className="text-base flex-shrink-0">{tab.icon}</span>}
                <span className="font-medium">{tab.label}</span>
                {tab.count && (
                  <span className={`
                    text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0
                    ${activeTab === tab.id 
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' 
                      : 'bg-gray-700/60 text-gray-500 border border-gray-600/40'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
              </div>
              
              {/* Active Tab Indicator */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400" />
              )}
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0">
        {renderTabContent()}
      </div>
    </div>
  );
}; 