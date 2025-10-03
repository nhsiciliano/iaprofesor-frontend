"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IconTarget,
  IconMoped,
  IconCheck,
  IconClock,
  IconX,
  IconEyePause,
  IconPray,
  IconFlag,
  IconTrendingUp,
  IconCalendar,
  IconTrash,
  IconFlame,
  IconBrain,
  IconMessage,
  IconBook,
  IconAward
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { 
  Goal, 
  GoalCardProps, 
  CreateGoalRequest,
  GoalType,
  GoalPriority,
  GoalCategory,
} from '@/lib/types';
import { cn } from '@/lib/utils';

// ==================== GOAL CARD COMPONENT ====================

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onUpdate,
  onDelete,
  onComplete,
  onPause,
  className,
  showActions = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed':
        return <IconCheck className="h-5 w-5 text-green-500" />;
      case 'paused':
        return <IconEyePause className="h-5 w-5 text-amber-500" />;
      case 'expired':
        return <IconClock className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <IconX className="h-5 w-5 text-gray-500" />;
      default:
        return <IconPray className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'high':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      case 'low':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
      default:
        return 'border-l-gray-300';
    }
  };

  const getTypeIcon = () => {
    const iconMap = {
      daily_sessions: <IconCalendar className="h-4 w-4" />,
      weekly_sessions: <IconCalendar className="h-4 w-4" />,
      monthly_sessions: <IconCalendar className="h-4 w-4" />,
      total_messages: <IconMessage className="h-4 w-4" />,
      concepts_learned: <IconBrain className="h-4 w-4" />,
      study_time: <IconClock className="h-4 w-4" />,
      streak_days: <IconFlame className="h-4 w-4" />,
      skill_level: <IconTrendingUp className="h-4 w-4" />,
      subject_mastery: <IconBook className="h-4 w-4" />,
      custom: <IconMoped className="h-4 w-4" />,
    };
    
    return iconMap[goal.type] || <IconTarget className="h-4 w-4" />;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Vencido';
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays < 7) return `${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "border-l-4 rounded-r-lg shadow-sm hover:shadow-md transition-all duration-200",
        getPriorityColor(),
        className
      )}
    >
      <Card className="border-l-0 rounded-l-none">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon()}
                {getTypeIcon()}
                <CardTitle className="text-lg">{goal.title}</CardTitle>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="capitalize">{goal.category}</span>
                <span className="capitalize">{goal.priority}</span>
                {goal.deadline && (
                  <div className="flex items-center gap-1">
                    <IconCalendar className="h-3 w-3" />
                    <span>{formatDeadline(goal.deadline)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {showActions && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <IconFlag className="h-4 w-4" />
                </button>
                
                {goal.status === 'active' && onPause && (
                  <button
                    onClick={() => onPause(goal.id)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <IconEyePause className="h-4 w-4 text-amber-500" />
                  </button>
                )}
                
                {goal.status === 'paused' && onUpdate && (
                  <button
                    onClick={() => onUpdate({ ...goal, status: 'active' })}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <IconPray className="h-4 w-4 text-green-500" />
                  </button>
                )}
                
                {goal.status === 'active' && goal.progress >= 100 && onComplete && (
                  <button
                    onClick={() => onComplete(goal.id)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <IconCheck className="h-4 w-4 text-green-500" />
                  </button>
                )}
                
                {onDelete && (
                  <button
                    onClick={() => onDelete(goal.id)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <IconTrash className="h-4 w-4 text-red-500" />
                  </button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            {goal.description}
          </p>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Progreso</span>
              <span className="font-medium">
                {goal.currentValue} / {goal.targetValue} ({goal.progress}%)
              </span>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(goal.progress, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                  "h-2 rounded-full",
                  goal.progress >= 100 
                    ? "bg-green-500" 
                    : goal.progress >= 75 
                      ? "bg-blue-500" 
                      : goal.progress >= 50 
                        ? "bg-yellow-500" 
                        : "bg-gray-400"
                )}
              />
            </div>
          </div>
          
          {/* Milestones */}
          <AnimatePresence>
            {isExpanded && goal.milestones.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
              >
                <h4 className="font-medium mb-2">Hitos</h4>
                <div className="space-y-2">
                  {goal.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className={cn(
                        "flex items-center gap-2 text-sm p-2 rounded",
                        milestone.isCompleted
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                          : "bg-slate-50 dark:bg-slate-800"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        milestone.isCompleted
                          ? "border-green-500 bg-green-500"
                          : "border-slate-300 dark:border-slate-600"
                      )}>
                        {milestone.isCompleted && (
                          <IconCheck className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="flex-1">{milestone.title}</span>
                      <span className="text-xs text-slate-500">
                        {milestone.targetValue}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ==================== CREATE GOAL FORM ====================

export const CreateGoalForm: React.FC<{
  onCreateGoal: (goal: CreateGoalRequest) => void;
  onCancel: () => void;
  className?: string;
}> = ({ onCreateGoal, onCancel, className }) => {
  const [formData, setFormData] = useState<CreateGoalRequest>({
    title: '',
    description: '',
    type: 'daily_sessions',
    targetValue: 1,
    priority: 'medium',
    category: 'learning',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      onCreateGoal(formData);
    }
  };

  const goalTypeOptions: { value: GoalType; label: string }[] = [
    { value: 'daily_sessions', label: 'Sesiones diarias' },
    { value: 'weekly_sessions', label: 'Sesiones semanales' },
    { value: 'monthly_sessions', label: 'Sesiones mensuales' },
    { value: 'total_messages', label: 'Total de mensajes' },
    { value: 'concepts_learned', label: 'Conceptos aprendidos' },
    { value: 'study_time', label: 'Tiempo de estudio' },
    { value: 'streak_days', label: 'Días consecutivos' },
    { value: 'subject_mastery', label: 'Dominio de materia' },
    { value: 'custom', label: 'Personalizado' },
  ];

  const priorityOptions: { value: GoalPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Baja', color: 'text-blue-600' },
    { value: 'medium', label: 'Media', color: 'text-yellow-600' },
    { value: 'high', label: 'Alta', color: 'text-orange-600' },
    { value: 'critical', label: 'Crítica', color: 'text-red-600' },
  ];

  const categoryOptions: { value: GoalCategory; label: string }[] = [
    { value: 'learning', label: 'Aprendizaje' },
    { value: 'engagement', label: 'Participación' },
    { value: 'skill', label: 'Habilidades' },
    { value: 'achievement', label: 'Logros' },
    { value: 'habit', label: 'Hábitos' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700", className)}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <IconTarget className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Crear Nuevo Objetivo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Título del Objetivo
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="Ej: Completar 5 sesiones de matemáticas esta semana"
              required
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="Describe tu objetivo en detalle..."
              required
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tipo de Objetivo
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as GoalType })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {goalTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Valor objetivo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Valor Objetivo
            </label>
            <input
              type="number"
              value={formData.targetValue}
              onChange={(e) => setFormData({ ...formData, targetValue: parseInt(e.target.value) || 1 })}
              min="1"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              required
            />
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Prioridad
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as GoalPriority })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Categoría
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as GoalCategory })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha límite */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Fecha Límite (Opcional)
            </label>
            <input
              type="date"
              value={formData.deadline || ''}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Materia (si aplica) */}
          {(formData.type === 'subject_mastery' || formData.type === 'skill_level') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Materia
              </label>
              <input
                type="text"
                value={formData.subject || ''}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="Ej: Matemáticas, Historia, etc."
              />
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Crear Objetivo
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// ==================== GOALS OVERVIEW ====================

export const GoalsOverview: React.FC<{
  activeGoals: Goal[];
  completedGoals: Goal[];
  className?: string;
}> = ({ activeGoals, completedGoals, className }) => {
  const totalGoals = activeGoals.length + completedGoals.length;
  const completionRate = totalGoals > 0 ? (completedGoals.length / totalGoals) * 100 : 0;
  
  const priorityDistribution = activeGoals.reduce((acc, goal) => {
    acc[goal.priority] = (acc[goal.priority] || 0) + 1;
    return acc;
  }, {} as Record<GoalPriority, number>);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Objetivos Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <IconTarget className="h-8 w-8 text-blue-600" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">
              {activeGoals.length}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Tasa de Completación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <IconAward className="h-8 w-8 text-green-600" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">
              {Math.round(completionRate)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Alta Prioridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <IconFlag className="h-8 w-8 text-red-600" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">
              {(priorityDistribution.high || 0) + (priorityDistribution.critical || 0)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalCard;