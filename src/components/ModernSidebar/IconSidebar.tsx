import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { ExpandableMenuPanel } from './ExpandableMenuPanel';
import { ComponentTemplate } from '../../types/funnel';
import { FunnelComponent, Connection } from '../../types/funnel';
import { DrawingShape } from '../../types/drawing';
import { useIsMobile } from '../../hooks/use-mobile';
import { 
  Layers, 
  Library, 
  Search, 
  Compass, 
  Bell, 
  Sparkles, 
  Crown, 
  User,
  Settings,
  Plus
} from 'lucide-react';

interface IconSidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
  componentCount?: number;
  connectionCount?: number;
  onPanelStateChange?: (isExpanded: boolean) => void;
}

type MenuItemId = 'create' | 'library' | 'explore' | 'custom' | 'notifications' | 'profile';

interface MenuItem {
  icon: any;
  label: string;
  id: MenuItemId;
  isPremium?: boolean;
  hasNotification?: boolean;
}

const menuItems: MenuItem[] = [
  { icon: Plus, label: 'Create', id: 'create' },
  { icon: Library, label: 'Library', id: 'library' },
  { icon: Compass, label: 'Explore', id: 'explore' },
  { icon: Sparkles, label: 'Create Custom Funnel', id: 'custom', isPremium: true },
  { icon: Bell, label: 'Notifications', id: 'notifications', hasNotification: true },
];

const bottomItems: MenuItem[] = [
  { icon: User, label: 'Profile', id: 'profile' },
];

export const IconSidebar: React.FC<IconSidebarProps> = ({
  onDragStart,
  onAddCompleteTemplate,
  onShapeAdd,
  onTemplateClick,
  componentCount = 0,
  connectionCount = 0,
  onPanelStateChange
}) => {
  const [activeItem, setActiveItem] = useState<MenuItemId | null>('create');
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useIsMobile();

  // Notify parent when panel state changes
  useEffect(() => {
    if (onPanelStateChange) {
      onPanelStateChange(isExpanded && activeItem !== null);
    }
  }, [isExpanded, activeItem, onPanelStateChange]);

  // Auto-expand on desktop, but start collapsed on mobile
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(true); // Always expanded on mobile when sidebar is open
    }
  }, [isMobile]);

  const handleItemClick = (itemId: MenuItemId) => {
    if (isMobile) {
      // On mobile, always show the panel when clicking an item
      setActiveItem(itemId);
      setIsExpanded(true);
    } else {
      // Desktop behavior
      if (activeItem === itemId && isExpanded) {
        // Clicking the same item when expanded collapses it
        setIsExpanded(false);
        setActiveItem(null);
      } else {
        // Clicking a different item or when collapsed
        setActiveItem(itemId);
        setIsExpanded(true);
      }
    }
  };

  const handlePanelClose = () => {
    if (isMobile) {
      // On mobile, closing panel should be handled by parent (FunnelEditor)
      return;
    }
    setIsExpanded(false);
    setActiveItem(null);
  };

  return (
    <ErrorBoundary>
      <div className="flex h-full">
        {/* Icon Sidebar */}
        <div className={`
          ${isMobile ? 'w-16' : 'w-16'} 
          bg-black border-r border-gray-800 flex flex-col flex-shrink-0
        `}>
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-gray-800">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">F</span>
            </div>
          </div>

          {/* Main Menu Items */}
          <div className="flex-1 py-4">
            <nav className="space-y-3 px-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group
                    ${activeItem === item.id && isExpanded
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/70 hover:scale-105'
                    }
                    ${item.isPremium ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/40' : ''}
                  `}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                  
                  {/* Premium Crown */}
                  {item.isPremium && (
                    <div className="absolute -top-1 -right-1">
                      <Crown className="w-3 h-3 text-yellow-400 drop-shadow-sm" />
                    </div>
                  )}
                  
                  {/* Notification Dot */}
                  {item.hasNotification && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black shadow-lg animate-pulse" />
                  )}

                  {/* Active Indicator */}
                  {activeItem === item.id && isExpanded && (
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-lg" />
                  )}

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom Items */}
          <div className="pb-4 border-t border-gray-800 pt-4">
            <nav className="space-y-3 px-2">
              {bottomItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group
                    ${activeItem === item.id && isExpanded
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/70 hover:scale-105'
                    }
                  `}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                  
                  {/* Active Indicator */}
                  {activeItem === item.id && isExpanded && (
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-lg" />
                  )}

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </nav>
          </div>

          {/* Status Indicator */}
          <div className="pb-3 px-2">
            <div className="text-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto shadow-lg animate-pulse" />
              <span className="text-xs text-gray-500 mt-1 block font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* Expandable Panel - Increased width */}
        {isExpanded && activeItem && (
          <div className={`
            ${isMobile 
              ? 'flex-1 w-full' 
              : 'w-96'
            }
            border-r border-gray-800 bg-black
          `}>
            <ExpandableMenuPanel
              activeItem={activeItem}
              onClose={handlePanelClose}
              onDragStart={onDragStart}
              onAddCompleteTemplate={onAddCompleteTemplate}
              onShapeAdd={onShapeAdd}
              onTemplateClick={onTemplateClick}
              componentCount={componentCount}
              connectionCount={connectionCount}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}; 