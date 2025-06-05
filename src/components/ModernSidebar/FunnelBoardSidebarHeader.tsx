import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

interface FunnelBoardSidebarHeaderProps {
  greeting: string;
  // userName and userInitial will be derived from useAuth
  onProfileOpen: () => void;
}

export const FunnelBoardSidebarHeader: React.FC<FunnelBoardSidebarHeaderProps> = ({
  greeting,
  onProfileOpen
}) => {
  const { user } = useAuth(); // Get user from AuthContext

  // Derive userName and userInitial from user.user_metadata
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = (user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase();

  return (
    <div className="p-6 border-b border-gray-800 flex-shrink-0 relative z-10">
      {/* Larger Centered Logo */}
      <div className="text-center mb-4">
        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
          <span className="text-white text-3xl font-bold">FB</span>
        </div>
        <h1 className="text-white text-2xl font-bold tracking-wider">Funnel Board</h1>
      </div>
      
      <button 
        onClick={onProfileOpen}
        className="flex items-center gap-3 text-left w-full hover:bg-gray-900/50 p-2 rounded-lg transition-colors group"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{userInitial}</span>
        </div>
        <div className="flex-1">
          <span className="text-gray-300 text-sm font-medium block">{greeting}, {userName}!</span>
          <span className="text-gray-500 text-xs">View profile and settings</span>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>
    </div>
  );
}; 