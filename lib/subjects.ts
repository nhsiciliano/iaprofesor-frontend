import React from 'react';
import {
  IconCalculator,
  IconBook,
  IconPencil,
  IconMicroscope,
  IconAtom,
  IconFlask,
  IconDna,
  IconMap,
  IconCode,
  IconReportMoney,
  IconBrain,
} from '@tabler/icons-react';

const SUBJECT_LABELS: Record<string, string> = {
  mathematics: 'Matemática',
  history: 'Historia',
  grammar: 'Gramática',
  science: 'Ciencias',
  physics: 'Física',
  chemistry: 'Química',
  biology: 'Biología',
  philosophy: 'Filosofía',
  literature: 'Literatura',
  geography: 'Geografía',
  programming: 'Programación',
  accounting: 'Contabilidad',
  finance: 'Finanzas',
  general: 'General',
};

const SUBJECT_COLORS: Record<string, string> = {
  mathematics: '#3b82f6',
  history: '#f59e0b',
  grammar: '#10b981',
  science: '#16a34a',
  physics: '#8b5cf6',
  chemistry: '#ec4899',
  biology: '#14b8a6',
  philosophy: '#64748b',
  literature: '#ef4444',
  geography: '#06b6d4',
  programming: '#4f46e5',
  accounting: '#84cc16',
  finance: '#eab308',
  general: '#94a3b8',
};

const SUBJECT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  mathematics: IconCalculator,
  history: IconBook,
  grammar: IconPencil,
  science: IconMicroscope,
  physics: IconAtom,
  chemistry: IconFlask,
  biology: IconDna,
  philosophy: IconBrain,
  literature: IconBook,
  geography: IconMap,
  programming: IconCode,
  accounting: IconReportMoney,
  finance: IconReportMoney,
  general: IconBrain,
};

const SUBJECT_ALIASES: Record<string, string> = {
  matematica: 'mathematics',
  matematicas: 'mathematics',
  historia: 'history',
  gramatica: 'grammar',
  ciencia: 'science',
  ciencias: 'science',
  fisica: 'physics',
  quimica: 'chemistry',
  biologia: 'biology',
  filosofia: 'philosophy',
  literatura: 'literature',
  geografia: 'geography',
  programacion: 'programming',
  contabilidad: 'accounting',
  finanzas: 'finance',
  general: 'general',
};

function normalizeKey(value?: string | null) {
  if (!value) return 'general';
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return SUBJECT_ALIASES[normalized] ?? normalized;
}

export function getSubjectLabel(subjectId?: string | null) {
  if (!subjectId) return 'General';
  const key = normalizeKey(subjectId);
  return SUBJECT_LABELS[key] ?? subjectId;
}

export function getSubjectColor(subjectId?: string | null) {
  const key = normalizeKey(subjectId);
  return SUBJECT_COLORS[key] ?? SUBJECT_COLORS.general;
}

export function getSubjectIcon(subjectId?: string | null) {
  const key = normalizeKey(subjectId);
  const Icon = SUBJECT_ICONS[key] ?? SUBJECT_ICONS.general;
  return React.createElement(Icon, { className: 'h-5 w-5' });
}
