// Goals API

import { authenticatedFetch } from './client';
import type { Goal, CreateGoalRequest } from '../types';

export async function getUserGoals(
    status?: 'active' | 'completed' | 'paused',
    limit?: number
): Promise<Goal[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());

    return authenticatedFetch(`/users/me/goals?${params.toString()}`);
}

export async function createGoal(goalData: CreateGoalRequest): Promise<Goal> {
    return authenticatedFetch('/users/me/goals', {
        method: 'POST',
        body: JSON.stringify(goalData),
    });
}

export async function updateGoal(
    goalId: string,
    updates: Partial<Goal>
): Promise<Goal> {
    return authenticatedFetch(`/users/me/goals/${goalId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    });
}

export async function completeGoal(goalId: string): Promise<Goal> {
    return authenticatedFetch(`/users/me/goals/${goalId}/complete`, {
        method: 'POST',
    });
}

export async function toggleGoalStatus(
    goalId: string,
    status: 'active' | 'paused'
): Promise<Goal> {
    return authenticatedFetch(`/users/me/goals/${goalId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}

export async function deleteGoal(goalId: string): Promise<void> {
    return authenticatedFetch(`/users/me/goals/${goalId}`, {
        method: 'DELETE',
    });
}
