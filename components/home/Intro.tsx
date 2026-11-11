import { Rich, Paras } from './text';

export type Fact = { value: string; count?: number; label: string };

/**
 * What Riverina is, in one sentence, and the four figures that make it concrete. The figures come from the live
 * apartment list (lib/units.ts), so they always match the explorer.
 */
export default function Intro({ id, label, statement, text, facts }: { id?: string; label: string; statement: string; text: string; facts: Fact[] }) {
  return (
    <section id={id} className="section ix" aria-label={label}>
      <div className="wrap wrap-wide ix-grid">
        <p className="label ix-label" data-reveal="fade">{label}</p>
        <p className="ix-statement" data-reveal="up"><Rich text={statement} /></p>
        <div className="ix-side">
          <div data-reveal="up" style={{ '--i': 1 } as React.CSSProperties}><Paras className="ix-text" text={text} /></div>
          <dl className="ix-facts">
            {facts.map((f, i) => (
              <div className="ix-fact" key={f.label} data-reveal="up" style={{ '--i': i + 1 } as React.CSSProperties}>
                <dt>{f.label}</dt>
                <dd>{f.count != null ? <span data-count={f.count}>{f.value}</span> : f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
