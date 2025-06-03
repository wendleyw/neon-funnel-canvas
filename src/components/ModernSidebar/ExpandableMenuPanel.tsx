import React from 'react';
import { X, User, Settings, LogOut, Crown, HelpCircle, FileText } from 'lucide-react';
import { CreateMenuContent } from './CreateMenuContent';
import { LibraryMenuContent } from './LibraryMenuContent';
import { ComponentTemplate } from '../../types/funnel';
import { FunnelComponent, Connection } from '../../types/funnel';
import { DrawingShape } from '../../types/drawing';

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

// Simple Profile Content Component
const ProfileContent: React.FC = () => {
  const profileActions = [
    { icon: User, label: 'Edit Profile', description: 'Update your information' },
    { icon: Settings, label: 'Settings', description: 'App preferences' },
    { icon: Crown, label: 'Upgrade to Pro', description: 'Unlock premium features', isPremium: true },
    { icon: FileText, label: 'My Projects', description: 'View all projects' },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get assistance' },
  ];

  return (
    <div className="p-4">
      {/* User Info */}
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-xl font-bold">W</span>
        </div>
        <h3 className="text-lg font-semibold text-white">Wendley Wilson</h3>
        <p className="text-sm text-gray-400">Free Plan</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="mb-6 bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-white mb-3">Usage This Month</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Projects</span>
              <span className="text-white">3/5</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-3/5"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Components</span>
              <span className="text-white">42/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-2/5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="space-y-2 mb-6">
        {profileActions.map((action) => (
          <button
            key={action.label}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-gray-700 ${
              action.isPremium ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30' : 'bg-gray-800'
            }`}
          >
            <div className={`w-8 h-8 rounded flex items-center justify-center ${
              action.isPremium ? 'text-purple-400' : 'text-gray-400'
            }`}>
              <action.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-sm ${
                action.isPremium ? 'text-purple-200' : 'text-white'
              }`}>
                {action.label}
              </h4>
              <p className="text-xs text-gray-400">
                {action.description}
              </p>
            </div>
            {action.isPremium && (
              <Crown className="w-4 h-4 text-yellow-400" />
            )}
          </button>
        ))}
      </div>

      {/* Logout */}
      <button className="w-full flex items-center gap-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-left transition-colors hover:bg-red-900/30">
        <div className="w-8 h-8 rounded flex items-center justify-center text-red-400">
          <LogOut className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-red-200 text-sm">
            Sign Out
          </h4>
          <p className="text-xs text-red-400/70">
            End your session
          </p>
        </div>
      </button>
    </div>
  );
};

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
                    <p className="text-white text-sm font-medium group-hover:text-purple-400 transition-colors">Project saved successfully</p>
                    <p className="text-gray-400 text-xs mt-1">All changes synchronized to cloud</p>
                    <p className="text-gray-500 text-xs mt-2">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return <ProfileContent />;
      
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (activeItem) {
      case 'create': return 'Create';
      case 'library': return 'Library';
      case 'explore': return 'Explore';
      case 'custom': return 'Custom Funnel';
      case 'notifications': return 'Notifications';
      case 'profile': return 'Profile';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 flex-shrink-0">
        <h2 className="text-white font-semibold text-lg">{getTitle()}</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/70 rounded-xl transition-all duration-200 hover:scale-105"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content - Takes remaining space */}
      <div className="flex-1 min-h-0">
        {renderContent()}
      </div>
    </div>
  );
}; 