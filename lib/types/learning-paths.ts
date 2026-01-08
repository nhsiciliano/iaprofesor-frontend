// Learning paths types

import type { SkillLevel } from './progress';

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    subject: string;
    difficulty: SkillLevel;
    estimatedDuration: number;
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
    estimatedDuration: number;
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
    prompts?: string[];
    questions?: QuizQuestion[];
    resources?: Resource[];
}

export interface QuizQuestion {
    id: string;
    question: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
    options?: string[];
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
    progress: number;
    currentModuleId?: string;
    completedModules: string[];
    startedAt: string;
    lastActivityAt: string;
    completedAt?: string;
    totalTimeSpent: number;
    moduleProgress: ModuleProgress[];
    score?: number;
}

export type PathStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';

export interface ModuleProgress {
    moduleId: string;
    status: ModuleStatus;
    progress: number;
    timeSpent: number;
    score?: number;
    attempts: number;
    completedAt?: string;
    lastAttemptAt?: string;
}

export type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'failed';
