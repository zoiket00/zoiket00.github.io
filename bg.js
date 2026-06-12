/* ════════════════════════════════════════════════════════════
   zoiket00 — Fondo WebGL: campo de partículas verdes 3D reactivo
   Ligero (Three.js Points), con fallback total y respeto a accesibilidad.
   ════════════════════════════════════════════════════════════ */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('bg3d');
  if (!canvas || !window.THREE || reduce) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (e) { canvas.style.display = 'none'; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 120);
  camera.position.z = 26;

  // Campo de partículas
  const N = innerWidth < 700 ? 480 : 1100;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 64;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 42;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 42;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x00ff6a, size: 0.085, transparent: true, opacity: 0.65,
    sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const resize = () => {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener('resize', resize, { passive: true });

  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });

  const clock = new THREE.Clock();
  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) loop();
  });

  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    points.rotation.y = t * 0.035;
    points.rotation.x = t * 0.018;
    tx += (mx * 6 - tx) * 0.04;
    ty += (-my * 4 - ty) * 0.04;
    camera.position.x = tx;
    camera.position.y = ty;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  loop();
})();
