/* ════════════════════════════════════════════════════════
   certs.js — zoiket00 · Credentials data + filter UI
   ════════════════════════════════════════════════════════
   Para agregar un certificado, copia el bloque de ejemplo
   y rellena los campos. La página se actualiza sola.
   ════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────
//  DATOS — agrega tus certificados aquí
// ─────────────────────────────────────────────────────────
const CERTS = [

  // ── Ejemplo (borra este bloque cuando tengas los reales):
  // {
  //   name:       "Nombre del certificado",
  //   issuer:     "SENA / Platzi / Coursera / etc.",
  //   date:       "Jun 2025",
  //   category:   "backend",   // backend | frontend | fullstack | devops | mobile | ai | other
  //   url:        "https://...",  // enlace al certificado (o "" si no hay)
  //   credential: "ID-001"     // ID de credencial (opcional, pon "" si no tienes)
  // },

];

// ─────────────────────────────────────────────────────────
//  CONFIG DE CATEGORÍAS
// ─────────────────────────────────────────────────────────
const CATS = {
  backend:   { label: 'BACKEND',    color: '#21e6ff' },
  frontend:  { label: 'FRONTEND',   color: '#a98bff' },
  fullstack: { label: 'FULL STACK', color: '#00ff6a' },
  devops:    { label: 'DEVOPS',     color: '#ff9f43' },
  mobile:    { label: 'MOBILE',     color: '#ff6b9d' },
  ai:        { label: 'AI / ML',    color: '#a98bff' },
  other:     { label: 'OTHER',      color: 'rgba(255,255,255,.45)' },
};

// ─────────────────────────────────────────────────────────
//  RENDER
// ─────────────────────────────────────────────────────────
const grid    = document.getElementById('certsGrid');
const empty   = document.getElementById('certEmpty');
const filters = document.querySelectorAll('.filter-btn');

function buildCard(cert, delay) {
  const cat   = CATS[cert.category] || CATS.other;
  const card  = document.createElement('article');
  card.className      = 'cert-card reveal';
  card.dataset.cat    = cert.category;
  card.style.transitionDelay = delay + 'ms';

  const linkHtml = cert.url
    ? `<a href="${cert.url}" target="_blank" rel="noopener" class="cert-link">VER CERTIFICADO ↗</a>`
    : `<span class="cert-link-soon">SIN ENLACE AÚN</span>`;

  const credHtml = cert.credential
    ? `<span class="cert-credential">ID · ${cert.credential}</span>`
    : '';

  card.innerHTML = `
    <div class="cert-top">
      <span class="cert-badge" style="color:${cat.color};border-color:${cat.color}">${cat.label}</span>
      <span class="cert-issuer">${cert.issuer}</span>
    </div>
    <p class="cert-name">${cert.name}</p>
    <hr class="cert-divider">
    <div class="cert-foot">
      <span class="cert-date">${cert.date}</span>
      ${credHtml}
    </div>
    ${linkHtml}
  `;
  return card;
}

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

  list.forEach((cert, i) => {
    grid.appendChild(buildCard(cert, i * 50));
  });

  // Trigger reveal
  requestAnimationFrame(() => {
    grid.querySelectorAll('.cert-card').forEach(el => el.classList.add('in'));
  });
}

// ─────────────────────────────────────────────────────────
//  FILTROS
// ─────────────────────────────────────────────────────────
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    render(btn.dataset.filter);
  });
});

// ─────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────
render('all');
