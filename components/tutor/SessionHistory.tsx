
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  IconSearch, 
  IconMessage, 
  IconCalendar, 
  IconRobot 
} from "@tabler/icons-react";
import { getUserSessions, ChatSession } from "@/lib/api";
import { getSubjectIcon, getSubjectLabel } from "@/lib/subjects";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface SessionHistoryProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSession: (sessionId: string, subject: string) => void;
}

export function SessionHistory({ isOpen, onOpenChange, onSelectSession }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadSessions = useCallback(async () => {
    if (!isOpen) return;
    
    setLoading(true);
    try {
      const data = await getUserSessions(undefined, search);
      setSessions(data);
    } catch (error) {
      console.error("Error loading sessions:", error);
      toast.error("Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  }, [isOpen, search]);
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadSessions();
    }, 500);

    return () => clearTimeout(timer);
  }, [loadSessions]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 gap-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <IconCalendar className="h-5 w-5 text-indigo-500" />
            Historial de Conversaciones
          </DialogTitle>
          <div className="relative mt-4">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por tema o contenido..."
              className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <IconMessage className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No se encontraron conversaciones</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id, session.subject || "general")}
                  className="w-full text-left p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 capitalize">
                      {getSubjectIcon(session.subject || "general")}
                      {getSubjectLabel(session.subject)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(session.updatedAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {session.messages?.[0]?.content || "Nueva conversación..."}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
