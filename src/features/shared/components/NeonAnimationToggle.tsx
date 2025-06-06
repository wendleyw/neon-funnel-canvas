import React from 'react';
import { Zap, ZapOff, Play, Square } from 'lucide-react';
import { useNeonAnimation } from '../../../contexts/NeonAnimationContext';
import { useSequenceAnimation } from '../../../contexts/SequenceAnimationContext';

interface NeonAnimationToggleProps {
  connectionsCount?: number;
  animatedConnectionsCount?: number;
}

export const NeonAnimationToggle: React.FC<NeonAnimationToggleProps> = ({
  connectionsCount = 0,
  animatedConnectionsCount = 0
}) => {
  const { isGlobalAnimationEnabled, toggleGlobalAnimation } = useNeonAnimation();
  const { isSequenceMode, toggleSequenceMode, activeSequences } = useSequenceAnimation();

  // Desabilitar toggle de sequência quando Neon está off
  const canToggleSequence = isGlobalAnimationEnabled;

  return (
    <div className="flex items-center gap-2">
      {/* Sequence Mode Toggle */}
      <button
        onClick={canToggleSequence ? toggleSequenceMode : undefined}
        disabled={!canToggleSequence}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          !canToggleSequence
            ? 'bg-gray-900 border border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
            : isSequenceMode
              ? 'bg-purple-900/30 border border-purple-600/50 text-purple-300 hover:bg-purple-900/50 shadow-lg shadow-purple-500/20'
              : 'bg-gray-800 border border-gray-600 text-gray-400 hover:bg-gray-700'
        }`}
        title={
          !canToggleSequence 
            ? 'Ative o Neon primeiro para usar modo sequencial'
            : `${isSequenceMode ? 'Desativar' : 'Ativar'} modo sequencial`
        }
      >
        {isSequenceMode && canToggleSequence ? (
          <>
            <Play className="w-4 h-4 text-purple-400" />
            <span>Sequence</span>
          </>
        ) : (
          <>
            <Square className="w-4 h-4 text-gray-500" />
            <span>Manual</span>
          </>
        )}
      </button>

      {/* Neon Animation Toggle */}
      <button
        onClick={toggleGlobalAnimation}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          isGlobalAnimationEnabled
            ? 'bg-cyan-900/30 border border-cyan-600/50 text-cyan-300 hover:bg-cyan-900/50 shadow-lg shadow-cyan-500/20'
            : 'bg-gray-800 border border-gray-600 text-gray-400 hover:bg-gray-700'
        }`}
        title={`${isGlobalAnimationEnabled ? 'Desativar' : 'Ativar'} animações neon`}
      >
        {isGlobalAnimationEnabled ? (
          <>
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Neon ON</span>
          </>
        ) : (
          <>
            <ZapOff className="w-4 h-4 text-gray-500" />
            <span>Neon OFF</span>
          </>
        )}
      </button>
      
      {connectionsCount > 0 && (
        <div className="flex flex-col text-xs text-gray-400">
          <div>
            {isGlobalAnimationEnabled ? animatedConnectionsCount : 0}/{connectionsCount}
          </div>
          {isSequenceMode && activeSequences.length > 0 && isGlobalAnimationEnabled && (
            <div className="text-purple-400">
              {activeSequences.length} seq
            </div>
          )}
          {!isGlobalAnimationEnabled && (
            <div className="text-red-400 text-xs">
              Disabled
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 