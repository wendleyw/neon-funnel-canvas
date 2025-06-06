import React, { useState, useEffect, useRef, createRef } from 'react';
import { ErrorBoundary } from '@/features/shared/components/ErrorBoundary';
import { ExpandableMenuPanel } from './ExpandableMenuPanel';
import { ComponentTemplate } from '../../../types/funnel';
import { FunnelComponent, Connection } from '../../../types/funnel';
import { DrawingShape } from '../../../types/drawing';
import { useIsMobile } from '@/features/shared/hooks/use-mobile';
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
  Plus,
  MessageSquare,
  Shield
} from 'lucide-react';
import { FunnelboardLogo } from '@/features/shared/ui/FunnelboardLogo';

interface IconSidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
  componentCount?: number;
  connectionCount?: number;
  onPanelStateChange?: (isExpanded: boolean) => void;
  onOpenAdmin?: () => void;
}

// Extend MenuItemId to include 'feedback' if we treat it like other active items
type MenuItemId = 'create' | 'library' | 'explore' | 'custom' | 'notifications' | 'profile' | 'feedback' | 'admin';

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

const bottomMenuItems: MenuItem[] = [ // Renamed from bottomItems for clarity with new MenuItemId type
  { icon: User, label: 'Profile', id: 'profile' },
];

export const IconSidebar: React.FC<IconSidebarProps> = ({
  onDragStart,
  onAddCompleteTemplate,
  onShapeAdd,
  onTemplateClick,
  componentCount = 0,
  connectionCount = 0,
  onPanelStateChange,
  onOpenAdmin
}) => {
  const [activeItem, setActiveItem] = useState<MenuItemId | null>('create');
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useIsMobile();
  const [ballYPosition, setBallYPosition] = useState<number | null>(null);

  const menuItemRefs = useRef<Record<MenuItemId, React.RefObject<HTMLButtonElement>>>({
    create: createRef<HTMLButtonElement>(),
    library: createRef<HTMLButtonElement>(),
    explore: createRef<HTMLButtonElement>(),
    custom: createRef<HTMLButtonElement>(),
    notifications: createRef<HTMLButtonElement>(),
    profile: createRef<HTMLButtonElement>(),
    feedback: createRef<HTMLButtonElement>(),
    admin: createRef<HTMLButtonElement>(),
  });
  const logoContainerRef = useRef<HTMLDivElement>(null);

  const updateBallPosition = (itemId: MenuItemId | 'logo-init') => {
    let targetElement: HTMLButtonElement | HTMLDivElement | null = null;

    if (itemId === 'logo-init' && logoContainerRef.current) {
      const logoRect = logoContainerRef.current.getBoundingClientRect();
      const sidebarRect = logoContainerRef.current.offsetParent?.getBoundingClientRect();
      const initialY = logoRect.top + logoRect.height / 2 - (sidebarRect?.top || 0) - 8; 
      setBallYPosition(initialY);
      return;
    } else if (menuItemRefs.current[itemId as MenuItemId]?.current) {
      targetElement = menuItemRefs.current[itemId as MenuItemId].current;
    }

    if (targetElement) {
      const targetRect = targetElement.getBoundingClientRect();
      const parentRect = targetElement.offsetParent?.getBoundingClientRect();
      if (parentRect) {
        const newY = targetRect.top - parentRect.top + targetRect.height / 2 - 8; 
        setBallYPosition(newY);
      }
    }
  };

  useEffect(() => {
    if (activeItem && menuItemRefs.current[activeItem]?.current) {
      updateBallPosition(activeItem);
    } else if (!activeItem) {
      setBallYPosition(null);
    }
  }, [activeItem]);

  useEffect(() => {
    if (onPanelStateChange) {
      onPanelStateChange(isExpanded && activeItem !== null);
    }
  }, [isExpanded, activeItem, onPanelStateChange]);

  const handleItemClick = (itemId: MenuItemId) => {
    updateBallPosition(itemId);
    setActiveItem(itemId);

    if (itemId === 'feedback') {
      setIsExpanded(true);
      return;
    }

    if (isMobile) {
      setIsExpanded(true);
    } else {
      if (activeItem === itemId && isExpanded) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    }
  };

  const handlePanelClose = () => {
    if (isMobile) {
      return;
    }
    setIsExpanded(false);
  };

  return (
    <ErrorBoundary>
      <div className="flex h-full">
        <div className={`
          ${isMobile ? 'w-16' : 'w-16'} 
          bg-black border-r border-gray-800 flex flex-col flex-shrink-0 relative
        `}>
          {ballYPosition !== null && activeItem !== 'custom' && (
            <div
              className="absolute left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 shadow-lg transition-all duration-500 ease-in-out bg-white"
              style={{
                top: `${ballYPosition}px`,
                boxShadow: (() => {
                  if (!activeItem) return 'none'; 
                  if (activeItem === 'feedback' || activeItem === 'profile') {
                    return '0 0 15px 3px rgba(255, 255, 255, 0.7)';
                  }
                  const menuItem = menuItems.find(m => m.id === activeItem);
                  if (menuItem && menuItem.isPremium && menuItem.id !== 'custom') {
                    return '0 0 15px 3px rgba(236, 72, 153, 0.7)';
                  }
                  return '0 0 15px 3px rgba(255, 255, 255, 0.7)'; 
                })(),
              }}
            />
          )}

          <svg 
            className="absolute top-28 left-0 w-full h-[calc(100%-112px-70px)] pointer-events-none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="subtleFunnelLineGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="rgba(55, 65, 81, 0.15)" />
                <stop offset="100%" stopColor="rgba(55, 65, 81, 0)" />
              </linearGradient>
            </defs>
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="url(#subtleFunnelLineGradient)" strokeWidth="1" />
          </svg>

          <div ref={logoContainerRef} className="h-28 flex items-center justify-center border-b border-gray-800">
            <FunnelboardLogo size={80} />
          </div>

          <div className="flex-1 py-4">
            <nav className="space-y-3 px-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  ref={menuItemRefs.current[item.id]}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group
                    ${activeItem === item.id && isExpanded
                      ? `${item.isPremium ? 'bg-[#EC4899]' : 'bg-blue-600'} text-white scale-105`
                      : `text-gray-400 hover:text-white ${item.isPremium ? 'hover:bg-pink-700/50' : 'hover:bg-gray-800/70'} hover:scale-105`
                    }
                    ${item.isPremium && activeItem !== item.id
                      ? 'bg-gradient-to-br from-pink-600/60 to-purple-700/60 border border-pink-500/50' 
                      : item.isPremium && activeItem === item.id
                        ? 'bg-[#EC4899]'
                        : ''}
                  `}
                  title={item.label}
                >
                  <item.icon className={`w-5 h-5 ${item.isPremium && activeItem === item.id ? 'text-white' : item.isPremium ? 'text-pink-200' : activeItem === item.id ? 'text-white': ''}`} />
                  
                  {item.isPremium && (
                    <div className="absolute -top-1 -right-1">
                      <Crown className="w-3 h-3 text-yellow-400 drop-shadow-sm" />
                    </div>
                  )}
                  
                  {item.hasNotification && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black shadow-lg animate-pulse" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-2 border-t border-gray-800">
            <nav className="space-y-3">
              {bottomMenuItems.map((item) => (
                <button
                  key={item.id}
                  ref={menuItemRefs.current[item.id]}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group
                    ${activeItem === item.id && isExpanded
                      ? 'bg-blue-600 text-white scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/70 hover:scale-105'
                    }
                  `}
                  title={item.label}
                >
                  <item.icon className={`w-5 h-5 ${activeItem === item.id ? 'text-white' : ''}`} />
                </button>
              ))}
              
              <button
                ref={menuItemRefs.current.feedback}
                onClick={() => handleItemClick('feedback')}
                className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group
                  ${activeItem === 'feedback' && isExpanded
                    ? 'bg-yellow-600 text-white scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-yellow-700/50 hover:scale-105'
                  }
                `}
                title="Feedback"
              >
                <MessageSquare className={`w-5 h-5 ${activeItem === 'feedback' ? 'text-white' : ''}`} />
              </button>
              
              {/* Admin Button - Only show for admins */}
              <button
                ref={menuItemRefs.current.admin}
                onClick={() => handleItemClick('admin')}
                className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group
                  ${activeItem === 'admin' && isExpanded
                    ? 'bg-red-600 text-white scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-red-700/50 hover:scale-105'
                  }
                `}
                title="Admin Panel"
              >
                <Shield className={`w-5 h-5 ${activeItem === 'admin' ? 'text-white' : ''}`} />
              </button>
            </nav>
          </div>
        </div>

        {isExpanded && activeItem && (
          <ExpandableMenuPanel
            activeItem={activeItem}
            onClose={handlePanelClose}
            onDragStart={onDragStart}
            onAddCompleteTemplate={onAddCompleteTemplate}
            onShapeAdd={onShapeAdd}
            onTemplateClick={onTemplateClick}
            componentCount={componentCount}
            connectionCount={connectionCount}
            onOpenAdmin={onOpenAdmin}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};