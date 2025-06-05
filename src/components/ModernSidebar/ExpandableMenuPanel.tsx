import React from 'react';
import { X, User, Settings, LogOut, Crown, HelpCircle, FileText } from 'lucide-react';
import { CreateMenuContent } from './CreateMenuContent';
import { LibraryMenuContent } from './LibraryMenuContent';
import { ComponentTemplate } from '../../types/funnel';
import { FunnelComponent, Connection } from '../../types/funnel';
import { DrawingShape } from '../../types/drawing';
import { ProfileMenuContent } from '../ModernSidebar/ProfileMenuContent';

interface ExpandableMenuPanelProps {
  activeItem: 'create' | 'library' | 'explore' | 'custom' | 'notifications' | 'profile';
  onClose: () => void;
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
  componentCount?: number;
  connectionCount?: number;
}

export const ExpandableMenuPanel: React.FC<ExpandableMenuPanelProps> = ({
  activeItem,
  onClose,
  onDragStart,
  onAddCompleteTemplate,
  onShapeAdd,
  onTemplateClick,
  componentCount = 0,
  connectionCount = 0
}) => {
  const renderContent = () => {
    switch (activeItem) {
      case 'create':
        return (
          <CreateMenuContent
            onDragStart={onDragStart}
            onShapeAdd={onShapeAdd}
            onTemplateClick={onTemplateClick}
          />
        );
      
      case 'library':
        return (
          <LibraryMenuContent
            onAddCompleteTemplate={onAddCompleteTemplate}
          />
        );
      
      case 'explore':
        return (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Explore Community</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Discover templates created by the community and connect with other funnel builders
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Coming Soon
            </button>
          </div>
        );
      
      case 'custom':
        return (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Custom Funnel AI</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Create custom funnels with AI assistance. Design, optimize, and deploy intelligent conversion flows.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Try Premium Feature
            </button>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <span className="text-red-400 text-lg">🔔</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <p className="text-xs text-gray-400">3 new updates</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-900/50 border border-gray-800/50 p-4 rounded-xl hover:bg-gray-900/70 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">New template available</p>
                    <p className="text-gray-400 text-xs mt-1">Instagram Grid component with advanced features</p>
                    <p className="text-gray-500 text-xs mt-2">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800/50 p-4 rounded-xl hover:bg-gray-900/70 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium group-hover:text-green-400 transition-colors">System update completed</p>
                    <p className="text-gray-400 text-xs mt-1">Performance improvements and bug fixes</p>
                    <p className="text-gray-500 text-xs mt-2">1 day ago</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800/50 p-4 rounded-xl hover:bg-gray-900/70 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium group-hover:text-purple-400 transition-colors">Welcome to Funnelboard!</p>
                    <p className="text-gray-400 text-xs mt-1">Get started with our quick tutorial</p>
                    <p className="text-gray-500 text-xs mt-2">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return <ProfileMenuContent />;
      
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (activeItem) {
      case 'create': return 'Create';
      case 'library': return 'Library';
      case 'explore': return 'Explore';
      case 'custom': return 'Custom AI';
      case 'notifications': return 'Notifications';
      case 'profile': return 'Profile';
      default: return '';
    }
  };

  return (
    <div className="relative h-full">
      {/* Elegant Curved Connection to Top */}
      <div className="absolute -top-10 left-0 w-full h-10 pointer-events-none z-10">
        {/* Main connection base */}
        <div className="w-full h-10 bg-black"></div>
        
        {/* Curved connector SVG */}
        <svg 
          className="absolute top-0 right-0 h-10 pointer-events-none"
          width="120" 
          height="40"
          viewBox="0 0 120 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient definition for smooth transition */}
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="70%" stopColor="#000000" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          
          {/* Smooth curved path */}
          <path
            d="M 0 40 Q 30 40 60 20 Q 90 0 120 0 L 120 40 L 0 40 Z"
            fill="url(#connectionGradient)"
            className="drop-shadow-sm"
          />
          
          {/* Optional subtle border for definition */}
          <path
            d="M 0 40 Q 30 40 60 20 Q 90 0 120 0"
            fill="none"
            stroke="#374151"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Main Panel */}
      <div className="w-80 h-full bg-black border-r border-gray-800 flex flex-col relative">
        {/* Header - Simplified and Smaller */}
        <div className="h-10 flex items-center justify-between px-4 border-b border-gray-800 bg-black">
          <h2 className="text-lg font-semibold text-white">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-200 group hover:scale-105"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-black">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}; 