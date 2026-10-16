import { Lang, SiteData, UI, tx, mediaUrl, toSelectorData } from '@/lib/content';
import Selector from './Selector';

/** Samostalna stranica samo s interaktivnim pregledom stanova (embed = bez zaglavlja, za iframe). */
export default function ApartmentsOnly({ data, lang, embed }: { data: SiteData; lang: Lang; embed?: boolean }) {
  const t = UI[lang];
  const sel = toSelectorData(data);
  const has = sel.units.length > 0 || sel.buildings.length > 0;
  const name = data.settings.project_name || 'Riverina Residence';
  const logo = mediaUrl(data.settings.logo || '');
  const other = embed ? (lang === 'en' ? '/embed' : '/en/embed') : lang === 'en' ? '/stanovi' : '/en/stanovi';
  return (
    <div className={embed ? 'only only-embed' : 'only'}>
      {!embed && (
        <header className="only-head">
          <a href={lang === 'en' ? '/en' : '/'} className="brand" aria-label={name}>
            {logo ? <img src={logo} alt={name} /> : <span className="wordmark">{name}</span>}
          </a>
          <div className="only-head-r">
            <a href={lang === 'en' ? '/en#kontakt' : '/#kontakt'}>{t.contact}</a>
            <a href={other} hrefLang={lang === 'en' ? 'bs' : 'en'}>{lang === 'en' ? 'BS' : 'EN'}</a>
          </div>
        </header>
      )}
      <main className="only-main">
        {has ? <Selector data={sel} lang={lang} /> : <p className="empty-note">{t.noApartments}</p>}
      </main>
    </div>
  );
}
