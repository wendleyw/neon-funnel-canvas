
import React from 'react';

interface ToolbarProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onClear: () => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onLoad,
  onExport,
  onClear,
  projectName,
  onProjectNameChange
}) => {
  return (
    <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Project Name"
        />
        <div className="text-gray-400 text-sm">
          Last saved: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          💾 Save
        </button>
        <button
          onClick={onLoad}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          📁 Load
        </button>
        <button
          onClick={onExport}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          📤 Export
        </button>
        <button
          onClick={onClear}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          🗑️ Clear
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <div className="text-gray-400 text-sm">
          Components: <span className="text-white font-medium">0</span>
        </div>
        <div className="text-gray-400 text-sm">
          Connections: <span className="text-white font-medium">0</span>
        </div>
        <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors">
          ⚙️
        </button>
      </div>
    </div>
  );
};
