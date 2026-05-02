const audio = document.getElementById("musica");
audio.volume = 0.2; // 
const btn = document.getElementById("btnAudio");

function toggleAudio() {
  audio.muted = !audio.muted;

  if (audio.muted) {
    btn.textContent = "🔇";
  } else {
    btn.textContent = "🔊";
  }
}

/* ── SCROLL PROGRESS ── */

const progressBar = document.getElementById("scrollProgress");

function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
}
window.addEventListener("scroll", updateProgress, { passive: true });

/* ── ZOOM NO VÍDEO HERO ── */

const video        = document.querySelector(".video-main");
const SCALE_START  = 1.08;
const SCALE_END    = 1.55;
const MAX_SCROLL   = 900;
const LERP_FACTOR  = 0.06;
const THRESHOLD    = 0.0005;

let targetScale  = SCALE_START;
let currentScale = SCALE_START;
let rafZoom      = null;

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function lerp(a, b, t)   { return a + (b - a) * t; }

function animateZoom() {
    currentScale = lerp(currentScale, targetScale, LERP_FACTOR);
    video.style.transform = `scale(${currentScale})`;
    if (Math.abs(targetScale - currentScale) > THRESHOLD) {
        rafZoom = requestAnimationFrame(animateZoom);
    } else {
        currentScale = targetScale;
        video.style.transform = `scale(${currentScale})`;
        rafZoom = null;
    }
}

window.addEventListener("scroll", () => {
    const progress = Math.min(window.scrollY / MAX_SCROLL, 1);
    targetScale    = SCALE_START + easeOutCubic(progress) * (SCALE_END - SCALE_START);
    if (!rafZoom) rafZoom = requestAnimationFrame(animateZoom);
}, { passive: true });

video.style.transform = `scale(${currentScale})`;

/* ── NAVBAR ── */

const navbar = document.getElementById("navbar");

const scrollObserver = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
};
window.addEventListener("scroll", scrollObserver, { passive: true });
scrollObserver();

/* ── BURGER MENU ── */

const burger   = document.getElementById("burger");
const navLinks = document.querySelector(".nav-links");
const navCta   = document.querySelector(".nav-cta");
let menuOpen   = false;

burger.addEventListener("click", () => {
    menuOpen = !menuOpen;
    const spans = burger.querySelectorAll("span");
    if (menuOpen) {
        spans[0].style.transform = "translateY(6.5px) rotate(45deg)";
        spans[1].style.transform = "translateY(-6.5px) rotate(-45deg)";
        navLinks.style.cssText = "display:flex;flex-direction:column;position:fixed;top:72px;left:0;right:0;background:rgba(6,6,8,0.97);padding:32px 24px;gap:24px;border-bottom:1px solid rgba(255,255,255,0.07);z-index:99;backdrop-filter:blur(20px)";
        navCta.style.cssText   = "display:flex;position:fixed;bottom:32px;left:24px;right:24px;justify-content:center;z-index:99;";
    } else {
        spans[0].style.transform = "";
        spans[1].style.transform = "";
        navLinks.style.cssText   = "";
        navCta.style.cssText     = "";
    }
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => { if (menuOpen) burger.click(); });
});

/* ── REVEAL ON SCROLL ── */

const revealEls = document.querySelectorAll(".reveal");

const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealEls.forEach(el => io.observe(el));

/* ── MANIFESTO QUOTE ── */

const manifestoContent = document.querySelector(".manifesto-content");
const manifestoObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            manifestoObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (manifestoContent) manifestoObs.observe(manifestoContent);

/* ── CONTADORES ANIMADOS ── */

function animateCounter(el, target, duration = 1600) {
    let start = null;
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        el.textContent = Math.floor(ease(progress) * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

const statsSection = document.querySelector(".hero-stats");
let statsStarted   = false;

const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsStarted) {
        statsStarted = true;
        document.querySelectorAll(".stat-num").forEach(el => {
            animateCounter(el, parseInt(el.dataset.target), 1800);
        });
        statsObs.disconnect();
    }
}, { threshold: 0.5 });

if (statsSection) statsObs.observe(statsSection);

/* ── BOTÕES MAGNÉTICOS ── */

document.querySelectorAll(".magnetic").forEach(el => {
    el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) * 0.35;
        const dy   = (e.clientY - cy) * 0.35;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener("mouseleave", () => {
        el.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
        el.style.transform  = "translate(0, 0)";
        setTimeout(() => { el.style.transition = ""; }, 500);
    });
});

/* ── WORK ITEMS ── */

document.querySelectorAll(".work-item").forEach(item => {
    const color = item.dataset.color;
    item.addEventListener("mouseenter", () => {
        if (color) item.querySelector(".work-link").style.color = color;
    });
    item.addEventListener("mouseleave", () => {
        item.querySelector(".work-link").style.color = "";
    });
});

/* ── PARALLAX ABOUT ── */

const aboutBgVideo = document.querySelector(".about-bg-video");
if (aboutBgVideo) {
    window.addEventListener("scroll", () => {
        const aboutSection = document.getElementById("sobre");
        if (!aboutSection) return;
        const rect = aboutSection.getBoundingClientRect();
        const rel  = -rect.top * 0.08;
        aboutBgVideo.style.transform = `translateY(${rel}px) scale(1.15)`;
    }, { passive: true });
}
