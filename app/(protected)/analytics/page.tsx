"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  IconChartBar,
  IconTrendingUp,
  IconClock,
  IconBrain,
  IconBolt,
  IconRefresh
} from '@tabler/icons-react';

// Import analytics components
import { 
  ProgressChart, 
  SubjectBreakdownChart, 
  ActivityChart,
  ActivityHeatmap
} from '@/components/analytics/Charts';
import { 
  UserStatsOverview, 
  SubjectProgressCard 
} from '@/components/analytics/StatCards';

// Import API functions and types
import {
  getAnalyticsData,
  getUserStats,
  useApiCall
} from '@/lib/api';
import type {
  AnalyticsData,
  UserStats,
  ChartDataPoint
} from '@/lib/types';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // API hooks
  const { execute: executeAnalytics, loading: loadingAnalytics } = useApiCall<AnalyticsData>();
  const { execute: executeStats } = useApiCall<UserStats>();

  const loadAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [analytics, stats] = await Promise.all([
        executeAnalytics(() => getAnalyticsData(selectedPeriod)),
        executeStats(getUserStats)
      ]);

      if (analytics) setAnalyticsData(analytics);
      if (stats) setUserStats(stats);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [executeAnalytics, executeStats, selectedPeriod]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const periodOptions = [
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'year', label: 'Este año' }
  ];

  // Convert data for charts
  const getActivityChartData = (): ChartDataPoint[] => {
    if (!analyticsData?.activityData) return [];
    return analyticsData.activityData.map(activity => ({
      label: new Date(activity.date).toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      }),
      value: activity.sessions,
      date: activity.date
    }));
  };

  const getStudyTimeChartData = (): ChartDataPoint[] => {
    if (!analyticsData?.activityData) return [];
    return analyticsData.activityData.map(activity => ({
      label: new Date(activity.date).toLocaleDateString('es-ES', { 
        weekday: 'short' 
      }),
      value: activity.studyTime,
      date: activity.date
    }));
  };

  if (isLoading && !analyticsData) {
    return (
      <div className="flex h-full w-full flex-1 flex-col gap-6 p-4 md:p-8 overflow-y-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-80 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-8 p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <IconChartBar className="h-8 w-8 text-indigo-600" />
            Analytics & Progreso
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Visualiza tu evolución y métricas de aprendizaje
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={loadAnalyticsData}
            disabled={loadingAnalytics}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <IconRefresh className={`h-4 w-4 ${loadingAnalytics ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      {userStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <UserStatsOverview stats={userStats} />
        </motion.div>
      )}

      {/* Summary Cards */}
      {analyticsData?.summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Promedio Sesión
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {Math.round(analyticsData.summary.averageSessionDuration)}min
                </p>
              </div>
              <IconClock className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Conceptos Nuevos
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {analyticsData.summary.conceptsLearned}
                </p>
              </div>
              <IconBrain className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Racha Actual
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {analyticsData.summary.currentStreak}
                </p>
              </div>
              <IconBolt className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Engagement
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {analyticsData.trends.engagementScore}%
                </p>
              </div>
              <IconTrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Activity Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <ActivityChart
            data={getActivityChartData()}
            title={`Actividad - ${periodOptions.find(p => p.value === selectedPeriod)?.label}`}
          />
        </div>

        {/* Study Time Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <ProgressChart
            data={getStudyTimeChartData()}
            title="Tiempo de Estudio"
          />
        </div>
      </motion.div>

      {/* Subject Analysis */}
      {analyticsData?.subjectBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Subject Breakdown Chart */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <SubjectBreakdownChart
                data={analyticsData.subjectBreakdown.map(subject => ({
                  label: subject.subject,
                  value: subject.progress,
                  color: subject.subject === 'Matemática' ? '#3b82f6' : 
                         subject.subject === 'Historia' ? '#f59e0b' : '#10b981'
                }))}
                title="Progreso por Materia"
              />
            </div>
          </div>

          {/* Subject Cards */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Análisis por Materia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyticsData.subjectBreakdown.map((subject) => (
                <SubjectProgressCard
                  key={subject.subject}
                  subject={subject.subject}
                  progress={subject.progress}
                  sessions={subject.sessions}
                  lastActivity={new Date(subject.lastActivity).toLocaleDateString('es-ES')}
                  skillLevel={subject.skillLevel}
                  trending={subject.trending}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Activity Heatmap */}
      {analyticsData?.activityData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
        >
          <ActivityHeatmap
            data={analyticsData.activityData.map(activity => ({
              date: activity.date,
              value: Math.min(activity.sessions, 4), // Normalize to 0-4 scale
              sessions: activity.sessions
            }))}
            title="Mapa de Actividad"
          />
        </motion.div>
      )}

      {/* Trends Section */}
      {analyticsData?.trends && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            Tendencias de Aprendizaje
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                +{analyticsData.trends.sessionsGrowth}%
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                Crecimiento en Sesiones
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                +{analyticsData.trends.messagesGrowth}%
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                Crecimiento en Mensajes
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                +{analyticsData.trends.studyTimeGrowth}%
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                Crecimiento en Tiempo
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
