import React from 'react';

interface WireframeMockupProps {
  className?: string;
}

export const WireframeMockup: React.FC<WireframeMockupProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`w-full h-full bg-gray-100 p-4 overflow-hidden ${className}`}>
      {/* Browser Frame */}
      <div className="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Browser Top Bar */}
        <div className="h-6 bg-gray-200 flex items-center px-2 border-b border-gray-300">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex-1 mx-2 h-1 bg-gray-300 rounded"></div>
        </div>
        
        {/* Page Content - Based on the user's mockup */}
        <div className="p-4 h-full overflow-hidden">
          {/* Hero Section with Image Placeholder */}
          <div className="w-full h-32 bg-teal-600 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-teal-700 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-teal-700 rounded-full"></div>
              </div>
              <div className="ml-4">
                <div className="w-20 h-3 bg-teal-700 rounded mb-2"></div>
                <div className="w-16 h-3 bg-teal-700 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Content Bars */}
          <div className="w-full h-2 bg-teal-600 rounded mb-3"></div>
          <div className="w-4/5 h-2 bg-gray-400 rounded mb-3"></div>
          <div className="w-full h-2 bg-gray-400 rounded mb-3"></div>
          <div className="w-3/4 h-2 bg-gray-400 rounded mb-4"></div>
          
          {/* CTA Buttons */}
          <div className="flex gap-2 mb-4">
            <div className="w-20 h-6 bg-teal-600 rounded"></div>
            <div className="w-16 h-6 bg-gray-400 rounded"></div>
          </div>
          
          {/* Bottom Content Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="w-full h-2 bg-gray-400 rounded"></div>
            <div className="w-3/4 h-2 bg-gray-400 rounded"></div>
          </div>
          <div className="w-2/3 h-2 bg-gray-400 rounded mb-2"></div>
          <div className="w-1/2 h-2 bg-gray-400 rounded"></div>
          
          {/* Footer Section */}
          <div className="mt-6 w-full h-8 bg-teal-600 rounded"></div>
          <div className="flex gap-2 mt-2">
            <div className="w-16 h-2 bg-teal-600 rounded"></div>
            <div className="w-12 h-2 bg-teal-600 rounded"></div>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="w-20 h-2 bg-teal-600 rounded"></div>
            <div className="w-10 h-2 bg-teal-600 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 