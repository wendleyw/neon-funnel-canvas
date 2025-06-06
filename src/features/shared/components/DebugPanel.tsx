import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { SystemStatusPanel } from './SystemStatusPanel';
import { Button } from '../ui/button';
import { Bug, Settings } from 'lucide-react';

export const DebugPanel: React.FC = () => {
  const { user } = useAuth();
  const [showStatus, setShowStatus] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Only show debug panel in development or for authenticated users
  if (process.env.NODE_ENV === 'production' && !user) {
    return null;
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setShowStatus(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            size="sm"
          >
            <Bug className="w-4 h-4 mr-2" />
            System Status
          </Button>
          
          {process.env.NODE_ENV === 'development' && (
            <Button
              onClick={() => setShowDebug(!showDebug)}
              variant="outline"
              className="bg-neutral-800 border-neutral-600 text-white hover:bg-neutral-700"
              size="sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Debug
            </Button>
          )}
        </div>
      </div>

      {/* System Status Panel */}
      <SystemStatusPanel 
        isOpen={showStatus} 
        onClose={() => setShowStatus(false)} 
      />

      {/* Development Debug Info */}
      {showDebug && process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
          <div className="font-bold mb-2">Debug Info (Dev Only)</div>
          <div>Environment: {process.env.NODE_ENV}</div>
          <div>User: {user ? 'Authenticated' : 'Anonymous'}</div>
          <div>Timestamp: {new Date().toLocaleTimeString()}</div>
        </div>
      )}
    </>
  );
}; 