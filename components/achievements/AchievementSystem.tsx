"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IconTrophy,
  IconAward,
  IconStar,
  IconLock,
  IconCheck,
  IconTarget,
  IconBrain,
  IconClock,
  IconRocket,
  IconCrown,
  IconMagnet,
  IconSparkles,
  IconFlame
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { 
  Achievement,
  UserAchievement,
  AchievementCardProps,
  AchievementRarity,
  AchievementCategory
} from '@/lib/types';
import { cn } from '@/lib/utils';

// ==================== ACHIEVEMENT CARD COMPONENT ====================

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  userAchievement,
  isLocked = false,
  showProgress = true,
  onClick,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isCompleted = userAchievement?.isCompleted || false;
  const progress = userAchievement?.progress || 0;
  const isUnlocked = userAchievement !== undefined;

  const getRarityStyles = () => {
    const rarityStyles = {
      common: {
        bg: 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
        border: 'border-gray-300 dark:border-gray-600',
        icon: 'text-gray-600 dark:text-gray-400',
        glow: 'shadow-gray-200/50',
      },
      uncommon: {
        bg: 'from-green-100 to-green-200 dark:from-green-800 dark:to-green-900',
        border: 'border-green-300 dark:border-green-600',
        icon: 'text-green-600 dark:text-green-400',
        glow: 'shadow-green-200/50',
      },
      rare: {
        bg: 'from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900',
        border: 'border-blue-300 dark:border-blue-600',
        icon: 'text-blue-600 dark:text-blue-400',
        glow: 'shadow-blue-200/50',
      },
      epic: {
        bg: 'from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900',
        border: 'border-purple-300 dark:border-purple-600',
        icon: 'text-purple-600 dark:text-purple-400',
        glow: 'shadow-purple-200/50',
      },
      legendary: {
        bg: 'from-yellow-100 to-orange-200 dark:from-yellow-800 dark:to-orange-900',
        border: 'border-yellow-300 dark:border-orange-600',
        icon: 'text-yellow-600 dark:text-orange-400',
        glow: 'shadow-yellow-200/50',
      },
    };

    return rarityStyles[achievement.rarity] || rarityStyles.common;
  };

  const getAchievementIcon = () => {
    const iconMap = {
      milestone: <IconTrophy className="h-6 w-6" />,
      streak: <IconFlame className="h-6 w-6" />,
      completion: <IconCheck className="h-6 w-6" />,
      skill: <IconBrain className="h-6 w-6" />,
      exploration: <IconRocket className="h-6 w-6" />,
      consistency: <IconClock className="h-6 w-6" />,
      excellence: <IconCrown className="h-6 w-6" />,
      special: <IconMagnet className="h-6 w-6" />,
    };

    return iconMap[achievement.type] || <IconAward className="h-6 w-6" />;
  };

  const getRarityIcon = () => {
    const icons = {
      common: '🥉',
      uncommon: '🥈', 
      rare: '🥇',
      epic: '💎',
      legendary: '👑',
    };

    return icons[achievement.rarity] || '🏆';
  };

  const styles = getRarityStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        "relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-300",
        isCompleted && `bg-gradient-to-br ${styles.bg} ${styles.border}`,
        !isCompleted && !isUnlocked && "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60",
        !isCompleted && isUnlocked && `bg-gradient-to-br ${styles.bg} ${styles.border} opacity-80`,
        isHovered && isCompleted && `shadow-lg ${styles.glow}`,
        className
      )}
    >
      {/* Background pattern for legendary achievements */}
      {achievement.rarity === 'legendary' && isCompleted && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-pulse" />
        </div>
      )}

      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="pb-2 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-full",
                isLocked ? "bg-gray-200 dark:bg-gray-700" : `${styles.icon}`
              )}>
                {isLocked ? (
                  <IconLock className="h-6 w-6 text-gray-400" />
                ) : (
                  <div className={styles.icon}>
                    {getAchievementIcon()}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className={cn(
                    "text-sm font-semibold",
                    isLocked ? "text-gray-400" : "text-slate-800 dark:text-slate-200"
                  )}>
                    {isLocked ? "Logro Secreto" : achievement.title}
                  </CardTitle>
                  <span className="text-lg">{getRarityIcon()}</span>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium capitalize",
                    `bg-${achievement.rarity === 'legendary' ? 'yellow' : achievement.rarity === 'epic' ? 'purple' : achievement.rarity === 'rare' ? 'blue' : achievement.rarity === 'uncommon' ? 'green' : 'gray'}-100`,
                    `text-${achievement.rarity === 'legendary' ? 'yellow' : achievement.rarity === 'epic' ? 'purple' : achievement.rarity === 'rare' ? 'blue' : achievement.rarity === 'uncommon' ? 'green' : 'gray'}-700`,
                    isLocked && "bg-gray-100 text-gray-500"
                  )}>
                    {achievement.rarity}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <IconStar className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {achievement.points}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {isCompleted && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                className="flex-shrink-0"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <IconCheck className="h-4 w-4 text-white" />
                </div>
              </motion.div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className={cn(
            "text-sm mb-3",
            isLocked ? "text-gray-400" : "text-slate-600 dark:text-slate-300"
          )}>
            {isLocked ? "Continúa aprendiendo para desbloquear este logro." : achievement.description}
          </p>

          {/* Progress bar for in-progress achievements */}
          {showProgress && isUnlocked && !isCompleted && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Progreso</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-1.5 rounded-full",
                    achievement.rarity === 'legendary' && "bg-gradient-to-r from-yellow-400 to-orange-500",
                    achievement.rarity === 'epic' && "bg-gradient-to-r from-purple-400 to-pink-500",
                    achievement.rarity === 'rare' && "bg-gradient-to-r from-blue-400 to-cyan-500",
                    achievement.rarity === 'uncommon' && "bg-gradient-to-r from-green-400 to-emerald-500",
                    achievement.rarity === 'common' && "bg-gray-400"
                  )}
                />
              </div>
            </div>
          )}

          {/* Requirements (for unlocked but not completed) */}
          {isUnlocked && !isCompleted && !isLocked && achievement.requirements.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
              <h4 className="text-xs font-medium text-slate-500 mb-1">Requisitos:</h4>
              <ul className="space-y-1">
                {achievement.requirements.slice(0, 2).map((req, index) => (
                  <li key={index} className="text-xs text-slate-400 flex items-center gap-1">
                    <div className="w-1 h-1 bg-slate-400 rounded-full" />
                    <span className="capitalize">{req.type.replace('_', ' ')}: {req.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unlock date for completed achievements */}
          {isCompleted && userAchievement?.completedAt && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-1">
                <IconSparkles className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-slate-500">
                  Desbloqueado: {new Date(userAchievement.completedAt).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ==================== ACHIEVEMENT NOTIFICATION ====================

export const AchievementNotification: React.FC<{
  achievement: Achievement;
  onClose: () => void;
  className?: string;
}> = ({ achievement, onClose, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -50 }}
      className={cn(
        "fixed bottom-6 right-6 z-50 max-w-sm bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-2xl",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <IconTrophy className="h-6 w-6" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg">¡Logro Desbloqueado!</h3>
            <span className="text-2xl">{achievement.rarity === 'legendary' ? '👑' : '🏆'}</span>
          </div>
          <h4 className="font-semibold mb-1">{achievement.title}</h4>
          <p className="text-sm text-white/90">{achievement.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <IconStar className="h-4 w-4" />
            <span className="text-sm font-medium">+{achievement.points} puntos</span>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <span className="text-sm">×</span>
        </button>
      </div>
    </motion.div>
  );
};

// ==================== ACHIEVEMENT GALLERY ====================

export const AchievementGallery: React.FC<{
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  category?: AchievementCategory;
  rarity?: AchievementRarity;
  onAchievementClick?: (achievement: Achievement) => void;
  className?: string;
}> = ({ 
  achievements, 
  userAchievements, 
  category,
  rarity,
  onAchievementClick,
  className 
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | AchievementCategory | AchievementRarity>('all');

  // Create a map for quick lookup of user achievements
  const userAchievementMap = userAchievements.reduce((acc, ua) => {
    acc[ua.achievementId] = ua;
    return acc;
  }, {} as Record<string, UserAchievement>);

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    if (category && achievement.category !== category) return false;
    if (rarity && achievement.rarity !== rarity) return false;
    if (selectedFilter !== 'all') {
      if (!['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(selectedFilter)) {
        // It's a category filter
        return achievement.category === selectedFilter;
      } else {
        // It's a rarity filter
        return achievement.rarity === selectedFilter;
      }
    }
    return true;
  });

  // Sort achievements: completed first, then by rarity, then alphabetically
  const sortedAchievements = filteredAchievements.sort((a, b) => {
    const aCompleted = userAchievementMap[a.id]?.isCompleted || false;
    const bCompleted = userAchievementMap[b.id]?.isCompleted || false;
    
    if (aCompleted !== bCompleted) {
      return aCompleted ? -1 : 1;
    }
    
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
    
    if (rarityDiff !== 0) return rarityDiff;
    
    return a.title.localeCompare(b.title);
  });

  const categoryFilters: { value: AchievementCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'learning', label: 'Aprendizaje' },
    { value: 'engagement', label: 'Participación' },
    { value: 'consistency', label: 'Consistencia' },
    { value: 'excellence', label: 'Excelencia' },
    { value: 'exploration', label: 'Exploración' },
    { value: 'milestone', label: 'Hitos' },
    { value: 'special', label: 'Especiales' },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {categoryFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedFilter(filter.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              selectedFilter === filter.value
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {sortedAchievements.map((achievement) => {
            const userAchievement = userAchievementMap[achievement.id];
            const isLocked = achievement.isSecret && !userAchievement;
            
            return (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                userAchievement={userAchievement}
                isLocked={isLocked}
                onClick={() => onAchievementClick?.(achievement)}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <IconTrophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No se encontraron logros
          </h3>
          <p className="text-gray-500">
            Intenta cambiar los filtros o continúa aprendiendo para desbloquear más logros.
          </p>
        </div>
      )}
    </div>
  );
};

// ==================== ACHIEVEMENT STATS ====================

export const AchievementStats: React.FC<{
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  className?: string;
}> = ({ achievements, userAchievements, className }) => {
  const completedCount = userAchievements.filter(ua => ua.isCompleted).length;
  const totalPoints = userAchievements
    .filter(ua => ua.isCompleted)
    .reduce((sum, ua) => {
      const achievement = achievements.find(a => a.id === ua.achievementId);
      return sum + (achievement?.points || 0);
    }, 0);

  const rarityDistribution = userAchievements
    .filter(ua => ua.isCompleted)
    .reduce((acc, ua) => {
      const achievement = achievements.find(a => a.id === ua.achievementId);
      if (achievement) {
        acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1;
      }
      return acc;
    }, {} as Record<AchievementRarity, number>);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-6", className)}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Logros Completados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <IconTrophy className="h-8 w-8 text-yellow-600" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">
              {completedCount}
            </span>
            <span className="text-lg text-slate-500">/ {achievements.length}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Puntos Totales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <IconStar className="h-8 w-8 text-indigo-600" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">
              {totalPoints.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Logros Legendarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <IconCrown className="h-8 w-8 text-yellow-500" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">
              {rarityDistribution.legendary || 0}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Tasa de Completación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <IconTarget className="h-8 w-8 text-green-600" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">
              {Math.round((completedCount / achievements.length) * 100)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementCard;