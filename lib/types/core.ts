// Core backend types aligned with Prisma schema

export interface User {
    id: string;
    email: string;
    fullName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChatSession {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt?: string;
    messages?: ChatMessage[];
}

export interface ChatMessage {
    id: string;
    sessionId: string;
    content: string;
    isUserMessage: boolean;
    createdAt: string;
    role?: 'user' | 'assistant';
}

export interface CreateChatResponse {
    id: string;
    userId: string;
    createdAt: string;
}

export interface AddMessageResponse {
    userMessage: {
        id: string;
        sessionId: string;
        content: string;
        isUserMessage: boolean;
        createdAt: string;
    };
    assistantMessage: {
        id: string;
        sessionId: string;
        content: string;
        isUserMessage: boolean;
        createdAt: string;
    };
}

export interface Message {
    id: string;
    sessionId: string;
    content: string;
    role: 'user' | 'assistant';
    createdAt: string;
}

export interface Subject {
    id: string;
    name: string;
    difficulty: string;
    concepts: string[];
}
