import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from "sonner";
import {
  createChatSession,
  getChatMessages,
  sendMessage,
  sendMessageStream,
  getUserSessions,
  getUserProgress,
  getAvailableSubjects,
  updateSessionDuration,
  type Message,
  type ChatSession,
  type AddMessageResponse,
  type StreamChunk
} from '@/lib/api';
import type { Subject, SubjectProgressRecord } from '@/lib/types';

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  attachments?: any[];
}

interface SubjectSession {
  sessionId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  startTime?: number; // timestamp cuando se inició la sesión
  totalDuration?: number; // duración acumulada en segundos
}

interface TutorSessionsState {
  currentSubject: string | null;
  subjectSessions: Record<string, SubjectSession>;
  availableSubjects: Subject[];
  isLoadingSubjects: boolean;
}

export function useTutorSessions() {
  const [state, setState] = useState<TutorSessionsState>({
    currentSubject: null,
    subjectSessions: {},
    availableSubjects: [],
    isLoadingSubjects: false,
  });

  const subjectSessionsRef = useRef(state.subjectSessions);
  const currentSubjectRef = useRef(state.currentSubject);

  useEffect(() => {
    subjectSessionsRef.current = state.subjectSessions;
  }, [state.subjectSessions]);

  useEffect(() => {
    currentSubjectRef.current = state.currentSubject;
  }, [state.currentSubject]);

  // Helper para actualizar una sesión específica
  const updateSubjectSession = useCallback((subjectId: string, updates: Partial<SubjectSession>) => {
    setState(prev => ({
      ...prev,
      subjectSessions: {
        ...prev.subjectSessions,
        [subjectId]: {
          ...prev.subjectSessions[subjectId],
          ...updates
        }
      }
    }));
  }, []);

  // Cargar materias disponibles
  const loadAvailableSubjects = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoadingSubjects: true }));
      const subjects = await getAvailableSubjects();
      setState(prev => ({
        ...prev,
        availableSubjects: subjects,
        isLoadingSubjects: false
      }));
      return subjects;
    } catch (error) {
      toast.error('Error al cargar las materias disponibles');
      console.error('Error loading subjects:', error);
      setState(prev => ({ ...prev, isLoadingSubjects: false }));
      throw error;
    }
  }, []);

  // Funciones de tracking de tiempo
  const startTimer = useCallback((subject: string) => {
    const now = Date.now();
    updateSubjectSession(subject, {
      startTime: now,
    });
  }, [updateSubjectSession]);

  const stopTimer = useCallback(async (subject: string) => {
    const session = state.subjectSessions[subject];
    if (session?.sessionId && session.startTime) {
      const now = Date.now();
      const sessionDuration = Math.floor((now - session.startTime) / 1000); // en segundos
      const totalDuration = (session.totalDuration || 0) + sessionDuration;

      try {
        // Actualizar duración en el servidor
        await updateSessionDuration(session.sessionId, totalDuration);

        // Actualizar estado local
        updateSubjectSession(subject, {
          totalDuration,
          startTime: undefined,
        });
      } catch (error) {
        // Silently log this error as it's background sync
        console.error('Error updating session duration:', error);
      }
    }
  }, [state.subjectSessions, updateSubjectSession]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const flushTimer = () => {
      const subject = currentSubjectRef.current;
      if (!subject) {
        return;
      }
      const session = subjectSessionsRef.current[subject];
      if (session?.startTime) {
        void stopTimer(subject);
      }
    };

    window.addEventListener('beforeunload', flushTimer);
    return () => {
      window.removeEventListener('beforeunload', flushTimer);
      flushTimer();
    };
  }, [stopTimer]);

  // Cargar una sesión específica (historial)
  const loadSession = useCallback(async (sessionId: string, subject: string) => {
    try {
      updateSubjectSession(subject, { isLoading: true });
      // Cambiar a la materia de esta sesión
      setState(prev => ({ ...prev, currentSubject: subject }));

      console.log(`Cargando sesión específica: ${sessionId}`);
      const existingMessages: Message[] = await getChatMessages(sessionId);
      const messages: ChatMessage[] = existingMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.isUserMessage ? "user" : "assistant",
        timestamp: msg.createdAt
      }));

      updateSubjectSession(subject, {
        sessionId,
        messages,
        isLoading: false,
      });

      // Asegurarse de que el timer arranque para esta sesión si es la activa
      startTimer(subject);
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Error al cargar la sesión del historial');
      updateSubjectSession(subject, { isLoading: false });
      throw error;
    }
  }, [updateSubjectSession, startTimer]);

  // Crear o recuperar sesión para una materia
  const getOrCreateSession = useCallback(async (subject: string): Promise<string> => {
    const existingSession = state.subjectSessions[subject];

    if (existingSession?.sessionId) {
      return existingSession.sessionId;
    }

    try {
      updateSubjectSession(subject, { isLoading: true });

      // Primero intentar cargar sesiones existentes del usuario para esta materia
      console.log(`Buscando sesiones existentes para la materia: ${subject}`);
      const userSessions = await getUserSessions(subject);

      let sessionId: string;
      let messages: ChatMessage[] = [];

      if (userSessions.length > 0) {
        // Usar la sesión más reciente para esta materia
        const mostRecentSession = userSessions[0];
        sessionId = mostRecentSession.id;

        console.log(`Cargando sesión existente: ${sessionId}`);

        // Cargar mensajes de la sesión existente
        const existingMessages: Message[] = await getChatMessages(sessionId);
        messages = existingMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.isUserMessage ? "user" : "assistant",
          timestamp: msg.createdAt
        }));

        console.log(`Cargados ${messages.length} mensajes de la sesión existente`);
      } else {
        // Crear nueva sesión si no existe ninguna para esta materia
        console.log(`Creando nueva sesión para la materia: ${subject}`);
        const session = await createChatSession({ subject });

        if (!session) {
          throw new Error('Failed to create session');
        }

        sessionId = session.id;
        messages = [];
      }

      updateSubjectSession(subject, {
        sessionId,
        messages,
        isLoading: false,
      });

      return sessionId;
    } catch (error) {
      console.error('Error getting/creating session for subject:', subject, error);
      toast.error(`Error al iniciar sesión de ${subject}. Intenta reiniciar el servidor.`);
      updateSubjectSession(subject, { isLoading: false });
      throw error;
    }
  }, [state.subjectSessions, updateSubjectSession]);

  // Seleccionar materia activa
  const selectSubject = useCallback(async (subject: string) => {
    // Parar el timer de la materia actual antes de cambiar
    if (state.currentSubject && state.currentSubject !== subject) {
      await stopTimer(state.currentSubject);
    }

    setState(prev => ({ ...prev, currentSubject: subject }));

    // Asegurar que existe una sesión para esta materia
    if (!state.subjectSessions[subject]?.sessionId) {
      await getOrCreateSession(subject);
    }

    // Iniciar el timer para la nueva materia
    startTimer(subject);
  }, [state.subjectSessions, state.currentSubject, getOrCreateSession, startTimer, stopTimer]);

  // Estado para archivos adjuntos
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [attachmentData, setAttachmentData] = useState<{ type: string; mimeType: string; base64: string } | null>(null);

  // Manejar selección de archivo
  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;

    // Validar tipo (imágenes)
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes por ahora');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es muy grande (máx 5MB)');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);

    // Convertir a Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extraer solo la parte de datos base64 (eliminar "data:image/png;base64,")
      const base64Data = base64String.split(',')[1];

      setAttachmentData({
        type: 'image',
        mimeType: file.type,
        base64: base64Data
      });
    };
    reader.readAsDataURL(file);
  }, []);

  // Limpiar archivo seleccionado
  const clearFile = useCallback(() => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    setAttachmentData(null);
  }, [filePreview]);

  // Enviar mensaje con streaming
  const sendChatMessage = useCallback(async (content: string): Promise<void> => {
    const { currentSubject } = state;

    if (!currentSubject) {
      throw new Error('No subject selected');
    }

    const currentSession = state.subjectSessions[currentSubject];
    if (!currentSession?.sessionId) {
      throw new Error('No active session for current subject');
    }

    // Preparar attachments
    const currentAttachments = attachmentData ? [attachmentData] : [];

    // Si hay archivo, limpiarlo del estado UI inmediatamente para evitar reenvíos
    const tempFilePreview = filePreview;
    clearFile();

    // Agregar mensaje del usuario inmediatamente (optimistic update)
    const userMessage: ChatMessage & { attachments?: any[] } = {
      id: `temp-user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date().toISOString(),
      // Mostrar preview localmente si existe
      attachments: tempFilePreview ? [{ type: 'image', url: tempFilePreview }] : undefined
    };

    // Crear placeholder para el mensaje del asistente (streaming)
    const assistantPlaceholder: ChatMessage = {
      id: `temp-assistant-${Date.now()}`,
      content: "",
      role: "assistant",
      timestamp: new Date().toISOString(),
    };

    updateSubjectSession(currentSubject, {
      messages: [...currentSession.messages, userMessage, assistantPlaceholder],
      isLoading: true,
    });

    try {
      // Intentar usar streaming con attachments
      const stream = sendMessageStream(currentSession.sessionId, content, currentAttachments);
      let streamedContent = "";
      let finalUserMessage: Message | undefined;
      let finalAssistantMessage: Message | undefined;

      for await (const chunk of stream) {
        if (chunk.type === "user_message") {
          // Actualizar mensaje del usuario con datos del servidor
          finalUserMessage = chunk.data.userMessage || chunk.data as unknown as Message;
        } else if (chunk.type === "chunk" && chunk.data.content) {
          // Actualizar contenido del mensaje del asistente progresivamente
          streamedContent += chunk.data.content;

          // Actualizar el mensaje del asistente en el estado
          const updatedMessages = [...currentSession.messages, userMessage];
          const lastIndex = updatedMessages.length;
          const updatedAssistant: ChatMessage = {
            ...assistantPlaceholder,
            content: streamedContent,
          };

          updateSubjectSession(currentSubject, {
            messages: [...updatedMessages.slice(0, lastIndex), updatedAssistant],
            isLoading: true, // Mantener loading mientras hay streaming
          });
        } else if (chunk.type === "done") {
          // Streaming completado - actualizar con datos finales
          finalUserMessage = chunk.data.userMessage;
          finalAssistantMessage = chunk.data.assistantMessage;
        } else if (chunk.type === "error") {
          throw new Error(chunk.data.message || "Error en streaming");
        }
      }

      // Actualizar con mensajes finales del servidor
      if (finalUserMessage && finalAssistantMessage) {
        const updatedMessages: ChatMessage[] = [
          ...currentSession.messages,
          {
            id: finalUserMessage.id,
            content: finalUserMessage.content,
            role: "user",
            timestamp: finalUserMessage.createdAt,
            // Mantener visualización del adjunto
            ...(userMessage.attachments ? { attachments: userMessage.attachments } : {})
          },
          {
            id: finalAssistantMessage.id,
            content: finalAssistantMessage.content,
            role: "assistant",
            timestamp: finalAssistantMessage.createdAt,
          },
        ];

        updateSubjectSession(currentSubject, {
          messages: updatedMessages,
          isLoading: false,
        });
      } else if (streamedContent) {
        // Si no hay mensaje final pero hubo streaming, mantener el contenido
        const updatedMessages: ChatMessage[] = [
          ...currentSession.messages,
          userMessage,
          {
            ...assistantPlaceholder,
            content: streamedContent,
          },
        ];

        updateSubjectSession(currentSubject, {
          messages: updatedMessages,
          isLoading: false,
        });
      }
    } catch (streamError) {
      console.warn('Streaming failed, falling back to regular request:', streamError);

      // Fallback a request normal sin streaming
      try {
        const response: AddMessageResponse = await sendMessage(
          currentSession.sessionId,
          content,
          currentAttachments
        );

        if (response.userMessage && response.assistantMessage) {
          const updatedMessages: ChatMessage[] = [
            ...currentSession.messages,
            {
              id: response.userMessage.id,
              content: response.userMessage.content,
              role: "user",
              timestamp: response.userMessage.createdAt,
              // Mantener visualización del adjunto
              ...(userMessage.attachments ? { attachments: userMessage.attachments } : {})
            },
            {
              id: response.assistantMessage.id,
              content: response.assistantMessage.content,
              role: "assistant",
              timestamp: response.assistantMessage.createdAt,
            },
          ];

          updateSubjectSession(currentSubject, {
            messages: updatedMessages,
            isLoading: false,
          });
        }
      } catch (fallbackError) {
        console.error('Error sending message:', fallbackError);
        toast.error('Error al enviar el mensaje. Inténtalo de nuevo.');

        // Mostrar error al usuario
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          content: fallbackError instanceof Error ? fallbackError.message : "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
          role: "assistant",
          timestamp: new Date().toISOString(),
        };

        updateSubjectSession(currentSubject, {
          messages: [...currentSession.messages, userMessage, errorMessage],
          isLoading: false,
        });

        throw fallbackError;
      }
    }
  }, [state, updateSubjectSession, attachmentData, filePreview, clearFile]);

  // Cargar sesiones existentes del usuario
  const loadUserSessions = useCallback(async (subject?: string): Promise<ChatSession[]> => {
    try {
      const sessions = await getUserSessions(subject);

      // Actualizar estado local con las sesiones cargadas
      sessions.forEach(session => {
        if (session.subject) {
          setState(prev => ({
            ...prev,
            subjectSessions: {
              ...prev.subjectSessions,
              [session.subject!]: {
                sessionId: session.id,
                messages: [],
                isLoading: false,
              }
            }
          }));
        }
      });

      return sessions;
    } catch (error) {
      console.error('Error loading user sessions:', error);
      toast.error('Error al cargar el historial de sesiones');
      throw error;
    }
  }, []);

  // Obtener progreso del usuario para una materia
  const getSubjectProgress = useCallback(async (subject: string): Promise<SubjectProgressRecord> => {
    try {
      return await getUserProgress(subject);
    } catch (error) {
      console.error('Error getting subject progress:', error);
      // Optional: toast.error('Error updating progress'); // Maybe too noisy for background fetch
      throw error;
    }
  }, []);

  // Agregar mensaje de bienvenida personalizado
  const addWelcomeMessage = useCallback((subject: string, subjectName: string) => {
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      content: `¡Hola! Soy tu tutor especializado en ${subjectName}. ¿En qué puedo ayudarte hoy?

Puedes:
• Preguntarme sobre conceptos
• Pedir ayuda con ejercicios  
• Resolver problemas paso a paso
• Aclarar dudas sobre ${subjectName.toLowerCase()}

Recuerda: Mi método es socrático, te ayudaré a descubrir las respuestas por ti mismo. ¡Empecemos!`,
      role: "assistant",
      timestamp: new Date().toISOString(),
    };

    const currentSession = state.subjectSessions[subject];
    if (currentSession && currentSession.messages.length === 0) {
      updateSubjectSession(subject, {
        messages: [welcomeMessage]
      });
    }
  }, [state.subjectSessions, updateSubjectSession]);

  // Reset de estado
  const reset = useCallback(async () => {
    // Parar timer actual si existe
    if (state.currentSubject) {
      await stopTimer(state.currentSubject);
    }

    // Limpiar archivo seleccionado también
    clearFile();

    setState({
      currentSubject: null,
      subjectSessions: {},
      availableSubjects: [],
      isLoadingSubjects: false,
    });
  }, [state.currentSubject, stopTimer, clearFile]);

  return {
    // Estado
    ...state,
    currentSession: state.currentSubject ? state.subjectSessions[state.currentSubject] : null,
    selectedFile,
    filePreview,

    // Acciones
    loadAvailableSubjects,
    selectSubject,
    sendChatMessage,
    loadUserSessions,
    getSubjectProgress,
    addWelcomeMessage,
    updateSubjectSession,
    reset,
    handleFileSelect,
    clearFile,

    // Funciones de tiempo
    startTimer,
    stopTimer,

    // Helper
    getOrCreateSession,
    loadSession,
  };
}
