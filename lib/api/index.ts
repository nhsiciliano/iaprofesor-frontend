// API index - Re-exports all API modules

// Client utilities
export { authenticatedFetch, ApiError, useApiCall, BACKEND_URL } from './client';

// Tutor API
export {
    createChatSession,
    getAvailableSubjects,
    getUserSessions,
    getUserProgress,
    getChatMessages,
    sendMessage,
    sendMessageStream,
    updateSessionDuration,
} from './tutor';
export type {
    ChatSession,
    Message,
    CreateChatResponse,
    AddMessageResponse,
    StreamChunk,
} from './tutor';

// User API
export {
    getCurrentUser,
    getUserProfile,
    updateUserProfile,
    updateUserProfileExtended,
    getUserProfileExtended,
} from './user';

// Progress & Analytics API
export {
    getUserStats,
    getProgressData,
    getAnalyticsData,
    getRecentSessions,
    getDashboardData,
    trackUserActivity,
    getChartData,
} from './progress';

// Goals API
export {
    getUserGoals,
    createGoal,
    updateGoal,
    completeGoal,
    toggleGoalStatus,
    deleteGoal,
} from './goals';

// Achievements API
export {
    getAllAchievements,
    getUserAchievements,
    getRecentAchievements,
    markAchievementNotified,
} from './achievements';

// Learning Paths API
export {
    getAllLearningPaths,
    getRecommendedPaths,
    getLearningPath,
    enrollInLearningPath,
    getUserPathProgress,
    updateModuleProgress,
} from './learning-paths';

// Notes API
export {
    getNotes,
    createNote,
    deleteNote,
} from './notes';
export type { Note, CreateNoteDto } from './notes';
