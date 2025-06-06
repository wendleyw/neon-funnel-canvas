import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '@/features/shared/components/ErrorBoundary';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  User, 
  Briefcase, 
  Target, 
  Palette, 
  Rocket,
  HelpCircle,
  Building,
  Users,
  TrendingUp,
  MessageSquare,
  Heart,
  Star
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  type: 'single' | 'multiple' | 'text' | 'scale' | 'select';
  category: 'profile' | 'business' | 'goals' | 'preferences' | 'experience';
  question: string;
  description?: string;
  options?: string[];
  required: boolean;
  icon?: any;
}

interface QuizAnswer {
  questionId: string;
  value: string | string[] | number;
}

interface OnboardingData {
  personalInfo: {
    name: string;
    role: string;
    company?: string;
    industry: string;
  };
  businessInfo: {
    businessType: string;
    teamSize: string;
    monthlyVisitors: string;
    currentTools: string[];
  };
  goals: {
    primaryGoal: string;
    timeline: string;
    successMetrics: string[];
  };
  preferences: {
    designStyle: string;
    complexity: number;
    focusAreas: string[];
  };
  experience: {
    funnelExperience: string;
    marketingExperience: number;
    techComfort: number;
  };
}

const quizQuestions: QuizQuestion[] = [
  // Personal Info
  {
    id: 'name',
    type: 'text',
    category: 'profile',
    question: 'Qual é o seu nome?',
    description: 'Como gostaria de ser chamado na plataforma?',
    required: true,
    icon: User
  },
  {
    id: 'role',
    type: 'select',
    category: 'profile',
    question: 'Qual é a sua função principal?',
    options: [
      'Empreendedor/Founder',
      'Marketing Manager',
      'Growth Hacker',
      'Designer',
      'Desenvolvedor',
      'Consultor',
      'Freelancer',
      'Estudante',
      'Outro'
    ],
    required: true,
    icon: Briefcase
  },
  {
    id: 'industry',
    type: 'select',
    category: 'profile',
    question: 'Em qual área você atua?',
    options: [
      'E-commerce',
      'SaaS/Software',
      'Educação Online',
      'Saúde e Fitness',
      'Consultoria',
      'Agência de Marketing',
      'Imobiliário',
      'Finanças',
      'Alimentação',
      'Moda e Beleza',
      'B2B Services',
      'Outro'
    ],
    required: true,
    icon: Building
  },

  // Business Info
  {
    id: 'businessType',
    type: 'single',
    category: 'business',
    question: 'Que tipo de negócio você tem?',
    options: [
      'Produto físico',
      'Produto digital',
      'Serviços',
      'Curso online',
      'SaaS/Software',
      'Consultoria',
      'Ainda estou validando a ideia'
    ],
    required: true,
    icon: Rocket
  },
  {
    id: 'teamSize',
    type: 'single',
    category: 'business',
    question: 'Qual o tamanho da sua equipe?',
    options: [
      'Só eu',
      '2-5 pessoas',
      '6-15 pessoas',
      '16-50 pessoas',
      '51+ pessoas'
    ],
    required: true,
    icon: Users
  },
  {
    id: 'monthlyVisitors',
    type: 'single',
    category: 'business',
    question: 'Quantos visitantes únicos você recebe por mês?',
    options: [
      'Menos de 1.000',
      '1.000 - 5.000',
      '5.000 - 20.000',
      '20.000 - 100.000',
      '100.000+'
    ],
    required: true,
    icon: TrendingUp
  },

  // Goals
  {
    id: 'primaryGoal',
    type: 'single',
    category: 'goals',
    question: 'Qual é o seu principal objetivo com funnels?',
    options: [
      'Gerar mais leads qualificados',
      'Aumentar vendas online',
      'Construir lista de email',
      'Educar minha audiência',
      'Lançar um produto/serviço',
      'Automatizar processos de vendas',
      'Melhorar taxa de conversão'
    ],
    required: true,
    icon: Target
  },
  {
    id: 'timeline',
    type: 'single',
    category: 'goals',
    question: 'Em quanto tempo quer ver resultados?',
    options: [
      'Próximas 2 semanas',
      '1-3 meses',
      '3-6 meses',
      '6+ meses',
      'Sem pressa, quero aprender'
    ],
    required: true
  },
  {
    id: 'successMetrics',
    type: 'multiple',
    category: 'goals',
    question: 'Como você mede sucesso? (múltipla escolha)',
    options: [
      'Número de leads',
      'Taxa de conversão',
      'Receita gerada',
      'Engajamento da audiência',
      'Crescimento da lista',
      'ROI do marketing',
      'Tempo economizado'
    ],
    required: true
  },

  // Preferences
  {
    id: 'designStyle',
    type: 'single',
    category: 'preferences',
    question: 'Que estilo de design você prefere?',
    options: [
      'Minimalista e clean',
      'Moderno e vibrante',
      'Profissional e corporativo',
      'Criativo e diferente',
      'Simples e direto'
    ],
    required: true,
    icon: Palette
  },
  {
    id: 'complexity',
    type: 'scale',
    category: 'preferences',
    question: 'Prefere funcionalidades simples ou avançadas?',
    description: '1 = Bem simples | 5 = Bem avançado',
    required: true
  },
  {
    id: 'focusAreas',
    type: 'multiple',
    category: 'preferences',
    question: 'Em que áreas quer focar? (múltipla escolha)',
    options: [
      'Landing pages',
      'Email marketing',
      'Checkout/vendas',
      'Lead magnets',
      'Webinars',
      'Cursos online',
      'E-commerce',
      'B2B/corporativo'
    ],
    required: true
  },

  // Experience
  {
    id: 'funnelExperience',
    type: 'single',
    category: 'experience',
    question: 'Qual sua experiência com funnels?',
    options: [
      'Nunca criei um funnel',
      'Já tentei, mas não deu certo',
      'Tenho alguns funnels básicos',
      'Sou experiente com funnels',
      'Sou expert em funnels'
    ],
    required: true,
    icon: HelpCircle
  },
  {
    id: 'marketingExperience',
    type: 'scale',
    category: 'experience',
    question: 'Como você avalia sua experiência em marketing digital?',
    description: '1 = Iniciante | 5 = Expert',
    required: true
  },
  {
    id: 'techComfort',
    type: 'scale',
    category: 'experience',
    question: 'Como é seu conforto com tecnologia?',
    description: '1 = Prefiro o básico | 5 = Adoro tecnologia',
    required: true
  }
];

export const OnboardingQuiz: React.FC<{
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
}> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleting, setIsCompleting] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;
  const categorySteps = getCategorySteps();

  function getCategorySteps() {
    const categories = ['profile', 'business', 'goals', 'preferences', 'experience'];
    return categories.map(category => ({
      name: category,
      label: getCategoryLabel(category),
      questions: quizQuestions.filter(q => q.category === category),
      icon: getCategoryIcon(category)
    }));
  }

  function getCategoryLabel(category: string) {
    const labels = {
      profile: 'Perfil',
      business: 'Negócio',
      goals: 'Objetivos',
      preferences: 'Preferências',
      experience: 'Experiência'
    };
    return labels[category as keyof typeof labels];
  }

  function getCategoryIcon(category: string) {
    const icons = {
      profile: User,
      business: Building,
      goals: Target,
      preferences: Palette,
      experience: Star
    };
    return icons[category as keyof typeof icons];
  }

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Process answers into structured data
    const processedData: OnboardingData = {
      personalInfo: {
        name: answers.name || '',
        role: answers.role || '',
        company: answers.company || '',
        industry: answers.industry || ''
      },
      businessInfo: {
        businessType: answers.businessType || '',
        teamSize: answers.teamSize || '',
        monthlyVisitors: answers.monthlyVisitors || '',
        currentTools: answers.currentTools || []
      },
      goals: {
        primaryGoal: answers.primaryGoal || '',
        timeline: answers.timeline || '',
        successMetrics: answers.successMetrics || []
      },
      preferences: {
        designStyle: answers.designStyle || '',
        complexity: answers.complexity || 3,
        focusAreas: answers.focusAreas || []
      },
      experience: {
        funnelExperience: answers.funnelExperience || '',
        marketingExperience: answers.marketingExperience || 3,
        techComfort: answers.techComfort || 3
      }
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(processedData);
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    const answer = answers[currentQuestion.id];
    
    if (currentQuestion.type === 'multiple') {
      return answer && answer.length > 0;
    }
    
    return answer !== undefined && answer !== '';
  };

  const renderQuestion = () => {
    const answer = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answer || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Digite sua resposta..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-lg"
            autoFocus
          />
        );

      case 'select':
        return (
          <select
            value={answer || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-lg"
          >
            <option value="">Selecione uma opção...</option>
            {currentQuestion.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'single':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                  answer === option
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-700 bg-gray-900/50 text-gray-300 hover:border-gray-600 hover:bg-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {answer === option && (
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'multiple':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <button
                key={option}
                onClick={() => {
                  const currentAnswers = answer || [];
                  const newAnswers = currentAnswers.includes(option)
                    ? currentAnswers.filter((a: string) => a !== option)
                    : [...currentAnswers, option];
                  handleAnswer(newAnswers);
                }}
                className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                  answer?.includes(option)
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-700 bg-gray-900/50 text-gray-300 hover:border-gray-600 hover:bg-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {answer?.includes(option) && (
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-lg font-semibold transition-all duration-200 ${
                    answer === value
                      ? 'border-blue-500 bg-blue-500 text-white scale-110'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            {currentQuestion.description && (
              <p className="text-gray-400 text-center text-sm">
                {currentQuestion.description}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Processando suas respostas...
          </h2>
          <p className="text-gray-400">
            Estamos personalizando sua experiência com base no que você nos contou.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <div className="bg-black border-b border-gray-800 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">
                Bem-vindo ao Funnelboard! 🚀
              </h1>
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pular quiz
                </button>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Questão {currentStep + 1} de {quizQuestions.length}</span>
              <span>{Math.round(progress)}% completo</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Progress */}
            <div className="lg:col-span-1">
              <div className="bg-black rounded-lg border border-gray-800 p-4 sticky top-6">
                <h3 className="text-white font-semibold mb-4">Progresso</h3>
                <div className="space-y-3">
                  {categorySteps.map((category, index) => {
                    const categoryQuestions = category.questions;
                    const completedInCategory = categoryQuestions.filter(
                      q => answers[q.id] !== undefined
                    ).length;
                    const isCurrentCategory = categoryQuestions.some(
                      q => q.id === currentQuestion.id
                    );
                    
                    return (
                      <div
                        key={category.name}
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          isCurrentCategory ? 'bg-blue-500/10 border border-blue-500/20' : ''
                        }`}
                      >
                        <category.icon className={`w-5 h-5 ${
                          completedInCategory === categoryQuestions.length
                            ? 'text-green-400'
                            : isCurrentCategory
                              ? 'text-blue-400'
                              : 'text-gray-500'
                        }`} />
                        <div className="flex-1">
                          <div className="text-sm text-white font-medium">
                            {category.label}
                          </div>
                          <div className="text-xs text-gray-400">
                            {completedInCategory}/{categoryQuestions.length}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="lg:col-span-3">
              <div className="bg-black rounded-lg border border-gray-800 p-8">
                <div className="mb-8">
                  {currentQuestion.icon && (
                    <currentQuestion.icon className="w-8 h-8 text-blue-400 mb-4" />
                  )}
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {currentQuestion.question}
                  </h2>
                  {currentQuestion.description && (
                    <p className="text-gray-400">
                      {currentQuestion.description}
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  {renderQuestion()}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Pressione</span>
                    <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-xs">
                      Enter
                    </kbd>
                    <span>para continuar</span>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentStep === quizQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Preview component for admin
export const OnboardingQuizPreview: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);

  if (showPreview) {
    return (
      <OnboardingQuiz
        onComplete={(data) => {
          console.log('Quiz completed:', data);
          setShowPreview(false);
        }}
        onSkip={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="bg-black rounded-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Quiz de Onboarding
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {['Perfil', 'Negócio', 'Objetivos', 'Preferências', 'Experiência'].map((category, index) => (
            <div key={category} className="bg-gray-900/50 rounded-lg p-4 text-center">
              <h4 className="text-white font-medium mb-2">{category}</h4>
              <p className="text-gray-400 text-sm">
                {[3, 3, 3, 3, 3][index]} questões
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowPreview(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Preview Quiz
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
            Edit Questions
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}; 