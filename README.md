# ⚡ Portfolyos Sitesi


![Lisans](https://img.shields.io/badge/lisans-MIT-00ff88?style=flat-square)
![Statik](https://img.shields.io/badge/tür-statik-00b4ff?style=flat-square)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub_Pages-ff0099?style=flat-square)

---

## ✨ Özellikler

- **%100 Statik** — saf HTML + CSS + Vanilla JS, sıfır build aracı
- **GitHub API Entegrasyonu** — public repolarınızı otomatik çeker
- **Akıllı Önbellekleme** — API hatasında localStorage yedeklemesi, boş sayfa göstermez
- **Yeniden Deneme & Yedek** — hız limiti → eski önbellek → iskelet UI
- **Karanlık Cyberpunk Tasarım** — partikül canvas, neon renkler, akıcı animasyonlar
- **Terminal Paskalya Yumurtası** — `>_` butonu interaktif komut paneli açar
- **Responsive** — mobil öncelikli, tüm ekran boyutlarında çalışır
- **Erişilebilir** — ARIA etiketleri, odak yönetimi, klavye navigasyonu
- **SEO Hazır** — Open Graph, Twitter Card, meta etiketleri, canonical URL
- **Tek Dosya Konfigürasyon** — her şeyi `js/config.js`'den değiştirin

---

## 🚀 Hızlı Başlangıç

### GitHub Pages (Önerilen)

1. Bu repoyu **Fork**'layın veya **Use this template** ile kopyalayın
2. **Settings → Pages → Source → GitHub Actions** seçin
3. `js/config.js` dosyasını düzenleyin — GitHub kullanıcı adınızı ve kişisel bilgilerinizi girin
4. `main` branch'e push yapın — GitHub Actions otomatik deploy eder
5. Siteniz `https://KULLANICI_ADINIZ.github.io/REPO_ADI` adresinde yayında

### Yerel Geliştirme

```bash
git clone https://github.com/KULLANICI_ADINIZ/portfolio.git
cd portfolio

# Herhangi bir statik sunucu çalışır:
npx serve .           # Node
python -m http.server  # Python
# Ya da index.html'i doğrudan tarayıcıda açın
```

---

## ⚙️ Konfigürasyon

**Her şey `js/config.js` dosyasında.**

```js
const CONFIG = Object.freeze({
  // ── Kimlik ────────────────────────────────────────
  name:     "Adınız Soyadınız",
  title:    "Bilgisayar Mühendisi",
  subtitle: "Full-Stack Geliştirici & Yapay Zeka Meraklısı",
  bio:      "Kısa biyografiniz.",
  location: "Şehir, Ülke",

  // ── GitHub ────────────────────────────────────────
  github: {
    username:     "github-kullanici-adiniz",  // ← EN ÖNEMLİSİ
    excludeRepos: ["kullanici-adiniz"],        // profil readme reposunu gizle
    excludeForks: false,                       // fork'ları gizlemek için true
    pinnedRepos:  ["en-iyi-proje"],            // bunları başa sabitle
  },

  // ── Sosyal ────────────────────────────────────────
  social: {
    github:   "https://github.com/kullanici-adiniz",
    linkedin: "https://linkedin.com/in/profiliniz",
  },

  // ── Beceriler ─────────────────────────────────────
  skills: [
    { category: "Diller", items: ["Python", "JavaScript", "Go"] },
    // kategorileri dilediğiniz gibi ekleyin/çıkarın
  ],

  // ── Eğitim ────────────────────────────────────────
  education: [
    {
      degree: "Bilgisayar Mühendisliği Lisans",
      school: "Üniversiteniz",
      year:   "2020 – 2024",
      gpa:    "3.8 / 4.0",
    },
  ],

  // ── SEO ───────────────────────────────────────────
  seo: {
    siteUrl: "https://kullanici-adiniz.github.io",
  },
});
```

---

## 📁 Dosya Yapısı

```
portfolio/
├── index.html              # Tek sayfalık HTML kabuğu
├── 404.html                # Özel 404 sayfası
├── css/
│   ├── variables.css       # Tasarım token'ları (renkler, fontlar, boşluklar)
│   ├── components.css      # Kartlar, butonlar, rozetler, iskeletler
│   └── layout.css          # Navbar, bölümler, responsive grid
├── js/
│   ├── config.js           # ← BUNU DÜZENLEYİN — tüm site içeriği burada
│   ├── github.js           # GitHub API + önbellek + yeniden deneme
│   ├── components.js       # Saf render fonksiyonları (HTML üreticileri)
│   ├── projects.js         # Filtre, arama, sayfalama, modal
│   ├── ui.js               # Partiküller, animasyonlar, terminal, nav
│   └── app.js              # Giriş noktası — her şeyi birbirine bağlar
├── assets/
│   └── og-image.png        # Open Graph image
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions otomatik deploy
└── README.md
```

---

## 🎨 Tema Özelleştirme

`css/variables.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
  --accent:    #00ff88;   /* birincil neon yeşil */
  --accent-2:  #00b4ff;   /* elektrik mavisi */
  --accent-3:  #ff0099;   /* magenta */
  --clr-bg:    #050a0e;   /* sayfa arka planı */
}
```

---

## 🔌 GitHub API & Hız Limitleri

Site API hatalarını sorunsuz yönetir:

| Durum | Davranış |
|-------|----------|
| API çalışıyor | Repoları çeker, localStorage'a kaydeder |
| Taze önbellek (< 1 saat) | Önbellekten anında sunar, API çağrısı yapmaz |
| API hız limiti | Eski önbelleği uyarı rozetiyle gösterir |
| Hiç önbellek yok | Yeniden deneme butonuyla hata kartı gösterir |
| Ağ hatası | Bir kez yeniden dener, sonra yukarıdaki gibi davranır |

Önbellek süresi ayarlanabilir: `github.cacheMaxAge` (varsayılan: 3600000ms = 1 saat)

---

## ♿ Erişilebilirlik

- Doğru başlık hiyerarşisiyle anlamsal HTML5
- ARIA rolleri, etiketleri ve canlı bölgeler
- Tam klavye navigasyonu
- Modal iletişim kutusunda odak yönetimi
- Renk kontrastı ≥ 4.5:1

---

## 🔒 Güvenlik

- GitHub API verisi render öncesi sanitize edilir (XSS koruması)
- Google Fonts dışında harici script yok
- `eval()` kullanımı yok, ham kullanıcı girdisiyle `innerHTML` yok
- Tüm harici linklerde `rel="noopener noreferrer"`
- Satır içi event handler yok (Content Security Policy uyumlu)
- Yalnızca `https://` URL'leri kabul edilir

---

## 📄 Lisans

MIT — özgürce kullanın, atıf yapılırsa memnuniyet duyulur.

---

* ❋ ile yapıldı — framework yok, build aracı yok, sadece temiz kod.*
