
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Zap } from 'lucide-react';
import { LaunchMetrics } from '../../../types/launch';

interface MetricsDashboardProps {
  metrics: LaunchMetrics;
  period?: 'day' | 'week' | 'month' | 'quarter';
  comparison?: LaunchMetrics; // Para mostrar variação em relação ao período anterior
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  period = 'month',
  comparison
}) => {
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    formatter = formatNumber,
    change,
    color = 'blue'
  }: {
    title: string;
    value: number;
    icon: any;
    formatter?: (value: number) => string;
    change?: number;
    color?: string;
  }) => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50',
      red: 'text-red-600 bg-red-50'
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatter(value)}
              </p>
              {change !== undefined && (
                <div className="flex items-center mt-2">
                  {change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(change).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard de Métricas</h2>
        <div className="text-sm text-gray-500">
          Período: {period === 'day' ? 'Hoje' : period === 'week' ? 'Esta semana' : period === 'month' ? 'Este mês' : 'Este trimestre'}
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Leads"
          value={metrics.totalLeads}
          icon={Users}
          color="blue"
          change={comparison ? calculateChange(metrics.totalLeads, comparison.totalLeads) : undefined}
        />
        
        <MetricCard
          title="Total de Vendas"
          value={metrics.totalSales}
          icon={Target}
          color="green"
          change={comparison ? calculateChange(metrics.totalSales, comparison.totalSales) : undefined}
        />
        
        <MetricCard
          title="Receita Total"
          value={metrics.totalRevenue}
          icon={DollarSign}
          formatter={formatCurrency}
          color="purple"
          change={comparison ? calculateChange(metrics.totalRevenue, comparison.totalRevenue) : undefined}
        />
        
        <MetricCard
          title="Taxa de Conversão"
          value={metrics.conversionRate}
          icon={Zap}
          formatter={(value) => `${value.toFixed(2)}%`}
          color="orange"
          change={comparison ? calculateChange(metrics.conversionRate, comparison.conversionRate) : undefined}
        />
      </div>

      {/* Métricas secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="ROI"
          value={metrics.roi}
          icon={TrendingUp}
          formatter={(value) => `${value.toFixed(1)}%`}
          color="green"
          change={comparison ? calculateChange(metrics.roi, comparison.roi) : undefined}
        />
        
        <MetricCard
          title="ROAS"
          value={metrics.roas}
          icon={TrendingUp}
          formatter={(value) => `${value.toFixed(2)}x`}
          color="blue"
          change={comparison ? calculateChange(metrics.roas, comparison.roas) : undefined}
        />
        
        <MetricCard
          title="CPL (Custo por Lead)"
          value={metrics.cpl}
          icon={DollarSign}
          formatter={formatCurrency}
          color="orange"
          change={comparison ? calculateChange(metrics.cpl, comparison.cpl) : undefined}
        />
        
        <MetricCard
          title="CAC"
          value={metrics.cac}
          icon={DollarSign}
          formatter={formatCurrency}
          color="red"
          change={comparison ? calculateChange(metrics.cac, comparison.cac) : undefined}
        />
      </div>

      {/* Resumo dos cálculos */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo dos Cálculos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Eficiência de Aquisição</h4>
              <div className="space-y-1 text-gray-600">
                <div>Taxa de Conversão: {(metrics.totalLeads > 0 ? (metrics.totalSales / metrics.totalLeads * 100) : 0).toFixed(2)}%</div>
                <div>Custo por Lead: {formatCurrency(metrics.cpl)}</div>
                <div>CAC: {formatCurrency(metrics.cac)}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Retorno do Investimento</h4>
              <div className="space-y-1 text-gray-600">
                <div>ROI: {metrics.roi.toFixed(1)}%</div>
                <div>ROAS: {metrics.roas.toFixed(2)}x</div>
                <div>LTV: {formatCurrency(metrics.ltv)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
