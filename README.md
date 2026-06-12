# zoiket00 — Portfolio

Portafolio personal de **Luis David Ibarra Almario** (`zoiket00`) — Full Stack Developer & Systems Engineer.
Sitio estático (HTML + CSS + JS vanilla), sin build step, desplegable directo en **GitHub Pages**.

🔗 **Live:** https://zoiket00.github.io

---

## 🧱 Estructura

```
zoiket00.github.io/
├─ index.html          # Marcado semántico — 4 secciones (Home · Profile · Projects · Contact)
├─ styles.css          # Diseño world-class — paleta verde neón #00FF6A
├─ main.js             # Cursor, animaciones reveal, nav activo, toggle EN/ES
├─ assets/
│  └─ profile.png      # Foto del hero, recortada (fondo transparente)
└─ index-banner-backup.html   # Respaldo del banner cyberpunk anterior
```

---

## 🚀 Deploy a GitHub Pages

El repo `zoiket00.github.io` se publica solo en `https://zoiket00.github.io`. Solo hay que subir:

```bash
git add .
git commit -m "feat: portafolio world-class v2026"
git push origin main
```

En **Settings → Pages**, fuente = `Deploy from a branch`, rama `main` / carpeta `/ (root)`.
Cambios visibles en ~1 min.

---

## ✏️ Cómo personalizar

| Quiero cambiar...        | Dónde                                                                 |
|--------------------------|----------------------------------------------------------------------|
| **Color de marca**       | `styles.css` → `:root` → `--lime: #00FF6A` (una línea cambia todo)   |
| **URL de Gumroad**        | `main.js` → `const GUMROAD_URL = ''` → pega tu link real             |
| **Email**                | `index.html` → buscar `mailto:` (2 sitios) y `soc-handle` del email  |
| **Foto**                 | Reemplaza `assets/profile.png` (PNG transparente, sujeto recortado)  |
| **Nivel de inglés**      | `index.html` → bloque `LANGUAGES` (barra al 62% — ajústala)          |
| **Proyectos**            | `index.html` → sección `id="projects"` → bloques `<article.proj-card>`|

---

## 🎨 Diseño

- **Referencia:** portafolio estilo "menú gaming" (4 pantallas full-screen).
- **Paleta:** verde neón `#00FF6A` sobre negro puro `#000`, acentos cian/violeta en cards.
- **Tipografía:** Space Grotesk (display) · Inter (texto) · JetBrains Mono (técnico).
- **FX:** cursor personalizado, scanlines + grano sutil, glows radiales, reveal on-scroll, scroll-snap.
- **Bilingüe:** toggle EN/ES (recuerda preferencia en `localStorage`).
- **A11y:** HTML semántico, `prefers-reduced-motion`, contraste alto, navegación por teclado.
- **Responsive:** 375px → 1920px.

---

## ✅ Checklist antes de publicar

- [ ] Pegar **URL real de Gumroad** en `main.js` (`GUMROAD_URL`)
- [ ] Pegar tu **Web3Forms access key** en `index.html` (campo `access_key`) → formulario con envío directo. Gratis en web3forms.com. Sin ella, el form abre tu cliente de correo como respaldo.
- [ ] Confirmar **email** de contacto
- [ ] Ajustar **nivel de inglés** si 62% no es exacto
- [ ] Si cambias tus datos, regenera el **CV PDF** (`cv.html` → imprimir a PDF) y la **imagen OG** (`og.html`)

## 🌟 Características world-class

Preloader animado · smooth scroll (Lenis) · reveal del título por letras · parallax del hero ·
botones magnéticos · tilt 3D en cards · contadores animados · **command palette `⌘K`** ·
**case studies** (modal por proyecto) · **CV en PDF** · **formulario funcional** (Web3Forms) ·
sección *Currently* · **Open Graph** + favicon · bilingüe EN/ES · responsive · accesible.

---

_Diseñado y desarrollado por **zoiket00** · 2026_
