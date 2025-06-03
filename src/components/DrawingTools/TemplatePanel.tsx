import React, { useState } from 'react';
import { FunnelTemplate } from '../../types/drawing';
import { marketingFunnelTemplates, getFunnelTemplatesByCategory } from '../../data/funnelTemplates';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Target,
  Zap,
  ArrowRight,
  Download,
  Eye,
  Percent
} from 'lucide-react';
import { Input } from '../ui/input';

interface TemplatePanelProps {
  onTemplateSelect: (template: FunnelTemplate) => void;
  onTemplatePreview?: (template: FunnelTemplate) => void;
  isVisible: boolean;
  onClose?: () => void;
}

const categoryIcons = {
  marketing: TrendingUp,
  sales: Target,
  'customer-journey': Users,
  conversion: ShoppingCart
};

const categoryColors = {
  marketing: 'from-blue-500 to-cyan-500',
  sales: 'from-green-500 to-emerald-500',
  'customer-journey': 'from-purple-500 to-pink-500',
  conversion: 'from-orange-500 to-red-500'
};

export const TemplatePanel: React.FC<TemplatePanelProps> = ({
  onTemplateSelect,
  onTemplatePreview,
  isVisible,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = marketingFunnelTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'marketing', 'sales', 'customer-journey', 'conversion'];

  if (!isVisible) return null;

  return (
    <div className="w-80 h-full bg-gray-900/95 backdrop-blur-sm border-l border-gray-700/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            Funnel Templates
          </h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              ×
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 pt-4">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="marketing" className="text-xs">Marketing</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 mt-1">
            <TabsTrigger value="sales" className="text-xs">Sales</TabsTrigger>
            <TabsTrigger value="conversion" className="text-xs">E-commerce</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-gray-400 text-sm">No templates found</p>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const CategoryIcon = categoryIcons[template.category];
            const categoryGradient = categoryColors[template.category];
            
            return (
              <Card 
                key={template.id} 
                className="bg-gray-800/50 border-gray-700/50 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer group"
                onClick={() => onTemplateSelect(template)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${categoryGradient} text-white`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm text-white group-hover:text-cyan-400 transition-colors">
                          {template.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            {template.category}
                          </Badge>
                          <span className="text-2xl">{template.thumbnail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {template.description}
                  </CardDescription>
                  
                  {/* Metrics */}
                  {template.metrics && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3 text-blue-400" />
                          <span className="text-xs text-gray-400">Stages</span>
                        </div>
                        <span className="text-sm font-medium text-white">{template.metrics.stages}</span>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3 text-green-400" />
                          <span className="text-xs text-gray-400">Rate</span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {(template.metrics.expectedConversionRate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTemplateSelect(template);
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Use Template
                    </Button>
                    
                    {onTemplatePreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTemplatePreview(template);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">
            Drag templates to canvas or click to apply
          </p>
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
            <ArrowRight className="h-3 w-3" />
            <span>Professional marketing funnels</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 