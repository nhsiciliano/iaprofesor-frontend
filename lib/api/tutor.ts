// Tutor API - sessions, messages, streaming

import { authenticatedFetch, BACKEND_URL } from './client';
import { getAccessToken } from '../auth';
import type { Subject, SubjectProgressRecord } from '../types';

// Local types for this module
export interface ChatSession {
    id: string;
    userId: string;
    subject?: string;
    createdAt: string;
    updatedAt: string;
    messages?: Message[];
}

export interface Message {
    id: string;
    sessionId: string;
    content: string;
    isUserMessage: boolean;
    createdAt: string;
    analysis?: {
        difficulty: string;
        messageType: string;
        concepts: string[];
    };
    attachments?: { type: string; url?: string; base64?: string; mimeType?: string }[];
}

export interface CreateChatResponse {
    id: string;
    userId: string;
    subject?: string;
    createdAt: string;
}

export interface AddMessageResponse {
    userMessage: Message;
    assistantMessage: Message;
}

export interface StreamChunk {
    type: 'user_message' | 'chunk' | 'done' | 'error';
    data: {
        content?: string;
        message?: string;
        userMessage?: Message;
        assistantMessage?: Message;
    };
}

export async function createChatSession(data?: { subject?: string }): Promise<CreateChatResponse> {
    return authenticatedFetch('/tutor/sessions', {
        method: 'POST',
        body: JSON.stringify(data || {}),
    });
}

export async function getAvailableSubjects(): Promise<Subject[]> {
    return authenticatedFetch('/tutor/subjects');
}

export async function getUserSessions(subject?: string, search?: string): Promise<ChatSession[]> {
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (search) params.append('search', search);

    return authenticatedFetch(`/tutor/sessions?${params.toString()}`);
}

export async function getUserProgress(subject: string): Promise<SubjectProgressRecord> {
    return authenticatedFetch(`/tutor/progress/${encodeURIComponent(subject)}`);
}

export async function getChatMessages(sessionId: string): Promise<Message[]> {
    return authenticatedFetch(`/tutor/sessions/${sessionId}/messages`);
}

export async function sendMessage(
    sessionId: string,
    content: string,
    attachments: { type: string; url?: string; base64?: string; mimeType?: string }[] = []
): Promise<AddMessageResponse> {
    return authenticatedFetch(`/tutor/sessions/${sessionId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content, attachments }),
    });
}

export async function* sendMessageStream(
    sessionId: string,
    content: string,
    attachments: { type: string; url?: string; base64?: string; mimeType?: string }[] = []
): AsyncGenerator<StreamChunk> {
    const token = await getAccessToken();

    if (!token) {
        throw new Error('No hay token de autenticación disponible');
    }

    const prepare = await authenticatedFetch(`/tutor/sessions/${sessionId}/messages/prepare`, {
        method: 'POST',
        body: JSON.stringify({ content, attachments }),
    });

    const messageId = prepare?.userMessage?.id;
    if (!messageId) {
        throw new Error('No message id returned for streaming');
    }

    const params = new URLSearchParams();
    params.set('messageId', messageId);

    const response = await fetch(`${BACKEND_URL}/tutor/sessions/${sessionId}/messages/stream?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/event-stream',
        },
    });

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('Has excedido el límite de solicitudes. Por favor, espera un minuto antes de intentar de nuevo.');
        }
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
        throw new Error('No response body available');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let currentEvent = 'message';

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('event:')) {
                    currentEvent = line.substring(6).trim() || 'message';
                    continue;
                }

                if (line.startsWith('data:')) {
                    const dataStr = line.substring(5).trim();
                    if (!dataStr) {
                        continue;
                    }

                    try {
                        const parsedData = JSON.parse(dataStr);
                        yield {
                            type: currentEvent as StreamChunk['type'],
                            data: parsedData,
                        };
                    } catch {
                        yield {
                            type: currentEvent as StreamChunk['type'],
                            data: { message: dataStr },
                        };
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}

export async function updateSessionDuration(
    sessionId: string,
    durationSeconds: number
): Promise<{ success: boolean }> {
    return authenticatedFetch(`/tutor/sessions/${sessionId}/duration`, {
        method: 'POST',
        body: JSON.stringify({ durationSeconds }),
    });
}
