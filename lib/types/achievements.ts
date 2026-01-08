// Achievements system types

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
    unlockedCount: number;
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
    progress: number;
    isCompleted: boolean;
    completedAt?: string;
    currentValues: Record<string, number>;
    notificationSent: boolean;
    achievement?: Achievement;
}

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
