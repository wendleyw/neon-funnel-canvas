import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface NeonAnimationContextType {
  isGlobalAnimationEnabled: boolean;
  toggleGlobalAnimation: () => void;
  enableGlobalAnimation: () => void;
  disableGlobalAnimation: () => void;
  onSequenceDisable?: () => void;
}

const NeonAnimationContext = createContext<NeonAnimationContextType | undefined>(undefined);

interface NeonAnimationProviderProps {
  children: ReactNode;
  onSequenceDisable?: () => void;
}

export const NeonAnimationProvider: React.FC<NeonAnimationProviderProps> = ({ 
  children, 
  onSequenceDisable 
}) => {
  const [isGlobalAnimationEnabled, setIsGlobalAnimationEnabled] = useState(true);

  const toggleGlobalAnimation = useCallback(() => {
    const newState = !isGlobalAnimationEnabled;
    setIsGlobalAnimationEnabled(newState);
    
    if (!newState && onSequenceDisable) {
      console.log('[NeonAnimation] Neon disabled, disabling sequence mode');
      onSequenceDisable();
    }
    
    console.log(`[NeonAnimation] Global animation ${newState ? 'enabled' : 'disabled'}`);
  }, [isGlobalAnimationEnabled, onSequenceDisable]);

  const enableGlobalAnimation = useCallback(() => {
    setIsGlobalAnimationEnabled(true);
    console.log('[NeonAnimation] Global animation enabled');
  }, []);

  const disableGlobalAnimation = useCallback(() => {
    setIsGlobalAnimationEnabled(false);
    
    if (onSequenceDisable) {
      console.log('[NeonAnimation] Neon disabled, disabling sequence mode');
      onSequenceDisable();
    }
    
    console.log('[NeonAnimation] Global animation disabled');
  }, [onSequenceDisable]);

  return (
    <NeonAnimationContext.Provider
      value={{
        isGlobalAnimationEnabled,
        toggleGlobalAnimation,
        enableGlobalAnimation,
        disableGlobalAnimation,
        onSequenceDisable
      }}
    >
      {children}
    </NeonAnimationContext.Provider>
  );
};

export const useNeonAnimation = () => {
  const context = useContext(NeonAnimationContext);
  if (context === undefined) {
    throw new Error('useNeonAnimation must be used within a NeonAnimationProvider');
  }
  return context;
}; 