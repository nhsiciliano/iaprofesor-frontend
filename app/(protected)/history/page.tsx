'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  IconClock, 
  IconMessage, 
  IconBrain, 
  IconSearch,
  IconCalendar,
  IconArrowRight,
  IconBook,
  IconClock24,
  IconTrendingUp
} from '@tabler/icons-react';
import { getRecentSessions } from '@/lib/api';
import type { ChatSession } from '@/lib/types';

interface SessionWithDetails extends ChatSession {
  messageCount?: number;
  duration?: number;
  subject?: string;
  conceptsLearned?: string[];
  lastMessageAt?: string;
}

const SUBJECTS = ['matemática', 'historia', 'gramática', 'ciencias'];

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  
  // Load sessions
  const loadSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get recent sessions first (more detailed)
      const recentSessions = await getRecentSessions(50);
      
      // Convert RecentSession to SessionWithDetails
      const sessionsWithDetails: SessionWithDetails[] = recentSessions.map(session => ({
        id: session.id,
        userId: '', // Not needed for display
        createdAt: session.createdAt,
        messageCount: session.messageCount,
        duration: session.duration,
        subject: session.subject,
        conceptsLearned: session.conceptsLearned,
        lastMessageAt: session.lastMessageAt
      }));

      setSessions(sessionsWithDetails);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setError('No se pudieron cargar las sesiones. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const applyFilters = useCallback(() => {
    let filtered = [...sessions];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(session => 
        session.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.conceptsLearned?.some(concept => 
          concept.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(session => 
        session.subject?.toLowerCase() === selectedSubject.toLowerCase()
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setDate(now.getDate() - 30);
          break;
      }
      
      filtered = filtered.filter(session => 
        new Date(session.createdAt) >= filterDate
      );
    }

    // Sort by most recent
    filtered.sort((a, b) => 
      new Date(b.lastMessageAt || b.createdAt).getTime() - 
      new Date(a.lastMessageAt || a.createdAt).getTime()
    );

    setFilteredSessions(filtered);
  }, [sessions, searchQuery, selectedSubject, dateFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('es-ES', { 
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  };

  const getSubjectColor = (subject?: string) => {
    if (!subject) return 'bg-slate-500';
    
    const colors: Record<string, string> = {
      'matemática': 'bg-blue-500',
      'historia': 'bg-amber-500', 
      'gramática': 'bg-green-500',
      'ciencias': 'bg-purple-500',
    };
    
    return colors[subject.toLowerCase()] || 'bg-slate-500';
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 flex-col gap-6 p-4 md:p-8 overflow-y-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center p-8">
        <div className="text-center">
          <IconClock className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            Error al cargar el historial
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error}
          </p>
          <button
            onClick={loadSessions}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-6 p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Historial de Sesiones
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Revisa tus conversaciones pasadas y tu progreso de aprendizaje
          </p>
        </div>
        
        <Link 
          href="/tutor"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <IconBrain className="h-5 w-5" />
          Nueva Sesión
        </Link>
      </motion.div>

      {/* Summary Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Sesiones</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{sessions.length}</p>
            </div>
            <IconMessage className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Mensajes Totales</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {sessions.reduce((acc, s) => acc + (s.messageCount || 0), 0)}
              </p>
            </div>
            <IconBrain className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Tiempo Total</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {formatDuration(sessions.reduce((acc, s) => acc + (s.duration || 0), 0))}
              </p>
            </div>
            <IconClock24 className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Conceptos</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {sessions.reduce((acc, s) => acc + (s.conceptsLearned?.length || 0), 0)}
              </p>
            </div>
            <IconTrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por materia o concepto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <IconBook className="h-5 w-5 text-slate-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="all">Todas las materias</option>
              {SUBJECTS.map(subject => (
                <option key={subject} value={subject}>
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5 text-slate-400" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as 'today' | 'week' | 'month' | 'all')}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="all">Todo el tiempo</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Sessions List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <IconClock className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
              No se encontraron sesiones
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {sessions.length === 0 
                ? "Aún no has tenido ninguna conversación con el tutor."
                : "Prueba ajustando los filtros para encontrar sesiones específicas."
              }
            </p>
            {sessions.length === 0 && (
              <Link 
                href="/tutor"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <IconBrain className="h-5 w-5" />
                Iniciar primera conversación
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Mostrando {filteredSessions.length} de {sessions.length} sesiones
              </p>
            </div>
            
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  href={`/tutor/${session.id}`}
                  className="block bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {session.subject && (
                          <span className={`inline-block w-3 h-3 rounded-full ${getSubjectColor(session.subject)}`}></span>
                        )}
                        <h3 className="font-semibold text-slate-800 dark:text-white">
                          {session.subject ? `Sesión de ${session.subject}` : 'Sesión de Tutoría'}
                        </h3>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(session.lastMessageAt || session.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400 mb-3">
                        <div className="flex items-center gap-1">
                          <IconMessage className="h-4 w-4" />
                          <span>{session.messageCount || 0} mensajes</span>
                        </div>
                        {session.duration && (
                          <div className="flex items-center gap-1">
                            <IconClock24 className="h-4 w-4" />
                            <span>{formatDuration(session.duration)}</span>
                          </div>
                        )}
                        {session.conceptsLearned && session.conceptsLearned.length > 0 && (
                          <div className="flex items-center gap-1">
                            <IconTrendingUp className="h-4 w-4" />
                            <span>{session.conceptsLearned.length} conceptos</span>
                          </div>
                        )}
                      </div>

                      {session.conceptsLearned && session.conceptsLearned.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {session.conceptsLearned.slice(0, 3).map((concept, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 rounded"
                            >
                              {concept}
                            </span>
                          ))}
                          {session.conceptsLearned.length > 3 && (
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 dark:text-slate-400 rounded">
                              +{session.conceptsLearned.length - 3} más
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <IconArrowRight className="h-5 w-5 text-slate-400 ml-4 flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
}
