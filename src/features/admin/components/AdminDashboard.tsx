import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '@/features/shared/components/ErrorBoundary';
import { 
  BarChart3, 
  Users, 
  Settings, 
  MessageSquare, 
  Plus, 
  Search,
  Filter,
  Download,
  Upload,
  Edit3,
  Trash2,
  Eye,
  Globe,
  FileText,
  Zap,
  UserPlus,
  HelpCircle,
  TrendingUp,
  Activity,
  Shield,
  Database
} from 'lucide-react';
import { StreamlinedContentCRUD } from './StreamlinedContentCRUD';
import { OnboardingQuizPreview } from './OnboardingQuiz';
// Import Supabase services
import { 
  contentService, 
  userService, 
  feedbackService, 
  analyticsService 
} from '../../../lib/supabase-admin';

type AdminTab = 'dashboard' | 'content' | 'users' | 'feedback' | 'onboarding' | 'analytics' | 'settings';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  pendingFeedback: number;
  completionRate: number;
}

interface ContentItem {
  id: string;
  type: 'source' | 'page' | 'action';
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  usage: number;
  createdAt: string;
  updatedAt: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'premium';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
  funnelsCreated: number;
}

interface FeedbackItem {
  id: string;
  userName: string;
  userEmail: string;
  category: 'bug' | 'feature' | 'improvement' | 'other';
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalContent: 0,
    pendingFeedback: 0,
    completionRate: 0
  });

  // Mock data for demonstration
  const [contentItems] = useState<ContentItem[]>([]);
  const [users] = useState<AdminUser[]>([]);
  const [feedback] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Load dashboard statistics from Supabase
      const stats = await analyticsService.getDashboardStats();
      
      if (stats) {
        setDashboardStats({
          totalUsers: stats.users?.total || 0,
          activeUsers: stats.users?.active || 0,
          totalContent: stats.content?.totalItems || 0,
          pendingFeedback: stats.feedback?.pending || 0,
          completionRate: 85 // Mock completion rate
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      description: 'Overview and analytics' 
    },
    { 
      id: 'content', 
      label: 'Content Management', 
      icon: Database, 
      description: 'Manage templates and components with sync' 
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users, 
      description: 'Manage user accounts and permissions' 
    },
    { 
      id: 'feedback', 
      label: 'Feedback', 
      icon: MessageSquare, 
      description: 'User feedback and support tickets' 
    },
    { 
      id: 'onboarding', 
      label: 'Onboarding', 
      icon: UserPlus, 
      description: 'User onboarding flow and analytics' 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: TrendingUp, 
      description: 'Detailed system analytics' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      description: 'System configuration' 
    }
  ];

  const renderTabContent = (): JSX.Element => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview stats={dashboardStats} isLoading={isLoading} />;
      case 'content':
        return <StreamlinedContentCRUD />;
      case 'users':
        return <UserManagement users={users} />;
      case 'feedback':
        return <FeedbackManagement feedback={feedback} />;
      case 'onboarding':
        return <OnboardingQuizPreview />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardOverview stats={dashboardStats} isLoading={isLoading} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="bg-gray-950 content-management-container">
        {/* Header */}
        <div className="bg-black border-b border-gray-800">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-500" />
                  Admin Dashboard
                </h1>
                <p className="text-gray-400 mt-1">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Activity className="w-4 h-4 text-green-500" />
                  System Operational
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-0">
          {/* Sidebar */}
          <div className="w-64 bg-black border-r border-gray-800">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto content-grid-container">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Dashboard Overview Component
const DashboardOverview: React.FC<{ 
  stats: DashboardStats; 
  isLoading: boolean; 
}> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
          change="+12%"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          color="green"
          change="+8%"
        />
        <StatCard
          title="Content Items"
          value={stats.totalContent}
          icon={Database}
          color="purple"
          change="+24%"
        />
        <StatCard
          title="Pending Feedback"
          value={stats.pendingFeedback}
          icon={MessageSquare}
          color="orange"
          change="-3%"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-black border border-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Sync Templates"
            description="Import and synchronize system templates"
            icon={Database}
            action="Sync Now"
            color="green"
          />
          <QuickActionCard
            title="Export Data"
            description="Download system data and analytics"
            icon={Download}
            action="Export"
            color="blue"
          />
          <QuickActionCard
            title="System Health"
            description="Check system status and performance"
            icon={Shield}
            action="Check"
            color="purple"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-black border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <ActivityItem
            action="New user registered"
            user="john.doe@example.com"
            time="2 minutes ago"
            type="user"
          />
          <ActivityItem
            action="Template synced"
            user="System"
            time="5 minutes ago"
            type="system"
          />
          <ActivityItem
            action="Feedback submitted"
            user="jane.smith@example.com"
            time="10 minutes ago"
            type="feedback"
          />
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change: string;
}> = ({ title, value, icon: Icon, color, change }) => {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    orange: 'text-orange-400 bg-orange-500/10'
  };

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${
          change.startsWith('+') ? 'text-green-400' : 'text-red-400'
        }`}>
          {change}
        </span>
        <span className="text-gray-500 text-sm ml-2">from last month</span>
      </div>
    </div>
  );
};

// Quick Action Card Component
const QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
  color: string;
}> = ({ title, description, icon: Icon, action, color }) => {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700'
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-6 h-6 text-gray-300" />
        <h3 className="font-medium text-white">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <button className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
        colorClasses[color as keyof typeof colorClasses]
      }`}>
        {action}
      </button>
    </div>
  );
};

// Activity Item Component
const ActivityItem: React.FC<{
  action: string;
  user: string;
  time: string;
  type: string;
}> = ({ action, user, time, type }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return UserPlus;
      case 'system': return Settings;
      case 'feedback': return MessageSquare;
      default: return Activity;
    }
  };

  const Icon = getTypeIcon(type);

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
      <div className="p-2 bg-gray-800 rounded-lg">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{action}</p>
        <p className="text-gray-400 text-xs">{user}</p>
      </div>
      <span className="text-gray-500 text-xs">{time}</span>
    </div>
  );
};

// Placeholder components for other tabs
const UserManagement: React.FC<{ users: AdminUser[] }> = () => (
  <div className="p-6">
    <div className="bg-black border border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
      <p className="text-gray-400">User management functionality will be implemented here.</p>
    </div>
  </div>
);

const FeedbackManagement: React.FC<{ feedback: FeedbackItem[] }> = () => (
  <div className="p-6">
    <div className="bg-black border border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Feedback Management</h2>
      <p className="text-gray-400">Feedback management functionality will be implemented here.</p>
    </div>
  </div>
);

const AnalyticsView: React.FC = () => (
  <div className="p-6">
    <div className="bg-black border border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Analytics</h2>
      <p className="text-gray-400">Detailed analytics will be displayed here.</p>
    </div>
  </div>
);

const SystemSettings: React.FC = () => (
  <div className="p-6">
    <div className="bg-black border border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">System Settings</h2>
      <p className="text-gray-400">System configuration options will be available here.</p>
    </div>
  </div>
); 