'use client';
import { useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY, mediaUrl, DEFAULT_PAGE } from '@/lib/content';

export default function AdminPage() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || ref.current.dataset.mounted) return;
    ref.current.dataset.mounted = '1';
    if (!SUPABASE_URL || !SUPABASE_KEY) { ref.current.innerHTML = '<div class="cms-error">Nedostaju NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.</div>'; return; }
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'riverina-cms' } });
    const el = ref.current;
    import('@/lib/admin/app.js').then((m) => m.mount(el, sb, { mediaUrl, defaultPage: DEFAULT_PAGE }));
  }, []);
  return <div ref={ref} className="cms"><p className="cms-loading">Učitavam…</p></div>;
}
