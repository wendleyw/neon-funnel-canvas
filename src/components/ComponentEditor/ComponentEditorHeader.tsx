import React from 'react';
import { Badge } from '../ui/badge';
import { X, Sparkles, Maximize2, Minimize2 } from 'lucide-react';

interface ComponentEditorHeaderProps {
  componentType: string;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onClose: () => void;
  editorTitle?: string;
  editorSubtitle?: string;
  icon?: React.ElementType;
}

export const ComponentEditorHeader: React.FC<ComponentEditorHeaderProps> = ({
  componentType,
  isMaximized,
  onToggleMaximize,
  onClose,
  editorTitle = "Edit Component",
  editorSubtitle = "Customize your component settings",
  icon: IconComponent = Sparkles,
}) => {
  return (
    <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-t-2xl">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="p-2 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl flex-shrink-0">
          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
            {editorTitle}
          </h2>
          <p className="text-xs text-gray-400 hidden sm:block">{editorSubtitle}</p>
        </div>
        <Badge 
          variant="outline" 
          className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors text-xs flex-shrink-0"
        >
          {componentType}
        </Badge>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMaximize();
          }}
          className="group p-1.5 sm:p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/50 rounded-xl"
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? (
            <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200" />
          ) : (
            <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="group p-1.5 sm:p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/50 rounded-xl"
          title="Close (Esc)"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}; 