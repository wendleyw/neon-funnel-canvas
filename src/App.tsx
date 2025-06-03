import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { NeonAnimationProvider } from './contexts/NeonAnimationContext';
import { SequenceAnimationProvider, useSequenceAnimation } from './contexts/SequenceAnimationContext';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Componente wrapper para conectar os contextos
const AppWithContexts: React.FC = () => {
  const { disableSequenceMode } = useSequenceAnimation();

  return (
    <NeonAnimationProvider onSequenceDisable={disableSequenceMode}>
      <Router>
        <div className="h-screen w-screen bg-black text-white overflow-hidden">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster richColors position="top-right" />
        </div>
      </Router>
    </NeonAnimationProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SequenceAnimationProvider>
          <AppWithContexts />
        </SequenceAnimationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
