/* Service Worker — zoiket00 portfolio (PWA + cache offline) */
const CACHE = 'zk-2026-1';
const PRECACHE = [
  './', './index.html', './styles.css', './main.js', './bg.js',
  './favicon.svg', './manifest.webmanifest', './assets/profile.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Datos en vivo: nunca cachear (GitHub API y gráfico de contribuciones)
  if (url.hostname.includes('api.github.com') || url.hostname.includes('ghchart')) return;
  // Network-first para navegación → el HTML siempre fresco
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  // Cache-first para el resto (assets locales y CDN)
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    } catch (err) {
      return cached || Response.error();
    }
  })());
});
