// Respuestas en tiempo real de un hilo (Supabase Realtime, canal postgres_changes).
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Reply { id: string; body: string; created_at: string; author: string }
interface Props { threadId: string; initial: Reply[]; supabaseUrl: string; anonKey: string }

export default function LiveReplies({ threadId, initial, supabaseUrl, anonKey }: Props) {
  const [replies, setReplies] = useState<Reply[]>(initial);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!supabaseUrl || !anonKey) return;
    const sb = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const channel = sb
      .channel(`replies:${threadId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'replies', filter: `thread_id=eq.${threadId}` }, (payload) => {
        const row = payload.new as { id: string; body: string; created_at: string; author_name: string | null };
        const author = row.author_name || 'Miembro';
        setReplies((prev) => (prev.some((r) => r.id === row.id) ? prev : [...prev, { id: row.id, body: row.body, created_at: row.created_at, author }]));
      })
      .subscribe((status) => setLive(status === 'SUBSCRIBED'));
    return () => { sb.removeChannel(channel); };
  }, [threadId, supabaseUrl, anonKey]);

  return (
    <div>
      <p className="text-xs text-text-mute mb-4 flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${live ? 'bg-emerald-400' : 'bg-text-mute'}`} />
        {replies.length} {replies.length === 1 ? 'respuesta' : 'respuestas'} {live ? '· en vivo' : ''}
      </p>
      <ul className="space-y-3">
        {replies.map((r) => (
          <li key={r.id} className="glass rounded-xl p-4">
            <p className="text-xs text-text-mute">{r.author} · {new Date(r.created_at).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            <p className="mt-2 text-sm text-text-soft whitespace-pre-line">{r.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
