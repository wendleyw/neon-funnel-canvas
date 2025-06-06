import React from 'react';
import { X, User, Settings, LogOut, Crown, HelpCircle, FileText } from 'lucide-react';
import { CreateMenuContent } from './CreateMenuContent';
import { LibraryMenuContent } from './LibraryMenuContent';
import { ComponentTemplate } from '../../../types/funnel';
import { FunnelComponent, Connection } from '../../../types/funnel';
import { DrawingShape } from '../../../types/drawing';
import { ProfileMenuContent } from './ProfileMenuContent';

interface ExpandableMenuPanelProps {
  activeItem: 'create' | 'library' | 'explore' | 'custom' | 'notifications' | 'profile' | 'feedback' | 'admin';
  onClose: () => void;
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
  componentCount?: number;
  connectionCount?: number;
  onOpenAdmin?: () => void;
}

export const ExpandableMenuPanel: React.FC<ExpandableMenuPanelProps> = ({
  activeItem,
  onClose,
  onDragStart,
  onAddCompleteTemplate,
  onShapeAdd,
  onTemplateClick,
  componentCount = 0,
  connectionCount = 0,
  onOpenAdmin
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
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-pink-500/20">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Custom AI Funnel</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Create intelligent, automated funnels with AI-powered optimization and personalization
            </p>
            <button className="bg-gradient-to-r from-pink-600 to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-pink-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto">
              <span>🔮</span>
              Upgrade to Premium
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
      
      case 'feedback':
        return (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <span className="text-yellow-400 text-lg">💬</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Feedback</h3>
                <p className="text-xs text-gray-400">Help us improve Funnelboard</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  How can we improve?
                </label>
                <textarea
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors resize-none"
                  rows={4}
                  placeholder="Share your thoughts, suggestions, or report any issues..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Category
                </label>
                <select className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors">
                  <option value="">Select category</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="improvement">Improvement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Send Feedback
              </button>
            </div>
          </div>
        );
      
      case 'admin':
        return (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <span className="text-red-400 text-lg">⚡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Admin Panel</h3>
                <p className="text-xs text-gray-400">System administration tools</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Total Users:</span>
                    <span className="text-white ml-2">1,234</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Active Funnels:</span>
                    <span className="text-white ml-2">567</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Content Items:</span>
                    <span className="text-white ml-2">89</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Feedbacks:</span>
                    <span className="text-white ml-2">23</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => window.open('/admin', '_blank')}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Open Full Admin Dashboard
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-blue-600/20 text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-600/30 transition-colors">
                  Manage Content
                </button>
                <button className="bg-green-600/20 text-green-400 px-3 py-2 rounded-lg text-sm hover:bg-green-600/30 transition-colors">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        );
      
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
      case 'feedback': return 'Feedback';
      case 'admin': return 'Admin';
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