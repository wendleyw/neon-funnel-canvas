import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Package } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ComponentTemplateItem } from './ComponentTemplateItem';
import { digitalLaunchTemplates } from '../../features/digital-launch/data/templates';
import { componentTemplatesByCategory } from '../../data/componentTemplates';

interface DigitalLaunchOrganizedSectionProps {
  onDragStart: (e: React.DragEvent, template: any) => void;
  favorites: string[];
  onToggleFavorite: (templateType: string) => void;
  onAddCompleteTemplate?: (components: any[], connections: any[]) => void;
}

// Organize templates by funnel stages
const funnelStages = {
  'planejamento': {
    label: 'Planejamento & Estratégia',
    icon: '🎯',
    templates: ['target-audience', 'offer']
  },
  'atracao': {
    label: 'Atração de Tráfego',
    icon: '🌐',
    templates: ['traffic-organic', 'traffic-paid']
  },
  'conversao': {
    label: 'Conversão & Captura',
    icon: '📈',
    templates: ['lead-capture', 'webinar-vsl', 'sales-page']
  },
  'relacionamento': {
    label: 'Relacionamento',
    icon: '💌',
    templates: ['nurturing']
  },
  'vendas': {
    label: 'Vendas & Finalização',
    icon: '💰',
    templates: ['checkout-upsell', 'post-sale']
  },
  'otimizacao': {
    label: 'Análise & Otimização',
    icon: '📊',
    templates: ['analytics-optimization']
  }
};

const categoryMapping = {
  'Produto / Oferta': { icon: '🎁', color: 'bg-red-600' },
  'Público-Alvo e Posicionamento': { icon: '🎯', color: 'bg-purple-600' },
  'Persona/Avatar': { icon: '👤', color: 'bg-blue-600' },
  'Posicionamento': { icon: '📍', color: 'bg-green-600' },
  'Tráfego (Aquisição)': { icon: '🚀', color: 'bg-orange-600' },
  'Feed Redes Sociais': { icon: '📱', color: 'bg-pink-600' },
  'Campanha de Anúncios': { icon: '📢', color: 'bg-indigo-600' }
};

export const DigitalLaunchOrganizedSection: React.FC<DigitalLaunchOrganizedSectionProps> = ({
  onDragStart,
  favorites,
  onToggleFavorite
}) => {
  const [openSections, setOpenSections] = useState<string[]>(['planejamento']);
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(s => s !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const toggleCategory = (categoryKey: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryKey) 
        ? prev.filter(c => c !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-semibold text-gray-300">
          Componentes
        </h3>
      </div>

      {/* Funnel Stages */}
      <div className="space-y-2">
        {Object.entries(funnelStages).map(([stageKey, stage]) => (
          <Collapsible
            key={stageKey}
            open={openSections.includes(stageKey)}
            onOpenChange={() => toggleSection(stageKey)}
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{stage.icon}</span>
                  <span className="text-sm font-medium text-gray-300">{stage.label}</span>
                </div>
                {openSections.includes(stageKey) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1 ml-4">
              {stage.templates.map(templateType => {
                const template = digitalLaunchTemplates.find(t => t.type === templateType);
                if (!template) return null;
                
                return (
                  <ComponentTemplateItem
                    key={template.type}
                    template={template}
                    onDragStart={onDragStart}
                    isFavorite={favorites.includes(template.type)}
                    onToggleFavorite={onToggleFavorite}
                    isCompact
                  />
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Other Categories */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2">
          Outras Categorias
        </h4>
        
        {Object.entries(componentTemplatesByCategory).map(([categoryKey, templates]) => {
          const categoryInfo = categoryMapping[categoryKey as keyof typeof categoryMapping];
          if (!categoryInfo) return null;

          return (
            <Collapsible
              key={categoryKey}
              open={openCategories.includes(categoryKey)}
              onOpenChange={() => toggleCategory(categoryKey)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{categoryInfo.icon}</span>
                    <span className="text-sm font-medium text-gray-300">{categoryKey}</span>
                  </div>
                  {openCategories.includes(categoryKey) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1 ml-4">
                {templates.map(template => (
                  <ComponentTemplateItem
                    key={template.type}
                    template={template}
                    onDragStart={onDragStart}
                    isFavorite={favorites.includes(template.type)}
                    onToggleFavorite={onToggleFavorite}
                    isCompact
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};
