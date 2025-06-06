import React from 'react';
import { createPortal } from 'react-dom';

interface EditorModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  isMaximized?: boolean; // Optional, as not all modals might be maximizable
  modalClassName?: string;
  children: React.ReactNode;
  portalId?: string;
}

export const EditorModalBase: React.FC<EditorModalBaseProps> = ({
  isOpen,
  onClose,
  isMaximized = false, // Default to not maximized
  modalClassName = '',
  children,
  portalId = 'modal-root',
}) => {
  if (!isOpen) {
    return null;
  }

  const defaultModalClasses = `relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl backdrop-blur-md transition-all duration-300 ${
    isMaximized 
      ? 'w-[98vw] h-[98vh]' 
      : 'w-full max-w-3xl h-[90vh] max-h-[800px]'
  } flex flex-col`;

  const combinedModalClassName = `${defaultModalClasses} ${modalClassName}`.trim();

  const modalContent = (
    <div 
      className="component-editor-portal editor-modal-base-portal"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999998, // Ensure it's high, but allow specific modals to go higher if needed
        pointerEvents: 'auto',
      }}
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-lg transition-all duration-300"
        style={{ 
          zIndex: 999999, // Higher than the modal content wrapper, but lower than the modal itself
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      
      {/* Modal positioning container */}
      <div
        className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 lg:p-8"
        style={{ 
          zIndex: 1000000, // Ensures modal is on top
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none', // Allows clicks to pass through to the backdrop unless stopped by the modal itself
        }}
        onClick={(e) => {
          // Only close if the click is on the positioning container itself, not on its children (the modal)
          if (e.target === e.currentTarget) {
            e.stopPropagation();
            onClose();
          }
        }}
      >
        {/* Actual Modal container */}
        <div 
          className={combinedModalClassName}
          style={{ 
            pointerEvents: 'auto', // Re-enable pointer events for the modal content
            position: 'relative',
            zIndex: 1000001, // Ensure modal content is above its own positioning container's z-index if backdrop is part of it
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent clicks inside the modal from closing it via the positioning container
          }}
        >
          {/* Neon border effects - these are specific to the Funnel Board style, could be optional props too */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-70 blur-xl animate-pulse pointer-events-none" />
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pointer-events-none" />
          
          {/* Modal children content (e.g., header, form, footer) */}
          <div className="relative z-10 flex flex-col h-full min-h-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  const portalElement = document.getElementById(portalId);
  if (!portalElement) {
    console.error(`EditorModalBase: Portal root element with ID '${portalId}' not found in the DOM.`);
    return null; // Or render inline if portal fails, though usually indicates a setup issue
  }

  return createPortal(modalContent, portalElement);
}; 