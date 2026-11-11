'use client';
import { useEffect, useRef } from 'react';
import type { Lang } from '@/lib/i18n';
import ContactForm from '../ContactForm';

/** Side sheet with the enquiry form, already tied to the apartment. Esc, the backdrop or the button close it. */
export default function Enquiry({ open, onClose, lang, title, text, unit, building, message, closeLabel, summary }: {
  open: boolean; onClose: () => void; lang: Lang; title: string; text: string; unit: string; building: string; message: string; closeLabel: string;
  summary?: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    back.current = document.activeElement as HTMLElement;
    document.documentElement.classList.add('sheet-open');
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('input:not(.hp)')?.focus({ preventScroll: true }), 420);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key !== 'Tab' || !panel.current) return;
      const f = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not(.hp), textarea')).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(t); document.removeEventListener('keydown', onKey); document.documentElement.classList.remove('sheet-open'); back.current?.focus?.({ preventScroll: true }); };
  }, [open, onClose]);

  return (
    <div className={'sheet' + (open ? ' is-open' : '')} aria-hidden={!open}>
      <button type="button" className="sheet-backdrop" onClick={onClose} tabIndex={-1} aria-label={closeLabel} />
      <div ref={panel} className="sheet-panel" role="dialog" aria-modal="true" aria-labelledby="sheet-title" data-lenis-prevent>
        <div className="sheet-head">
          <h2 id="sheet-title">{title}</h2>
          <button type="button" className="round sheet-x" onClick={onClose} aria-label={closeLabel}><span aria-hidden="true">✕</span></button>
        </div>
        {summary}
        <p className="sheet-text">{text}</p>
        {open && <ContactForm lang={lang} unit={unit} building={building} message={message} idPrefix="eq" />}
      </div>
    </div>
  );
}
