import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { SUPABASE_URL, SUPABASE_KEY } from '@/lib/content';

// Called by the CMS after every save: refreshes the cached public pages immediately.
export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: '{}',
    cache: 'no-store',
  });
  if (!r.ok || (await r.json()) !== true) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  revalidateTag('site', 'max');
  revalidatePath('/');
  revalidatePath('/en');
  return NextResponse.json({ ok: true, at: Date.now() });
}
