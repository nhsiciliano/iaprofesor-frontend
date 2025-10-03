'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  IconRoute, 
  IconSearch,
  IconBook,
  IconClock,
  IconStar,
  IconUsers
} from '@tabler/icons-react';
import { 
  getAllLearningPaths,
  getRecommendedPaths,
  enrollInLearningPath,
  getUserPathProgress,
  useApiCall
} from '@/lib/api';
import { PathsOverview, PathsGrid } from '@/components/learning-paths/LearningPathSystem';
import type { LearningPath, UserPathProgress, SkillLevel } from '@/lib/types';

const SUBJECTS = ['Matemática', 'Historia', 'Gramática', 'Ciencias'];
const DIFFICULTIES: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

export default function LearningPathsPage() {
  const [allPaths, setAllPaths] = useState<LearningPath[]>([]);
  const [recommendedPaths, setRecommendedPaths] = useState<LearningPath[]>([]);
  const [filteredPaths, setFilteredPaths] = useState<LearningPath[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserPathProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<SkillLevel[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'duration' | 'newest'>('popular');
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'enrolled'>('recommended');
  
  // API Hooks
  const { execute: executeEnroll } = useApiCall<UserPathProgress>();
  
  // Load data on mount
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load all paths and recommended paths
      const [paths, recommended, progressData] = await Promise.all([
        getAllLearningPaths(),
        getRecommendedPaths(10),
        getUserPathProgress().catch(() => [])
      ]);
      
      setAllPaths(paths);
      setRecommendedPaths(recommended);
      
      // Convert progress array to object keyed by path ID
      const progressMap: Record<string, UserPathProgress> = {};
      progressData.forEach(progress => {
        progressMap[progress.pathId] = progress;
      });
      setUserProgress(progressMap);
      
    } catch (error) {
      console.error('Error loading learning paths:', error);
      setError('No se pudieron cargar las rutas de aprendizaje. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...allPaths];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(path =>
        path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Subject filter
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(path => selectedSubjects.includes(path.subject));
    }

    // Difficulty filter
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter(path => selectedDifficulties.includes(path.difficulty));
    }

    // Enrolled only filter
    if (showEnrolledOnly) {
      filtered = filtered.filter(path => userProgress[path.id]);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.enrollmentCount - a.enrollmentCount;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'duration':
          return a.estimatedDuration - b.estimatedDuration;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredPaths(filtered);
  }, [allPaths, searchQuery, selectedSubjects, selectedDifficulties, sortBy, showEnrolledOnly, userProgress]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleEnroll = async (pathId: string) => {
    try {
      const progress = await executeEnroll(() => enrollInLearningPath(pathId));
      if (progress) {
        setUserProgress(prev => ({
          ...prev,
          [pathId]: progress
        }));
      }
    } catch (error) {
      console.error('Error enrolling in path:', error);
    }
  };

  const handleContinue = (pathId: string) => {
    // Navigate to the specific learning path with current progress
    window.open(`/learning-paths/${pathId}`, '_blank');
  };

  const handleView = (pathId: string) => {
    // Navigate to the learning path details
    window.open(`/learning-paths/${pathId}`, '_blank');
  };

  const toggleSubjectFilter = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const toggleDifficultyFilter = (difficulty: SkillLevel) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  // Get categorized paths
  const enrolledPaths = allPaths.filter(path => userProgress[path.id]);
  const completedPaths = allPaths.filter(path => userProgress[path.id]?.status === 'completed');
  
  // Get current paths to display based on active tab
  const getDisplayPaths = () => {
    switch (activeTab) {
      case 'recommended':
        return recommendedPaths;
      case 'enrolled':
        return enrolledPaths;
      default:
        return filteredPaths;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
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
          <IconRoute className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            Error al cargar rutas de aprendizaje
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error}
          </p>
          <button
            onClick={loadData}
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
            Rutas de Aprendizaje
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Explora caminos estructurados de estudio diseñados para maximizar tu aprendizaje
          </p>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PathsOverview
          enrolledPaths={enrolledPaths}
          completedPaths={completedPaths}
          recommendedPaths={recommendedPaths}
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg"
      >
        {([
          { key: 'recommended', label: `Recomendadas (${recommendedPaths.length})`, icon: IconStar },
          { key: 'all', label: `Todas (${allPaths.length})`, icon: IconBook },
          { key: 'enrolled', label: `Mis Rutas (${enrolledPaths.length})`, icon: IconRoute },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all
              ${activeTab === key
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }
            `}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </motion.div>

      {/* Filters */}
      {activeTab === 'all' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar rutas de aprendizaje..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Materias
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map(subject => (
                    <button
                      key={subject}
                      onClick={() => toggleSubjectFilter(subject)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedSubjects.includes(subject)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nivel
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => toggleDifficultyFilter(difficulty)}
                      className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                        selectedDifficulties.includes(difficulty)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {difficulty === 'beginner' && 'Principiante'}
                      {difficulty === 'intermediate' && 'Intermedio'}
                      {difficulty === 'advanced' && 'Avanzado'}
                      {difficulty === 'expert' && 'Experto'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'popular' | 'rating' | 'duration' | 'newest')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="popular">Más populares</option>
                  <option value="rating">Mejor valoradas</option>
                  <option value="duration">Duración (menor a mayor)</option>
                  <option value="newest">Más recientes</option>
                </select>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Opciones
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showEnrolledOnly}
                    onChange={(e) => setShowEnrolledOnly(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Solo mis rutas</span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Paths Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <PathsGrid
          paths={getDisplayPaths()}
          userProgress={userProgress}
          onEnroll={handleEnroll}
          onContinue={handleContinue}
          onView={handleView}
        />
      </motion.div>

      {/* Empty State */}
      {getDisplayPaths().length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12"
        >
          <IconRoute className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
            {activeTab === 'recommended' && 'No hay rutas recomendadas'}
            {activeTab === 'enrolled' && 'No estás inscrito en ninguna ruta'}
            {activeTab === 'all' && 'No se encontraron rutas'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {activeTab === 'recommended' && 'Las recomendaciones aparecerán aquí basadas en tu progreso.'}
            {activeTab === 'enrolled' && 'Explora las rutas disponibles y comienza tu primera ruta de aprendizaje.'}
            {activeTab === 'all' && 'Prueba ajustando los filtros para encontrar rutas específicas.'}
          </p>
          
          {activeTab === 'enrolled' && (
            <button
              onClick={() => setActiveTab('recommended')}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <IconStar className="h-5 w-5" />
              Ver Recomendadas
            </button>
          )}
        </motion.div>
      )}

      {/* Stats Footer */}
      {allPaths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-blue-600 mb-2">
                <IconBook className="h-5 w-5" />
                <span className="text-2xl font-bold">{allPaths.length}</span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Rutas Disponibles</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-green-600 mb-2">
                <IconUsers className="h-5 w-5" />
                <span className="text-2xl font-bold">
                  {allPaths.reduce((acc, path) => acc + path.enrollmentCount, 0)}
                </span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Inscripciones</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-purple-600 mb-2">
                <IconClock className="h-5 w-5" />
                <span className="text-2xl font-bold">
                  {Math.round(allPaths.reduce((acc, path) => acc + path.estimatedDuration, 0) / allPaths.length)}h
                </span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Duración Promedio</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-yellow-600 mb-2">
                <IconStar className="h-5 w-5" />
                <span className="text-2xl font-bold">
                  {(allPaths.reduce((acc, path) => acc + path.averageRating, 0) / allPaths.length).toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Rating Promedio</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
