/**
 * ui.js — Animasyonlar, partiküller, terminal, kaydırma efektleri
 */

// ── Partikül Canvas ────────────────────────────────────────
const ParticleSystem = (() => {
  let canvas, ctx, particles = [], animId;
  const MAX = 60;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor(w, h) { this.reset(w, h); }
    reset(w, h) {
      this.x  = rand(0, w);
      this.y  = rand(0, h);
      this.vx = rand(-0.3, 0.3);
      this.vy = rand(-0.5, -0.1);
      this.r  = rand(1, 2.5);
      this.alpha = rand(0.2, 0.7);
      this.color = Math.random() > 0.5 ? "0,255,136" : "0,180,255";
    }
    update(w, h) {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.001;
      if (this.y < -10 || this.alpha <= 0) this.reset(w, h);
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resize();
    for (let i = 0; i < MAX; i++) particles.push(new Particle(canvas.width, canvas.height));
    loop();
    window.addEventListener("resize", resize, { passive: true });
  }

  function resize() {
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function loop() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,136,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      particles[i].update(canvas.width, canvas.height);
      particles[i].draw(ctx);
    }
    animId = requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });

  return { init };
})();

// ── Kaydırma İlerleme Çubuğu ──────────────────────────────
const ScrollProgress = (() => {
  function init() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    window.addEventListener("scroll", () => {
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      const pct = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
      bar.setAttribute("aria-valuenow", Math.round(pct));
    }, { passive: true });
  }
  return { init };
})();

// ── Kaydırma Animasyonları (IntersectionObserver) ─────────
const ScrollAnimations = (() => {
  let io;

  function init() {
    io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".animate-on-scroll").forEach(el => io.observe(el));
  }

  function observe(els) {
    if (!io) return;
    els.forEach(el => {
      el.classList.add("animate-on-scroll");
      io.observe(el);
    });
  }

  return { init, observe };
})();

// ── Yazma Efekti (Hero) ───────────────────────────────────
const TypingEffect = (() => {
  function init(el, strings, speed = 80, pause = 2000) {
    if (!el || !strings.length) return;
    let si = 0, ci = 0, deleting = false;

    function tick() {
      const str = strings[si];
      el.textContent = deleting ? str.substring(0, ci--) : str.substring(0, ci++);

      if (!deleting && ci === str.length + 1) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
      if (deleting && ci < 0) {
        deleting = false;
        si = (si + 1) % strings.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, deleting ? speed / 2 : speed);
    }
    tick();
  }
  return { init };
})();

// ── Terminal Paskalya Yumurtası ────────────────────────────
const Terminal = (() => {
  const history = [];
  let histIdx = -1;

  function init() {
    const term    = document.getElementById("terminal");
    const input   = document.getElementById("term-input");
    const output  = document.getElementById("term-output");
    const trigger = document.getElementById("terminal-trigger");
    if (!term || !input || !output) return;

    trigger?.addEventListener("click", () => {
      const isOpen = term.classList.toggle("open");
      trigger.setAttribute("aria-expanded", isOpen);
      if (isOpen) input.focus();
    });

    // Terminal dışına tıklayınca kapat
    document.addEventListener("click", (e) => {
      if (term.classList.contains("open") &&
          !term.contains(e.target) &&
          e.target !== trigger) {
        term.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    input.addEventListener("keydown", e => {
      if (e.key === "ArrowUp") {
        histIdx = Math.min(histIdx + 1, history.length - 1);
        input.value = history[histIdx] || "";
        e.preventDefault();
      }
      if (e.key === "ArrowDown") {
        histIdx = Math.max(histIdx - 1, -1);
        input.value = histIdx >= 0 ? history[histIdx] : "";
        e.preventDefault();
      }
      if (e.key !== "Enter") return;

      const cmd = input.value.trim().toLowerCase();
      input.value = "";
      histIdx = -1;
      if (cmd) history.unshift(cmd);

      appendLine(`<span class="term-prompt">❯</span> ${sanitize(cmd)}`, "term-cmd");

      if (cmd === "temizle" || cmd === "clear") {
        output.innerHTML = "";
        return;
      }

      const response = CONFIG.terminalCommands[cmd] ||
        `Komut bulunamadı: ${sanitize(cmd)}. Komutlar için <span class="term-key">yardim</span> yazın.`;
      appendLine(response, "term-res");
    });

    appendLine(`${sanitize(CONFIG.name)}'ın terminaline hoş geldiniz. Komutlar için <span class="term-key">yardim</span> yazın.`, "term-res");
  }

  function appendLine(html, cls) {
    const output = document.getElementById("term-output");
    if (!output) return;
    const div = document.createElement("div");
    div.className = `term-line ${cls}`;
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function sanitize(s) {
    return String(s)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#x27;");
  }

  return { init };
})();

// ── Nav — aktif bölüm vurgulama & mobil menü ──────────────
const Nav = (() => {
  function init() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks  = document.querySelectorAll(".nav-link");

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => {
            a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(s => io.observe(s));

    // Mobil menü
    const hamburger = document.getElementById("hamburger");
    const navMenu   = document.getElementById("nav-menu");
    const overlay   = document.getElementById("nav-overlay");

    function openMenu() {
      navMenu.classList.add("open");
      overlay && overlay.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      navMenu.classList.remove("open");
      overlay && overlay.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    hamburger?.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });

    // Overlay'e tıklanınca menüyü kapat
    overlay?.addEventListener("click", closeMenu);

    // Menü linklerine tıklanınca kapat
    navMenu?.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", closeMenu);
    });

    // Escape tuşu ile kapat
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && navMenu.classList.contains("open")) {
        closeMenu();
        hamburger?.focus();
      }
    });

    // Ekran genişlediğinde menüyü temizle
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });

    // Kaydırmada navbar arka planı
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
      navbar?.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });
  }
  return { init };
})();

// ── Yumuşak kaydırma (anchor linkler) ─────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}


