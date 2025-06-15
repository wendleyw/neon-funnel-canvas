import React from 'react';
import { Connection, FunnelComponent } from '../../../types/funnel';
import { ConnectionEditor } from './ConnectionEditor';
import { calculateBestConnectionPoints, createOptimizedConnectionPath } from '../utils/connectionUtils';
import { useNeonAnimation } from '../../../contexts/NeonAnimationContext';
import { useSequenceAnimation } from '../../../contexts/SequenceAnimationContext';

interface ConnectionLineProps {
  connection: Connection;
  fromComponent: FunnelComponent;
  toComponent: FunnelComponent;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (connectionId: string, updates: Partial<Connection>) => void;
  onDelete?: (connectionId: string) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  fromComponent,
  toComponent,
  isSelected = false,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const { isGlobalAnimationEnabled } = useNeonAnimation();
  const { isSequenceMode, getConnectionDelay, isConnectionInActiveSequence, getConnectionPositionInSequence } = useSequenceAnimation();
  
  // Calculate intelligent connection points
  const connectionPoints = calculateBestConnectionPoints(fromComponent, toComponent);
  
  // Adjust for canvas coordinate system
  const startX = connectionPoints.from.x + 5000;
  const startY = connectionPoints.from.y + 5000;
  const endX = connectionPoints.to.x + 5000;
  const endY = connectionPoints.to.y + 5000;

  // Determine animation mode
  const inSequence = isConnectionInActiveSequence(connection.id);
  const sequenceDelay = getConnectionDelay(connection.id);
  const connectionPosition = getConnectionPositionInSequence(connection.id);
  
  // NEW APPROACH: Calculate number of balls based on component hierarchy
  // Get all connections and count the depth/level of this connection
  const allConnections = (window as any).__currentConnections || [];
  
  // SIMPLIFIED: Just use a pattern based on connection or component to show multiple balls
  let numberOfBalls = 1;
  
  if (isSequenceMode && inSequence && connectionPosition > 0) {
    numberOfBalls = connectionPosition;
  } else {
    // Simple fallback: count connections to the target component
    const connectionsToTarget = allConnections.filter((c: any) => c.to === connection.to).length;
    numberOfBalls = Math.max(1, connectionsToTarget);
    
    // Alternative: use component position to create variety
    if (numberOfBalls === 1) {
      const componentHash = (toComponent.position.x + toComponent.position.y) % 3;
      numberOfBalls = componentHash + 1;
    }
  }
  
  // Combine individual animation setting with global toggle and sequence mode
  const isAnimated = connection.animated === true && isGlobalAnimationEnabled;
  const isSequenceAnimated = isSequenceMode && inSequence && isAnimated;

  console.log(`🎨 Connection ${connection.id}:`, {
    from: { 
      side: connectionPoints.from.side, 
      x: startX, 
      y: startY,
      component: fromComponent.data.title 
    },
    to: { 
      side: connectionPoints.to.side, 
      x: endX, 
      y: endY,
      component: toComponent.data.title 
    },
    isSelected,
    type: connection.type,
    individualAnimated: connection.animated,
    globalAnimationEnabled: isGlobalAnimationEnabled,
    sequenceMode: isSequenceMode,
    inSequence,
    sequenceDelay: sequenceDelay / 1000 + 's',
    connectionPosition,
    numberOfBalls,
    'DEBUG_allConnections': allConnections.length,
    'DEBUG_calculations': {
      inSequence,
      connectionPosition,
      numberOfBalls
    }
  });

  const getConnectionColor = () => {
    // Prioritize custom color
    if (connection.customColor) {
      return connection.customColor;
    }
    
    // Default colors by type with higher intensity
    switch (connection.type) {
      case 'success': return '#10B981';
      case 'failure': return '#EF4444';
      case 'conditional': return '#F59E0B';
      default: return '#06B6D4'; // Cyan for default connections
    }
  };

  // Create optimized path based on intelligent points
  const pathData = createOptimizedConnectionPath(
    { x: startX, y: startY, side: connectionPoints.from.side },
    { x: endX, y: endY, side: connectionPoints.to.side },
    'curved' // Can be 'straight', 'curved', or 'stepped'
  );
  
  const color = getConnectionColor();
  const gradientId = `gradient-${connection.id}`;
  const neonGradientId = `neon-gradient-${connection.id}`;
  const glowId = `glow-${connection.id}`;
  const neonGlowId = `neon-glow-${connection.id}`;

  // Calculate gradient direction based on connection direction
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const angle = Math.atan2(deltaY, deltaX);
  const gradientAngle = (angle * 180) / Math.PI;

  const editorPosition = {
    x: (startX + endX) / 2,
    y: (startY + endY) / 2
  };

  return (
    <>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
      >
        {/* Advanced definitions */}
        <defs>
          {/* Neon gradient for animated line with proper direction and transparent edges */}
          <linearGradient 
            id={neonGradientId} 
            x1="0%" y1="0%" x2="100%" y2="0%"
            gradientTransform={`rotate(${gradientAngle} 0.5 0.5)`}
          >
            <stop offset="0%" stopColor={color} stopOpacity="0">
              <animate attributeName="stop-opacity" values="0;0.3;0" dur="3s" repeatCount="indefinite" begin={isSequenceAnimated ? `${sequenceDelay}ms` : '0s'} />
            </stop>
            <stop offset="20%" stopColor={color} stopOpacity="0.4">
              <animate attributeName="stop-opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" begin={isSequenceAnimated ? `${sequenceDelay}ms` : '0s'} />
            </stop>
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.6">
              <animate attributeName="stop-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" begin={isSequenceAnimated ? `${sequenceDelay}ms` : '0s'} />
            </stop>
            <stop offset="50%" stopColor={color} stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" begin={isSequenceAnimated ? `${sequenceDelay}ms` : '0s'} />
            </stop>
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.6">
              <animate attributeName="stop-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" begin={isSequenceAnimated ? `${sequenceDelay}ms` : '0s'} />
            </stop>
            <stop offset="80%" stopColor={color} stopOpacity="0.4">
              <animate attributeName="stop-opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" begin={isSequenceAnimated ? `${sequenceDelay}ms` : '0s'} />
            </stop>
            <stop offset="100%" stopColor={color} stopOpacity="0">
              <animate attributeName="stop-opacity" values="0;0.3;0" dur="3s" repeatCount="indefinite" begin={isSequenceAnimated ? `${sequenceDelay}ms` : '0s'} />
            </stop>
          </linearGradient>
          
          {/* Regular gradient for line with transparent edges */}
          <linearGradient 
            id={gradientId} 
            x1="0%" y1="0%" x2="100%" y2="0%"
            gradientTransform={`rotate(${gradientAngle} 0.5 0.5)`}
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="20%" stopColor={color} stopOpacity="0.6" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="80%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
          
          {/* Reduced intensity neon glow filter */}
          <filter id={neonGlowId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feGaussianBlur stdDeviation="8" result="bigBlur"/>
            <feGaussianBlur stdDeviation="12" result="hugeBlur"/>
            <feMerge> 
              <feMergeNode in="hugeBlur"/>
              <feMergeNode in="bigBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Regular glow filter */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Shadow filter */}
          <filter id={`shadow-${connection.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={color} floodOpacity="0.2"/>
          </filter>
        </defs>

        {/* Clickable invisible area */}
        <path
          d={pathData}
          stroke="transparent"
          strokeWidth="30"
          fill="none"
          className="pointer-events-auto cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`[ConnectionLine] Click on connection ${connection.id}`);
            onSelect?.();
          }}
        />
        
        {/* Base neon glow layer */}
        <path
          d={pathData}
          stroke={color}
          strokeWidth="6"
          fill="none"
          filter={`url(#${neonGlowId})`}
          className="pointer-events-none"
          opacity={isSequenceAnimated ? "0.2" : "0.15"}
        />
        
        {/* Secondary glow layer */}
        <path
          d={pathData}
          stroke={color}
          strokeWidth="3"
          fill="none"
          filter={`url(#${glowId})`}
          className="pointer-events-none"
          opacity={isSequenceAnimated ? "0.5" : "0.4"}
        />
        
        {/* Main neon line */}
        <path
          d={pathData}
          stroke={isAnimated ? `url(#${neonGradientId})` : `url(#${gradientId})`}
          strokeWidth="2"
          fill="none"
          className="pointer-events-none"
          strokeDasharray={isAnimated ? "12,8" : "none"}
          style={{
            animation: isAnimated && !isSequenceAnimated ? 'neonDashFlow 4s linear infinite' : 'none'
          }}
        />
        
        {/* Core bright line */}
        <path
          d={pathData}
          stroke="#ffffff"
          strokeWidth="0.5"
          fill="none"
          className="pointer-events-none"
          opacity="0.7"
        />
        
        {/* Connection points with neon effect - smaller and more precise */}
        <circle
          cx={startX}
          cy={startY}
          r="3"
          fill={color}
          className="pointer-events-none"
          filter={`url(#${neonGlowId})`}
          opacity="0.5"
        />
        <circle
          cx={startX}
          cy={startY}
          r="1.5"
          fill="#ffffff"
          className="pointer-events-none"
          opacity="0.9"
        />
        
        <circle
          cx={endX}
          cy={endY}
          r="3"
          fill={color}
          className="pointer-events-none"
          filter={`url(#${neonGlowId})`}
          opacity="0.5"
        />
        <circle
          cx={endX}
          cy={endY}
          r="1.5"
          fill="#ffffff"
          className="pointer-events-none"
          opacity="0.9"
        />
        
        {/* Enhanced animated lead orb traveling along path */}
        {isAnimated && (
          <g className="pointer-events-none">
            {/* Generate multiple balls based on connection position in sequence */}
            {Array.from({ length: numberOfBalls }, (_, ballIndex) => {
              const ballDelay = ballIndex * 300; // 300ms between each ball
              const baseDelay = isSequenceAnimated ? sequenceDelay : 0;
              const totalDelay = baseDelay + ballDelay;
              
              return (
                <g key={`ball-${ballIndex}`}>
                  {/* Main lead orb with enhanced effects */}
                  <circle
                    r="8"
                    fill={color}
                    filter={`url(#${neonGlowId})`}
                    opacity="0.8"
                  >
                    <animateMotion 
                      dur="4s" 
                      repeatCount="indefinite" 
                      rotate="auto"
                      begin={`${totalDelay}ms`}
                    >
                      <mpath href={`#path-${connection.id}`}/>
                    </animateMotion>
                    <animate 
                      attributeName="opacity" 
                      values="0;0.8;0.8;0.8;0" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      begin={`${totalDelay}ms`}
                    />
                    <animate 
                      attributeName="r" 
                      values="5;12;8;12;5" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      begin={`${totalDelay}ms`}
                    />
                  </circle>
                  
                  {/* Core bright orb */}
                  <circle
                    r="4"
                    fill="#ffffff"
                    opacity="1"
                  >
                    <animateMotion 
                      dur="4s" 
                      repeatCount="indefinite" 
                      rotate="auto"
                      begin={`${totalDelay}ms`}
                    >
                      <mpath href={`#path-${connection.id}`}/>
                    </animateMotion>
                    <animate 
                      attributeName="opacity" 
                      values="0;1;1;1;0" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      begin={`${totalDelay}ms`}
                    />
                    <animate 
                      attributeName="r" 
                      values="2;6;4;6;2" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      begin={`${totalDelay}ms`}
                    />
                  </circle>
                  
                  {/* Enhanced trailing particles */}
                  <circle
                    r="3"
                    fill={color}
                    opacity="0.6"
                  >
                    <animateMotion 
                      dur="4s" 
                      repeatCount="indefinite" 
                      rotate="auto" 
                      begin={`${totalDelay + 500}ms`}
                    >
                      <mpath href={`#path-${connection.id}`}/>
                    </animateMotion>
                    <animate 
                      attributeName="opacity" 
                      values="0;0.6;0.6;0.6;0" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      begin={`${totalDelay + 500}ms`}
                    />
                    <animate 
                      attributeName="r" 
                      values="1;6;3;6;1" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      begin={`${totalDelay + 500}ms`}
                    />
                  </circle>
                  
                  <circle
                    r="2"
                    fill={color}
                    opacity="0.4"
                  >
                    <animateMotion 
                      dur="4s" 
                      repeatCount="indefinite" 
                      rotate="auto" 
                      begin={`${totalDelay + 1000}ms`}
                    >
                      <mpath href={`#path-${connection.id}`}/>
                    </animateMotion>
                    <animate 
                      attributeName="opacity" 
                      values="0;0.4;0.4;0.4;0" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      begin={`${totalDelay + 1000}ms`}
                    />
                    <animate 
                      attributeName="r" 
                      values="1;4;2;4;1" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      begin={`${totalDelay + 1000}ms`}
                    />
                  </circle>
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Enhanced CSS animations */}
      <style>
        {`
          @keyframes neonDashFlow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 50; }
          }
          
          @keyframes selectionPulse {
            0%, 100% { opacity: 0.2; stroke-width: 8px; }
            50% { opacity: 0.6; stroke-width: 16px; }
          }
          
          @keyframes selectionFlow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 46; }
          }
        `}
      </style>

      {/* Connection editor when selected */}
      {isSelected && (
        <ConnectionEditor
          connection={connection}
          position={editorPosition}
          onUpdate={onUpdate || (() => {})}
          onDelete={onDelete || (() => {})}
          onClose={() => onSelect?.()}
        />
      )}
    </>
  );
};
