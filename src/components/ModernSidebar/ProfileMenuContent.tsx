import React from 'react';
import { User, Settings, LogOut, Crown, HelpCircle, FileText, Shield, Globe } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';
import { useAdmin } from '../../contexts/AdminContext';

interface ProfileAction {
  icon: any;
  label: string;
  description: string;
  isPremium?: boolean;
  isAdmin?: boolean;
}

export const ProfileMenuContent: React.FC = () => {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const { isAdmin } = useAdmin();
  console.log('ProfileMenuContent: isAdmin value:', isAdmin);

  const profileActions: ProfileAction[] = [
    { icon: User, label: t('auth.profile'), description: 'Update your information' },
    { icon: Settings, label: t('common.settings'), description: 'App preferences' },
    { icon: Crown, label: 'Upgrade to Pro', description: 'Unlock premium features', isPremium: true },
    { icon: FileText, label: 'My Projects', description: 'View all projects' },
    { icon: HelpCircle, label: t('common.help'), description: 'Get assistance' },
  ];

  // Add admin action if user is admin
  if (isAdmin) {
    profileActions.splice(2, 0, {
      icon: Shield,
      label: t('admin.title'),
      description: 'Manage sources, pages, and actions',
      isAdmin: true
    });
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
  };

  const openAdminPanel = () => {
    // Open admin panel in new tab or navigate to it
    window.open('/admin', '_blank');
  };

  return (
    <div className="p-4">
      {/* User Info */}
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-xl font-bold">W</span>
        </div>
        <h3 className="text-lg font-semibold text-white">Wendley Wilson</h3>
        <p className="text-sm text-gray-400">
          {isAdmin ? 'Admin Plan' : 'Free Plan'}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="mb-6 p-3 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Projects Used</span>
          <span className="text-xs text-white">3/10</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-xs text-gray-400 mb-2">Language</label>
        <div className="flex gap-2">
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`flex items-center gap-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                language === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Globe className="w-3 h-3" />
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {profileActions.map((action) => (
          <button
            key={action.label}
            onClick={action.isAdmin ? openAdminPanel : undefined}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-gray-700 ${
              action.isPremium 
                ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30' 
                : action.isAdmin
                ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30'
                : 'bg-gray-800'
            }`}
          >
            <div className={`w-8 h-8 rounded flex items-center justify-center ${
              action.isPremium 
                ? 'text-purple-400' 
                : action.isAdmin
                ? 'text-blue-400'
                : 'text-gray-400'
            }`}>
              <action.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-sm ${
                action.isPremium 
                  ? 'text-purple-200' 
                  : action.isAdmin
                  ? 'text-blue-200'
                  : 'text-white'
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
            {action.isAdmin && (
              <Shield className="w-4 h-4 text-blue-400" />
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
            {t('auth.logout')}
          </h4>
          <p className="text-xs text-red-400/70">
            End your session
          </p>
        </div>
      </button>
    </div>
  );
}; 