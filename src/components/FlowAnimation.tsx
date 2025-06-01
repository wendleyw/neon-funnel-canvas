
import React, { useEffect, useState } from 'react';
import { FunnelComponent, Connection } from '../types/funnel';

interface FlowAnimationProps {
  components: FunnelComponent[];
  connections: Connection[];
}

interface FlowParticle {
  id: string;
  connectionId: string;
  progress: number;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
}

export const FlowAnimation: React.FC<FlowAnimationProps> = ({
  components,
  connections
}) => {
  const [particles, setParticles] = useState<FlowParticle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Adiciona novas partículas para cada conexão
      const newParticles = connections.map(connection => {
        const fromComponent = components.find(c => c.id === connection.from);
        const toComponent = components.find(c => c.id === connection.to);
        
        if (!fromComponent || !toComponent) return null;
        
        return {
          id: `particle-${connection.id}-${Date.now()}`,
          connectionId: connection.id,
          progress: 0,
          startPos: {
            x: fromComponent.position.x + 192, // Width do componente + offset
            y: fromComponent.position.y + 40   // Meio do componente
          },
          endPos: {
            x: toComponent.position.x,
            y: toComponent.position.y + 40
          }
        };
      }).filter(Boolean) as FlowParticle[];

      setParticles(prev => [
        ...prev.filter(p => p.progress < 1), // Remove partículas que chegaram ao destino
        ...newParticles
      ]);
    }, 2000); // Nova partícula a cada 2 segundos

    return () => clearInterval(interval);
  }, [connections, components]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          progress: Math.min(particle.progress + 0.02, 1) // Velocidade da animação
        }))
      );
    }, 50); // 60 FPS

    return () => clearInterval(animationInterval);
  }, []);

  const getParticlePosition = (particle: FlowParticle) => {
    const { startPos, endPos, progress } = particle;
    
    // Interpolação suave (ease-in-out)
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    return {
      x: startPos.x + (endPos.x - startPos.x) * easeProgress,
      y: startPos.y + (endPos.y - startPos.y) * easeProgress
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {particles.map(particle => {
        const pos = getParticlePosition(particle);
        const connection = connections.find(c => c.id === particle.connectionId);
        
        const getParticleColor = () => {
          switch (connection?.type) {
            case 'success': return 'bg-green-400';
            case 'failure': return 'bg-red-400';
            case 'conditional': return 'bg-yellow-400';
            default: return 'bg-blue-400';
          }
        };

        return (
          <div
            key={particle.id}
            className={`absolute w-3 h-3 rounded-full ${getParticleColor()} opacity-80 shadow-lg transition-all duration-100`}
            style={{
              left: pos.x - 6,
              top: pos.y - 6,
              transform: `scale(${1 + Math.sin(particle.progress * Math.PI) * 0.3})`,
              boxShadow: `0 0 8px ${connection?.type === 'success' ? '#10B981' : '#3B82F6'}`
            }}
          />
        );
      })}
    </div>
  );
};
