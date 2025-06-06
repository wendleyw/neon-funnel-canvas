import React from 'react';
import { ScrollArea } from '@/features/shared/ui/scroll-area';
import { Crown, Sparkles } from 'lucide-react';

export const CustomFunnelContent: React.FC = () => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        <div className="text-center py-8">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-black" />
            </div>
          </div>
          
          <h3 className="text-white text-xl font-bold mb-2">Create Custom Funnels</h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Unlock the power of AI to create unique and optimized funnels for your business
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Advanced AI for funnel creation</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Unlimited templates</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Automatic analysis and optimization</span>
            </div>
          </div>
          
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
            Get Started - Pro
          </button>
          
          <p className="text-xs text-gray-500 mt-3">
            7 days free • Cancel anytime
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}; 