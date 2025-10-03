import { getAccessToken } from './auth';

// URL del backend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002';

// Interfaz para tipado
export interface ChatSession {
  id: string;
  userId: string;
  subject?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  sessionId: string;
  content: string;
  isUserMessage: boolean;
  createdAt: string;
  analysis?: {
    difficulty: string;
    messageType: string;
    concepts: string[];
  };
}

export interface CreateChatResponse {
  id: string;
  userId: string;
  subject?: string;
  createdAt: string;
}

export interface AddMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
}

// Función auxiliar para hacer peticiones autenticadas
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = await getAccessToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación disponible');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${BACKEND_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ==================== TUTOR API ====================

/**
 * Crear una nueva sesión de tutoría
 */
export async function createChatSession(data?: { subject?: string }): Promise<CreateChatResponse> {
  return authenticatedFetch('/tutor/sessions', {
    method: 'POST',
    body: JSON.stringify(data || {}),
  });
}

/**
 * Obtener materias disponibles
 */
export async function getAvailableSubjects(): Promise<string[]> {
  return authenticatedFetch('/tutor/subjects');
}

/**
 * Obtener sesiones del usuario
 */
export async function getUserSessions(subject?: string): Promise<ChatSession[]> {
  const params = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return authenticatedFetch(`/tutor/sessions${params}`);
}

/**
 * Obtener progreso del usuario por materia
 */
export async function getUserProgress(subject: string): Promise<SubjectProgressRecord> {
  return authenticatedFetch(`/tutor/progress/${encodeURIComponent(subject)}`);
}

/**
 * Obtener todos los mensajes de una sesión de chat
 */
export async function getChatMessages(sessionId: string): Promise<Message[]> {
  return authenticatedFetch(`/tutor/sessions/${sessionId}/messages`);
}

/**
 * Enviar un mensaje a una sesión de chat
 */
export async function sendMessage(
  sessionId: string, 
  content: string
): Promise<AddMessageResponse> {
  return authenticatedFetch(`/tutor/sessions/${sessionId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

/**
 * Actualizar duración de la sesión para tracking de tiempo
 */
export async function updateSessionDuration(
  sessionId: string, 
  durationSeconds: number
): Promise<{ success: boolean }> {
  return authenticatedFetch(`/tutor/sessions/${sessionId}/duration`, {
    method: 'POST',
    body: JSON.stringify({ durationSeconds }),
  });
}

// ==================== USER API ====================

/**
 * Obtener información del usuario autenticado
 */
export async function getCurrentUser() {
  return authenticatedFetch('/auth/user');
}

/**
 * Obtener perfil del usuario
 */
export async function getUserProfile(userId: string) {
  return authenticatedFetch(`/users/${userId}`);
}

/**
 * Actualizar perfil del usuario
 */
export async function updateUserProfile(userId: string, data: UpdateUserProfileRequest) {
  return authenticatedFetch(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ==================== ERROR HANDLING ====================

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// ==================== HOOKS PARA REACT ====================

/**
 * Hook personalizado para manejar estados de carga de API
 */
export function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}

// Importar useState para el hook
import { useState, useCallback } from 'react';

// Importar todos los tipos necesarios
import type {
  UserProfile,
  UserStats,
  ProgressData,
  AnalyticsData,
  DashboardData,
  Goal,
  CreateGoalRequest,
  Achievement,
  UserAchievement,
  LearningPath,
  UserPathProgress,
  RecentSession,
  FilterOptions,
  UpdateUserProfileRequest,
  WeeklyProgress,
  SubjectProgressRecord,
  ChartDataPoint
} from './types';

// ==================== PROGRESS & ANALYTICS API ====================

/**
 * Obtener estadísticas del usuario
 */
export async function getUserStats(): Promise<UserStats> {
  const raw = await authenticatedFetch('/users/me/stats');

  const totalSessions = Number(raw?.totalSessions ?? raw?.sessionsCompleted ?? 0);
  const totalMessages = Number(raw?.totalMessages ?? raw?.messagesSent ?? 0);
  const conceptsLearned = Number(raw?.conceptsLearned ?? 0);
  const achievementsUnlocked = Number(raw?.achievementsUnlocked ?? 0);
  const streakDays = Number(raw?.streakDays ?? raw?.currentStreak ?? 0);
  const totalStudyTime = Number(raw?.totalStudyTime ?? raw?.studyTimeMinutes ?? 0);
  const averageSessionDuration = Number(raw?.averageSessionDuration ?? 0);
  const favoriteSubjects: string[] = Array.isArray(raw?.favoriteSubjects)
    ? raw.favoriteSubjects
    : [];
  const lastActiveDate: string | undefined = raw?.lastActiveDate ?? raw?.lastActivity ?? undefined;

  return {
    totalSessions,
    totalMessages,
    conceptsLearned,
    achievementsUnlocked,
    streakDays,
    totalStudyTime,
    averageSessionDuration,
    favoriteSubjects,
    lastActiveDate,
  };
}

/**
 * Obtener datos de progreso del usuario por materia
 */
export async function getProgressData(
  subject?: string,
  period: 'week' | 'month' | 'year' = 'month'
): Promise<ProgressData[]> {
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  params.append('period', period);
  
  return authenticatedFetch(`/users/me/progress?${params.toString()}`);
}

/**
 * Obtener analytics completos del usuario
 */
export async function getAnalyticsData(
  period: 'week' | 'month' | 'year' | 'all' = 'month',
  subjects?: string[]
): Promise<AnalyticsData> {
  const params = new URLSearchParams();
  params.append('period', period);
  if (subjects) {
    subjects.forEach(subject => params.append('subjects', subject));
  }
  
  return authenticatedFetch(`/users/me/analytics?${params.toString()}`);
}

/**
 * Obtener datos completos del dashboard
 */
export async function getDashboardData(): Promise<DashboardData> {
  const [currentUser, rawStats, recentSessions, activeGoals, recentAchievements, recommendedPaths, analytics] = await Promise.all([
    getCurrentUser(),
    getUserStats(),
    getRecentSessions(5),
    getUserGoals('active', 5),
    getRecentAchievements(5),
    getRecommendedPaths(4),
    getAnalyticsData('month'),
  ]);

  const subjectProgress = analytics.subjectBreakdown ?? [];
  const weeklyActivity = buildWeeklyActivity(analytics.activityData ?? []);
  const summary = analytics.summary ?? {
    totalSessions: 0,
    totalMessages: 0,
    totalStudyTime: 0,
    averageSessionDuration: 0,
    conceptsLearned: 0,
    currentStreak: 0,
    longestStreak: 0,
  };

  const achievementsUnlocked = (recentAchievements ?? []).filter((achievement) => achievement.isCompleted).length;

  const formattedStats = {
    totalSessions: rawStats.totalSessions ?? 0,
    totalMessages: rawStats.totalMessages ?? 0,
    conceptsLearned: rawStats.conceptsLearned ?? 0,
    achievementsUnlocked,
    streakDays: rawStats.streakDays ?? 0,
    totalStudyTime: rawStats.totalStudyTime ?? 0,
    averageSessionDuration: rawStats.averageSessionDuration ?? 0,
    favoriteSubjects: rawStats.favoriteSubjects?.length
      ? rawStats.favoriteSubjects
      : subjectProgress.slice(0, 3).map((subject) => subject.subject),
    lastActiveDate: rawStats.lastActiveDate,
  };

  const totalProgress = subjectProgress.length > 0
    ? Math.round(subjectProgress.reduce((sum, subject) => sum + (subject.progress ?? 0), 0) / subjectProgress.length)
    : 0;

  const strongestSubjects = subjectProgress
    .slice()
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3)
    .map((subject) => subject.subject);

  const areasForImprovement = subjectProgress
    .slice()
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 3)
    .map((subject) => subject.subject);

  const progressSummary = {
    totalProgress,
    weeklyGrowth: 0,
    monthlyGrowth: 0,
    strongestSubjects,
    areasForImprovement,
    nextMilestones: activeGoals.map((goal) => goal.title).slice(0, 3),
    studyStreak: {
      current: summary.currentStreak ?? 0,
      longest: summary.longestStreak ?? 0,
    },
  };

  return {
    user: currentUser,
    stats: formattedStats,
    recentSessions,
    progressSummary,
    activeGoals,
    recentAchievements,
    recommendedPaths,
    upcomingMilestones: [],
    weeklyActivity,
    subjectProgress,
  };
}

function buildWeeklyActivity(
  activityData: Array<{
    date: string;
    sessions: number;
    messages: number;
    studyTime?: number;
    conceptsLearned?: number;
    subjects?: string[];
  }> = [],
): WeeklyProgress[] {
  const weeks = new Map<string, WeeklyProgress>();

  activityData.forEach((day) => {
    const info = getIsoWeekInfo(day.date);
    const key = `${info.year}-W${info.week}`;

    if (!weeks.has(key)) {
      weeks.set(key, {
        week: key,
        year: info.year,
        weekNumber: info.week,
        sessions: 0,
        messages: 0,
        conceptsLearned: 0,
        studyTime: 0,
        startDate: info.startDate,
        endDate: info.endDate,
      });
    }

    const entry = weeks.get(key)!;
    entry.sessions += day.sessions || 0;
    entry.messages += day.messages || 0;
    entry.conceptsLearned += day.conceptsLearned || 0;
    entry.studyTime += day.studyTime || 0;
  });

  return Array.from(weeks.values()).sort((a, b) => a.startDate.localeCompare(b.startDate));
}

function getIsoWeekInfo(dateString: string) {
  const date = new Date(dateString);
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  const weekStart = new Date(utcDate);
  weekStart.setUTCDate(utcDate.getUTCDate() - 3);
  weekStart.setUTCHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
  weekEnd.setUTCHours(23, 59, 59, 999);

  return {
    year: utcDate.getUTCFullYear(),
    week,
    startDate: weekStart.toISOString(),
    endDate: weekEnd.toISOString(),
  };
}

/**
 * Obtener sesiones recientes
 */
export async function getRecentSessions(
  limit: number = 10,
  subject?: string
): Promise<RecentSession[]> {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  if (subject) params.append('subject', subject);
  
  return authenticatedFetch(`/users/me/sessions/recent?${params.toString()}`);
}

// ==================== GOALS API ====================

/**
 * Obtener todos los goals del usuario
 */
export async function getUserGoals(
  status?: 'active' | 'completed' | 'paused',
  limit?: number
): Promise<Goal[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (limit) params.append('limit', limit.toString());
  
  return authenticatedFetch(`/users/me/goals?${params.toString()}`);
}

/**
 * Crear un nuevo goal
 */
export async function createGoal(goalData: CreateGoalRequest): Promise<Goal> {
  return authenticatedFetch('/users/me/goals', {
    method: 'POST',
    body: JSON.stringify(goalData),
  });
}

/**
 * Actualizar un goal existente
 */
export async function updateGoal(
  goalId: string, 
  updates: Partial<Goal>
): Promise<Goal> {
  return authenticatedFetch(`/users/me/goals/${goalId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Marcar un goal como completado
 */
export async function completeGoal(goalId: string): Promise<Goal> {
  return authenticatedFetch(`/users/me/goals/${goalId}/complete`, {
    method: 'POST',
  });
}

/**
 * Pausar o reanudar un goal
 */
export async function toggleGoalStatus(
  goalId: string, 
  status: 'active' | 'paused'
): Promise<Goal> {
  return authenticatedFetch(`/users/me/goals/${goalId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Eliminar un goal
 */
export async function deleteGoal(goalId: string): Promise<void> {
  return authenticatedFetch(`/users/me/goals/${goalId}`, {
    method: 'DELETE',
  });
}

// ==================== ACHIEVEMENTS API ====================

/**
 * Obtener todos los achievements disponibles
 */
export async function getAllAchievements(
  category?: string,
  rarity?: string
): Promise<Achievement[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (rarity) params.append('rarity', rarity);

  const query = params.toString();
  const url = query ? `/achievements?${query}` : '/achievements';
  return authenticatedFetch(url);
}

/**
 * Obtener achievements del usuario (desbloqueados y en progreso)
 */
export async function getUserAchievements(
  status?: 'completed' | 'in_progress' | 'locked'
): Promise<UserAchievement[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);

  const query = params.toString();
  const url = query ? `/users/me/achievements?${query}` : '/users/me/achievements';
  return authenticatedFetch(url);
}

/**
 * Obtener achievements recientes del usuario
 */
export async function getRecentAchievements(
  limit: number = 5
): Promise<UserAchievement[]> {
  return authenticatedFetch(`/users/me/achievements/recent?limit=${limit}`);
}

// ==================== LEARNING PATHS API ====================

/**
 * Obtener todos los learning paths disponibles
 */
export async function getAllLearningPaths(
  filters?: FilterOptions
): Promise<LearningPath[]> {
  const params = new URLSearchParams();
  
  if (filters?.subjects) {
    filters.subjects.forEach(subject => params.append('subjects', subject));
  }
  if (filters?.difficulty) {
    filters.difficulty.forEach(level => params.append('difficulty', level));
  }
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.search) params.append('search', filters.search);
  
  return authenticatedFetch(`/learning-paths?${params.toString()}`);
}

/**
 * Obtener learning paths recomendados para el usuario
 */
export async function getRecommendedPaths(
  limit: number = 6
): Promise<LearningPath[]> {
  return authenticatedFetch(`/users/me/learning-paths/recommended?limit=${limit}`);
}

/**
 * Obtener un learning path específico
 */
export async function getLearningPath(pathId: string): Promise<LearningPath> {
  return authenticatedFetch(`/learning-paths/${pathId}`);
}

/**
 * Inscribirse en un learning path
 */
export async function enrollInLearningPath(pathId: string): Promise<UserPathProgress> {
  return authenticatedFetch(`/users/me/learning-paths/${pathId}/enroll`, {
    method: 'POST',
  });
}

/**
 * Obtener progreso del usuario en learning paths
 */
export async function getUserPathProgress(
  pathId?: string
): Promise<UserPathProgress[]> {
  const url = pathId 
    ? `/users/me/learning-paths/${pathId}/progress`
    : '/users/me/learning-paths/progress';
    
  return authenticatedFetch(url);
}

/**
 * Actualizar progreso en un módulo
 */
export async function updateModuleProgress(
  pathId: string,
  moduleId: string,
  progress: number,
  timeSpent?: number,
  score?: number
): Promise<UserPathProgress> {
  return authenticatedFetch(
    `/users/me/learning-paths/${pathId}/modules/${moduleId}/progress`, 
    {
      method: 'PATCH',
      body: JSON.stringify({ progress, timeSpent, score }),
    }
  );
}

// ==================== USER PROFILE API ====================

/**
 * Actualizar perfil extendido del usuario
 */
export async function updateUserProfileExtended(
  profileData: UpdateUserProfileRequest
): Promise<UserProfile> {
  try {
    return await authenticatedFetch('/users/me/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  } catch (error) {
    console.warn('Persisting profile preferences is not available. Returning local merge.', error);

    const currentProfile = await getUserProfileExtended();
    const mergedPreferences = {
      ...currentProfile.preferences,
      ...profileData.preferences,
      subjectsOfInterest:
        profileData.preferences?.subjectsOfInterest ?? currentProfile.preferences.subjectsOfInterest,
      notifications: profileData.preferences?.notifications
        ? {
            ...currentProfile.preferences.notifications,
            ...profileData.preferences.notifications,
          }
        : currentProfile.preferences.notifications,
    } as UserProfile['preferences'];

    return {
      ...currentProfile,
      displayName: profileData.displayName ?? currentProfile.displayName,
      bio: profileData.bio ?? currentProfile.bio,
      avatar: profileData.avatar ?? currentProfile.avatar,
      preferences: mergedPreferences,
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Obtener perfil completo del usuario
 */
export async function getUserProfileExtended(): Promise<UserProfile> {
  const defaultPreferences = {
    language: 'es',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: false,
      reminders: true,
    },
    learningStyle: 'visual' as const,
    difficultyPreference: 'beginner' as const,
    subjectsOfInterest: [] as string[],
  } satisfies UserProfile['preferences'];

  try {
    return await authenticatedFetch('/users/me/profile');
  } catch (error) {
    console.warn('Falling back to default profile preferences:', error);

    const fallbackUser = await getCurrentUser().catch(() => null);

    return {
      id: fallbackUser?.id ?? 'local-profile',
      userId: fallbackUser?.id ?? 'local-user',
      displayName: fallbackUser?.fullName ?? fallbackUser?.email ?? 'Estudiante',
      bio: fallbackUser?.bio ?? '',
      avatar: fallbackUser?.avatar ?? undefined,
      preferences: defaultPreferences,
      stats: {
        totalSessions: 0,
        totalMessages: 0,
        conceptsLearned: 0,
        achievementsUnlocked: 0,
        streakDays: 0,
        totalStudyTime: 0,
        averageSessionDuration: 0,
        favoriteSubjects: [],
        lastActiveDate: undefined,
      },
      createdAt: undefined,
      updatedAt: undefined,
    };
  }
}

// ==================== NOTIFICATIONS API ====================

/**
 * Marcar achievement como notificado
 */
export async function markAchievementNotified(achievementId: string): Promise<void> {
  return authenticatedFetch(`/users/me/achievements/${achievementId}/notify`, {
    method: 'POST',
  });
}

// ==================== ANALYTICS HELPERS ====================

/**
 * Registrar actividad del usuario (para analytics)
 */
export async function trackUserActivity(
  activityType: 'session_start' | 'session_end' | 'message_sent' | 'concept_learned',
  metadata?: Record<string, unknown>
): Promise<void> {
  return authenticatedFetch('/users/me/activity', {
    method: 'POST',
    body: JSON.stringify({
      type: activityType,
      metadata,
      timestamp: new Date().toISOString(),
    }),
  }).catch(error => {
    // No fallar si el tracking falla
    console.warn('Failed to track user activity:', error);
  });
}

/**
 * Obtener datos para gráficos específicos
 */
export async function getChartData(
  chartType: 'sessions' | 'messages' | 'study_time' | 'subjects',
  period: 'week' | 'month' | 'year' = 'month'
): Promise<ChartDataPoint[]> {
  return authenticatedFetch(`/users/me/charts/${chartType}?period=${period}`);
}
