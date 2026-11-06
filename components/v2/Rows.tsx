'use client';
import { useState } from 'react';
import Image from 'next/image';

/**
 * Reference "The epitome of style / Natural materials / Landscaping": each row is title + text on the left and its
 * own render on the right. The open row is tall; the others fold into a thin strip that shows only the top of the
 * title and a slice of the picture. Hover, focus or click opens a row. On phones every row is open.
 */
export default function Rows({ rows, tag }: { rows: { title: string; text: string; src: string }[]; tag?: string }) {
  const [on, setOn] = useState(rows.length - 1);
  return (
    <ol className="k-rws">
      {rows.map((r, i) => (
        <li key={i} className={i === on ? 'is-on' : ''} onMouseEnter={() => setOn(i)}>
          <div className="k-rw-text">
            <button type="button" onClick={() => setOn(i)} onFocus={() => setOn(i)} aria-expanded={i === on}>
              <span className="k-rwt">{r.title}</span>
            </button>
            <div className="k-rw-body">
              <svg className="k-sparkle" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10z" /></svg>
              <p>{r.text}</p>
            </div>
          </div>
          <div className="k-img k-rw-img">
            <Image src={r.src} alt="" fill sizes="(min-width: 900px) 50vw, 100vw" quality={78} />
            {tag && i === on && <span className="kt-tag">{tag}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}
