'use client';
import { useState } from 'react';
import { UI } from '@/lib/content';

export default function ContactForm({ lang }: { lang: 'bs' | 'en' }) {
  const t = UI[lang];
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err' | 'invalid'>('idle');
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const fd = Object.fromEntries(new FormData(f).entries()) as Record<string, string>;
    const payload: Record<string, unknown> & { name?: string; email?: string; phone?: string } = { ...fd, consent: (f.elements.namedItem('consent') as HTMLInputElement).checked, lang, page: location.href, unit: '', building: '' };
    if (!payload.name || !(payload.email || payload.phone) || !payload.consent) { setState('invalid'); return; }
    setState('sending');
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setState(r.ok ? 'ok' : 'err');
      if (r.ok) f.reset();
    } catch { setState('err'); }
  }
  return (
    <form className="cform" onSubmit={onSubmit} noValidate>
      <div className="cform-row">
        <label htmlFor="cf-name">{t.name}</label>
        <input id="cf-name" name="name" autoComplete="name" required />
      </div>
      <div className="cform-2">
        <div className="cform-row"><label htmlFor="cf-phone">{t.phone}</label><input id="cf-phone" name="phone" type="tel" autoComplete="tel" /></div>
        <div className="cform-row"><label htmlFor="cf-email">{t.email}</label><input id="cf-email" name="email" type="email" autoComplete="email" /></div>
      </div>
      <div className="cform-row"><label htmlFor="cf-msg">{t.message}</label><textarea id="cf-msg" name="message" rows={4} /></div>
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="cform-consent"><input type="checkbox" name="consent" /> {t.consent}</label>
      <button type="submit" className="btn btn-gold" disabled={state === 'sending'}>{state === 'sending' ? t.sending : t.send}</button>
      <p className={'cform-status' + (state === 'ok' ? ' is-ok' : state === 'err' || state === 'invalid' ? ' is-err' : '')} role="status">
        {state === 'ok' ? t.ok : state === 'err' ? t.err : state === 'invalid' ? t.required : ''}
      </p>
    </form>
  );
}
