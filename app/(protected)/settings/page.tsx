"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import {
  IconSettings,
  IconUserEdit,
  IconSparkles,
  IconListCheck,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getUserProfileExtended,
  updateUserProfileExtended,
} from "@/lib/api";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

const learningStyles = [
  { value: "visual", label: "Visual" },
  { value: "auditory", label: "Auditivo" },
  { value: "reading", label: "Lectura/Escritura" },
  { value: "kinesthetic", label: "Kinestésico" },
];

const difficultyPreferences = [
  { value: "beginner", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [learningStyle, setLearningStyle] = useState("visual");
  const [difficulty, setDifficulty] = useState("beginner");
  const [subjects, setSubjects] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfileExtended();
        setProfile(data);
        setDisplayName(data.displayName ?? "");
        setBio(data.bio ?? "");
        setLearningStyle(data.preferences.learningStyle ?? "visual");
        setDifficulty(data.preferences.difficultyPreference ?? "beginner");
        setSubjects((data.preferences.subjectsOfInterest ?? []).join(", "));
      } catch (error) {
        console.error("Error loading profile preferences", error);
        setErrorMessage("No se pudieron cargar tus preferencias. Intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const selectedSubjects = useMemo(() => {
    return subjects
      .split(",")
      .map((subject) => subject.trim())
      .filter((subject) => subject.length > 0);
  }, [subjects]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const updatedProfile = await updateUserProfileExtended({
        displayName,
        bio,
        preferences: {
          language: profile?.preferences.language ?? "es",
          timezone: profile?.preferences.timezone ?? "UTC",
          learningStyle: learningStyle as UserProfile["preferences"]["learningStyle"],
          difficultyPreference: difficulty as UserProfile["preferences"]["difficultyPreference"],
          notifications: profile?.preferences.notifications ?? {
            email: true,
            push: false,
            reminders: true,
          },
          subjectsOfInterest: selectedSubjects,
        },
      });

      setProfile(updatedProfile);
      setStatusMessage("Preferencias actualizadas correctamente.");
    } catch (error) {
      console.error("Error updating preferences", error);
      setErrorMessage("No pudimos guardar tus cambios. Revisa los datos e intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-6 p-4 md:p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
          <IconSettings className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Configuración
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Personaliza tu perfil y preferencias educativas para una mejor experiencia.
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUserEdit className="h-5 w-5 text-indigo-500" />
                Perfil personal
              </CardTitle>
              <CardDescription>
                Actualiza tu nombre para mostrar y una breve descripción.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Nombre para mostrar</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Cómo quieres que te llame la IA"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Cuéntanos sobre tus intereses de aprendizaje"
                  className="w-full min-h-[120px] rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconSparkles className="h-5 w-5 text-purple-500" />
                Estilo de aprendizaje
              </CardTitle>
              <CardDescription>
                Cuéntanos cómo prefieres aprender para adaptar la experiencia.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="learningStyle">Estilo favorito</Label>
                <select
                  id="learningStyle"
                  value={learningStyle}
                  onChange={(event) => setLearningStyle(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  disabled={isLoading}
                >
                  {learningStyles.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Nivel preferido</Label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  disabled={isLoading}
                >
                  {difficultyPreferences.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconListCheck className="h-5 w-5 text-amber-500" />
                Materias de interés
              </CardTitle>
              <CardDescription>
                Define en qué temas quieres enfocarte junto al tutor IA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subjects">Materias favoritas</Label>
                <Input
                  id="subjects"
                  value={subjects}
                  onChange={(event) => setSubjects(event.target.value)}
                  placeholder="Ej: Matemática, Historia, Programación"
                  disabled={isLoading}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Separa las materias con comas. Esto ayuda a personalizar recomendaciones y sesiones.
                </p>
              </div>

              {selectedSubjects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedSubjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              {statusMessage && (
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  {statusMessage}
                </p>
              )}
              {errorMessage && (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSaving || isLoading}
              className={cn(
                "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-md transition",
                "hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {isSaving ? "Guardando..." : "Guardar preferencias"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
