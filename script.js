/* =============================================
   SWEETIEFOX – script.js
   Scroll animations, navbar, interactions
   ============================================= */

'use strict';

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger hero reveals after loader
    triggerHeroReveal();
  }, 1600);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';

function triggerHeroReveal() {
  const heroItems = document.querySelectorAll('.hero .reveal');
  heroItems.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 150);
  });
}

/* ---- NAVBAR ---- */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  handleBackToTop();
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ---- SMOOTH SCROLL FOR NAV LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

/* ---- SCROLL REVEAL ANIMATION ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Add stagger for siblings
      const parent = entry.target.parentElement;
      if (parent) {
        const siblings = Array.from(parent.querySelectorAll('.reveal'));
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 80}ms`;
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

// Observe all reveal elements (excluding hero – handled separately)
document.querySelectorAll('.reveal').forEach(el => {
  if (!el.closest('.hero')) {
    revealObserver.observe(el);
  }
});

/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById('backToTop');

function handleBackToTop() {
  if (!backToTop) return;
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop && backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.4,
  rootMargin: '-80px 0px 0px 0px'
});

sections.forEach(section => sectionObserver.observe(section));

/* ---- COUNTER ANIMATION ---- */
function animateCounter(el, target, duration = 1800) {
  const suffix = el.dataset.suffix || '';
  let start = 0;
  const isDecimal = String(target).includes('.');
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);
    el.textContent = (isDecimal ? current.toFixed(0) : current) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(el => {
        const rawText = el.textContent.trim();
        const numPart = parseInt(rawText.replace(/\D/g, ''));
        const suffix = rawText.replace(/[0-9]/g, '');
        if (!isNaN(numPart)) {
          el.dataset.suffix = suffix;
          animateCounter(el, numPart);
        }
      });
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

/* ---- HOVER TILT ON CARDS ---- */
const tiltCards = document.querySelectorAll('.paket-card, .testi-card, .keunggulan-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- PAKET CARD – RESET TILT FOR FEATURED ---- */
const featuredCard = document.querySelector('.paket-card.featured');
if (featuredCard) {
  featuredCard.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const rect = featuredCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    featuredCard.style.transform = `scale(1.05) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  featuredCard.addEventListener('mouseleave', () => {
    featuredCard.style.transform = 'scale(1.05)';
  });
}

/* ---- FLOATING WA BUTTON PULSE ---- */
const waFloat = document.getElementById('waFloat');
if (waFloat) {
  // Extra attention pulse every 8 seconds
  setInterval(() => {
    waFloat.style.animation = 'none';
    waFloat.style.transform = 'scale(1.2)';
    setTimeout(() => {
      waFloat.style.transform = '';
    }, 200);
  }, 8000);
}

/* ---- HERO BADGE SPARKLE ---- */
const heroBadge = document.querySelector('.hero-badge');
if (heroBadge) {
  heroBadge.addEventListener('mouseenter', () => {
    heroBadge.textContent = '✨ Terpercaya · Profesional · Terjangkau ✨';
  });
  heroBadge.addEventListener('mouseleave', () => {
    heroBadge.textContent = '✨ Terpercaya · Profesional · Terjangkau';
  });
}

/* ---- ALUR ITEM SEQUENTIAL ANIMATION ---- */
const alurItems = document.querySelectorAll('.alur-item');
const alurObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = document.querySelectorAll('.alur-item');
      items.forEach((item, i) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, i * 100);
      });
      alurObserver.disconnect();
    }
  });
}, { threshold: 0.1 });

const alurSection = document.getElementById('alur');
if (alurSection) alurObserver.observe(alurSection);

/* ---- KEYBOARD ACCESSIBILITY ---- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (navLinks.classList.contains('open')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  }
});

/* ---- PERFORMANCE: Passive scroll listener ---- */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      // Already handled above
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

console.log('🦊 SweetieFox Website loaded! Siap go digital bareng kami~');
