/**
 * app.js — Giriş noktası, DOM hazır olduğunda her şeyi bağlar
 */
document.addEventListener("DOMContentLoaded", () => {

  // ── Config tabanlı içerikleri doldur ──────────────────────
  populateSite();

  // ── UI modüllerini başlat ──────────────────────────────────
  ParticleSystem.init();
  ScrollProgress.init();
  ScrollAnimations.init();
  Nav.init();
  Terminal.init();
  initSmoothScroll();
  // Yazma efekti
  const typingEl = document.getElementById("typing-text");
  TypingEffect.init(typingEl, [
    CONFIG.subtitle,
    "Geleceği İnşa Ediyorum",
    "Açık Kaynak Savunucusu",
    "Problem Çözücü",
    "Vibe Coder",
  ]);

  // ── Projeler ───────────────────────────────────────────────
  ProjectsModule.init();
});

// ── Config'den dinamik içeriği doldur ─────────────────────
function populateSite() {
  const { name, title, bio, location, social, skills, education } = CONFIG;

  // Metin düğümleri
  safeSet("site-name",       name);
  safeSet("hero-name",       name);
  safeSet("hero-title",      title);
  safeSet("hero-bio",        bio);
  safeSet("about-bio",       bio);
  safeSet("footer-name",     name);
  safeSet("footer-name2",     name);
  safeSet("contact-location", location);

  // Sayfa başlığı ve meta
  document.title = `${name} | ${title}`;
  setMeta("description", CONFIG.seo.description);
  setMeta("keywords",    CONFIG.seo.keywords);
  setMeta("og:title",    `${name} | ${title}`);
  setMeta("og:description", CONFIG.seo.description);
  setMeta("og:url",      CONFIG.seo.siteUrl);
  setMeta("og:image",    CONFIG.seo.siteUrl + CONFIG.seo.ogImage);
  setMeta("twitter:card",  CONFIG.seo.twitterCard);
  setMeta("twitter:title", `${name} | ${title}`);

  // Canonical link
  const canonical = document.querySelector("link[rel='canonical']");
  if (canonical) canonical.href = CONFIG.seo.siteUrl;

  // Avatar
  const avatar = document.getElementById("hero-avatar");
  if (avatar) {
    if (CONFIG.avatar) {
      // Güvenli: sadece https URL'lerine izin ver
      const url = CONFIG.avatar;
      if (url.startsWith("https://")) {
        const img = document.createElement("img");
        img.src = url;
        img.alt = name;
        img.loading = "lazy";
        avatar.appendChild(img);
      }
    } else {
      const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      avatar.textContent = initials;
    }
  }

  // Sosyal bağlantılar — sadece https: kabul et
  Object.entries(social).forEach(([key, url]) => {
    if (!url) return;
    if (!url.startsWith("https://")) return;
    document.querySelectorAll(`[data-social="${key}"]`).forEach(el => {
      el.href = url;
    });
  });

  // Beceriler
  const skillsGrid = document.getElementById("skills-grid");
  if (skillsGrid) {
    skillsGrid.innerHTML = skills.map(Components.skillCategory).join("");
  }

  // Eğitim
  const eduList = document.getElementById("education-list");
  if (eduList) {
    eduList.innerHTML = education.map(Components.educationItem).join("");
  }

  // Katkı grafiği (dekoratif)
  renderContribGrid();
}

function safeSet(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || "";
}

function setMeta(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${name}"]`) ||
           document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(name.startsWith("og:") || name.startsWith("twitter:") ? "property" : "name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

// ── Dekoratif katkı grafiği ────────────────────────────────
function renderContribGrid() {
  const grid = document.getElementById("contrib-grid");
  if (!grid) return;
  const COLS = 52, ROWS = 7;
  const fragment = document.createDocumentFragment();
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const level = Math.random() < 0.3 ? 0 :
                    Math.random() < 0.5 ? 1 :
                    Math.random() < 0.7 ? 2 :
                    Math.random() < 0.9 ? 3 : 4;
      const div = document.createElement("div");
      div.className = "contrib-cell";
      div.dataset.level = level;
      div.title = "Katkı";
      div.setAttribute("role", "presentation");
      fragment.appendChild(div);
    }
  }
  grid.appendChild(fragment);
}
