// Learning Paths API

import { authenticatedFetch } from './client';
import type { LearningPath, UserPathProgress, FilterOptions } from '../types';

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

export async function getRecommendedPaths(
    limit: number = 6
): Promise<LearningPath[]> {
    return authenticatedFetch(`/users/me/learning-paths/recommended?limit=${limit}`);
}

export async function getLearningPath(pathId: string): Promise<LearningPath> {
    return authenticatedFetch(`/learning-paths/${pathId}`);
}

export async function enrollInLearningPath(pathId: string): Promise<UserPathProgress> {
    return authenticatedFetch(`/users/me/learning-paths/${pathId}/enroll`, {
        method: 'POST',
    });
}

export async function getUserPathProgress(
    pathId?: string
): Promise<UserPathProgress[]> {
    const url = pathId
        ? `/users/me/learning-paths/${pathId}/progress`
        : '/users/me/learning-paths/progress';

    return authenticatedFetch(url);
}

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
