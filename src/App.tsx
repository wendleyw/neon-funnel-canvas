import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { NeonAnimationProvider } from './contexts/NeonAnimationContext';
import { SequenceAnimationProvider, useSequenceAnimation } from './contexts/SequenceAnimationContext';
import { DebugPanel } from './components/DebugPanel';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ReactFlowTest from './pages/ReactFlowTest';
import { AdminProvider } from './contexts/AdminContext';
import { initializeI18n } from './lib/i18n';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: 'always', // Only reconnect when connection is lost
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Wrapper component to connect contexts
const AppProviders: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminProvider>
          <WorkspaceProvider>
            <SequenceAnimationProvider>
              <NeonAnimationProvider>
                {children}
              </NeonAnimationProvider>
            </SequenceAnimationProvider>
          </WorkspaceProvider>
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// Componente wrapper para conectar os contextos
const AppWithContexts: React.FC = () => {
  const { disableSequenceMode } = useSequenceAnimation();

  return (
    <Router>
      <div className="h-screen w-screen bg-black text-white overflow-hidden">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reactflow-test" element={<ReactFlowTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors position="top-right" />
        <DebugPanel />
      </div>
    </Router>
  );
};

function App() {
  useEffect(() => {
    // Initialize i18n system
    initializeI18n();
  }, []);

  return (
    <AppProviders>
      <AppWithContexts />
    </AppProviders>
  );
}

export default App;
