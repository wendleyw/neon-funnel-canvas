import React from 'react';

interface CanvasHelpersProps {
  connectingFrom: string | null;
  selectedConnection: string | null;
}

export const CanvasHelpers: React.FC<CanvasHelpersProps> = ({
  connectingFrom,
  selectedConnection
}) => {
  return (
    <>
      {/* Helper text */}
      {connectingFrom && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          Click another component to connect
        </div>
      )}
      
      {selectedConnection && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          Click the connection again or X to delete
        </div>
      )}
    </>
  );
};
