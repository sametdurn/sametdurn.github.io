/**
 * components.js — Saf render fonksiyonları, durum yok
 * Her biri bir HTML string'i döndürür
 */
const Components = (() => {

  // ── Dil renk haritası ─────────────────────────────────────
  const LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
    Go: "#00ADD8", Rust: "#dea584", Java: "#b07219", "C++": "#f34b7d",
    C: "#555555", Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138",
    Kotlin: "#A97BFF", Dart: "#00B4AB", HTML: "#e34c26", CSS: "#563d7c",
    Shell: "#89e051", Vue: "#41b883", Svelte: "#ff3e00", Default: "#8b949e",
  };

  function langColor(lang) {
    return LANG_COLORS[lang] || LANG_COLORS.Default;
  }

  // ── Göreli zaman (Türkçe) ─────────────────────────────────
  function relativeTime(dateStr) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diff)) return "";
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "bugün";
    if (days === 1) return "dün";
    if (days < 30)  return `${days} gün önce`;
    if (days < 365) return `${Math.floor(days / 30)} ay önce`;
    return `${Math.floor(days / 365)} yıl önce`;
  }

  // ── Beceri rozeti ─────────────────────────────────────────
  function skillBadge(item) {
    // item zaten config'den geliyor, güvenli — ama yine de escape edelim
    return `<span class="skill-badge" tabindex="0">${escapeHtml(item)}</span>`;
  }

  // ── Beceri kategori kartı ─────────────────────────────────
  function skillCategory({ category, items }) {
    return `
      <div class="skill-card" role="listitem">
        <h3 class="skill-category">${escapeHtml(category)}</h3>
        <div class="skill-badges" role="list" aria-label="${escapeHtml(category)} becerileri">
          ${items.map(skillBadge).join("")}
        </div>
      </div>`;
  }

  // ── Proje kartı ───────────────────────────────────────────
  // NOT: repo nesnesi github.js'deki mapRepo() tarafından zaten sanitize edildi.
  // Burada innerHTML'e yazılan tüm değerler o aşamada temizlendi.
  function projectCard(repo) {
    const lang    = repo.language || "–";
    const color   = langColor(repo.language);
    const updated = relativeTime(repo.updatedAt);
    const hasDemo = repo.homepage && repo.homepage.startsWith("https://");
    const topics  = repo.topics.slice(0, 3).map(t =>
      `<span class="repo-topic">${t}</span>`).join("");

    // data-repo attribute'u için güvenli JSON serileştirme
    const repoJson = JSON.stringify(repo).replace(/"/g, "&quot;");

    return `
      <article class="project-card" role="listitem"
               data-repo="${repoJson}"
               tabindex="0"
               aria-label="${repo.name} reposu">
        <div class="project-card-header">
          <svg class="repo-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75
            0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0
            00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012
            11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0
            011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25
            0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0
            00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
          </svg>
          <h3 class="project-name">${repo.name}</h3>
          ${repo.isArchived ? '<span class="badge-archived">arşivlendi</span>' : ""}
        </div>

        <p class="project-desc">${repo.description || "Açıklama girilmemiş."}</p>

        ${topics ? `<div class="repo-topics">${topics}</div>` : ""}

        <div class="project-meta">
          <span class="meta-lang">
            <span class="lang-dot" style="background:${color}" aria-hidden="true"></span>
            ${lang}
          </span>
          <span class="meta-stat" title="Yıldız">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0
            01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416
            1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8
            12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818
            6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0
            018 .25z"/></svg>
            ${repo.stars}
          </span>
          <span class="meta-stat" title="Fork">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.25a.75.75 0
            110 1.5.75.75 0 010-1.5zm0 2.122a2.25 2.25 0 10-1.5
            0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0
            101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25
            2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75
            0 015 6.25v-.878zm3.75 7.378a.75.75 0 110 1.5.75.75 0
            010-1.5zm3-8.75a.75.75 0 110 1.5.75.75 0 010-1.5z"/></svg>
            ${repo.forks}
          </span>
          <span class="meta-updated" title="Son güncelleme">${updated}</span>
        </div>

        <div class="project-links">
          <a href="${repo.url}" target="_blank" rel="noopener noreferrer"
             class="btn-link btn-link--ghost" aria-label="${repo.name}'ı GitHub'da gör">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            Kod
          </a>
          ${hasDemo ? `
          <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer"
             class="btn-link btn-link--accent" aria-label="${repo.name} canlı demo">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0a8 8 0 110
            16A8 8 0 018 0zM4.5 7.5a.5.5 0 000 1h5.793l-2.147
            2.146a.5.5 0 00.708.708l3-3a.5.5 0 000-.708l-3-3a.5.5
            0 10-.708.708L10.293 7.5H4.5z"/></svg>
            Canlı Demo
          </a>` : ""}
        </div>
      </article>`;
  }

  // ── İskelet yükleyiciler ───────────────────────────────────
  function projectSkeleton(count = 6) {
    return Array.from({ length: count }, () => `
      <div class="project-card skeleton" aria-hidden="true">
        <div class="skel-line skel-title"></div>
        <div class="skel-line skel-desc"></div>
        <div class="skel-line skel-desc skel-short"></div>
        <div class="skel-meta">
          <div class="skel-dot"></div>
          <div class="skel-line skel-xs"></div>
          <div class="skel-line skel-xs"></div>
        </div>
      </div>`).join("");
  }

  // ── Hata / yedek kartı ────────────────────────────────────
  // GÜVENLİK DÜZELTMESİ: onclick satır içi handler kaldırıldı
  function errorCard(msg) {
    return `
      <div class="error-card">
        <div class="error-icon">⚠</div>
        <p class="error-msg">${escapeHtml(msg)}</p>
        <button class="btn-primary" id="retry-btn">
          ↻ Tekrar Dene
        </button>
      </div>`;
  }

  // ── Kaynak rozeti (önbellek göstergesi) ───────────────────
  function sourceBadge(source) {
    if (source === "api") return "";
    const labels = {
      cache_fresh: "● Önbellekten",
      cache_stale: "⚠ Önbellekten (eski)",
    };
    return `<span class="cache-badge" title="Veriler yerel önbellekten yüklendi">${labels[source] || ""}</span>`;
  }

  // ── Eğitim öğesi ──────────────────────────────────────────
  function educationItem({ degree, school, year, gpa, description }) {
    return `
      <div class="edu-item">
        <div class="edu-dot"></div>
        <div class="edu-content">
          <h3 class="edu-degree">${escapeHtml(degree)}</h3>
          <p class="edu-school">${escapeHtml(school)}</p>
          <div class="edu-meta">
            <span>${escapeHtml(year)}</span>
            ${gpa ? `<span class="edu-gpa">GNO: ${escapeHtml(gpa)}</span>` : ""}
          </div>
          ${description ? `<p class="edu-desc">${escapeHtml(description)}</p>` : ""}
        </div>
      </div>`;
  }

  // ── Yardımcı: HTML escape ─────────────────────────────────
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  return { skillCategory, projectCard, projectSkeleton, errorCard, sourceBadge, educationItem };
})();
