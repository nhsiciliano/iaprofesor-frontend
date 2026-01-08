
"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import {
  IconCalculator,
  IconBook,
  IconPencil,
  IconRobot,
  IconSend,
  IconArrowLeft,
  IconSparkles,
  IconMessage,
  IconClock,
  IconMicroscope,
  IconAtom,
  IconFlask,
  IconDna,
  IconBrain,
  IconFeather,
  IconMap,
  IconCode,
  IconReportMoney,
  IconTrendingUp,
  IconPaperclip,
  IconX,
  IconBookmark,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { StreamingText } from "@/components/ui/streaming-text";
import { useTutorSessions } from "@/hooks/useTutorSessions";
import { debugAuth } from "@/lib/debug-auth";
import { getAvailableSubjects, getUserProgress } from "@/lib/api";
import { SessionHistory } from "@/components/tutor/SessionHistory";
import { useNotes } from "@/hooks/useNotes";
import { XpProgressBar } from "@/components/gamification/XpProgressBar";
import type { SubjectProgressRecord } from "@/lib/types";

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

const SUBJECTS: Subject[] = [
  {
    id: "mathematics",
    name: "Matemática",
    description: "Álgebra, geometría, cálculo y más",
    icon: <IconCalculator className="h-8 w-8" />,
    color: "blue",
    bgGradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "history",
    name: "Historia",
    description: "Eventos históricos y civilizaciones",
    icon: <IconBook className="h-8 w-8" />,
    color: "amber",
    bgGradient: "from-amber-500 to-orange-500",
  },
  {
    id: "grammar",
    name: "Gramática",
    description: "Reglas del lenguaje y escritura",
    icon: <IconPencil className="h-8 w-8" />,
    color: "emerald",
    bgGradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "science",
    name: "Ciencias",
    description: "Biología, física, química y universo",
    icon: <IconMicroscope className="h-8 w-8" />,
    color: "green",
    bgGradient: "from-green-500 to-emerald-500",
  },
  {
    id: "physics",
    name: "Física",
    description: "Mecánica, energía y leyes del universo",
    icon: <IconAtom className="h-8 w-8" />,
    color: "purple",
    bgGradient: "from-purple-500 to-indigo-500",
  },
  {
    id: "chemistry",
    name: "Química",
    description: "Reacciones, elementos y materia",
    icon: <IconFlask className="h-8 w-8" />,
    color: "pink",
    bgGradient: "from-pink-500 to-rose-500",
  },
  {
    id: "biology",
    name: "Biología",
    description: "Vida, genética y naturaleza",
    icon: <IconDna className="h-8 w-8" />,
    color: "teal",
    bgGradient: "from-teal-500 to-green-500",
  },
  {
    id: "philosophy",
    name: "Filosofía",
    description: "Lógica, ética y pensamiento crítico",
    icon: <IconBrain className="h-8 w-8" />,
    color: "slate",
    bgGradient: "from-slate-500 to-gray-500",
  },
  {
    id: "literature",
    name: "Literatura",
    description: "Obras clásicas, autores y análisis",
    icon: <IconFeather className="h-8 w-8" />,
    color: "red",
    bgGradient: "from-red-500 to-orange-500",
  },
  {
    id: "geography",
    name: "Geografía",
    description: "Países, climas y mapas",
    icon: <IconMap className="h-8 w-8" />,
    color: "cyan",
    bgGradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "programming",
    name: "Programación",
    description: "Código, algoritmos y desarrollo",
    icon: <IconCode className="h-8 w-8" />,
    color: "indigo",
    bgGradient: "from-indigo-600 to-blue-600",
  },
  {
    id: "accounting",
    name: "Contabilidad",
    description: "Balances, activos e impuestos",
    icon: <IconReportMoney className="h-8 w-8" />,
    color: "lime",
    bgGradient: "from-lime-600 to-green-600",
  },
  {
    id: "finance",
    name: "Finanzas",
    description: "Inversiones, mercados y economía",
    icon: <IconTrendingUp className="h-8 w-8" />,
    color: "yellow",
    bgGradient: "from-yellow-500 to-amber-500",
  },
];

export default function TutorPage() {
  const { user } = useAuth();
  const [inputMessage, setInputMessage] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgressRecord | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Usar el hook personalizado para manejar sesiones
  const {
    currentSubject,
    currentSession,
    subjectSessions,
    selectSubject,
    sendChatMessage,
    addWelcomeMessage,
    loadSession,
    handleFileSelect,
    clearFile,
    filePreview,
  } = useTutorSessions();

  // Notes integration
  const { addNote } = useNotes();
  const [noteContent, setNoteContent] = useState("");
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  const handleOpenNoteDialog = (content: string) => {
    setNoteContent(content);
    setIsNoteDialogOpen(true);
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;
    
    // Find the subject object to get the name
    const subjectObj = SUBJECTS.find(s => s.id === currentSubject);
    const subjectName = subjectObj?.name || "General";

    try {
      await addNote({
        content: noteContent,
        subjectId: currentSubject || undefined,
        sessionId: currentSession?.sessionId || undefined,
        tags: [subjectName]
      });
      setIsNoteDialogOpen(false);
      setNoteContent("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error handled in hook
    }
  };

  // Scroll automático
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  // Seleccionar materia y crear/cargar sesión
  const handleSelectSubject = async (subject: Subject) => {
    try {
      // Debug de autenticación
      await debugAuth();
      
      // Test de conectividad del backend usando API autenticada
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002';
      console.log('Testing backend connectivity:', BACKEND_URL);
      try {
        // Usar la función autenticada en lugar de fetch directo
        const subjects = await getAvailableSubjects();
        console.log('Backend test successful - subjects:', subjects);
      } catch (fetchError) {
        console.error('Backend connectivity error:', fetchError);
        toast.error("Error de conexión con el servidor");
      }
      
      setSelectedSubject(subject);
      await selectSubject(subject.id);
      
      // Fetch subject progress for XP display
      try {
        const progress = await getUserProgress(subject.id);
        setSubjectProgress(progress);
      } catch (error) {
        console.error('Error fetching subject progress:', error);
      }
      
      // Agregar mensaje de bienvenida si es necesario
      setTimeout(() => {
        addWelcomeMessage(subject.id, subject.name);
      }, 100);
    } catch (error) {
      console.error("Error al seleccionar materia:", error);
      toast.error("No se pudo cargar la materia seleccionada");
    }
  };

  const handleSelectHistorySession = async (sessionId: string, subjectId: string) => {
    try {
      console.log("Selecting history session:", sessionId, subjectId);
      setIsHistoryOpen(false);

      const subject = SUBJECTS.find(s => s.id === subjectId);
      const fallbackSubject: Subject = {
        id: subjectId,
        name: subjectId === "general" ? "General" : subjectId,
        description: "Conversación general",
        icon: <IconRobot className="h-8 w-8" />,
        color: "slate",
        bgGradient: "from-slate-500 to-gray-500",
      };

      const resolvedSubject = subject ?? fallbackSubject;
      setSelectedSubject(resolvedSubject);
      setSubjectProgress(null);
      await loadSession(sessionId, resolvedSubject.id);
    } catch (error) {
      console.error("Error loading history session:", error);
      toast.error("Error al cargar la sesión del historial");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !currentSubject || !currentSession) return;
    if (currentSession.isLoading) return;

    const messageContent = inputMessage;
    setInputMessage(""); // Limpiar input inmediatamente

    try {
      await sendChatMessage(messageContent);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast.error("Error al enviar el mensaje");
      // El error ya se maneja en el hook
    }
  };

  // Función para manejar el botón de volver
  const handleGoBack = () => {
    setSelectedSubject(null);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
      <SessionHistory 
        isOpen={isHistoryOpen} 
        onOpenChange={setIsHistoryOpen}
        onSelectSession={handleSelectHistorySession}
      />

      <AnimatePresence mode="wait">
        {!selectedSubject ? (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex h-full w-full flex-1 flex-col p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Image 
                    src="/iaproflogo.png" 
                    alt="IA Profesor"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-800 dark:text-white font-orbitron">
                    Tutor IA
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Selecciona una materia para comenzar tu aprendizaje personalizado
                  </p>
                </div>
              </div>

               <Button
                variant="outline"
                onClick={() => setIsHistoryOpen(true)}
                className="gap-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <IconClock className="h-4 w-4" />
                Historial
              </Button>
            </div>

            {/* Subject Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
              {SUBJECTS.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer h-full hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 overflow-hidden"
                    onClick={() => handleSelectSubject(subject)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${subject.bgGradient}`} />
                    <CardHeader className="text-center pb-4">
                      <div className={`mx-auto p-4 rounded-2xl bg-gradient-to-r ${subject.bgGradient} text-white w-fit mb-4`}>
                        {subject.icon}
                      </div>
                      <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                        {subject.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                        {subject.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pb-6">
                      <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                        {subjectSessions?.[subject.id]?.messages?.length > 0 ? (
                          <>
                            <IconMessage className="h-4 w-4" />
                            <span>{subjectSessions[subject.id].messages.length} mensajes</span>
                          </>
                        ) : (
                          <>
                            <IconSparkles className="h-4 w-4" />
                            <span>Comenzar nueva conversación</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
              <Card className="text-center">
                <CardContent className="p-6">
                  <IconMessage className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-bold text-2xl text-slate-800 dark:text-white">
                    {Object.values(subjectSessions || {}).reduce((total, session) => total + (session?.messages?.length || 0), 0)}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Mensajes totales</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <IconBook className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                  <h3 className="font-bold text-2xl text-slate-800 dark:text-white">
                    {Object.keys(subjectSessions || {}).length}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Materias exploradas</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <IconClock className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                  <h3 className="font-bold text-2xl text-slate-800 dark:text-white">24/7</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Disponibilidad</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="flex h-full w-full flex-1 flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className={`bg-gradient-to-r ${selectedSubject.bgGradient} text-white p-6 shadow-lg`}>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleGoBack}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <IconArrowLeft className="h-6 w-6" />
                </button>
                <div className="p-3 bg-white/20 rounded-xl">
                  {selectedSubject.icon}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold font-orbitron">{selectedSubject.name}</h1>
                  <p className="text-white/80 mt-1">{selectedSubject.description}</p>
                </div>
              </div>
              
              {/* XP Progress Bar */}
              {subjectProgress && (
                <div className="mt-4 max-w-md">
                  <XpProgressBar
                    currentXp={subjectProgress.xp}
                    currentLevel={subjectProgress.level}
                  />
                </div>
              )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {!currentSession?.messages || currentSession.messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 w-fit mx-auto mb-4">
                      <IconRobot className="h-12 w-12 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
                      ¡Hola! Soy tu tutor de {selectedSubject.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Está cargando la conversación...
                    </p>
                  </div>
                ) : (
                  currentSession.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                          message.role === "user"
                            ? `bg-gradient-to-r ${selectedSubject.bgGradient} text-white shadow-lg`
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm">
                            <IconRobot className="h-4 w-4" />
                            <span>IA Profesor • {selectedSubject.name}</span>
                            <button
                              onClick={() => handleOpenNoteDialog(message.content)}
                              className="ml-2 p-1 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                              title="Guardar como nota"
                            >
                              <IconBookmark className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                        {message.role === "assistant" && message.id.startsWith("temp-") && currentSession?.isLoading ? (
                          <>
                            <StreamingText 
                              content={message.content} 
                              speed={15} 
                            />
                            {/* Cursor is now managed by the streaming text or we can leave a blinking cursor at the end */}
                            <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse rounded-sm align-middle" />
                          </>
                        ) : (
                          <div className="whitespace-pre-wrap break-words leading-relaxed">
                            {message.content}
                          </div>
                        )}
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.attachments.map((att, idx) => (
                              <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src={att.url || (att.base64 ? `data:${att.mimeType};base64,${att.base64}` : '')} 
                                  alt="Adjunto" 
                                  className="max-h-48 max-w-full object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div
                        className={`text-xs mt-2 ${
                          message.role === "user" 
                            ? "text-white/70" 
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </motion.div>
                  ))
                )}
                
                {/* Loading indicator - Only show if we don't have a streaming message with content yet */}
                {currentSession?.isLoading && 
                 (!currentSession.messages?.length || 
                  (currentSession.messages[currentSession.messages.length - 1]?.role === "assistant" && 
                   currentSession.messages[currentSession.messages.length - 1]?.content.length === 0)) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-2xl px-6 py-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm">
                        <IconRobot className="h-4 w-4" />
                        <span>IA Profesor • {selectedSubject.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div 
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" 
                          style={{ animationDelay: "0.1s" }} 
                        />
                        <div 
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" 
                          style={{ animationDelay: "0.2s" }} 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                
                {/* File Preview */}
                {filePreview && (
                  <div className="mb-4 relative inline-block">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={filePreview} 
                        alt="Preview" 
                        className="h-20 w-auto object-cover"
                      />
                      <button
                        onClick={clearFile}
                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                      // Reset value so same file can be selected again
                      e.target.value = '';
                    }}
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={currentSession?.isLoading || !currentSession?.sessionId}
                    className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                  >
                    <IconPaperclip className="h-5 w-5" />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={`Pregunta sobre ${selectedSubject.name.toLowerCase()}...`}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      disabled={currentSession?.isLoading || !currentSession?.sessionId}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || currentSession?.isLoading || !currentSession?.sessionId}
                    className={`px-6 py-3 bg-gradient-to-r ${selectedSubject.bgGradient} text-white rounded-2xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2`}
                  >
                    {currentSession?.isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <IconSend className="h-5 w-5" />
                        <span className="hidden sm:inline">Enviar</span>
                      </>
                    )}
                  </button>
                </form>
                
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
                  Presiona Enter para enviar • IA Profesor te ayuda a aprender de manera inteligente
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Note Dialog */}
      {isNoteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
           <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-2xl">
             <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Guardar Nota</h3>
             <p className="text-sm text-slate-500 mb-4">Edita el contenido antes de guardar.</p>
             <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full h-40 p-3 mb-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
             />
             <div className="flex justify-end gap-2">
               <button
                 onClick={() => setIsNoteDialogOpen(false)}
                 className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
               >
                 Cancelar
               </button>
               <button
                 onClick={handleSaveNote}
                 className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
               >
                 Guardar Nota
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
