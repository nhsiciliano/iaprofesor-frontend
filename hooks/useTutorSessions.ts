import { useState, useCallback, useEffect, useRef } from 'react';
import {
  createChatSession,
  getChatMessages,
  sendMessage,
  getUserSessions,
  getUserProgress,
  getAvailableSubjects,
  updateSessionDuration,
  type Message,
  type ChatSession,
  type AddMessageResponse
} from '@/lib/api';
import type { SubjectProgressRecord } from '@/lib/types';

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
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
  availableSubjects: string[];
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
      console.error('Error loading subjects:', error);
      setState(prev => ({ ...prev, isLoadingSubjects: false }));
      throw error;
    }
  }, []);

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
      updateSubjectSession(subject, { isLoading: false });
      throw error;
    }
  }, [state.subjectSessions, updateSubjectSession]);

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

  // Enviar mensaje
  const sendChatMessage = useCallback(async (content: string): Promise<void> => {
    const { currentSubject } = state;
    
    if (!currentSubject) {
      throw new Error('No subject selected');
    }

    const currentSession = state.subjectSessions[currentSubject];
    if (!currentSession?.sessionId) {
      throw new Error('No active session for current subject');
    }

    // Agregar mensaje del usuario inmediatamente (optimistic update)
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    updateSubjectSession(currentSubject, {
      messages: [...currentSession.messages, userMessage],
      isLoading: true,
    });

    try {
      const response: AddMessageResponse = await sendMessage(currentSession.sessionId, content);
      
      if (response.userMessage && response.assistantMessage) {
        // Reemplazar mensaje temporal con la respuesta del servidor
        const updatedMessages: ChatMessage[] = [
          ...currentSession.messages, // Mensajes anteriores (sin el temporal)
          {
            id: response.userMessage.id,
            content: response.userMessage.content,
            role: "user",
            timestamp: response.userMessage.createdAt,
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

        // Log de análisis si está disponible
        if (response.assistantMessage.analysis) {
          console.log('Message analysis:', {
            difficulty: response.assistantMessage.analysis.difficulty,
            messageType: response.assistantMessage.analysis.messageType,
            concepts: response.assistantMessage.analysis.concepts
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remover mensaje temporal y agregar mensaje de error
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      updateSubjectSession(currentSubject, {
        messages: [...currentSession.messages.slice(0, -1), errorMessage], // Remover temporal
        isLoading: false,
      });
      
      throw error;
    }
  }, [state, updateSubjectSession]);

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
      throw error;
    }
  }, []);

  // Obtener progreso del usuario para una materia
  const getSubjectProgress = useCallback(async (subject: string): Promise<SubjectProgressRecord> => {
    try {
      return await getUserProgress(subject);
    } catch (error) {
      console.error('Error getting subject progress:', error);
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
    
    setState({
      currentSubject: null,
      subjectSessions: {},
      availableSubjects: [],
      isLoadingSubjects: false,
    });
  }, [state.currentSubject, stopTimer]);

  return {
    // Estado
    ...state,
    currentSession: state.currentSubject ? state.subjectSessions[state.currentSubject] : null,
    
    // Acciones
    loadAvailableSubjects,
    selectSubject,
    sendChatMessage,
    loadUserSessions,
    getSubjectProgress,
    addWelcomeMessage,
    updateSubjectSession,
    reset,
    
    // Funciones de tiempo
    startTimer,
    stopTimer,
    
    // Helper
    getOrCreateSession,
  };
}
