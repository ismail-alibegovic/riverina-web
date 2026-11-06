'use client';
import { useState } from 'react';

/** Round share button (reference: arrow next to PDF): native share sheet where available, else copies the link. */
export default function Share({ url, title, label, copied }: { url: string; title: string; label: string; copied: string }) {
  const [done, setDone] = useState(false);
  const share = async () => {
    const abs = new URL(url, location.href).href;
    try {
      if (navigator.share) { await navigator.share({ title, url: abs }); return; }
      await navigator.clipboard.writeText(abs);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch { /* cancelled */ }
  };
  return (
    <button type="button" className="k-circ" onClick={share} aria-label={label} title={done ? copied : label}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11 4l6 5.5-6 5.5v-3.2c-4 0-6.6 1.2-8.5 4.2.6-4.6 3.2-7.6 8.5-8.3z" /></svg>
      {done && <span className="k-circ-tip" role="status">{copied}</span>}
    </button>
  );
}
