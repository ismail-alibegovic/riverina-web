'use client';
import { useState } from 'react';
import { UI } from '@/lib/content';
import { href, Lang } from '@/lib/i18n';

type Field = 'name' | 'contact' | 'email' | 'consent';
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Same rules as submit_lead() in the database, so the visitor sees the problem before sending. */
function validate(p: { name?: string; email?: string; phone?: string; consent?: boolean }): Partial<Record<Field, true>> {
  const e: Partial<Record<Field, true>> = {};
  if (!p.name?.trim()) e.name = true;
  if (!p.email?.trim() && !p.phone?.trim()) e.contact = true;
  else if (p.email?.trim() && !EMAIL.test(p.email.trim())) e.email = true;
  if (!p.consent) e.consent = true;
  return e;
}

export default function ContactForm({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err' | 'rate' | 'invalid'>('idle');
  const [errors, setErrors] = useState<Partial<Record<Field, true>>>({});
  const msg: Record<Field, string> = { name: t.errName, contact: t.errContact, email: t.errEmail, consent: t.errConsent };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const fd = Object.fromEntries(new FormData(f).entries()) as Record<string, string>;
    const payload = { ...fd, consent: (f.elements.namedItem('consent') as HTMLInputElement).checked, lang, page: location.href, unit: '', building: '' };
    const errs = validate(payload);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setState('invalid');
      const first = errs.name ? 'name' : errs.contact || errs.email ? 'email' : 'consent';
      (f.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setState('sending');
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setState(r.ok ? 'ok' : r.status === 429 ? 'rate' : 'err');
      if (r.ok) f.reset();
    } catch { setState('err'); }
  }

  const err = (k: Field) => errors[k] && <span className="cform-err" id={`cf-${k}-err`}>{msg[k]}</span>;
  const described = (...ks: Field[]) => ks.filter((k) => errors[k]).map((k) => `cf-${k}-err`).join(' ') || undefined;
  return (
    <form className="cform" onSubmit={onSubmit} noValidate>
      <div className="cform-row">
        <label htmlFor="cf-name">{t.name}</label>
        <input id="cf-name" name="name" autoComplete="name" required maxLength={190} aria-invalid={!!errors.name} aria-describedby={described('name')} />
        {err('name')}
      </div>
      <div className="cform-2">
        <div className="cform-row">
          <label htmlFor="cf-phone">{t.phone}</label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" maxLength={64} aria-invalid={!!errors.contact} aria-describedby={described('contact')} />
        </div>
        <div className="cform-row">
          <label htmlFor="cf-email">{t.email}</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" maxLength={190} aria-invalid={!!(errors.contact || errors.email)} aria-describedby={described('contact', 'email')} />
          {err('email')}
        </div>
      </div>
      {err('contact')}
      <div className="cform-row"><label htmlFor="cf-msg">{t.message}</label><textarea id="cf-msg" name="message" rows={4} maxLength={4000} /></div>
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="cform-consent">
        <input type="checkbox" name="consent" aria-invalid={!!errors.consent} aria-describedby={described('consent')} />
        <span>{t.consent} <a href={href('privacy', lang)}>{t.consentLink}</a></span>
      </label>
      {err('consent')}
      <button type="submit" className="btn btn-gold" disabled={state === 'sending'}>{state === 'sending' ? t.sending : t.send}</button>
      <p className={'cform-status' + (state === 'ok' ? ' is-ok' : state === 'idle' || state === 'sending' ? '' : ' is-err')} role="status">
        {state === 'ok' ? t.ok : state === 'err' ? t.err : state === 'rate' ? t.errRate : state === 'invalid' ? t.required : ''}
      </p>
    </form>
  );
}
