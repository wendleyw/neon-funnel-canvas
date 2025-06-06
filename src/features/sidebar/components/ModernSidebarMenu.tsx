import React from 'react';
import { Layers, Library, Compass, Sparkles, Bell, Crown } from 'lucide-react';
import type { SidebarMenuItem } from '../hooks/useModernSidebar';

// Define a more specific type for menu items if possible, including the icon type
export interface MenuItem {
  id: SidebarMenuItem;
  label: string;
  icon: React.ElementType;
  // Add any other properties specific to menu items, e.g., if some are special like 'custom'
  isCustom?: boolean; 
}

interface ModernSidebarMenuProps {
  menuItems: MenuItem[];
  activeItem: SidebarMenuItem;
  onMenuItemClick: (itemId: SidebarMenuItem) => void;
}

export const ModernSidebarMenu: React.FC<ModernSidebarMenuProps> = ({
  menuItems,
  activeItem,
  onMenuItemClick
}) => {
  return (
    <div className="px-4 py-6 flex-shrink-0 relative z-10">
      <nav className="space-y-3">
        {menuItems.map((item) => (
          <div key={item.id} className="relative flex items-center">
            {/* Connector dot */}
            <div className={`absolute left-1/2 w-3 h-3 rounded-full transform -translate-x-1/2 transition-all duration-300 ${
              activeItem === item.id 
                ? 'bg-blue-500 shadow-lg shadow-blue-500/50 glow-effect' 
                : 'bg-gray-600'
            } z-20`}></div>
            
            <button
              onClick={() => onMenuItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-300 relative ml-6 sidebar-menu-item ${
                activeItem === item.id ? 'active' : ''
              } ${
                activeItem === item.id
                  ? 'text-white bg-blue-600/20 border border-blue-500/50 rounded-full'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-900/50 rounded-lg'
              } ${item.isCustom ? 'border border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-pink-900/20' : ''}`}
            >
              <item.icon className={`w-5 h-5 ${
                item.isCustom ? 'text-purple-400' : 
                activeItem === item.id ? 'text-blue-400' : ''
              }`} />
              <span className={`font-medium ${
                item.isCustom ? 'text-purple-200' : ''
              }`}>
                {item.label}
              </span>
              {item.isCustom && (
                <div className="ml-auto">
                  <Crown className="w-4 h-4 text-yellow-400" />
                </div>
              )}
            </button>
          </div>
        ))}
      </nav>
    </div>
  );
}; 