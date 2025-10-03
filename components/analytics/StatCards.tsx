"use client";

import React from 'react';
import { motion } from 'motion/react';
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconMinus,
  IconTarget,
  IconBrain,
  IconClock,
  IconFile,
  IconAward
} from '@tabler/icons-react';
import type { 
  StatCardProps, 
  ProgressCardProps, 
  UserStats,
  ProgressSummary 
} from '@/lib/types';
import { cn } from '@/lib/utils';

// ==================== STAT CARD COMPONENT ====================

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  className
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <IconTrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <IconTrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <IconMinus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700',
      green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700',
      purple: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700',
      amber: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700',
      red: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700',
      indigo: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700',
    };
    
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-br rounded-xl p-6 border shadow-sm",
        getColorClasses(color),
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={cn("text-sm font-medium", getTrendColor())}>
                  {trend.value > 0 ? '+' : ''}{trend.value}
                </span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
          {trend?.label && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ==================== PROGRESS CARD COMPONENT ====================

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  total,
  percentage,
  trend,
  trendValue,
  icon,
  color = 'blue',
  className,
  isLoading = false
}) => {
  const calculatedPercentage = percentage ?? (total ? Math.round((value / total) * 100) : 0);
  
  const getProgressColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      amber: 'bg-amber-500',
      red: 'bg-red-500',
      indigo: 'bg-indigo-500',
    };
    
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBackgroundColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900/20',
      green: 'bg-green-100 dark:bg-green-900/20',
      purple: 'bg-purple-100 dark:bg-purple-900/20',
      amber: 'bg-amber-100 dark:bg-amber-900/20',
      red: 'bg-red-100 dark:bg-red-900/20',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/20',
    };
    
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className={cn("bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-slate-600 dark:text-slate-400">{icon}</span>}
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </h3>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {value}
            </span>
            {total && (
              <span className="text-lg text-slate-500 dark:text-slate-400">
                / {total}
              </span>
            )}
          </div>

          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-1">
              {trend === 'up' && <IconTrendingUp className="h-4 w-4 text-green-500" />}
              {trend === 'down' && <IconTrendingDown className="h-4 w-4 text-red-500" />}
              {trend === 'stable' && <IconMinus className="h-4 w-4 text-gray-400" />}
              <span className={cn(
                "text-sm font-medium",
                trend === 'up' && "text-green-500",
                trend === 'down' && "text-red-500",
                trend === 'stable' && "text-gray-400"
              )}>
                {trendValue > 0 ? '+' : ''}{trendValue}%
              </span>
            </div>
          )}
        </div>

        <div className="text-right">
          <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {calculatedPercentage}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={cn("w-full h-2 rounded-full", getBackgroundColor(color))}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${calculatedPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", getProgressColor(color))}
        />
      </div>
    </motion.div>
  );
};

// ==================== USER STATS OVERVIEW ====================

export const UserStatsOverview: React.FC<{
  stats: UserStats;
  className?: string;
}> = ({ stats, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      <StatCard
        title="Sesiones Completadas"
        value={stats.totalSessions}
        icon={<IconBrain className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
        color="blue"
        trend={{
          direction: 'up',
          value: 12,
          label: 'vs. mes anterior'
        }}
      />
      
      <StatCard
        title="Mensajes Enviados"
        value={stats.totalMessages.toLocaleString()}
        icon={<IconTarget className="h-8 w-8 text-green-600 dark:text-green-400" />}
        color="green"
        trend={{
          direction: 'up',
          value: 8,
          label: 'vs. semana anterior'
        }}
      />
      
      <StatCard
        title="Tiempo de Estudio"
        value={`${Math.round(stats.totalStudyTime / 60)}h`}
        subtitle={`${stats.totalStudyTime} minutos total`}
        icon={<IconClock className="h-8 w-8 text-purple-600 dark:text-purple-400" />}
        color="purple"
        trend={{
          direction: 'up',
          value: 15,
          label: 'vs. mes anterior'
        }}
      />
      
      <StatCard
        title="Racha Actual"
        value={`${stats.streakDays} días`}
        subtitle="¡Sigue así!"
        icon={<IconFile className="h-8 w-8 text-amber-600 dark:text-amber-400" />}
        color="amber"
        trend={{
          direction: stats.streakDays > 0 ? 'up' : 'stable',
          value: 1,
          label: 'días consecutivos'
        }}
      />
    </div>
  );
};

// ==================== PROGRESS SUMMARY ====================

export const ProgressSummaryCards: React.FC<{
  summary: ProgressSummary;
  className?: string;
}> = ({ summary, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      <ProgressCard
        title="Progreso General"
        value={summary.totalProgress}
        total={100}
        icon={<IconTarget className="h-5 w-5" />}
        color="indigo"
        trend="up"
        trendValue={summary.weeklyGrowth}
      />
      
      <ProgressCard
        title="Crecimiento Semanal"
        value={summary.weeklyGrowth}
        percentage={Math.min(summary.weeklyGrowth, 100)}
        icon={<IconTrendingUp className="h-5 w-5" />}
        color="green"
        trend={summary.weeklyGrowth > 0 ? 'up' : 'stable'}
        trendValue={summary.weeklyGrowth}
      />
      
      <ProgressCard
        title="Crecimiento Mensual"
        value={summary.monthlyGrowth}
        percentage={Math.min(summary.monthlyGrowth, 100)}
        icon={<IconBrain className="h-5 w-5" />}
        color="purple"
        trend={summary.monthlyGrowth > 0 ? 'up' : 'stable'}
        trendValue={summary.monthlyGrowth}
      />
    </div>
  );
};

// ==================== ACHIEVEMENT STATS ====================

export const AchievementStats: React.FC<{
  totalAchievements: number;
  unlockedAchievements: number;
  recentCount: number;
  className?: string;
}> = ({ totalAchievements, unlockedAchievements, recentCount, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      <StatCard
        title="Logros Desbloqueados"
        value={unlockedAchievements}
        subtitle={`de ${totalAchievements} totales`}
        icon={<IconAward className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />}
        color="amber"
      />
      
      <ProgressCard
        title="Progreso de Logros"
        value={unlockedAchievements}
        total={totalAchievements}
        percentage={Math.round((unlockedAchievements / totalAchievements) * 100)}
        icon={<IconTarget className="h-5 w-5" />}
        color="purple"
      />
      
      <StatCard
        title="Logros Recientes"
        value={recentCount}
        subtitle="En los últimos 7 días"
        icon={<IconFile className="h-6 w-6 text-red-600 dark:text-red-400" />}
        color="red"
        trend={{
          direction: recentCount > 0 ? 'up' : 'stable',
          value: recentCount,
          label: 'esta semana'
        }}
      />
    </div>
  );
};

// ==================== SUBJECT PROGRESS CARDS ====================

export const SubjectProgressCard: React.FC<{
  subject: string;
  progress: number;
  sessions: number;
  lastActivity: string;
  skillLevel: string;
  trending: 'up' | 'down' | 'stable';
  className?: string;
}> = ({ 
  subject, 
  progress, 
  sessions, 
  lastActivity, 
  skillLevel, 
  trending,
  className 
}) => {
  const getSubjectIcon = () => {
    // Esta función podría expandirse para incluir íconos específicos por materia
    return <IconBrain className="h-5 w-5" />;
  };

  const getSkillLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'advanced': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'expert': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getSubjectIcon()}
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              {subject}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                getSkillLevelColor(skillLevel)
              )}>
                {skillLevel}
              </span>
              {trending === 'up' && <IconTrendingUp className="h-4 w-4 text-green-500" />}
              {trending === 'down' && <IconTrendingDown className="h-4 w-4 text-red-500" />}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            {progress}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
          />
        </div>
        
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>{sessions} sesiones</span>
          <span>Última: {lastActivity}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
