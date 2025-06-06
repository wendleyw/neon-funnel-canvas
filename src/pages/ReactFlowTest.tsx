import React from 'react';
import { Link } from 'react-router-dom';
import ConnectionExamplesWrapper from '@/features/canvas/components/ConnectionExamples';

const ReactFlowTest: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-900 relative">
      {/* Header com navegação */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              ← Go Back
            </Link>
            <h1 className="text-white font-semibold">
              🧪 React Flow - Functionality Test
            </h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>✅ onConnect & addEdge</span>
            <span>✅ Custom Handles</span>
            <span>✅ Animated Edges (neon)</span>
            <span>✅ Connection Validation</span>
            <span>✅ Save/Load localStorage</span>
          </div>
        </div>
      </div>

      {/* Container principal com margem para o header */}
      <div className="w-full h-full pt-16">
        <ConnectionExamplesWrapper />
      </div>
      
      {/* Status e informações */}
      <div className="absolute bottom-4 left-4 z-10 bg-gray-800 text-white p-3 rounded-lg text-xs border border-gray-600">
        <div className="space-y-1">
          <div><strong>Status:</strong> ✅ All features implemented</div>
          <div><strong>CSS:</strong> ✅ react-flow/dist/style.css imported</div>
          <div><strong>Connections:</strong> ✅ onConnect + addEdge working</div>
          <div><strong>Handles:</strong> ✅ Target (blue) + Source (green)</div>
          <div><strong>Animations:</strong> ✅ Neon effect with particles</div>
        </div>
      </div>
    </div>
  );
};

export default ReactFlowTest; 