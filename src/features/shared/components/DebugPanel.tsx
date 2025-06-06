import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useWorkspaceContext } from '../../../contexts/WorkspaceContext';
import { Bug, X, RefreshCw } from 'lucide-react';

export const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { 
    workspaces, 
    currentWorkspace, 
    loading: workspaceLoading,
    cacheStats,
    refreshProjects 
  } = useWorkspaceContext();

  if (process.env.NODE_ENV === 'production') {
    return null; // Não mostrar em produção
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors"
        title="Debug Panel"
      >
        <Bug size={20} />
      </button>

      {/* Modal do debug */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold text-purple-400">Debug Panel</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-4 space-y-4">
              {/* Estado de Autenticação */}
              <div className="bg-gray-800 p-3 rounded">
                <h3 className="font-semibold text-blue-400 mb-2">Autenticação</h3>
                <div className="space-y-1 text-sm">
                  <div>Status: {authLoading ? '🔄 Carregando' : user ? '✅ Logado' : '❌ Não logado'}</div>
                  <div>User ID: {user?.id || 'N/A'}</div>
                  <div>Email: {user?.email || 'N/A'}</div>
                </div>
              </div>

              {/* Estado dos Workspaces */}
              <div className="bg-gray-800 p-3 rounded">
                <h3 className="font-semibold text-green-400 mb-2">Workspaces</h3>
                <div className="space-y-1 text-sm">
                  <div>Loading: {workspaceLoading ? '🔄 Sim' : '✅ Não'}</div>
                  <div>Total: {workspaces.length}</div>
                  <div>Atual: {currentWorkspace?.name || 'Nenhum'}</div>
                  <div>
                    Lista: {workspaces.map(w => w.name).join(', ') || 'Vazio'}
                  </div>
                </div>
              </div>

              {/* Cache Stats */}
              {cacheStats && (
                <div className="bg-gray-800 p-3 rounded">
                  <h3 className="font-semibold text-yellow-400 mb-2">Cache</h3>
                  <div className="space-y-1 text-sm">
                    <div>Cache Size: {cacheStats.cacheSize || 0}</div>
                    <div>Last Fetch: {cacheStats.lastFetch || 'N/A'}</div>
                    <div>Cache Age: {cacheStats.cacheAge || 0}ms</div>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="bg-gray-800 p-3 rounded">
                <h3 className="font-semibold text-red-400 mb-2">Ações</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    <RefreshCw size={14} />
                    Recarregar Página
                  </button>
                  
                  <button
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.reload();
                    }}
                    className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    <X size={14} />
                    Limpar Cache e Recarregar
                  </button>

                  {refreshProjects && (
                    <button
                      onClick={() => refreshProjects()}
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                    >
                      <RefreshCw size={14} />
                      Refresh Projects
                    </button>
                  )}
                </div>
              </div>

              {/* Informações do Sistema */}
              <div className="bg-gray-800 p-3 rounded">
                <h3 className="font-semibold text-cyan-400 mb-2">Sistema</h3>
                <div className="space-y-1 text-sm">
                  <div>URL: {window.location.href}</div>
                  <div>User Agent: {navigator.userAgent}</div>
                  <div>Timestamp: {new Date().toISOString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 