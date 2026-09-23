// Aviso en vivo de hilos nuevos en /comunidad (Supabase Realtime).
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function LiveThreadsNotice({ supabaseUrl, anonKey }: { supabaseUrl: string; anonKey: string }) {
  const [fresh, setFresh] = useState<{ id: string; title: string }[]>([]);
  useEffect(() => {
    if (!supabaseUrl || !anonKey) return;
    const sb = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const ch = sb
      .channel('threads:new')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'threads' }, (p) => {
        const t = p.new as { id: string; title: string };
        setFresh((prev) => [t, ...prev].slice(0, 5));
      })
      .subscribe();
    return () => { sb.removeChannel(ch); };
  }, [supabaseUrl, anonKey]);

  if (fresh.length === 0) return null;
  return (
    <div className="mb-4 rounded-xl border border-aurora-cyan/40 bg-aurora-cyan/10 p-4 text-sm">
      <p className="font-semibold">Nuevo en la comunidad</p>
      <ul className="mt-2 space-y-1">
        {fresh.map((t) => <li key={t.id}><a className="text-aurora-cyan" href={`/comunidad/${t.id}`}>{t.title} →</a></li>)}
      </ul>
    </div>
  );
}
