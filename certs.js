/* ════════════════════════════════════════════════════════
   certs.js — zoiket00 · Verified Expertise system
   ════════════════════════════════════════════════════════

   Para agregar un certificado:
   1. Copia el bloque de ejemplo de abajo
   2. Rellena los campos
   3. Haz git push — la página se actualiza sola

   Categorías disponibles:
   backend | frontend | fullstack | cloud |
   devops  | ai       | mobile    | database | security
   ════════════════════════════════════════════════════════ */

const CERTS = [

  {
    name:       "Universidad Desarrollo Web — FrontEnd Web Developer",
    issuer:     "Udemy",
    date:       "Oct 2025",
    category:   "frontend",
    skills:     ["HTML5", "CSS3", "JavaScript", "Flexbox", "DOM API", "POO", "Bootstrap", "ES6+"],
    url:        "https://ude.my/UC-8202ca42-6da2-4133-89d4-335eaa10ff48",
    credential: "UC-8202ca42-6da2-4133-89d4-335eaa10ff48"
  },

  // ─── AGREGA MÁS CERTIFICADOS AQUÍ ──────────────────────
  //
  // {
  //   name:       "Nombre completo del certificado",
  //   issuer:     "SENA / Google / AWS / Platzi / Coursera…",
  //   date:       "Jun 2025",
  //   category:   "backend",
  //   skills:     ["Node.js", "Express", "PostgreSQL", "REST API"],
  //   url:        "https://enlace-al-certificado.com",
  //   credential: "ID-OPCIONAL-001"
  // },
  //
  // ───────────────────────────────────────────────────────

];

/* ── Config visual por categoría ── */
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

/* ── DOM ── */
const grid    = document.getElementById('certsGrid');
const empty   = document.getElementById('certEmpty');
const filters = document.querySelectorAll('.filter-btn');

/* ── Build card ── */
function buildCard(cert, index) {
  const cat  = CATS[cert.category] || { label: 'OTHER', color: 'rgba(255,255,255,.45)' };
  const num  = String(index + 1).padStart(3, '0');

  const skillsHtml = (cert.skills && cert.skills.length)
    ? `<div class="cert-skills-section">
         <p class="cert-skills-label">SKILLS UNLOCKED</p>
         <div class="cert-skills">
           ${cert.skills.map(s => `<span class="cert-skill">${s}</span>`).join('')}
         </div>
       </div>
       <hr class="cert-divider">`
    : '';

  const credHtml = cert.credential
    ? `<span class="cert-credential">ID · ${cert.credential}</span>`
    : '';

  const linkHtml = cert.url
    ? `<a href="${cert.url}" target="_blank" rel="noopener" class="cert-link">VIEW CREDENTIAL ↗</a>`
    : `<span class="cert-link-soon">// LINK PENDING</span>`;

  const card = document.createElement('article');
  card.className   = 'cert-card reveal';
  card.dataset.cat = cert.category;
  card.style.transitionDelay = (index * 55) + 'ms';

  card.innerHTML = `
    <div class="cert-inner">
      <div class="cert-header">
        <span class="cert-num">CREDENTIAL #${num}</span>
        <span class="cert-verified"><i class="dot-live"></i> VERIFIED</span>
      </div>

      <div class="cert-meta">
        <span class="cert-issuer">${cert.issuer}</span>
        <span class="cert-badge">${cat.label}</span>
      </div>

      <p class="cert-name">${cert.name}</p>

      <hr class="cert-divider">

      ${skillsHtml}

      <div class="cert-foot">
        <span class="cert-date">${cert.date}</span>
        ${credHtml}
      </div>

      ${linkHtml}
    </div>
  `;

  return card;
}

/* ── Render ── */
function render(filter) {
  const list = filter === 'all'
    ? CERTS
    : CERTS.filter(c => c.category === filter);

  grid.innerHTML = '';

  if (list.length === 0) {
    grid.style.display = 'none';
    empty.classList.add('visible');
    return;
  }

  empty.classList.remove('visible');
  grid.style.display = 'grid';

  list.forEach((cert, i) => grid.appendChild(buildCard(cert, i)));

  requestAnimationFrame(() => {
    grid.querySelectorAll('.cert-card').forEach(el => el.classList.add('in'));
  });
}

/* ── Filters ── */
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    render(btn.dataset.filter);
  });
});

/* ── Init ── */
render('all');
