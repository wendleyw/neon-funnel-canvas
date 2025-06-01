
import React from 'react';

interface ComponentNodeConnectionPointsProps {
  componentId: string;
  connectingFrom: string | null;
  onStartConnection: () => void;
  onConnect: () => void;
}

export const ComponentNodeConnectionPoints: React.FC<ComponentNodeConnectionPointsProps> = ({
  componentId,
  connectingFrom,
  onStartConnection,
  onConnect
}) => {
  const canConnect = connectingFrom && connectingFrom !== componentId;

  return (
    <>
      {/* Input connection point */}
      <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
        <div 
          className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
            canConnect 
              ? 'bg-green-500 border-green-400 animate-pulse' 
              : 'bg-gray-600 border-gray-500 hover:bg-blue-500 hover:border-blue-400'
          }`}
          onClick={canConnect ? onConnect : undefined}
        />
      </div>

      {/* Output connection point */}
      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
        <div 
          className="w-6 h-6 bg-purple-600 border-2 border-purple-500 rounded-full cursor-pointer hover:bg-purple-500 hover:border-purple-400 transition-all"
          onClick={onStartConnection}
        />
      </div>
    </>
  );
};
