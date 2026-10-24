import { notFound } from 'next/navigation';
export const metadata = { robots: { index: false, follow: false } };

// The developer page is switched off: the site does not present the developer (owner's decision, 24. 10. 2026).
export default function Page() {
  notFound();
}
