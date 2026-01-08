"use client";

import { useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconPlus, IconTrash, IconNote, IconSearch } from "@tabler/icons-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function NotesPage() {
  const { notes, isLoading, addNote, removeNote } = useNotes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteTags, setNewNoteTags] = useState("");

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;

    try {
      const tags = newNoteTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await addNote({
        content: newNoteContent,
        tags: tags.length > 0 ? tags : undefined,
      });

      setNewNoteContent("");
      setNewNoteTags("");
      setIsDialogOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
       // Error handled in hook
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-full flex-col p-6 space-y-6 overflow-y-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white font-orbitron">
            Mis Notas
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Guarda y organiza tus conceptos clave
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/25">
              <IconPlus className="mr-2 h-4 w-4" />
              Nueva Nota
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva nota</DialogTitle>
              <DialogDescription>
                Guarda un concepto importante para repasarlo después.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contenido</label>
                <Textarea
                  placeholder="Escribe tu nota aquí..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Etiquetas (separadas por comas)</label>
                <Input
                  placeholder="matemática, fórmula, importante..."
                  value={newNoteTags}
                  onChange={(e) => setNewNoteTags(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateNote} disabled={!newNoteContent.trim()}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar en mis notas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full w-fit mx-auto mb-4">
            <IconNote className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            No tienes notas aún
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Crea tu primera nota manualmente o guarda conceptos directamente desde el chat con tu tutor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="group hover:shadow-md transition-shadow relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => removeNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    title="Eliminar nota"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed mb-4">
                  {note.content}
                </div>
                <div className="text-xs text-slate-400">
                  {format(new Date(note.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
