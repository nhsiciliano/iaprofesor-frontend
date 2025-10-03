// ==================== CORE BACKEND TYPES (Current Schema) ====================
// Estos tipos están alineados con el esquema de Prisma actual

export interface User {
  id: string;
  email: string;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  content: string;
  isUserMessage: boolean;
  createdAt: string;
  role?: 'user' | 'assistant'; // For compatibility with frontend
}

// ==================== API RESPONSE TYPES ====================
// Tipos para las respuestas de la API actual

export interface CreateChatResponse {
  id: string;
  userId: string;
  createdAt: string;
}

export interface AddMessageResponse {
  userMessage: {
    id: string;
    sessionId: string;
    content: string;
    isUserMessage: boolean;
    createdAt: string;
  };
  assistantMessage: {
    id: string;
    sessionId: string;
    content: string;
    isUserMessage: boolean;
    createdAt: string;
  };
}

export interface Message {
  id: string;
  sessionId: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

// ==================== USER PROFILE & STATS TYPES ====================
// Tipos extendidos para el perfil de usuario y estadísticas

export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  difficultyPreference: 'beginner' | 'intermediate' | 'advanced';
  subjectsOfInterest: string[];
}

export interface UserStats {
  totalSessions: number;
  totalMessages: number;
  conceptsLearned: number;
  achievementsUnlocked: number;
  streakDays: number;
  totalStudyTime: number; // in minutes
  averageSessionDuration: number; // in minutes
  favoriteSubjects: string[];
  lastActiveDate?: string;
}

// ==================== PROGRESS & ANALYTICS TYPES ====================

export interface ProgressData {
  userId: string;
  subject: string;
  totalSessions: number;
  totalMessages: number;
  conceptsLearned: string[];
  skillLevel: SkillLevel;
  progressPercentage: number;
  lastActivity: string;
  weeklyProgress: WeeklyProgress[];
  monthlyProgress: MonthlyProgress[];
  strengths: string[];
  areasToImprove: string[];
}

export interface WeeklyProgress {
  week: string; // ISO week format (YYYY-WXX)
  year: number;
  weekNumber: number;
  sessions: number;
  messages: number;
  conceptsLearned: number;
  studyTime: number; // in minutes
  startDate: string;
  endDate: string;
}

export interface MonthlyProgress {
  month: string; // YYYY-MM format
  year: number;
  monthNumber: number;
  sessions: number;
  messages: number;
  conceptsLearned: number;
  studyTime: number; // in minutes
  averageScore?: number;
  startDate: string;
  endDate: string;
}

export interface AnalyticsData {
  userId: string;
  period: 'week' | 'month' | 'year' | 'all';
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    totalSessions: number;
    totalMessages: number;
    totalStudyTime: number;
    averageSessionDuration: number;
    conceptsLearned: number;
    currentStreak: number;
    longestStreak: number;
  };
  trends: {
    sessionsGrowth: number; // percentage
    messagesGrowth: number; // percentage
    studyTimeGrowth: number; // percentage
    engagementScore: number; // 0-100
  };
  subjectBreakdown: SubjectAnalytics[];
  activityData: ActivityData[];
  generatedAt: string;
}

export interface SubjectAnalytics {
  subject: string;
  sessions: number;
  messages: number;
  conceptsLearned: number;
  timeSpent: number; // in minutes
  averageSessionDuration: number;
  lastActivity: string;
  skillLevel: SkillLevel;
  progress: number; // 0-100
  trending: 'up' | 'down' | 'stable';
}

export interface SubjectProgressRecord {
  id?: string;
  userId?: string;
  subject: string;
  totalSessions: number;
  totalMessages: number;
  totalTimeSpent?: number;
  conceptsLearned: string[];
  skillLevel?: SkillLevel;
  progress: number;
  lastActivity?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityData {
  date: string; // YYYY-MM-DD
  sessions: number;
  messages: number;
  studyTime: number; // in minutes
  conceptsLearned: number;
  subjects: string[];
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// ==================== GOALS SYSTEM TYPES ====================

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  progress: number; // 0-100
  status: GoalStatus;
  priority: GoalPriority;
  category: GoalCategory;
  subject?: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  milestones: GoalMilestone[];
  isCustom: boolean;
}

export type GoalType = 
  | 'daily_sessions' 
  | 'weekly_sessions' 
  | 'monthly_sessions'
  | 'total_messages' 
  | 'concepts_learned' 
  | 'study_time' 
  | 'streak_days' 
  | 'skill_level'
  | 'subject_mastery'
  | 'custom';

export type GoalStatus = 'active' | 'paused' | 'completed' | 'expired' | 'cancelled';
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type GoalCategory = 'learning' | 'engagement' | 'skill' | 'achievement' | 'habit';

export interface GoalMilestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  targetValue: number;
  isCompleted: boolean;
  completedAt?: string;
  order: number;
}

export interface CreateGoalRequest {
  title: string;
  description: string;
  type: GoalType;
  targetValue: number;
  priority: GoalPriority;
  category: GoalCategory;
  subject?: string;
  deadline?: string;
  milestones?: Omit<GoalMilestone, 'id' | 'goalId' | 'isCompleted' | 'completedAt'>[];
}

// ==================== LEARNING PATHS TYPES ====================

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: SkillLevel;
  estimatedDuration: number; // in hours
  prerequisites: string[];
  learningObjectives: string[];
  modules: LearningModule[];
  tags: string[];
  isRecommended: boolean;
  enrollmentCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningModule {
  id: string;
  pathId: string;
  title: string;
  description: string;
  order: number;
  estimatedDuration: number; // in minutes
  type: ModuleType;
  content: ModuleContent;
  isRequired: boolean;
  prerequisites: string[];
}

export type ModuleType = 'lesson' | 'practice' | 'quiz' | 'discussion' | 'project';

export interface ModuleContent {
  type: 'text' | 'conversation' | 'quiz' | 'interactive';
  title: string;
  description: string;
  instructions?: string;
  prompts?: string[]; // For AI conversation modules
  questions?: QuizQuestion[]; // For quiz modules
  resources?: Resource[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: string[]; // For multiple choice
  correctAnswer?: string | number;
  explanation?: string;
  points: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'link' | 'document' | 'video' | 'image';
  url: string;
  description?: string;
}

export interface UserPathProgress {
  id: string;
  userId: string;
  pathId: string;
  status: PathStatus;
  progress: number; // 0-100
  currentModuleId?: string;
  completedModules: string[];
  startedAt: string;
  lastActivityAt: string;
  completedAt?: string;
  totalTimeSpent: number; // in minutes
  moduleProgress: ModuleProgress[];
  score?: number; // Overall path score 0-100
}

export type PathStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';

export interface ModuleProgress {
  moduleId: string;
  status: ModuleStatus;
  progress: number; // 0-100
  timeSpent: number; // in minutes
  score?: number; // 0-100
  attempts: number;
  completedAt?: string;
  lastAttemptAt?: string;
}

export type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'failed';

// ==================== ACHIEVEMENTS SYSTEM TYPES ====================

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  badgeUrl?: string;
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  isSecret: boolean;
  points: number;
  unlockedCount: number; // How many users have unlocked this
  createdAt: string;
}

export type AchievementType = 
  | 'milestone' 
  | 'streak' 
  | 'completion' 
  | 'skill' 
  | 'exploration' 
  | 'consistency'
  | 'excellence'
  | 'special';

export type AchievementCategory = 
  | 'learning' 
  | 'engagement' 
  | 'consistency' 
  | 'excellence' 
  | 'exploration' 
  | 'social'
  | 'milestone'
  | 'special';

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface AchievementRequirement {
  type: 'sessions_count' | 'messages_count' | 'streak_days' | 'concepts_learned' | 'study_time' | 'skill_level' | 'path_completion' | 'goal_completion';
  operator: 'gte' | 'lte' | 'eq' | 'gt' | 'lt';
  value: number | string;
  subject?: string;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
}

export interface AchievementReward {
  type: 'points' | 'badge' | 'title' | 'unlock_feature' | 'learning_path';
  value: string;
  description: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  progress: number; // 0-100
  isCompleted: boolean;
  completedAt?: string;
  currentValues: Record<string, number>; // Current progress values
  notificationSent: boolean;
  achievement?: Achievement; // Populated achievement data
}

// ==================== DASHBOARD DATA TYPES ====================

export interface DashboardData {
  user: User & { profile?: UserProfile };
  stats: UserStats;
  recentSessions: RecentSession[];
  progressSummary: ProgressSummary;
  activeGoals: Goal[];
  recentAchievements: UserAchievement[];
  recommendedPaths: LearningPath[];
  upcomingMilestones: GoalMilestone[];
  weeklyActivity: WeeklyProgress[];
  subjectProgress: SubjectAnalytics[];
}

export interface RecentSession {
  id: string;
  subject?: string;
  messageCount: number;
  duration: number; // in minutes
  conceptsLearned: string[];
  createdAt: string;
  lastMessageAt?: string;
}

export interface ProgressSummary {
  totalProgress: number; // 0-100 overall progress
  weeklyGrowth: number; // percentage growth this week
  monthlyGrowth: number; // percentage growth this month
  strongestSubjects: string[];
  areasForImprovement: string[];
  nextMilestones: string[];
  studyStreak: {
    current: number;
    longest: number;
  };
}

// ==================== API REQUEST/RESPONSE TYPES ====================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
  timestamp: string;
}

export interface FilterOptions {
  subjects?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  difficulty?: SkillLevel[];
  status?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  search?: string;
}

// ==================== COMPONENT PROPS TYPES ====================

export interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  width?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  color?: string | string[];
  className?: string;
  type?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, unknown>;
  date?: string; // For time-series data
}

export interface ProgressCardProps {
  title: string;
  value: number;
  total?: number;
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
  isLoading?: boolean;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value: number;
    label: string;
  };
  color?: string;
  className?: string;
}

export interface GoalCardProps {
  goal: Goal;
  onUpdate?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onComplete?: (goalId: string) => void;
  onPause?: (goalId: string) => void;
  className?: string;
  showActions?: boolean;
}

export interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  isLocked?: boolean;
  showProgress?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface PathCardProps {
  path: LearningPath;
  userProgress?: UserPathProgress;
  onEnroll?: (pathId: string) => void;
  onContinue?: (pathId: string) => void;
  onView?: (pathId: string) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
}

// ==================== FORM TYPES ====================

export interface CreateMessageRequest {
  content: string;
  metadata?: {
    subject?: string;
    context?: string;
  };
}

export interface UpdateUserProfileRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

// ==================== UTILITY TYPES ====================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch?: string;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement';
  title: string;
  message: string;
  duration?: number; // in milliseconds
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: string;
}

// ==================== CONSTANTS ====================

export const SUBJECTS = {
  MATHEMATICS: 'mathematics',
  HISTORY: 'history',
  GRAMMAR: 'grammar',
  SCIENCE: 'science',
  LITERATURE: 'literature',
  GEOGRAPHY: 'geography',
  PHYSICS: 'physics',
  CHEMISTRY: 'chemistry',
  BIOLOGY: 'biology',
  PHILOSOPHY: 'philosophy',
} as const;

export type SubjectType = typeof SUBJECTS[keyof typeof SUBJECTS];

export const SKILL_LEVELS: Record<SkillLevel, { label: string; color: string; order: number }> = {
  beginner: { label: 'Principiante', color: 'green', order: 1 },
  intermediate: { label: 'Intermedio', color: 'blue', order: 2 },
  advanced: { label: 'Avanzado', color: 'purple', order: 3 },
  expert: { label: 'Experto', color: 'gold', order: 4 },
};

export const GOAL_TYPES: Record<GoalType, { label: string; description: string; unit: string }> = {
  daily_sessions: { 
    label: 'Sesiones diarias', 
    description: 'Completar un número específico de sesiones por día',
    unit: 'sesiones/día'
  },
  weekly_sessions: { 
    label: 'Sesiones semanales', 
    description: 'Completar un número específico de sesiones por semana',
    unit: 'sesiones/semana'
  },
  monthly_sessions: { 
    label: 'Sesiones mensuales', 
    description: 'Completar un número específico de sesiones por mes',
    unit: 'sesiones/mes'
  },
  total_messages: { 
    label: 'Total de mensajes', 
    description: 'Enviar un número total de mensajes',
    unit: 'mensajes'
  },
  concepts_learned: { 
    label: 'Conceptos aprendidos', 
    description: 'Aprender un número específico de conceptos nuevos',
    unit: 'conceptos'
  },
  study_time: { 
    label: 'Tiempo de estudio', 
    description: 'Dedicar una cantidad específica de tiempo al estudio',
    unit: 'minutos'
  },
  streak_days: { 
    label: 'Días consecutivos', 
    description: 'Mantener una racha de días consecutivos estudiando',
    unit: 'días'
  },
  skill_level: { 
    label: 'Nivel de habilidad', 
    description: 'Alcanzar un nivel específico de habilidad en una materia',
    unit: 'nivel'
  },
  subject_mastery: { 
    label: 'Dominio de materia', 
    description: 'Dominar completamente una materia específica',
    unit: 'porcentaje'
  },
  custom: { 
    label: 'Personalizado', 
    description: 'Objetivo personalizado definido por el usuario',
    unit: 'unidades'
  },
};

export const ACHIEVEMENT_RARITIES: Record<AchievementRarity, { 
  label: string; 
  color: string; 
  icon: string;
}> = {
  common: { label: 'Común', color: 'gray', icon: '🥉' },
  uncommon: { label: 'Poco común', color: 'green', icon: '🥈' },
  rare: { label: 'Raro', color: 'blue', icon: '🥇' },
  epic: { label: 'Épico', color: 'purple', icon: '💎' },
  legendary: { label: 'Legendario', color: 'gold', icon: '👑' },
};
