
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { IconEdit, IconCheck } from '@tabler/icons-react';
import { authenticatedFetch } from '@/lib/api'; // Using generic auth fetch for admin which doesn't have dedicated fn yet

interface AdminSubject {
  id: string;
  name: string;
  systemPrompt: string;
  difficulty: string;
  isActive: boolean;
  concepts: string[];
}

export default function AdminSubjectsPage() {
  const { isAdmin, loading: userLoading } = useUser();
  const router = useRouter();
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdminSubject>>({});

  useEffect(() => {
    if (!userLoading && !isAdmin) {
      router.push('/dashboard');
      return;
    }

    if (isAdmin) {
      fetchSubjects();
    }
  }, [isAdmin, userLoading, router]);

  const fetchSubjects = async () => {
    try {
      const data = await authenticatedFetch('/admin/subjects');
      setSubjects(data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject: AdminSubject) => {
    setEditingId(subject.id);
    setEditForm({
      name: subject.name,
      systemPrompt: subject.systemPrompt,
      difficulty: subject.difficulty,
      isActive: subject.isActive
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    try {
      await authenticatedFetch(`/admin/subjects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(editForm)
      });
      await fetchSubjects();
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update subject:', error);
      alert('Error saving changes');
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Gestión de Materias (Admin)</h1>
      
      <div className="grid gap-6">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 border border-slate-200 dark:border-neutral-700">
            {editingId === subject.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full p-2 rounded border dark:bg-neutral-700 dark:border-neutral-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dificultad</label>
                    <select
                      value={editForm.difficulty}
                      onChange={e => setEditForm({...editForm, difficulty: e.target.value})}
                      className="w-full p-2 rounded border dark:bg-neutral-700 dark:border-neutral-600"
                    >
                      <option value="beginner">Principiante</option>
                      <option value="intermediate">Intermedio</option>
                      <option value="advanced">Avanzado</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">System Prompt</label>
                  <textarea
                    value={editForm.systemPrompt}
                    onChange={e => setEditForm({...editForm, systemPrompt: e.target.value})}
                    className="w-full p-2 rounded border h-48 font-mono text-sm dark:bg-neutral-700 dark:border-neutral-600"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Este prompt define la personalidad y el comportamiento de la IA para esta materia.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={e => setEditForm({...editForm, isActive: e.target.checked})}
                      className="rounded text-indigo-600"
                    />
                    <span className="text-sm">Activa</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm rounded border hover:bg-slate-50 dark:hover:bg-neutral-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleSave(subject.id)}
                    className="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <IconCheck size={16} /> Guardar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {subject.name}
                      {!subject.isActive && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Inactiva</span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">{subject.id}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(subject)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-full"
                    title="Editar"
                  >
                    <IconEdit size={20} className="text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
                
                <div className="bg-slate-50 dark:bg-neutral-900 p-4 rounded text-sm font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {subject.systemPrompt}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
