/* ════════════════════════════════════════════════════════
   certs.js — zoiket00 · Verified Expertise system
   ════════════════════════════════════════════════════════

   Campos disponibles por certificado:
   - name       : Título completo del certificado (obligatorio)
   - issuer     : Entidad que lo emite (obligatorio)
   - date       : "Oct 2025" (obligatorio)
   - hours      : "30.5" — horas del curso (opcional)
   - category   : backend | frontend | fullstack | cloud |
                  devops | ai | mobile | database | security
   - skills     : ["HTML5", "CSS3", ...] (recomendado, máx 10)
   - image      : "assets/certs/nombre.jpg" (opcional)
   - url        : enlace al certificado (opcional)
   - credential : ID de credencial (opcional)
   ════════════════════════════════════════════════════════ */

const CERTS = [

  {
    name:       "Universidad Desarrollo Web — FrontEnd Web Developer",
    issuer:     "Udemy",
    date:       "Oct 2025",
    hours:      "30.5",
    category:   "frontend",
    skills:     ["HTML5", "CSS3", "JavaScript", "Flexbox", "DOM API", "POO", "Bootstrap", "ES6+"],
    image:      "",
    url:        "https://ude.my/UC-8202ca42-6da2-4133-89d4-335eaa10ff48",
    credential: "UC-8202ca42-6da2-4133-89d4-335eaa10ff48"
  },

  // ─── AGREGA MÁS CERTIFICADOS AQUÍ ──────────────────────

];

/* ── Categorías ── */
const CATS = {
  backend:   { label: 'BACKEND',    color: '#21e6ff' },
  frontend:  { label: 'FRONTEND',   color: '#a98bff' },
  fullstack: { label: 'FULL STACK', color: '#00ff6a' },
  cloud:     { label: 'CLOUD',      color: '#21e6ff' },
  devops:    { label: 'DEVOPS',     color: '#ff9f43' },
  ai:        { label: 'AI / ML',    color: '#a98bff' },
  mobile:    { label: 'MOBILE',     color: '#ff6b9d' },
  database:  { label: 'DATABASE',   color: '#4ecdc4' },
  security:  { label: 'SECURITY',   color: '#ff4757' },
};

/* ── Estado global ── */
let currentFilter = 'all';
let currentSort   = 'newest';
let currentView   = 'grid';

/* ── DOM ── */
const grid     = document.getElementById('certsGrid');
const empty    = document.getElementById('certEmpty');
const filters  = document.querySelectorAll('.filter-btn');
const sortBtn  = document.getElementById('sortBtn');
const sortDrop = document.getElementById('sortDropdown');
const sortOpts = document.querySelectorAll('.sort-opt');
const viewBtns = document.querySelectorAll('.view-btn');

/* ══════════════════ STATS ══════════════════ */
function renderStats() {
  const count  = CERTS.length;
  const hours  = CERTS.reduce((s, c) => s + (parseFloat(c.hours) || 0), 0);
  const skills = new Set(CERTS.flatMap(c => c.skills || [])).size;
  const years  = CERTS.map(c => parseInt(c.date.split(' ').pop())).filter(Boolean);
  const year   = years.length ? Math.max(...years) : '—';

  animateNum('statCount',  count,          0);
  animateNum('statHours',  hours,          1);
  animateNum('statSkills', skills,         0);
  document.getElementById('statYear').textContent = year;
}

function animateNum(id, target, decimals) {
  const el  = document.getElementById(id);
  const dur = 900;
  const fps = 60;
  const steps = Math.round(dur / (1000 / fps));
  let frame = 0;
  const tick = () => {
    frame++;
    const val = target * (frame / steps);
    el.textContent = val.toFixed(decimals) + (id === 'statHours' && target > 0 ? '+' : '');
    if (frame < steps) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals) + (id === 'statHours' && target > 0 ? '+' : '');
  };
  requestAnimationFrame(tick);
}

/* ══════════════════ BUILD CARD ══════════════════ */
function buildCard(cert, index) {
  const cat   = CATS[cert.category] || { label: 'OTHER', color: 'rgba(255,255,255,.4)' };
  const num   = String(index + 1).padStart(3, '0');
  const color = cat.color;

  /* image section */
  const imgHtml = cert.image
    ? `<div class="cert-img-wrap" role="button" tabindex="0"
          data-img="${cert.image}" data-url="${cert.url || ''}"
          aria-label="Expand certificate image">
         <img src="${cert.image}" alt="${cert.issuer} certificate" class="cert-img" loading="lazy">
         <div class="cert-img-overlay"><span>⤢ EXPAND</span></div>
       </div>`
    : `<div class="cert-img-placeholder" style="--ca:${color}">
         <span class="ph-issuer">${cert.issuer}</span>
         <span class="ph-num">#${num}</span>
       </div>`;

  /* skills */
  const skillsHtml = (cert.skills && cert.skills.length)
    ? `<div class="cert-skills-section">
         <p class="cert-skills-label" data-es="HABILIDADES">SKILLS</p>
         <div class="cert-skills">
           ${cert.skills.map(s => `<span class="cert-skill">${s}</span>`).join('')}
         </div>
       </div>`
    : '';

  /* footer */
  const hoursHtml = cert.hours
    ? `<span class="cert-meta-item"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="11" height="11"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg> ${cert.hours} hrs</span>`
    : '';

  const linkHtml = cert.url
    ? `<a href="${cert.url}" target="_blank" rel="noopener" class="cert-link" data-es="VER CREDENCIAL">VIEW CREDENTIAL ↗</a>`
    : '';

  const card = document.createElement('article');
  card.className   = 'cert-card reveal';
  card.dataset.cat = cert.category;
  card.style.setProperty('--ca', color);
  card.style.transitionDelay = (index * 60) + 'ms';

  card.innerHTML = `
    <div class="cert-inner">
      <div class="cert-header">
        <span class="cert-verified"><i class="dot-live"></i> VERIFIED</span>
        <span class="cert-num">#${num}</span>
      </div>

      <div class="cert-title-block">
        <h3 class="cert-name">${cert.name}</h3>
        <span class="cert-issuer-colored" style="color:${color}">${cert.issuer}</span>
      </div>

      ${imgHtml}

      ${skillsHtml}

      <div class="cert-footer">
        <div class="cert-meta-row">
          <span class="cert-meta-item">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="11" height="11"><rect x="1" y="2" width="14" height="13" rx="1.5"/><path d="M5 1v2M11 1v2M1 6h14"/></svg>
            ${cert.date}
          </span>
          ${hoursHtml}
        </div>
        ${linkHtml}
      </div>
    </div>
  `;

  /* lightbox trigger */
  const imgWrap = card.querySelector('.cert-img-wrap');
  if (imgWrap) {
    const open = () => openLightbox(cert.image, cert.url);
    imgWrap.addEventListener('click', open);
    imgWrap.addEventListener('keydown', e => e.key === 'Enter' && open());
  }

  return card;
}

/* ══════════════════ RENDER ══════════════════ */
function getList() {
  let list = currentFilter === 'all'
    ? [...CERTS]
    : CERTS.filter(c => c.category === currentFilter);

  if (currentSort === 'newest') {
    list.sort((a, b) => new Date('1 ' + b.date) - new Date('1 ' + a.date));
  } else if (currentSort === 'oldest') {
    list.sort((a, b) => new Date('1 ' + a.date) - new Date('1 ' + b.date));
  } else if (currentSort === 'az') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  return list;
}

function render() {
  const list = getList();
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.style.display = 'none';
    empty.classList.add('visible');
    return;
  }

  empty.classList.remove('visible');
  grid.style.display = 'grid';
  grid.dataset.view  = currentView;

  list.forEach((cert, i) => grid.appendChild(buildCard(cert, i)));

  requestAnimationFrame(() => {
    grid.querySelectorAll('.cert-card').forEach(el => el.classList.add('in'));
  });
}

/* ══════════════════ FILTERS ══════════════════ */
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    currentFilter = btn.dataset.filter;
    render();
  });
});

/* ══════════════════ SORT ══════════════════ */
sortBtn.addEventListener('click', () => {
  const open = sortDrop.classList.toggle('open');
  sortBtn.setAttribute('aria-expanded', open);
  sortDrop.setAttribute('aria-hidden', !open);
});

sortOpts.forEach(opt => {
  opt.addEventListener('click', () => {
    sortOpts.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    currentSort = opt.dataset.sort;
    sortBtn.querySelector('.sort-arrow').textContent = '↓';
    sortDrop.classList.remove('open');
    sortBtn.setAttribute('aria-expanded', 'false');
    render();
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.sort-wrap')) {
    sortDrop.classList.remove('open');
    sortBtn.setAttribute('aria-expanded', 'false');
  }
});

/* ══════════════════ VIEW TOGGLE ══════════════════ */
viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = btn.dataset.view;
    render();
  });
});

/* ══════════════════ LIGHTBOX ══════════════════ */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lightboxImg');
const lbLink    = document.getElementById('lightboxLink');
const lbClose   = document.getElementById('lightboxClose');
const lbBackdrop = document.getElementById('lightboxBackdrop');

function openLightbox(src, url) {
  lbImg.src = src;
  lbLink.href = url || '#';
  lbLink.style.display = url ? '' : 'none';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 300);
}

lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => e.key === 'Escape' && closeLightbox());

/* ══════════════════ INIT ══════════════════ */
renderStats();
render();
