
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Zap, Target, ArrowRight } from 'lucide-react';

const Index = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Analytics Avançado",
      description: "Acompanhe o desempenho dos seus funnels em tempo real"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Gestão de Leads",
      description: "Organize e nurture seus leads de forma eficiente"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Automação",
      description: "Automatize processos e aumente sua produtividade"
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Segmentação",
      description: "Crie campanhas direcionadas para diferentes públicos"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Bem-vindo ao FunnelCraft, {profile?.full_name?.split(' ')[0] || 'Usuário'}!
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Construa funnels de marketing que convertem e geram resultados
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Criar Novo Funnel
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate('/profile')}
              >
                Ver Meu Perfil
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ferramentas Poderosas para Seu Sucesso
            </h2>
            <p className="text-lg text-gray-600">
              Tudo que você precisa para criar, gerenciar e otimizar seus funnels de marketing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ações Rápidas
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Criar Funnel</CardTitle>
                <CardDescription>
                  Comece um novo funnel do zero ou use um template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Começar Agora
                </Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Ver Relatórios</CardTitle>
                <CardDescription>
                  Analise o desempenho dos seus funnels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Ver Analytics
                </Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Gerenciar Leads</CardTitle>
                <CardDescription>
                  Organize e acompanhe seus prospects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Ver Leads
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
