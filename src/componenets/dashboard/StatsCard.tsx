import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  change: string;
  loading?: boolean;
  status?: 'default' | 'warning' | 'success';
  trend?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  change, 
  loading = false,
  status = 'default',
  trend
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'warning': return 'text-amber-600';
      case 'success': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendColor = () => {
    if (trend === undefined) return '';
    return trend >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    return trend >= 0 ? '↗' : '↘';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${status === 'warning' ? 'bg-amber-50' : 'bg-indigo-50'}`}>
          <Icon className={`h-6 w-6 ${status === 'warning' ? 'text-amber-600' : 'text-indigo-600'}`} />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className={`text-sm font-medium ${getStatusColor()} ${getTrendColor()}`}>
          {change}
        </span>
        {trend !== undefined && (
          <span className={`text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;