/**
 * projects.js — Render, filtreleme, arama, sayfalama ve modal yönetimi
 */
const ProjectsModule = (() => {
  let allRepos   = [];
  let filtered   = [];
  let currentTag = "Tümü";
  let searchQuery = "";
  let currentPage = 1;
  const PER_PAGE  = CONFIG.github.displayPerPage;

  // ── DOM referansları (init'te çözülür) ────────────────────
  let gridEl, paginationEl, filterEl, searchEl, countEl, sourceEl;

  // ── Etiket tespiti ────────────────────────────────────────
  function detectTag(repo) {
    const map = CONFIG.repoTagMap;
    for (const topic of repo.topics) {
      if (map[topic]) return map[topic];
    }
    const lang = (repo.language || "").toLowerCase();
    if (["javascript","typescript","html","css","vue","svelte"].includes(lang)) return "Web";
    if (["python"].includes(lang) && repo.topics.some(t => ["ml","ai","nlp","deep-learning"].includes(t))) return "YZ/ML";
    if (["swift","kotlin","dart"].includes(lang)) return "Mobil";
    if (["shell","bash"].includes(lang)) return "CLI";
    return "Tümü";
  }

  // ── Filtreleri uygula + arama ─────────────────────────────
  function applyFilters() {
    filtered = allRepos.filter(repo => {
      const tagOk = currentTag === "Tümü" || detectTag(repo) === currentTag;
      if (!tagOk) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        repo.name.toLowerCase().includes(q) ||
        repo.description.toLowerCase().includes(q) ||
        repo.language.toLowerCase().includes(q) ||
        repo.topics.some(t => t.toLowerCase().includes(q))
      );
    });
    currentPage = 1;
    render();
  }

  // ── Grid render ───────────────────────────────────────────
  function render() {
    if (!gridEl) return;

    const start = (currentPage - 1) * PER_PAGE;
    const page  = filtered.slice(start, start + PER_PAGE);

    if (page.length === 0) {
      gridEl.innerHTML = `<div class="no-results">
        <span class="no-results-icon">🔍</span>
        <p>Aramanızla eşleşen repo bulunamadı.</p>
        <button class="btn-primary" id="clear-filters-btn">Filtreleri temizle</button>
      </div>`;
      document.getElementById("clear-filters-btn")?.addEventListener("click", reset);
    } else {
      gridEl.innerHTML = page.map(Components.projectCard).join("");
      // Kart tıklama olaylarını bağla
      gridEl.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => openModal(card));
        card.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(card);
          }
        });
      });
    }

    renderPagination();
    if (countEl) {
      const count = filtered.length;
      countEl.textContent = `${count} repo`;
    }

    if (window.ScrollAnimations) ScrollAnimations.observe(gridEl.querySelectorAll(".project-card"));
  }

  // ── Sayfalama ─────────────────────────────────────────────
  function renderPagination() {
    if (!paginationEl) return;
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    if (totalPages <= 1) { paginationEl.innerHTML = ""; return; }

    let html = "";
    const prev = currentPage > 1;
    const next = currentPage < totalPages;

    html += `<button class="page-btn ${prev ? "" : "disabled"}" data-action="prev" ${prev ? "" : "disabled"} aria-label="Önceki sayfa">‹</button>`;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        html += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}" aria-label="${i}. sayfa" aria-current="${i === currentPage ? "page" : "false"}">${i}</button>`;
      } else if (Math.abs(i - currentPage) === 2) {
        html += `<span class="page-ellipsis">…</span>`;
      }
    }

    html += `<button class="page-btn ${next ? "" : "disabled"}" data-action="next" ${next ? "" : "disabled"} aria-label="Sonraki sayfa">›</button>`;
    paginationEl.innerHTML = html;

    paginationEl.querySelectorAll(".page-btn:not(.disabled)").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.dataset.action === "prev") currentPage--;
        else if (btn.dataset.action === "next") currentPage++;
        else currentPage = parseInt(btn.dataset.page, 10);
        render();
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // ── Modal ─────────────────────────────────────────────────
  function openModal(card) {
    let repo;
    try {
      // GÜVENLİK: data-repo'daki &quot; geri dönüştür ve JSON parse et
      const raw = card.dataset.repo.replace(/&quot;/g, '"');
      repo = JSON.parse(raw);
    } catch (_) { return; }

    // Temel alan doğrulaması
    if (!repo || typeof repo !== "object") return;

    const modal = document.getElementById("project-modal");
    const body  = document.getElementById("modal-body");
    if (!modal || !body) return;

    const hasDemo = typeof repo.homepage === "string" && repo.homepage.startsWith("https://");

    // Tüm değerler github.js'de sanitize edildi; modal gövdesini DOM ile oluşturuyoruz
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";

    const title = document.createElement("h2");
    title.className = "modal-title";
    title.id = "modal-title";
    title.textContent = repo.name || "";
    modalHeader.appendChild(title);

    if (repo.isArchived) {
      const badge = document.createElement("span");
      badge.className = "badge-archived";
      badge.textContent = "arşivlendi";
      modalHeader.appendChild(badge);
    }

    const desc = document.createElement("p");
    desc.className = "modal-desc";
    desc.textContent = repo.description || "Açıklama girilmemiş.";

    const topicsDiv = document.createElement("div");
    if (Array.isArray(repo.topics) && repo.topics.length) {
      topicsDiv.className = "repo-topics modal-topics";
      repo.topics.forEach(t => {
        const span = document.createElement("span");
        span.className = "repo-topic";
        span.textContent = t;
        topicsDiv.appendChild(span);
      });
    }

    const statsDiv = document.createElement("div");
    statsDiv.className = "modal-stats";
    statsDiv.innerHTML = `
      <div class="modal-stat"><span>⭐</span><strong>${Number(repo.stars) || 0}</strong><small>Yıldız</small></div>
      <div class="modal-stat"><span>🍴</span><strong>${Number(repo.forks) || 0}</strong><small>Fork</small></div>
      <div class="modal-stat"><span>💻</span><strong>${repo.language || "–"}</strong><small>Dil</small></div>`;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "modal-actions";

    const ghLink = document.createElement("a");
    ghLink.href = repo.url || "#";
    ghLink.target = "_blank";
    ghLink.rel = "noopener noreferrer";
    ghLink.className = "btn-primary";
    ghLink.textContent = "GitHub'da Gör";
    actionsDiv.appendChild(ghLink);

    if (hasDemo) {
      const demoLink = document.createElement("a");
      demoLink.href = repo.homepage;
      demoLink.target = "_blank";
      demoLink.rel = "noopener noreferrer";
      demoLink.className = "btn-secondary";
      demoLink.textContent = "Canlı Demo →";
      actionsDiv.appendChild(demoLink);
    }

    body.innerHTML = "";
    body.appendChild(modalHeader);
    body.appendChild(desc);
    if (topicsDiv.children.length) body.appendChild(topicsDiv);
    body.appendChild(statsDiv);
    body.appendChild(actionsDiv);

    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("modal-close")?.focus();
  }

  function closeModal() {
    const modal = document.getElementById("project-modal");
    if (!modal) return;
    modal.setAttribute("hidden", "");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // ── Başlat ────────────────────────────────────────────────
  function init() {
    gridEl       = document.getElementById("projects-grid");
    paginationEl = document.getElementById("projects-pagination");
    filterEl     = document.getElementById("filter-tags");
    searchEl     = document.getElementById("project-search");
    countEl      = document.getElementById("repo-count");
    sourceEl     = document.getElementById("data-source-badge");

    // Filtre butonları
    if (filterEl) {
      CONFIG.filterTags.forEach(tag => {
        const btn = document.createElement("button");
        btn.className  = "filter-btn" + (tag === "Tümü" ? " active" : "");
        btn.textContent = tag;
        btn.setAttribute("aria-pressed", tag === "Tümü" ? "true" : "false");
        btn.addEventListener("click", () => {
          currentTag = tag;
          filterEl.querySelectorAll(".filter-btn").forEach(b => {
            b.classList.toggle("active", b.textContent === tag);
            b.setAttribute("aria-pressed", b.textContent === tag ? "true" : "false");
          });
          applyFilters();
        });
        filterEl.appendChild(btn);
      });
    }

    // Arama (debounced)
    let searchDebounce;
    if (searchEl) {
      searchEl.addEventListener("input", () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          searchQuery = searchEl.value.trim();
          applyFilters();
        }, 300);
      });
    }

    // Modal kapat
    const closeBtn = document.getElementById("modal-close");
    const modal    = document.getElementById("project-modal");
    closeBtn?.addEventListener("click", closeModal);
    modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

    // Repoları yükle
    loadRepos();
  }

  async function loadRepos() {
    if (!gridEl) return;
    gridEl.innerHTML = Components.projectSkeleton(6);

    try {
      const { repos, source, error } = await GitHubService.getRepos();
      allRepos = repos;

      if (sourceEl) {
        sourceEl.innerHTML = Components.sourceBadge(source);
        if (error) {
          const warn = document.createElement("span");
          warn.className = "cache-warn";
          warn.textContent = ` (API ${error === "rate_limit" ? "hız limiti" : "erişilemez"} – önbellekten gösteriliyor)`;
          sourceEl.appendChild(warn);
        }
      }

      applyFilters();
    } catch (err) {
      let msg = "Repolar yüklenemedi. İnternet bağlantınızı kontrol edin.";
      if (err.message === "rate_limit") msg = "GitHub API hız limiti aşıldı. Lütfen birkaç dakika sonra tekrar deneyin.";
      if (err.message === "user_not_found") msg = "GitHub kullanıcı adı bulunamadı. config.js dosyasını kontrol edin.";

      gridEl.innerHTML = Components.errorCard(msg);
      // Satır içi onclick yerine addEventListener kullan
      document.getElementById("retry-btn")?.addEventListener("click", loadRepos);
    }
  }

  function reset() {
    currentTag  = "Tümü";
    searchQuery = "";
    if (searchEl) searchEl.value = "";
    if (filterEl) {
      filterEl.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.toggle("active", b.textContent === "Tümü");
        b.setAttribute("aria-pressed", b.textContent === "Tümü" ? "true" : "false");
      });
    }
    applyFilters();
  }

  return { init, loadRepos, reset };
})();
