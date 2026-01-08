// Progress and analytics types

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

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
    week: string;
    year: number;
    weekNumber: number;
    sessions: number;
    messages: number;
    conceptsLearned: number;
    studyTime: number;
    startDate: string;
    endDate: string;
}

export interface MonthlyProgress {
    month: string;
    year: number;
    monthNumber: number;
    sessions: number;
    messages: number;
    conceptsLearned: number;
    studyTime: number;
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
        sessionsGrowth: number;
        messagesGrowth: number;
        studyTimeGrowth: number;
        engagementScore: number;
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
    timeSpent: number;
    averageSessionDuration: number;
    lastActivity: string;
    skillLevel: SkillLevel;
    progress: number;
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
    xp: number;
    level: number;
    lastActivity?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ActivityData {
    date: string;
    sessions: number;
    messages: number;
    studyTime: number;
    conceptsLearned: number;
    subjects: string[];
}
