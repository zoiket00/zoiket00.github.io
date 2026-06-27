/* ════════════════════════════════════════════════════════
   lang.js — zoiket00 · Módulo de idioma compartido
   Funciona en TODAS las páginas (index + certificates + futuras)
   ════════════════════════════════════════════════════════ */
(function () {
  const KEY = 'zk-lang';

  /* Aplica el idioma a TODOS los [data-es] del DOM en ese momento */
  function applyLang(lang) {
    document.querySelectorAll('[data-es]').forEach(el => {
      /* Guardar el HTML original la primera vez */
      if (!el.dataset.en) el.dataset.en = el.innerHTML;
      /* Aplicar: español → textContent (texto puro), inglés → innerHTML (restaura markup) */
      el[lang === 'es' ? 'textContent' : 'innerHTML'] =
        lang === 'es' ? el.dataset.es : el.dataset.en;
    });

    /* Actualizar indicador del botón toggle */
    const enS = document.querySelector('.lang-en');
    const esS = document.querySelector('.lang-es');
    if (enS) enS.classList.toggle('is-active', lang === 'en');
    if (esS) esS.classList.toggle('is-active', lang === 'es');

    document.documentElement.lang = lang;
    document.body.dataset.lang    = lang;
    try { localStorage.setItem(KEY, lang); } catch (_) {}
  }

  function getLang() {
    return document.documentElement.lang === 'es' ? 'es' : 'en';
  }

  /* ── API global ── */
  window.__setLang          = applyLang;
  window.__getLang          = getLang;
  /* Para re-aplicar el idioma actual tras renderizar contenido dinámico */
  window.__applyCurrentLang = () => applyLang(getLang());

  function init() {
    /* Botón toggle (presente en ambas páginas) */
    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.addEventListener('click', () =>
        applyLang(getLang() === 'es' ? 'en' : 'es')
      );
    }

    /* Aplicar el idioma guardado al cargar la página */
    let saved = 'en';
    try { saved = localStorage.getItem(KEY) || 'en'; } catch (_) {}
    applyLang(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
