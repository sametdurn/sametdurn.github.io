/**
 * ============================================================
 * PORTFOLIO KONFİGÜRASYON — Siteyi özelleştirmek için bu dosyayı düzenleyin
 * ============================================================
 */
const CONFIG = Object.freeze({
  // ── Kişisel Bilgiler ──────────────────────────────────────────
  name:     "Samet Duran",
  title:    "Bilgisayar Mühendisi",
  subtitle: "Bilgisayar Mühendisi",
  bio:      "Karmaşık problemlere zarif çözümler üretiyorum. Vibe coding ile çalışmayı seviyorum. Öğrenmeye ve yeni şeyler keşfetmeye her zaman açığım.",
  location: "Türkiye",
  avatar:   "", // URL ya da boş bırakın (baş harfleri gösterilir)

  // ── GitHub ─────────────────────────────────────────────────
  github: {
    username:      "sametdurn",        // ← BUNU DEĞİŞTİRİN
    apiBase:       "https://api.github.com",
    cacheKey:      "portfolio_gh_cache",
    cacheMaxAge:   3600000,            // 1 saat (ms)
    reposPerPage:  100,
    displayPerPage: 9,
    pinnedRepos:   [],                 // isteğe bağlı: bunları başa sabitle
    excludeRepos:  ["sametdurn"],      // gizlenecek repolar (örn. profil readme)
    excludeForks:  false,
  },

  // ── Sosyal Bağlantılar ───────────────────────────────────────
  social: {
    github:   "https://github.com/sametdurn",
    linkedin: "https://linkedin.com/in/samet-duran",
  },

  // ── Beceriler ─────────────────────────────────────────────────
  skills: [
    { category: "Diller",            items: ["C/C#", "Python", "JavaScript"] },
    { category: "Frontend",          items: ["React", "Next.js", "HTML5", "CSS3", "Bootstrap"] },
    { category: "Backend",           items: [".NET", "Node.js", "REST API"] },
    { category: "Veri & Yapay Zeka", items: ["PyTorch", "TensorFlow", "Pandas", "Scikit-learn", "LLM"] },
    { category: "Platformlar",       items: ["Masaüstü", "Web", "Mobil"] },
    { category: "Veri Yönetimi",     items: ["MSSQL", "PostgreSQL", "SQLite", "Supabase", "Firebase"] },
  ],

  // ── Eğitim ────────────────────────────────────────────────────
  education: [
    {
      degree:      "Bilgisayar Mühendisliği Lisans",
      school:      "Kütahya Sağlık Bilimleri Üniversitesi",
      year:        "2021 – 2025",
      gpa:         "3.1 / 4.0",
      description: "Bitirme tezimde yapay zeka ve derin öğrenme üzerine çalıştım.",
    },
  ],

  // ── Proje Filtre Etiketleri ────────────────────────────────────
  filterTags: ["Tümü", "Web", "YZ/ML", "Mobil", "CLI", "Oyun", "Kütüphane"],

  // Manuel konu → etiket eşlemesi
  repoTagMap: {
    "machine-learning": "YZ/ML",
    "deep-learning":    "YZ/ML",
    "pytorch":          "YZ/ML",
    "tensorflow":       "YZ/ML",
    "react":            "Web",
    "nextjs":           "Web",
    "vue":              "Web",
    "android":          "Mobil",
    "flutter":          "Mobil",
    "cli":              "CLI",
    "terminal":         "CLI",
    "game":             "Oyun",
    "unity":            "Oyun",
    "npm":              "Kütüphane",
    "pypi":             "Kütüphane",
  },

  // ── SEO / Open Graph ───────────────────────────────────────────
  seo: {
    siteUrl:     "https://sametdurn.github.io",
    description: "Bilgisayar Mühendisi",
    keywords:    "bilgisayar mühendisi, full-stack geliştirici, yapay zeka, derin öğrenme, portfolyo",
    ogImage:     "/assets/og-image.png",
    twitterCard: "summary_large_image",
  },

  // ── Tema ───────────────────────────────────────────────────────
  theme: {
    accentPrimary: "#00ff88",
    accentSecond:  "#00b4ff",
    accentThird:   "#ff0099",
  },

  // ── Terminal Paskalya Yumurtası ────────────────────────────────
  terminalCommands: {
    yardim:    "Kullanılabilir komutlar: hakkinda, beceriler, projeler, temizle, ise-al",
    hakkinda:  "Yeni Mezun Bilgisayar Mühendisi. Uzaktan çalışmaya açık.",
    beceriler: "C# · Python · JS/TS · React · YZ/DL",
    projeler:  "Projeler bölümüne bakın ↓ ya da github.com/sametdurn",
    "ise-al":  "✓ İş tekliflerine açığım! LinkedIn'den ulaşabilirsiniz.",
    sudo:      "Güzel deneme 😏",
    help:      "Kullanılabilir komutlar: hakkinda, beceriler, projeler, temizle, ise-al",
  },
});
