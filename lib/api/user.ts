// User API - profile, authentication

import { authenticatedFetch } from './client';
import type { UserProfile, UpdateUserProfileRequest } from '../types';

export async function getCurrentUser() {
    return authenticatedFetch('/auth/user');
}

export async function getUserProfile(userId: string) {
    return authenticatedFetch(`/users/${userId}`);
}

export async function updateUserProfile(userId: string, data: UpdateUserProfileRequest) {
    return authenticatedFetch(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

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
