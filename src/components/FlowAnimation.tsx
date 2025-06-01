
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

  const getParticleOpacity = (progress: number) => {
    // Gradiente de transparência: aparece no início, some no final
    if (progress < 0.1) {
      return progress * 10; // Aparece gradualmente
    } else if (progress > 0.9) {
      return (1 - progress) * 10; // Some gradualmente
    }
    return 1; // Totalmente visível no meio
  };

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {particles.map(particle => {
        const pos = getParticlePosition(particle);
        const connection = connections.find(c => c.id === particle.connectionId);
        const opacity = getParticleOpacity(particle.progress);
        
        const getParticleColor = () => {
          switch (connection?.type) {
            case 'success': return '#10B981';
            case 'failure': return '#EF4444';
            case 'conditional': return '#F59E0B';
            default: return '#3B82F6';
          }
        };

        const color = getParticleColor();

        return (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full transition-all duration-100"
            style={{
              left: pos.x - 4,
              top: pos.y - 4,
              backgroundColor: color,
              opacity: opacity,
              transform: `scale(${1 + Math.sin(particle.progress * Math.PI) * 0.2})`,
              boxShadow: `0 0 6px ${color}`,
              filter: `drop-shadow(0 0 4px ${color})`
            }}
          />
        );
      })}
    </div>
  );
};
