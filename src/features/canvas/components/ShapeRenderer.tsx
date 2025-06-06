import React from 'react';
import { DrawingShape } from '../../../types/drawing';

interface ShapeRendererProps {
  shape: DrawingShape;
  isSelected?: boolean;
  onSelect?: () => void;
  onDoubleClick?: () => void;
}

const createGradientId = (shape: DrawingShape) => `gradient-${shape.id}`;

const renderGradient = (shape: DrawingShape) => {
  const { gradient } = shape.style;
  if (!gradient) return null;

  const gradientId = createGradientId(shape);

  if (gradient.type === 'linear') {
    const angle = gradient.direction || 0;
    const radians = (angle * Math.PI) / 180;
    const x1 = 50 - 50 * Math.cos(radians);
    const y1 = 50 - 50 * Math.sin(radians);
    const x2 = 50 + 50 * Math.cos(radians);
    const y2 = 50 + 50 * Math.sin(radians);

    return (
      <defs>
        <linearGradient id={gradientId} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}>
          {gradient.colors.map((color, index) => (
            <stop
              key={index}
              offset={`${(index / (gradient.colors.length - 1)) * 100}%`}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>
    );
  }

  if (gradient.type === 'radial') {
    return (
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          {gradient.colors.map((color, index) => (
            <stop
              key={index}
              offset={`${(index / (gradient.colors.length - 1)) * 100}%`}
              stopColor={color}
            />
          ))}
        </radialGradient>
      </defs>
    );
  }

  return null;
};

const getShapeStyle = (shape: DrawingShape) => {
  const { style } = shape;
  const hasGradient = style.gradient && style.gradient.colors.length > 0;
  
  return {
    fill: hasGradient ? `url(#${createGradientId(shape)})` : style.fill || '#3B82F6',
    stroke: style.stroke || '#1E40AF',
    strokeWidth: style.strokeWidth || 2,
    opacity: style.opacity || 1,
    filter: style.shadow ? 'drop-shadow(2px 4px 8px rgba(0,0,0,0.3))' : undefined
  };
};

const renderRectangle = (shape: DrawingShape) => {
  const { position, size, style } = shape;
  const shapeStyle = getShapeStyle(shape);
  
  return (
    <rect
      x={0}
      y={0}
      width={size.width}
      height={size.height}
      rx={style.borderRadius || 0}
      ry={style.borderRadius || 0}
      {...shapeStyle}
    />
  );
};

const renderCircle = (shape: DrawingShape) => {
  const { size } = shape;
  const shapeStyle = getShapeStyle(shape);
  const radius = Math.min(size.width, size.height) / 2;
  
  return (
    <circle
      cx={size.width / 2}
      cy={size.height / 2}
      r={radius}
      {...shapeStyle}
    />
  );
};

const renderDiamond = (shape: DrawingShape) => {
  const { size } = shape;
  const shapeStyle = getShapeStyle(shape);
  const { width, height } = size;
  
  const points = [
    `${width / 2},0`,
    `${width},${height / 2}`,
    `${width / 2},${height}`,
    `0,${height / 2}`
  ].join(' ');
  
  return (
    <polygon
      points={points}
      {...shapeStyle}
    />
  );
};

const renderHexagon = (shape: DrawingShape) => {
  const { size } = shape;
  const shapeStyle = getShapeStyle(shape);
  const { width, height } = size;
  
  const points = [
    `${width * 0.25},0`,
    `${width * 0.75},0`,
    `${width},${height * 0.5}`,
    `${width * 0.75},${height}`,
    `${width * 0.25},${height}`,
    `0,${height * 0.5}`
  ].join(' ');
  
  return (
    <polygon
      points={points}
      {...shapeStyle}
    />
  );
};

const renderStar = (shape: DrawingShape) => {
  const { size } = shape;
  const shapeStyle = getShapeStyle(shape);
  const { width, height } = size;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 2;
  const innerRadius = outerRadius * 0.4;
  
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  
  return (
    <polygon
      points={points.join(' ')}
      {...shapeStyle}
    />
  );
};

const renderFunnel = (shape: DrawingShape) => {
  const { size } = shape;
  const shapeStyle = getShapeStyle(shape);
  const { width, height } = size;
  
  // Create a trapezoid shape for funnel
  const topWidth = width;
  const bottomWidth = width * 0.6;
  const offset = (topWidth - bottomWidth) / 2;
  
  const points = [
    `0,0`,
    `${topWidth},0`,
    `${topWidth - offset},${height}`,
    `${offset},${height}`
  ].join(' ');
  
  return (
    <polygon
      points={points}
      {...shapeStyle}
    />
  );
};

const renderArrow = (shape: DrawingShape) => {
  const { size } = shape;
  const shapeStyle = getShapeStyle(shape);
  const { width, height } = size;
  
  // Arrow pointing right
  const arrowHeight = height * 0.6;
  const arrowY = (height - arrowHeight) / 2;
  const bodyWidth = width * 0.7;
  const headWidth = width * 0.3;
  
  const points = [
    `0,${arrowY}`,
    `${bodyWidth},${arrowY}`,
    `${bodyWidth},0`,
    `${width},${height / 2}`,
    `${bodyWidth},${height}`,
    `${bodyWidth},${arrowY + arrowHeight}`,
    `0,${arrowY + arrowHeight}`
  ].join(' ');
  
  return (
    <polygon
      points={points}
      {...shapeStyle}
    />
  );
};

const renderLine = (shape: DrawingShape) => {
  const { size } = shape;
  const shapeStyle = getShapeStyle(shape);
  
  return (
    <line
      x1={0}
      y1={size.height / 2}
      x2={size.width}
      y2={size.height / 2}
      {...shapeStyle}
      fill="none"
    />
  );
};

const renderText = (shape: DrawingShape) => {
  const { size, text, textStyle } = shape;
  
  if (!text) return null;
  
  const getTextAnchor = (): 'start' | 'middle' | 'end' => {
    if (textStyle?.align === 'center') return 'middle';
    if (textStyle?.align === 'right') return 'end';
    return 'start';
  };
  
  const getDominantBaseline = (): 'auto' | 'text-bottom' | 'alphabetic' | 'ideographic' | 'middle' | 'central' | 'mathematical' | 'hanging' | 'text-top' => {
    if (textStyle?.verticalAlign === 'middle') return 'central';
    if (textStyle?.verticalAlign === 'bottom') return 'text-bottom';
    return 'hanging';
  };
  
  const style: React.CSSProperties = {
    fontSize: textStyle?.fontSize || 14,
    fontFamily: textStyle?.fontFamily || 'Inter, sans-serif',
    fontWeight: textStyle?.fontWeight || 'normal',
    fill: textStyle?.color || '#FFFFFF'
  };
  
  const x = textStyle?.align === 'center' ? size.width / 2 : textStyle?.align === 'right' ? size.width : 0;
  const y = textStyle?.verticalAlign === 'middle' ? size.height / 2 : textStyle?.verticalAlign === 'bottom' ? size.height : 0;
  
  return (
    <text 
      x={x} 
      y={y} 
      style={style}
      textAnchor={getTextAnchor()}
      dominantBaseline={getDominantBaseline()}
    >
      {text}
    </text>
  );
};

const renderShape = (shape: DrawingShape) => {
  switch (shape.type) {
    case 'rectangle':
      return renderRectangle(shape);
    case 'circle':
      return renderCircle(shape);
    case 'diamond':
      return renderDiamond(shape);
    case 'hexagon':
      return renderHexagon(shape);
    case 'star':
      return renderStar(shape);
    case 'funnel':
      return renderFunnel(shape);
    case 'arrow':
      return renderArrow(shape);
    case 'line':
      return renderLine(shape);
    default:
      return renderRectangle(shape);
  }
};

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  shape,
  isSelected = false,
  onSelect,
  onDoubleClick
}) => {
  const transform = `translate(${shape.position.x}, ${shape.position.y}) ${
    shape.rotation ? `rotate(${shape.rotation}, ${shape.size.width / 2}, ${shape.size.height / 2})` : ''
  }`;

  return (
    <g
      transform={transform}
      className={`cursor-pointer transition-all duration-200 ${
        isSelected ? 'drop-shadow-lg' : 'hover:drop-shadow-md'
      }`}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
    >
      {/* Selection highlight */}
      {isSelected && (
        <rect
          x={-4}
          y={-4}
          width={shape.size.width + 8}
          height={shape.size.height + 8}
          fill="none"
          stroke="#06B6D4"
          strokeWidth={2}
          strokeDasharray="4 4"
          opacity={0.8}
          rx={4}
        />
      )}
      
      {/* Gradient definitions */}
      {renderGradient(shape)}
      
      {/* Main shape */}
      {renderShape(shape)}
      
      {/* Text overlay */}
      {shape.text && shape.type !== 'text' && (
        <text
          x={shape.size.width / 2}
          y={shape.size.height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="pointer-events-none select-none"
          style={{
            fontSize: shape.textStyle?.fontSize || 14,
            fontFamily: shape.textStyle?.fontFamily || 'Inter, sans-serif',
            fontWeight: shape.textStyle?.fontWeight || 'bold',
            fill: shape.textStyle?.color || '#FFFFFF'
          }}
        >
          {shape.text}
        </text>
      )}
      
      {/* Text-only rendering */}
      {shape.type === 'text' && renderText(shape)}
      
      {/* Resize handles for selected shapes */}
      {isSelected && (
        <>
          {/* Corner handles */}
          {[
            { x: -4, y: -4, cursor: 'nw-resize' },
            { x: shape.size.width - 4, y: -4, cursor: 'ne-resize' },
            { x: shape.size.width - 4, y: shape.size.height - 4, cursor: 'se-resize' },
            { x: -4, y: shape.size.height - 4, cursor: 'sw-resize' }
          ].map((handle, index) => (
            <rect
              key={index}
              x={handle.x}
              y={handle.y}
              width={8}
              height={8}
              fill="#06B6D4"
              stroke="#FFFFFF"
              strokeWidth={1}
              className={`cursor-${handle.cursor}`}
              rx={1}
            />
          ))}
          
          {/* Side handles */}
          {[
            { x: shape.size.width / 2 - 4, y: -4, cursor: 'n-resize' },
            { x: shape.size.width - 4, y: shape.size.height / 2 - 4, cursor: 'e-resize' },
            { x: shape.size.width / 2 - 4, y: shape.size.height - 4, cursor: 's-resize' },
            { x: -4, y: shape.size.height / 2 - 4, cursor: 'w-resize' }
          ].map((handle, index) => (
            <rect
              key={`side-${index}`}
              x={handle.x}
              y={handle.y}
              width={8}
              height={8}
              fill="#10B981"
              stroke="#FFFFFF"
              strokeWidth={1}
              className={`cursor-${handle.cursor}`}
              rx={1}
            />
          ))}
        </>
      )}
    </g>
  );
}; 