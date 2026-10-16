import { NextResponse } from 'next/server';
import { SUPABASE_URL, SUPABASE_KEY } from '@/lib/content';

// Stores an enquiry (apartment form or contact form) and optionally e-mails the sales team via Resend.
export async function POST(req: Request) {
  let p: Record<string, unknown>;
  try { p = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_lead`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p }),
  });
  if (!r.ok) {
    const msg = await r.text();
    return NextResponse.json({ error: /rate/.test(msg) ? 'rate limited' : 'invalid' }, { status: /rate/.test(msg) ? 429 : 400 });
  }
  const key = process.env.RESEND_API_KEY, to = process.env.LEAD_NOTIFY_EMAIL;
  if (key && to && !p.website) {
    const s = (v: unknown) => String(v ?? '').slice(0, 2000);
    const subject = p.unit ? `Novi upit za stan ${s(p.unit)}` : 'Nova poruka s web stranice';
    const text = [p.unit ? `Stan: ${s(p.unit)} (${s(p.building)})` : '', `Ime: ${s(p.name)}`, `E-mail: ${s(p.email)}`, `Telefon: ${s(p.phone)}`, '', s(p.message), '', `Stranica: ${s(p.page)}`].filter((x, i) => x || i > 0).join('\n');
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.LEAD_FROM_EMAIL || 'Riverina Residence <onboarding@resend.dev>', to: to.split(',').map((x) => x.trim()), subject, text, reply_to: p.email ? s(p.email) : undefined }),
      });
    } catch (e) { console.error('resend failed', e); }
  }
  return NextResponse.json({ ok: true });
}
