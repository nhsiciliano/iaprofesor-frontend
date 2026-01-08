// User profile and preferences types

export interface UserProfile {
    id: string;
    userId: string;
    role?: string;
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
    totalStudyTime: number;
    averageSessionDuration: number;
    favoriteSubjects: string[];
    lastActiveDate?: string;
}

export interface UpdateUserProfileRequest {
    displayName?: string;
    bio?: string;
    avatar?: string;
    preferences?: Partial<UserPreferences>;
}
