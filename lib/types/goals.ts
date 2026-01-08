// Goals system types

export interface Goal {
    id: string;
    userId: string;
    title: string;
    description: string;
    type: GoalType;
    targetValue: number;
    currentValue: number;
    progress: number;
    status: GoalStatus;
    priority: GoalPriority;
    category: GoalCategory;
    subject?: string;
    deadline?: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    milestones: GoalMilestone[];
    isCustom: boolean;
}

export type GoalType =
    | 'daily_sessions'
    | 'weekly_sessions'
    | 'monthly_sessions'
    | 'total_messages'
    | 'concepts_learned'
    | 'study_time'
    | 'streak_days'
    | 'skill_level'
    | 'subject_mastery'
    | 'custom';

export type GoalStatus = 'active' | 'paused' | 'completed' | 'expired' | 'cancelled';
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type GoalCategory = 'learning' | 'engagement' | 'skill' | 'achievement' | 'habit';

export interface GoalMilestone {
    id: string;
    goalId: string;
    title: string;
    description: string;
    targetValue: number;
    isCompleted: boolean;
    completedAt?: string;
    order: number;
}

export interface CreateGoalRequest {
    title: string;
    description: string;
    type: GoalType;
    targetValue: number;
    priority: GoalPriority;
    category: GoalCategory;
    subject?: string;
    deadline?: string;
    milestones?: Omit<GoalMilestone, 'id' | 'goalId' | 'isCompleted' | 'completedAt'>[];
}

export const GOAL_TYPES: Record<GoalType, { label: string; description: string; unit: string }> = {
    daily_sessions: {
        label: 'Sesiones diarias',
        description: 'Completar un número específico de sesiones por día',
        unit: 'sesiones/día'
    },
    weekly_sessions: {
        label: 'Sesiones semanales',
        description: 'Completar un número específico de sesiones por semana',
        unit: 'sesiones/semana'
    },
    monthly_sessions: {
        label: 'Sesiones mensuales',
        description: 'Completar un número específico de sesiones por mes',
        unit: 'sesiones/mes'
    },
    total_messages: {
        label: 'Total de mensajes',
        description: 'Enviar un número total de mensajes',
        unit: 'mensajes'
    },
    concepts_learned: {
        label: 'Conceptos aprendidos',
        description: 'Aprender un número específico de conceptos nuevos',
        unit: 'conceptos'
    },
    study_time: {
        label: 'Tiempo de estudio',
        description: 'Dedicar una cantidad específica de tiempo al estudio',
        unit: 'minutos'
    },
    streak_days: {
        label: 'Días consecutivos',
        description: 'Mantener una racha de días consecutivos estudiando',
        unit: 'días'
    },
    skill_level: {
        label: 'Nivel de habilidad',
        description: 'Alcanzar un nivel específico de habilidad en una materia',
        unit: 'nivel'
    },
    subject_mastery: {
        label: 'Dominio de materia',
        description: 'Dominar completamente una materia específica',
        unit: 'porcentaje'
    },
    custom: {
        label: 'Personalizado',
        description: 'Objetivo personalizado definido por el usuario',
        unit: 'unidades'
    },
};
