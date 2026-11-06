'use client';
import { useState } from 'react';
import Image from 'next/image';

/**
 * Stacked rows with one picture (the reference's "The epitome of style / Natural materials / Landscaping"):
 * hovering or focusing a row brings its render forward. On phones each row shows its own picture.
 */
export default function Rows({ rows, tag }: { rows: { title: string; text: string; src: string }[]; tag?: string }) {
  const [on, setOn] = useState(0);
  return (
    <div className="k-rowsec">
      <ol className="k-rowlist">
        {rows.map((r, i) => (
          <li key={i} className={i === on ? 'is-on' : ''} onMouseEnter={() => setOn(i)}>
            <button type="button" onClick={() => setOn(i)} onFocus={() => setOn(i)} aria-expanded={i === on}>
              <span className="k-rowt">{r.title}</span>
            </button>
            <div className="k-rowbody"><div><svg className="k-sparkle" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10z" /></svg><p>{r.text}</p></div></div>
            <div className="k-img k-rowimg-m"><Image src={r.src} alt="" fill sizes="100vw" quality={75} /></div>
          </li>
        ))}
      </ol>
      <div className="k-rowpics" aria-hidden="true">
        {rows.map((r, i) => (
          <div key={i} className={'k-img' + (i === on ? ' is-on' : '')}><Image src={r.src} alt="" fill sizes="50vw" quality={78} /></div>
        ))}
        {tag && <span className="kt-tag">{tag}</span>}
      </div>
    </div>
  );
}
