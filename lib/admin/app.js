/* Riverina CMS — admin app (vanilla JS on top of Supabase). Mounted by app/admin/page.tsx. */
const STATUS = { available: 'Slobodno', reserved: 'Rezervisano', sold: 'Prodano', unavailable: 'Nije u prodaji' };
const TABS = [['home', 'Početak'], ['media', '1 · Slike'], ['units', '2 · Stanovi'], ['scenes', '3 · Označi stanove'], ['content', 'Tekstovi sajta'], ['leads', 'Upiti'], ['settings', 'Postavke'], ['help', 'Pomoć']];

// Home sections that can be reordered or hidden (hero always stays first). Mirrors SECTION_ORDER in lib/content.ts.
const HOME_SECTIONS = ['manifest', 'about', 'categories', 'buildings', 'details', 'gallery', 'location', 'investor', 'contact'];
const TXT_HINT = 'Novi red = novi red naslova. *riječ* = naglašena riječ u kontrastu.';
const PAGE_SCHEMA = [
  { key: 'hero', title: 'Naslovna (vrh stranice)', hint: TXT_HINT, fields: [['eyebrow', 'Nadnaslov', 'l'], ['title', 'Naslov (2 do 3 reda)', 'lt'], ['subtitle', 'Podnaslov (do ~20 riječi)', 'lt'], ['image', 'Pozadinska slika (render, min. 1920 px širine)', 'img'], ['cta', 'Dugme (vodi na pregled stanova)', 'l'], ['cta2', 'Drugi link (vodi na kontakt, opcionalno)', 'l']] },
  { key: 'manifest', title: 'Manifest (veliki tekst + kolaž)', hint: 'Jedan pasus. *riječ* se ispisuje VELIKIM slovima. Slike: 3 do 5, najbolje uspravne; opis služi kao alt tekst.', fields: [['text', 'Tekst', 'lt'], ['images', 'Slike kolaža', 'gallery']] },
  { key: 'about', title: 'O projektu', hint: TXT_HINT + ' Brojke iz tabele stanova se računaju automatski ako ne unesete svoje.', fields: [['eyebrow', 'Nadnaslov', 'l'], ['title', 'Naslov', 'lt'], ['text', 'Tekst (prazan red = novi pasus)', 'lt'], ['facts', 'Ključne brojke (ako su prazne, računaju se iz stanova)', 'list', [['value', 'Vrijednost', 'l'], ['label', 'Opis', 'l']]], ['image', 'Široka slika', 'img']] },
  { key: 'categories', title: 'Kategorije (velike slike)', hint: 'Link: apartments = pregled stanova, #detalji, #lokacija, #kontakt ili puna adresa.', fields: [['items', 'Stavke', 'list', [['title', 'Naslov (jedna riječ)', 'l'], ['image', 'Slika', 'img'], ['link', 'Link', 's'], ['link_label', 'Tekst linka', 'l']]]] },
  { key: 'buildings', title: 'Zgrade (najava pregleda)', hint: 'Kartice zgrada i broj slobodnih stanova dolaze iz „Označi stanove" i tabele stanova.', fields: [['title', 'Naslov', 'lt'], ['text', 'Tekst', 'lt']] },
  { key: 'details', title: 'Enterijer i detalji (slider)', fields: [['title', 'Naslov', 'lt'], ['note', 'Napomena ispod slidera', 'l'], ['items', 'Slajdovi', 'list', [['image', 'Slika', 'img'], ['title', 'Naziv', 'l'], ['text', 'Kratak opis', 'lt']]]] },
  { key: 'gallery', title: 'Galerija', fields: [['title', 'Naslov', 'l'], ['images', 'Slike', 'gallery']] },
  { key: 'location', title: 'Lokacija', hint: 'Google Maps: Podijeli → Ugradi kartu → zalijepite cijeli kod ili samo link.', fields: [['title', 'Naslov', 'lt'], ['text', 'Tekst', 'lt'], ['points', 'Udaljenosti / sadržaji u blizini', 'list', [['name', 'Naziv', 'l'], ['value', 'Vrijednost (npr. 5 min)', 'l']]], ['address', 'Adresa', 'l'], ['map_embed', 'Google Maps embed', 'map'], ['map_link', 'Link „Otvori u Google Maps"', 's'], ['image', 'Slika umjesto karte', 'img'], ['page_image', 'Velika slika na vrhu stranice „Lokacija"', 'img']] },
  { key: 'investor', title: 'Investitor', hint: 'Isti tekst se prikazuje na početnoj i na stranici „O investitoru".', fields: [['title', 'Naslov', 'lt'], ['text', 'Tekst', 'lt'], ['logo', 'Logo investitora', 'img'], ['link', 'Web stranica investitora', 's'], ['page_image', 'Velika slika na vrhu stranice „O investitoru"', 'img']] },
  { key: 'selector', title: 'Stranica „Stanovi"', fields: [['eyebrow', 'Nadnaslov', 'l'], ['title', 'Naslov', 'l'], ['text', 'Uvodni tekst', 'lt']] },
  { key: 'contact', title: 'Kontakt i forma', hint: TXT_HINT, fields: [['title', 'Naslov', 'lt'], ['text', 'Tekst', 'lt'], ['phone', 'Telefon', 's'], ['email', 'E-mail', 's'], ['address', 'Adresa prodajnog ureda', 'l'], ['hours', 'Radno vrijeme', 'l']] },
  { key: 'privacy', title: 'Politika privatnosti', hint: 'Stranica /privatnost. Tekst treba pregledati pravnik.', fields: [['title', 'Naslov', 'lt'], ['text', 'Tekst (prazan red = novi pasus)', 'lt']] },
  { key: 'footer', title: 'Podnožje', fields: [['text', 'Kratki tekst', 'l'], ['company', 'Naziv firme (©)', 's']] },
  { key: 'seo', title: 'Google i dijeljenje linka', fields: [['title', 'Naslov u pretrazi', 'l'], ['description', 'Opis u pretrazi (do ~155 znakova)', 'lt'], ['image', 'Slika pri dijeljenju (1200×630)', 'img']] },
];

export function mount(root, sb, cfg) {
  const url = cfg.mediaUrl;
  const S = { tab: (location.hash.slice(1) || 'home'), session: null, units: [], page: {}, settings: {}, scenes: null, media: null, leads: null, dirty: { page: false, scenes: false }, sel: {}, q: '', fb: '', fs: '', ff: '', editing: null, open: {} };
  if (!TABS.some((t) => t[0] === S.tab)) S.tab = 'home';

  // ---------- utils ----------
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, ctx) => (ctx || root).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || root).querySelectorAll(sel));
  const num = (v) => { if (v === '' || v == null) return null; const s = String(v).replace(/\s/g, ''); const n = Number(s.includes(',') && s.includes('.') ? s.replace(/\./g, '').replace(',', '.') : s.replace(',', '.')); return isNaN(n) ? null : n; };
  const natural = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true });
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const fmtSize = (n) => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB';
  function toast(msg, bad) {
    const t = document.createElement('div');
    t.className = 'cms-toast' + (bad ? ' is-bad' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('is-on'), 10);
    setTimeout(() => { t.classList.remove('is-on'); setTimeout(() => t.remove(), 300); }, bad ? 6000 : 2400);
  }
  const fail = (e) => toast((e && (e.message || e.error_description)) || String(e), true);
  const must = (r) => { if (r.error) throw r.error; return r.data; };
  function modal(title, html, buttons, wide) {
    const m = document.createElement('div');
    m.className = 'cms-modal';
    m.innerHTML = `<div class="cms-modal-box${wide ? ' is-wide' : ''}" role="dialog" aria-modal="true"><div class="cms-modal-head"><h2>${esc(title)}</h2><button type="button" class="cms-x" aria-label="Zatvori">×</button></div><div class="cms-modal-body">${html}</div><div class="cms-modal-foot"></div></div>`;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const close = () => { m.remove(); document.removeEventListener('keydown', onKey); };
    document.addEventListener('keydown', onKey);
    m.querySelector('.cms-x').onclick = close;
    m.addEventListener('mousedown', (e) => { if (e.target === m) close(); });
    const foot = m.querySelector('.cms-modal-foot');
    (buttons || []).forEach((b) => {
      const el = document.createElement('button');
      el.type = 'button'; el.className = 'cms-btn' + (b.primary ? ' is-primary' : '') + (b.danger ? ' is-danger' : '');
      el.textContent = b.label;
      el.onclick = () => b.onClick(m, close, el);
      foot.appendChild(el);
    });
    if (!buttons || !buttons.length) foot.remove();
    document.body.appendChild(m);
    const f = m.querySelector('input:not([type=file]), select, textarea'); if (f) f.focus();
    return { el: m, close };
  }
  let revalT = null;
  function revalidate() {
    clearTimeout(revalT);
    revalT = setTimeout(async () => {
      const { data } = await sb.auth.getSession();
      if (!data.session) return;
      fetch('/api/revalidate', { method: 'POST', headers: { Authorization: 'Bearer ' + data.session.access_token } }).catch(() => {});
    }, 400);
  }
  window.addEventListener('beforeunload', (e) => { if (S.dirty.page || S.dirty.scenes) { e.preventDefault(); e.returnValue = ''; } });

  // ---------- auth ----------
  async function start() {
    const { data } = await sb.auth.getSession();
    S.session = data.session;
    sb.auth.onAuthStateChange((ev, session) => {
      S.session = session;
      if (ev === 'PASSWORD_RECOVERY') return renderSetPassword();
      if (ev === 'SIGNED_OUT') renderLogin();
    });
    if (/type=recovery/.test(location.hash)) return; // handled by PASSWORD_RECOVERY event
    if (!S.session) return renderLogin();
    boot();
  }
  function renderLogin(msg) {
    root.innerHTML = `<div class="cms-login"><form class="cms-login-box"><div class="cms-brand">Riverina <span>CMS</span></div>
      <label for="cms-email">E-mail</label><input id="cms-email" type="email" autocomplete="username" required>
      <label for="cms-pass">Lozinka</label><input id="cms-pass" type="password" autocomplete="current-password" required>
      <button type="submit" class="cms-btn is-primary">Prijava</button>
      <button type="button" class="cms-link cms-forgot">Zaboravljena lozinka?</button>
      <p class="cms-login-msg">${esc(msg || '')}</p></form></div>`;
    const f = $('form');
    f.onsubmit = async (e) => {
      e.preventDefault();
      const btn = $('button[type=submit]', f); btn.disabled = true;
      const r = await sb.auth.signInWithPassword({ email: $('#cms-email').value.trim(), password: $('#cms-pass').value });
      btn.disabled = false;
      if (r.error) { $('.cms-login-msg').textContent = r.error.message === 'Invalid login credentials' ? 'Pogrešan e-mail ili lozinka.' : r.error.message; return; }
      S.session = r.data.session; boot();
    };
    $('.cms-forgot').onclick = async () => {
      const email = $('#cms-email').value.trim();
      if (!email) { $('.cms-login-msg').textContent = 'Upišite e-mail pa kliknite ponovo.'; return; }
      const r = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/admin' });
      $('.cms-login-msg').textContent = r.error ? r.error.message : 'Poslali smo link za novu lozinku na ' + email + '.';
    };
  }
  function renderSetPassword() {
    root.innerHTML = `<div class="cms-login"><form class="cms-login-box"><div class="cms-brand">Nova lozinka</div><label for="cms-np">Nova lozinka (min. 8 znakova)</label><input id="cms-np" type="password" minlength="8" autocomplete="new-password" required><button class="cms-btn is-primary" type="submit">Spremi lozinku</button><p class="cms-login-msg"></p></form></div>`;
    $('form').onsubmit = async (e) => {
      e.preventDefault();
      const r = await sb.auth.updateUser({ password: $('#cms-np').value });
      if (r.error) { $('.cms-login-msg').textContent = r.error.message; return; }
      history.replaceState(null, '', '/admin'); boot();
    };
  }
  async function boot() {
    root.innerHTML = '<p class="cms-loading">Učitavam…</p>';
    try {
      const isAdmin = must(await sb.rpc('is_admin'));
      if (!isAdmin) {
        root.innerHTML = `<div class="cms-login"><div class="cms-login-box"><div class="cms-brand">Nemate pristup</div><p>Nalog <b>${esc(S.session.user.email)}</b> nije na listi administratora. Neka vas postojeći admin doda u Postavke → Administratori.</p><button type="button" class="cms-btn">Odjava</button></div></div>`;
        $('.cms-btn').onclick = () => sb.auth.signOut();
        return;
      }
      const [units, content] = await Promise.all([
        sb.from('units').select('*').order('building').order('floor').order('code').then(must),
        sb.from('site_content').select('key,data').then(must),
      ]);
      S.units = units.map(normUnit);
      const c = Object.fromEntries(content.map((r) => [r.key, r.data]));
      S.page = mergeDefaults(cfg.defaultPage || {}, c.page || {}); S.settings = c.settings || {}; S.scenes = c.scenes || { masterplan: { views: [] }, buildings: [] };
      S.scenes.masterplan = S.scenes.masterplan || { views: [] }; S.scenes.buildings = S.scenes.buildings || [];
      render();
    } catch (e) { root.innerHTML = `<div class="cms-error">Greška pri učitavanju: ${esc(e.message)}</div>`; }
  }
  const mergeDefaults = (d, p) => { const out = clone(d); Object.keys(p).forEach((k) => { out[k] = { ...(out[k] || {}), ...p[k] }; }); return out; };
  const normUnit = (u) => ({ ...u, area: Number(u.area), area_net: Number(u.area_net), price: u.price == null ? null : Number(u.price), rooms: u.rooms || [], extra: u.extra || [] });
  async function saveContent(key, data) {
    must(await sb.from('site_content').upsert({ key, data, updated_at: new Date().toISOString() }));
    revalidate();
  }

  // ---------- shell ----------
  function render() {
    root.innerHTML = `<div class="cms-head"><a class="cms-brand" href="/admin">Riverina <span>CMS</span></a><nav class="cms-tabs">${TABS.map((t) => `<a href="#${t[0]}" data-tab="${t[0]}" class="${S.tab === t[0] ? 'is-on' : ''}">${t[1]}</a>`).join('')}</nav><div class="cms-head-r"><a href="/" target="_blank" rel="noopener" class="cms-link-light">Pogledaj sajt ↗</a><span class="cms-user">${esc(S.session.user.email)}</span><button type="button" class="cms-btn is-small cms-logout">Odjava</button></div></div><div class="cms-body"></div>`;
    $$('[data-tab]').forEach((a) => {
      a.onclick = (e) => {
        e.preventDefault();
        if ((S.dirty.page && S.tab === 'content') || (S.dirty.scenes && S.tab === 'scenes')) { if (!confirm('Imate nespremljene promjene. Napustiti stranicu bez spremanja?')) return; S.dirty.page = S.dirty.scenes = false; }
        S.tab = a.dataset.tab; S.editing = null; history.replaceState(null, '', '#' + S.tab); render();
      };
    });
    $('.cms-logout').onclick = () => sb.auth.signOut();
    const body = $('.cms-body');
    ({ home: renderHome, content: renderContent, media: renderMedia, units: renderUnits, scenes: () => (S.editing ? renderEditor(body) : renderScenes(body)), leads: renderLeads, settings: renderSettings, help: renderHelp })[S.tab](body);
  }

  // ---------- media library ----------
  async function loadMedia(force) {
    if (S.media && !force) return S.media;
    S.media = must(await sb.from('media').select('*').order('created_at', { ascending: false }).limit(2000));
    return S.media;
  }
  const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'file';
  async function imageSize(file) {
    try { const b = await createImageBitmap(file); const r = { w: b.width, h: b.height, bmp: b }; return r; } catch { return null; }
  }
  async function upload(file, opts = {}) {
    let blob = file, ext = (file.name.split('.').pop() || 'bin').toLowerCase(), w = null, h = null, mime = file.type || 'application/octet-stream';
    if (/^image\/(jpeg|png|webp)$/.test(mime)) {
      const sz = await imageSize(file);
      if (sz) {
        w = sz.w; h = sz.h;
        const MAX = opts.max || 3200;
        if (w > MAX || h > MAX || file.size > 2.5 * 1048576) {
          const k = Math.min(1, MAX / Math.max(w, h));
          const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
          c.getContext('2d').drawImage(sz.bmp, 0, 0, c.width, c.height);
          const out = await new Promise((res) => c.toBlob(res, 'image/webp', 0.88));
          if (out && out.size < file.size) { blob = out; ext = 'webp'; mime = 'image/webp'; w = c.width; h = c.height; }
        }
      }
    } else if (mime === 'image/svg+xml') { ext = 'svg'; }
    const d = new Date();
    const path = opts.path || `uploads/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${slug(file.name)}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    must(await sb.storage.from('media').upload(path, blob, { contentType: mime, cacheControl: '31536000', upsert: !!opts.upsert }));
    const row = { path, name: file.name, mime, width: w, height: h, size: blob.size };
    const saved = must(await sb.from('media').upsert(row, { onConflict: 'path' }).select().single());
    if (S.media) { S.media = S.media.filter((m) => m.path !== path); S.media.unshift(saved); }
    return saved;
  }
  async function uploadMany(files, onProgress) {
    const out = [];
    let i = 0;
    for (const f of files) {
      i++; onProgress && onProgress(i, files.length, f.name);
      try { out.push(await upload(f)); } catch (e) { fail(`${f.name}: ${e.message}`); }
    }
    return out;
  }
  function mediaGrid(items, selectable) {
    if (!items.length) return '<p class="cms-muted cms-empty">Nema fajlova. Učitajte slike dugmetom iznad ili ih prevucite ovdje.</p>';
    return '<div class="cms-mgrid">' + items.map((m) => `<button type="button" class="cms-mitem" data-path="${esc(m.path)}" title="${esc(m.name)}">${/^image\//.test(m.mime) ? `<img src="${esc(url(m.path))}" alt="" loading="lazy">` : `<span class="cms-file">${esc((m.path.split('.').pop() || '').toUpperCase())}</span>`}<span class="cms-mname">${esc(m.name)}</span><span class="cms-mmeta">${m.width ? m.width + '×' + m.height + ' · ' : ''}${m.size ? fmtSize(m.size) : ''}</span>${selectable ? '<i class="cms-tick">✓</i>' : ''}</button>`).join('') + '</div>';
  }
  function dropzone(el, onFiles) {
    el.addEventListener('dragover', (e) => { e.preventDefault(); el.classList.add('is-drag'); });
    el.addEventListener('dragleave', (e) => { if (e.target === el) el.classList.remove('is-drag'); });
    el.addEventListener('drop', (e) => { e.preventDefault(); el.classList.remove('is-drag'); const fs = Array.from(e.dataTransfer.files || []); if (fs.length) onFiles(fs); });
  }
  /** Opens the media library; resolves with the chosen media row (or array when multiple). */
  function pickMedia(opts = {}) {
    return new Promise(async (resolve) => {
      const kind = opts.type || 'image';
      const accept = kind === 'pdf' ? 'application/pdf' : 'image/*';
      const md = modal(opts.title || 'Odaberite iz medija', `<div class="cms-mtools"><label class="cms-btn is-primary">Učitaj nove…<input type="file" accept="${accept}" multiple hidden></label><input type="search" class="cms-msearch" placeholder="Traži po nazivu…"><span class="cms-mprog cms-muted"></span></div><div class="cms-mwrap"></div>`,
        [{ label: opts.multiple ? 'Dodaj odabrane' : 'Odaberi', primary: true, onClick: (m, close) => { const sel = picked.map((p) => all.find((x) => x.path === p)).filter(Boolean); if (!sel.length) { toast('Ništa nije odabrano.', true); return; } close(); resolve(opts.multiple ? sel : sel[0]); } }], true);
      let all = [], picked = [];
      const wrap = md.el.querySelector('.cms-mwrap');
      const draw = () => {
        const q = md.el.querySelector('.cms-msearch').value.toLowerCase();
        const items = all.filter((m) => (kind === 'pdf' ? m.mime === 'application/pdf' : /^image\//.test(m.mime)) && (!q || m.name.toLowerCase().includes(q)));
        wrap.innerHTML = mediaGrid(items, true);
        $$('.cms-mitem', wrap).forEach((b) => {
          b.classList.toggle('is-picked', picked.includes(b.dataset.path));
          b.onclick = () => { const p = b.dataset.path; if (opts.multiple) picked = picked.includes(p) ? picked.filter((x) => x !== p) : picked.concat(p); else picked = [p]; draw(); };
          b.ondblclick = () => { if (!opts.multiple) { md.close(); resolve(all.find((x) => x.path === b.dataset.path)); } };
        });
      };
      const doUpload = async (files) => {
        const prog = md.el.querySelector('.cms-mprog');
        const ups = await uploadMany(files, (i, n, name) => { prog.textContent = `Učitavam ${i}/${n}: ${name}`; });
        prog.textContent = ups.length ? `Učitano: ${ups.length}` : '';
        all = S.media.slice(); picked = opts.multiple ? picked.concat(ups.map((u) => u.path)) : ups.slice(-1).map((u) => u.path); draw();
      };
      md.el.querySelector('input[type=file]').onchange = (e) => doUpload(Array.from(e.target.files));
      md.el.querySelector('.cms-msearch').oninput = draw;
      dropzone(wrap, doUpload);
      wrap.innerHTML = '<p class="cms-muted">Učitavam…</p>';
      try { all = (await loadMedia()).slice(); } catch (e) { fail(e); }
      draw();
    });
  }
  function renderMedia(body) {
    body.innerHTML = `<div class="cms-toolbar"><label class="cms-btn is-primary">Učitaj slike / PDF…<input type="file" accept="image/*,application/pdf" multiple hidden></label><input type="search" class="cms-msearch" placeholder="Traži…"><span class="cms-mprog cms-muted"></span><span class="cms-spacer"></span><span class="cms-muted">Velike slike se automatski smanje na 3200 px (WebP) prije slanja.</span></div><div class="cms-mwrap cms-card"></div>`;
    const wrap = $('.cms-mwrap', body);
    const draw = () => {
      const q = $('.cms-msearch', body).value.toLowerCase();
      wrap.innerHTML = mediaGrid(S.media.filter((m) => !q || m.name.toLowerCase().includes(q)));
      $$('.cms-mitem', wrap).forEach((b) => (b.onclick = () => mediaDetail(S.media.find((m) => m.path === b.dataset.path), draw)));
    };
    const doUpload = async (files) => { const prog = $('.cms-mprog', body); await uploadMany(files, (i, n, name) => { prog.textContent = `Učitavam ${i}/${n}: ${name}`; }); prog.textContent = 'Gotovo.'; draw(); };
    $('input[type=file]', body).onchange = (e) => doUpload(Array.from(e.target.files));
    $('.cms-msearch', body).oninput = draw;
    dropzone(wrap, doUpload);
    wrap.innerHTML = '<p class="cms-muted">Učitavam…</p>';
    loadMedia().then(draw).catch(fail);
  }
  function mediaDetail(m, redraw) {
    const u = url(m.path);
    const md = modal(m.name, `${/^image\//.test(m.mime) ? `<img class="cms-mpreview" src="${esc(u)}" alt="">` : ''}<p class="cms-muted">${esc(m.mime)} · ${m.width ? m.width + '×' + m.height + ' · ' : ''}${fmtSize(m.size || 0)}</p><label class="cms-field">Javni link<input readonly value="${esc(u)}"></label>`, [
      { label: 'Kopiraj link', onClick: () => { navigator.clipboard.writeText(u).then(() => toast('Link kopiran'), () => toast('Kopiranje nije uspjelo', true)); } },
      { label: 'Obriši', danger: true, onClick: async (el, close) => {
        const used = JSON.stringify([S.page, S.settings, S.scenes]).includes(m.path) || S.units.some((x) => x.plan_path === m.path || x.pdf_path === m.path);
        if (!confirm(used ? 'Ovaj fajl se koristi na sajtu. Brisanje će ostaviti praznu sliku. Obrisati ipak?' : 'Obrisati fajl?')) return;
        try { must(await sb.storage.from('media').remove([m.path])); must(await sb.from('media').delete().eq('path', m.path)); S.media = S.media.filter((x) => x.path !== m.path); close(); redraw(); toast('Obrisano'); } catch (e) { fail(e); }
      } },
    ]);
    void md;
  }

  // ---------- content editor ----------
  const L = (v) => (v && typeof v === 'object' ? v : { bs: v || '', en: '' });
  function fieldHTML(path, f, val) {
    const [k, label, type, sub] = f;
    const p = path + '.' + k;
    if (type === 's') return `<label class="cms-field"><span>${esc(label)}</span><input data-p="${p}" value="${esc(val || '')}"></label>`;
    if (type === 'map') return `<label class="cms-field"><span>${esc(label)}</span><input data-p="${p}" data-map="1" value="${esc(val || '')}" placeholder="https://www.google.com/maps/embed?pb=…"></label>`;
    if (type === 'l' || type === 'lt') {
      const v = L(val), tag = type === 'lt' ? 'textarea' : 'input';
      const inp = (lg) => tag === 'textarea' ? `<textarea rows="4" data-p="${p}.${lg}">${esc(v[lg] || '')}</textarea>` : `<input data-p="${p}.${lg}" value="${esc(v[lg] || '')}">`;
      return `<div class="cms-field cms-bi"><span>${esc(label)}</span><div class="cms-bi-row"><label><em>BS</em>${inp('bs')}</label><label><em>EN</em>${inp('en')}</label></div></div>`;
    }
    if (type === 'img') return `<div class="cms-field"><span>${esc(label)}</span><div class="cms-imgf" data-p="${p}">${val ? `<img src="${esc(url(val))}" alt="">` : '<div class="cms-noimg">Nema slike</div>'}<div class="cms-imgf-b"><button type="button" class="cms-btn is-small" data-pick="${p}">${val ? 'Zamijeni' : 'Odaberi sliku'}</button>${val ? `<button type="button" class="cms-link" data-clear="${p}">ukloni</button>` : ''}</div></div></div>`;
    if (type === 'list') {
      const arr = Array.isArray(val) ? val : [];
      return `<div class="cms-field"><span>${esc(label)}</span><div class="cms-list">${arr.map((it, i) => `<div class="cms-li"><div class="cms-li-head"><b>${i + 1}.</b><span class="cms-spacer"></span><button type="button" class="cms-link" data-mv="${p}|${i}|-1">↑</button><button type="button" class="cms-link" data-mv="${p}|${i}|1">↓</button><button type="button" class="cms-link is-danger" data-rm="${p}|${i}">Ukloni</button></div>${sub.map((sf) => fieldHTML(p + '.' + i, sf, it[sf[0]])).join('')}</div>`).join('')}<button type="button" class="cms-btn is-small" data-add="${p}">+ Dodaj stavku</button></div></div>`;
    }
    if (type === 'gallery') {
      const arr = Array.isArray(val) ? val : [];
      return `<div class="cms-field"><span>${esc(label)}</span><div class="cms-gal">${arr.map((g, i) => `<div class="cms-gal-i"><img src="${esc(url(g.path))}" alt=""><div class="cms-gal-b"><button type="button" class="cms-link" data-mv="${p}|${i}|-1">←</button><button type="button" class="cms-link" data-mv="${p}|${i}|1">→</button><button type="button" class="cms-link is-danger" data-rm="${p}|${i}">×</button></div><input data-p="${p}.${i}.caption.bs" placeholder="Opis BS" value="${esc(L(g.caption).bs || '')}"><input data-p="${p}.${i}.caption.en" placeholder="Opis EN" value="${esc(L(g.caption).en || '')}"></div>`).join('')}<button type="button" class="cms-addimg" data-gadd="${p}">+ Dodaj slike</button></div></div>`;
    }
    return '';
  }
  const getP = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  function setP(obj, path, value) {
    const ks = path.split('.');
    let o = obj;
    ks.slice(0, -1).forEach((k, i) => { if (o[k] == null || typeof o[k] !== 'object') o[k] = /^\d+$/.test(ks[i + 1]) ? [] : {}; o = o[k]; });
    o[ks[ks.length - 1]] = value;
  }
  function sectionOrder() {
    const cur = ((S.page.sections || {}).order || []).filter((k) => HOME_SECTIONS.includes(k));
    return [...cur, ...HOME_SECTIONS.filter((k) => !cur.includes(k))];
  }
  function orderCard() {
    const hidden = new Set((S.page.sections || {}).hidden || []);
    const name = (k) => (PAGE_SCHEMA.find((x) => x.key === k) || { title: k }).title;
    return `<section class="cms-card cms-order"><h2>Početna: redoslijed sekcija</h2><p class="cms-muted">Naslovna je uvijek prva. Strelicama mijenjate redoslijed; isključena sekcija se ne prikazuje na sajtu, ali tekst ostaje sačuvan.</p><ol class="cms-order-list">${sectionOrder().map((k, i, a) => `<li class="${hidden.has(k) ? 'is-off' : ''}"><label class="cms-check"><input type="checkbox" data-sec-on="${k}"${hidden.has(k) ? '' : ' checked'}> ${esc(name(k))}</label><span class="cms-spacer"></span><button type="button" class="cms-link" data-sec-mv="${i}|-1"${i === 0 ? ' disabled' : ''} aria-label="Gore">↑</button><button type="button" class="cms-link" data-sec-mv="${i}|1"${i === a.length - 1 ? ' disabled' : ''} aria-label="Dolje">↓</button></li>`).join('')}</ol></section>`;
  }
  function renderContent(body) {
    const dirty = S.dirty.page;
    body.innerHTML = `<div class="cms-toolbar is-sticky"><p class="cms-muted">Tekstovi i slike javne stranice. Sve se unosi na bosanskom i engleskom; prazan EN koristi BS tekst.</p><span class="cms-spacer"></span><a class="cms-btn" href="/" target="_blank" rel="noopener">Pregled ↗</a><button type="button" class="cms-btn is-primary cms-save"${dirty ? '' : ' disabled'}>${dirty ? 'Spremi promjene' : 'Sve spremljeno'}</button></div>` +
      orderCard() +
      PAGE_SCHEMA.map((sec) => `<details class="cms-card cms-sec" data-sec="${sec.key}"${S.open[sec.key] ? ' open' : ''}><summary><h2>${esc(sec.title)}</h2>${sec.hint ? `<span class="cms-muted">${esc(sec.hint)}</span>` : ''}</summary><div class="cms-sec-body">${sec.fields.map((f) => fieldHTML(sec.key, f, getP(S.page, sec.key + '.' + f[0]))).join('')}</div></details>`).join('');
    const mark = () => { S.dirty.page = true; const b = $('.cms-save', body); b.disabled = false; b.textContent = 'Spremi promjene'; };
    const rerender = () => { const y = window.scrollY; renderContent(body); window.scrollTo(0, y); };
    $$('details.cms-sec', body).forEach((d) => d.addEventListener('toggle', () => { S.open[d.dataset.sec] = d.open; }));
    $$('[data-p]', body).forEach((inp) => {
      if (inp.classList.contains('cms-imgf')) return;
      inp.addEventListener('input', () => {
        let v = inp.value;
        if (inp.dataset.map) { const m = v.match(/src="([^"]+)"/); if (m) { v = m[1]; inp.value = v; } }
        setP(S.page, inp.dataset.p, v); mark();
      });
    });
    $$('[data-pick]', body).forEach((b) => (b.onclick = () => pickMedia({ title: 'Odaberite sliku' }).then((m) => { setP(S.page, b.dataset.pick, m.path); mark(); rerender(); })));
    $$('[data-clear]', body).forEach((b) => (b.onclick = () => { setP(S.page, b.dataset.clear, ''); mark(); rerender(); }));
    $$('[data-add]', body).forEach((b) => (b.onclick = () => { const arr = getP(S.page, b.dataset.add) || []; arr.push({}); setP(S.page, b.dataset.add, arr); mark(); rerender(); }));
    $$('[data-gadd]', body).forEach((b) => (b.onclick = () => pickMedia({ title: 'Slike za galeriju', multiple: true }).then((ms) => { const arr = getP(S.page, b.dataset.gadd) || []; ms.forEach((m) => arr.push({ path: m.path, caption: { bs: '', en: '' } })); setP(S.page, b.dataset.gadd, arr); mark(); rerender(); })));
    $$('[data-rm]', body).forEach((b) => (b.onclick = () => { const [p, i] = b.dataset.rm.split('|'); const arr = getP(S.page, p); arr.splice(Number(i), 1); mark(); rerender(); }));
    $$('[data-mv]', body).forEach((b) => (b.onclick = () => { const [p, i, d] = b.dataset.mv.split('|'); const arr = getP(S.page, p), a = Number(i), c = a + Number(d); if (c < 0 || c >= arr.length) return; [arr[a], arr[c]] = [arr[c], arr[a]]; mark(); rerender(); }));
    $$('[data-sec-mv]', body).forEach((b) => (b.onclick = () => { const [i, d] = b.dataset.secMv.split('|').map(Number), o = sectionOrder(), c = i + d; if (c < 0 || c >= o.length) return; [o[i], o[c]] = [o[c], o[i]]; S.page.sections = { ...(S.page.sections || {}), order: o }; mark(); rerender(); }));
    $$('[data-sec-on]', body).forEach((cb) => (cb.onchange = () => { const h = new Set((S.page.sections || {}).hidden || []); if (cb.checked) h.delete(cb.dataset.secOn); else h.add(cb.dataset.secOn); S.page.sections = { ...(S.page.sections || {}), hidden: [...h] }; mark(); rerender(); }));
    $('.cms-save', body).onclick = async (e) => {
      e.target.disabled = true;
      try { await saveContent('page', S.page); S.dirty.page = false; e.target.textContent = 'Sve spremljeno'; toast('Spremljeno. Promjena je na sajtu za nekoliko sekundi.'); } catch (err) { e.target.disabled = false; fail(err); }
    };
  }

  // ---------- units ----------
  const buildings = () => (S.scenes && S.scenes.buildings) || [];
  const bName = (id) => { const b = buildings().find((x) => x.id === id); return b ? b.name : id; };
  function filteredUnits() {
    const q = S.q.trim().toLowerCase();
    return S.units.filter((u) => (!S.fb || u.building === S.fb) && (!S.fs || u.status === S.fs) && (S.ff === '' || String(u.floor) === S.ff) && (!q || (u.code + ' ' + u.orientation + ' ' + u.type_label).toLowerCase().includes(q)))
      .sort((a, b) => natural(a.building, b.building) || a.floor - b.floor || natural(a.code, b.code));
  }
  function renderUnits(body) {
    const bIds = new Set(S.units.map((u) => u.building).concat(buildings().map((b) => b.id)));
    const floors = [...new Set(S.units.filter((u) => !S.fb || u.building === S.fb).map((u) => u.floor))].sort((a, b) => a - b);
    const list = filteredUnits();
    const counts = { available: 0, reserved: 0, sold: 0, unavailable: 0 };
    list.forEach((u) => counts[u.status]++);
    const selN = Object.keys(S.sel).length;
    const opt = (v, l, cur) => `<option value="${esc(v)}"${cur === String(v) ? ' selected' : ''}>${esc(l)}</option>`;
    body.innerHTML = `<div class="cms-toolbar"><input type="search" class="cms-q" placeholder="Traži broj stana…" value="${esc(S.q)}">
      <select class="cms-fb">${opt('', 'Sve zgrade', S.fb)}${[...bIds].sort(natural).map((id) => opt(id, bName(id), S.fb)).join('')}</select>
      <select class="cms-ff">${opt('', 'Svi spratovi', S.ff)}${floors.map((f) => opt(f, f + '. sprat', S.ff)).join('')}</select>
      <select class="cms-fs">${opt('', 'Svi statusi', S.fs)}${Object.keys(STATUS).map((k) => opt(k, STATUS[k], S.fs)).join('')}</select>
      <span class="cms-spacer"></span><button type="button" class="cms-btn cms-import">Uvoz CSV</button><button type="button" class="cms-btn cms-export">Izvoz CSV</button><button type="button" class="cms-btn is-primary cms-add">+ Novi stan</button></div>
      <div class="cms-stats">${Object.keys(STATUS).map((k) => `<span class="cms-pill s-${k}">${STATUS[k]}: <b>${counts[k]}</b></span>`).join('')}<span class="cms-muted">Ukupno: ${list.length}</span></div>
      ${selN ? `<div class="cms-bulk">Odabrano: <b>${selN}</b> — status: ${Object.keys(STATUS).map((k) => `<button type="button" class="cms-btn is-small" data-bulk="${k}">${STATUS[k]}</button>`).join(' ')} <button type="button" class="cms-btn is-small is-danger" data-bulk="delete">Obriši</button> <button type="button" class="cms-link" data-bulk="clear">poništi odabir</button></div>` : ''}
      <div class="cms-card cms-tablewrap"><table class="cms-table"><thead><tr><th><input type="checkbox" class="cms-all" aria-label="Odaberi sve"></th><th>Zgrada</th><th>Broj</th><th>Sprat</th><th>Sobe</th><th>Prodajna m²</th><th>Korisna m²</th><th>Orijentacija</th><th>Status</th><th>Cijena</th><th>Tlocrt</th><th></th></tr></thead><tbody>
      ${list.length ? list.map((u) => `<tr data-id="${u.id}" class="${u.hidden ? 'is-hidden' : ''}"><td><input type="checkbox" class="cms-chk"${S.sel[u.id] ? ' checked' : ''} aria-label="Odaberi ${esc(u.code)}"></td><td>${esc(bName(u.building))}</td><td><button type="button" class="cms-link cms-code cms-edit">${esc(u.code)}</button>${u.hidden ? ' <span class="cms-muted">(skriven)</span>' : ''}</td><td>${u.floor}</td><td>${u.bedrooms}</td><td class="num">${u.area.toFixed(2)}</td><td class="num">${u.area_net.toFixed(2)}</td><td>${esc(u.orientation)}</td><td><select class="cms-status s-${u.status}">${Object.keys(STATUS).map((k) => `<option value="${k}"${u.status === k ? ' selected' : ''}>${STATUS[k]}</option>`).join('')}</select></td><td class="num">${u.price == null ? '<span class="cms-muted">—</span>' : Number(u.price).toLocaleString('de-DE')}</td><td>${u.plan_path ? `<img class="cms-thumb" src="${esc(url(u.plan_path))}" alt="">` : '<span class="cms-muted">—</span>'}</td><td><button type="button" class="cms-btn is-small cms-edit">Uredi</button></td></tr>`).join('') : '<tr><td colspan="12" class="cms-empty">Nema stanova. Dodajte prvi stan, uvezite CSV ili učitajte demo podatke (Uputstvo).</td></tr>'}
      </tbody></table></div>`;
    const re = () => renderUnits(body);
    $('.cms-q', body).oninput = (e) => { S.q = e.target.value; clearTimeout(S._qt); S._qt = setTimeout(() => { re(); const q = $('.cms-q', body); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }, 250); };
    $('.cms-fb', body).onchange = (e) => { S.fb = e.target.value; S.ff = ''; re(); };
    $('.cms-ff', body).onchange = (e) => { S.ff = e.target.value; re(); };
    $('.cms-fs', body).onchange = (e) => { S.fs = e.target.value; re(); };
    $('.cms-add', body).onclick = () => unitForm(null);
    $('.cms-import', body).onclick = importDialog;
    $('.cms-export', body).onclick = () => download('riverina-stanovi-' + new Date().toISOString().slice(0, 10) + '.csv', exportCSV());
    $('.cms-all', body).onchange = (e) => { list.forEach((u) => { if (e.target.checked) S.sel[u.id] = true; else delete S.sel[u.id]; }); re(); };
    $$('.cms-chk', body).forEach((c) => (c.onchange = () => { const id = c.closest('tr').dataset.id; if (c.checked) S.sel[id] = true; else delete S.sel[id]; re(); }));
    $$('[data-bulk]', body).forEach((b) => (b.onclick = async () => {
      const act = b.dataset.bulk, ids = Object.keys(S.sel).map(Number);
      if (act === 'clear') { S.sel = {}; return re(); }
      if (act === 'delete' && !confirm(`Obrisati ${ids.length} stanova? Ovo se ne može poništiti.`)) return;
      try {
        if (act === 'delete') { must(await sb.from('units').delete().in('id', ids)); S.units = S.units.filter((u) => !ids.includes(u.id)); }
        else { must(await sb.from('units').update({ status: act, updated_at: new Date().toISOString() }).in('id', ids)); S.units.forEach((u) => { if (ids.includes(u.id)) u.status = act; }); }
        S.sel = {}; revalidate(); toast('Spremljeno'); re();
      } catch (e) { fail(e); }
    }));
    $$('.cms-status', body).forEach((sel) => (sel.onchange = async () => {
      const id = Number(sel.closest('tr').dataset.id);
      sel.className = 'cms-status s-' + sel.value;
      try { must(await sb.from('units').update({ status: sel.value, updated_at: new Date().toISOString() }).eq('id', id)); S.units.find((u) => u.id === id).status = sel.value; revalidate(); toast('Status spremljen'); } catch (e) { fail(e); }
    }));
    $$('.cms-edit', body).forEach((b) => (b.onclick = () => { const id = Number(b.closest('tr').dataset.id); unitForm(S.units.find((u) => u.id === id)); }));
  }
  function download(name, text) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }
  function unitPayload(u) {
    return {
      building: String(u.building || '').toLowerCase().replace(/[^a-z0-9_-]/g, ''), code: String(u.code || '').trim(), floor: Number(u.floor) || 0, bedrooms: Math.max(0, Number(u.bedrooms) || 0),
      area: num(u.area) || 0, area_net: num(u.area_net) || 0, orientation: u.orientation || '', status: STATUS[u.status] ? u.status : 'available', price: num(u.price),
      type_label: u.type_label || '', plan_path: u.plan_path || '', pdf_path: u.pdf_path || '', rooms: u.rooms || [], extra: u.extra || [], description: u.description || '', hidden: !!u.hidden, updated_at: new Date().toISOString(),
    };
  }
  function unitForm(u) {
    const isNew = !u;
    u = u ? clone(u) : { building: S.fb || (buildings()[0] && buildings()[0].id) || '', code: '', floor: S.ff !== '' ? Number(S.ff) : 1, bedrooms: 2, area: '', area_net: '', orientation: '', status: 'available', price: null, type_label: '', rooms: [], extra: [], description: '', hidden: false, plan_path: '', pdf_path: '' };
    let bOpts = buildings().map((b) => `<option value="${esc(b.id)}"${u.building === b.id ? ' selected' : ''}>${esc(b.name)} (${esc(b.id)})</option>`).join('');
    if (u.building && !buildings().some((b) => b.id === u.building)) bOpts += `<option value="${esc(u.building)}" selected>${esc(u.building)}</option>`;
    const html = `<div class="cms-grid">
      <label class="cms-field"><span>Zgrada</span><select name="building">${bOpts || '<option value="">— prvo dodajte zgradu u „Zgrade i scene" —</option>'}</select></label>
      <label class="cms-field"><span>Broj stana</span><input name="code" value="${esc(u.code)}" placeholder="npr. A408"></label>
      <label class="cms-field"><span>Sprat</span><input name="floor" type="number" value="${esc(u.floor)}"></label>
      <label class="cms-field"><span>Spavaće sobe</span><input name="bedrooms" type="number" min="0" value="${esc(u.bedrooms)}"></label>
      <label class="cms-field"><span>Prodajna površina (m²)</span><input name="area" inputmode="decimal" value="${esc(u.area)}"></label>
      <label class="cms-field"><span>Korisna površina (m²)</span><input name="area_net" inputmode="decimal" value="${esc(u.area_net)}"></label>
      <label class="cms-field"><span>Orijentacija</span><input name="orientation" value="${esc(u.orientation)}" placeholder="npr. Jug / Zapad"></label>
      <label class="cms-field"><span>Status</span><select name="status">${Object.keys(STATUS).map((k) => `<option value="${k}"${u.status === k ? ' selected' : ''}>${STATUS[k]}</option>`).join('')}</select></label>
      <label class="cms-field"><span>Cijena (prazno = na upit)</span><input name="price" inputmode="decimal" value="${esc(u.price == null ? '' : u.price)}"></label>
      <label class="cms-field"><span>Tip / oznaka (opcionalno)</span><input name="type_label" value="${esc(u.type_label)}" placeholder="npr. Tip B2"></label></div>
      <div class="cms-grid cms-grid-2"><div class="cms-field" data-kind="plan"><span>Tlocrt stana</span><div class="cms-mbox"></div><div><button type="button" class="cms-btn is-small cms-pick">Odaberi sliku</button> <button type="button" class="cms-link cms-clear">ukloni</button></div></div>
      <div class="cms-field" data-kind="pdf"><span>PDF za preuzimanje</span><div class="cms-mbox"></div><div><button type="button" class="cms-btn is-small cms-pick">Odaberi PDF</button> <button type="button" class="cms-link cms-clear">ukloni</button></div></div></div>
      <div class="cms-label">Prostorije <span class="cms-muted">(redoslijed = brojevi na tlocrtu)</span></div><div class="cms-rooms"></div>
      <p><button type="button" class="cms-btn is-small cms-addroom">+ Prostorija</button> <button type="button" class="cms-link cms-pasterooms">zalijepi listu iz Excela</button> <span class="cms-roomsum cms-muted"></span></p>
      <div class="cms-label">Dodatna polja <span class="cms-muted">(npr. Parking, Pogled — prikazuju se kao kartice)</span></div><div class="cms-extra"></div>
      <p><button type="button" class="cms-btn is-small cms-addextra">+ Polje</button></p>
      <label class="cms-field"><span>Opis (opcionalno)</span><textarea name="description" rows="3">${esc(u.description)}</textarea></label>
      <label class="cms-check"><input type="checkbox" name="hidden"${u.hidden ? ' checked' : ''}> Sakrij stan na web stranici</label>`;
    const buttons = [{ label: isNew ? 'Dodaj stan' : 'Spremi', primary: true, onClick: async (m, close, btn) => {
      const g = (n) => { const el = m.querySelector(`[name="${n}"]`); return el ? (el.type === 'checkbox' ? el.checked : el.value) : ''; };
      const p = unitPayload({ ...u, building: g('building'), code: g('code'), floor: g('floor'), bedrooms: g('bedrooms'), area: g('area'), area_net: g('area_net'), orientation: g('orientation'), status: g('status'), price: g('price'), type_label: g('type_label'), description: g('description'), hidden: g('hidden'), rooms: readRooms(m), extra: readExtra(m) });
      if (!p.building || !p.code) { toast('Zgrada i broj stana su obavezni.', true); return; }
      btn.disabled = true;
      try {
        const r = u.id ? await sb.from('units').update(p).eq('id', u.id).select().single() : await sb.from('units').insert(p).select().single();
        if (r.error && r.error.code === '23505') throw new Error(`Stan ${p.code} već postoji u zgradi ${p.building}.`);
        const saved = normUnit(must(r));
        const i = S.units.findIndex((x) => x.id === saved.id);
        if (i >= 0) S.units[i] = saved; else S.units.push(saved);
        close(); revalidate(); toast('Stan ' + saved.code + ' spremljen'); render();
      } catch (e) { btn.disabled = false; fail(e); }
    } }];
    if (!isNew) buttons.push({ label: 'Dupliciraj', onClick: (m, close) => { const c = clone(u); delete c.id; c.code += '-kopija'; close(); unitForm(Object.assign(c, { id: 0 })); } });
    if (!isNew && u.id) buttons.push({ label: 'Obriši', danger: true, onClick: async (m, close) => {
      if (!confirm('Obrisati stan ' + u.code + '?')) return;
      try { must(await sb.from('units').delete().eq('id', u.id)); S.units = S.units.filter((x) => x.id !== u.id); close(); revalidate(); render(); } catch (e) { fail(e); }
    } });
    const m = modal(isNew || !u.id ? 'Novi stan' : 'Stan ' + u.code, html, buttons, true).el;
    const box = (kind) => {
      const wrap = m.querySelector(`[data-kind="${kind}"] .cms-mbox`), v = u[kind + '_path'];
      wrap.innerHTML = v ? (kind === 'plan' ? `<img src="${esc(url(v))}" alt="">` : `<a href="${esc(url(v))}" target="_blank" rel="noopener">${esc(v.split('/').pop())}</a>`) : '<span class="cms-muted">nije odabrano</span>';
    };
    ['plan', 'pdf'].forEach((kind) => {
      box(kind);
      const el = m.querySelector(`[data-kind="${kind}"]`);
      el.querySelector('.cms-pick').onclick = () => pickMedia({ title: kind === 'plan' ? 'Tlocrt stana' : 'PDF', type: kind === 'plan' ? 'image' : 'pdf' }).then((x) => { u[kind + '_path'] = x.path; box(kind); });
      el.querySelector('.cms-clear').onclick = () => { u[kind + '_path'] = ''; box(kind); };
    });
    const roomsEl = m.querySelector('.cms-rooms'), extraEl = m.querySelector('.cms-extra');
    const sum = () => { const t = readRooms(m).reduce((a, r) => a + (Number(r.a) || 0), 0); m.querySelector('.cms-roomsum').textContent = t ? 'Zbir: ' + t.toFixed(2) + ' m²' : ''; };
    const renumber = () => $$('.cms-rn', roomsEl).forEach((s, i) => (s.textContent = String(i + 1).padStart(2, '0')));
    const addRoom = (r) => {
      const row = document.createElement('div'); row.className = 'cms-row';
      row.innerHTML = `<span class="cms-rn"></span><input class="r-n" placeholder="Naziv (npr. Dnevni boravak)" value="${esc(r.n || '')}"><input class="r-en" placeholder="EN naziv (opcionalno)" value="${esc(r.n_en || '')}"><input class="r-a" inputmode="decimal" placeholder="m²" value="${esc(r.a == null ? '' : r.a)}"><button type="button" class="cms-link r-up" title="Gore">↑</button><button type="button" class="cms-link r-del" title="Ukloni">×</button>`;
      row.querySelector('.r-del').onclick = () => { row.remove(); renumber(); sum(); };
      row.querySelector('.r-up').onclick = () => { if (row.previousElementSibling) row.parentNode.insertBefore(row, row.previousElementSibling); renumber(); };
      row.querySelector('.r-a').oninput = sum;
      roomsEl.appendChild(row); renumber();
    };
    (u.rooms || []).forEach(addRoom); sum();
    m.querySelector('.cms-addroom').onclick = () => addRoom({});
    m.querySelector('.cms-pasterooms').onclick = () => {
      const t = prompt('Zalijepite prostorije, svaku u novom redu: Naziv; površina\n(npr. dvije kolone kopirane iz Excela)');
      if (!t) return;
      t.split(/\n|\|/).forEach((line) => { const mm = line.trim().match(/^(?:\d+\s*[.)]?\s+)?(.+?)[\t;:,]\s*([\d.,]+)\s*(m2|m²)?$/i); if (mm) addRoom({ n: mm[1].trim(), a: mm[2].replace(',', '.') }); });
      sum();
    };
    const addExtra = (x) => {
      const row = document.createElement('div'); row.className = 'cms-row cms-row-x';
      row.innerHTML = `<input class="x-l" placeholder="Naziv (npr. Parking)" value="${esc(x.label || '')}"><input class="x-v" placeholder="Vrijednost" value="${esc(x.value || '')}"><input class="x-le" placeholder="EN naziv" value="${esc(x.label_en || '')}"><input class="x-ve" placeholder="EN vrijednost" value="${esc(x.value_en || '')}"><button type="button" class="cms-link x-del">×</button>`;
      row.querySelector('.x-del').onclick = () => row.remove();
      extraEl.appendChild(row);
    };
    (u.extra || []).forEach(addExtra);
    m.querySelector('.cms-addextra').onclick = () => addExtra({});
  }
  const readRooms = (m) => $$('.cms-rooms .cms-row', m).map((r) => ({ n: $('.r-n', r).value.trim(), n_en: $('.r-en', r).value.trim() || undefined, a: num($('.r-a', r).value) || 0 })).filter((r) => r.n);
  const readExtra = (m) => $$('.cms-extra .cms-row', m).map((r) => ({ label: $('.x-l', r).value.trim(), value: $('.x-v', r).value.trim(), label_en: $('.x-le', r).value.trim(), value_en: $('.x-ve', r).value.trim() })).filter((x) => x.label);

  // ---------- CSV ----------
  const COLS = ['building', 'code', 'floor', 'bedrooms', 'area', 'area_net', 'orientation', 'status', 'price', 'type_label', 'plan', 'pdf', 'rooms', 'description', 'hidden'];
  const csvCell = (v) => { const s = String(v == null ? '' : v); return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const dec = (n) => (n == null || n === '' ? '' : Number(n).toFixed(2).replace('.', ','));
  function exportCSV() {
    const rows = [COLS.join(';')];
    S.units.slice().sort((a, b) => natural(a.building, b.building) || a.floor - b.floor || natural(a.code, b.code)).forEach((u) => rows.push([u.building, u.code, u.floor, u.bedrooms, dec(u.area), dec(u.area_net), u.orientation, u.status, u.price == null ? '' : dec(u.price), u.type_label, u.plan_path, u.pdf_path, (u.rooms || []).map((r) => r.n + ':' + r.a).join('|'), u.description, u.hidden ? 1 : 0].map(csvCell).join(';')));
    return rows.join('\r\n');
  }
  function parseCSV(text, delim) {
    const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; continue; }
      if (ch === '"') q = true;
      else if (ch === delim) { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
      else cell += ch;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((c) => c.trim() !== ''));
  }
  const STATUS_ALIAS = { slobodno: 'available', slobodan: 'available', dostupno: 'available', free: 'available', rezervisano: 'reserved', rezervirano: 'reserved', prodano: 'sold', prodan: 'sold', prodato: 'sold', 'nije u prodaji': 'unavailable' };
  const HEAD_ALIAS = { zgrada: 'building', broj: 'code', 'broj stana': 'code', stan: 'code', sprat: 'floor', 'etaža': 'floor', etaza: 'floor', 'spavaće sobe': 'bedrooms', 'spavace sobe': 'bedrooms', sobe: 'bedrooms', 'prodajna površina': 'area', 'prodajna povrsina': 'area', 'površina': 'area', povrsina: 'area', 'korisna površina': 'area_net', 'korisna povrsina': 'area_net', orijentacija: 'orientation', cijena: 'price', tip: 'type_label', tlocrt: 'plan', prostorije: 'rooms', opis: 'description', skriven: 'hidden' };
  const stripUrl = (v) => { v = String(v || '').trim(); const k = '/storage/v1/object/public/media/'; const i = v.indexOf(k); return i >= 0 ? decodeURIComponent(v.slice(i + k.length)) : v; };
  function csvToUnits(text) {
    text = text.replace(/^﻿/, '');
    const first = text.split(/\r?\n/)[0];
    let delim = (first.match(/;/g) || []).length >= (first.match(/,/g) || []).length ? ';' : ',';
    if ((first.match(/\t/g) || []).length > (first.match(new RegExp(delim, 'g')) || []).length) delim = '\t';
    const rows = parseCSV(text, delim);
    if (rows.length < 2) throw new Error('CSV je prazan ili nema zaglavlje.');
    const head = rows[0].map((h) => HEAD_ALIAS[h.trim().toLowerCase()] || h.trim().toLowerCase());
    if (!head.includes('building') || !head.includes('code')) throw new Error('CSV mora imati kolone "building" i "code" (ili "zgrada" i "broj stana").');
    const byKey = Object.fromEntries(S.units.map((u) => [u.building + '/' + u.code, u]));
    const out = [], errors = [];
    rows.slice(1).forEach((cells, i) => {
      const r = {}; head.forEach((h, k) => (r[h] = (cells[k] || '').trim()));
      const b = r.building.toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if (!b || !r.code) { errors.push(`Red ${i + 2}: nedostaje zgrada ili broj stana`); return; }
      const base = byKey[b + '/' + r.code] || {};
      const u = { ...base, building: b, code: r.code };
      ['floor', 'bedrooms', 'area', 'area_net', 'orientation', 'type_label', 'description'].forEach((k) => { if (r[k]) u[k] = r[k]; });
      if ('price' in r) u.price = r.price === '' ? null : r.price;
      if (r.status) u.status = STATUS_ALIAS[r.status.toLowerCase()] || r.status.toLowerCase();
      if (r.plan) u.plan_path = stripUrl(r.plan);
      if (r.pdf) u.pdf_path = stripUrl(r.pdf);
      if (r.rooms) u.rooms = r.rooms.split('|').map((p) => { const bits = p.split(':'); const a = bits.length > 1 ? bits.pop() : ''; return { n: bits.join(':').trim(), a: num(a) || 0 }; }).filter((x) => x.n);
      if (r.hidden) u.hidden = ['1', 'da', 'yes', 'true'].includes(r.hidden.toLowerCase());
      out.push({ payload: unitPayload(u), isNew: !base.id });
    });
    return { out, errors };
  }
  function importDialog() {
    const md = modal('Uvoz stanova iz CSV-a', `<p>Kolone (redoslijed nije bitan, odvajanje <code>;</code> ili <code>,</code>): <code>${COLS.join('; ')}</code></p>
      <p class="cms-muted">Obavezno: <b>building</b> (ID zgrade, npr. r1) i <b>code</b>. Status: available / reserved / sold / unavailable ili slobodno / rezervisano / prodano. Prostorije: <code>Spavaća soba:12,4|Kupatilo:4,2</code>. Postojeći stanovi (ista zgrada + broj) se ažuriraju; prazne ćelije ne brišu postojeće vrijednosti. Najlakše: „Izvoz CSV", uredite u Excelu, pa uvezite.</p>
      <p><input type="file" accept=".csv,text/csv,.txt" class="cms-file-in"></p><textarea class="cms-csv" rows="10" placeholder="…ili zalijepite CSV ovdje"></textarea><div class="cms-result"></div>`, [
      { label: 'Provjeri', onClick: (m) => go(m, true) },
      { label: 'Uvezi', primary: true, onClick: (m, c, b) => go(m, false, b) },
    ], true);
    async function go(m, dry, btn) {
      const res = m.querySelector('.cms-result');
      try {
        const { out, errors } = csvToUnits(m.querySelector('.cms-csv').value);
        const nNew = out.filter((x) => x.isNew).length;
        if (!dry && out.length) {
          btn.disabled = true;
          for (let i = 0; i < out.length; i += 200) must(await sb.from('units').upsert(out.slice(i, i + 200).map((x) => x.payload), { onConflict: 'building,code' }));
          S.units = must(await sb.from('units').select('*').order('building').order('floor').order('code')).map(normUnit);
          revalidate(); btn.disabled = false;
        }
        res.innerHTML = `<div class="cms-note ${errors.length ? 'is-warn' : 'is-ok'}">${dry ? 'Provjera' : 'Uvezeno'}: <b>${nNew}</b> novih, <b>${out.length - nNew}</b> ažuriranih.${errors.length ? '<br>' + errors.map(esc).join('<br>') : ''}</div>`;
        if (!dry) render();
      } catch (e) { if (btn) btn.disabled = false; res.innerHTML = `<div class="cms-note is-warn">${esc(e.message)}</div>`; }
    }
    md.el.querySelector('.cms-file-in').onchange = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => (md.el.querySelector('.cms-csv').value = r.result); r.readAsText(f, 'utf-8'); };
  }

  // ---------- scenes ----------
  const getS = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), S.scenes);
  function setDirtyScenes(v) { S.dirty.scenes = v; const b = $('.cms-savescenes'); if (b) { b.disabled = !v; b.textContent = v ? 'Spremi promjene' : 'Sve spremljeno'; } }
  async function saveScenes() {
    const btn = $('.cms-savescenes'); if (btn) btn.disabled = true;
    try { await saveContent('scenes', S.scenes); setDirtyScenes(false); toast('Spremljeno. Promjena je na sajtu za nekoliko sekundi.'); }
    catch (e) { if (btn) btn.disabled = false; fail(e); }
  }
  function viewItem(v, path, isFloor) {
    const n = (v.shapes || []).reduce((a, s) => a + (s.polys || []).length, 0);
    return `<div class="cms-view" data-path="${path}"><div class="cms-view-img">${v.image ? `<img src="${esc(url(v.image))}" alt="">` : '<span>Bez slike</span>'}</div><div class="cms-view-f">
      ${isFloor ? `<label>Sprat br.<input type="number" data-k="level" value="${esc(v.level)}"></label>` : ''}
      <label>Naziv<input data-k="label" value="${esc(v.label)}" placeholder="${isFloor ? 'npr. 4. sprat' : 'npr. Pogled s juga'}"></label>
      <label>Naziv EN<input data-k="label_en" value="${esc(v.label_en)}"></label>
      <div class="cms-view-btns"><button type="button" class="cms-btn is-primary is-small" data-act="edit"${v.image ? '' : ' disabled'}>Označi stanove (${n})</button><button type="button" class="cms-btn is-small" data-act="image">${v.image ? 'Zamijeni sliku' : 'Odaberi sliku'}</button>
      <button type="button" class="cms-link" data-act="up" title="Pomjeri lijevo">←</button><button type="button" class="cms-link" data-act="down" title="Pomjeri desno">→</button><button type="button" class="cms-link is-danger" data-act="del">Obriši</button></div></div></div>`;
  }
  function renderScenes(body) {
    const sc = S.scenes;
    let html = `<div class="cms-toolbar is-sticky"><p class="cms-muted">Svaka slika zgrade je jedan „ugao“. Kliknite <b>Označi stanove</b> na slici pa nacrtajte oblik preko svakog stana. Redoslijed slika je redoslijed rotacije; za 360° dodajte 8–36 rendera.</p><span class="cms-spacer"></span><button type="button" class="cms-btn is-primary cms-savescenes"${S.dirty.scenes ? '' : ' disabled'}>${S.dirty.scenes ? 'Spremi promjene' : 'Sve spremljeno'}</button></div>`;
    html += `<section class="cms-card"><div class="cms-card-head"><h2>Masterplan</h2><span class="cms-muted">Pogled na cijelo naselje: na njemu označite zgrade.</span></div><div class="cms-views">${sc.masterplan.views.map((v, i) => viewItem(v, 'masterplan.views.' + i)).join('')}<button type="button" class="cms-addview" data-add="masterplan.views">+ Dodaj ugao masterplana</button></div></section>`;
    sc.buildings.forEach((b, bi) => {
      const count = S.units.filter((u) => u.building === b.id).length;
      html += `<section class="cms-card"><div class="cms-card-head"><h2>${esc(b.name || b.id)}</h2><span class="cms-muted">${count} stanova</span><span class="cms-spacer"></span><button type="button" class="cms-link is-danger" data-delb="${bi}">Obriši zgradu</button></div>
        <div class="cms-grid" data-path="buildings.${bi}">
        <label class="cms-field"><span>ID (kratki, bez razmaka)</span><input data-k="id" value="${esc(b.id)}" placeholder="r1"></label>
        <label class="cms-field"><span>Naziv</span><input data-k="name" value="${esc(b.name)}" placeholder="Riverina 1"></label>
        <label class="cms-field"><span>Oznaka na masterplanu</span><input data-k="short" value="${esc(b.short || '')}" placeholder="R1"></label>
        <label class="cms-field"><span>Podnaslov</span><input data-k="subtitle" value="${esc(b.subtitle || '')}" placeholder="Faza I"></label>
        <label class="cms-field"><span>Podnaslov EN</span><input data-k="subtitle_en" value="${esc(b.subtitle_en || '')}"></label>
        <label class="cms-field"><span>Status</span><select data-k="status"><option value="active"${b.status !== 'soon' ? ' selected' : ''}>U prodaji (klikabilno)</option><option value="soon"${b.status === 'soon' ? ' selected' : ''}>Uskoro u prodaji</option></select></label></div>
        <h3>Slike zgrade (uglovi)</h3><div class="cms-views">${(b.views || []).map((v, i) => viewItem(v, `buildings.${bi}.views.${i}`)).join('')}<button type="button" class="cms-addview" data-add="buildings.${bi}.views">+ Dodaj uglove (može više slika odjednom)</button></div>
        <h3>Tlocrti spratova <span class="cms-muted">(opcionalno: prikaz sprata i „Položaj na spratu")</span></h3><div class="cms-views">${(b.floors || []).map((v, i) => viewItem(v, `buildings.${bi}.floors.${i}`, true)).join('')}<button type="button" class="cms-addview" data-add="buildings.${bi}.floors">+ Dodaj tlocrt sprata</button></div></section>`;
    });
    html += '<p><button type="button" class="cms-btn is-primary cms-addb">+ Dodaj zgradu</button></p>';
    body.innerHTML = html;
    const re = () => renderScenes(body);
    $('.cms-savescenes', body).onclick = saveScenes;
    $$('[data-path] input[data-k], [data-path] select[data-k]', body).forEach((inp) => inp.addEventListener('input', () => {
      const holder = getS(inp.closest('[data-path]').dataset.path), k = inp.dataset.k, old = holder.id;
      holder[k] = inp.type === 'number' ? Number(inp.value) : inp.value;
      if (k === 'id' && holder.views) {
        const nid = inp.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''); holder.id = nid;
        S.scenes.masterplan.views.forEach((v) => (v.shapes || []).forEach((s) => { if (s.target === old) s.target = nid; }));
      }
      setDirtyScenes(true);
    }));
    $$('[data-add]', body).forEach((btn) => (btn.onclick = () => {
      const path = btn.dataset.add, isFloor = /floors$/.test(path);
      const arr = getS(path) || [];
      pickMedia({ title: 'Odaberite render / tlocrt', multiple: true }).then((ms) => {
        ms.forEach((m) => {
          const v = { id: 'v' + Math.random().toString(36).slice(2, 8), label: '', label_en: '', image: m.path, w: m.width || 1600, h: m.height || 1000, shapes: [] };
          if (isFloor) { const lv = arr.length ? Math.max(...arr.map((f) => f.level || 0)) + 1 : 1; v.level = lv; v.label = lv + '. sprat'; v.label_en = 'Floor ' + lv; }
          arr.push(v);
        });
        const parts = path.split('.'); const key = parts.pop(); getS(parts.join('.') || '')[key] = arr;
        setDirtyScenes(true); re();
      });
    }));
    $$('.cms-view', body).forEach((el) => {
      const path = el.dataset.path, parts = path.split('.'), idx = Number(parts.pop()), arr = getS(parts.join('.')), v = arr[idx];
      el.querySelector('[data-act="edit"]').onclick = () => { S.editing = { path }; render(); };
      el.querySelector('[data-act="image"]').onclick = () => pickMedia({ title: 'Zamijeni sliku' }).then((m) => {
        if ((v.shapes || []).length && m.width && Math.abs(m.width / m.height - v.w / v.h) > 0.01 && !confirm('Nova slika ima drugačiji omjer stranica, pa se postojeće oznake neće poklapati. Nastaviti?')) return;
        v.image = m.path; v.w = m.width || v.w; v.h = m.height || v.h; setDirtyScenes(true); re();
      });
      el.querySelector('[data-act="up"]').onclick = () => { if (idx > 0) { arr.splice(idx - 1, 0, arr.splice(idx, 1)[0]); setDirtyScenes(true); re(); } };
      el.querySelector('[data-act="down"]').onclick = () => { if (idx < arr.length - 1) { arr.splice(idx + 1, 0, arr.splice(idx, 1)[0]); setDirtyScenes(true); re(); } };
      el.querySelector('[data-act="del"]').onclick = () => { if (confirm('Obrisati ovaj prikaz i sve njegove oznake?')) { arr.splice(idx, 1); setDirtyScenes(true); re(); } };
    });
    $$('[data-delb]', body).forEach((btn) => (btn.onclick = () => { const bi = Number(btn.dataset.delb); if (confirm(`Obrisati zgradu „${sc.buildings[bi].name}" sa svim scenama? Stanovi u tabeli ostaju.`)) { sc.buildings.splice(bi, 1); setDirtyScenes(true); re(); } }));
    $('.cms-addb', body).onclick = () => {
      let n = sc.buildings.length + 1, id = 'r' + n;
      while (sc.buildings.some((b) => b.id === id)) id = 'r' + ++n;
      sc.buildings.push({ id, name: 'Riverina ' + n, short: '', subtitle: '', subtitle_en: '', status: 'soon', default_view: 0, views: [], floors: [] });
      setDirtyScenes(true); re();
    };
  }

  // ---------- polygon editor ----------
  function renderEditor(body) {
    const path = S.editing.path, v = getS(path);
    if (!v) { S.editing = null; return render(); }
    const isMaster = path.startsWith('masterplan'), isFloor = /floors/.test(path);
    const key = isMaster ? 'target' : 'unit';
    const b = isMaster ? null : S.scenes.buildings[Number(path.split('.')[1])];
    const E = { cur: null, draw: null, sel: null, zoom: S.edZoom || 1, onlyFloor: isFloor, hover: null, flat: [] };
    (v.shapes || []).forEach((s) => (s.polys || []).forEach((p) => E.flat.push({ ref: s[key], pts: p.map((q) => q.slice()) })));
    const writeBack = () => {
      const g = {}, order = [];
      E.flat.forEach((f) => { if (!g[f.ref]) { g[f.ref] = []; order.push(f.ref); } g[f.ref].push(f.pts.map((p) => [Math.round(p[0] * 1e5) / 1e5, Math.round(p[1] * 1e5) / 1e5])); });
      const keep = Object.fromEntries((v.shapes || []).map((s) => [s[key], s]));
      v.shapes = order.map((r) => { const o = { [key]: r, polys: g[r] }; if (keep[r] && keep[r].label_pos) o.label_pos = keep[r].label_pos; return o; });
      setDirtyScenes(true);
    };
    // Undo history: a snapshot of all shapes before every change (Ctrl+Z / Poništi).
    const hist = [];
    const updUndo = () => { const b2 = $('.cms-ed-undo', body); if (b2) b2.disabled = !hist.length && !(E.draw && E.draw.pts.length); };
    const snap = () => { hist.push(JSON.stringify(E.flat)); if (hist.length > 80) hist.shift(); updUndo(); };
    const undo = () => {
      if (E.draw && E.draw.pts.length) { E.draw.pts.pop(); draw(); return; }
      const last = hist.pop();
      if (last == null) { toast('Nema više koraka za poništavanje.'); return; }
      E.flat = JSON.parse(last); E.sel = null; writeBack(); draw(); renderList();
    };
    const targets = () => isMaster
      ? S.scenes.buildings.map((x) => ({ ref: x.id, label: x.name, sub: x.status === 'soon' ? 'uskoro' : 'u prodaji', floor: 0 }))
      : S.units.filter((u) => u.building === b.id && (!E.onlyFloor || u.floor === Number(v.level))).sort((a, c) => c.floor - a.floor || natural(a.code, c.code)).map((u) => ({ ref: u.code, label: u.code, sub: u.floor + '. sprat · ' + STATUS[u.status], floor: u.floor, status: u.status }));
    const title = isMaster ? 'Masterplan' : b.name + ' — ' + (isFloor ? v.label || v.level + '. sprat' : v.label || 'ugao');
    const floorsOf = isMaster ? [] : [...new Set(S.units.filter((u) => u.building === b.id).map((u) => u.floor))].sort((a, c) => a - c);
    const floorOpts = floorsOf.map((f) => `<option value="${f}">${f}. sprat</option>`).join('');
    body.innerHTML = `<div class="cms-ed"><div class="cms-toolbar is-sticky"><button type="button" class="cms-btn cms-ed-back">← Nazad</button><strong class="cms-ed-title">${esc(title)}</strong><span class="cms-spacer"></span>
      <span class="cms-ed-zoom"><button type="button" class="cms-btn is-small" data-z="-">−</button><span class="cms-ed-zv">100%</span><button type="button" class="cms-btn is-small" data-z="+">+</button><button type="button" class="cms-btn is-small" data-z="fit">Prilagodi</button></span>
      <button type="button" class="cms-btn is-small cms-ed-undo" disabled title="Ctrl+Z">↶ Poništi</button>
      <button type="button" class="cms-btn is-primary cms-savescenes"${S.dirty.scenes ? '' : ' disabled'}>${S.dirty.scenes ? 'Spremi promjene' : 'Sve spremljeno'}</button></div>
      <div class="cms-ed-main"><div class="cms-ed-wrap"><div class="cms-ed-stage"><div class="cms-ed-banner" hidden></div><img src="${esc(url(v.image))}" alt="" draggable="false"><svg viewBox="0 0 ${v.w} ${v.h}" preserveAspectRatio="none"></svg></div></div>
      <aside class="cms-ed-side"><div class="cms-ed-help"><ol><li>Na listi ispod kliknite ${isMaster ? 'zgradu' : 'stan'} (označen je žutom).</li><li>Na slici kliknite tačke po rubu tog ${isMaster ? 'objekta' : 'stana'}, kao da ga obrubljujete.</li><li>Zatvorite oblik klikom na prvu tačku (ili <kbd>Enter</kbd>). Editor sam prelazi na sljedeći ${isMaster ? 'objekat' : 'stan'}.</li><li>Kad završite, kliknite <b>Spremi promjene</b> gore desno.</li></ol><details><summary>Ispravke i prečice</summary>Pogrešna tačka: <kbd>Backspace</kbd>. Poništi zadnju promjenu: <kbd>Ctrl</kbd>+<kbd>Z</kbd> ili dugme „Poništi“. Prekid crtanja: <kbd>Esc</kbd>. Ispravka gotovog oblika: kliknite ga pa povucite tačku ili cijeli oblik; dvoklik na ivicu dodaje tačku, desni klik na tačku je briše, <kbd>Delete</kbd> briše oblik. Zum: <kbd>Ctrl</kbd>+točkić. Spremanje: <kbd>Ctrl</kbd>+<kbd>S</kbd>.</details></div>
      <div class="cms-ed-cur"></div><input type="search" class="cms-ed-q" placeholder="Traži…">
      ${isFloor ? '<label class="cms-check"><input type="checkbox" class="cms-ed-only" checked> Samo stanovi sa ovog sprata</label>' : ''}
      <label class="cms-check"><input type="checkbox" class="cms-ed-auto"${S.edAuto === false ? '' : ' checked'}> Automatski pređi na sljedeći</label>
      <div class="cms-ed-list"></div>
      ${isMaster ? '' : `<details class="cms-ed-qa"${targets().length ? '' : ' open'}><summary>+ Dodaj stanove ovdje</summary><p class="cms-muted">Upišite brojeve stanova odvojene zarezom ili novim redom. Kvadraturu i ostalo možete kasnije dopuniti u „2 · Stanovi“.</p><label class="cms-field"><span>Sprat</span><input type="number" class="cms-qa-floor" value="${isFloor ? Number(v.level) || 0 : 1}"></label><label class="cms-field"><span>Brojevi stanova</span><textarea class="cms-qa-codes" rows="3" placeholder="A101, A102, A103"></textarea></label><button type="button" class="cms-btn is-small cms-qa-add">Dodaj stanove</button></details>`}
      ${!isMaster && !isFloor && floorOpts ? `<div class="cms-ed-copy"><div class="cms-label">Kopiraj sprat (ubrzava unos)</div><p class="cms-muted">Označite jedan sprat pa kopirajte oblike na ostale. Stanovi se uparuju po redoslijedu brojeva, a pomak se računa iz visine oblika. Poslije samo fino podesite.</p><label>Sa sprata <select class="cms-ed-src">${floorOpts}</select></label><label>Na sprat <select class="cms-ed-dst"><option value="all">Svi ostali</option>${floorOpts}</select></label><button type="button" class="cms-btn is-small cms-ed-docopy">Kopiraj</button></div>` : ''}
      </aside></div></div>`;
    const svg = $('.cms-ed-stage svg', body), stage = $('.cms-ed-stage', body), wrap = $('.cms-ed-wrap', body), listEl = $('.cms-ed-list', body);
    const NS = 'http://www.w3.org/2000/svg', W = v.w, H = v.h;
    const mk = (tag, at) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); return e; };
    const statusOf = Object.fromEntries(isMaster ? [] : S.units.filter((u) => u.building === b.id).map((u) => [u.code, u.status]));
    const scale = () => stage.getBoundingClientRect().width / W;
    const setZoom = (z) => { E.zoom = Math.max(0.3, Math.min(6, z)); S.edZoom = E.zoom; stage.style.width = Math.round((wrap.clientWidth - 2) * E.zoom) + 'px'; $('.cms-ed-zv', body).textContent = Math.round(E.zoom * 100) + '%'; draw(); };
    const pt = (e) => { const r = stage.getBoundingClientRect(); return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))]; };
    const P = (p) => (p[0] * W).toFixed(1) + ',' + (p[1] * H).toFixed(1);
    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const sc = scale() || 1, hr = 6 / sc, sw = 1.6 / sc;
      E.flat.forEach((f, i) => {
        const st = isMaster ? 'master' : statusOf[f.ref] || 'missing';
        const g = mk('g', { class: `cms-shape s-${st}${E.sel === i ? ' is-sel' : ''}${E.cur === f.ref ? ' is-cur' : ''}`, 'data-i': i });
        g.appendChild(mk('polygon', { points: f.pts.map(P).join(' '), 'stroke-width': sw }));
        const cx = f.pts.reduce((a, p) => a + p[0], 0) / f.pts.length, cy = f.pts.reduce((a, p) => a + p[1], 0) / f.pts.length;
        const t = mk('text', { x: cx * W, y: cy * H, 'font-size': 13 / sc, 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
        t.textContent = f.ref; g.appendChild(t); svg.appendChild(g);
      });
      if (E.sel != null && E.flat[E.sel]) E.flat[E.sel].pts.forEach((p, j) => svg.appendChild(mk('circle', { class: 'cms-ed-h', cx: p[0] * W, cy: p[1] * H, r: hr, 'stroke-width': sw, 'data-h': j })));
      if (E.draw) {
        const pts = E.draw.pts.concat(E.hover ? [E.hover] : []);
        svg.appendChild(mk('polyline', { class: 'cms-ed-draw', points: pts.map(P).join(' '), 'stroke-width': sw * 1.4 }));
        E.draw.pts.forEach((p, j) => svg.appendChild(mk('circle', { class: 'cms-ed-dp' + (j === 0 ? ' is-first' + (E.near ? ' is-near' : '') : ''), cx: p[0] * W, cy: p[1] * H, r: j === 0 ? hr * 1.4 : hr * 0.8, 'stroke-width': sw })));
      }
      renderCur(); updUndo();
    }
    function renderCur() {
      const c = $('.cms-ed-cur', body);
      if (!E.cur) { c.innerHTML = '<span class="cms-muted">Odaberite stavku s liste.</span>'; return; }
      const n = E.flat.filter((f) => f.ref === E.cur).length;
      const bn = $('.cms-ed-banner', body); if (bn) { bn.hidden = !E.draw; bn.textContent = E.draw ? `Crtate: ${E.cur}. Kliknite tačke po rubu, zatvorite klikom na prvu tačku.` : ''; }
      c.innerHTML = `<div class="cms-ed-curname">${esc(E.cur)}</div><div class="cms-muted">${E.draw ? 'Crtanje u toku — tačaka: ' + E.draw.pts.length : n + ' oblik(a) na ovoj slici'}</div><div class="cms-ed-curbtns"><button type="button" class="cms-btn is-primary is-small cms-ed-new">${E.draw ? 'Završi (Enter)' : n ? '+ Dodaj još jedan oblik' : 'Nacrtaj oblik'}</button>${E.draw ? '<button type="button" class="cms-btn is-small cms-ed-cancel">Prekini</button>' : ''}${E.sel != null ? '<button type="button" class="cms-btn is-small is-danger cms-ed-delshape">Obriši oblik</button>' : ''}</div>`;
      $('.cms-ed-new', c).onclick = () => (E.draw ? finish() : startDraw());
      if ($('.cms-ed-cancel', c)) $('.cms-ed-cancel', c).onclick = () => { E.draw = null; draw(); };
      if ($('.cms-ed-delshape', c)) $('.cms-ed-delshape', c).onclick = delSel;
    }
    function renderList() {
      const q = ($('.cms-ed-q', body).value || '').toLowerCase();
      const has = {}; E.flat.forEach((f) => (has[f.ref] = (has[f.ref] || 0) + 1));
      const all = targets(), ts = all.filter((t) => !q || (t.label + ' ' + t.sub).toLowerCase().includes(q));
      let last = null, html = `<div class="cms-ed-progress">Označeno: <b>${all.filter((t) => has[t.ref]).length}</b> / ${all.length}</div>`;
      ts.forEach((t) => {
        if (!isMaster && t.floor !== last) { html += `<div class="cms-ed-fl">${t.floor}. sprat</div>`; last = t.floor; }
        html += `<button type="button" class="cms-ed-t${E.cur === t.ref ? ' is-cur' : ''}${has[t.ref] ? ' has' : ''}" data-ref="${esc(t.ref)}"><i class="s-${t.status || 'master'}"></i><b>${esc(t.label)}</b><span>${esc(t.sub)}</span><em>${has[t.ref] ? '✓' + (has[t.ref] > 1 ? ' ×' + has[t.ref] : '') : ''}</em></button>`;
      });
      if (!all.length) html += `<p class="cms-muted">${isMaster ? 'Dodajte zgrade u „Zgrade i scene".' : 'Nema stanova za ovu zgradu. Dodajte ih u tabu „Stanovi".'}</p>`;
      listEl.innerHTML = html;
      $$('.cms-ed-t', listEl).forEach((btn) => (btn.onclick = () => {
        const ref = btn.dataset.ref;
        if (E.draw && E.draw.pts.length && !confirm('Prekinuti trenutno crtanje?')) return;
        E.draw = null; E.cur = ref;
        const idx = E.flat.findIndex((f) => f.ref === ref);
        E.sel = idx >= 0 ? idx : null;
        if (idx < 0) startDraw(); else { draw(); renderList(); scrollToShape(idx); }
      }));
    }
    function scrollToShape(i) {
      const f = E.flat[i]; if (!f) return;
      const r = stage.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
      const cx = (f.pts.reduce((a, p) => a + p[0], 0) / f.pts.length) * r.width, cy = (f.pts.reduce((a, p) => a + p[1], 0) / f.pts.length) * r.height;
      wrap.scrollTo({ left: cx - wr.width / 2, top: cy - wr.height / 2, behavior: 'smooth' });
    }
    function startDraw() { if (!E.cur) { toast(`Prvo odaberite ${isMaster ? 'zgradu' : 'stan'} na listi.`, true); return; } E.draw = { pts: [] }; E.sel = null; draw(); renderList(); }
    function finish() {
      if (!E.draw) return;
      if (E.draw.pts.length >= 3) { snap(); E.flat.push({ ref: E.cur, pts: E.draw.pts }); E.sel = E.flat.length - 1; writeBack(); }
      E.draw = null; E.hover = null; draw(); renderList();
      if (E.sel != null && S.edAuto !== false) {
        const has = new Set(E.flat.map((f) => f.ref)), ts = targets(), i = ts.findIndex((t) => t.ref === E.cur);
        const next = ts.slice(i + 1).find((t) => !has.has(t.ref));
        if (next) { E.cur = next.ref; E.sel = null; E.draw = { pts: [] }; draw(); renderList(); }
      }
    }
    function delSel() { if (E.sel == null) return; snap(); E.flat.splice(E.sel, 1); E.sel = null; writeBack(); draw(); renderList(); }
    let drag = null;
    svg.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const p = pt(e);
      if (E.draw) {
        const first = E.draw.pts[0];
        if (first && E.draw.pts.length >= 3) { const r = stage.getBoundingClientRect(); if (Math.hypot((first[0] - p[0]) * r.width, (first[1] - p[1]) * r.height) < 12) { finish(); return; } }
        E.draw.pts.push(p); draw(); return;
      }
      const h = e.target.getAttribute && e.target.getAttribute('data-h');
      if (h != null) { drag = { type: 'v', j: Number(h) }; svg.setPointerCapture(e.pointerId); return; }
      const g = e.target.closest && e.target.closest('.cms-shape');
      if (g) {
        const i = Number(g.getAttribute('data-i'));
        if (E.sel === i) { drag = { type: 's', start: p, orig: E.flat[i].pts.map((q) => q.slice()) }; svg.setPointerCapture(e.pointerId); }
        E.sel = i; E.cur = E.flat[i].ref; draw(); renderList(); return;
      }
      if (!E.cur) { toast(`Prvo kliknite ${isMaster ? 'zgradu' : 'stan'} na listi desno, pa onda crtajte po slici.`, true); return; }
      if (!E.flat.some((f) => f.ref === E.cur)) { E.draw = { pts: [p] }; E.sel = null; draw(); renderList(); return; }
      E.sel = null; draw();
    });
    svg.addEventListener('pointermove', (e) => {
      const p = pt(e);
      if (E.draw) {
        E.hover = p;
        const first = E.draw.pts[0], r = stage.getBoundingClientRect();
        E.near = !!(first && E.draw.pts.length >= 3 && Math.hypot((first[0] - p[0]) * r.width, (first[1] - p[1]) * r.height) < 12);
        draw(); return;
      }
      if (!drag || E.sel == null) return;
      const f = E.flat[E.sel];
      if (!drag.moved) { snap(); if (drag.type === 's') drag.orig = f.pts.map((q) => q.slice()); }
      if (drag.type === 'v') f.pts[drag.j] = p;
      if (drag.type === 's') { const dx = p[0] - drag.start[0], dy = p[1] - drag.start[1]; f.pts = drag.orig.map((q) => [q[0] + dx, q[1] + dy]); }
      drag.moved = true; draw();
    });
    svg.addEventListener('pointerup', () => { if (drag && drag.moved) writeBack(); drag = null; });
    svg.addEventListener('dblclick', (e) => {
      if (E.draw) { E.draw.pts.pop(); finish(); return; }
      if (E.sel == null) return;
      const p = pt(e), f = E.flat[E.sel]; let best = -1, bd = Infinity;
      for (let j = 0; j < f.pts.length; j++) {
        const a = f.pts[j], c = f.pts[(j + 1) % f.pts.length];
        const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * (c[0] - a[0]) + (p[1] - a[1]) * (c[1] - a[1])) / ((c[0] - a[0]) ** 2 + (c[1] - a[1]) ** 2 || 1)));
        const d = Math.hypot(p[0] - (a[0] + t * (c[0] - a[0])), p[1] - (a[1] + t * (c[1] - a[1])));
        if (d < bd) { bd = d; best = j; }
      }
      snap(); f.pts.splice(best + 1, 0, p); writeBack(); draw();
    });
    svg.addEventListener('contextmenu', (e) => {
      const h = e.target.getAttribute && e.target.getAttribute('data-h');
      if (h == null || E.sel == null) return;
      e.preventDefault();
      const f = E.flat[E.sel];
      if (f.pts.length <= 3) { toast('Oblik mora imati najmanje 3 tačke.', true); return; }
      snap(); f.pts.splice(Number(h), 1); writeBack(); draw();
    });
    wrap.addEventListener('wheel', (e) => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); setZoom(E.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15)); }, { passive: false });
    const onKey = (e) => {
      if (!document.body.contains(svg)) { document.removeEventListener('keydown', onKey); return; }
      if ((e.key === 's' || e.key === 'S') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); saveScenes(); return; }
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey) && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if (e.key === 'Enter' && E.draw) { e.preventDefault(); finish(); }
      else if (e.key === 'Escape') { if (E.draw) E.draw = null; else E.sel = null; draw(); renderList(); }
      else if (e.key === 'Backspace' && E.draw) { e.preventDefault(); E.draw.pts.pop(); draw(); }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && E.sel != null) { e.preventDefault(); delSel(); }
    };
    document.addEventListener('keydown', onKey);
    $('.cms-ed-back', body).onclick = () => { S.editing = null; render(); };
    $('.cms-savescenes', body).onclick = saveScenes;
    $('.cms-ed-undo', body).onclick = undo;
    $$('[data-z]', body).forEach((b2) => (b2.onclick = () => { const z = b2.dataset.z; setZoom(z === 'fit' ? 1 : E.zoom * (z === '+' ? 1.25 : 0.8)); }));
    $('.cms-ed-q', body).oninput = renderList;
    if ($('.cms-qa-add', body)) $('.cms-qa-add', body).onclick = async (e) => {
      const codes = $('.cms-qa-codes', body).value.split(/[\n,;]+/).map((x) => x.trim()).filter(Boolean), fl = Number($('.cms-qa-floor', body).value) || 0;
      if (!codes.length) { toast('Upišite barem jedan broj stana.', true); return; }
      const old = new Set(S.units.filter((u) => u.building === b.id).map((u) => u.code)), rows = codes.filter((c) => !old.has(c)).map((c) => unitPayload({ building: b.id, code: c, floor: fl, status: 'available' }));
      if (!rows.length) { toast('Ti stanovi već postoje.', true); return; }
      e.target.disabled = true;
      try {
        must(await sb.from('units').upsert(rows, { onConflict: 'building,code' }));
        S.units = must(await sb.from('units').select('*').order('building').order('floor').order('code')).map(normUnit);
        revalidate(); $('.cms-qa-codes', body).value = ''; renderList(); toast(`Dodano stanova: ${rows.length}`);
      } catch (err) { fail(err); } finally { e.target.disabled = false; }
    };
    $('.cms-ed-auto', body).onchange = (e) => { S.edAuto = e.target.checked; };
    if ($('.cms-ed-only', body)) $('.cms-ed-only', body).onchange = (e) => { E.onlyFloor = e.target.checked; renderList(); };
    if ($('.cms-ed-docopy', body)) $('.cms-ed-docopy', body).onclick = () => {
      const src = Number($('.cms-ed-src', body).value), dstV = $('.cms-ed-dst', body).value;
      const unitsOn = (f) => S.units.filter((u) => u.building === b.id && u.floor === f).sort((a, c) => natural(a.code, c.code));
      const srcU = unitsOn(src), srcCodes = new Set(srcU.map((u) => u.code));
      const srcShapes = E.flat.filter((f) => srcCodes.has(f.ref));
      if (!srcShapes.length) { toast(`Sprat ${src} nema označenih stanova na ovoj slici.`, true); return; }
      const hgt = srcShapes.reduce((a, f) => { const ys = f.pts.map((p) => p[1]); return a + (Math.max(...ys) - Math.min(...ys)); }, 0) / srcShapes.length;
      const dsts = dstV === 'all' ? floorsOf.filter((f) => f !== src) : [Number(dstV)];
      let made = 0;
      snap();
      dsts.forEach((dst) => {
        const dstU = unitsOn(dst), dy = -(dst - src) * hgt * 0.98;
        srcU.forEach((su, i) => {
          const du = dstU[i]; if (!du) return;
          const mine = E.flat.filter((f) => f.ref === su.code); if (!mine.length) return;
          E.flat = E.flat.filter((f) => f.ref !== du.code);
          mine.forEach((f) => { E.flat.push({ ref: du.code, pts: f.pts.map((p) => [p[0], p[1] + dy]) }); made++; });
        });
      });
      writeBack(); draw(); renderList(); toast(`Kopirano oblika: ${made}. Provjerite i po potrebi pomjerite.`);
    };
    const img = $('.cms-ed-stage img', body);
    let inited = false;
    const init = () => {
      if (inited) return; inited = true;
      setZoom(E.zoom); renderList();
      if (!E.cur && !E.flat.length) { const has = new Set(E.flat.map((f) => f.ref)), first = targets().find((t) => !has.has(t.ref)); if (first) { E.cur = first.ref; E.draw = { pts: [] }; draw(); renderList(); } }
    };
    img.onerror = () => { toast('Slika se ne učitava. Provjerite da je u „1 · Slike“ i da je link ispravan.', true); init(); };
    if (img.complete) init(); else img.onload = init;
    const onR = () => { if (!document.body.contains(svg)) return window.removeEventListener('resize', onR); setZoom(E.zoom); };
    window.addEventListener('resize', onR);
  }

  // ---------- leads ----------
  async function renderLeads(body) {
    body.innerHTML = '<p class="cms-muted">Učitavam…</p>';
    try { S.leads = must(await sb.from('leads').select('*').order('created_at', { ascending: false }).limit(1000)); } catch (e) { fail(e); return; }
    const states = { new: 'Novo', contacted: 'Kontaktiran', closed: 'Zatvoreno' };
    const fmt = (d) => new Date(d).toLocaleString('bs-BA', { dateStyle: 'short', timeStyle: 'short' });
    body.innerHTML = `<div class="cms-toolbar"><span class="cms-muted">${S.leads.length} upita · novih: ${S.leads.filter((l) => l.state === 'new').length}</span><span class="cms-spacer"></span><button type="button" class="cms-btn cms-lexport">Izvoz CSV</button></div>
      <div class="cms-card cms-tablewrap"><table class="cms-table"><thead><tr><th>Datum</th><th>Stan</th><th>Ime</th><th>Kontakt</th><th>Poruka</th><th>Status</th><th></th></tr></thead><tbody>
      ${S.leads.length ? S.leads.map((l) => `<tr data-id="${l.id}" class="${l.state === 'new' ? 'is-new' : ''}"><td>${esc(fmt(l.created_at))}</td><td>${l.unit ? `<b>${esc(l.unit)}</b><br><span class="cms-muted">${esc(bName(l.building))}</span>` : '<span class="cms-muted">Kontakt forma</span>'}</td><td>${esc(l.name)}</td><td>${l.email ? `<a href="mailto:${esc(l.email)}">${esc(l.email)}</a><br>` : ''}${l.phone ? `<a href="tel:${esc(l.phone)}">${esc(l.phone)}</a>` : ''}</td><td class="cms-msg">${esc(l.message)}</td><td><select class="cms-lstate">${Object.keys(states).map((k) => `<option value="${k}"${l.state === k ? ' selected' : ''}>${states[k]}</option>`).join('')}</select></td><td><button type="button" class="cms-link is-danger cms-ldel">Obriši</button></td></tr>`).join('') : '<tr><td colspan="7" class="cms-empty">Još nema upita.</td></tr>'}
      </tbody></table></div>`;
    $$('.cms-lstate', body).forEach((s) => (s.onchange = async () => { try { must(await sb.from('leads').update({ state: s.value }).eq('id', s.closest('tr').dataset.id)); s.closest('tr').classList.toggle('is-new', s.value === 'new'); toast('Spremljeno'); } catch (e) { fail(e); } }));
    $$('.cms-ldel', body).forEach((b) => (b.onclick = async () => { if (!confirm('Obrisati upit?')) return; try { must(await sb.from('leads').delete().eq('id', b.closest('tr').dataset.id)); renderLeads(body); } catch (e) { fail(e); } }));
    $('.cms-lexport', body).onclick = () => download('riverina-upiti.csv', ['datum;zgrada;stan;ime;email;telefon;poruka;status'].concat(S.leads.map((l) => [fmt(l.created_at), l.building, l.unit, l.name, l.email, l.phone, l.message, states[l.state]].map(csvCell).join(';'))).join('\r\n'));
  }

  // ---------- settings ----------
  async function renderSettings(body) {
    const s = S.settings, c = s.colors || {};
    const colorNames = { ink: ['Glavna tamna', '#14213a'], paper: ['Pozadina selektora', '#f6f1e7'], gold: ['Akcent', '#b8955a'], available: ['Slobodno', '#3e8e63'], reserved: ['Rezervisano', '#c99434'], sold: ['Prodano', '#b4473a'], unavailable: ['Nije u prodaji', '#8a8f98'] };
    body.innerHTML = `<form class="cms-card cms-settings"><h2>Opće</h2><div class="cms-grid">
      <label class="cms-field"><span>Naziv projekta</span><input name="project_name" value="${esc(s.project_name || 'Riverina Residence')}"></label>
      <label class="cms-field"><span>Telefon prodaje (dugme „Pozovite prodaju")</span><input name="phone" value="${esc(s.phone || '')}" placeholder="+387 …"></label>
      <label class="cms-field"><span>Valuta</span><input name="currency" value="${esc(s.currency || 'KM')}"></label></div>
      <div class="cms-field"><span>Logo za tamnu pozadinu (svijetli; SVG ili PNG)</span><div class="cms-imgf cms-logo">${s.logo ? `<img src="${esc(url(s.logo))}" alt="">` : '<div class="cms-noimg">Zadani Riverina logo</div>'}<div class="cms-imgf-b"><button type="button" class="cms-btn is-small" data-logo="logo">Odaberi</button>${s.logo ? '<button type="button" class="cms-link" data-logo-clear="logo">ukloni</button>' : ''}</div></div></div>
      <div class="cms-field"><span>Logo za svijetlu pozadinu (tamni; SVG ili PNG)</span><div class="cms-imgf cms-logo">${s.logo_dark ? `<img src="${esc(url(s.logo_dark))}" alt="">` : '<div class="cms-noimg">Zadani Riverina logo</div>'}<div class="cms-imgf-b"><button type="button" class="cms-btn is-small" data-logo="logo_dark">Odaberi</button>${s.logo_dark ? '<button type="button" class="cms-link" data-logo-clear="logo_dark">ukloni</button>' : ''}</div></div></div>
      <div class="cms-label">Društvene mreže (prikazuju se u meniju)</div><div class="cms-grid">${['instagram', 'facebook', 'linkedin'].map((k) => `<label class="cms-field"><span>${k[0].toUpperCase() + k.slice(1)}</span><input name="so_${k}" value="${esc((s.socials || {})[k] || '')}" placeholder="https://"></label>`).join('')}</div>
      <h2>Pregled stanova</h2>
      <label class="cms-check"><input type="checkbox" name="show_price"${s.show_price ? ' checked' : ''}> Prikaži cijene (prodani stanovi nikad ne prikazuju cijenu)</label>
      <label class="cms-check"><input type="checkbox" name="enquiry"${s.enquiry !== false ? ' checked' : ''}> Forma za upit u detaljima stana</label>
      <label class="cms-check"><input type="checkbox" name="list"${s.list !== false ? ' checked' : ''}> Tabela stanova s filterima ispod zgrade</label>
      <div class="cms-label">Boje</div><div class="cms-colors">${Object.keys(colorNames).map((k) => `<label><input type="color" name="c_${k}" value="${esc(c[k] || colorNames[k][1])}"> ${colorNames[k][0]}</label>`).join('')}</div>
      <p><button type="submit" class="cms-btn is-primary">Spremi postavke</button></p></form>
      <section class="cms-card"><h2>Administratori</h2><p class="cms-muted">Pristup CMS-u imaju e-mail adrese s ove liste. Novom adminu prvo napravite nalog u Supabase → Authentication → Users → Add user (Auto Confirm), pa ovdje dodajte isti e-mail.</p><div class="cms-admins">Učitavam…</div>
      <form class="cms-addadmin"><input type="email" placeholder="email@primjer.com" required><button class="cms-btn is-small" type="submit">Dodaj admina</button></form>
      <h3>Promjena lozinke</h3><form class="cms-pass"><input type="password" minlength="8" placeholder="Nova lozinka (min. 8)" autocomplete="new-password" required><button class="cms-btn is-small" type="submit">Promijeni</button></form></section>`;
    const f = $('form.cms-settings', body);
    const redo = () => renderSettings(body);
    $$('[data-logo]', body).forEach((b) => (b.onclick = () => pickMedia({ title: 'Logo' }).then((m) => { S.settings[b.dataset.logo] = m.path; redo(); toast('Kliknite „Spremi postavke"'); })));
    $$('[data-logo-clear]', body).forEach((b) => (b.onclick = () => { S.settings[b.dataset.logoClear] = ''; redo(); }));
    f.onsubmit = async (e) => {
      e.preventDefault();
      const out = { ...S.settings, colors: {}, socials: {} };
      Array.from(f.elements).forEach((el) => { if (!el.name) return; if (el.name.startsWith('c_')) out.colors[el.name.slice(2)] = el.value; else if (el.name.startsWith('so_')) { if (el.value.trim()) out.socials[el.name.slice(3)] = el.value.trim(); } else out[el.name] = el.type === 'checkbox' ? el.checked : el.value; });
      try { await saveContent('settings', out); S.settings = out; toast('Postavke spremljene'); } catch (err) { fail(err); }
    };
    const loadAdmins = async () => {
      try {
        const rows = must(await sb.from('admin_emails').select('*').order('created_at'));
        $('.cms-admins', body).innerHTML = rows.map((r) => `<div class="cms-admin"><span>${esc(r.email)}</span>${r.email === S.session.user.email ? '<em class="cms-muted">vi</em>' : `<button type="button" class="cms-link is-danger" data-del="${esc(r.email)}">ukloni</button>`}</div>`).join('');
        $$('[data-del]', body).forEach((b) => (b.onclick = async () => { if (!confirm('Ukloniti pristup za ' + b.dataset.del + '?')) return; try { must(await sb.from('admin_emails').delete().eq('email', b.dataset.del)); loadAdmins(); } catch (e) { fail(e); } }));
      } catch (e) { fail(e); }
    };
    loadAdmins();
    $('.cms-addadmin', body).onsubmit = async (e) => { e.preventDefault(); const inp = $('input', e.target); try { must(await sb.from('admin_emails').insert({ email: inp.value.trim().toLowerCase() })); inp.value = ''; loadAdmins(); toast('Admin dodan'); } catch (err) { fail(err); } };
    $('.cms-pass', body).onsubmit = async (e) => { e.preventDefault(); const inp = $('input', e.target); const r = await sb.auth.updateUser({ password: inp.value }); if (r.error) fail(r.error); else { inp.value = ''; toast('Lozinka promijenjena'); } };
  }

  // ---------- help + demo ----------
  function renderHome(body) {
    const sc = S.scenes, units = S.units;
    const marked = new Set();
    sc.buildings.forEach((b) => (b.views || []).concat(b.floors || []).forEach((v) => (v.shapes || []).forEach((sh) => marked.add(b.id + '|' + sh.unit))));
    const total = units.length, done = units.filter((u) => marked.has(u.building + '|' + u.code)).length;
    const views = sc.masterplan.views.length + sc.buildings.reduce((a, b) => a + (b.views || []).length, 0);
    const step = (n, tab, title, text, status, ok) => `<a class="cms-step${ok ? ' is-ok' : ''}" href="#${tab}" data-tab="${tab}"><span class="cms-step-n">${n}</span><span class="cms-step-b"><b>${title}</b><span>${text}</span><em>${status}</em></span></a>`;
    body.innerHTML = `<section class="cms-card cms-home"><h2>Kako ovo radi</h2>
      <p>Na sajtu posjetilac vidi sliku zgrade. Kad pređe mišem preko stana, stan se oboji (zeleno = slobodan), a klikom vidi tlocrt i podatke. Da bi to radilo, trebaju vam <b>tri stvari</b>: slike, podaci o stanovima i oblici nacrtani preko stanova na slikama.</p>
      <div class="cms-steps">
        ${step(1, 'media', 'Slike', 'Učitajte rendere zgrade i tlocrte koje imate.', '<span class="cms-media-n">…</span>', false)}
        ${step(2, 'units', 'Podaci o stanovima', 'Za svaki stan upišite broj, sprat, kvadraturu i status (ili uvezite iz Excela).', total + ' stanova unijeto', total > 0)}
        ${step(3, 'scenes', 'Označite stanove na slici', 'Dodajte slike zgrade, pa na njima nacrtajte oblik svakog stana i povežite ga sa stanom iz koraka 2.', views ? (total ? done + ' od ' + total + ' stanova označeno' : views + ' slika dodano') : 'još nema slika zgrade', total > 0 && done === total)}
        ${step(4, 'content', 'Tekstovi sajta', 'Naslov, opis projekta, galerija, lokacija i kontakt.', 'po želji, u bilo koje vrijeme', false)}
      </div></section>
    <section class="cms-card"><h2>Kako se promjena pojavi na sajtu?</h2><p>Svaka promjena se vidi tek kad kliknete <b>Spremi promjene</b>. Nakon toga je na sajtu za nekoliko sekundi (najkasnije za pet minuta). Promjene statusa stana u tabeli „2 · Stanovi“ se spremaju same čim ih odaberete.</p>
      <p><a class="cms-btn" href="/" target="_blank" rel="noopener">Pogledaj sajt ↗</a> ${total === 0 && views === 0 ? '<button type="button" class="cms-btn is-primary cms-home-demo">Prvo isprobaj s demo podacima</button>' : ''}</p></section>`;
    $$('[data-tab]', body).forEach((a) => { a.onclick = (e) => { e.preventDefault(); S.tab = a.dataset.tab; history.replaceState(null, '', '#' + S.tab); render(); }; });
    const d = $('.cms-home-demo', body); if (d) d.onclick = () => { S.tab = 'help'; history.replaceState(null, '', '#help'); render(); };
    sb.from('media').select('path', { count: 'exact', head: true }).then((r) => { const el = $('.cms-media-n', body); if (!el) return; if (r.error || r.count == null) { el.textContent = 'otvorite da vidite'; return; } const n = r.count; el.textContent = n + ' slika učitano'; if (n) el.closest('.cms-step').classList.add('is-ok'); });
  }
  function renderHelp(body) {
    body.innerHTML = `<section class="cms-card"><h2>Demo podaci</h2><p>Učitava demo masterplan (10 zgrada), zgradu Riverina 1 sa 8 uglova, 6 tlocrta spratova i 42 stana, da odmah vidite kako sve radi na sajtu. <b>Zamjenjuje postojeće scene</b>; stanovi zgrade r1 se prepisuju. Kasnije ih obrišite i ubacite prave rendere.</p><p><button type="button" class="cms-btn is-primary cms-demo">Učitaj demo podatke</button> <span class="cms-muted cms-demo-prog"></span></p></section>
    <section class="cms-card cms-help"><h2>Postupak za novu zgradu</h2><ol>
      <li><b>Mediji</b>: učitajte rendere (masterplan, uglovi zgrade), tlocrte stanova i spratova, PDF-ove. Prevucite više fajlova odjednom.</li>
      <li><b>Zgrade i scene</b>: dodajte zgradu (ID npr. <code>r1</code>). Zgrade koje još nisu u prodaji ostavite na „Uskoro u prodaji".</li>
      <li>Kod masterplana i kod svake zgrade dodajte uglove: redoslijed = redoslijed rotacije. Svi uglovi jedne zgrade trebaju imati isti format slike.</li>
      <li><b>Stanovi</b>: unesite ručno ili preko CSV-a („Izvoz CSV" daje gotov predložak za Excel). Statusi se mijenjaju direktno u tabeli.</li>
      <li>Na svakom uglu kliknite <b>Označi stanove</b> i nacrtajte oblik preko svakog stana. Savjet: označite jedan sprat pa koristite „Kopiraj sprat".</li>
      <li>Kliknite <b>Spremi promjene</b>. Sajt se osvježi za nekoliko sekundi.</li></ol>
      <h2>Direktni linkovi</h2><p>Svaki stan ima link: <code>riverinaresidence.com/#rvs/r1/A408</code> (ili kraće <code>#A408</code>), npr. za Instagram ili WhatsApp.</p>
      <h2>Upiti na e-mail</h2><p>Upiti se uvijek čuvaju u tabu „Upiti". Za e-mail obavijesti u Vercel postavkama projekta dodajte <code>RESEND_API_KEY</code> i <code>LEAD_NOTIFY_EMAIL</code> (resend.com, besplatno do 3.000 mailova mjesečno).</p>
      <h2>Renderi za 360°</h2><p>Zamolite arhitekta za kameru koja kruži oko zgrade na istoj visini i udaljenosti, s istim fokusom: 8 uglova je dovoljno za pregled, 24–36 za glatku rotaciju. Format npr. 2400×1500 px.</p></section>`;
    $('.cms-demo', body).onclick = async (e) => {
      if (!confirm('Učitati demo podatke? Postojeće scene će biti zamijenjene.')) return;
      const btn = e.target, prog = $('.cms-demo-prog', body); btn.disabled = true;
      try {
        const demo = await (await fetch('/demo/demo.json')).json();
        const files = new Set();
        demo.masterplan.views.forEach((v) => files.add(v.image));
        demo.buildings.forEach((b) => b.views.concat(b.floors).forEach((v) => files.add(v.image)));
        demo.units.forEach((u) => u.plan && files.add(u.plan));
        const map = {}; let i = 0;
        for (const f of files) {
          i++; prog.textContent = `Učitavam slike ${i}/${files.size}…`;
          const blob = await (await fetch('/demo/' + f)).blob();
          const file = new File([blob], f.split('/').pop(), { type: blob.type || (f.endsWith('.png') ? 'image/png' : 'image/jpeg') });
          const saved = await upload(file, { path: 'demo/' + f.split('/').pop(), upsert: true, max: 99999 });
          map[f] = saved.path;
        }
        const conv = (v) => ({ ...v, image: map[v.image] || v.image });
        S.scenes = { masterplan: { views: demo.masterplan.views.map(conv) }, buildings: demo.buildings.map((b) => ({ ...b, views: b.views.map(conv), floors: b.floors.map(conv) })) };
        prog.textContent = 'Spremam scene i stanove…';
        await saveContent('scenes', S.scenes);
        const rows = demo.units.map((u) => unitPayload({ ...u, plan_path: map[u.plan] || '', pdf_path: '' }));
        must(await sb.from('units').upsert(rows, { onConflict: 'building,code' }));
        S.units = must(await sb.from('units').select('*').order('building').order('floor').order('code')).map(normUnit);
        S.dirty.scenes = false; revalidate();
        toast(`Demo učitan: ${rows.length} stanova, ${files.size} slika`);
        S.tab = 'scenes'; history.replaceState(null, '', '#scenes'); render();
      } catch (err) { btn.disabled = false; prog.textContent = ''; fail(err); }
    };
  }

  start();
}
