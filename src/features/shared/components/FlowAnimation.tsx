import React from 'react';
import { motion } from 'framer-motion';
import { FunnelComponent, Connection } from '../../../types/funnel';

interface FlowAnimationProps {
  components: FunnelComponent[];
  connections: Connection[];
}

export const FlowAnimation: React.FC<FlowAnimationProps> = ({ components, connections }) => {
  const componentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const connectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 4 }}>
      {components.map((component) => (
        <motion.div
          key={component.id}
          className="absolute"
          style={{
            left: component.position.x + 5000,
            top: component.position.y + 5000,
          }}
          variants={componentVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Render your component content here */}
          <div className="bg-gray-700 rounded-lg p-3 text-white">
            {component.data.title}
          </div>
        </motion.div>
      ))}

      {connections.map((connection) => {
        const fromComponent = components.find(c => c.id === connection.from);
        const toComponent = components.find(c => c.id === connection.to);

        if (!fromComponent || !toComponent) {
          return null;
        }

        const x1 = fromComponent.position.x + 5000;
        const y1 = fromComponent.position.y + 5000;
        const x2 = toComponent.position.x + 5000;
        const y2 = toComponent.position.y + 5000;

        return (
          <motion.svg
            key={connection.id}
            className="absolute pointer-events-none"
            style={{
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
            }}
            variants={connectionVariants}
            initial="hidden"
            animate="visible"
          >
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth="2"
            />
          </motion.svg>
        );
      })}
    </div>
  );
};
