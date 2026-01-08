"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IconRoute,
  IconBook,
  IconClock,
  IconUsers,
  IconStar,
  IconCheck,
  IconPlayerPlay,
  IconTarget,
  IconBrain,
  IconRocket,
  IconAward
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { 
  LearningPath,
  UserPathProgress,
  PathCardProps
} from '@/lib/types';
import { cn } from '@/lib/utils';

const SUBJECT_LABELS: Record<string, string> = {
  mathematics: 'Matemática',
  history: 'Historia',
  grammar: 'Gramática',
  science: 'Ciencias',
};

const SUBJECT_STYLES: Record<string, { icon: React.ReactNode; gradient: string }> = {
  mathematics: {
    icon: <IconTarget className="h-5 w-5" />,
    gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
  history: {
    icon: <IconBook className="h-5 w-5" />,
    gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
  grammar: {
    icon: <IconBrain className="h-5 w-5" />,
    gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  science: {
    icon: <IconRocket className="h-5 w-5" />,
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
};

const DEFAULT_SUBJECT_STYLE = {
  icon: <IconBook className="h-5 w-5" />,
  gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
};

// ==================== PATH CARD COMPONENT ====================

export const PathCard: React.FC<PathCardProps> = ({
  path,
  userProgress,
  onEnroll,
  onContinue,
  onView,
  className,
  variant = 'default'
}) => {
  const isEnrolled = userProgress !== undefined;
  const isCompleted = userProgress?.status === 'completed';
  const progressPercentage = userProgress?.progress || 0;

  const getDifficultyColor = () => {
    switch (path.difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'advanced': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'expert': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getSubjectIcon = () => {
    return (SUBJECT_STYLES[path.subject] ?? DEFAULT_SUBJECT_STYLE).icon;
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all duration-200",
          className
        )}
        onClick={() => onView?.(path.id)}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", getDifficultyColor())}>
            {getSubjectIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 dark:text-white truncate">
              {path.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="capitalize">{path.difficulty}</span>
              <span>•</span>
              <span>{path.estimatedDuration}h</span>
              {isEnrolled && (
                <>
                  <span>•</span>
                  <span>{progressPercentage}% completo</span>
                </>
              )}
            </div>
          </div>
          
          {isCompleted && (
            <IconCheck className="h-5 w-5 text-green-600" />
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <Card className="border-0 shadow-none">
        {/* Header with gradient based on subject */}
        <div className={cn(
          "h-2",
          (SUBJECT_STYLES[path.subject] ?? DEFAULT_SUBJECT_STYLE).gradient
        )} />

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getSubjectIcon()}
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {SUBJECT_LABELS[path.subject] ?? path.subject}
                </span>
                
                {path.isRecommended && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    <IconStar className="h-3 w-3" />
                    Recomendado
                  </span>
                )}
              </div>
              
              <CardTitle className="text-xl mb-2">{path.title}</CardTitle>
              
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium capitalize",
                  getDifficultyColor()
                )}>
                  {path.difficulty}
                </span>
                
                <div className="flex items-center gap-1">
                  <IconClock className="h-4 w-4" />
                  <span>{path.estimatedDuration}h</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <IconUsers className="h-4 w-4" />
                  <span>{path.enrollmentCount}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <IconStar className="h-4 w-4" />
                  <span>{path.averageRating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {isCompleted && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex-shrink-0"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <IconCheck className="h-5 w-5 text-white" />
                </div>
              </motion.div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-slate-700 dark:text-slate-300 mb-4 line-clamp-3">
            {path.description}
          </p>

          {/* Learning Objectives */}
          {path.learningObjectives.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 mb-2">
                Objetivos de Aprendizaje:
              </h4>
              <ul className="space-y-1">
                {path.learningObjectives.slice(0, 3).map((objective, index) => (
                  <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <IconCheck className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
                {path.learningObjectives.length > 3 && (
                  <li className="text-sm text-slate-500">
                    +{path.learningObjectives.length - 3} más...
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Progress bar for enrolled users */}
          {isEnrolled && !isCompleted && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">Progreso</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {path.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {path.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              disabled
              className="flex-1 px-4 py-2 bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 rounded-lg font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <IconPlayerPlay className="h-4 w-4" />
              Proximamente
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ==================== PATHS OVERVIEW ====================

export const PathsOverview: React.FC<{
  enrolledPaths: LearningPath[];
  completedPaths: LearningPath[];
  recommendedPaths: LearningPath[];
  className?: string;
}> = ({ enrolledPaths, completedPaths, recommendedPaths, className }) => {
  const totalPaths = enrolledPaths.length + completedPaths.length;
  const completionRate = totalPaths > 0 ? (completedPaths.length / totalPaths) * 100 : 0;
  
  const totalEstimatedHours = enrolledPaths.reduce((sum, path) => sum + path.estimatedDuration, 0);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-6", className)}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Rutas Activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <IconRoute className="h-8 w-8 text-blue-600" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">
              {enrolledPaths.length}
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
            Tiempo Estimado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <IconClock className="h-8 w-8 text-purple-600" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">
              {totalEstimatedHours}h
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <IconStar className="h-8 w-8 text-yellow-600" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">
              {recommendedPaths.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== PATHS GRID ====================

export const PathsGrid: React.FC<{
  paths: LearningPath[];
  userProgress: Record<string, UserPathProgress>;
  onEnroll?: (pathId: string) => void;
  onContinue?: (pathId: string) => void;
  onView?: (pathId: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
}> = ({ 
  paths, 
  userProgress, 
  onEnroll, 
  onContinue, 
  onView, 
  variant = 'default',
  className 
}) => {
  if (paths.length === 0) {
    return (
      <div className="text-center py-12">
        <IconRoute className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No hay rutas disponibles
        </h3>
        <p className="text-gray-500">
          Las rutas de aprendizaje aparecerán aquí cuando estén disponibles.
        </p>
      </div>
    );
  }

  const gridClasses = variant === 'compact' 
    ? "space-y-3" 
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className={cn(gridClasses, className)}>
      <AnimatePresence>
        {paths.map((path) => (
          <PathCard
            key={path.id}
            path={path}
            userProgress={userProgress[path.id]}
            onEnroll={onEnroll}
            onContinue={onContinue}
            onView={onView}
            variant={variant}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PathCard;
