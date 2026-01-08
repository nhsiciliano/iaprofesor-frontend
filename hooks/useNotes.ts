import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getNotes, createNote, deleteNote, type Note, type CreateNoteDto } from '@/lib/api';

export function useNotes(subjectId?: string) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotes = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getNotes(subjectId);
            setNotes(data);
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast.error('Error al cargar las notas');
        } finally {
            setIsLoading(false);
        }
    }, [subjectId]);

    const addNote = useCallback(async (data: CreateNoteDto) => {
        try {
            const newNote = await createNote(data);
            setNotes(prev => [newNote, ...prev]);
            toast.success('Nota guardada correctamente');
            return newNote;
        } catch (error) {
            console.error('Error creating note:', error);
            toast.error('Error al guardar la nota');
            throw error;
        }
    }, []);

    const removeNote = useCallback(async (id: string) => {
        try {
            await deleteNote(id);
            setNotes(prev => prev.filter(note => note.id !== id));
            toast.success('Nota eliminada');
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error('Error al eliminar la nota');
        }
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return {
        notes,
        isLoading,
        fetchNotes,
        addNote,
        removeNote,
    };
}
