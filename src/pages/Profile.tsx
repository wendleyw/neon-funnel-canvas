
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Building, Edit3, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    company: profile?.company || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const { error } = await updateProfile(formData);
      
      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o perfil",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sucesso!",
          description: "Perfil atualizado com sucesso"
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      company: profile?.company || ''
    });
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso"
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Carregando perfil...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                <AvatarFallback className="text-lg">
                  {getInitials(profile.full_name || profile.email)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">
              {profile.full_name || 'Usuário'}
            </CardTitle>
            <CardDescription className="text-base">
              {profile.email}
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="full_name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="company">Empresa</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Sua empresa"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                />
              </div>
            </div>
            
            <div className="pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Informações da Conta</h4>
                  <p className="text-sm text-gray-600">
                    Membro desde: {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Função: {profile.role}
                  </p>
                </div>
                <Button onClick={handleSignOut} variant="destructive">
                  Sair da Conta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
