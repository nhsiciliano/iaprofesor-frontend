// Types index - Re-exports all types from domain modules

// Core types
export type {
    User,
    ChatSession,
    ChatMessage,
    CreateChatResponse,
    AddMessageResponse,
    Message,
    Subject,
} from './core';

// User types
export type {
    UserProfile,
    UserPreferences,
    UserStats,
    UpdateUserProfileRequest,
} from './user';

// Progress types
export type {
    SkillLevel,
    ProgressData,
    WeeklyProgress,
    MonthlyProgress,
    AnalyticsData,
    SubjectAnalytics,
    SubjectProgressRecord,
    ActivityData,
} from './progress';

// Goals types
export type {
    Goal,
    GoalType,
    GoalStatus,
    GoalPriority,
    GoalCategory,
    GoalMilestone,
    CreateGoalRequest,
} from './goals';
export { GOAL_TYPES } from './goals';

// Achievements types
export type {
    Achievement,
    AchievementType,
    AchievementCategory,
    AchievementRarity,
    AchievementRequirement,
    AchievementReward,
    UserAchievement,
} from './achievements';
export { ACHIEVEMENT_RARITIES } from './achievements';

// Learning paths types
export type {
    LearningPath,
    LearningModule,
    ModuleType,
    ModuleContent,
    QuizQuestion,
    Resource,
    UserPathProgress,
    PathStatus,
    ModuleProgress,
    ModuleStatus,
} from './learning-paths';

// UI types
export type {
    DashboardData,
    RecentSession,
    ProgressSummary,
    ApiResponse,
    PaginatedResponse,
    FilterOptions,
    ChartProps,
    ChartDataPoint,
    ProgressCardProps,
    StatCardProps,
    GoalCardProps,
    AchievementCardProps,
    PathCardProps,
    CreateMessageRequest,
    LoadingState,
    AsyncState,
    NotificationData,
    SubjectType,
} from './ui';
export { SUBJECTS, SKILL_LEVELS } from './ui';
