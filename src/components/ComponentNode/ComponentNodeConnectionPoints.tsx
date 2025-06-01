
import React from 'react';

export const ComponentNodeConnectionPoints: React.FC = () => {
  return (
    <>
      {/* Connection Points */}
      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
        <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </>
  );
};
