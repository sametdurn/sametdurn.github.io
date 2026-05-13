/**
 * github.js — API çekme: önbellekleme, yeniden deneme ve zarif yedek
 * Asla boş sayfa göstermez: önbellek → eski önbellek → iskelet yedek
 */
const GitHubService = (() => {
  const { github } = CONFIG;

  // ── Önbellek yardımcıları ──────────────────────────────────
  function saveCache(data) {
    try {
      localStorage.setItem(github.cacheKey, JSON.stringify({
        ts: Date.now(),
        data,
      }));
    } catch (_) { /* kota aşımı — sessizce atla */ }
  }

  function loadCache() {
    try {
      const raw = localStorage.getItem(github.cacheKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Temel yapıyı doğrula
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.data)) return null;
      return parsed;
    } catch (_) { return null; }
  }

  function isFresh(cached) {
    return cached && typeof cached.ts === "number" &&
           (Date.now() - cached.ts) < github.cacheMaxAge;
  }

  // ── Dış veriyi sanitize et ─────────────────────────────────
  function sanitize(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  // ── Ham API reposunu güvenli iç formata dönüştür ─────────
  function mapRepo(repo) {
    if (!repo || typeof repo !== "object") return null;

    // URL güvenlik doğrulaması: yalnızca https kabul et
    const rawUrl      = String(repo.html_url || "");
    const rawHomepage = String(repo.homepage  || "");
    const safeUrl      = rawUrl.startsWith("https://") ? sanitize(rawUrl) : "";
    const safeHomepage = rawHomepage.startsWith("https://") ? sanitize(rawHomepage) : "";

    return {
      id:          typeof repo.id === "number" ? repo.id : 0,
      name:        sanitize(repo.name ?? ""),
      fullName:    sanitize(repo.full_name ?? ""),
      description: sanitize(repo.description ?? ""),
      language:    sanitize(repo.language ?? ""),
      stars:       Number(repo.stargazers_count) || 0,
      forks:       Number(repo.forks_count) || 0,
      topics:      Array.isArray(repo.topics) ? repo.topics.map(sanitize) : [],
      url:         safeUrl,
      homepage:    safeHomepage,
      updatedAt:   typeof repo.updated_at === "string" ? repo.updated_at : null,
      isFork:      Boolean(repo.fork),
      isArchived:  Boolean(repo.archived),
      createdAt:   typeof repo.created_at === "string" ? repo.created_at : null,
    };
  }

  // ── Zaman aşımlı fetch ────────────────────────────────────
  async function fetchWithTimeout(url, ms = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "Accept": "application/vnd.github.v3+json" },
      });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  // ── GÜVENLİK: username sadece güvenli karakterler içermeli ─
  function validateUsername(username) {
    return /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username);
  }

  // ── Tüm repoları çek (sayfalamayı destekler) ─────────────
  async function fetchRepos(attempt = 1) {
    if (!validateUsername(github.username)) {
      throw new Error("user_not_found");
    }

    const url = `${github.apiBase}/users/${encodeURIComponent(github.username)}/repos?per_page=${github.reposPerPage}&sort=updated&type=public`;

    try {
      const res = await fetchWithTimeout(url);
      if (res.status === 403) throw new Error("rate_limit");
      if (res.status === 404) throw new Error("user_not_found");
      if (!res.ok)            throw new Error(`http_${res.status}`);

      const raw = await res.json();
      if (!Array.isArray(raw)) throw new Error("unexpected_format");

      let repos = raw
        .map(mapRepo)
        .filter(Boolean)
        .filter(r => r.name && !github.excludeRepos.includes(r.name))
        .filter(r => github.excludeForks ? !r.isFork : true);

      // Belirtilen repoları başa sabitle
      if (github.pinnedRepos?.length) {
        repos.sort((a, b) => {
          const ai = github.pinnedRepos.indexOf(a.name);
          const bi = github.pinnedRepos.indexOf(b.name);
          if (ai === -1 && bi === -1) return b.stars - a.stars;
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        });
      } else {
        repos.sort((a, b) => b.stars - a.stars || new Date(b.updatedAt) - new Date(a.updatedAt));
      }

      saveCache(repos);
      return { repos, source: "api" };
    } catch (err) {
      // Ağ hatalarında bir kez yeniden dene (hız limiti değilse)
      if (attempt < 2 && err.message !== "rate_limit" && err.message !== "user_not_found") {
        await new Promise(r => setTimeout(r, 1500));
        return fetchRepos(2);
      }
      throw err;
    }
  }

  // ── Genel API ─────────────────────────────────────────────
  async function getRepos() {
    // 1. Taze önbellek? Hemen döndür.
    const cached = loadCache();
    if (isFresh(cached)) {
      return { repos: cached.data, source: "cache_fresh" };
    }

    // 2. API'yi dene
    try {
      return await fetchRepos();
    } catch (err) {
      // 3. Eski önbellek? Uyarıyla döndür.
      if (cached?.data) {
        return { repos: cached.data, source: "cache_stale", error: err.message };
      }
      // 4. Hiç veri yok → çağırana yedek UI göstermesini bırak
      throw err;
    }
  }

  return { getRepos };
})();
