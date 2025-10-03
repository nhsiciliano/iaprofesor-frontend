'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconTarget, 
  IconPlus, 
  IconFilter, 
  IconSortDescending,
  IconCheck,
  IconPlayerPause,
  IconTrendingUp,
  IconSearch
} from '@tabler/icons-react';
import { 
  getUserGoals, 
  createGoal, 
  updateGoal, 
  completeGoal, 
  toggleGoalStatus, 
  deleteGoal,
  useApiCall 
} from '@/lib/api';
import { GoalCard, CreateGoalForm, GoalsOverview } from '@/components/goals/GoalSystem';
import type { Goal, CreateGoalRequest, GoalStatus } from '@/lib/types';

export default function GoalsPage() {
  const [allGoals, setAllGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI States
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | GoalStatus>('all');
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'progress' | 'deadline'>('created');
  
  // API Hooks
  const { execute: executeCreateGoal } = useApiCall<Goal>();
  const { execute: executeUpdateGoal } = useApiCall<Goal>();
  const { execute: executeCompleteGoal } = useApiCall<Goal>();
  const { execute: executeToggleStatus } = useApiCall<Goal>();
  const { execute: executeDeleteGoal } = useApiCall<void>();

  const loadGoals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const goals = await getUserGoals();
      setAllGoals(goals);
    } catch (error) {
      console.error('Error loading goals:', error);
      setError('No se pudieron cargar los objetivos. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...allGoals];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(goal =>
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(goal => goal.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'progress':
          return b.progress - a.progress;
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        default: // created
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredGoals(filtered);
  }, [allGoals, searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleCreateGoal = async (goalData: CreateGoalRequest) => {
    try {
      const newGoal = await executeCreateGoal(() => createGoal(goalData));
      if (newGoal) {
        setAllGoals(prev => [newGoal, ...prev]);
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateGoal = async (updatedGoal: Goal) => {
    try {
      const updated = await executeUpdateGoal(() => updateGoal(updatedGoal.id, updatedGoal));
      if (updated) {
        setAllGoals(prev => prev.map(goal => 
          goal.id === updated.id ? updated : goal
        ));
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      const completed = await executeCompleteGoal(() => completeGoal(goalId));
      if (completed) {
        setAllGoals(prev => prev.map(goal => 
          goal.id === completed.id ? completed : goal
        ));
      }
    } catch (error) {
      console.error('Error completing goal:', error);
    }
  };

  const handleToggleGoalStatus = async (goalId: string, status: 'active' | 'paused') => {
    try {
      const updated = await executeToggleStatus(() => toggleGoalStatus(goalId, status));
      if (updated) {
        setAllGoals(prev => prev.map(goal => 
          goal.id === updated.id ? updated : goal
        ));
      }
    } catch (error) {
      console.error('Error toggling goal status:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este objetivo?')) return;
    
    try {
      await executeDeleteGoal(() => deleteGoal(goalId));
      setAllGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  // Get categorized goals
  const activeGoals = allGoals.filter(goal => goal.status === 'active');
  const completedGoals = allGoals.filter(goal => goal.status === 'completed');
  const pausedGoals = allGoals.filter(goal => goal.status === 'paused');

  const getStatusCount = (status: GoalStatus) => {
    return allGoals.filter(goal => goal.status === status).length;
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 flex-col gap-6 p-4 md:p-8 overflow-y-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
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
          <IconTarget className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            Error al cargar objetivos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error}
          </p>
          <button
            onClick={loadGoals}
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
            Objetivos de Aprendizaje
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Define y sigue tu progreso hacia metas educativas personalizadas
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <IconPlus className="h-5 w-5" />
          Nuevo Objetivo
        </button>
      </motion.div>

      {/* Goals Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GoalsOverview 
          activeGoals={activeGoals}
          completedGoals={completedGoals}
        />
      </motion.div>

      {/* Create Goal Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <CreateGoalForm
              onCreateGoal={handleCreateGoal}
              onCancel={() => setShowCreateForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
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
              placeholder="Buscar objetivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <IconFilter className="h-5 w-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | GoalStatus)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="all">Todos ({allGoals.length})</option>
              <option value="active">Activos ({getStatusCount('active')})</option>
              <option value="completed">Completados ({getStatusCount('completed')})</option>
              <option value="paused">Pausados ({getStatusCount('paused')})</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <IconSortDescending className="h-5 w-5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'created' | 'priority' | 'progress' | 'deadline')}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="created">Más recientes</option>
              <option value="priority">Por prioridad</option>
              <option value="progress">Por progreso</option>
              <option value="deadline">Por fecha límite</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Goals List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <IconTarget className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
              {allGoals.length === 0 ? 'No tienes objetivos aún' : 'No se encontraron objetivos'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {allGoals.length === 0 
                ? "Crea tu primer objetivo para empezar a seguir tu progreso de aprendizaje."
                : "Prueba ajustando los filtros para encontrar objetivos específicos."
              }
            </p>
            {allGoals.length === 0 && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <IconPlus className="h-5 w-5" />
                Crear primer objetivo
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Mostrando {filteredGoals.length} de {allGoals.length} objetivos
              </p>
            </div>
            
            {filteredGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GoalCard
                  goal={goal}
                  onUpdate={handleUpdateGoal}
                  onDelete={handleDeleteGoal}
                  onComplete={handleCompleteGoal}
                  onPause={(goalId) => {
                    const currentGoal = allGoals.find(g => g.id === goalId);
                    if (currentGoal) {
                      const newStatus = currentGoal.status === 'active' ? 'paused' : 'active';
                      handleToggleGoalStatus(goalId, newStatus);
                    }
                  }}
                  showActions={true}
                />
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Quick Stats Footer */}
      {allGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-blue-600 mb-2">
                <IconTarget className="h-5 w-5" />
                <span className="text-2xl font-bold">{activeGoals.length}</span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Activos</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-green-600 mb-2">
                <IconCheck className="h-5 w-5" />
                <span className="text-2xl font-bold">{completedGoals.length}</span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Completados</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-amber-600 mb-2">
                <IconPlayerPause className="h-5 w-5" />
                <span className="text-2xl font-bold">{pausedGoals.length}</span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Pausados</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-purple-600 mb-2">
                <IconTrendingUp className="h-5 w-5" />
                <span className="text-2xl font-bold">
                  {activeGoals.length > 0 
                    ? Math.round(activeGoals.reduce((acc, goal) => acc + goal.progress, 0) / activeGoals.length)
                    : 0
                  }%
                </span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Progreso Promedio</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
