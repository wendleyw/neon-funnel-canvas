import React, { useState } from 'react';
import { ComponentTemplate } from '../../types/funnel';
import { useComponentTemplates } from '../../hooks/useComponentTemplates';
import { MARKETING_COMPONENT_TEMPLATES } from '../../data/componentTemplates';
import { ChevronDown, Plus, Clock, Target, Zap } from 'lucide-react';

interface FunnelContentProps {
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  onTemplateClick: (template: ComponentTemplate) => void;
}

export const FunnelContent: React.FC<FunnelContentProps> = ({
  onDragStart,
  onTemplateClick
}) => {
  const { 
    templatesByCategory, 
    getCategoryInfo, 
    getPriorityCategories, 
    getSpecializedDiagramCategories,
    getUtilityCategories
  } = useComponentTemplates();
  
  const [expanded, setExpanded] = useState(new Set(['traffic-sources']));

  const toggle = (cat: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  // Enhanced component card with more information
  const ComponentCard = ({ template }: { template: ComponentTemplate }) => {
    const categoryInfo = getCategoryInfo(template.category);
    
    // Get some sample metrics or properties to display
    const getDisplayInfo = () => {
      const props = template.defaultProps?.properties;
      if (template.category === 'traffic-sources') {
        return props?.budget_daily ? `$${props.budget_daily}/day` : 'Traffic Generation';
      }
      if (template.category === 'lead-capture') {
        return props?.conversion_goal || 'Lead Capture';
      }
      if (template.category === 'nurturing') {
        return props?.email_count ? `${props.email_count} emails` : 'Nurturing';
      }
      if (template.category === 'sales-conversion') {
        return props?.price_point || 'Sales';
      }
      if (template.diagramType) {
        return template.diagramType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      return template.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getStatusIcon = () => {
      const status = template.defaultProps?.status;
      switch (status) {
        case 'active': return <Zap className="w-3 h-3 text-green-400" />;
        case 'draft': return <Clock className="w-3 h-3 text-yellow-400" />;
        default: return <Target className="w-3 h-3 text-blue-400" />;
      }
    };

    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, template)}
        onClick={() => onTemplateClick(template)}
        className="group relative component-card flex flex-col gap-3 p-4 rounded-xl border border-gray-700/60 bg-gradient-to-br from-gray-800/40 to-gray-900/60 hover:from-gray-700/50 hover:to-gray-800/70 hover:border-gray-600 transition-all duration-300 cursor-pointer backdrop-blur-sm"
      >
        {/* Header with icon and action */}
        <div className="flex items-center justify-between">
          <div 
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-medium transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ 
              backgroundColor: `${template.color}15`,
              color: template.color,
              border: `1px solid ${template.color}30`,
              boxShadow: `0 4px 12px ${template.color}20`
            }}
          >
            {template.icon}
          </div>
          
          {/* Status and action */}
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Plus className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-semibold text-white text-sm group-hover:text-white transition-colors">
              {template.label}
            </div>
            {categoryInfo && (
              <span 
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ 
                  backgroundColor: `${categoryInfo.color}20`,
                  color: categoryInfo.color,
                  border: `1px solid ${categoryInfo.color}30`
                }}
              >
                {categoryInfo.label.split(' ')[1] || categoryInfo.label}
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-400 mb-2 line-clamp-2">
            {template.description}
          </div>

          {/* Additional info */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {getDisplayInfo()}
            </span>
            {template.diagramType && (
              <span className="text-purple-400 font-medium">
                Phase 2
              </span>
            )}
          </div>
        </div>

        {/* Hover glow effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${template.color}10, transparent 70%)`
          }}
        />
      </div>
    );
  };

  // Clean category section
  const CategorySection = ({ categoryKey, templates }: { categoryKey: string, templates: ComponentTemplate[] }) => {
    const info = getCategoryInfo(categoryKey);
    const isOpen = expanded.has(categoryKey);
    
    if (!info || !templates.length) return null;

    return (
      <div className="mb-6">
        {/* Category header */}
        <button
          onClick={() => toggle(categoryKey)}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/30 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full transition-all duration-300 group-hover:scale-125"
              style={{ 
                backgroundColor: info.color,
                boxShadow: `0 0 12px ${info.color}40`
              }}
            />
            <span className="font-semibold text-white text-sm">{info.label}</span>
            <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
              {templates.length}
            </span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Components grid */}
        {isOpen && (
          <div className="mt-4 grid gap-3">
            {templates.map(template => (
              <ComponentCard key={template.type} template={template} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced header */}
      <div className="p-4 border-b border-gray-800/50">
        <h2 className="font-bold text-white text-lg">Components</h2>
        <p className="text-xs text-gray-400 mt-1">
          Drag to canvas or click to add • {MARKETING_COMPONENT_TEMPLATES.length} total
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto sidebar-scroll">
        <div className="p-4 space-y-8">
          
          {/* Marketing Section */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full glow-effect" />
              <div>
                <span className="text-sm font-bold text-white">
                  Marketing Components
                </span>
                <p className="text-xs text-gray-400">
                  Essential tools for your marketing funnel
                </p>
              </div>
            </div>
            {getPriorityCategories().map(cat => 
              <CategorySection 
                key={cat} 
                categoryKey={cat} 
                templates={templatesByCategory[cat] || []} 
              />
            )}
          </div>

          {/* Specialized Section */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full glow-effect" />
              <div>
                <span className="text-sm font-bold text-white">
                  Specialized Diagrams
                </span>
                <p className="text-xs text-gray-400">
                  Advanced visualization components
                </p>
              </div>
            </div>
            {getSpecializedDiagramCategories().map(cat => 
              <CategorySection 
                key={cat} 
                categoryKey={cat} 
                templates={templatesByCategory[cat] || []} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 