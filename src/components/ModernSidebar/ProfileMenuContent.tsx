import React from 'react';
import { User, Settings, LogOut, Crown, HelpCircle, FileText } from 'lucide-react';

export const ProfileMenuContent: React.FC = () => {
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