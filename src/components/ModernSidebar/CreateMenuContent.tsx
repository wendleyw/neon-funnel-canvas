import React, { useState } from 'react';
import { ComponentTemplate } from '../../types/funnel';
import { DrawingShape } from '../../types/drawing';
import { useIsMobile } from '../../hooks/use-mobile';
import { SourcesTab } from './tabs/SourcesTab';
import { PagesTab } from './tabs/PagesTab';
import { ActionsTab } from './tabs/ActionsTab';
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
  count?: number;
  icon?: any;
  description?: string;
}

// Funnel journey: Dive → Exploration → Treasure
const tabs: Tab[] = [
  { 
    id: 'sources', 
    label: 'Sources', 
    count: 8, 
    icon: Globe,
    description: 'Journey start - lead capture'
  },
  { 
    id: 'pages', 
    label: 'Pages', 
    count: 15, 
    icon: FileText,
    description: 'Navigation - funnel pages'
  },
  { 
    id: 'actions', 
    label: 'Actions', 
    count: 6, 
    icon: Zap,
    description: 'Conversion - actions and results'
  },
];

export const CreateMenuContent: React.FC<CreateMenuContentProps> = ({
  onDragStart,
  onShapeAdd,
  onTemplateClick
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('sources');
  const isMobile = useIsMobile();

  const tabs: { id: TabType; label: string; icon: any; count: number }[] = [
    { id: 'sources', label: 'Sources', icon: Globe, count: 8 },
    { id: 'pages', label: 'Pages', icon: FileText, count: 15 },
    { id: 'actions', label: 'Actions', icon: Zap, count: 6 },
  ];

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Tabs - Responsive and Compact */}
      <div className="flex border-b border-gray-800 bg-black text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 px-1 py-2 font-medium transition-colors relative min-w-0 ${
              activeTab === tab.id
                ? 'text-blue-400 bg-gray-900/50'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-900/30'
            }`}
          >
            <div className="flex items-center gap-1">
              <tab.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className={`text-xs px-1 py-0.5 rounded-full flex-shrink-0 min-w-[1.25rem] text-center ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {tab.count}
              </span>
            </div>
            <span className="truncate text-xs w-full text-center">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden bg-black">
        {activeTab === 'sources' && (
          <SourcesTab
            onDragStart={onDragStart}
            onTemplateClick={onTemplateClick}
          />
        )}
        {activeTab === 'pages' && (
          <PagesTab
            onDragStart={onDragStart}
            onTemplateClick={onTemplateClick}
          />
        )}
        {activeTab === 'actions' && (
          <ActionsTab
            onDragStart={onDragStart}
            onShapeAdd={onShapeAdd}
            onTemplateClick={onTemplateClick}
          />
        )}
      </div>
    </div>
  );
}; 