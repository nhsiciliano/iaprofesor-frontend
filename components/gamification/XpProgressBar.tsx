"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { IconStar, IconTrophy } from '@tabler/icons-react';

interface XpProgressBarProps {
  currentXp: number;
  currentLevel: number;
  className?: string;
}

export function XpProgressBar({ currentXp, currentLevel, className = '' }: XpProgressBarProps) {
  // Level 1 starts at 0 XP; Level 2+ follow XP = 100 * level^1.5
  const xpForLevel = (level: number) => {
    if (level <= 1) return 0;
    return Math.floor(100 * Math.pow(level, 1.5));
  };

  const xpForCurrentLevel = xpForLevel(currentLevel);
  const xpForNextLevel = xpForLevel(currentLevel + 1);
  
  // Calculate progress within current level
  const xpInCurrentLevel = currentXp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconTrophy className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Nivel {currentLevel}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <IconStar className="h-4 w-4 text-yellow-500" />
          <span>{currentXp} XP</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
        />
      </div>
      
      {/* XP Text */}
      <div className="mt-1 text-xs text-center text-slate-500 dark:text-slate-400">
        {xpInCurrentLevel} / {xpNeededForNextLevel} XP hasta nivel {currentLevel + 1}
      </div>
    </div>
  );
}
