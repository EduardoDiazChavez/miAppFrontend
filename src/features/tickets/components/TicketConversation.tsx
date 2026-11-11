"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { ApiError, apiRequest } from "@/src/features/auth/lib/api-client";
import { useSession } from "@/src/features/auth/hooks/useSession";
import { getTicket, toTicketMessages, type ApiTicketMessage } from "../lib/ticket-api";

type TicketConversationProps = {
  ticketId: string;
};

type TicketMessage = {
  id: string;
  author: string;
  role: "Cliente" | "Equipo";
  content: string;
  createdAt: string;
};

export function TicketConversation({ ticketId }: TicketConversationProps) {
  const { session } = useSession();
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTicket(ticketId);
      setMessages(toTicketMessages(result.messages));
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "No se pudo cargar el historial del ticket.",
      );
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadMessages(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadMessages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = message.trim();

    if (!content || !session || sending) {
      return;
    }

    setSending(true);
    setError("");
    try {
      const result = await apiRequest<{ message: ApiTicketMessage }>(
        `/tickets/${encodeURIComponent(ticketId)}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content }),
        },
      );
      setMessages((current) => [...current, ...toTicketMessages([result.message])]);
      setMessage("");
    } catch (saveError) {
      setError(
        saveError instanceof ApiError
          ? saveError.message
          : "No se pudo enviar el mensaje.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <MessageCircle size={19} aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Historial y conversación</h2>
          <p className="text-sm text-slate-500">Las actualizaciones de este ticket aparecen aquí.</p>
        </div>
      </div>

      {loading ? (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500" role="status">
          Cargando historial...
        </p>
      ) : messages.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Aún no hay mensajes en este ticket.
        </p>
      ) : (
        <ol className="space-y-4">
          {messages.map((item) => (
            <li key={item.id} className="flex gap-3">
              <span
                className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                  item.role === "Cliente" ? "bg-sky-500" : "bg-violet-500"
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.author}
                    <span className="ml-2 text-xs font-normal text-slate-500">{item.role}</span>
                  </p>
                  <time className="text-xs text-slate-400">{item.createdAt}</time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {item.content}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 border-t border-slate-100 pt-5">
        <label htmlFor="ticket-message" className="text-sm font-medium text-slate-700">
          {session?.role === "Cliente" ? "Responder al equipo" : "Agregar actualización"}
        </label>
        <textarea
          id="ticket-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          maxLength={2000}
          disabled={loading || Boolean(error && !messages.length)}
          placeholder="Escribe una actualización o respuesta..."
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!message.trim() || sending || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={15} aria-hidden="true" />
            {sending ? "Enviando..." : "Enviar mensaje"}
          </button>
        </div>
      </form>
    </section>
  );
}
