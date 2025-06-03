import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeProps,
  MarkerType,
} from 'reactflow';

interface AnimatedSVGEdgeData {
  label?: string;
  color?: string;
  animated?: boolean;
}

export const AnimatedSVGEdge: React.FC<EdgeProps<AnimatedSVGEdgeData>> = ({
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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeColor = data?.color || '#10B981';
  const isAnimated = data?.animated !== false;

  return (
    <>
      {/* Glow effect layer */}
      <BaseEdge 
        path={edgePath} 
        style={{
          strokeWidth: 8,
          stroke: edgeColor,
          opacity: 0.3,
          filter: `drop-shadow(0 0 8px ${edgeColor})`,
          strokeLinecap: 'round',
        }} 
      />
      
      {/* Main edge */}
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd}
        style={{
          strokeWidth: 3,
          stroke: edgeColor,
          strokeLinecap: 'round',
          strokeDasharray: isAnimated ? '10,5' : 'none',
          animation: isAnimated ? 'neon-dash 2s linear infinite' : 'none',
          filter: `drop-shadow(0 0 4px ${edgeColor})`,
          ...style,
        }} 
      />
      
      {/* Animated particles */}
      {isAnimated && (
        <g>
          <circle
            r="3"
            fill={edgeColor}
            style={{
              filter: `drop-shadow(0 0 6px ${edgeColor})`,
            }}
          >
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>
          <circle
            r="2"
            fill="#ffffff"
            opacity="0.8"
          >
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={edgePath}
              begin="1s"
            />
          </circle>
        </g>
      )}
      
      {/* Edge label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
              zIndex: 1000,
            }}
            className="nodrag nopan"
          >
            <div className="bg-gray-800 text-white px-2 py-1 rounded-lg shadow-lg border border-gray-600">
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}; 