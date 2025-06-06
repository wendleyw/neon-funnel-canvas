import React from 'react';

interface FunnelboardLogoProps {
  size?: number;
  className?: string;
  withHover?: boolean;
}

export const FunnelboardLogo: React.FC<FunnelboardLogoProps> = ({ 
  size = 32, 
  className = "",
  withHover = true
}) => {
  // CSS para as animações
  const styles = `
    .funnel-logo-container {
      transition: transform 0.3s ease;
    }

    .funnel-logo-container:hover {
      transform: ${withHover ? 'scale(1.15)' : 'none'};
    }

    .funnel-drop {
      animation: funnel-dropCycle 6s infinite ease-in-out;
      transform-origin: center;
    }

    .funnel-drop-delay-1 { animation-delay: 0.8s; }
    .funnel-drop-delay-2 { animation-delay: 1.6s; }
    .funnel-drop-delay-3 { animation-delay: 2.4s; }

    .funnel-glow {
      filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.3));
    }

    .funnel-logo-container:hover .funnel-drop {
      animation-duration: 3s;
    }

    @keyframes funnel-dropCycle {
      0%   { transform: translateY(-15px); opacity: 0; }
      20%  { transform: translateY(0); opacity: 1; }
      80%  { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(25px); opacity: 0; }
    }
  `;

  return (
    <div className={`relative funnel-logo-container ${className}`} style={{ width: size, height: size }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <svg 
        viewBox="0 0 200 180" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full funnel-glow"
      >
        {/* Definindo gradientes */}
        <defs>
          <linearGradient id="funnelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.85" />
          </linearGradient>
          
          <linearGradient id="dropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
        </defs>
        
        {/* Funil principal com contorno mais visível */}
        <path 
          d="M 50 25 
             L 150 25 
             Q 145 50 120 80 
             L 110 135 
             L 90 135 
             L 80 80 
             Q 55 50 50 25 
             Z"
          fill="url(#funnelGradient)" 
          stroke="#F1F5F9" 
          strokeWidth="3" 
          strokeLinejoin="round" 
        />

        {/* Quadrados animados com cores mais vibrantes */}
        <rect 
          className="funnel-drop" 
          x="60" 
          y="35" 
          width="10" 
          height="10" 
          fill="url(#dropGradient)" 
          stroke="#F59E0B"
          strokeWidth="1"
          rx="2"
        />
        <rect 
          className="funnel-drop funnel-drop-delay-1" 
          x="90" 
          y="35" 
          width="10" 
          height="10" 
          fill="url(#dropGradient)" 
          stroke="#F59E0B"
          strokeWidth="1"
          rx="2"
        />
        <rect 
          className="funnel-drop funnel-drop-delay-2" 
          x="120" 
          y="35" 
          width="10" 
          height="10" 
          fill="url(#dropGradient)" 
          stroke="#F59E0B"
          strokeWidth="1"
          rx="2"
        />
        <rect 
          className="funnel-drop funnel-drop-delay-3" 
          x="90" 
          y="55" 
          width="10" 
          height="10" 
          fill="url(#dropGradient)" 
          stroke="#F59E0B"
          strokeWidth="1"
          rx="2"
        />
      </svg>
    </div>
  );
}; 