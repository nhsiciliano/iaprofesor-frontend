"use client";

import { useState, useEffect, useRef } from "react";
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
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useTutorSessions } from "@/hooks/useTutorSessions";
import { debugAuth } from "@/lib/debug-auth";
import { getAvailableSubjects } from "@/lib/api";

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
];

export default function TutorPage() {
  const { user } = useAuth();
  const [inputMessage, setInputMessage] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Usar el hook personalizado para manejar sesiones
  const {
    currentSubject,
    currentSession,
    subjectSessions,
    selectSubject,
    sendChatMessage,
    addWelcomeMessage,
  } = useTutorSessions();

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
      }
      
      setSelectedSubject(subject);
      await selectSubject(subject.id);
      
      // Agregar mensaje de bienvenida si es necesario
      setTimeout(() => {
        addWelcomeMessage(subject.id, subject.name);
      }, 100);
    } catch (error) {
      console.error("Error al seleccionar materia:", error);
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
            <div className="flex items-center gap-4 mb-8">
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
                <div>
                  <h1 className="text-3xl font-bold font-orbitron">{selectedSubject.name}</h1>
                  <p className="text-white/80 mt-1">{selectedSubject.description}</p>
                </div>
              </div>
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
                          </div>
                        )}
                        <div className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
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
                      </div>
                    </motion.div>
                  ))
                )}
                
                {/* Loading indicator */}
                {currentSession?.isLoading && (
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
                <form onSubmit={handleSendMessage} className="flex gap-3">
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
    </div>
  );
}
