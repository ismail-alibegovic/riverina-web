'use client';
import { useEffect, useRef } from 'react';
import { Lang, Page, tx } from '@/lib/content';
import { href, UI } from '@/lib/i18n';
import { whenNear } from '@/lib/motion';
import { HERO_VARIANT } from '@/lib/heroVariant';
import { Fill, Rich } from './text';

/**
 * Two hero compositions under review (lib/heroVariant.ts). Both keep every word on a solid field, never over the
 * render, and both appear at once: the entrance is CSS (no intro screen, no waiting for scripts).
 *  - 'split': navy page; the title column on the left, the render as a tall plate bleeding off the right edge.
 *  - 'folio': ivory page; a masthead title over a panoramic plate that bleeds off the right edge.
 */

type Props = { hero: NonNullable<Page['hero']>; lang: Lang; name: string; tag?: string };

export default function Hero(p: Props) {
  return HERO_VARIANT === 'folio' ? <Folio {...p} /> : <Split {...p} />;
}

/** "Riverina Residence" → ["Riverina", "Residence"]; a CMS title with a line break keeps its own lines. */
function titleLines(raw: string) {
  const t = raw.trim();
  if (t.includes('\n')) return t.split('\n').map((l) => l.trim()).filter(Boolean);
  const w = t.split(/\s+/);
  return w.length === 2 ? w : [t];
}

/** The plate drifts a little inside its frame while the hero scrolls away (desktop pointer devices only). */
function usePlateDrift() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return whenNear(el, ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px)', () => {
        const tw = gsap.fromTo(el.querySelector('.hr-drift'), { yPercent: 0 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
        return () => { tw.scrollTrigger?.kill(); tw.kill(); };
      });
      return () => mm.revert();
    }, '0px');
  }, []);
  return root;
}

function Title({ lines }: { lines: string[] }) {
  return (
    <h1 id="hero-title" className="hr-title">
      {lines.map((l, i) => (
        <span className="hr-line" key={i} style={{ '--i': i } as React.CSSProperties}><span><Rich text={l} /></span></span>
      ))}
    </h1>
  );
}

function Plate({ src, sizes }: { src?: string; sizes: string }) {
  return (
    <div className="hr-plate" aria-hidden="true">
      <div className="hr-drift"><Fill src={src} sizes={sizes} priority quality={80} /></div>
    </div>
  );
}

function Ctas({ hero, lang }: { hero: Props['hero']; lang: Lang }) {
  const cta2 = tx(hero.cta2, lang);
  return (
    <div className="hr-ctas">
      <a className="ed-cta" href={href('apartments', lang)}><span>{tx(hero.cta, lang) || UI[lang].chooseApartment}</span><i aria-hidden="true" /></a>
      {cta2 && <a className="hr-cta2" href="#kontakt">{cta2}</a>}
    </div>
  );
}

function Split({ hero, lang, name, tag }: Props) {
  const root = usePlateDrift();
  const lines = titleLines(tx(hero.title, lang) || name);
  return (
    <section ref={root} className="hr ha" aria-labelledby="hero-title">
      <div className="ha-col">
        <p className="hr-eyebrow label"><i aria-hidden="true" />{tx(hero.eyebrow, lang)}</p>
        <div className="ha-body">
          <Title lines={lines} />
          <span className="hr-rule" aria-hidden="true" />
          {tx(hero.subtitle, lang) && <p className="hr-sub">{tx(hero.subtitle, lang)}</p>}
          <Ctas hero={hero} lang={lang} />
        </div>
        {tag && <p className="hr-cap">{name} · {tag}</p>}
      </div>
      <Plate src={hero.image} sizes="(min-width: 901px) 58vw, 100vw" />
    </section>
  );
}

function Folio({ hero, lang, name, tag }: Props) {
  const root = usePlateDrift();
  const lines = titleLines(tx(hero.title, lang) || name);
  return (
    <section ref={root} className="hr hb" aria-labelledby="hero-title">
      <div className="hb-head">
        <Title lines={lines} />
        <div className="hb-note">
          <p className="hr-eyebrow label">{tx(hero.eyebrow, lang)}</p>
          {tx(hero.subtitle, lang) && <p className="hr-sub">{tx(hero.subtitle, lang)}</p>}
        </div>
      </div>
      <span className="hr-rule" aria-hidden="true" />
      <div className="hb-stage">
        <div className="hb-side">
          <Ctas hero={hero} lang={lang} />
          {tag && <p className="hr-cap">{name} · {tag}</p>}
        </div>
        <Plate src={hero.image} sizes="(min-width: 901px) 80vw, 100vw" />
      </div>
    </section>
  );
}
