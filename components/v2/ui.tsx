import { Rich } from '@/components/home/text';

/** Section heading: each line of the text is its own line; *word* is set in the italic serif. */
export function Title({ text, id, as: Tag = 'h2', className = '' }: { text: string; id?: string; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <Tag id={id} className={'kt-title ' + className} data-k="lines">
      {lines.map((l, i) => (
        <span className="kt-line" key={i} style={{ '--i': i } as React.CSSProperties}><span><Rich text={l} /></span></span>
      ))}
    </Tag>
  );
}

/** Small section label with a gold hairline, as in the reference ("Architecture", "Apartments"). */
export function Label({ children, center, light }: { children: React.ReactNode; center?: boolean; light?: boolean }) {
  return <p className={'kt-label kt-eyebrow' + (center ? ' is-center' : '') + (light ? ' is-light' : '')} data-k="fade">{children}</p>;
}

export function Arrow() {
  return <svg className="kt-arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" /></svg>;
}
