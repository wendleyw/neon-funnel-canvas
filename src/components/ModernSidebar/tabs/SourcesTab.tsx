import React, { useState } from 'react';
import { 
  Facebook, 
  Instagram, 
  Search, 
  Video, 
  Linkedin, 
  Music, 
  Twitter, 
  Pin, 
  TrendingUp, 
  Mail, 
  Users, 
  Star, 
  FileText, 
  Mic, 
  Link,
  MessageCircle,
  Send,
  Camera,
  MessageSquare,
  MonitorPlay,
  Globe,
  MousePointer,
  Database,
  Cloud,
  Hash,
  Bot,
  Newspaper,
  Radio,
  Monitor,
  Square,
  Calendar,
  Phone,
  Target,
  Zap,
  Droplets,
  Building,
  HeadphonesIcon,
  VideoIcon,
  ShoppingCart,
  Award,
  MapPin,
  GraduationCap,
  Briefcase,
  Handshake,
  CreditCard,
  FileBarChart,
  QrCode,
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ComponentTemplate } from '../../../types/funnel';
import MARKETING_COMPONENT_TEMPLATES from '../../../data/componentTemplates';

interface SourcesTabProps {
  onDragStart: (template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

// Icon mapping for traffic sources
const iconMap = {
  'Facebook': Facebook,
  'Instagram': Instagram,
  'Search': Search,
  'Video': Video,
  'Linkedin': Linkedin,
  'Music': Music,
  'Twitter': Twitter,
  'Pin': Pin,
  'TrendingUp': TrendingUp,
  'Mail': Mail,
  'Users': Users,
  'Star': Star,
  'FileText': FileText,
  'Mic': Mic,
  'Link': Link,
  'MessageCircle': MessageCircle,
  'Send': Send,
  'Camera': Camera,
  'MessageSquare': MessageSquare,
  'MonitorPlay': MonitorPlay,
  'Globe': Globe,
  'MousePointer': MousePointer,
  'Database': Database,
  'Cloud': Cloud,
  'Hash': Hash,
  'Bot': Bot,
  'Newspaper': Newspaper,
  'Radio': Radio,
  'Monitor': Monitor,
  'Square': Square,
  'Calendar': Calendar,
  'Phone': Phone,
  'Target': Target,
  'Zap': Zap,
  'Droplets': Droplets,
  'Building': Building,
  'HeadphonesIcon': HeadphonesIcon,
  'VideoIcon': VideoIcon,
  'ShoppingCart': ShoppingCart,
  'Award': Award,
  'MapPin': MapPin,
  'GraduationCap': GraduationCap,
  'Briefcase': Briefcase,
  'Handshake': Handshake,
  'CreditCard': CreditCard,
  'FileBarChart': FileBarChart,
  'QrCode': QrCode,
  'Plus': Plus,
  'ChevronDown': ChevronDown,
  'ChevronRight': ChevronRight,
};

const TrafficSourceIcon: React.FC<{ iconName: string; className?: string }> = ({ iconName, className = "w-5 h-5" }) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? <IconComponent className={className} /> : <Search className={className} />;
};

export const SourcesTab: React.FC<SourcesTabProps> = ({
  onDragStart,
  onTemplateClick
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<ComponentTemplate | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set()); // Start with nothing expanded
  
  // Organize sources by the user's requested categories
  const paidSources = MARKETING_COMPONENT_TEMPLATES.filter(template => 
    template.category === 'traffic-sources-paid'
  );
  
  const organicSources = MARKETING_COMPONENT_TEMPLATES.filter(template => 
    template.category === 'traffic-sources-search' || template.category === 'traffic-sources-social'
  );
  
  const searchSources = MARKETING_COMPONENT_TEMPLATES.filter(template => 
    template.category === 'traffic-sources-search'
  );
  
  const offlineSources = MARKETING_COMPONENT_TEMPLATES.filter(template => 
    template.category === 'traffic-sources-offline'
  );
  
  const crmSources = MARKETING_COMPONENT_TEMPLATES.filter(template => 
    template.category === 'traffic-sources-crm'
  );
  
  const otherSources = MARKETING_COMPONENT_TEMPLATES.filter(template => 
    template.category === 'traffic-sources-other' || template.category === 'traffic-sources-content'
  );
  
  const messagingSources = MARKETING_COMPONENT_TEMPLATES.filter(template => 
    template.category === 'traffic-sources-messaging'
  );
  
  const otherSoftwareSources = MARKETING_COMPONENT_TEMPLATES.filter(template => 
    template.category === 'traffic-sources-other-sites' || template.category === 'custom-icons'
  );

  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  };

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const getBudgetInfo = (template: ComponentTemplate) => {
    const budget = template.defaultProps.properties?.budget_daily;
    return budget ? `$${budget}/day` : 'Flexible budget';
  };

  const renderCategoryHeader = (title: string, count: number, categoryKey: string, color: string) => {
    const isExpanded = expandedCategories.has(categoryKey);
    
    return (
      <div className="bg-gray-800 rounded-lg">
        <button
          onClick={() => toggleCategory(categoryKey)}
          className="w-full p-4 text-left hover:bg-gray-750 transition-colors duration-200 focus:outline-none focus:bg-gray-750 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: color }}></div>
              <div>
                <h4 className="text-sm font-medium text-gray-200">{title}</h4>
                <span className="text-xs text-gray-400">{count} sources</span>
              </div>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>
      </div>
    );
  };

  const renderExpandedContent = (sources: ComponentTemplate[]) => {
    return (
      <div className="bg-gray-750 rounded-lg p-4 mt-3">
        <div className="grid grid-cols-6 gap-3">
          {sources.map((template, index) => (
            <div
              key={template.type}
              className="group relative"
              draggable
              onDragStart={(e) => handleDragStart(e, template)}
              onClick={() => onTemplateClick?.(template)}
              onMouseEnter={() => setHoveredTemplate(template)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Icon Container */}
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transform transition-all duration-200 hover:scale-110 hover:shadow-lg border border-transparent hover:border-gray-600"
                style={{ 
                  backgroundColor: `${template.color}15`, 
                  borderColor: `${template.color}40`
                }}
              >
                <TrafficSourceIcon 
                  iconName={template.icon} 
                  className="w-4 h-4"
                />
              </div>
              
              {/* Smart positioned tooltip */}
              {hoveredTemplate?.type === template.type && (
                <div 
                  className={`absolute z-50 pointer-events-none ${
                    // Position based on column to avoid cutoff
                    index % 6 < 3 
                      ? 'left-0' // Left side icons: tooltip to the right
                      : 'right-0' // Right side icons: tooltip to the left
                  } ${
                    // Vertical positioning
                    'bottom-full mb-2'
                  }`}
                >
                  <div className={`bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg shadow-xl min-w-max max-w-[200px] ${
                    index % 6 < 3 ? 'ml-2' : 'mr-2'
                  }`}>
                    <div className="text-sm font-medium text-white leading-tight">
                      {template.label}
                    </div>
                    <div className="text-xs text-gray-300 leading-tight">
                      {template.category === 'traffic-sources-paid' && 'Paid advertising campaigns'}
                      {template.category === 'traffic-sources-search' && 'Organic search traffic'}
                      {template.category === 'traffic-sources-social' && 'Organic social media'}
                      {template.category === 'traffic-sources-offline' && 'Traditional offline marketing'}
                      {template.category === 'traffic-sources-crm' && 'CRM and automation platform'}
                      {template.category === 'traffic-sources-messaging' && 'Direct messaging channels'}
                      {template.category === 'traffic-sources-other-sites' && 'Third-party platforms'}
                      {template.category === 'traffic-sources-other' && 'General traffic sources'}
                      {template.category === 'traffic-sources-content' && 'Content marketing channels'}
                      {template.category === 'custom-icons' && 'Custom uploaded sources'}
                    </div>
                    {/* Smart arrow positioning */}
                    <div className={`absolute top-full ${
                      index % 6 < 3 ? 'left-4' : 'right-4'
                    } transform -translate-x-1/2 -mt-1`}>
                      <div className="w-2 h-2 bg-gray-900 border-r border-b border-gray-700 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Active indicator dot */}
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const totalSources = paidSources.length + organicSources.length + searchSources.length + 
                      offlineSources.length + crmSources.length + otherSources.length + 
                      messagingSources.length + otherSoftwareSources.length;

  // Check which categories are expanded for each row
  const isPaidOrOrganicExpanded = expandedCategories.has('paid') || expandedCategories.has('organic');
  const isSearchOrOfflineExpanded = expandedCategories.has('search') || expandedCategories.has('offline');
  const isCrmOrOtherExpanded = expandedCategories.has('crm') || expandedCategories.has('other');
  const isMessagingOrSoftwareExpanded = expandedCategories.has('messaging') || expandedCategories.has('other-software');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-sm font-medium text-gray-300 mb-1">Traffic Sources</h3>
        <p className="text-xs text-gray-400">Drag icons to canvas</p>
        <div className="text-xs text-gray-500 mt-2">
          {totalSources} sources available
        </div>
      </div>
      
      {/* Scrollable Content with Row-based Expansion */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Row 1: PAID | ORGANIC */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {renderCategoryHeader('PAID', paidSources.length, 'paid', '#EF4444')}
            {renderCategoryHeader('ORGANIC', organicSources.length, 'organic', '#10B981')}
          </div>
          
          {/* Expanded content for Row 1 */}
          {isPaidOrOrganicExpanded && (
            <div className="space-y-3">
              {expandedCategories.has('paid') && (
                <div>
                  <div className="text-xs text-gray-400 mb-2 px-2">PAID SOURCES</div>
                  {renderExpandedContent(paidSources)}
                </div>
              )}
              {expandedCategories.has('organic') && (
                <div>
                  <div className="text-xs text-gray-400 mb-2 px-2">ORGANIC SOURCES</div>
                  {renderExpandedContent(organicSources)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Row 2: SEARCH | OFFLINE */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {renderCategoryHeader('SEARCH', searchSources.length, 'search', '#3B82F6')}
            {renderCategoryHeader('OFFLINE', offlineSources.length, 'offline', '#6B7280')}
          </div>
          
          {/* Expanded content for Row 2 */}
          {isSearchOrOfflineExpanded && (
            <div className="space-y-3">
              {expandedCategories.has('search') && (
                <div>
                  <div className="text-xs text-gray-400 mb-2 px-2">SEARCH SOURCES</div>
                  {renderExpandedContent(searchSources)}
                </div>
              )}
              {expandedCategories.has('offline') && (
                <div>
                  <div className="text-xs text-gray-400 mb-2 px-2">OFFLINE SOURCES</div>
                  {renderExpandedContent(offlineSources)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Row 3: CRM | OTHER */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {renderCategoryHeader('CRM', crmSources.length, 'crm', '#F59E0B')}
            {renderCategoryHeader('OTHER', otherSources.length, 'other', '#6366F1')}
          </div>
          
          {/* Expanded content for Row 3 */}
          {isCrmOrOtherExpanded && (
            <div className="space-y-3">
              {expandedCategories.has('crm') && (
                <div>
                  <div className="text-xs text-gray-400 mb-2 px-2">CRM SOURCES</div>
                  {renderExpandedContent(crmSources)}
                </div>
              )}
              {expandedCategories.has('other') && (
                <div>
                  <div className="text-xs text-gray-400 mb-2 px-2">OTHER SOURCES</div>
                  {renderExpandedContent(otherSources)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Row 4: MESSAGING | OTHER SOFTWARE */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {renderCategoryHeader('MESSAGING', messagingSources.length, 'messaging', '#8B5CF6')}
            {renderCategoryHeader('OTHER SOFTWARE', otherSoftwareSources.length, 'other-software', '#EC4899')}
          </div>
          
          {/* Expanded content for Row 4 */}
          {isMessagingOrSoftwareExpanded && (
            <div className="space-y-3">
              {expandedCategories.has('messaging') && (
                <div>
                  <div className="text-xs text-gray-400 mb-2 px-2">MESSAGING SOURCES</div>
                  {renderExpandedContent(messagingSources)}
                </div>
              )}
              {expandedCategories.has('other-software') && (
                <div>
                  <div className="text-xs text-gray-400 mb-2 px-2">OTHER SOFTWARE SOURCES</div>
                  {renderExpandedContent(otherSoftwareSources)}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}; 