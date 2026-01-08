// Progress & Analytics API

import { authenticatedFetch } from './client';
import { getCurrentUser } from './user';
import { getUserGoals } from './goals';
import { getRecentAchievements } from './achievements';
import { getRecommendedPaths } from './learning-paths';
import type {
    UserStats,
    ProgressData,
    AnalyticsData,
    DashboardData,
    RecentSession,
    WeeklyProgress,
    ChartDataPoint,
} from '../types';

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

export async function getProgressData(
    subject?: string,
    period: 'week' | 'month' | 'year' = 'month'
): Promise<ProgressData[]> {
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    params.append('period', period);

    return authenticatedFetch(`/users/me/progress?${params.toString()}`);
}

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

export async function getRecentSessions(
    limit: number = 10,
    subject?: string
): Promise<RecentSession[]> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (subject) params.append('subject', subject);

    return authenticatedFetch(`/users/me/sessions/recent?${params.toString()}`);
}

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
        console.warn('Failed to track user activity:', error);
    });
}

export async function getChartData(
    chartType: 'sessions' | 'messages' | 'study_time' | 'subjects',
    period: 'week' | 'month' | 'year' = 'month'
): Promise<ChartDataPoint[]> {
    return authenticatedFetch(`/users/me/charts/${chartType}?period=${period}`);
}
