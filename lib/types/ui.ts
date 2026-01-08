// UI, Dashboard, and component prop types

import type { User } from './core';
import type { UserProfile, UserStats } from './user';
import type { WeeklyProgress, SubjectAnalytics, SkillLevel } from './progress';
import type { Goal, GoalMilestone } from './goals';
import type { Achievement, UserAchievement } from './achievements';
import type { LearningPath, UserPathProgress } from './learning-paths';

// Dashboard Data
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
    duration: number;
    conceptsLearned: string[];
    createdAt: string;
    lastMessageAt?: string;
}

export interface ProgressSummary {
    totalProgress: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
    strongestSubjects: string[];
    areasForImprovement: string[];
    nextMilestones: string[];
    studyStreak: {
        current: number;
        longest: number;
    };
}

// API Response Types
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

// Chart Types
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
    date?: string;
}

// Component Props
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

// Form Types
export interface CreateMessageRequest {
    content: string;
    metadata?: {
        subject?: string;
        context?: string;
    };
}

// Utility Types
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
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    createdAt: string;
}

// Constants
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
