"use client";
import React, { useState, useEffect } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { WobbleCard } from "@/components/ui/wobble-card";
import {
  IconRobot,
  IconBrain,
  IconClock,
  IconTarget,
  IconEyeSpark,
  IconTrophy,
  IconChartBar,
  IconRoute
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getSubjectColor, getSubjectLabel } from "@/lib/subjects";

// Import new components
import { UserStatsOverview, ProgressSummaryCards } from "@/components/analytics/StatCards";
import { SubjectBreakdownChart, ActivityChart } from "@/components/analytics/Charts";
import { GoalCard } from "@/components/goals/GoalSystem";
import { AchievementCard, AchievementNotification } from "@/components/achievements/AchievementSystem";

// Import API functions and types
import {
  getDashboardData,
  trackUserActivity
} from "@/lib/api";
import type {
  DashboardData,
  Goal,
  UserAchievement,
  Achievement,
  ChartDataPoint
} from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<UserAchievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [lastError, setLastError] = useState<string | null>(null);
  
  useEffect(() => {
    loadData();
    // Track page visit
    trackUserActivity('session_start', { page: 'dashboard' });
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const dashData = await getDashboardData();
      setDashboardData(dashData);
      setActiveGoals(dashData.activeGoals ?? []);
      setRecentAchievements(dashData.recentAchievements ?? []);
      setBackendStatus('connected');
      setLastError(null);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      const message = error instanceof Error ? error.message : String(error);
      setBackendStatus('error');
      setLastError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      setBackendStatus('unknown');
      const data = await getDashboardData();
      console.log('✅ Backend connection successful:', data);
      setBackendStatus('connected');
      setLastError(null);
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      setBackendStatus('error');
      setLastError(error instanceof Error ? error.message : String(error));
    }
  };
  
  const [welcomeMsg, setWelcomeMsg] = useState("¡Hola!");
  
  useEffect(() => {
    // Set welcome message on client side to avoid hydration mismatch
    const hour = new Date().getHours();
    if (hour < 12) setWelcomeMsg("Buenos días");
    else if (hour < 18) setWelcomeMsg("Buenas tardes");
    else setWelcomeMsg("Buenas noches");
  }, []);

  // Convert data for charts
  const getWeeklyActivityData = (): ChartDataPoint[] => {
    if (!dashboardData?.weeklyActivity) return [];
    return dashboardData.weeklyActivity.map(week => ({
      label: `Sem ${week.weekNumber}`,
      value: week.sessions,
      date: week.startDate
    }));
  };

  const getSubjectProgressData = (): ChartDataPoint[] => {
    if (!dashboardData?.subjectProgress) return [];
    return dashboardData.subjectProgress.map(subject => ({
      label: getSubjectLabel(subject.subject),
      value: subject.progress,
      color: getSubjectColor(subject.subject)
    }));
  };

  const bentoItems = [
    {
      title: "Iniciar Chat con IA",
      description: "Comienza una nueva sesión de aprendizaje con tu tutor personal",
      header: <ChatHeader />,
      className: "md:col-span-2",
      icon: <IconRobot className="h-6 w-6 text-indigo-600" />,
      href: "/tutor"
    },
    {
      title: "Analytics & Progreso",
      description: "Visualiza tu evolución y estadísticas detalladas",
      header: <ProgressHeader />,
      className: "md:col-span-1",
      icon: <IconChartBar className="h-6 w-6 text-green-600" />,
      href: "/analytics"
    },
    {
      title: "Sesiones Recientes",
      description: "Revisa tus últimas conversaciones",
      header: <RecentSessionsHeader />,
      className: "md:col-span-1",
      icon: <IconClock className="h-6 w-6 text-blue-600" />,
      href: "/history"
    },
    {
      title: "Objetivos de Aprendizaje",
      description: "Define y sigue tus metas educativas",
      header: <GoalsHeader />,
      className: "md:col-span-1",
      icon: <IconTarget className="h-6 w-6 text-purple-600" />,
      href: "/goals"
    },
    {
      title: "Rutas de Aprendizaje",
      description: "Explora caminos estructurados de estudio",
      header: <PathsHeader />,
      className: "md:col-span-1",
      icon: <IconRoute className="h-6 w-6 text-orange-600" />,
      href: "/learning-paths"
    },
  ];

  if (isLoading && !dashboardData) {
    return (
      <div className="flex h-full w-full flex-1 flex-col gap-6 p-4 md:p-8 overflow-y-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-8 p-4 md:p-8 overflow-y-auto">
      {/* Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <AchievementNotification
            achievement={newAchievement}
            onClose={() => setNewAchievement(null)}
          />
        )}
      </AnimatePresence>

      {/* Header de Bienvenida */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            {welcomeMsg}
            <span className="block text-xl font-normal text-slate-600 dark:text-slate-400 mt-1">
              {user?.email || "¡Listo para aprender algo nuevo!"}
            </span>
          </h1>
        </div>
        
        <div className="flex gap-3 items-center">
          {/* Backend Status Indicator */}
          <button 
            onClick={testBackendConnection}
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
              backendStatus === 'connected' ? 'bg-green-50 border-green-200 text-green-700' :
              backendStatus === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
              'bg-gray-50 border-gray-200 text-gray-700'
            }`}
            title={lastError || 'Click to test backend connection'}
          >
            {backendStatus === 'connected' ? '✅ Backend OK' :
             backendStatus === 'error' ? '❌ Backend Error' :
             '⏳ Testing...'}
          </button>
          
          <Link href="/tutor">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <IconEyeSpark className="h-5 w-5" />
              Nuevo Chat
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* User Stats Overview */}
      {dashboardData?.stats && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <UserStatsOverview stats={dashboardData.stats} />
        </motion.div>
      )}

      {/* Progress Summary */}
      {dashboardData?.progressSummary && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <ProgressSummaryCards summary={dashboardData.progressSummary} />
        </motion.div>
      )}

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <ActivityChart
            data={getWeeklyActivityData()}
            title="Actividad Semanal"
          />
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <SubjectBreakdownChart
            data={getSubjectProgressData()}
            title="Progreso por Materia"
          />
        </div>
      </motion.div>

      {/* Bento Grid Principal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <BentoGrid className="max-w-6xl mx-auto">
          {bentoItems.map((item, i) => (
            <Link key={i} href={item.href || "#"} className={item.href ? "cursor-pointer" : "cursor-default"}>
              <BentoGridItem
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={cn(item.className, item.href && "hover:scale-[1.02] transition-transform cursor-pointer")}
              />
            </Link>
          ))}
        </BentoGrid>
      </motion.div>

      {/* Goals and Achievements Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        {/* Active Goals */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Objetivos Activos
            </h2>
            <Link href="/goals" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Ver todos →
            </Link>
          </div>
          
          {activeGoals.length > 0 ? (
            <div className="space-y-4">
              {activeGoals.slice(0, 2).map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  showActions={false}
                  className="border shadow-sm"
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 text-center">
              <IconTarget className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No hay objetivos activos</p>
              <Link href="/goals" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 inline-block">
                Crear tu primer objetivo
              </Link>
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Logros Recientes
            </h2>
            <Link href="/achievements" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Ver todos →
            </Link>
          </div>
          
          {recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {recentAchievements.map((userAchievement) => (
                userAchievement.achievement && (
                  <div key={userAchievement.id} className="scale-90 origin-top">
                    <AchievementCard
                      achievement={userAchievement.achievement}
                      userAchievement={userAchievement}
                      showProgress={false}
                    />
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 text-center">
              <IconTrophy className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Continúa aprendiendo para desbloquear logros
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Link href="/tutor" className="block">
          <WobbleCard
            containerClassName="col-span-1 bg-gradient-to-br from-indigo-900 to-purple-900 min-h-[300px] hover:scale-[1.02] transition-transform cursor-pointer"
            className=""
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Explora nuevos temas con IA
              </h2>
              <p className="mt-4 text-left text-base/6 text-neutral-200">
                Descubre conceptos, resuelve problemas y profundiza en cualquier materia con la ayuda de tu tutor inteligente.
              </p>
              {dashboardData?.stats && (
                <div className="mt-4 flex items-center gap-4 text-white/80 text-sm">
                  <span>{dashboardData.stats.totalSessions} sesiones</span>
                  <span>{dashboardData.stats.totalMessages} mensajes</span>
                </div>
              )}
            </div>
            <IconBrain className="absolute -right-4 lg:-right-[40%] -bottom-10 object-contain rounded-2xl h-32 w-32 text-indigo-300 opacity-30" />
          </WobbleCard>
        </Link>
        
        <Link href="/analytics" className="block">
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-emerald-900 to-teal-900 hover:scale-[1.02] transition-transform cursor-pointer">
            <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Analiza tu progreso
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Visualiza gráficos detallados, tendencias de aprendizaje y métricas de rendimiento.
            </p>
            {dashboardData?.stats && (
              <div className="mt-4 flex items-center gap-4 text-white/80 text-sm">
                <span>🔥 {dashboardData.stats.streakDays} días</span>
                <span>📈 {Math.round(dashboardData.stats.totalStudyTime / 60)}h estudio</span>
              </div>
            )}
            <IconChartBar className="absolute -right-10 md:-right-[40%] -bottom-10 object-contain rounded-2xl h-32 w-32 text-emerald-300 opacity-30" />
          </WobbleCard>
        </Link>
      </motion.div>
    </div>
  );
}

// Componentes de headers para las Bento Grid cards
const ChatHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
    <div className="flex items-center justify-center w-full">
      <IconRobot className="h-12 w-12 text-white/80" />
    </div>
  </div>
);

const ProgressHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl relative overflow-hidden">
    <div className="flex items-center justify-center w-full">
      <div className="flex gap-2 items-end">
        {[40, 60, 30, 80, 50].map((height, i) => (
          <div 
            key={i} 
            className={`w-3 bg-white/80 rounded-t transition-all duration-1000 delay-${i * 100}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const RecentSessionsHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl relative overflow-hidden">
    <div className="flex flex-col justify-center w-full p-4">
      <div className="space-y-2">
        {[3, 2, 4].map((width, i) => (
          <div 
            key={i} 
            className={`h-2 bg-white/70 rounded w-${width}/4 animate-pulse`}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const GoalsHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl relative overflow-hidden">
    <div className="flex items-center justify-center w-full">
      <div className="relative">
        <IconTarget className="h-12 w-12 text-white/80" />
        <div className="absolute inset-0 animate-ping">
          <IconTarget className="h-12 w-12 text-white/40" />
        </div>
      </div>
    </div>
  </div>
);

const PathsHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-orange-500 to-red-600 rounded-xl relative overflow-hidden">
    <div className="flex items-center justify-center w-full">
      <div className="relative">
        <IconRoute className="h-12 w-12 text-white/80" />
        <div className="absolute inset-0 animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </div>
  </div>
);
