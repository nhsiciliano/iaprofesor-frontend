"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "motion/react";
import {
  IconUser,
  IconMail,
  IconCalendar,
  IconEdit,
  IconSettings,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData } from "@/lib/api";
import type { DashboardData, UserStats } from "@/lib/types";

// Función helper para mapear datos del backend a UserStats del frontend
const mapBackendStatsToUserStats = (backendStats: DashboardData['stats']): UserStats => ({
  totalSessions: backendStats.totalSessions ?? 0,
  totalMessages: backendStats.totalMessages ?? 0,
  conceptsLearned: backendStats.conceptsLearned ?? 0,
  achievementsUnlocked: backendStats.achievementsUnlocked ?? 0,
  streakDays: backendStats.streakDays ?? 0,
  totalStudyTime: backendStats.totalStudyTime ?? 0,
  averageSessionDuration: backendStats.averageSessionDuration ?? 0,
  favoriteSubjects: backendStats.favoriteSubjects ?? [],
  lastActiveDate: backendStats.lastActiveDate ?? undefined,
});

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        setIsLoadingStats(true);
        setError(null);
        
        // Intentar obtener datos reales del backend
        const dashboardData = await getDashboardData();
        
        if (dashboardData?.stats) {
          // Mapear los datos del backend al formato UserStats del frontend
          const mappedStats = mapBackendStatsToUserStats(dashboardData.stats);
          setStats(mappedStats);
        } else {
          // Fallback con datos básicos si no hay stats específicos
          setStats({
            totalSessions: 0,
            totalMessages: 0,
            conceptsLearned: 0,
            achievementsUnlocked: 0,
            streakDays: 0,
            totalStudyTime: 0,
            averageSessionDuration: 0,
            favoriteSubjects: [],
            lastActiveDate: undefined
          });
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
        setError('Error al cargar las estadísticas');
        
        // Usar datos mock como fallback si hay error
        setStats({
          totalSessions: 12,
          totalMessages: 156,
          totalStudyTime: 320,
          conceptsLearned: 47,
          streakDays: 5,
          achievementsUnlocked: 8,
          averageSessionDuration: 25,
          favoriteSubjects: ['Matemática', 'Historia'],
          lastActiveDate: new Date().toISOString()
        });
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    if (user) {
      loadUserStats();
    }
  }, [user]);

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-6 p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Mi Perfil
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gestiona tu información personal y configuraciones
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información Personal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="h-5 w-5 text-indigo-500" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Tu información de cuenta y detalles del perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <IconMail className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      Email
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {user?.email || "No especificado"}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <IconEdit className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <IconCalendar className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      Miembro desde
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long'
                          })
                        : new Date().toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long'
                          })
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Estadísticas de Aprendizaje */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconSettings className="h-5 w-5 text-purple-500" />
                Estadísticas de Aprendizaje
              </CardTitle>
              <CardDescription>
                Tu progreso y actividad en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingStats ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg animate-pulse">
                      <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center p-8 text-red-600 dark:text-red-400">
                  <p>{error}</p>
                  <p className="text-sm mt-2">Mostrando datos de ejemplo</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats?.totalSessions || 0}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Sesiones
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats?.conceptsLearned || 0}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Conceptos
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.round((stats?.totalStudyTime || 0) / 60)}h {Math.round((stats?.totalStudyTime || 0) % 60)}m
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Tiempo total
                    </p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {stats?.streakDays || 0}
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Días de racha
                    </p>
                  </div>
                </div>
              )}
              
              {/* Información adicional si hay datos */}
              {stats && !isLoadingStats && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        Mensajes enviados
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {stats.totalMessages || 0}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        Duración promedio
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {stats.averageSessionDuration || 0} min
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        Logros desbloqueados
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {stats.achievementsUnlocked || 0}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        Última actividad
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {stats.lastActiveDate 
                          ? new Date(stats.lastActiveDate).toLocaleDateString('es-ES')
                          : 'Nunca'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Configuraciones Adicionales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Preferencias de Aprendizaje</CardTitle>
            <CardDescription>
              Personaliza tu experiencia de aprendizaje con IA Profesor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border-2 border-dashed border-indigo-200 dark:border-indigo-700">
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Configuraciones de aprendizaje próximamente
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Pronto podrás personalizar tu experiencia de aprendizaje
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
