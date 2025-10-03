'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconTrophy, 
  IconSearch,
  IconStar,
  IconAward
} from '@tabler/icons-react';
import { 
  getAllAchievements,
  getUserAchievements,
  markAchievementNotified,
  useApiCall
} from '@/lib/api';
import { 
  AchievementGallery, 
  AchievementStats,
  AchievementNotification
} from '@/components/achievements/AchievementSystem';
import type { 
  Achievement, 
  UserAchievement, 
  AchievementCategory, 
  AchievementRarity 
} from '@/lib/types';

export default function AchievementsPage() {
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AchievementCategory | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<AchievementRarity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'locked'>('all');
  const [sortBy, setSortBy] = useState<'rarity' | 'category' | 'points' | 'completed'>('rarity');
  
  // UI State
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  
  // API Hooks
  const { execute: executeMarkNotified } = useApiCall<void>();

  const handleMarkNotified = useCallback(async (achievementId: string) => {
    try {
      await executeMarkNotified(() => markAchievementNotified(achievementId));
      setUserAchievements(prev => prev.map(ua => 
        ua.achievementId === achievementId 
          ? { ...ua, notificationSent: true }
          : ua
      ));
    } catch (error) {
      console.error('Error marking achievement as notified:', error);
    }
  }, [executeMarkNotified]);

  const loadAchievements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [achievements, userAchs] = await Promise.all([
        getAllAchievements(),
        getUserAchievements()
      ]);
      
      setAllAchievements(achievements);
      setUserAchievements(userAchs);
      
      const newUnnotifiedAchievement = userAchs.find(ua => 
        ua.isCompleted && !ua.notificationSent
      );
      
      if (newUnnotifiedAchievement) {
        const achievement = achievements.find(a => a.id === newUnnotifiedAchievement.achievementId);
        if (achievement) {
          setNewAchievement(achievement);
          handleMarkNotified(newUnnotifiedAchievement.achievementId);
        }
      }
      
    } catch (error) {
      console.error('Error loading achievements:', error);
      setError('No se pudieron cargar los logros. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [handleMarkNotified]);

  const applyFiltersAndSort = useCallback(() => {
    const userAchievementMap = userAchievements.reduce((acc, ua) => {
      acc[ua.achievementId] = ua;
      return acc;
    }, {} as Record<string, UserAchievement>);

    let filtered = [...allAchievements];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(achievement =>
        achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(achievement => achievement.category === categoryFilter);
    }

    // Rarity filter
    if (rarityFilter !== 'all') {
      filtered = filtered.filter(achievement => achievement.rarity === rarityFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(achievement => {
        const userAchievement = userAchievementMap[achievement.id];
        
        switch (statusFilter) {
          case 'completed':
            return userAchievement?.isCompleted;
          case 'in_progress':
            return userAchievement && !userAchievement.isCompleted;
          case 'locked':
            return !userAchievement || (!userAchievement.isCompleted && userAchievement.progress === 0);
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const aUser = userAchievementMap[a.id];
      const bUser = userAchievementMap[b.id];
      
      switch (sortBy) {
        case 'completed':
          const aCompleted = aUser?.isCompleted ? 1 : 0;
          const bCompleted = bUser?.isCompleted ? 1 : 0;
          return bCompleted - aCompleted;
        case 'rarity':
          const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
          return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        case 'points':
          return b.points - a.points;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredAchievements(filtered);
  }, [allAchievements, userAchievements, searchQuery, categoryFilter, rarityFilter, statusFilter, sortBy]);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };

  const closeAchievementDetail = () => {
    setSelectedAchievement(null);
  };

  // Get stats
  const completedAchievements = userAchievements.filter(ua => ua.isCompleted);
  const inProgressAchievements = userAchievements.filter(ua => !ua.isCompleted && ua.progress > 0);
  const lockedAchievements = allAchievements.length - userAchievements.length;

  const getStatusCount = (status: string) => {
    switch (status) {
      case 'completed': return completedAchievements.length;
      case 'in_progress': return inProgressAchievements.length;
      case 'locked': return lockedAchievements;
      default: return allAchievements.length;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 flex-col gap-6 p-4 md:p-8 overflow-y-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
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
          <IconTrophy className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            Error al cargar logros
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error}
          </p>
          <button
            onClick={loadAchievements}
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
            Logros y Reconocimientos
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Descubre todos los logros disponibles y sigue tu progreso
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{completedAchievements.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Completados</div>
          </div>
          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{inProgressAchievements.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">En Progreso</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AchievementStats 
          achievements={allAchievements}
          userAchievements={userAchievements}
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar logros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Categoría
              </label>
              <select
                value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as AchievementCategory | 'all')}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">Todas</option>
                <option value="learning">Aprendizaje</option>
                <option value="engagement">Participación</option>
                <option value="consistency">Consistencia</option>
                <option value="excellence">Excelencia</option>
                <option value="exploration">Exploración</option>
                <option value="milestone">Hitos</option>
                <option value="special">Especiales</option>
              </select>
            </div>

            {/* Rarity Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Rareza
              </label>
              <select
                value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value as AchievementRarity | 'all')}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">Todas</option>
                <option value="common">Común</option>
                <option value="uncommon">Poco Común</option>
                <option value="rare">Raro</option>
                <option value="epic">Épico</option>
                <option value="legendary">Legendario</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'in_progress' | 'locked')}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">Todos ({allAchievements.length})</option>
                <option value="completed">Completados ({getStatusCount('completed')})</option>
                <option value="in_progress">En Progreso ({getStatusCount('in_progress')})</option>
                <option value="locked">Bloqueados ({getStatusCount('locked')})</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rarity' | 'category' | 'points' | 'completed')}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="rarity">Por rareza</option>
                <option value="completed">Completados primero</option>
                <option value="points">Por puntos</option>
                <option value="category">Por categoría</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AchievementGallery
          achievements={filteredAchievements}
          userAchievements={userAchievements}
          onAchievementClick={handleAchievementClick}
        />
      </motion.div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center py-12"
        >
          <IconTrophy className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
            No se encontraron logros
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Prueba ajustando los filtros para encontrar logros específicos.
          </p>
        </motion.div>
      )}

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={closeAchievementDetail}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <IconTrophy className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                      {selectedAchievement.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg">{selectedAchievement.rarity === 'legendary' ? '👑' : '🏆'}</span>
                      <span className="capitalize text-sm text-slate-600 dark:text-slate-400">
                        {selectedAchievement.rarity}
                      </span>
                      <span className="text-sm text-slate-500">•</span>
                      <div className="flex items-center gap-1">
                        <IconStar className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedAchievement.points} puntos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={closeAchievementDetail}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <p className="text-slate-700 dark:text-slate-300 mb-6">
                {selectedAchievement.description}
              </p>

              {selectedAchievement.requirements.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-3">
                    Requisitos:
                  </h3>
                  <ul className="space-y-2">
                    {selectedAchievement.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-400">
                          <span className="capitalize font-medium">{req.type.replace('_', ' ')}</span>: {req.value}
                          {req.subject && ` en ${req.subject}`}
                          {req.timeframe && ` (${req.timeframe})`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedAchievement.rewards.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-3">
                    Recompensas:
                  </h3>
                  <div className="space-y-2">
                    {selectedAchievement.rewards.map((reward, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <IconAward className="h-4 w-4 text-green-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                          {reward.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Desbloqueado por {selectedAchievement.unlockedCount} usuarios</span>
                  <span className="capitalize">{selectedAchievement.category}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <AchievementNotification
            achievement={newAchievement}
            onClose={() => setNewAchievement(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
