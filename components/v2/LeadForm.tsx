'use client';
import { useId, useState } from 'react';
import { UI } from '@/lib/content';
import { href, type Lang } from '@/lib/i18n';
import { Arrow } from './ui';

type Field = 'name' | 'contact' | 'email' | 'consent';
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Enquiry form of the redesign. Same payload and rules as the existing forms (submit_lead() in the database via
 * /api/lead); with `unit` the enquiry is tied to that apartment, exactly like the viewer's own form.
 */
export default function LeadForm({ lang, unit, building, message }: { lang: Lang; unit?: string; building?: string; message?: string }) {
  const t = UI[lang];
  const id = useId();
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err' | 'rate' | 'invalid'>('idle');
  const [errors, setErrors] = useState<Partial<Record<Field, true>>>({});
  const msg: Record<Field, string> = { name: t.errName, contact: t.errContact, email: t.errEmail, consent: t.errConsent };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const fd = Object.fromEntries(new FormData(f).entries()) as Record<string, string>;
    const payload: Record<string, string | boolean> & { name?: string; email?: string; phone?: string } = { ...fd, consent: (f.elements.namedItem('consent') as HTMLInputElement).checked, lang, page: location.href, unit: unit || '', building: building || '' };
    const errs: Partial<Record<Field, true>> = {};
    if (!String(payload.name || '').trim()) errs.name = true;
    const email = String(payload.email || '').trim();
    if (!email && !String(payload.phone || '').trim()) errs.contact = true;
    else if (email && !EMAIL.test(email)) errs.email = true;
    if (!payload.consent) errs.consent = true;
    setErrors(errs);
    if (Object.keys(errs).length) {
      setState('invalid');
      (f.elements.namedItem(errs.name ? 'name' : errs.contact || errs.email ? 'email' : 'consent') as HTMLElement | null)?.focus();
      return;
    }
    setState('sending');
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setState(r.ok ? 'ok' : r.status === 429 ? 'rate' : 'err');
      if (r.ok) f.reset();
    } catch { setState('err'); }
  }

  const fid = (k: string) => `${id}-${k}`;
  const err = (k: Field) => errors[k] && <span className="k-ferr" id={fid(k + '-err')}>{msg[k]}</span>;
  const desc = (...ks: Field[]) => ks.filter((k) => errors[k]).map((k) => fid(k + '-err')).join(' ') || undefined;
  return (
    <form className="k-form" onSubmit={onSubmit} noValidate>
      <div className="k-field">
        <input id={fid('name')} name="name" autoComplete="name" placeholder=" " maxLength={190} aria-invalid={!!errors.name} aria-describedby={desc('name')} />
        <label htmlFor={fid('name')}>{t.name}</label>
        {err('name')}
      </div>
      <div className="k-field-2">
        <div className="k-field">
          <input id={fid('phone')} name="phone" type="tel" autoComplete="tel" placeholder=" " maxLength={64} aria-invalid={!!errors.contact} aria-describedby={desc('contact')} />
          <label htmlFor={fid('phone')}>{t.phone}</label>
        </div>
        <div className="k-field">
          <input id={fid('email')} name="email" type="email" autoComplete="email" placeholder=" " maxLength={190} aria-invalid={!!(errors.contact || errors.email)} aria-describedby={desc('contact', 'email')} />
          <label htmlFor={fid('email')}>{t.email}</label>
          {err('email')}
        </div>
      </div>
      {err('contact')}
      <div className="k-field">
        <textarea id={fid('msg')} name="message" rows={3} placeholder=" " maxLength={4000} defaultValue={message} />
        <label htmlFor={fid('msg')}>{t.message}</label>
      </div>
      <input type="text" name="website" className="k-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="k-consent">
        <input type="checkbox" name="consent" aria-invalid={!!errors.consent} aria-describedby={desc('consent')} />
        <span>{t.consent} <a href={href('privacy', lang)}>{t.consentLink}</a></span>
      </label>
      {err('consent')}
      <div className="k-form-foot">
        <button type="submit" className="kt-pill is-navy" disabled={state === 'sending'}>{state === 'sending' ? t.sending : t.send}<Arrow /></button>
        <p className={'k-fstatus' + (state === 'ok' ? ' is-ok' : state === 'idle' || state === 'sending' ? '' : ' is-err')} role="status">
          {state === 'ok' ? t.ok : state === 'err' ? t.err : state === 'rate' ? t.errRate : state === 'invalid' ? t.required : ''}
        </p>
      </div>
    </form>
  );
}
