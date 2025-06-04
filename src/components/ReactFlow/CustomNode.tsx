import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { 
  Edit2, 
  Trash2, 
  Link, 
  Copy, 
  Play,
  Pause,
  Settings,
  Zap,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';

// Mock dos templates - você pode melhorar isso depois
const getTemplateInfo = (type: string) => {
  const templateMap: Record<string, { icon: string; color: string; label: string }> = {
    'landing-page': { icon: '🎯', color: '#3B82F6', label: 'Landing Page' },
    'quiz': { icon: '❓', color: '#8B5CF6', label: 'Quiz' },
    'form': { icon: '📝', color: '#10B981', label: 'Formulário' },
    'email-sequence': { icon: '📧', color: '#F59E0B', label: 'E-mail Sequence' },
    'checkout': { icon: '💳', color: '#EF4444', label: 'Checkout' },
    'sales-page': { icon: '📈', color: '#DC2626', label: 'Sales Page' },
    'note': { icon: '📝', color: '#FBBF24', label: 'Nota' },
    'arrow': { icon: '➡️', color: '#3B82F6', label: 'Seta' },
    'frame': { icon: '⬜', color: '#6B7280', label: 'Frame' },
    'webinar-live': { icon: '🎥', color: '#EF4444', label: 'Webinar Live' },
    'webinar-replay': { icon: '🎬', color: '#7C2D12', label: 'Webinar Replay' },
    'opt-in-page': { icon: '📥', color: '#8B5CF6', label: 'Opt-in Page' },
    'download-page': { icon: '📥', color: '#8B5CF6', label: 'Download Page' },
    'thank-you-page': { icon: '✅', color: '#10B981', label: 'Thank You Page' },
    'calendar-page': { icon: '📅', color: '#3B82F6', label: 'Calendar Page' },
    'default': { icon: '🔧', color: '#6B7280', label: 'Componente' }
  };
  
  return templateMap[type] || templateMap.default;
};

// Function to identify action components
const isActionComponent = (type: string): boolean => {
  const actionTypes = [
    'checkout',
    'form', 
    'quiz',
    'calendar-page',
    'opt-in-page',
    'download-page',
    'email-sequence',
    'thank-you-page'
  ];
  return actionTypes.includes(type);
};

// Simple button component for action items
const SimpleActionButton: React.FC<{ type: string; title?: string; color: string }> = ({ type, title, color }) => {
  const template = getTemplateInfo(type);
  
  return (
    <div className="w-full h-20 flex items-center justify-center p-2">
      <div 
        className="px-8 py-4 rounded-xl font-bold text-white text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-white/20 hover:border-white/40 relative overflow-hidden group"
        style={{ backgroundColor: color }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Button content */}
        <div className="flex items-center gap-3 relative z-10">
          <span className="text-2xl drop-shadow-lg">{template.icon}</span>
          <div className="text-left">
            <div className="text-sm font-bold tracking-wide uppercase">
              {title || template.label}
            </div>
            <div className="text-xs opacity-90 font-medium">
              Clique para ação
            </div>
          </div>
        </div>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 animate-pulse"></div>
      </div>
    </div>
  );
};

// Component to create simple, clean mockups for different page types in canvas nodes
const ComponentPreviewMockup: React.FC<{ type: string; className?: string; customImage?: string; displayAsButton?: boolean; title?: string }> = ({ type, className = '', customImage, displayAsButton = false, title }) => {
  const template = getTemplateInfo(type);
  
  // If this is an action component and should be displayed as button
  if (displayAsButton && isActionComponent(type)) {
    return (
      <div className={className}>
        <SimpleActionButton type={type} title={title} color={template.color} />
      </div>
    );
  }

  // If there's a custom image, show it instead of the mockup
  if (customImage) {
    return (
      <div className={`w-full h-64 rounded border border-gray-600 overflow-hidden ${className}`}>
        <img 
          src={customImage} 
          alt="Custom preview" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, fall back to default mockup
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden">
          {/* Fallback mockup if image fails */}
          {getMockupContentByType(type)}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {getMockupContentByType(type)}
    </div>
  );
};

// Extract mockup content to a separate function for reuse
const getMockupContentByType = (type: string) => {
  switch (type) {
    case 'landing-page':
      return (
        <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded border border-indigo-500/30 overflow-hidden">
          {/* Modern header with gradient */}
          <div className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="p-2 space-y-1">
            {/* Navigation bar */}
            <div className="flex justify-between items-center mb-1">
              <div className="w-6 h-1 bg-indigo-400 rounded-sm"></div>
              <div className="flex gap-0.5">
                <div className="w-2 h-0.5 bg-gray-400 rounded-sm"></div>
                <div className="w-2 h-0.5 bg-gray-400 rounded-sm"></div>
                <div className="w-2 h-0.5 bg-gray-400 rounded-sm"></div>
                <div className="w-2 h-0.5 bg-gray-400 rounded-sm"></div>
              </div>
            </div>
            
            {/* Hero section */}
            <div className="text-center space-y-1 py-1 bg-gray-800/30 rounded-sm">
              <div className="w-full h-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-sm mx-auto"></div>
              <div className="w-4/5 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-sm mx-auto"></div>
              <div className="w-full h-0.5 bg-gray-400 rounded-sm"></div>
              <div className="w-3/4 h-0.5 bg-gray-400 rounded-sm mx-auto"></div>
              <div className="w-4/5 h-0.5 bg-gray-400 rounded-sm mx-auto"></div>
              <div className="w-5/6 h-0.5 bg-gray-400 rounded-sm mx-auto"></div>
              
              {/* Hero CTA */}
              <div className="w-10 h-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-sm mx-auto mt-1 shadow-lg"></div>
            </div>
            
            {/* Features section */}
            <div className="space-y-1">
              <div className="w-2/3 h-1.5 bg-indigo-300 rounded-sm mx-auto"></div>
              <div className="flex gap-1">
                <div className="w-1/3 h-4 bg-gray-700 rounded-sm flex flex-col justify-center items-center">
                  <div className="w-2 h-0.5 bg-blue-400 rounded-sm mb-0.5"></div>
                  <div className="w-3/4 h-0.5 bg-gray-500 rounded-sm"></div>
                </div>
                <div className="w-1/3 h-4 bg-gray-700 rounded-sm flex flex-col justify-center items-center">
                  <div className="w-2 h-0.5 bg-green-400 rounded-sm mb-0.5"></div>
                  <div className="w-3/4 h-0.5 bg-gray-500 rounded-sm"></div>
                </div>
                <div className="w-1/3 h-4 bg-gray-700 rounded-sm flex flex-col justify-center items-center">
                  <div className="w-2 h-0.5 bg-purple-400 rounded-sm mb-0.5"></div>
                  <div className="w-3/4 h-0.5 bg-gray-500 rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* About section */}
            <div className="space-y-0.5">
              <div className="w-1/2 h-1.5 bg-indigo-400 rounded-sm"></div>
              <div className="flex gap-1">
                <div className="w-1/2 space-y-0.5">
                  <div className="w-full h-2.5 bg-gray-700 rounded-sm"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-4/5 h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
                <div className="w-1/2 space-y-0.5">
                  <div className="w-full h-2.5 bg-gray-700 rounded-sm"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-4/5 h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Services section */}
            <div className="space-y-0.5">
              <div className="w-1/2 h-1.5 bg-purple-400 rounded-sm"></div>
              <div className="grid grid-cols-2 gap-1">
                <div className="h-3 bg-gray-700 rounded-sm p-0.5">
                  <div className="w-2/3 h-0.5 bg-purple-400 rounded-sm mb-0.5"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
                <div className="h-3 bg-gray-700 rounded-sm p-0.5">
                  <div className="w-2/3 h-0.5 bg-purple-400 rounded-sm mb-0.5"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Testimonials section */}
            <div className="space-y-0.5">
              <div className="w-2/3 h-1.5 bg-yellow-400 rounded-sm mx-auto"></div>
              <div className="flex gap-1">
                <div className="w-1/3 h-3 bg-gray-700 rounded-sm p-0.5">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mb-0.5"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
                <div className="w-1/3 h-3 bg-gray-700 rounded-sm p-0.5">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mb-0.5"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
                <div className="w-1/3 h-3 bg-gray-700 rounded-sm p-0.5">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mb-0.5"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Contact section */}
            <div className="space-y-0.5">
              <div className="w-1/2 h-1.5 bg-green-400 rounded-sm"></div>
              <div className="flex gap-1">
                <div className="w-2/3 space-y-0.5">
                  <div className="w-full h-1 bg-gray-700 rounded-sm"></div>
                  <div className="w-full h-1 bg-gray-700 rounded-sm"></div>
                  <div className="w-6 h-1.5 bg-green-500 rounded-sm"></div>
                </div>
                <div className="w-1/3">
                  <div className="w-full h-4 bg-gray-700 rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Final CTA */}
            <div className="text-center space-y-0.5 bg-indigo-900/50 rounded-sm p-1">
              <div className="w-3/4 h-1.5 bg-green-400 rounded-sm mx-auto"></div>
              <div className="w-12 h-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-sm mx-auto"></div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between pt-1 border-t border-gray-700">
              <div className="w-6 h-1 bg-indigo-400 rounded-sm"></div>
              <div className="flex gap-0.5">
                <div className="w-1 h-1 bg-gray-500 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-500 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-500 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-500 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-500 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'sales-page':
      return (
        <div className="w-full h-64 bg-gray-800 rounded border border-gray-600 overflow-hidden">
          <div className="h-0.5 bg-red-500"></div>
          <div className="p-2 space-y-1">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-full h-2.5 bg-red-500 rounded-sm"></div>
              <div className="w-4/5 h-2 bg-red-400 rounded-sm mx-auto"></div>
              <div className="w-6 h-1.5 bg-yellow-400 rounded-sm mx-auto"></div>
            </div>
            
            {/* Content sections */}
            <div className="space-y-1">
              <div className="w-full h-0.5 bg-gray-400 rounded-sm"></div>
              <div className="w-5/6 h-0.5 bg-gray-400 rounded-sm"></div>
              <div className="w-4/5 h-0.5 bg-gray-400 rounded-sm"></div>
              <div className="w-full h-0.5 bg-gray-400 rounded-sm"></div>
              
              {/* Problem section */}
              <div className="bg-gray-700/50 rounded-sm p-1 space-y-0.5">
                <div className="w-3/4 h-2 bg-orange-400 rounded-sm"></div>
                <div className="space-y-0.5">
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-5/6 h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-4/5 h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
              </div>
              
              {/* Solution section */}
              <div className="bg-blue-900/30 rounded-sm p-1 space-y-0.5">
                <div className="w-3/4 h-2 bg-blue-400 rounded-sm"></div>
                <div className="space-y-0.5">
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-4/5 h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-5/6 h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="space-y-0.5">
                <div className="w-1/2 h-1.5 bg-green-400 rounded-sm"></div>
                <div className="flex gap-1">
                  <div className="w-1/2 space-y-0.5">
                    <div className="w-full h-1.5 bg-green-400 rounded-sm"></div>
                    <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
                    <div className="w-4/5 h-0.5 bg-gray-600 rounded-sm"></div>
                    <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  </div>
                  <div className="w-1/2 space-y-0.5">
                    <div className="w-full h-1.5 bg-green-400 rounded-sm"></div>
                    <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
                    <div className="w-4/5 h-0.5 bg-gray-600 rounded-sm"></div>
                    <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  </div>
                </div>
              </div>
              
              {/* Social proof */}
              <div className="bg-gray-700/30 rounded-sm p-1 space-y-0.5">
                <div className="w-2/3 h-1.5 bg-yellow-400 rounded-sm mx-auto"></div>
                <div className="flex gap-1">
                  <div className="w-1/3 h-2.5 bg-gray-700 rounded-sm"></div>
                  <div className="w-1/3 h-2.5 bg-gray-700 rounded-sm"></div>
                  <div className="w-1/3 h-2.5 bg-gray-700 rounded-sm"></div>
                </div>
                <div className="space-y-0.5">
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-4/5 h-0.5 bg-gray-600 rounded-sm mx-auto"></div>
                </div>
              </div>
              
              {/* Price section */}
              <div className="text-center space-y-1 bg-green-900/30 rounded-sm p-1">
                <div className="w-2/3 h-2 bg-green-400 rounded-sm mx-auto"></div>
                <div className="w-12 h-4 bg-red-500 rounded-sm mx-auto font-bold flex items-center justify-center">
                  <div className="w-8 h-2 bg-white rounded-sm"></div>
                </div>
                <div className="w-3/4 h-0.5 bg-gray-400 rounded-sm mx-auto"></div>
                <div className="w-1/2 h-0.5 bg-gray-500 rounded-sm mx-auto"></div>
              </div>
              
              {/* Guarantee */}
              <div className="bg-blue-900/20 rounded-sm p-1 space-y-0.5">
                <div className="w-1/2 h-1.5 bg-blue-400 rounded-sm mx-auto"></div>
                <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm mx-auto"></div>
                <div className="w-2/3 h-0.5 bg-gray-600 rounded-sm mx-auto"></div>
              </div>
              
              {/* Final CTA */}
              <div className="w-12 h-3 bg-red-500 rounded-sm mx-auto"></div>
            </div>
          </div>
        </div>
      );

    case 'opt-in-page':
    case 'download-page':
      return (
        <div className="w-full h-48 bg-gray-800 rounded border border-gray-600 overflow-hidden">
          <div className="p-2 space-y-1 text-center">
            {/* Header */}
            <div className="w-6 h-1 bg-purple-500 rounded-sm mx-auto"></div>
            <div className="w-full h-2 bg-purple-500 rounded-sm"></div>
            <div className="w-4/5 h-1.5 bg-purple-400 rounded-sm mx-auto"></div>
            
            {/* Description */}
            <div className="space-y-0.5 py-1">
              <div className="w-full h-0.5 bg-gray-400 rounded-sm"></div>
              <div className="w-5/6 h-0.5 bg-gray-400 rounded-sm mx-auto"></div>
              <div className="w-4/5 h-0.5 bg-gray-400 rounded-sm mx-auto"></div>
              <div className="w-full h-0.5 bg-gray-400 rounded-sm"></div>
            </div>
            
            {/* Benefits */}
            <div className="space-y-1">
              <div className="w-3/4 h-1.5 bg-green-400 rounded-sm mx-auto"></div>
              <div className="grid grid-cols-3 gap-1">
                <div className="space-y-0.5">
                  <div className="w-full h-1 bg-green-300 rounded-sm"></div>
                  <div className="w-3/4 h-0.5 bg-gray-500 rounded-sm mx-auto"></div>
                </div>
                <div className="space-y-0.5">
                  <div className="w-full h-1 bg-green-300 rounded-sm"></div>
                  <div className="w-3/4 h-0.5 bg-gray-500 rounded-sm mx-auto"></div>
                </div>
                <div className="space-y-0.5">
                  <div className="w-full h-1 bg-green-300 rounded-sm"></div>
                  <div className="w-3/4 h-0.5 bg-gray-500 rounded-sm mx-auto"></div>
                </div>
              </div>
            </div>
            
            {/* Lead magnet preview */}
            <div className="bg-gray-700/50 rounded-sm p-1 space-y-0.5">
              <div className="w-3/4 h-1 bg-blue-400 rounded-sm mx-auto"></div>
              <div className="w-full h-3 bg-gray-700 rounded-sm"></div>
              <div className="w-2/3 h-0.5 bg-gray-500 rounded-sm mx-auto"></div>
            </div>
            
            {/* Form */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-gray-600 border border-gray-500 rounded-sm"></div>
              <div className="w-full h-1.5 bg-gray-600 border border-gray-500 rounded-sm"></div>
              <div className="w-10 h-2 bg-purple-500 rounded-sm mx-auto"></div>
            </div>
            
            {/* Trust indicators */}
            <div className="space-y-0.5 pt-1">
              <div className="w-2/3 h-0.5 bg-gray-400 rounded-sm mx-auto"></div>
              <div className="flex gap-1 justify-center">
                <div className="w-3 h-1 bg-blue-400 rounded-sm"></div>
                <div className="w-3 h-1 bg-blue-400 rounded-sm"></div>
                <div className="w-3 h-1 bg-blue-400 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'webinar-live':
    case 'webinar-replay':
      return (
        <div className="w-full h-48 bg-gray-800 rounded border border-gray-600 overflow-hidden">
          <div className="p-2 space-y-1">
            {/* Live indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-4 h-1 bg-red-500 rounded-sm"></div>
              </div>
              <div className="w-6 h-1 bg-gray-400 rounded-sm"></div>
            </div>
            
            {/* Video player */}
            <div className="w-full h-12 bg-gray-700 rounded-sm flex items-center justify-center relative">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute bottom-1 left-1 w-8 h-0.5 bg-red-500 rounded-sm"></div>
              <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-gray-400 rounded-sm"></div>
            </div>
            
            {/* Title and description */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-white rounded-sm"></div>
              <div className="w-4/5 h-1 bg-gray-400 rounded-sm"></div>
              <div className="w-3/4 h-0.5 bg-gray-400 rounded-sm"></div>
              <div className="w-5/6 h-0.5 bg-gray-400 rounded-sm"></div>
            </div>
            
            {/* Registration form */}
            <div className="bg-gray-700/50 rounded-sm p-1 space-y-0.5">
              <div className="w-2/3 h-1.5 bg-blue-500 rounded-sm"></div>
              <div className="w-full h-1 bg-gray-600 border border-gray-500 rounded-sm"></div>
              <div className="w-full h-1 bg-gray-600 border border-gray-500 rounded-sm"></div>
              <div className="w-8 h-1.5 bg-red-500 rounded-sm"></div>
            </div>
            
            {/* Presenter info */}
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-0.5">
                <div className="w-2/3 h-1 bg-gray-400 rounded-sm"></div>
                <div className="w-1/2 h-0.5 bg-gray-500 rounded-sm"></div>
                <div className="w-3/4 h-0.5 bg-gray-500 rounded-sm"></div>
              </div>
            </div>
            
            {/* What you'll learn */}
            <div className="space-y-0.5">
              <div className="w-1/2 h-1 bg-green-400 rounded-sm"></div>
              <div className="space-y-0.5">
                <div className="w-full h-0.5 bg-gray-500 rounded-sm"></div>
                <div className="w-4/5 h-0.5 bg-gray-500 rounded-sm"></div>
                <div className="w-5/6 h-0.5 bg-gray-500 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'thank-you-page':
      return (
        <div className="w-full h-32 bg-gray-800 rounded border border-gray-600 overflow-hidden">
          <div className="p-1.5 space-y-1 text-center">
            {/* Success icon */}
            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-sm"></div>
            </div>
            
            {/* Thank you message */}
            <div className="w-3/4 h-1.5 bg-green-500 rounded-sm mx-auto"></div>
            <div className="w-full h-0.5 bg-gray-500 rounded-sm"></div>
            <div className="w-5/6 h-0.5 bg-gray-500 rounded-sm mx-auto"></div>
            
            {/* Order/confirmation details */}
            <div className="space-y-0.5 py-1">
              <div className="w-1/2 h-1 bg-blue-400 rounded-sm mx-auto"></div>
              <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm mx-auto"></div>
              <div className="w-2/3 h-0.5 bg-gray-600 rounded-sm mx-auto"></div>
            </div>
            
            {/* Next steps */}
            <div className="space-y-0.5 pt-1">
              <div className="w-2/3 h-1 bg-orange-400 rounded-sm mx-auto"></div>
              <div className="w-4/5 h-0.5 bg-gray-600 rounded-sm mx-auto"></div>
              <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm mx-auto"></div>
              <div className="w-6 h-1 bg-blue-500 rounded-sm mx-auto"></div>
            </div>
          </div>
        </div>
      );

    case 'calendar-page':
      return (
        <div className="w-full h-32 bg-gray-800 rounded border border-gray-600 overflow-hidden">
          <div className="p-1.5 space-y-0.5">
            {/* Header */}
            <div className="w-3/4 h-1 bg-blue-500 rounded-sm"></div>
            <div className="w-full h-0.5 bg-gray-500 rounded-sm"></div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5 py-1">
              <div className="w-full h-1 bg-gray-600 rounded-sm"></div>
              <div className="w-full h-1 bg-blue-500 rounded-sm"></div>
              <div className="w-full h-1 bg-gray-600 rounded-sm"></div>
              <div className="w-full h-1 bg-gray-600 rounded-sm"></div>
              <div className="w-full h-1 bg-gray-600 rounded-sm"></div>
              <div className="w-full h-1 bg-gray-600 rounded-sm"></div>
              <div className="w-full h-1 bg-gray-600 rounded-sm"></div>
            </div>
            
            {/* Time slots */}
            <div className="space-y-0.5">
              <div className="w-1/2 h-0.5 bg-blue-400 rounded-sm"></div>
              <div className="flex gap-1">
                <div className="w-1/3 h-1 bg-blue-400 rounded-sm"></div>
                <div className="w-1/3 h-1 bg-gray-600 rounded-sm"></div>
                <div className="w-1/3 h-1 bg-blue-400 rounded-sm"></div>
              </div>
              <div className="flex gap-1">
                <div className="w-1/3 h-1 bg-gray-600 rounded-sm"></div>
                <div className="w-1/3 h-1 bg-blue-400 rounded-sm"></div>
                <div className="w-1/3 h-1 bg-gray-600 rounded-sm"></div>
              </div>
              <div className="w-6 h-1 bg-blue-500 rounded-sm"></div>
            </div>
            
            {/* Booking info */}
            <div className="space-y-0.5 pt-1">
              <div className="w-3/4 h-0.5 bg-gray-500 rounded-sm"></div>
              <div className="w-2/3 h-0.5 bg-gray-500 rounded-sm"></div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full h-64 bg-gray-800 rounded border border-gray-600 overflow-hidden">
          <div className="p-2 space-y-1">
            {/* Header */}
            <div className="w-full h-2 bg-gray-500 rounded-sm"></div>
            
            {/* Navigation */}
            <div className="flex justify-between items-center">
              <div className="w-6 h-1 bg-gray-400 rounded-sm"></div>
              <div className="flex gap-1">
                <div className="w-2 h-0.5 bg-gray-500 rounded-sm"></div>
                <div className="w-2 h-0.5 bg-gray-500 rounded-sm"></div>
                <div className="w-2 h-0.5 bg-gray-500 rounded-sm"></div>
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-1">
              <div className="w-4/5 h-1 bg-gray-400 rounded-sm"></div>
              <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
              <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
              <div className="w-5/6 h-0.5 bg-gray-600 rounded-sm"></div>
              <div className="w-4/5 h-0.5 bg-gray-600 rounded-sm"></div>
              <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
            </div>
            
            {/* Sections */}
            <div className="space-y-1">
              <div className="w-2/3 h-1.5 bg-gray-500 rounded-sm"></div>
              <div className="flex gap-1">
                <div className="w-1/2 h-4 bg-gray-700 rounded-sm p-0.5">
                  <div className="w-3/4 h-0.5 bg-gray-500 rounded-sm mb-0.5"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm mb-0.5"></div>
                  <div className="w-2/3 h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
                <div className="w-1/2 h-4 bg-gray-700 rounded-sm p-0.5">
                  <div className="w-3/4 h-0.5 bg-gray-500 rounded-sm mb-0.5"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm mb-0.5"></div>
                  <div className="w-2/3 h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                <div className="w-4/5 h-0.5 bg-gray-600 rounded-sm"></div>
                <div className="w-5/6 h-0.5 bg-gray-600 rounded-sm"></div>
                <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
              </div>
            </div>
            
            {/* More content */}
            <div className="space-y-1">
              <div className="w-3/4 h-1.5 bg-gray-500 rounded-sm"></div>
              <div className="flex gap-1">
                <div className="w-1/3 h-3 bg-gray-700 rounded-sm p-0.5">
                  <div className="w-full h-0.5 bg-gray-500 rounded-sm mb-0.5"></div>
                  <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
                <div className="w-1/3 h-3 bg-gray-700 rounded-sm p-0.5">
                  <div className="w-full h-0.5 bg-gray-500 rounded-sm mb-0.5"></div>
                  <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
                <div className="w-1/3 h-3 bg-gray-700 rounded-sm p-0.5">
                  <div className="w-full h-0.5 bg-gray-500 rounded-sm mb-0.5"></div>
                  <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                <div className="w-4/5 h-0.5 bg-gray-600 rounded-sm"></div>
                <div className="w-5/6 h-0.5 bg-gray-600 rounded-sm"></div>
              </div>
            </div>
            
            {/* Footer section */}
            <div className="space-y-0.5">
              <div className="w-1/2 h-1 bg-gray-500 rounded-sm"></div>
              <div className="flex gap-1">
                <div className="w-2/3 space-y-0.5">
                  <div className="w-full h-0.5 bg-gray-600 rounded-sm"></div>
                  <div className="w-3/4 h-0.5 bg-gray-600 rounded-sm"></div>
                </div>
                <div className="w-1/3">
                  <div className="w-full h-2 bg-gray-700 rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Action */}
            <div className="w-10 h-2 bg-gray-500 rounded-sm mt-1"></div>
          </div>
        </div>
      );
  }
};

// Edit Modal Component
const EditNodeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  nodeData: any;
  onSave: (data: any) => void;
}> = ({ isOpen, onClose, nodeData, onSave }) => {
  const [title, setTitle] = React.useState(nodeData.title || '');
  const [description, setDescription] = React.useState(nodeData.description || '');
  const [customImage, setCustomImage] = React.useState(nodeData.customImage || '');
  const [displayAsButton, setDisplayAsButton] = React.useState(nodeData.displayAsButton || false);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isActionType = isActionComponent(nodeData.originalType || '');

  // Debug modal rendering
  React.useEffect(() => {
    console.log('🎭 EditNodeModal render - isOpen:', isOpen, 'nodeData:', nodeData);
  }, [isOpen, nodeData]);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleSave = () => {
    onSave({
      ...nodeData,
      title,
      description,
      customImage,
      displayAsButton: isActionType ? displayAsButton : false
    });
    onClose();
  };

  const removeImage = () => {
    setCustomImage('');
  };

  console.log('🎭 Modal rendering with isOpen:', isOpen);

  if (!isOpen) {
    console.log('🎭 Modal not open, returning null');
    return null;
  }

  console.log('🎭 Modal is open, rendering full modal');

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center" 
      style={{ zIndex: 999999 }}
      onClick={(e) => {
        // Close modal if clicking on overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-gray-900 rounded-lg p-6 w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Editar Componente</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors hover:bg-gray-800 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Nome do componente"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-20 resize-none"
              placeholder="Descrição do componente"
            />
          </div>

          {/* Display as Button Option - Only for Action Components */}
          {isActionType && (
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayAsButton}
                  onChange={(e) => setDisplayAsButton(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <span className="text-sm font-medium text-gray-300">
                    🔲 Exibir como Botão
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Transforma o componente em um botão simples no canvas
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Image Upload - Only show if not displaying as button */}
          {!displayAsButton && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagem Personalizada (Opcional)
              </label>
              
              {customImage ? (
                <div className="relative">
                  <img
                    src={customImage}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border border-gray-600"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`
                    w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors overflow-hidden
                    ${dragActive 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                    }
                  `}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="mb-2">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-300 font-medium">
                        Clique ou arraste uma imagem
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF até 5MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

// Add render counter at the top of the file
let customNodeRenderCount = 0;

export const CustomNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  
  // IMMEDIATE DEBUG - Track all render attempts with enhanced visibility
  customNodeRenderCount++;
  console.log('🏗️ ===== CUSTOM NODE RENDER =====');
  console.log('🏗️ Render Count:', customNodeRenderCount);
  console.log('🏗️ Node ID:', id);
  console.log('🏗️ Original Type:', data.originalType);
  console.log('🏗️ Title:', data.title);
  console.log('🏗️ Selected:', selected);
  console.log('🏗️ Custom Image:', data.customImage ? 'Yes' : 'No');
  console.log('🏗️ Handles should be rendered: 4 (top, right, bottom, left)');
  console.log('🏗️ ===============================');
  
  const template = getTemplateInfo(data.originalType || 'default');
  const reactFlowInstance = useReactFlow();
  
  // Enhanced debug logging
  React.useEffect(() => {
    console.log('🎨 CustomNode rendering:', {
      id,
      type: data.originalType,
      title: data.title,
      position: { x: 'calculated by ReactFlow', y: 'calculated by ReactFlow' },
      template: template.label,
      selected,
      customImage: !!data.customImage
    });
  }, [id, data.originalType, data.title, template.label, selected, data.customImage]);
  
  // Debug logging
  React.useEffect(() => {
    if (selected) {
      console.log('✅ Component selected:', id, data.title || template.label);
    }
  }, [selected, id, data.title, template.label]);
  
  // Get status info
  const getStatusInfo = () => {
    const status = data.status;
    switch (status) {
      case 'active':
        return { color: '#10B981', icon: Play, text: 'Active' };
      case 'inactive':
        return { color: '#F59E0B', icon: Pause, text: 'Inactive' };
      case 'draft':
        return { color: '#6B7280', icon: Settings, text: 'Draft' };
      case 'test':
        return { color: '#8B5CF6', icon: Zap, text: 'Test' };
      case 'published':
        return { color: '#10B981', icon: Play, text: 'Published' };
      default:
        return { color: '#8B5CF6', icon: Zap, text: 'Ready' };
    }
  };

  // Handle click to connect
  const handleNodeClick = () => {
    console.log('🎯 Node clicked for connection:', id);
    
    // Get connection state from global store or context if available
    const connectionState = (window as any).__connectionState || {};
    
    if (connectionState.isConnecting && connectionState.sourceNodeId) {
      // We're in connection mode and have a source, create connection
      if (connectionState.sourceNodeId !== id) {
        console.log('✨ Creating connection from', connectionState.sourceNodeId, 'to', id);
        
        // Create connection using AnimatedNodeEdge
        const newEdge = {
          id: `edge-${Date.now()}`,
          source: connectionState.sourceNodeId,
          target: id,
          type: 'animatedNode',
          data: { 
            node: `lead-${Date.now()}`,
            label: 'Lead' 
          },
          animated: true,
          style: { 
            stroke: '#10B981', 
            strokeWidth: 2 
          },
        };
        
        // Add edge to the flow
        const edges = reactFlowInstance.getEdges();
        reactFlowInstance.setEdges([...edges, newEdge]);
        
        console.log('✅ Created animated connection:', newEdge);
        
        // Clear connection state
        (window as any).__connectionState = { isConnecting: false, sourceNodeId: null };
        
        // Notify parent component if callback exists
        if ((window as any).__onConnectionAdd) {
          (window as any).__onConnectionAdd({
            id: newEdge.id,
            from: newEdge.source,
            to: newEdge.target,
            type: 'lead',
            color: '#10B981',
            animated: true,
          });
        }
      } else {
        console.log('❌ Cannot connect to same node');
      }
    } else {
      // Start connection mode
      (window as any).__connectionState = { isConnecting: true, sourceNodeId: id };
      console.log('🎯 Starting connection from:', id);
    }
  };

  // Handle action buttons
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('✏️ Edit button clicked for component:', id);
    console.log('✏️ Current modal state:', isEditModalOpen);
    console.log('✏️ Setting modal to true...');
    setIsEditModalOpen(true);
    console.log('✏️ Modal should now be open');
  };

  // Add mouse down handler to prevent drag
  const handleEditMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('🖱️ Edit button mouse down');
  };

  // Debug the modal state
  React.useEffect(() => {
    console.log('🔄 Modal state changed:', { id, isEditModalOpen });
  }, [isEditModalOpen, id]);

  const handleSaveEdit = (newData: any) => {
    console.log('💾 Saving node data:', newData);
    
    // Update node data in ReactFlow
    const nodes = reactFlowInstance.getNodes();
    const updatedNodes = nodes.map(node => {
      if (node.id === id) {
        return {
          ...node,
          data: newData
        };
      }
      return node;
    });
    
    reactFlowInstance.setNodes(updatedNodes);

    // Also update the component in the parent state if callback is available
    if ((window as any).__onComponentUpdate) {
      (window as any).__onComponentUpdate(id, {
        data: {
          title: newData.title,
          description: newData.description,
          image: newData.customImage,
          customImage: newData.customImage,
          displayAsButton: newData.displayAsButton,
          status: newData.status || data.status,
          properties: newData.properties || data.properties
        }
      });
      console.log('💾 Component updated in parent state');
    }

    setIsEditModalOpen(false);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('📋 Duplicate component:', id);
    alert('Função de duplicação será implementada em breve!');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🗑️ Delete component:', id);
    if (confirm('Tem certeza que deseja excluir este componente?')) {
      // Call parent delete function if available
      if ((window as any).__onComponentDelete) {
        (window as any).__onComponentDelete(id);
      } else {
        alert('Função de exclusão será implementada em breve!');
      }
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  
  // Check if this node is the source of an active connection
  const connectionState = (window as any).__connectionState || {};
  const isConnectionSource = connectionState.isConnecting && connectionState.sourceNodeId === id;
  const isInConnectionMode = connectionState.isConnecting;

  // Set up global callbacks for component updates
  React.useEffect(() => {
    (window as any).__onComponentUpdate = (componentId: string, updates: any) => {
      console.log('🔄 Global component update callback:', componentId, updates);
      // This will be overridden by ReactFlowCanvas if available
    };
    
    return () => {
      delete (window as any).__onComponentUpdate;
    };
  }, []);

  return (
    <>
      <div className="group relative">
        {/* Selection indicator */}
        {selected && (
          <div className="absolute -top-3 -left-3 -right-3 -bottom-3 border-2 border-blue-500 rounded-xl bg-blue-500/5 animate-pulse z-10"></div>
        )}

        {/* Connection indicator */}
        {isConnectionSource && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm z-30 animate-pulse shadow-lg">
            <div className="text-center">
              <div className="font-semibold">🔗 Modo Conexão</div>
              <div className="text-xs mt-1">Clique em outro componente</div>
            </div>
          </div>
        )}
        
        {/* Connection mode overlay */}
        {isInConnectionMode && !isConnectionSource && (
          <div className="absolute inset-0 border-2 border-dashed border-green-500 rounded-lg bg-green-500/10 animate-pulse cursor-pointer z-20 flex items-center justify-center"
               onClick={handleNodeClick}
          >
            <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
              🎯 Clique aqui para conectar
            </div>
          </div>
        )}

        {/* Card Simplificado */}
        <div
          className={`
            relative w-64 bg-gray-900 rounded-lg shadow-lg border-2 overflow-hidden 
            transition-all duration-200 ease-out hover:shadow-xl
            ${selected ? 'border-blue-500 shadow-blue-500/30 ring-2 ring-blue-500/20' : 'border-gray-700 hover:border-gray-600'}
            ${isConnectionSource ? 'border-blue-500 shadow-blue-500/50 ring-2 ring-blue-500/30' : ''}
            ${isInConnectionMode && !isConnectionSource ? 'hover:border-green-500 hover:shadow-green-500/30' : ''}
          `}
        >
          {/* Enhanced Handles with better positioning and tooltips */}
          
          {/* Top handles */}
          <Handle
            id="top-target"
            type="target"
            position={Position.Top}
            className="w-5 h-5 !bg-blue-500 !border-3 !border-blue-300 hover:!bg-blue-400 hover:!border-blue-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
            style={{ 
              top: -12, 
              left: '30%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: '#3B82F6 !important',
              border: '3px solid #60A5FA !important',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.8) !important'
            }}
            title="🔵 INPUT - Arraste de outro componente para cá"
          />
          
          <Handle
            id="top-source"
            type="source"
            position={Position.Top}
            className="w-5 h-5 !bg-green-500 !border-3 !border-green-300 hover:!bg-green-400 hover:!border-green-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
            style={{ 
              top: -12, 
              left: '70%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: '#10B981 !important',
              border: '3px solid #34D399 !important',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.8) !important'
            }}
            title="🟢 OUTPUT - Arraste daqui para outro componente"
          />
          
          {/* Right handles */}
          <Handle
            id="right-target"
            type="target"
            position={Position.Right}
            className="w-5 h-5 !bg-blue-500 !border-3 !border-blue-300 hover:!bg-blue-400 hover:!border-blue-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
            style={{ 
              right: -12, 
              top: '30%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              background: '#3B82F6 !important',
              border: '3px solid #60A5FA !important',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.8) !important'
            }}
            title="🔵 INPUT - Arraste de outro componente para cá"
          />
          
          <Handle
            id="right-source"
            type="source"
            position={Position.Right}
            className="w-5 h-5 !bg-green-500 !border-3 !border-green-300 hover:!bg-green-400 hover:!border-green-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
            style={{ 
              right: -12, 
              top: '70%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              background: '#10B981 !important',
              border: '3px solid #34D399 !important',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.8) !important'
            }}
            title="🟢 OUTPUT - Arraste daqui para outro componente"
          />
          
          {/* Bottom handles */}
          <Handle
            id="bottom-target"
            type="target"
            position={Position.Bottom}
            className="w-5 h-5 !bg-blue-500 !border-3 !border-blue-300 hover:!bg-blue-400 hover:!border-blue-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
            style={{ 
              bottom: -12, 
              left: '30%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: '#3B82F6 !important',
              border: '3px solid #60A5FA !important',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.8) !important'
            }}
            title="🔵 INPUT - Arraste de outro componente para cá"
          />
          
          <Handle
            id="bottom-source"
            type="source"
            position={Position.Bottom}
            className="w-5 h-5 !bg-green-500 !border-3 !border-green-300 hover:!bg-green-400 hover:!border-green-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
            style={{ 
              bottom: -12, 
              left: '70%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: '#10B981 !important',
              border: '3px solid #34D399 !important',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.8) !important'
            }}
            title="🟢 OUTPUT - Arraste daqui para outro componente"
          />
          
          {/* Left handles */}
          <Handle
            id="left-target"
            type="target"
            position={Position.Left}
            className="w-5 h-5 !bg-blue-500 !border-3 !border-blue-300 hover:!bg-blue-400 hover:!border-blue-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
            style={{ 
              left: -12, 
              top: '30%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              background: '#3B82F6 !important',
              border: '3px solid #60A5FA !important',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.8) !important'
            }}
            title="🔵 INPUT - Arraste de outro componente para cá"
          />
          
          <Handle
            id="left-source"
            type="source"
            position={Position.Left}
            className="w-5 h-5 !bg-green-500 !border-3 !border-green-300 hover:!bg-green-400 hover:!border-green-200 !opacity-100 hover:!opacity-100 transition-all duration-200 hover:!scale-150 !cursor-crosshair !shadow-lg"
            style={{ 
              left: -12, 
              top: '70%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              background: '#10B981 !important',
              border: '3px solid #34D399 !important',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.8) !important'
            }}
            title="🟢 OUTPUT - Arraste daqui para outro componente"
          />

          {/* Header Colorido */}
          <div 
            className="h-1 w-full"
            style={{ backgroundColor: template.color }}
          />

          {/* Conteúdo Principal */}
          <div className="p-4">
            {/* Título da Página */}
            <div className="mb-3">
              <h3 className="font-semibold text-white text-center text-sm leading-tight">
                {data.title || template.label}
              </h3>
            </div>

            {/* Preview Mockup da Página */}
            <div className="mb-3">
              <ComponentPreviewMockup 
                type={data.originalType || 'default'} 
                customImage={data.customImage}
                displayAsButton={data.displayAsButton}
                title={data.title}
              />
            </div>

            {/* Status indicator - discreto */}
            <div className="flex justify-center mb-2">
              <div className="flex items-center gap-1">
                <StatusIcon className="w-3 h-3" style={{ color: statusInfo.color }} />
                <span className="text-xs" style={{ color: statusInfo.color }}>
                  {statusInfo.text}
                </span>
                
                {/* Connection mode indicator */}
                {isInConnectionMode && (
                  <span className="text-xs text-blue-400 animate-pulse ml-2">
                    {isConnectionSource ? '📡 Conectando...' : '🎯 Clique'}
                  </span>
                )}
                
                {/* Selection indicator */}
                {selected && !isInConnectionMode && (
                  <span className="text-xs text-green-400 flex items-center gap-1 ml-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    Selecionado
                  </span>
                )}
              </div>
            </div>

            {/* AÇÕES CONDICIONAIS - mostrar apenas quando selecionado e modal fechado */}
            {selected && !isEditModalOpen && (
              <div 
                className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2 border border-gray-700 transition-all duration-300 animate-in slide-in-from-bottom"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log('🎮 Action container mouse down - PREVENTED');
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  console.log('🎮 Action container mouse up');
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('🎮 Action container clicked');
                }}
                onDragStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🎮 Drag prevented on action container');
                  return false;
                }}
                draggable={false}
                style={{ 
                  zIndex: 10000,
                  pointerEvents: 'auto',
                  position: 'relative'
                }}
              >
                <div className="flex items-center gap-1">
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log('🖱️ Edit button mouse down - PREVENTED');
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      console.log('🖱️ Edit button mouse up');
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log('✏️ Edit button clicked for component:', id);
                      console.log('✏️ Current modal state:', isEditModalOpen);
                      console.log('✏️ Setting modal to true...');
                      setIsEditModalOpen(true);
                      console.log('✏️ Modal should now be open');
                    }}
                    onDragStart={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    draggable={false}
                    className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-all duration-200 flex items-center justify-center bg-blue-600/30 border-2 border-blue-500 cursor-pointer"
                    title="Editar componente"
                    style={{ 
                      zIndex: 10001,
                      pointerEvents: 'auto',
                      position: 'relative'
                    }}
                  >
                    <Edit2 className="w-5 h-5 text-blue-400" />
                    <span className="ml-1 text-xs text-blue-400 font-bold">EDIT</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('🔗 Connect button clicked');
                      handleNodeClick();
                    }}
                    onDragStart={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    draggable={false}
                    className={`p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-md transition-all duration-200 flex items-center justify-center ${
                      isConnectionSource ? 'bg-blue-600 text-white' : ''
                    }`}
                    title="Conectar com outro componente"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('📋 Duplicate button clicked');
                      handleDuplicate(e);
                    }}
                    onDragStart={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    draggable={false}
                    className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-md transition-all duration-200 flex items-center justify-center"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🗑️ Delete button clicked');
                    handleDelete(e);
                  }}
                  onDragStart={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  draggable={false}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-md transition-all duration-200 flex items-center justify-center"
                  title="Excluir componente"
                  style={{ pointerEvents: 'auto' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal - Real modal for editing */}
      <EditNodeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        nodeData={data}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default CustomNode; 