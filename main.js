/* ════════════════════════════════════════════════════════════
   zoiket00 — Portfolio · interacciones world-class
   ════════════════════════════════════════════════════════════ */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ── 1 · SMOOTH SCROLL (Lenis) ── */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  // Anchors → scroll suave
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      const el = $(href);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -56 });
      else el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── 2 · SPLIT DEL TÍTULO EN LETRAS ── */
  const btLetters = $('.bt-letters');
  if (btLetters) {
    const text = btLetters.textContent;
    btLetters.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ltr';
      s.textContent = ch;
      s.style.transitionDelay = (i * 0.05) + 's';
      btLetters.appendChild(s);
    });
  }

  /* ── 3 · PRELOADER ── */
  const pre = $('#preloader');
  const startSite = () => {
    const bt = $('.bigtitle');
    if (bt) requestAnimationFrame(() => bt.classList.add('in'));
  };
  if (pre && !reduce) {
    if (lenis) lenis.stop();
    const bar = $('#preBar'), num = $('#preNum');
    let p = 0;
    const tick = () => {
      p += Math.random() * 9 + 3;
      if (p >= 100) p = 100;
      num.textContent = Math.floor(p);
      bar.style.width = p + '%';
      if (p < 100) setTimeout(tick, 80 + Math.random() * 90);
      else setTimeout(() => { pre.classList.add('done'); if (lenis) lenis.start(); startSite(); }, 380);
    };
    setTimeout(tick, 220);
  } else {
    if (pre) pre.classList.add('done');
    startSite();
  }

  /* ── 4 · REVEAL AL HACER SCROLL ── */
  const reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const sibs = $$(':scope > .reveal', el.parentElement);
        setTimeout(() => el.classList.add('in'), Math.max(0, sibs.indexOf(el)) * 80);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ── 5 · NAV ACTIVO POR SECCIÓN ── */
  const tabs = $$('.nav-tab');
  const map = { about: 0, projects: 1, contact: 2 };
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const idx = map[en.target.id];
        tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
      }
    });
  }, { threshold: 0.4 });
  ['about', 'projects', 'contact'].forEach(id => { const s = $('#' + id); if (s) spy.observe(s); });
  const home = $('#home');
  if (home) new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > 0.5) tabs.forEach(t => t.classList.remove('active')); });
  }, { threshold: 0.5 }).observe(home);

  /* ── 6 · PARALLAX DEL HERO ── */
  if (fine && !reduce && home) {
    const cut = $('.cutout'), glows = $$('.bg-glow');
    home.addEventListener('mousemove', e => {
      const r = home.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      if (cut) cut.style.transform = `translate(${x * 16}px,${y * 12}px)`;
      glows.forEach((g, i) => g.style.transform = `translate(${x * (i ? 28 : -28)}px,${y * (i ? 22 : -22)}px)`);
    }, { passive: true });
    home.addEventListener('mouseleave', () => { if (cut) cut.style.transform = ''; });
  }

  /* ── 7 · BOTONES MAGNÉTICOS ── */
  if (fine && !reduce) $$('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .35}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  /* ── 8 · TILT 3D EN CARDS ── */
  if (fine && !reduce) $$('.proj-card').forEach(card => {
    const MAX = 6.5;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - .5) * -2 * MAX;
      const ry = ((e.clientX - r.left) / r.width - .5) * 2 * MAX;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  /* ── 9 · CONTADORES ANIMADOS ── */
  const counters = $$('[data-count]');
  if (counters.length) {
    const cObs = new IntersectionObserver(ents => {
      ents.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target, target = +el.dataset.count, sfx = el.dataset.suffix || '', dur = 1300, t0 = performance.now();
        const step = t => {
          const k = Math.min(1, (t - t0) / dur);
          el.textContent = Math.floor((1 - Math.pow(1 - k, 3)) * target) + (k === 1 ? sfx : '');
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cObs.observe(c));
  }

  /* ── 9b · CASE STUDY MODALS ── */
  const PROJECTS = {
    pcoptimiz:{badge:'Commercial product',name:'PC Optimiz Pro X',stack:['C#','.NET 8','WPF','Clean Architecture','HMAC-SHA256','xUnit'],
      en:{tag:'A safe, well-architected Windows optimizer — sold as a real product.',problem:'Windows accumulates junk and slows down over time, yet most "optimizers" are risky black boxes with no clean architecture or honest licensing — especially in Spanish.',solution:'A WPF desktop app on .NET 8 with Clean Architecture: 24 isolated modules, an HMAC-SHA256 PRO/Free licensing system, and 342+ unit tests guarding every operation so nothing destructive runs by accident.',results:['342+ unit tests on critical paths','24 independent, testable modules','PRO/Free licensing with HMAC-SHA256','Shipping commercially on Gumroad']},
      es:{tag:'Un optimizador de Windows seguro y bien arquitecturado — vendido como producto real.',problem:'Windows acumula basura y se ralentiza, pero la mayoría de "optimizadores" son cajas negras riesgosas, sin arquitectura limpia ni licenciamiento honesto — menos en español.',solution:'App de escritorio en WPF sobre .NET 8 con Clean Architecture: 24 módulos aislados, licencias PRO/Free con HMAC-SHA256 y 342+ pruebas unitarias que protegen cada operación para que nada destructivo corra por error.',results:['342+ pruebas unitarias en rutas críticas','24 módulos independientes y testeables','Licencias PRO/Free con HMAC-SHA256','En venta comercial en Gumroad']},
      links:[{label:'Buy on Gumroad ↗',gumroad:true}]},
    cidi:{badge:'Real client',name:'CIDI Asistencia 2026',stack:['Node.js','Express','Supabase','PostgreSQL','TypeScript','Chart.js','JWT'],
      en:{tag:'Digital attendance control delivered to Fundación Juanfe.',problem:'Fundación Juanfe ran attendance for its programs on paper — slow, error-prone and impossible to analyze.',solution:'A full-stack system: Node/Express API on Supabase (PostgreSQL), JWT auth, role-based access and a Chart.js dashboard for real-time insight. Delivered end-to-end to a real client.',results:['Delivered & in use — May 2026','JWT auth + role-based access','Live charts dashboard','Real client, not an exercise']},
      es:{tag:'Control de asistencia digital entregado a la Fundación Juanfe.',problem:'La Fundación Juanfe llevaba la asistencia de sus programas en papel — lento, propenso a errores e imposible de analizar.',solution:'Sistema full-stack: API Node/Express sobre Supabase (PostgreSQL), auth JWT, acceso por roles y dashboard con Chart.js en tiempo real. Entregado de punta a punta a un cliente real.',results:['Entregado y en uso — mayo 2026','Auth JWT + acceso por roles','Dashboard con gráficas en vivo','Cliente real, no un ejercicio']},
      links:[{label:'GitHub ↗',url:'https://github.com/zoiket00/cidi-asistencia-2026-'}]},
    ape:{badge:'In dev',name:'Aprender Para Emprender',stack:['React 18','Expo 52','Next.js','Turborepo','Supabase','TypeScript'],
      en:{tag:'Multi-tenant SaaS monorepo to train entrepreneurs.',problem:'Aspiring entrepreneurs lack structured training and digital tools to start — scattered across web and mobile.',solution:'A Turborepo monorepo sharing logic between a Next.js web app and an Expo (React Native) mobile app, backed by Supabase with a multi-tenant model.',results:['Shared logic web + mobile','Multi-tenant architecture','Active development — 2026']},
      es:{tag:'SaaS multi-tenant en monorepo para formar emprendedores.',problem:'Los emprendedores carecen de formación estructurada y herramientas digitales para empezar — dispersas entre web y móvil.',solution:'Monorepo con Turborepo que comparte lógica entre una web Next.js y una app móvil Expo (React Native), sobre Supabase con modelo multi-tenant.',results:['Lógica compartida web + móvil','Arquitectura multi-tenant','Desarrollo activo — 2026']},
      links:[{label:'GitHub ↗',url:'https://github.com/zoiket00/Aprender-Para-Emprender'}]},
    fiore:{badge:'In dev',name:'FIORE MAESTRO',stack:['Python 3.13','FastAPI','Claude API','ChromaDB','Redis','Docker'],
      en:{tag:'A personal AI agent that executes real tasks.',problem:'Generic AI assistants talk but don’t act on your real email, calendar, files or PC.',solution:'A modular multi-LLM agent in Python 3.13 / FastAPI, using Claude API with ChromaDB for memory and Redis, containerized with Docker and CI/CD.',results:['Multi-LLM modular architecture','Vector memory (ChromaDB)','Dockerized + CI/CD']},
      es:{tag:'Un agente de IA personal que ejecuta tareas reales.',problem:'Los asistentes de IA genéricos hablan pero no actúan sobre tu correo, calendario, archivos o PC reales.',solution:'Agente multi-LLM modular en Python 3.13 / FastAPI, usando Claude API con ChromaDB para memoria y Redis, contenedorizado con Docker y CI/CD.',results:['Arquitectura multi-LLM modular','Memoria vectorial (ChromaDB)','Dockerizado + CI/CD']},
      links:[{label:'Private · in dev',soon:true}]},
    devforge:{badge:'Public',name:'DevForge',stack:['TypeScript','Next.js','Tailwind','Prisma'],
      en:{tag:'Agency/portfolio platform selling dev services.',problem:'Freelance devs need a credible storefront to sell professional services.',solution:'A Next.js + TypeScript site with Tailwind and Prisma, structured to present services and convert leads.',results:['Type-safe with Prisma','Modern Next.js stack','Public repo']},
      es:{tag:'Plataforma agencia/portfolio que vende servicios de desarrollo.',problem:'Los devs freelance necesitan una vitrina creíble para vender servicios profesionales.',solution:'Sitio en Next.js + TypeScript con Tailwind y Prisma, estructurado para presentar servicios y convertir leads.',results:['Type-safe con Prisma','Stack Next.js moderno','Repo público']},
      links:[{label:'GitHub ↗',url:'https://github.com/zoiket00/devforge-final'}]},
    accessguardian:{badge:'Automation',name:'AccessGuardian',stack:['n8n','Google Sheets','Slack','Google Docs'],
      en:{tag:'Automated auditing of access controls & inactive users.',problem:'Manually auditing who still has access — and who went inactive — is tedious and easy to skip.',solution:'An n8n automation that cross-checks Google Sheets, flags inactive users and reports to Slack and Google Docs on a schedule.',results:['Scheduled, hands-off audits','Slack + Docs reporting','Low-code with n8n']},
      es:{tag:'Auditoría automatizada de accesos y usuarios inactivos.',problem:'Auditar manualmente quién conserva acceso — y quién quedó inactivo — es tedioso y fácil de omitir.',solution:'Automatización en n8n que cruza Google Sheets, marca usuarios inactivos y reporta a Slack y Google Docs de forma programada.',results:['Auditorías programadas y automáticas','Reportes a Slack + Docs','Low-code con n8n']},
      links:[{label:'GitHub ↗',url:'https://github.com/zoiket00'}]}
  };
  const ORDER = ['pcoptimiz','cidi','ape','fiore','devforge','accessguardian'];
  const modal = $('#caseModal');
  const lang = () => document.documentElement.lang === 'es' ? 'es' : 'en';
  let lastFocus = null;
  function openCase(id){
    const d = PROJECTS[id]; if(!d) return;
    const L = d[lang()];
    $('#mBadge').textContent = d.badge;
    $('#mTitle').textContent = d.name;
    $('#mTagline').textContent = L.tag;
    $('#mProblem').textContent = L.problem;
    $('#mSolution').textContent = L.solution;
    $('#mResults').innerHTML = L.results.map(r => `<li>${r}</li>`).join('');
    $('#mStack').innerHTML = d.stack.map(s => `<span>${s}</span>`).join('');
    $('#mLinks').innerHTML = d.links.map(l => l.soon
      ? `<span style="color:var(--text-faint);font-family:var(--font-mono);font-size:12px">${l.label}</span>`
      : `<a href="${l.url || '#'}" ${l.gumroad ? 'data-gr' : ''} ${l.url ? 'target="_blank" rel="noopener"' : ''}>${l.label}</a>`).join('');
    $$('#mLinks [data-gr]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); toast(lang() === 'es' ? 'Falta configurar la URL de Gumroad 🛠️' : 'Gumroad URL not configured yet 🛠️'); }));
    lastFocus = document.activeElement;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop(); document.body.style.overflow = 'hidden';
    $('.modal-x', modal).focus();
  }
  function closeCase(){
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start(); document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  if (modal) {
    $$('.proj-card').forEach((card, i) => {
      const id = ORDER[i]; if (!id) return;
      card.dataset.project = id;
      card.setAttribute('tabindex', '0');
      card.insertAdjacentHTML('beforeend', '<span class="proj-hint">CASE STUDY ↗</span>');
      card.addEventListener('click', e => { if (e.target.closest('a')) return; openCase(id); });
      card.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); openCase(id); } });
    });
    $$('[data-close]', modal).forEach(el => el.addEventListener('click', closeCase));
    addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeCase(); });
  }

  /* ── 10 · TOGGLE DE IDIOMA EN / ES ── */
  const i18n = $$('[data-es]');
  i18n.forEach(el => { el.dataset.en = el.innerHTML; });
  const btn = $('#langToggle'), enS = $('.lang-en', btn), esS = $('.lang-es', btn);
  function setLang(lang) {
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    i18n.forEach(el => { el[lang === 'es' ? 'textContent' : 'innerHTML'] = lang === 'es' ? el.dataset.es : el.dataset.en; });
    enS.classList.toggle('is-active', lang === 'en');
    esS.classList.toggle('is-active', lang === 'es');
    try { localStorage.setItem('zk-lang', lang); } catch (_) {}
  }
  btn.addEventListener('click', () => setLang(document.documentElement.lang === 'es' ? 'en' : 'es'));
  let saved = 'en';
  try { saved = localStorage.getItem('zk-lang') || 'en'; } catch (_) {}
  if (saved === 'es') setLang('es'); else enS.classList.add('is-active');

  /* ── 11 · PLACEHOLDERS (Gumroad) ── */
  const GUMROAD_URL = ''; // ← Jefe: pega aquí la URL real de Gumroad de PC Optimiz Pro X
  $$('[data-gumroad]').forEach(a => {
    if (GUMROAD_URL) { a.href = GUMROAD_URL; a.target = '_blank'; a.rel = 'noopener'; }
    else a.addEventListener('click', e => {
      e.preventDefault();
      toast(document.documentElement.lang === 'es' ? 'Falta configurar la URL de Gumroad 🛠️' : 'Gumroad URL not configured yet 🛠️');
    });
  });

  /* ── 13 · FORMULARIO DE CONTACTO (Web3Forms + fallback mailto) ── */
  const form = $('#contactForm');
  if (form) {
    const status = $('#cfStatus'), sBtn = $('.cf-submit', form);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = new FormData(form), key = data.get('access_key'), es = lang() === 'es';
      if (data.get('botcheck')) return; // honeypot
      if (!form.name.value.trim() || !form.email.value.trim() || !form.message.value.trim()) {
        status.className = 'cf-status err'; status.textContent = es ? 'Completa todos los campos.' : 'Please fill all fields.'; return;
      }
      if (!key || key === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        const subject = encodeURIComponent('Contacto desde tu portafolio');
        const body = encodeURIComponent(`Name: ${form.name.value}\nEmail: ${form.email.value}\n\n${form.message.value}`);
        window.location.href = `mailto:luisdavidibarraalmario@gmail.com?subject=${subject}&body=${body}`;
        status.className = 'cf-status'; status.textContent = es ? 'Abriendo tu correo…' : 'Opening your mail app…';
        return;
      }
      sBtn.disabled = true; status.className = 'cf-status'; status.textContent = es ? 'Enviando…' : 'Sending…';
      try {
        const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
        const j = await r.json();
        if (j.success) { status.textContent = es ? '¡Mensaje enviado! Gracias 🚀' : 'Message sent! Thanks 🚀'; form.reset(); }
        else { status.className = 'cf-status err'; status.textContent = es ? 'Error al enviar. Intenta de nuevo.' : 'Send failed. Try again.'; }
      } catch (_) {
        status.className = 'cf-status err'; status.textContent = es ? 'Sin conexión. Intenta luego.' : 'Network error. Try later.';
      } finally { sBtn.disabled = false; }
    });
  }

  /* ── 14 · COMMAND PALETTE ⌘K ── */
  const cmdk = $('#cmdk'), cmdkInput = $('#cmdkInput'), cmdkList = $('#cmdkList'), cmdkBtn = $('#cmdkBtn');
  if (cmdk) {
    const go = sel => { const el = $(sel); if (el) { if (lenis) lenis.scrollTo(el, { offset: -56 }); else el.scrollIntoView(); } };
    const CMDS = [
      { ic: '◆', label: 'Go to Profile', cat: 'Nav', run: () => go('#about') },
      { ic: '◆', label: 'Go to Projects', cat: 'Nav', run: () => go('#projects') },
      { ic: '◆', label: 'Go to Contact', cat: 'Nav', run: () => go('#contact') },
      { ic: '↓', label: 'Download CV (PDF)', cat: 'Action', run: () => { const a = $('.contact-cv'); if (a) a.click(); } },
      { ic: '@', label: 'Copy email', cat: 'Action', run: () => { navigator.clipboard && navigator.clipboard.writeText('luisdavidibarraalmario@gmail.com'); toast(lang() === 'es' ? 'Email copiado ✓' : 'Email copied ✓'); } },
      { ic: '↗', label: 'Open GitHub', cat: 'Link', run: () => open('https://github.com/zoiket00', '_blank') },
      { ic: '↗', label: 'Open LinkedIn', cat: 'Link', run: () => open('https://linkedin.com/in/zoiket00', '_blank') },
      { ic: '⇄', label: 'Toggle language EN / ES', cat: 'Action', run: () => setLang(document.documentElement.lang === 'es' ? 'en' : 'es') },
      { ic: '▸', label: 'Case: PC Optimiz Pro X', cat: 'Project', run: () => openCase('pcoptimiz') },
      { ic: '▸', label: 'Case: CIDI Asistencia', cat: 'Project', run: () => openCase('cidi') },
      { ic: '▸', label: 'Case: Aprender Para Emprender', cat: 'Project', run: () => openCase('ape') },
      { ic: '▸', label: 'Case: FIORE MAESTRO', cat: 'Project', run: () => openCase('fiore') },
      { ic: '▸', label: 'Case: DevForge', cat: 'Project', run: () => openCase('devforge') },
      { ic: '▸', label: 'Case: AccessGuardian', cat: 'Project', run: () => openCase('accessguardian') }
    ];
    let filtered = CMDS.slice(), sel = 0;
    const render = () => {
      cmdkList.innerHTML = filtered.length
        ? filtered.map((c, i) => `<li class="cmdk-item ${i === sel ? 'sel' : ''}" data-i="${i}"><span class="ci-ic">${c.ic}</span><span class="ci-label">${c.label}</span><span class="ci-cat">${c.cat}</span></li>`).join('')
        : '<li class="cmdk-empty">No results</li>';
      $$('.cmdk-item', cmdkList).forEach(li => {
        li.addEventListener('click', () => run(+li.dataset.i));
        li.addEventListener('mousemove', () => { sel = +li.dataset.i; paint(); });
      });
    };
    const paint = () => $$('.cmdk-item', cmdkList).forEach((li, i) => li.classList.toggle('sel', i === sel));
    const run = i => { const c = filtered[i]; if (!c) return; closeCmdk(); setTimeout(() => c.run(), 130); };
    const filterCmd = q => { q = q.toLowerCase().trim(); filtered = q ? CMDS.filter(c => c.label.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q)) : CMDS.slice(); sel = 0; render(); };
    const ensure = () => { const el = $$('.cmdk-item', cmdkList)[sel]; if (el) el.scrollIntoView({ block: 'nearest' }); };
    const openCmdk = () => { cmdk.classList.add('open'); cmdk.setAttribute('aria-hidden', 'false'); cmdkInput.value = ''; filterCmd(''); if (lenis) lenis.stop(); setTimeout(() => cmdkInput.focus(), 30); };
    const closeCmdk = () => { cmdk.classList.remove('open'); cmdk.setAttribute('aria-hidden', 'true'); if (lenis) lenis.start(); };
    addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk.classList.contains('open') ? closeCmdk() : openCmdk(); return; }
      if (!cmdk.classList.contains('open')) return;
      if (e.key === 'Escape') closeCmdk();
      else if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(filtered.length - 1, sel + 1); paint(); ensure(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); paint(); ensure(); }
      else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
    });
    cmdkInput.addEventListener('input', () => filterCmd(cmdkInput.value));
    $$('[data-cmdk-close]', cmdk).forEach(el => el.addEventListener('click', closeCmdk));
    if (cmdkBtn) cmdkBtn.addEventListener('click', openCmdk);
    render();
  }

  /* ── 12 · TOAST ── */
  let toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.style.cssText = 'position:fixed;left:50%;bottom:32px;transform:translateX(-50%) translateY(20px);background:#0d0d0d;border:1px solid rgba(0,255,106,.4);color:#fff;font:500 13px/1 "JetBrains Mono",monospace;letter-spacing:.04em;padding:14px 22px;z-index:99999;opacity:0;transition:.3s;box-shadow:0 0 30px rgba(0,255,106,.18)';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(() => { toastEl.style.opacity = '1'; toastEl.style.transform = 'translateX(-50%) translateY(0)'; });
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => { toastEl.style.opacity = '0'; toastEl.style.transform = 'translateX(-50%) translateY(20px)'; }, 2600);
  }
  window.__toast = toast;

  console.log('%c zoiket00 ', 'background:#00ff6a;color:#000;font-weight:700;padding:2px 8px', 'Full Stack Developer · Open to work');
})();
