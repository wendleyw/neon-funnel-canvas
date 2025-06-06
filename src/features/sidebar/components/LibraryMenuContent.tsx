import React from 'react';
import { FunnelComponent, Connection } from '../../../types/funnel';
import { Library, Download, Star } from 'lucide-react';

interface LibraryMenuContentProps {
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
}

export const LibraryMenuContent: React.FC<LibraryMenuContentProps> = ({
  onAddCompleteTemplate
}) => {
  const templateCategories = [
    {
      id: 'lead-generation',
      title: 'Lead Generation',
      description: 'Complete lead capture funnels',
      count: 8,
      color: '#3B82F6',
      icon: '🎯'
    },
    {
      id: 'sales-funnels',
      title: 'Sales Funnels',
      description: 'End-to-end sales processes',
      count: 12,
      color: '#EF4444',
      icon: '📈'
    },
    {
      id: 'webinar-funnels',
      title: 'Webinar Funnels',
      description: 'Complete webinar workflows',
      count: 6,
      color: '#8B5CF6',
      icon: '🎥'
    },
    {
      id: 'product-launch',
      title: 'Product Launch',
      description: 'Launch sequence templates',
      count: 4,
      color: '#10B981',
      icon: '🚀'
    }
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <Library className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-white mb-1">Template Library</h3>
        <p className="text-sm text-gray-400">
          Ready-to-use funnel templates
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-800 p-3 rounded-lg text-center">
          <div className="text-lg font-semibold text-white">30+</div>
          <div className="text-xs text-gray-400">Templates</div>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg text-center">
          <div className="text-lg font-semibold text-white">4.8</div>
          <div className="text-xs text-gray-400">
            <Star className="w-3 h-3 inline mr-1" />
            Rating
          </div>
        </div>
      </div>

      {/* Template Categories */}
      <div className="space-y-3">
        {templateCategories.map((category) => (
          <div
            key={category.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                {category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm">
                  {category.title}
                </h4>
                <p className="text-xs text-gray-400">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {category.count} templates
                  </span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg text-center">
        <h4 className="text-sm font-medium text-white mb-2">Premium Templates</h4>
        <p className="text-xs text-gray-400 mb-3">
          Access 100+ professional templates
        </p>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}; 