import React, { useState } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { DrawingShape, DrawingTool } from '../../../types/drawing';
import { useIsMobile } from '../../../hooks/use-mobile';
import { useFavorites } from '../../../hooks/use-favorites';
import { actionSections, UserAction } from '../../../data/userActions';
import { Search, Plus, Star, Filter } from 'lucide-react';

interface ActionsTabProps {
  onDragStart: (template: ComponentTemplate) => void;
  onShapeAdd?: (shape: DrawingShape) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

export const ActionsTab: React.FC<ActionsTabProps> = ({
  onDragStart,
  onShapeAdd,
  onTemplateClick
}) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  const { 
    isFavorite, 
    toggleFavorite, 
    getFavoritesByType, 
    getFavoritesCount 
  } = useFavorites();

  // Collect all actions from all sections into a flat array
  const allActions = Object.values(actionSections).flatMap(section => section.actions);

  // Get favorite actions and cast them back to UserAction
  const favoriteTemplates = getFavoritesByType('action');
  const favoriteActions = favoriteTemplates.filter((template): template is UserAction => {
    // Check if this template exists in our actions and is a UserAction
    return allActions.some(action => action.type === template.type);
  }).map(template => {
    // Find the original UserAction
    return allActions.find(action => action.type === template.type)!;
  });

  // Filter actions based on search and favorites
  const getFilteredActions = () => {
    let actions = showOnlyFavorites ? favoriteActions : allActions;
    
    if (searchQuery) {
      actions = actions.filter(action => 
        action.userFriendlyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.actionType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return actions;
  };

  const filteredActions = getFilteredActions();

  // Simple drawing tools - reduced set
  const quickTools = [
    { icon: '⬜', label: 'Box', type: 'rectangle' as DrawingTool, color: '#6B7280' },
    { icon: '🔴', label: 'Circle', type: 'circle' as DrawingTool, color: '#EF4444' },
    { icon: '➡️', label: 'Arrow', type: 'arrow' as DrawingTool, color: '#10B981' },
    { icon: '✏️', label: 'Text', type: 'text' as DrawingTool, color: '#3B82F6' },
  ];

  const handleShapeAdd = (shapeType: DrawingTool) => {
    if (onShapeAdd) {
      const shape: DrawingShape = {
        id: `shape-${Date.now()}`,
        type: shapeType,
        position: { x: 100, y: 100 },
        size: { width: 100, height: 60 },
        style: {
          fill: 'transparent',
          stroke: '#3B82F6',
          strokeWidth: 2,
        },
        text: shapeType === 'text' ? 'Your text here' : undefined,
      };
      onShapeAdd(shape);
    }
  };

  const handleActionClick = (action: UserAction) => {
    if (onTemplateClick) {
      onTemplateClick(action);
    }
  };

  const handleActionDragStart = (e: React.DragEvent, action: UserAction) => {
    e.dataTransfer.setData('application/json', JSON.stringify(action));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(action);
  };

  const handleFavoriteClick = (e: React.MouseEvent, action: UserAction) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(action, 'action');
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'conversion': return '🎯';
      case 'engagement': return '🎯';
      case 'integration': return '🔗';
      case 'custom': return '⚡';
      default: return '📋';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header with Search and Filters */}
      <div className="p-3 border-b border-gray-800 flex-shrink-0 relative bg-black">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white">Actions</h2>
          <div className="flex items-center gap-1">
            {getFavoritesCount('action') > 0 && (
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  showOnlyFavorites 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                }`}
                title={showOnlyFavorites ? 'Show all actions' : 'Show only favorites'}
              >
                <Star className={`w-3 h-3 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                <span>{getFavoritesCount('action')}</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500" />
          <input
            type="text"
            placeholder={showOnlyFavorites ? "Search favorites..." : "Search actions..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-xs bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Quick Tools */}
      <div className="p-3 border-b border-gray-800 flex-shrink-0 bg-black">
        <div className="flex gap-1">
          {quickTools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => handleShapeAdd(tool.type)}
              className="flex-1 p-2 bg-gray-900 hover:bg-gray-800 rounded text-xs text-gray-300 hover:text-white transition-colors border border-gray-800 hover:border-gray-700"
              title={tool.label}
            >
              <div className="text-center">
                <div className="text-sm mb-1">{tool.icon}</div>
                <div className="text-xs">{tool.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions List */}
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-2">
          {filteredActions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              {showOnlyFavorites ? (
                <>
                  <Star className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p>No favorite actions yet</p>
                  <button 
                    onClick={() => setShowOnlyFavorites(false)}
                    className="text-blue-400 hover:text-blue-300 mt-1 underline"
                  >
                    Browse all actions
                  </button>
                </>
              ) : (
                <p>No actions found</p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredActions.map((action) => (
                <div
                  key={action.type}
                  className="group relative bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                  draggable={!isMobile}
                  onDragStart={!isMobile ? (e) => handleActionDragStart(e, action) : undefined}
                  onClick={() => handleActionClick(action)}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      {/* Simple Icon */}
                      <div className="w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0"
                           style={{ backgroundColor: `${action.color}20`, color: action.color }}>
                        {action.iconEmoji}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-white truncate">
                          {action.userFriendlyName}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {action.description}
                        </p>
                      </div>
                      
                      {/* Favorite indicator only */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleFavoriteClick(e, action)}
                          className={`opacity-0 group-hover:opacity-100 transition-all ${
                            isFavorite(action, 'action') ? 'opacity-100 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                          }`}
                          title={isFavorite(action, 'action') ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-3 h-3 ${isFavorite(action, 'action') ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 