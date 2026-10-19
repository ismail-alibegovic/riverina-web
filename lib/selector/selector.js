/*!
 * Riverina Selector — interactive masterplan / building / floor / apartment viewer.
 * Vanilla JS, no dependencies. (c) IA Production
 */
(function () {
  'use strict';

  var I18N = {
    bs: {
      masterplan: 'Masterplan', back_master: 'Masterplan', back_building: 'Zgrada', compare: 'Usporedba', floors: 'Spratovi',
      hint_master: 'Odaberite zgradu na planu', hint_building: 'Kliknite na stan', hint_floor: 'Kliknite na stan na tlocrtu',
      hide_labels: 'Sakrij oznake', show_labels: 'Prikaži oznake', show_status: 'Prikaži dostupnost', hide_status: 'Sakrij dostupnost',
      available: 'Slobodno', reserved: 'Rezervisano', sold: 'Prodano', unavailable: 'Nije u prodaji',
      soon: 'Uskoro dostupno', available_count: '{n} slobodnih stanova', available_count_1: '{n} slobodan stan',
      floor: 'Sprat', floor_n: '{n}. sprat', ground: 'Prizemlje', bedrooms: 'Spavaće sobe', bedrooms_n_1: '1 spavaća soba', bedrooms_n: '{n} spavaće sobe', bedrooms_n_5: '{n} spavaćih soba', studio: 'Garsonjera',
      area: 'Prodajna površina', area_net: 'Korisna površina', orientation: 'Orijentacija', status: 'Status', price: 'Cijena', price_on_request: 'Na upit', unit: 'Broj stana', building: 'Zgrada',
      call_sales: 'Pozovite prodaju', send_enquiry: 'Pošaljite upit', download_pdf: 'Preuzmi PDF', add_compare: 'Dodaj u usporedbu', in_compare: 'U usporedbi', remove: 'Ukloni',
      zoom: 'Povećaj', rooms: 'Prostorije', total: 'Ukupno', position: 'Položaj na spratu', plan: 'Tlocrt',
      tab_3d: '3D prikaz', tab_floor: 'Na spratu', type: 'Tip', loggia: 'Lođa', terrace: 'Terasa', area_short: 'Površina', illustration: 'Ilustracija',
      prev_unit: 'Prethodni stan', next_unit: 'Sljedeći stan', media: 'Prikaz stana', note_area: 'Površine prema prodajnim skicama arhitekta. Dopušteno odstupanje kvadrature ±3 %. Podložno raspoloživosti.',
      filters: 'Filteri', all: 'Sve', reset: 'Poništi filtere', showing: 'Prikazano {a} od {b} stanova', no_results: 'Nema stanova koji odgovaraju filterima.', more: 'Prikaži još',
      area_from: 'od m²', area_to: 'do m²', compare_title: 'Usporedba stanova', compare_go: 'Uporedi', compare_max: 'Možete uporediti najviše {n} stana.', clear: 'Očisti',
      form_title: 'Zainteresovani ste za ovaj stan?', form_name: 'Ime i prezime', form_email: 'E-mail', form_phone: 'Telefon', form_msg: 'Poruka', form_msg_default: 'Zanima me stan {code} ({building}). Molim vas da me kontaktirate.',
      form_consent: 'Saglasan/na sam da me prodajni tim kontaktira u vezi s ovim upitom.', form_send: 'Pošalji upit', form_sending: 'Šaljem…', form_ok: 'Hvala. Vaš upit je poslan i javit ćemo vam se uskoro.', form_err: 'Upit nije poslan. Pokušajte ponovo ili nas pozovite.', form_required: 'Unesite ime i e-mail ili telefon te potvrdite saglasnost.',
      breadcrumb: 'Putanja', prev: 'Prethodni', next: 'Sljedeći', close: 'Zatvori', rotate_left: 'Rotiraj lijevo', rotate_right: 'Rotiraj desno', demo: 'Demo podaci', not_in_view: 'Stan nije vidljiv iz ovog ugla', view_floor: 'Otvori tlocrt sprata', floor_summary: '{a} slobodnih od {b}',
    },
    en: {
      masterplan: 'Masterplan', back_master: 'Masterplan', back_building: 'Building', compare: 'Compare', floors: 'Floors',
      hint_master: 'Select a building on the plan', hint_building: 'Click an apartment', hint_floor: 'Click an apartment on the plan',
      hide_labels: 'Hide labels', show_labels: 'Show labels', show_status: 'Show availability', hide_status: 'Hide availability',
      available: 'Available', reserved: 'Reserved', sold: 'Sold', unavailable: 'Not for sale',
      soon: 'Coming soon', available_count: '{n} apartments available', available_count_1: '{n} apartment available',
      floor: 'Floor', floor_n: 'Floor {n}', ground: 'Ground floor', bedrooms: 'Bedrooms', bedrooms_n_1: '1 bedroom', bedrooms_n: '{n} bedrooms', bedrooms_n_5: '{n} bedrooms', studio: 'Studio',
      area: 'Saleable area', area_net: 'Net area', orientation: 'Orientation', status: 'Status', price: 'Price', price_on_request: 'On request', unit: 'Apartment', building: 'Building',
      call_sales: 'Call sales', send_enquiry: 'Send enquiry', download_pdf: 'Download PDF', add_compare: 'Add to compare', in_compare: 'In compare', remove: 'Remove',
      zoom: 'Enlarge', rooms: 'Rooms', total: 'Total', position: 'Position on floor', plan: 'Floor plan',
      tab_3d: '3D view', tab_floor: 'On the floor', type: 'Type', loggia: 'Loggia', terrace: 'Terrace', area_short: 'Area', illustration: 'Illustration',
      prev_unit: 'Previous apartment', next_unit: 'Next apartment', media: 'Apartment views', note_area: "Areas as on the architect's sales plans. Permitted area variation ±3%. Subject to availability.",
      filters: 'Filters', all: 'All', reset: 'Reset filters', showing: 'Showing {a} of {b} apartments', no_results: 'No apartments match your filters.', more: 'Show more',
      area_from: 'from m²', area_to: 'to m²', compare_title: 'Compare apartments', compare_go: 'Compare', compare_max: 'You can compare up to {n} apartments.', clear: 'Clear',
      form_title: 'Interested in this apartment?', form_name: 'Full name', form_email: 'E-mail', form_phone: 'Phone', form_msg: 'Message', form_msg_default: 'I am interested in apartment {code} ({building}). Please contact me.',
      form_consent: 'I agree to be contacted by the sales team about this enquiry.', form_send: 'Send enquiry', form_sending: 'Sending…', form_ok: 'Thank you. Your enquiry has been sent and we will be in touch shortly.', form_err: 'The enquiry could not be sent. Please try again or call us.', form_required: 'Enter your name and an e-mail or phone, and tick the consent box.',
      breadcrumb: 'Breadcrumb', prev: 'Previous', next: 'Next', close: 'Close', rotate_left: 'Rotate left', rotate_right: 'Rotate right', demo: 'Demo data', not_in_view: 'Not visible from this angle', view_floor: 'Open floor plan', floor_summary: '{a} of {b} available',
    },
  };
  var EN_WORDS = {
    'Jug': 'South', 'Sjever': 'North', 'Istok': 'East', 'Zapad': 'West', 'Jugoistok': 'South-east', 'Jugozapad': 'South-west', 'Sjeveroistok': 'North-east', 'Sjeverozapad': 'North-west',
    'Ulazni hodnik': 'Entrance hall', 'Hodnik': 'Hallway', 'Kupatilo': 'Bathroom', 'Toalet': 'WC', 'Ostava': 'Storage', 'Spavaća soba': 'Bedroom', 'Dnevni boravak': 'Living room',
    'Dnevni boravak i kuhinja': 'Living room & kitchen', 'Kuhinja': 'Kitchen', 'Trpezarija': 'Dining', 'Balkon': 'Balcony', 'Loggia': 'Loggia', 'Lođa': 'Loggia', 'Terasa': 'Terrace', 'Garderoba': 'Walk-in closet',
  };
  var STATUSES = ['available', 'reserved', 'sold', 'unavailable'];
  // Smooth scrolling only when the visitor has not asked for reduced motion.
  function scrollBehavior() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'; }
  var MAX_COMPARE = 4;

  // ---------- small DOM helpers ----------
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null || attrs[k] === false) continue;
      if (k === 'class') el.className = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else if (k === 'text') el.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]);
      else el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c == null || c === false) return; el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs) { var el = document.createElementNS(SVGNS, tag); for (var k in attrs) el.setAttribute(k, attrs[k]); return el; }
  /** A point inside a polygon for its label: the area centroid, or for L shapes the middle of the widest chord through it. */
  function centroid(pts) {
    var a = 0, cx = 0, cy = 0, i, j;
    for (i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var f = pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
      a += f; cx += (pts[j][0] + pts[i][0]) * f; cy += (pts[j][1] + pts[i][1]) * f;
    }
    if (!a) return pts[0];
    cx /= 3 * a; cy /= 3 * a;
    var xs = [];
    for (i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var y1 = pts[j][1], y2 = pts[i][1];
      if ((y1 > cy) !== (y2 > cy)) xs.push(pts[j][0] + (cy - y1) * (pts[i][0] - pts[j][0]) / (y2 - y1));
    }
    xs.sort(function (p, q) { return p - q; });
    var best = null;
    for (i = 0; i + 1 < xs.length; i += 2) {
      if (cx >= xs[i] && cx <= xs[i + 1]) return [cx, cy];
      if (!best || xs[i + 1] - xs[i] > best[1] - best[0]) best = [xs[i], xs[i + 1]];
    }
    return best ? [(best[0] + best[1]) / 2, cy] : [cx, cy];
  }
  function esc(str) { return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var ICON = {
    chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    rotL: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    rotR: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v4h-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    dl: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 6.5L12 13l8.5-6.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M16 16l4.5 4.5M11 8v6M8 11h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5M3 16l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  };

  // ---------- app ----------
  function Selector(root, boot) {
    this.root = root;
    this.boot = boot || {};
    this.data = normalize(boot.data || {}, boot.assetBase || '');
    if (boot.masterplan === false) this.data.masterplan.views = [];
    var st = {};
    // Language: built-in BS/EN; other languages come with their strings in boot.strings (lib/i18n.ts SELECTOR_UI).
    var lang = String(boot.lang || document.documentElement.lang || 'bs').slice(0, 2);
    if (boot.strings) I18N[lang] = Object.assign({}, I18N[lang] || I18N.en, boot.strings);
    try { st = JSON.parse(localStorage.getItem('rvs-compare') || '[]'); } catch (e) { st = []; }
    this.state = {
      level: 'master', b: null, view: 0, floor: null, unit: null,
      lang: I18N[lang] ? lang : 'bs',
      labels: true, showAll: false, filters: { status: [], beds: [], floor: '', building: '', min: '', max: '' },
      sort: { key: 'code', dir: 1 }, limit: 30, compare: Array.isArray(st) ? st : [],
    };
    this.imgCache = {};
    this.build();
    this.applyHash(true);
    var self = this;
    this._onHash = function () { self.applyHash(false); };
    this._onResize = function () { self.layout(); };
    window.addEventListener('hashchange', this._onHash);
    window.addEventListener('resize', this._onResize);
    if ('ResizeObserver' in window) { this._ro = new ResizeObserver(function () { self.layout(); }); this._ro.observe(root); }
  }

  function normalize(d, base) {
    var abs = function (u) { if (!u) return ''; return /^(https?:)?\/\/|^data:|^\//.test(u) ? u : base + u; };
    d.settings = d.settings || {};
    d.masterplan = d.masterplan || { views: [] };
    d.masterplan.views = (d.masterplan.views || []).filter(function (v) { return v.image; });
    d.masterplan.views.forEach(function (v) { v.image = abs(v.image); v.shapes = v.shapes || []; });
    d.buildings = d.buildings || [];
    d.units = d.units || [];
    var byB = {};
    d.buildings.forEach(function (b) {
      b.views = (b.views || []).filter(function (v) { return v.image; });
      b.views.forEach(function (v) { v.image = abs(v.image); v.shapes = v.shapes || []; });
      b.floors = (b.floors || []).slice().sort(function (a, c) { return c.level - a.level; });
      b.floors.forEach(function (f) { f.image = abs(f.image); f.shapes = f.shapes || []; });
      byB[b.id] = b;
    });
    d.byBuilding = byB;
    d.unitMap = {};
    d.units.forEach(function (u) {
      u.plan = abs(u.plan); u.pdf = abs(u.pdf);
      u.floor = Number(u.floor); u.bedrooms = Number(u.bedrooms || 0);
      u.area = Number(u.area || 0); u.area_net = Number(u.area_net || 0);
      u.price = u.price === '' || u.price == null ? null : Number(u.price);
      if (STATUSES.indexOf(u.status) < 0) u.status = 'available';
      u.rooms = u.rooms || [];
      d.unitMap[u.building + '/' + u.code] = u;
    });
    return d;
  }

  var P = Selector.prototype;

  P.t = function (key, vars) {
    var str = (I18N[this.state.lang] || I18N.bs)[key];
    if (str == null) str = I18N.bs[key] || key;
    if (vars) for (var k in vars) str = str.replace('{' + k + '}', vars[k]);
    return str;
  };
  // CMS fields: `label` is Bosnian, translations are stored as `label_en`, `label_tr`, ...
  P.L = function (obj, field) { if (!obj) return ''; return (this.state.lang !== 'bs' && (obj[field + '_' + this.state.lang] || obj[field + '_en'])) || obj[field] || ''; };
  P.word = function (str) {
    if (this.state.lang === 'bs' || !str) return str || '';
    return String(str).split(/(\s*\/\s*|\s*,\s*)/).map(function (p) { return EN_WORDS[p.trim()] ? p.replace(p.trim(), EN_WORDS[p.trim()]) : p; }).join('');
  };
  P.floorName = function (b, n) {
    var f = b && b.floors.filter(function (x) { return Number(x.level) === Number(n); })[0];
    if (f && this.L(f, 'label')) return this.L(f, 'label');
    return Number(n) === 0 ? this.t('ground') : this.t('floor_n', { n: n });
  };
  P.beds = function (n) {
    if (!n) return this.t('studio');
    if (n === 1) return this.t('bedrooms_n_1');
    return this.t(n >= 5 ? 'bedrooms_n_5' : 'bedrooms_n', { n: n });
  };
  // Chromium formats bs-BA like English (73.93) while claiming support; Croatian uses the same 73,93 and 1.250.
  var BS_NUM = (1.5).toLocaleString('bs-BA') === '1,5' ? 'bs-BA' : 'hr-HR';
  P.numLocale = function () { var l = this.state.lang; var loc = (l === this.boot.lang && this.boot.numberLocale) || (l === 'bs' ? 'bs-BA' : l === 'en' ? 'en-GB' : l); return loc === 'bs-BA' ? BS_NUM : loc; };
  P.m2 = function (v) { return v ? (Math.round(v * 100) / 100).toLocaleString(this.numLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m²' : '-'; };
  P.price = function (u) {
    var st = this.data.settings;
    if (!st.show_price || u.status === 'sold') return null;
    if (u.price == null || isNaN(u.price)) return this.t('price_on_request');
    return u.price.toLocaleString(this.numLocale(), { maximumFractionDigits: 0 }) + ' ' + (st.currency || 'KM');
  };
  P.building = function () { return this.data.byBuilding[this.state.b] || null; };
  P.unitsOf = function (bid) { return this.data.units.filter(function (u) { return u.building === bid; }); };
  P.availCount = function (bid) { return this.unitsOf(bid).filter(function (u) { return u.status === 'available'; }).length; };

  // ---------- build DOM ----------
  P.build = function () {
    var self = this, R = this.root;
    R.innerHTML = '';
    R.classList.add('rvs');
    var st = this.data.settings;
    if (st.colors) for (var k in st.colors) if (st.colors[k]) R.style.setProperty('--rvs-' + k, st.colors[k]);

    this.el = {};
    var E = this.el;
    E.crumbs = h('nav', { class: 'rvs-crumbs', 'aria-label': this.t('breadcrumb') });
    E.compareBtn = h('button', { class: 'rvs-pill rvs-compare-btn', type: 'button', onclick: function () { self.openCompare(); } });
    E.lang = h('div', { class: 'rvs-lang', role: 'group' });
    Object.keys(I18N).forEach(function (l) {
      E.lang.appendChild(h('button', { type: 'button', 'data-lang': l, text: l.toUpperCase(), onclick: function () { self.setLang(l); } }));
    });
    E.bar = h('header', { class: 'rvs-bar' }, [
      h('div', { class: 'rvs-brand' }, [h('span', { class: 'rvs-brand-name', text: (this.data.project && this.data.project.name) || 'Riverina Residence' }), E.crumbs]),
      h('div', { class: 'rvs-bar-right' }, [this.data.project && this.data.project.demo ? h('span', { class: 'rvs-demo-tag', text: this.t('demo') }) : null, E.compareBtn, st.hide_lang ? null : E.lang]),
    ]);

    // stage
    E.imgA = h('img', { class: 'rvs-img is-on', alt: '', draggable: 'false' });
    E.imgB = h('img', { class: 'rvs-img', alt: '', draggable: 'false' });
    E.svg = s('svg', { class: 'rvs-svg', preserveAspectRatio: 'none' });
    E.pins = h('div', { class: 'rvs-pins' });
    E.canvas = h('div', { class: 'rvs-canvas' }, [E.imgA, E.imgB, E.svg, E.pins]);
    E.viewport = h('div', { class: 'rvs-viewport' }, [E.canvas]);
    E.back = h('button', { class: 'rvs-chip rvs-back', type: 'button', onclick: function () { self.goUp(); } });
    E.viewLabel = h('div', { class: 'rvs-chip rvs-viewlabel' });
    E.prev = h('button', { class: 'rvs-rot rvs-rot-prev', type: 'button', html: ICON.rotL, onclick: function () { self.rotate(-1); } });
    E.next = h('button', { class: 'rvs-rot rvs-rot-next', type: 'button', html: ICON.rotR, onclick: function () { self.rotate(1); } });
    E.floors = h('div', { class: 'rvs-floors' });
    E.hint = h('div', { class: 'rvs-chip rvs-hint' });
    E.tools = h('div', { class: 'rvs-tools' });
    // Hover preview only; the same facts are in the apartment list and panel, so screen readers skip it.
    E.tip = h('div', { class: 'rvs-tip', 'aria-hidden': 'true' });
    E.dots = h('div', { class: 'rvs-dots' });
    E.loader = h('div', { class: 'rvs-loader' });
    E.stage = h('div', { class: 'rvs-stage', tabindex: '0' }, [E.viewport, E.back, E.viewLabel, E.prev, E.next, E.floors, E.hint, E.tools, E.dots, E.tip, E.loader]);
    E.legend = h('div', { class: 'rvs-legend' });
    E.empty = h('div', { class: 'rvs-empty' });

    // list
    E.filters = h('div', { class: 'rvs-filters' });
    E.count = h('div', { class: 'rvs-count' });
    E.table = h('div', { class: 'rvs-table', role: 'table' });
    E.more = h('button', { class: 'rvs-btn rvs-btn-ghost rvs-more', type: 'button', onclick: function () { self.state.limit += 30; self.renderList(); } });
    E.list = h('section', { class: 'rvs-list' }, [E.filters, E.count, E.table, E.more]);

    // overlays (portalled to body so theme stacking contexts don't clip them)
    E.scrim = h('div', { class: 'rvs-scrim', onclick: function () { self.closePanel(); self.closeCompare(); } });
    E.panel = h('aside', { class: 'rvs-panel', role: 'dialog', 'aria-modal': 'true', 'aria-hidden': 'true' });
    E.cmpBar = h('div', { class: 'rvs-cmpbar' });
    E.cmp = h('div', { class: 'rvs-cmp', role: 'dialog', 'aria-modal': 'true', 'aria-hidden': 'true' });
    E.lightbox = h('div', { class: 'rvs-lightbox', 'aria-hidden': 'true', onclick: function (e) { if (e.target === E.lightbox || e.target.closest('.rvs-lb-close')) self.closeLightbox(); } });
    E.portal = h('div', { class: 'rvs rvs-portal' }, [E.scrim, E.panel, E.cmp, E.cmpBar, E.lightbox]);
    if (st.colors) for (var c in st.colors) if (st.colors[c]) E.portal.style.setProperty('--rvs-' + c, st.colors[c]);
    document.body.appendChild(E.portal);

    R.appendChild(E.bar);
    R.appendChild(h('div', { class: 'rvs-stage-wrap' }, [E.stage, E.legend, E.empty]));
    if (st.list !== false) R.appendChild(E.list);

    this.bindStage();
    this._onKey = function (e) {
      if (e.key === 'Escape') { if (E.lightbox.classList.contains('is-open')) self.closeLightbox(); else if (E.cmp.classList.contains('is-open')) self.closeCompare(); else if (self.state.unit) self.closePanel(); }
    };
    document.addEventListener('keydown', this._onKey);
  };

  P.destroy = function () {
    window.removeEventListener('hashchange', this._onHash);
    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('keydown', this._onKey);
    if (this._ro) this._ro.disconnect();
    if (this.el && this.el.portal) this.el.portal.remove();
    document.documentElement.classList.remove('rvs-lock');
    if (this.root) { this.root.__rvs = null; this.root.innerHTML = ''; }
  };

  // ---------- stage interactions ----------
  P.bindStage = function () {
    var self = this, E = this.el, drag = null;
    E.stage.addEventListener('keydown', function (e) {
      if (e.target !== E.stage) return;
      if (e.key === 'ArrowLeft') { self.rotate(-1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { self.rotate(1); e.preventDefault(); }
    });
    E.svg.addEventListener('pointermove', function (e) {
      if (drag && drag.moved) return;
      var g = e.target.closest && e.target.closest('[data-key]');
      if (e.pointerType !== 'mouse') return;
      self.hover(g ? g.getAttribute('data-key') : null, e);
    });
    E.svg.addEventListener('pointerleave', function () { self.hover(null); });
    E.svg.addEventListener('click', function (e) {
      if (drag && drag.moved) return;
      var g = e.target.closest && e.target.closest('[data-key]');
      if (g) self.activate(g.getAttribute('data-key'));
    });
    E.svg.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var g = e.target.closest && e.target.closest('[data-key]');
      if (g) { e.preventDefault(); self.activate(g.getAttribute('data-key')); }
    });
    E.svg.addEventListener('focusin', function (e) {
      var g = e.target.closest && e.target.closest('[data-key]');
      if (g) { var r = g.getBoundingClientRect(); self.hover(g.getAttribute('data-key'), { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }); }
    });
    E.svg.addEventListener('focusout', function () { self.hover(null); });
    // drag to rotate (only when canvas is not pannable)
    E.viewport.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || self.pannable || self.views().length < 2) return;
      drag = { x: e.clientX, acc: 0, moved: false, id: e.pointerId };
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 6) { drag.moved = true; E.stage.classList.add('is-dragging'); self.hover(null); }
      var step = Math.max(28, Math.min(90, E.stage.clientWidth / (self.views().length * 1.6)));
      if (Math.abs(dx) >= step) { self.rotate(dx > 0 ? -1 : 1, true); drag.x = e.clientX; }
    });
    window.addEventListener('pointerup', function () {
      if (!drag) return;
      var d = drag; E.stage.classList.remove('is-dragging');
      setTimeout(function () { if (drag === d) drag = null; }, 0);
    });
    E.viewport.addEventListener('dragstart', function (e) { e.preventDefault(); });
  };

  P.views = function () {
    var st = this.state;
    if (st.level === 'master') return this.data.masterplan.views;
    var b = this.building();
    if (!b) return [];
    if (st.level === 'floor') { var f = this.currentFloor(); return f ? [f] : []; }
    return b.views;
  };
  P.currentFloorFor = function (u) { var b = this.data.byBuilding[u.building]; return b ? b.floors.filter(function (f) { return Number(f.level) === u.floor; })[0] : null; };
  P.currentFloor = function () {
    var b = this.building(), n = this.state.floor;
    return b ? b.floors.filter(function (f) { return Number(f.level) === Number(n); })[0] || null : null;
  };

  // ---------- navigation / hash ----------
  P.setHash = function (hash) {
    var target = hash ? '#rvs/' + hash : (location.hash.indexOf('#rvs/') === 0 ? '#rvs/' : location.hash);
    if (location.hash === target) return;
    this._own = target;
    if (history.replaceState && this.boot.hashMode === 'replace') history.replaceState(null, '', target);
    else location.hash = target;
  };
  P.syncHash = function () {
    var st = this.state, parts = [];
    if (st.level === 'master' && !st.unit) parts = [];
    else if (st.b) { parts.push(st.b); if (st.level === 'floor') parts.push('floor-' + st.floor); if (st.unit) parts.push(st.unit.split('/')[1]); }
    this.setHash(parts.join('/'));
  };
  P.applyHash = function (first) {
    var hash = location.hash;
    if (!first && hash === this._own) return;
    this._own = null;
    var st = this.state, d = this.data;
    var m = hash.indexOf('#rvs/') === 0 ? hash.slice(5).split('/').filter(Boolean) : [];
    // legacy "#A408" style
    if (!m.length && /^#[A-Za-z0-9\-_.]+$/.test(hash)) {
      var code = decodeURIComponent(hash.slice(1));
      var hit = d.units.filter(function (u) { return u.code === code; })[0];
      if (hit) m = [hit.building, hit.code];
    }
    var b = m[0] && d.byBuilding[m[0]] ? m[0] : null;
    var floorM = m[1] && /^floor-(-?\d+)$/.exec(m[1]);
    var unitCode = floorM ? m[2] : m[1];
    if (b) {
      st.b = b;
      if (floorM && this.building().floors.length) { st.level = 'floor'; st.floor = Number(floorM[1]); }
      else this.enter(b, unitCode);
    } else if (first && this.boot.startBuilding && d.byBuilding[this.boot.startBuilding]) {
      st.b = this.boot.startBuilding;
      this.enter(st.b);
    } else {
      st.b = null;
      st.level = d.masterplan.views.length ? 'master' : 'list';
      if (st.level === 'list') {
        // first building with 360° views, else the first with floor plans
        var open = d.buildings.filter(function (x) { return x.status !== 'soon' && x.views.length; })[0] || d.buildings.filter(function (x) { return x.views.length || x.floors.length; })[0];
        if (open) { st.b = open.id; this.enter(open.id); }
      }
    }
    st.view = Math.min(st.view, Math.max(0, this.views().length - 1));
    if (first) st.view = Number(this.boot.startView || 0) % Math.max(1, this.views().length);
    this.renderAll();
    var key = b && unitCode ? b + '/' + unitCode : null;
    if (key && d.unitMap[key]) this.openPanel(key, true);
    else if (this.state.unit) this.closePanel(true);
  };
  P.go = function (level, b, floor) {
    var st = this.state;
    this._saved = this._saved || {};
    if (st.level === 'building' && st.b) this._saved[st.b] = st.view;
    if (st.level === 'master') this._saved.__master = st.view;
    var prevLevel = st.level, prevB = st.b;
    st.level = level; st.b = b || null; if (floor != null) st.floor = floor;
    if (level === 'building' && (prevB !== st.b || prevLevel === 'master')) st.view = this._saved[st.b] != null ? this._saved[st.b] : this.bestBuildingView();
    if (level === 'building' && prevLevel === 'floor' && this._saved[st.b] != null) st.view = this._saved[st.b];
    if (level === 'master' && prevLevel !== 'master') st.view = this._saved.__master || 0;
    this.hover(null);
    this.renderAll();
    this.syncHash();
  };
  /** Level to show for a building: its 360° views, else the floor plan (of the unit's floor, else the lowest), else the list. */
  P.enter = function (bid, unitCode) {
    var st = this.state, b = this.data.byBuilding[bid], u = unitCode ? this.data.unitMap[bid + '/' + unitCode] : null;
    if (b.views.length) { st.level = 'building'; return; }
    if (!b.floors.length) { st.level = 'list'; return; }
    var levels = b.floors.map(function (f) { return Number(f.level); });
    st.level = 'floor';
    st.floor = u && levels.indexOf(u.floor) >= 0 ? u.floor : levels.indexOf(st.floor) >= 0 ? st.floor : Math.min.apply(null, levels);
  };
  P.bestBuildingView = function () { var b = this.building(); return b && b.default_view ? Math.min(b.default_view, b.views.length - 1) : 0; };
  P.goUp = function () {
    var st = this.state;
    if (st.level === 'floor' && this.building() && this.building().views.length) this.go('building', st.b);
    else if (st.level === 'floor' && this.data.masterplan.views.length) this.go('master', null);
    else if (st.level === 'building' && this.data.masterplan.views.length) this.go('master', null);
  };
  P.rotate = function (dir, instant) {
    var n = this.views().length;
    if (n < 2) return;
    this.state.view = (this.state.view + dir + n) % n;
    this.renderView(instant);
  };
  P.setLang = function (l) {
    this.state.lang = l;
    this.renderAll();
    if (this.state.unit) this.openPanel(this.state.unit, true);
    if (this.el.cmp.classList.contains('is-open')) this.openCompare();
  };

  // ---------- render ----------
  P.renderAll = function () {
    this.renderBar();
    this.renderStageChrome();
    this.renderView(true);
    this.renderLegend();
    this.renderFilters();
    this.renderList();
    this.renderCompareBar();
  };

  P.renderBar = function () {
    var self = this, st = this.state, E = this.el, b = this.building();
    E.crumbs.innerHTML = '';
    var items = [];
    if (this.data.masterplan.views.length) items.push([this.t('masterplan'), st.level !== 'master' ? function () { self.go('master'); } : null]);
    if (b && st.level !== 'master') items.push([b.name, st.level === 'floor' && b.views.length ? function () { self.go('building', b.id); } : null]);
    if (b && st.level === 'floor') items.push([this.floorName(b, st.floor), null]);
    items.forEach(function (it, i) {
      if (i) E.crumbs.appendChild(h('span', { class: 'rvs-crumb-sep', 'aria-hidden': 'true', text: '/' }));
      E.crumbs.appendChild(it[1] ? h('button', { type: 'button', class: 'rvs-crumb', text: it[0], onclick: it[1] }) : h('span', { class: 'rvs-crumb is-current', text: it[0] }));
    });
    E.compareBtn.innerHTML = '<span>' + esc(this.t('compare')) + '</span><b>' + st.compare.length + '</b>';
    Array.prototype.forEach.call(E.lang.children, function (btn) { btn.classList.toggle('is-on', btn.getAttribute('data-lang') === st.lang); });
  };

  P.renderStageChrome = function () {
    var self = this, st = this.state, E = this.el, b = this.building();
    var hasStage = this.views().length > 0;
    E.stage.style.display = hasStage ? '' : 'none';
    E.legend.style.display = hasStage && st.level !== 'master' ? '' : 'none';
    E.empty.style.display = 'none';
    if (!hasStage && b) { E.empty.style.display = ''; E.empty.textContent = b.name; }
    this.root.setAttribute('data-level', st.level);
    // back
    var hasViews = !!(b && b.views.length), hasMaster = this.data.masterplan.views.length > 0;
    var backLabel = st.level === 'floor' ? (hasViews ? b.name : hasMaster ? this.t('back_master') : null) : st.level === 'building' && hasMaster ? this.t('back_master') : null;
    E.back.style.display = backLabel ? '' : 'none';
    E.back.innerHTML = ICON.chev + '<span>' + esc(backLabel || '') + '</span>';
    E.hint.textContent = this.t(st.level === 'master' ? 'hint_master' : st.level === 'floor' ? 'hint_floor' : 'hint_building');
    E.prev.setAttribute('aria-label', this.t('rotate_left'));
    E.next.setAttribute('aria-label', this.t('rotate_right'));
    var multi = this.views().length > 1;
    E.prev.style.display = E.next.style.display = multi ? '' : 'none';
    // tools
    E.tools.innerHTML = '';
    if (st.level === 'master') {
      E.tools.appendChild(h('button', { type: 'button', class: 'rvs-chip rvs-tool', 'aria-label': this.t(st.labels ? 'hide_labels' : 'show_labels'), html: ICON.pin + '<span>' + esc(this.t(st.labels ? 'hide_labels' : 'show_labels')) + '</span>', onclick: function () { st.labels = !st.labels; self.renderStageChrome(); self.renderPins(); } }));
    } else {
      E.tools.appendChild(h('button', { type: 'button', class: 'rvs-chip rvs-tool' + (st.showAll ? ' is-on' : ''), 'aria-label': this.t('show_status'), 'aria-pressed': st.showAll ? 'true' : 'false', html: ICON.eye + '<span>' + esc(this.t(st.showAll ? 'hide_status' : 'show_status')) + '</span>', onclick: function () { st.showAll = !st.showAll; self.renderStageChrome(); self.paint(); } }));
    }
    // floors rail
    E.floors.innerHTML = '';
    if (b && st.level !== 'master') {
      var levels = {};
      this.unitsOf(b.id).forEach(function (u) { levels[u.floor] = true; });
      b.floors.forEach(function (f) { levels[f.level] = true; });
      var list = Object.keys(levels).map(Number).sort(function (a, c) { return c - a; });
      if (list.length > 1) {
        E.floors.appendChild(h('div', { class: 'rvs-floors-title', html: ICON.layers + '<span>' + esc(this.t('floors')) + '</span>' }));
        var ul = h('div', { class: 'rvs-floors-list' });
        list.forEach(function (n) {
          var hasPlan = b.floors.some(function (f) { return Number(f.level) === n; });
          var units = self.unitsOf(b.id).filter(function (u) { return u.floor === n; });
          var av = units.filter(function (u) { return u.status === 'available'; }).length;
          var btn = h('button', {
            type: 'button', class: 'rvs-floor' + (st.level === 'floor' && st.floor === n ? ' is-on' : '') + (av ? '' : ' is-full'),
            title: self.floorName(b, n) + ' · ' + self.t('floor_summary', { a: av, b: units.length }),
            onmouseenter: function () { self.highlightFloor(n); }, onmouseleave: function () { self.highlightFloor(null); },
            onfocus: function () { self.highlightFloor(n); }, onblur: function () { self.highlightFloor(null); },
            onclick: function () {
              if (hasPlan) self.go('floor', b.id, n);
              else { self.state.filters.floor = String(n); self.state.limit = 30; self.renderFilters(); self.renderList(); self.paint(); self.el.list.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }); }
            },
          }, [h('span', { class: 'rvs-floor-n', text: n === 0 ? 'P' : String(n) }), h('span', { class: 'rvs-floor-av', text: String(av) })]);
          ul.appendChild(btn);
        });
        E.floors.appendChild(ul);
      }
    }
    E.floors.style.display = E.floors.childNodes.length ? '' : 'none';
  };

  P.renderView = function (instant) {
    var self = this, E = this.el, views = this.views(), v = views[this.state.view] || views[0];
    if (!v) return;
    this.cur = v;
    E.viewLabel.textContent = this.state.level === 'floor' ? this.floorName(this.building(), this.state.floor) : this.L(v, 'label');
    E.viewLabel.style.display = E.viewLabel.textContent ? '' : 'none';
    // dots
    E.dots.innerHTML = '';
    if (views.length > 1 && views.length <= 16) views.forEach(function (x, i) { E.dots.appendChild(h('button', { type: 'button', class: 'rvs-dot' + (x === v ? ' is-on' : ''), 'aria-label': self.L(x, 'label') || String(i + 1), onclick: function () { self.state.view = i; self.renderView(); } })); });
    // image swap with crossfade
    var on = E.imgA.classList.contains('is-on') ? E.imgA : E.imgB, off = on === E.imgA ? E.imgB : E.imgA;
    var token = (this._tok = (this._tok || 0) + 1);
    var swap = function () {
      if (token !== self._tok) return;
      if (on.getAttribute('src') === v.image) { self.drawShapes(v); return; }
      off.src = v.image; off.alt = self.L(v, 'label');
      self.root.classList.toggle('rvs-instant', !!instant);
      off.classList.add('is-on'); on.classList.remove('is-on');
      self.drawShapes(v);
      E.loader.classList.remove('is-on');
    };
    this.ratio = (v.w && v.h) ? v.w / v.h : 1.6;
    this.layout();
    var img = this.load(v.image);
    if (img.complete && img.naturalWidth) swap();
    else { E.loader.classList.add('is-on'); img.addEventListener('load', swap, { once: true }); img.addEventListener('error', swap, { once: true }); }
    // preload neighbours
    views.forEach(function (x) { self.load(x.image); });
  };
  P.load = function (src) {
    if (!this.imgCache[src]) { var i = new Image(); i.decoding = 'async'; i.src = src; this.imgCache[src] = i; }
    return this.imgCache[src];
  };

  P.layout = function () {
    var E = this.el;
    if (!E || !this.cur) return;
    var w = E.stage.clientWidth || this.root.clientWidth;
    if (!w) return;
    var r = this.ratio || 1.6, mobile = w < 720;
    var hgt = Math.min(w / r, window.innerHeight * (this.boot.maxHeight || 0.82));
    if (mobile) hgt = Math.max(w / r, Math.min(window.innerHeight * 0.62, w * 1.2));
    hgt = Math.round(Math.max(hgt, 260));
    E.stage.style.height = hgt + 'px';
    var cw = Math.round(hgt * r), ch = hgt, top = 0;
    // fill the width when only a modest vertical crop is needed (avoids side letterboxing)
    if (cw < w && (w / r - hgt) / (w / r) <= (this.boot.maxCrop != null ? this.boot.maxCrop : 0.22)) {
      cw = w; ch = Math.round(w / r); top = -Math.round((ch - hgt) * (this.cur.focus_y != null ? this.cur.focus_y : 0.4));
    }
    E.canvas.style.width = cw + 'px';
    E.canvas.style.height = ch + 'px';
    E.canvas.style.marginTop = top + 'px';
    var pan = cw > w + 2;
    if (pan !== this.pannable || this._lastW !== w || this._lastR !== r) {
      this.pannable = pan;
      E.stage.classList.toggle('is-pannable', pan);
      if (pan) E.viewport.scrollLeft = (cw - w) / 2;
      this._lastW = w; this._lastR = r;
    }
    E.canvas.style.marginLeft = pan ? '0' : Math.round((w - cw) / 2) + 'px';
    this.renderPins();
  };

  P.drawShapes = function (v) {
    var self = this, E = this.el, st = this.state, W = v.w || 1000, H = v.h || 1000 / (this.ratio || 1.6);
    E.svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    while (E.svg.firstChild) E.svg.removeChild(E.svg.firstChild);
    var isMaster = st.level === 'master';
    (v.shapes || []).forEach(function (sh) {
      var key, label, status;
      if (isMaster) {
        var b = self.data.byBuilding[sh.target];
        if (!b) return;
        key = 'b:' + b.id; label = b.name; status = b.status === 'soon' ? 'soon' : 'active';
      } else {
        var u = self.data.unitMap[st.b + '/' + sh.unit];
        if (!u) return;
        key = 'u:' + st.b + '/' + u.code; label = u.code + ', ' + self.t(u.status); status = u.status;
      }
      var g = s('g', { class: 'rvs-shape', 'data-key': key, 'data-status': status, tabindex: '0', role: 'button', 'aria-label': label });
      var polys = sh.polys || (sh.pts ? [sh.pts] : []);
      polys.forEach(function (pts) {
        if (!pts || pts.length < 3) return;
        g.appendChild(s('polygon', { points: pts.map(function (p) { return (p[0] * W).toFixed(1) + ',' + (p[1] * H).toFixed(1); }).join(' ') }));
      });
      E.svg.appendChild(g);
    });
    this.renderPins();
    this.paint();
  };

  P.renderPins = function () {
    var self = this, E = this.el, st = this.state, v = this.cur;
    E.pins.innerHTML = '';
    if (v && st.level === 'floor') { this.renderFloorLabels(v); return; }
    if (!v || st.level !== 'master' || !st.labels) return;
    (v.shapes || []).forEach(function (sh) {
      var b = self.data.byBuilding[sh.target];
      if (!b) return;
      var pts = [].concat.apply([], sh.polys || [sh.pts]);
      if (!pts.length) return;
      var top = pts.reduce(function (a, p) { return p[1] < a[1] ? p : a; }, pts[0]);
      var cx = pts.reduce(function (a, p) { return a + p[0]; }, 0) / pts.length;
      if (sh.label_pos) { cx = sh.label_pos[0]; top = [cx, sh.label_pos[1]]; }
      var pin = h('button', {
        type: 'button', class: 'rvs-pin' + (b.status === 'soon' ? ' is-soon' : ''), style: 'left:' + (cx * 100) + '%;top:' + (top[1] * 100) + '%',
        onclick: function () { self.activate('b:' + b.id); },
        onmouseenter: function (e) { self.hover('b:' + b.id, e); }, onmouseleave: function () { self.hover(null); },
      }, [h('span', { class: 'rvs-pin-name', text: b.short || b.name }), b.subtitle || b.status === 'soon' ? h('span', { class: 'rvs-pin-sub', text: b.status === 'soon' ? self.t('soon') : self.L(b, 'subtitle') }) : null]);
      E.pins.appendChild(pin);
    });
  };

  P.renderFloorLabels = function (v) {
    var self = this, E = this.el, st = this.state;
    (v.shapes || []).forEach(function (sh) {
      var u = self.data.unitMap[st.b + '/' + sh.unit];
      var pts = (sh.polys || [sh.pts])[0];
      if (!u || !pts || pts.length < 3) return;
      var c = centroid(pts);
      E.pins.appendChild(h('span', { class: 'rvs-plabel', 'data-key': 'u:' + st.b + '/' + u.code, 'data-status': u.status, 'aria-hidden': 'true', style: 'left:' + (c[0] * 100) + '%;top:' + (c[1] * 100) + '%' }, [
        h('span', { class: 'rvs-plabel-code', text: u.code }),
        h('span', { class: 'rvs-plabel-sub', text: self.m2(u.area) }),
      ]));
    });
  };

  // classes on shapes: status fills, filter matches, highlight
  P.paint = function () {
    var self = this, st = this.state, match = this.filterActive() ? this.matchSet() : null;
    // shapes and their floor-plan labels
    Array.prototype.forEach.call(this.el.stage.querySelectorAll('.rvs-shape, .rvs-plabel'), function (g) {
      var key = g.getAttribute('data-key');
      g.classList.toggle('is-selected', st.unit != null && key === 'u:' + st.unit);
      g.classList.toggle('is-filled', st.showAll && key.charAt(0) === 'u');
      g.classList.toggle('is-match', !!(match && match[key.slice(2)]));
    });
  };
  P.highlight = function (keys) {
    keys = keys || [];
    Array.prototype.forEach.call(this.el.svg.querySelectorAll('.rvs-shape'), function (g) { g.classList.toggle('is-hl', keys.indexOf(g.getAttribute('data-key')) >= 0); });
  };
  P.highlightFloor = function (n) {
    var self = this;
    if (n == null || this.state.level !== 'building') return this.highlight([]);
    this.highlight(this.unitsOf(this.state.b).filter(function (u) { return u.floor === n; }).map(function (u) { return 'u:' + self.state.b + '/' + u.code; }));
  };

  P.hover = function (key, e) {
    var E = this.el, tip = E.tip, self = this;
    if (this._hoverKey !== key) {
      this._hoverKey = key;
      Array.prototype.forEach.call(E.stage.querySelectorAll('.is-hover[data-key]'), function (g) { g.classList.remove('is-hover'); });
      if (key) Array.prototype.forEach.call(E.stage.querySelectorAll('[data-key="' + key + '"]'), function (g) { g.classList.add('is-hover'); });
      if (!key) { tip.classList.remove('is-on'); return; }
      tip.innerHTML = this.tipHTML(key);
    }
    if (!key || !e) return;
    tip.classList.add('is-on');
    var r = E.stage.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var left = x + 18, top = y + 18;
    if (left + tw > r.width - 8) left = x - tw - 18;
    if (top + th > r.height - 8) top = y - th - 18;
    tip.style.transform = 'translate(' + Math.max(8, left) + 'px,' + Math.max(8, top) + 'px)';
    void self;
  };
  P.tipHTML = function (key) {
    if (key.charAt(0) === 'b') {
      var b = this.data.byBuilding[key.slice(2)];
      var n = this.availCount(b.id);
      var sub = b.status === 'soon' ? '<span class="rvs-st rvs-st-unavailable">' + esc(this.t('soon')) + '</span>' : '<span class="rvs-st rvs-st-available">' + esc(this.t(n === 1 ? 'available_count_1' : 'available_count', { n: n })) + '</span>';
      return '<strong>' + esc(b.name) + '</strong>' + (b.subtitle && b.status !== 'soon' ? '<span>' + esc(this.L(b, 'subtitle')) + '</span>' : '') + sub;
    }
    var u = this.data.unitMap[key.slice(2)];
    var b2 = this.data.byBuilding[u.building];
    var pr = this.price(u);
    return '<strong>' + esc(u.code) + '</strong><span>' + esc(this.floorName(b2, u.floor)) + ' · ' + esc(this.beds(u.bedrooms)) + '</span><span>' + esc(this.m2(u.area)) + (pr ? ' · ' + esc(pr) : '') + '</span><span class="rvs-st rvs-st-' + u.status + '">' + esc(this.t(u.status)) + '</span>';
  };

  P.activate = function (key) {
    this.hover(null);
    if (key.charAt(0) === 'b') {
      var b = this.data.byBuilding[key.slice(2)];
      if (!b || b.status === 'soon') { this.flash(key); return; }
      if (b.views.length) this.go('building', b.id);
      else { this.state.filters.building = b.id; this.renderFilters(); this.renderList(); this.el.list.scrollIntoView({ behavior: scrollBehavior() }); }
      return;
    }
    this.openPanel(key.slice(2));
  };
  P.flash = function (key) {
    var gs = this.el.svg.querySelectorAll('[data-key="' + key + '"]');
    Array.prototype.forEach.call(gs, function (g) { g.classList.remove('is-flash'); void g.getBoundingClientRect(); g.classList.add('is-flash'); });
  };

  P.renderLegend = function () {
    var self = this, E = this.el;
    E.legend.innerHTML = '';
    STATUSES.forEach(function (k) {
      if (k === 'unavailable' && !self.data.units.some(function (u) { return u.status === 'unavailable'; })) return;
      E.legend.appendChild(h('span', { class: 'rvs-legend-item' }, [h('i', { class: 'rvs-dotc rvs-bg-' + k }), self.t(k)]));
    });
  };

  // ---------- filters & list ----------
  P.filterActive = function () { var f = this.state.filters; return !!(f.status.length || f.beds.length || f.floor !== '' || f.building || f.min !== '' || f.max !== ''); };
  P.filtered = function () {
    var f = this.state.filters, st = this.state;
    var scopeB = f.building || (st.level !== 'master' ? st.b : '');
    var arr = this.data.units.filter(function (u) {
      if (u.hidden) return false;
      if (scopeB && u.building !== scopeB) return false;
      if (f.status.length && f.status.indexOf(u.status) < 0) return false;
      if (f.beds.length && f.beds.indexOf(u.bedrooms >= 4 ? 4 : u.bedrooms) < 0) return false;
      if (f.floor !== '' && u.floor !== Number(f.floor)) return false;
      if (f.min !== '' && u.area < Number(f.min)) return false;
      if (f.max !== '' && u.area > Number(f.max)) return false;
      return true;
    });
    var k = st.sort.key, dir = st.sort.dir;
    var order = { available: 0, reserved: 1, sold: 2, unavailable: 3 };
    arr.sort(function (a, b) {
      var x = a[k], y = b[k];
      if (k === 'status') { x = order[x]; y = order[y]; }
      if (k === 'code') return dir * String(a.building + a.code).localeCompare(String(b.building + b.code), undefined, { numeric: true });
      if (x == null) x = Infinity; if (y == null) y = Infinity;
      return dir * (x > y ? 1 : x < y ? -1 : String(a.code).localeCompare(String(b.code), undefined, { numeric: true }));
    });
    return arr;
  };
  P.matchSet = function () { var m = {}; this.filtered().forEach(function (u) { m[u.building + '/' + u.code] = true; }); return m; };

  P.renderFilters = function () {
    var self = this, E = this.el, f = this.state.filters, st = this.state;
    E.filters.innerHTML = '';
    var scopeB = f.building || (st.level !== 'master' ? st.b : '');
    var pool = this.data.units.filter(function (u) { return !scopeB || u.building === scopeB; });
    var chipGroup = function (label, values, sel, fmt, onToggle) {
      var g = h('div', { class: 'rvs-fgroup' }, [h('span', { class: 'rvs-flabel', text: label })]);
      var row = h('div', { class: 'rvs-chips' });
      values.forEach(function (v) {
        var on = sel.indexOf(v) >= 0;
        row.appendChild(h('button', { type: 'button', class: 'rvs-fchip' + (on ? ' is-on' : ''), 'aria-pressed': on ? 'true' : 'false', html: fmt(v), onclick: function () { onToggle(v); } }));
      });
      g.appendChild(row);
      return g;
    };
    var toggle = function (arr, v) { var i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); self.state.limit = 30; self.renderFilters(); self.renderList(); self.paint(); };
    // building select when more than one building has units
    var bIds = this.data.buildings.filter(function (b) { return self.unitsOf(b.id).length; });
    if (bIds.length > 1 && st.level === 'master') {
      var sel = h('select', { class: 'rvs-select', onchange: function (e) { f.building = e.target.value; f.floor = ''; self.renderFilters(); self.renderList(); self.paint(); } }, [h('option', { value: '', text: self.t('all') })]);
      bIds.forEach(function (b) { sel.appendChild(h('option', { value: b.id, text: b.name, selected: f.building === b.id ? 'selected' : null })); });
      E.filters.appendChild(h('div', { class: 'rvs-fgroup' }, [h('span', { class: 'rvs-flabel', text: this.t('building') }), sel]));
    }
    var present = STATUSES.filter(function (k) { return pool.some(function (u) { return u.status === k; }); });
    E.filters.appendChild(chipGroup(this.t('status'), present, f.status, function (k) { return '<i class="rvs-dotc rvs-bg-' + k + '"></i>' + esc(self.t(k)); }, function (v) { toggle(f.status, v); }));
    var beds = []; pool.forEach(function (u) { var n = u.bedrooms >= 4 ? 4 : u.bedrooms; if (beds.indexOf(n) < 0) beds.push(n); });
    beds.sort();
    if (beds.length > 1) E.filters.appendChild(chipGroup(this.t('bedrooms'), beds, f.beds, function (n) { return n === 0 ? esc(self.t('studio')) : n === 4 ? '4+' : String(n); }, function (v) { toggle(f.beds, v); }));
    var floors = []; pool.forEach(function (u) { if (floors.indexOf(u.floor) < 0) floors.push(u.floor); });
    floors.sort(function (a, b) { return a - b; });
    if (floors.length > 1) {
      var fs = h('select', { class: 'rvs-select', 'aria-label': this.t('floor'), onchange: function (e) { f.floor = e.target.value; self.state.limit = 30; self.renderList(); self.paint(); } }, [h('option', { value: '', text: self.t('all') })]);
      var bb = this.data.byBuilding[scopeB];
      floors.forEach(function (n) { fs.appendChild(h('option', { value: String(n), text: self.floorName(bb, n), selected: f.floor === String(n) ? 'selected' : null })); });
      E.filters.appendChild(h('div', { class: 'rvs-fgroup' }, [h('span', { class: 'rvs-flabel', text: this.t('floor') }), fs]));
    }
    var num = function (key, ph) {
      return h('input', { class: 'rvs-input', type: 'number', inputmode: 'decimal', min: '0', placeholder: ph, value: f[key], 'aria-label': self.t('area') + ' ' + ph,
        oninput: function (e) { f[key] = e.target.value; clearTimeout(self._nt); self._nt = setTimeout(function () { self.state.limit = 30; self.renderList(); self.paint(); }, 200); } });
    };
    E.filters.appendChild(h('div', { class: 'rvs-fgroup' }, [h('span', { class: 'rvs-flabel', text: this.t('area') }), h('div', { class: 'rvs-range' }, [num('min', this.t('area_from')), h('span', { text: '-' }), num('max', this.t('area_to'))])]));
    if (this.filterActive()) E.filters.appendChild(h('button', { type: 'button', class: 'rvs-reset', text: this.t('reset'), onclick: function () { self.state.filters = { status: [], beds: [], floor: '', building: '', min: '', max: '' }; self.renderFilters(); self.renderList(); self.paint(); } }));
  };

  P.renderList = function () {
    var self = this, E = this.el, st = this.state;
    var all = this.filtered();
    var scopeB = st.filters.building || (st.level !== 'master' ? st.b : '');
    var total = this.data.units.filter(function (u) { return !u.hidden && (!scopeB || u.building === scopeB); }).length;
    E.count.textContent = this.t('showing', { a: all.length, b: total });
    E.table.innerHTML = '';
    var showB = !scopeB && this.data.buildings.filter(function (b) { return self.unitsOf(b.id).length; }).length > 1;
    var cols = [['code', this.t('unit')]];
    if (showB) cols.push(['building', this.t('building')]);
    cols.push(['floor', this.t('floor')], ['bedrooms', this.t('bedrooms')], ['area', this.t('area')]);
    if (all.some(function (u) { return u.orientation; })) cols.push(['orientation', this.t('orientation')]);
    if (this.data.settings.show_price) cols.push(['price', this.t('price')]);
    cols.push(['status', this.t('status')]);
    var head = h('div', { class: 'rvs-tr rvs-th', role: 'row' });
    cols.forEach(function (c) {
      var on = st.sort.key === c[0];
      head.appendChild(h('button', { type: 'button', role: 'columnheader', class: 'rvs-td rvs-c-' + c[0] + (on ? ' is-sorted' : ''), 'aria-sort': on ? (st.sort.dir > 0 ? 'ascending' : 'descending') : 'none',
        html: esc(c[1]) + '<i>' + (on ? (st.sort.dir > 0 ? '↑' : '↓') : '') + '</i>', onclick: function () { if (st.sort.key === c[0]) st.sort.dir *= -1; else st.sort = { key: c[0], dir: 1 }; self.renderList(); } }));
    });
    head.appendChild(h('span', { class: 'rvs-td rvs-c-act' }));
    E.table.appendChild(head);
    if (!all.length) E.table.appendChild(h('div', { class: 'rvs-noresults', text: this.t('no_results') }));
    all.slice(0, st.limit).forEach(function (u) {
      var key = u.building + '/' + u.code, inCmp = st.compare.indexOf(key) >= 0;
      var row = h('div', { class: 'rvs-tr' + (st.unit === key ? ' is-active' : ''), role: 'row', tabindex: '0',
        onclick: function (e) { if (e.target.closest('.rvs-cmp-toggle')) return; self.openPanel(key); },
        onkeydown: function (e) { if (e.key === 'Enter') self.openPanel(key); },
        onmouseenter: function () { self.highlight(['u:' + key]); }, onmouseleave: function () { self.highlight([]); } });
      cols.forEach(function (c) {
        var v, k = c[0];
        if (k === 'code') v = '<strong>' + esc(u.code) + '</strong>';
        else if (k === 'building') v = esc((self.data.byBuilding[u.building] || {}).name || u.building);
        else if (k === 'floor') v = esc(self.floorName(self.data.byBuilding[u.building], u.floor));
        else if (k === 'bedrooms') v = esc(u.bedrooms ? String(u.bedrooms) : self.t('studio'));
        else if (k === 'area') v = esc(self.m2(u.area));
        else if (k === 'orientation') v = esc(self.word(u.orientation) || '-');
        else if (k === 'price') v = esc(self.price(u) || '-');
        else if (k === 'status') v = '<span class="rvs-st rvs-st-' + u.status + '">' + esc(self.t(u.status)) + '</span>';
        row.appendChild(h('span', { class: 'rvs-td rvs-c-' + k, role: 'cell', 'data-label': c[1], html: v }));
      });
      row.appendChild(h('span', { class: 'rvs-td rvs-c-act', role: 'cell' }, [
        h('button', { type: 'button', class: 'rvs-cmp-toggle' + (inCmp ? ' is-on' : ''), title: self.t(inCmp ? 'in_compare' : 'add_compare'), 'aria-label': self.t(inCmp ? 'in_compare' : 'add_compare'), 'aria-pressed': inCmp ? 'true' : 'false', html: inCmp ? ICON.check : ICON.plus, onclick: function () { self.toggleCompare(key); } }),
        h('span', { class: 'rvs-go', html: ICON.chevR }),
      ]));
      E.table.appendChild(row);
    });
    E.more.style.display = all.length > st.limit ? '' : 'none';
    E.more.textContent = this.t('more') + ' (' + (all.length - st.limit) + ')';
  };

  // ---------- detail panel ----------
  P.openPanel = function (key, fromHash) {
    var self = this, E = this.el, st = this.state, u = this.data.unitMap[key];
    if (!u) return;
    var b = this.data.byBuilding[u.building];
    st.unit = key;
    // bring the stage to the unit's building, and to a view where it is visible
    if (b && st.b !== b.id && b.views.length) { st.b = b.id; st.level = 'building'; st.view = 0; this.renderAll(); }
    else if (b && st.b !== b.id && b.floors.length) { st.b = b.id; this.enter(b.id, u.code); this.renderAll(); }
    if (st.level === 'building') {
      var v = b.views[st.view];
      var visible = v && v.shapes.some(function (x) { return x.unit === u.code; });
      if (!visible) {
        var idx = -1;
        b.views.forEach(function (x, i) { if (idx < 0 && x.shapes.some(function (y) { return y.unit === u.code; })) idx = i; });
        if (idx >= 0) { st.view = idx; this.renderView(); }
      }
    }
    if (st.level === 'floor' && st.floor !== u.floor) { if (this.currentFloorFor(u)) { st.floor = u.floor; } else { st.level = 'building'; } this.renderAll(); }
    this.paint();
    Array.prototype.forEach.call(E.table.querySelectorAll('.rvs-tr.is-active'), function (r) { r.classList.remove('is-active'); });

    var list = this.filtered();
    var idx2 = list.indexOf(u);
    var prevU = idx2 > 0 ? list[idx2 - 1] : null, nextU = idx2 >= 0 && idx2 < list.length - 1 ? list[idx2 + 1] : null;
    var setts = this.data.settings, inCmp = st.compare.indexOf(key) >= 0, pr = this.price(u);
    var floorObj = b && b.floors.filter(function (f) { return Number(f.level) === u.floor; })[0];
    var floorShape = floorObj && floorObj.shapes.filter(function (x) { return x.unit === u.code; })[0];

    // headline facts, then the smaller ones
    var facts = [[this.t('area_short'), this.m2(u.area)]];
    if (u.outdoor && u.outdoor.area) facts.push([this.t(u.outdoor.kind), this.m2(u.outdoor.area)]);
    facts.push([this.t('floor'), this.floorName(b, u.floor)], [this.t('bedrooms'), String(u.bedrooms || '-')]);
    var more = [];
    if (u.area_net) more.push([this.t('area_net'), this.m2(u.area_net)]);
    if (u.orientation) more.push([this.t('orientation'), this.word(u.orientation)]);
    if (pr) more.push([this.t('price'), pr]);
    (u.extra || []).forEach(function (x) { if (x && x.label && x.value) more.push([self.L(x, 'label'), self.L(x, 'value')]); });

    E.panel.innerHTML = '';
    var titleId = 'rvs-p-title-' + Math.random().toString(36).slice(2, 7);
    var head = h('div', { class: 'rvs-p-head' }, [
      h('div', { class: 'rvs-p-where', text: [b ? b.name : '', this.floorName(b, u.floor)].filter(Boolean).join(' · ') }),
      h('div', { class: 'rvs-p-nav' }, [
        h('button', { type: 'button', class: 'rvs-iconbtn', 'aria-label': this.t('prev_unit'), title: prevU ? prevU.code : '', html: ICON.chev, disabled: prevU ? null : 'disabled', onclick: function () { if (prevU) self.openPanel(prevU.building + '/' + prevU.code); } }),
        h('button', { type: 'button', class: 'rvs-iconbtn', 'aria-label': this.t('next_unit'), title: nextU ? nextU.code : '', html: ICON.chevR, disabled: nextU ? null : 'disabled', onclick: function () { if (nextU) self.openPanel(nextU.building + '/' + nextU.code); } }),
        h('button', { type: 'button', class: 'rvs-iconbtn rvs-p-close', 'aria-label': this.t('close'), html: ICON.close, onclick: function () { self.closePanel(); } }),
      ]),
    ]);
    E.panel.setAttribute('aria-labelledby', titleId);

    // ---- media: 2D plan, 3D plan, position on the floor ----
    var plan2d = u.plan_view || u.plan;
    var tabs = [];
    if (plan2d) tabs.push(['plan', this.t('plan')]);
    if (u.plan3d) tabs.push(['3d', this.t('tab_3d')]);
    if (floorObj && floorShape) tabs.push(['floor', this.t('tab_floor')]);
    var media = h('section', { class: 'rvs-sheet-media', 'aria-label': this.t('media') });
    if (tabs.length) {
      var cur = tabs.some(function (x) { return x[0] === self._tab; }) ? this._tab : tabs[0][0];
      var frame = h('div', { class: 'rvs-media-frame' });
      var tabBar = h('div', { class: 'rvs-tabs', role: 'tablist', 'aria-label': this.t('media') });
      var show = function (k) {
        self._tab = cur = k;
        Array.prototype.forEach.call(tabBar.children, function (t) { var on = t.getAttribute('data-tab') === k; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; });
        frame.innerHTML = '';
        frame.setAttribute('data-tab', k);
        var pane;
        if (k === 'floor') {
          var fw = floorObj.w || 1000, fh = floorObj.h || 600;
          pane = h('button', { type: 'button', class: 'rvs-media-floor', title: self.t('view_floor'), style: 'aspect-ratio:' + fw + '/' + fh, onclick: function () { self.closePanel(true); self.go('floor', u.building, u.floor); } });
          pane.appendChild(h('img', { src: floorObj.image, alt: self.t('position') + ' ' + u.code }));
          var ms = s('svg', { viewBox: '0 0 ' + fw + ' ' + fh, preserveAspectRatio: 'none', 'aria-hidden': 'true' });
          (floorShape.polys || [floorShape.pts]).forEach(function (pts) { ms.appendChild(s('polygon', { points: pts.map(function (p) { return (p[0] * fw).toFixed(1) + ',' + (p[1] * fh).toFixed(1); }).join(' ') })); });
          pane.appendChild(ms);
        } else {
          var src = k === '3d' ? u.plan3d : plan2d;
          pane = h('img', { src: src, alt: (k === '3d' ? self.t('tab_3d') : self.t('plan')) + ' ' + u.code, class: 'rvs-media-img is-' + k, onclick: function () { self.openLightbox(src, u.code); } });
        }
        frame.appendChild(pane);
        if (k === '3d') frame.appendChild(h('span', { class: 'rvs-ill', text: self.t('illustration') }));
        if (k !== 'floor') frame.appendChild(h('button', { type: 'button', class: 'rvs-chip rvs-plan-zoom', html: ICON.zoom + '<span>' + esc(self.t('zoom')) + '</span>', onclick: function () { self.openLightbox(k === '3d' ? u.plan3d : plan2d, u.code); } }));
      };
      tabs.forEach(function (tb, i) {
        tabBar.appendChild(h('button', { type: 'button', role: 'tab', class: 'rvs-tab', 'data-tab': tb[0], text: tb[1], onclick: function () { show(tb[0]); },
          onkeydown: function (e) { var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; e.preventDefault(); var nx = tabs[(i + d + tabs.length) % tabs.length][0]; show(nx); tabBar.querySelector('[data-tab="' + nx + '"]').focus(); } }));
      });
      if (tabs.length > 1) media.appendChild(tabBar);
      media.appendChild(frame);
      show(cur);
    }

    // ---- information ----
    var intro = h('div', { class: 'rvs-p-intro' }, [
      u.type_label ? h('div', { class: 'rvs-p-type', text: this.L(u, 'type_label') }) : null,
      h('h2', { class: 'rvs-p-code', id: titleId, text: u.code }),
      h('div', { class: 'rvs-p-sub', text: this.beds(u.bedrooms) }),
      h('div', { class: 'rvs-st rvs-st-' + u.status, text: this.t(u.status) }),
    ]);
    var grid = h('dl', { class: 'rvs-facts' });
    facts.forEach(function (x) { grid.appendChild(h('div', { class: 'rvs-fact' }, [h('dt', { text: x[0] }), h('dd', { text: x[1] })])); });
    var moreList = null;
    if (more.length) {
      moreList = h('dl', { class: 'rvs-more' });
      more.forEach(function (x) { moreList.appendChild(h('div', {}, [h('dt', { text: x[0] }), h('dd', { text: x[1] })])); });
    }
    var actions = h('div', { class: 'rvs-actions' });
    if (setts.enquiry !== false && u.status !== 'sold') actions.appendChild(h('button', { type: 'button', class: 'rvs-btn rvs-btn-primary', html: ICON.mail + '<span>' + esc(this.t('send_enquiry')) + '</span>', onclick: function () { var f = E.panel.querySelector('.rvs-form'); if (f) { f.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }); setTimeout(function () { var i = f.querySelector('input'); if (i) i.focus({ preventScroll: true }); }, 450); } } }));
    if (setts.phone) actions.appendChild(h('a', { class: 'rvs-btn' + (setts.enquiry === false ? ' rvs-btn-primary' : ''), href: 'tel:' + String(setts.phone).replace(/[^\d+]/g, ''), html: ICON.phone + '<span>' + esc(this.t('call_sales')) + '</span>' }));
    if (u.pdf) actions.appendChild(h('a', { class: 'rvs-btn', href: u.pdf, target: '_blank', rel: 'noopener', download: '', html: ICON.dl + '<span>' + esc(this.t('download_pdf')) + '</span>' }));
    actions.appendChild(h('button', { type: 'button', class: 'rvs-btn' + (inCmp ? ' is-on' : ''), 'aria-pressed': inCmp ? 'true' : 'false', html: (inCmp ? ICON.check : ICON.plus) + '<span>' + esc(this.t(inCmp ? 'in_compare' : 'add_compare')) + '</span>', onclick: function () { self.toggleCompare(key); self.openPanel(key, true); } }));

    var info = h('section', { class: 'rvs-sheet-info' }, [intro, grid, moreList, actions]);
    if (u.rooms.length) {
      var rl = h('div', { class: 'rvs-rooms' }, [h('div', { class: 'rvs-eyebrow', text: this.t('rooms') })]);
      var sum = 0;
      u.rooms.forEach(function (r, i) {
        sum += Number(r.a) || 0;
        rl.appendChild(h('div', { class: 'rvs-room' }, [h('span', { class: 'rvs-room-n', text: String(i + 1).padStart(2, '0') }), h('span', { class: 'rvs-room-name', text: self.word(self.L(r, 'n')) }), h('span', { class: 'rvs-room-a', text: self.m2(Number(r.a)) })]));
      });
      rl.appendChild(h('div', { class: 'rvs-room rvs-room-total' }, [h('span', { class: 'rvs-room-n' }), h('span', { class: 'rvs-room-name', text: this.t('total') }), h('span', { class: 'rvs-room-a', text: this.m2(sum) })]));
      info.appendChild(rl);
    }
    if (u.description) info.appendChild(h('div', { class: 'rvs-desc', html: u.description }));
    if (setts.enquiry !== false && u.status !== 'sold') info.appendChild(this.form(u, b));
    info.appendChild(h('p', { class: 'rvs-p-note', text: this.t('note_area') }));

    E.panel.appendChild(head);
    E.panel.appendChild(h('div', { class: 'rvs-sheet' }, [media, info]));
    E.panel.classList.remove('is-in');
    void E.panel.offsetWidth; // restart the entrance animation when moving between apartments
    E.panel.classList.add('is-in');
    E.panel.classList.add('is-open');
    E.panel.setAttribute('aria-hidden', 'false');
    E.scrim.classList.add('is-on');
    document.documentElement.classList.add('rvs-lock');
    E.panel.scrollTop = 0;
    if (!fromHash) { this.syncHash(); setTimeout(function () { var c = E.panel.querySelector('.rvs-p-close'); if (c) c.focus({ preventScroll: true }); }, 50); }
    this._lastFocus = this._lastFocus || document.activeElement;
    this.renderList();
  };
  P.closePanel = function (silent) {
    var E = this.el;
    if (!this.state.unit) return;
    this.state.unit = null;
    E.panel.classList.remove('is-open');
    E.panel.setAttribute('aria-hidden', 'true');
    if (!E.cmp.classList.contains('is-open')) { E.scrim.classList.remove('is-on'); document.documentElement.classList.remove('rvs-lock'); }
    this.paint();
    this.renderList();
    if (!silent) this.syncHash();
    if (this._lastFocus && this._lastFocus.focus) { try { this._lastFocus.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
    this._lastFocus = null;
  };

  P.form = function (u, b) {
    var self = this, t = this.t.bind(this);
    var status = h('div', { class: 'rvs-form-status', role: 'status', 'aria-live': 'polite' });
    var f = h('form', { class: 'rvs-form', novalidate: true });
    var field = function (name, label, type, extra) {
      var id = 'rvs-f-' + name + '-' + Math.random().toString(36).slice(2, 6);
      var input = type === 'textarea' ? h('textarea', Object.assign({ id: id, name: name, rows: '3' }, extra || {})) : h('input', Object.assign({ id: id, name: name, type: type }, extra || {}));
      return h('div', { class: 'rvs-field' }, [h('label', { for: id, text: label }), input]);
    };
    f.appendChild(h('div', { class: 'rvs-form-title', text: t('form_title') }));
    f.appendChild(h('div', { class: 'rvs-form-grid' }, [
      field('name', t('form_name'), 'text', { autocomplete: 'name', required: true }),
      field('phone', t('form_phone'), 'tel', { autocomplete: 'tel' }),
      field('email', t('form_email'), 'email', { autocomplete: 'email' }),
    ]));
    var msg = field('message', t('form_msg'), 'textarea');
    msg.querySelector('textarea').value = t('form_msg_default', { code: u.code, building: b ? b.name : '' });
    f.appendChild(msg);
    f.appendChild(h('input', { type: 'text', name: 'website', class: 'rvs-hp', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' }));
    var cid = 'rvs-f-c-' + Math.random().toString(36).slice(2, 6);
    f.appendChild(h('div', { class: 'rvs-consent' }, [h('input', { type: 'checkbox', id: cid, name: 'consent' }), h('label', { for: cid, text: t('form_consent') })]));
    var btn = h('button', { type: 'submit', class: 'rvs-btn rvs-btn-primary', text: t('form_send') });
    f.appendChild(btn);
    f.appendChild(status);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = {}; Array.prototype.forEach.call(f.elements, function (el) { if (el.name) fd[el.name] = el.type === 'checkbox' ? el.checked : el.value.trim(); });
      status.className = 'rvs-form-status';
      if (!fd.name || !(fd.email || fd.phone) || !fd.consent || (fd.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fd.email))) { status.textContent = t('form_required'); status.classList.add('is-err'); return; }
      fd.unit = u.code; fd.building = u.building; fd.lang = self.state.lang; fd.page = location.href;
      btn.disabled = true; btn.textContent = t('form_sending');
      var done = function (ok) {
        btn.disabled = false; btn.textContent = t('form_send');
        status.textContent = t(ok ? 'form_ok' : 'form_err'); status.classList.add(ok ? 'is-ok' : 'is-err');
        if (ok) { f.reset(); msg.querySelector('textarea').value = t('form_msg_default', { code: u.code, building: b ? b.name : '' }); }
        if (ok && typeof window.CustomEvent === 'function') self.root.dispatchEvent(new CustomEvent('rvs:lead', { bubbles: true, detail: { unit: u.code, building: u.building } }));
      };
      var rest = self.boot.rest;
      if (!rest || !rest.lead) { setTimeout(function () { done(true); }, 700); return; }
      fetch(rest.lead, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fd) })
        .then(function (r) { done(r.ok); }).catch(function () { done(false); });
    });
    return f;
  };

  // ---------- compare ----------
  P.toggleCompare = function (key) {
    var c = this.state.compare, i = c.indexOf(key);
    if (i >= 0) c.splice(i, 1);
    else { if (c.length >= MAX_COMPARE) { this.toast(this.t('compare_max', { n: MAX_COMPARE })); return; } c.push(key); }
    try { localStorage.setItem('rvs-compare', JSON.stringify(c)); } catch (e) { /* storage unavailable */ }
    this.renderBar(); this.renderList(); this.renderCompareBar();
    if (this.el.cmp.classList.contains('is-open')) { if (c.length) this.openCompare(); else this.closeCompare(); }
  };
  P.toast = function (msg) {
    var el = h('div', { class: 'rvs-toast', role: 'status', text: msg });
    this.el.portal.appendChild(el);
    setTimeout(function () { el.classList.add('is-on'); }, 10);
    setTimeout(function () { el.classList.remove('is-on'); setTimeout(function () { el.remove(); }, 400); }, 2600);
  };
  P.renderCompareBar = function () {
    var self = this, E = this.el, c = this.state.compare.filter(function (k) { return self.data.unitMap[k]; });
    this.state.compare = c;
    E.cmpBar.innerHTML = '';
    E.cmpBar.classList.toggle('is-on', c.length > 0);
    if (!c.length) return;
    var chips = h('div', { class: 'rvs-cmpbar-items' });
    c.forEach(function (k) { chips.appendChild(h('button', { type: 'button', class: 'rvs-cmpbar-chip', title: self.t('remove'), html: esc(self.data.unitMap[k].code) + ICON.close, onclick: function () { self.toggleCompare(k); } })); });
    E.cmpBar.appendChild(chips);
    E.cmpBar.appendChild(h('button', { type: 'button', class: 'rvs-btn rvs-btn-primary', text: this.t('compare_go') + ' (' + c.length + ')', onclick: function () { self.openCompare(); } }));
  };
  P.openCompare = function () {
    var self = this, E = this.el, keys = this.state.compare;
    if (!keys.length) { this.toast(this.t('add_compare')); return; }
    var units = keys.map(function (k) { return self.data.unitMap[k]; }).filter(Boolean);
    E.cmp.innerHTML = '';
    var rows = [
      ['', function (u) { return u.plan ? '<img src="' + esc(u.plan) + '" alt="">' : ''; }, 'rvs-cmp-plan'],
      [this.t('unit'), function (u) { return '<strong class="rvs-cmp-code">' + esc(u.code) + '</strong>'; }],
      [this.t('building'), function (u) { return esc((self.data.byBuilding[u.building] || {}).name || ''); }],
      [this.t('status'), function (u) { return '<span class="rvs-st rvs-st-' + u.status + '">' + esc(self.t(u.status)) + '</span>'; }],
      [this.t('floor'), function (u) { return esc(self.floorName(self.data.byBuilding[u.building], u.floor)); }],
      [this.t('bedrooms'), function (u) { return esc(self.beds(u.bedrooms)); }],
      [this.t('area'), function (u) { return esc(self.m2(u.area)); }],
      [this.t('area_net'), function (u) { return esc(self.m2(u.area_net)); }],
      [this.t('orientation'), function (u) { return esc(self.word(u.orientation) || '-'); }],
    ];
    if (this.data.settings.show_price) rows.push([this.t('price'), function (u) { return esc(self.price(u) || '-'); }]);
    var table = h('div', { class: 'rvs-cmp-table', style: '--cols:' + units.length });
    rows.forEach(function (r) {
      table.appendChild(h('div', { class: 'rvs-cmp-l ' + (r[2] || ''), text: r[0] }));
      units.forEach(function (u) { table.appendChild(h('div', { class: 'rvs-cmp-v ' + (r[2] || ''), html: r[1](u) })); });
    });
    table.appendChild(h('div', { class: 'rvs-cmp-l' }));
    units.forEach(function (u) {
      var k = u.building + '/' + u.code;
      table.appendChild(h('div', { class: 'rvs-cmp-v rvs-cmp-act' }, [
        h('button', { type: 'button', class: 'rvs-btn rvs-btn-primary', text: u.code, html: esc(u.code) + ICON.chevR, onclick: function () { self.closeCompare(); self.openPanel(k); } }),
        h('button', { type: 'button', class: 'rvs-btn rvs-btn-ghost', text: self.t('remove'), onclick: function () { self.toggleCompare(k); } }),
      ]));
    });
    E.cmp.appendChild(h('div', { class: 'rvs-cmp-head' }, [
      h('h2', { text: this.t('compare_title') }),
      h('div', { class: 'rvs-cmp-head-r' }, [
        h('button', { type: 'button', class: 'rvs-btn rvs-btn-ghost', text: this.t('clear'), onclick: function () { self.state.compare = []; try { localStorage.setItem('rvs-compare', '[]'); } catch (e) { /* noop */ } self.closeCompare(); self.renderBar(); self.renderList(); self.renderCompareBar(); } }),
        h('button', { type: 'button', class: 'rvs-iconbtn', 'aria-label': this.t('close'), html: ICON.close, onclick: function () { self.closeCompare(); } }),
      ]),
    ]));
    E.cmp.appendChild(h('div', { class: 'rvs-cmp-scroll' }, [table]));
    E.cmp.classList.add('is-open'); E.cmp.setAttribute('aria-hidden', 'false');
    E.scrim.classList.add('is-on'); document.documentElement.classList.add('rvs-lock');
  };
  P.closeCompare = function () {
    var E = this.el;
    if (!E.cmp.classList.contains('is-open')) return;
    E.cmp.classList.remove('is-open'); E.cmp.setAttribute('aria-hidden', 'true');
    if (!this.state.unit) { E.scrim.classList.remove('is-on'); document.documentElement.classList.remove('rvs-lock'); }
  };

  // ---------- lightbox ----------
  P.openLightbox = function (src, title) {
    var E = this.el;
    E.lightbox.innerHTML = '';
    var img = h('img', { src: src, alt: title || '' });
    var wrap = h('div', { class: 'rvs-lb-img' }, [img]);
    var zoomed = false;
    wrap.addEventListener('click', function (e) {
      zoomed = !zoomed; wrap.classList.toggle('is-zoom', zoomed);
      if (zoomed) { var r = wrap.getBoundingClientRect(); wrap.scrollLeft = ((e.clientX - r.left) / r.width) * (wrap.scrollWidth - r.width); wrap.scrollTop = ((e.clientY - r.top) / r.height) * (wrap.scrollHeight - r.height); }
    });
    E.lightbox.appendChild(h('div', { class: 'rvs-lb-bar' }, [h('span', { text: title || '' }), h('button', { type: 'button', class: 'rvs-iconbtn rvs-lb-close', 'aria-label': this.t('close'), html: ICON.close })]));
    E.lightbox.appendChild(wrap);
    E.lightbox.classList.add('is-open'); E.lightbox.setAttribute('aria-hidden', 'false');
  };
  P.closeLightbox = function () { this.el.lightbox.classList.remove('is-open'); this.el.lightbox.setAttribute('aria-hidden', 'true'); };

  // ---------- boot ----------
  function mount(el, boot) {
    if (!el || el.__rvs) return el && el.__rvs;
    if (!boot) {
      var id = el.getAttribute('data-rvs');
      boot = (window.RVS_BOOT && window.RVS_BOOT[id]) || null;
      if (!boot) { var js = el.querySelector('script[type="application/json"]'); if (js) try { boot = JSON.parse(js.textContent); } catch (e) { boot = null; } }
    }
    if (!boot) return null;
    el.__rvs = new Selector(el, boot);
    return el.__rvs;
  }
  function auto() { Array.prototype.forEach.call(document.querySelectorAll('[data-rvs]'), function (el) { mount(el); }); }
  window.RiverinaSelector = { mount: mount, i18n: I18N };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
  // Elementor editor / frontend re-render support
  if (window.jQuery) window.jQuery(window).on('elementor/frontend/init', function () {
    if (window.elementorFrontend && window.elementorFrontend.hooks) window.elementorFrontend.hooks.addAction('frontend/element_ready/riverina_selector.default', function ($s) { var el = $s[0].querySelector('[data-rvs]'); if (el) mount(el); });
  });
})();
