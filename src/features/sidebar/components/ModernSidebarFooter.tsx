import React from 'react';

export const ModernSidebarFooter: React.FC = () => {
  return (
    <div className="p-4 border-t border-gray-800 space-y-2 flex-shrink-0 relative z-10">
      {/* Feedback connector dot */}
      <div className="absolute left-1/2 top-0 w-3 h-3 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-orange-500/50"></div>
      
      <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors hover:bg-gray-900/30 rounded-lg">
        <span className="text-sm">Invite friends</span>
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors hover:bg-gray-900/30 rounded-lg">
        <span className="text-sm">What's new?</span>
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">2</span>
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors hover:bg-gray-900/30 rounded-lg">
        <span className="text-sm">Send feedback</span>
        <span className="ml-auto">💬</span>
      </button>
    </div>
  );
}; 