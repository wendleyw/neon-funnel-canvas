import React, { useEffect, useState, useRef } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeProps,
  getSmoothStepPath,
} from 'reactflow';

interface AnimatedNodeEdgeData {
  node: string;
  label?: string;
}

export const AnimatedNodeEdge: React.FC<EdgeProps<AnimatedNodeEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 10,
  });

  // Animation loop
  useEffect(() => {
    const duration = 3000; // 3 segundos para completar a animação
    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = (elapsed % duration) / duration;
      
      setAnimationProgress(progress);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Calculate animated lead position along the actual path
  const getAnimatedPosition = (progress: number) => {
    if (pathRef.current) {
      try {
        const pathLength = pathRef.current.getTotalLength();
        const point = pathRef.current.getPointAtLength(progress * pathLength);
        return { x: point.x, y: point.y };
      } catch (error) {
        // Fallback to linear interpolation if SVG methods fail
        console.warn('SVG path methods not available, using linear interpolation');
      }
    }
    
    // Fallback: linear interpolation
    const x = sourceX + (targetX - sourceX) * progress;
    const y = sourceY + (targetY - sourceY) * progress;
    return { x, y };
  };

  const animatedPos = getAnimatedPosition(animationProgress);

  // Generate trail positions for the dotted effect
  const getTrailPositions = () => {
    const trailCount = 4;
    const positions = [];
    
    for (let i = 0; i < trailCount; i++) {
      const offset = 0.1; // Distance between trail dots
      const trailProgress = animationProgress - (i * offset);
      
      if (trailProgress >= 0 && trailProgress <= 1) {
        positions.push({
          progress: trailProgress,
          position: getAnimatedPosition(trailProgress),
          opacity: 1 - (i * 0.2) // Fade out trail dots
        });
      }
    }
    
    return positions;
  };

  const trailPositions = getTrailPositions();

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: 3,
          stroke: '#10B981',
          strokeDasharray: '8,4',
          filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))',
        }} 
      />
      
      {/* Hidden path element for calculations */}
      <path
        ref={pathRef}
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth="0"
        style={{ pointerEvents: 'none' }}
      />
      
      <EdgeLabelRenderer>
        {/* Trail dots following the path */}
        {trailPositions.map((trail, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${trail.position.x}px, ${trail.position.y}px)`,
              opacity: trail.opacity,
              pointerEvents: 'none',
              zIndex: 997 + index,
            }}
            className="nodrag nopan"
          >
            <div 
              className="w-1.5 h-1.5 bg-green-400 rounded-full"
              style={{
                boxShadow: `0 0 ${8 - index * 2}px rgba(34, 197, 94, ${0.8 - index * 0.1})`,
              }}
            />
          </div>
        ))}

        {/* Main animated lead following the exact path */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${animatedPos.x}px, ${animatedPos.y}px)`,
            fontSize: 12,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
          className="nodrag nopan"
        >
          <div className="relative">
            {/* Outer glow effect */}
            <div 
              className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-pulse"
              style={{ 
                width: '20px', 
                height: '20px', 
                marginLeft: '-4px', 
                marginTop: '-4px',
                filter: 'blur(4px)'
              }}
            />
            
            {/* Main animated lead with enhanced visual */}
            <div className="animated-lead relative w-3 h-3 bg-green-500 border-2 border-green-300 rounded-full shadow-lg">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
              {/* Core bright spot */}
              <div className="absolute inset-1 bg-green-200 rounded-full opacity-90" />
            </div>
          </div>
        </div>

        {/* Static Label "Lead" in the center with improved positioning */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            fontSize: 11,
            pointerEvents: 'none',
            zIndex: 999,
          }}
          className="nodrag nopan"
        >
          <div className="lead-label bg-gray-800/95 backdrop-blur-sm text-green-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-500/40 shadow-xl">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {data?.label || 'Lead'}
            </div>
          </div>
        </div>

        {/* Path direction indicator dots */}
        {[0.15, 0.35, 0.55, 0.75].map((position, index) => {
          const dotPos = getAnimatedPosition(position);
          const isActive = Math.abs(animationProgress - position) < 0.1;
          
          return (
            <div
              key={`indicator-${index}`}
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${dotPos.x}px, ${dotPos.y}px)`,
                opacity: isActive ? 0.8 : 0.3,
                pointerEvents: 'none',
                zIndex: 996,
                transition: 'opacity 0.3s ease',
              }}
              className="nodrag nopan"
            >
              <div 
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-green-300 shadow-lg scale-125' 
                    : 'bg-green-600'
                }`}
              />
            </div>
          );
        })}
      </EdgeLabelRenderer>
    </>
  );
}; 