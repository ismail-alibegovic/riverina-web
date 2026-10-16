'use client';
import { useEffect, useState } from 'react';

export default function SiteHeader({ nav, lang, logo, name, menuLabel, closeLabel }: { nav: { href: string; label: string }[]; lang: 'bs' | 'en'; logo: string; name: string; menuLabel: string; closeLabel: string }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
  }, [open]);
  const other = lang === 'en' ? { href: '/', label: 'BS' } : { href: '/en', label: 'EN' };
  return (
    <header className={'site-header' + (solid || open ? ' is-solid' : '')}>
      <div className="wrap header-inner">
        <a href={lang === 'en' ? '/en' : '/'} className="brand" aria-label={name}>
          {logo ? <img src={logo} alt={name} /> : <span className="wordmark">{name.replace(/\s*Residence$/i, '')}<small>Residence</small></span>}
        </a>
        <nav className={'nav' + (open ? ' is-open' : '')} aria-label="Glavna navigacija">
          {nav.map((n) => <a key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>)}
          <span className="lang-switch">
            <a href={lang === 'en' ? '/' : '/en'} hrefLang={other.label.toLowerCase()} onClick={() => setOpen(false)}>{other.label}</a>
          </span>
        </nav>
        <button type="button" className="menu-btn" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? closeLabel : menuLabel}</button>
      </div>
    </header>
  );
}
