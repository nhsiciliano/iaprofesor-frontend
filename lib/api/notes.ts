// Notes API

import { authenticatedFetch } from './client';

export interface Note {
    id: string;
    content: string;
    tags: string[];
    userId: string;
    subjectId?: string;
    sessionId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNoteDto {
    content: string;
    tags?: string[];
    subjectId?: string;
    sessionId?: string;
}

export async function getNotes(subjectId?: string): Promise<Note[]> {
    const query = subjectId ? `?subjectId=${subjectId}` : '';
    return authenticatedFetch(`/notes${query}`);
}

export async function createNote(data: CreateNoteDto): Promise<Note> {
    return authenticatedFetch('/notes', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function deleteNote(id: string): Promise<void> {
    return authenticatedFetch(`/notes/${id}`, {
        method: 'DELETE',
    });
}
