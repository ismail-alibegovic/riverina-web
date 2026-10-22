'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getLenis } from './SmoothScroll';
import { LOCALES, UI, Lang } from '@/lib/i18n';

export type NavItem = { href: string; label: string; current?: boolean };
export type HeaderProps = {
  lang: Lang;
  name: string;
  homeHref: string;
  nav: NavItem[];
  contactHref: string;
  langLinks: { lang: Lang; href: string }[];
  /** 'light' = light text over a dark hero image, 'dark' = navy text on paper from the start */
  tone?: 'light' | 'dark';
  logoOnDark: string;
  logoOnLight: string;
  phone?: string;
  email?: string;
  socials?: { label: string; href: string }[];
  company?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Header(p: HeaderProps) {
  const t = UI[p.lang];
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(p.tone === 'dark');
  const sentinel = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // Solid header once the top of the page (hero) has scrolled away. No scroll listener.
  // The page's first block (hero or page header) decides: solid as soon as its bottom passes under the header.
  useEffect(() => {
    if (p.tone === 'dark' || !sentinel.current) return;
    const first = document.querySelector('#main > :first-child') || sentinel.current;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' });
    io.observe(first);
    return () => io.disconnect();
  }, [p.tone]);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggle.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const main = document.getElementById('main');
    html.classList.toggle('menu-open', open);
    if (main) main.inert = open;
    const lenis = getLenis();
    if (open) lenis?.stop(); else lenis?.start();
    if (!open) return;
    const first = menu.current?.querySelector<HTMLElement>('.menu-list a');
    const focusTimer = window.setTimeout(() => first?.focus({ preventScroll: true }), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const items = [header.current, menu.current].flatMap((el) => (el ? Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)) : [])).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === items.length - 1 ? 0 : i + 1);
      e.preventDefault();
      items[next].focus();
    };
    document.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(focusTimer); document.removeEventListener('keydown', onKey); };
  }, [open, close]);

  const cls = ['hdr', solid && !open ? 'is-solid' : '', open ? 'menu-is-open' : ''].filter(Boolean).join(' ');
  const year = new Date().getFullYear();

  return (
    <>
      <a className="skip" href="#main">{t.skip}</a>
      <div ref={sentinel} className="hdr-sentinel" aria-hidden="true" />
      <header ref={header} className={cls} data-tone={p.tone || 'light'}>
        <div className="wrap wrap-wide hdr-inner">
          <div className="hdr-side">
            <button ref={toggle} type="button" className="hdr-btn hdr-toggle" aria-expanded={open} aria-controls="site-menu" onClick={() => (open ? close() : setOpen(true))}>
              <span className="hdr-burger" aria-hidden="true"><i /><i /></span>
              <span className="hdr-swap"><span aria-hidden={open}>{t.menu}</span><span aria-hidden={!open}>{t.close}</span></span>
            </button>
            {/* wide screens: the sections as plain links, as on elicyon.com; the menu button takes over below 1100 px */}
            <nav className="hdr-links" aria-label={t.mainNav}>
              {p.nav.filter((n) => n.href !== p.contactHref && !/kontakt|contact/.test(n.href)).slice(0, 4).map((n) => (
                <a key={n.href} className="hdr-btn hdr-link" href={n.href} aria-current={n.current ? 'page' : undefined} tabIndex={open ? -1 : undefined}>{n.label}</a>
              ))}
            </nav>
          </div>
          <a href={p.homeHref} className="hdr-brand" aria-label={p.name}>
            {/* the R mark stands above the name over the hero and folds away once the header turns solid */}
            <span className="hdr-mark" aria-hidden="true">
              <img className="on-dark" src="/brand/mark-light.webp" alt="" width={316} height={240} />
              <img className="on-light" src="/brand/mark.webp" alt="" width={400} height={303} />
            </span>
            <img className="on-dark" src={p.logoOnDark} alt="" width={480} height={108} fetchPriority="high" />
            <img className="on-light" src={p.logoOnLight} alt="" width={480} height={108} fetchPriority="high" />
          </a>
          <div className="hdr-side is-end">
            <span className="hdr-langs">
              {p.langLinks.map((l) => (
                <a key={l.lang} className="hdr-btn hdr-lang" href={l.href} hrefLang={l.lang} lang={l.lang} aria-current={l.lang === p.lang ? 'true' : undefined} tabIndex={open ? -1 : undefined}>{l.lang.toUpperCase()}</a>
              ))}
            </span>
            <a className="hdr-btn hdr-contact" href={p.contactHref} tabIndex={open ? -1 : undefined}>{t.contact}</a>
          </div>
        </div>
      </header>

      <div ref={menu} data-lenis-prevent id="site-menu" className={'menu' + (open ? ' is-open' : '')} role="dialog" aria-modal="true" aria-label={t.mainNav} aria-hidden={!open}>
        <div aria-hidden="true" />
        <nav className="menu-main" aria-label={t.mainNav}>
          <ul className="menu-list">
            {p.nav.map((n, i) => (
              <li key={n.href}>
                <a href={n.href} style={{ '--i': i } as React.CSSProperties} aria-current={n.current ? 'page' : undefined} tabIndex={open ? undefined : -1} onClick={() => close(false)}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-foot">
          <div className="menu-foot-col">
            <span className="label">{t.language}</span>
            <div className="menu-langs">
              {p.langLinks.map((l) => (
                <a key={l.lang} href={l.href} hrefLang={l.lang} lang={l.lang} aria-current={l.lang === p.lang ? 'true' : undefined} tabIndex={open ? undefined : -1}>{LOCALES[l.lang].label}</a>
              ))}
            </div>
          </div>
          <div className="menu-foot-col is-mid">
            {p.phone && <a href={'tel:' + p.phone.replace(/[^\d+]/g, '')} tabIndex={open ? undefined : -1}>{p.phone}</a>}
            {p.email && <a href={'mailto:' + p.email} tabIndex={open ? undefined : -1}>{p.email}</a>}
            {p.socials?.map((s) => <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? undefined : -1}>{s.label}</a>)}
          </div>
          <div className="menu-foot-col is-end">
            <span>© {year} {p.company || p.name}</span>
          </div>
        </div>
      </div>
    </>
  );
}
