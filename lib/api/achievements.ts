// Achievements API

import { authenticatedFetch } from './client';
import type { Achievement, UserAchievement } from '../types';

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

export async function getUserAchievements(
    status?: 'completed' | 'in_progress' | 'locked'
): Promise<UserAchievement[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    const query = params.toString();
    const url = query ? `/users/me/achievements?${query}` : '/users/me/achievements';
    return authenticatedFetch(url);
}

export async function getRecentAchievements(
    limit: number = 5
): Promise<UserAchievement[]> {
    return authenticatedFetch(`/users/me/achievements/recent?limit=${limit}`);
}

export async function markAchievementNotified(achievementId: string): Promise<void> {
    return authenticatedFetch(`/users/me/achievements/${achievementId}/notify`, {
        method: 'POST',
    });
}
