'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LOCALES, type Lang } from '@/lib/i18n';
import { V2 } from '@/lib/v2/copy';

type Props = {
  lang: Lang;
  tone: 'hero' | 'light';
  nav: { href: string; label: string; current?: boolean }[];
  homeHref: string;
  ctaHref: string;
  contactHref: string;
  langLinks: { lang: Lang; href: string }[];
  phone: string;
  email: string;
  company: string;
  classicHref: string;
};

const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Minimal pill navigation of the reference: round menu button and short links on the left, the original logo in the
 * middle, language and the apartment call to action on the right. Over the hero it is transparent with light text;
 * once the hero has scrolled away it becomes a cream bar.
 */
export default function Header(p: Props) {
  const t = V2[p.lang];
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(p.tone === 'light');
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (p.tone === 'light') return;
    const first = document.querySelector('.kt-main > :first-child');
    if (!first) return;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), { rootMargin: '-72px 0px 0px 0px' });
    io.observe(first);
    return () => io.disconnect();
  }, [p.tone]);

  const close = useCallback((focus = true) => {
    setOpen(false);
    if (focus) toggle.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const main = document.getElementById('main');
    html.classList.toggle('kt-locked', open);
    if (main) main.inert = open;
    if (!open) return;
    const timer = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true }), 300);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = [toggle.current!, ...Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE))];
      const i = items.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
    };
    document.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(timer); document.removeEventListener('keydown', onKey); };
  }, [open, close]);

  const onDark = !solid && !open ? true : open;
  return (
    <>
      <a className="kt-skip" href="#main">{p.lang === 'bs' ? 'Preskoči na sadržaj' : 'Skip to content'}</a>
      <header className={'kt-hdr' + (solid ? ' is-solid' : '') + (open ? ' is-open' : '')} data-dark={onDark ? '' : undefined}>
        <div className="kt-hdr-in">
          <div className="kt-hdr-l">
            <button ref={toggle} type="button" className="kt-burger" aria-expanded={open} aria-controls="kt-menu" aria-label={open ? t.close : t.menu} onClick={() => (open ? close() : setOpen(true))}>
              <i /><i />
            </button>
            <nav className="kt-hdr-nav" aria-label={t.menu}>
              {p.nav.slice(0, 4).map((n) => (
                <a key={n.href} href={n.href} aria-current={n.current ? 'page' : undefined} tabIndex={open ? -1 : undefined}>{n.label}</a>
              ))}
            </nav>
          </div>
          <a href={p.homeHref} className="kt-logo" aria-label="Riverina Residence">
            {/* original Riverina wordmark, unchanged */}
            <img className="on-dark" src="/brand/wordmark-light.webp" alt="" width={480} height={108} />
            <img className="on-light" src="/brand/wordmark.webp" alt="" width={480} height={108} />
          </a>
          <div className="kt-hdr-r">
            <div className="kt-langs" aria-label={t.language}>
              {p.langLinks.map((l) => (
                <a key={l.lang} href={l.href} hrefLang={l.lang} lang={l.lang} aria-current={l.lang === p.lang ? 'true' : undefined} tabIndex={open ? -1 : undefined}>{LOCALES[l.lang].label}</a>
              ))}
            </div>
            <a className="kt-circle" href={p.contactHref} aria-label={t.contact} tabIndex={open ? -1 : undefined}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5h16v11H4z M4.5 7l7.5 6 7.5-6" /></svg>
            </a>
            <a className="kt-pill kt-hdr-cta" href={p.ctaHref} tabIndex={open ? -1 : undefined}>{t.choose}</a>
          </div>
        </div>
      </header>

      <div ref={panel} id="kt-menu" className={'kt-menu' + (open ? ' is-open' : '')} role="dialog" aria-modal="true" aria-label={t.menu} aria-hidden={!open}>
        <nav className="kt-menu-nav">
          <ol>
            {p.nav.map((n, i) => (
              <li key={n.href} style={{ '--i': i } as React.CSSProperties}>
                <a href={n.href} tabIndex={open ? undefined : -1} onClick={() => close(false)}>
                  <span className="kt-menu-n">{String(i + 1).padStart(2, '0')}</span>{n.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="kt-menu-foot">
          <div>
            <span className="kt-label">{t.language}</span>
            <div className="kt-menu-langs">
              {p.langLinks.map((l) => (
                <a key={l.lang} href={l.href} hrefLang={l.lang} aria-current={l.lang === p.lang ? 'true' : undefined} tabIndex={open ? undefined : -1}>{LOCALES[l.lang].name}</a>
              ))}
            </div>
          </div>
          <div>
            <span className="kt-label">{t.contact}</span>
            {p.phone && <a href={'tel:' + p.phone.replace(/[^\d+]/g, '')} tabIndex={open ? undefined : -1}>{p.phone}</a>}
            {p.email && <a href={'mailto:' + p.email} tabIndex={open ? undefined : -1}>{p.email}</a>}
            <span>{p.company}</span>
          </div>
          <div className="kt-menu-cta">
            <a className="kt-pill is-gold" href={p.ctaHref} tabIndex={open ? undefined : -1} onClick={() => close(false)}>{t.choose}</a>
            <a className="kt-link" href={p.classicHref} tabIndex={open ? undefined : -1}>{t.classic}</a>
          </div>
        </div>
      </div>
    </>
  );
}
