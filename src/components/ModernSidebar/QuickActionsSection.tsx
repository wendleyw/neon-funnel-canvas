
import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface QuickActionsSectionProps {
  onTemplatesClick: () => void;
  favoriteCount: number;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onTemplatesClick,
  favoriteCount
}) => {
  return (
    <div className="p-4 space-y-3">
      <Button
        onClick={onTemplatesClick}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Templates Prontos
      </Button>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Favoritos</span>
        </div>
        {favoriteCount > 0 && (
          <span className="bg-amber-600/20 text-amber-400 px-2 py-1 rounded-full text-xs font-medium">
            {favoriteCount}
          </span>
        )}
      </div>
    </div>
  );
};
