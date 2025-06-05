import React from 'react';
import { Bell } from 'lucide-react';

export const NotificationsContent: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full p-4">
      <div className="text-center py-8">
        <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-white text-lg font-medium mb-2">Notifications</h3>
        <p className="text-gray-400 text-sm mb-4">
          Stay updated with the latest news
        </p>
        <div className="space-y-2 max-w-sm mx-auto">
          <div className="bg-gray-800 p-3 rounded-lg text-left">
            <p className="text-white text-sm font-medium">New template available</p>
            <p className="text-gray-400 text-xs">2 hours ago</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg text-left">
            <p className="text-white text-sm font-medium">System update</p>
            <p className="text-gray-400 text-xs">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 