
import React, { useState, useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { X, User, Mail, Building, FileText, Save } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, loading } = useProfile();
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        company: profile.company || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast.error('Erro ao atualizar perfil');
      } else {
        toast.success('Perfil atualizado com sucesso!');
        onClose();
      }
    } catch (error) {
      toast.error('Erro interno. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Perfil do Usuário</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-400">Carregando perfil...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded text-gray-400 cursor-not-allowed"
                disabled
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Nome completo"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
              />
            </div>

            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Empresa (opcional)"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
              />
            </div>

            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
              <textarea
                placeholder="Bio (opcional)"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-white text-black py-3 rounded hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
              
              <button
                type="button"
                onClick={handleSignOut}
                className="flex-1 bg-red-600 text-white py-3 rounded hover:bg-red-700 transition-colors font-medium"
              >
                Sair
              </button>
            </div>
          </form>
        )}

        {profile && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              <p>Membro desde: {new Date(profile.created_at).toLocaleDateString('pt-BR')}</p>
              {profile.role && <p>Função: {profile.role}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
