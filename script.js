/* =============================
   LANGUAGE TOGGLE
   ============================= */
const html = document.documentElement;
const langToggle = document.getElementById('lang-toggle');
const langLabel = document.getElementById('lang-label');

let currentLang = localStorage.getItem('lang') || 'en';
applyLang(currentLang);

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ms' : 'en';
  localStorage.setItem('lang', currentLang);
  applyLang(currentLang);
});

function applyLang(lang) {
  html.setAttribute('data-lang', lang);
  langLabel.textContent = lang === 'en' ? 'BM' : 'EN';

  document.querySelectorAll('[data-en][data-ms]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });
}

/* =============================
   THEME TOGGLE
   ============================= */
const themeToggle = document.getElementById('theme-toggle');
let currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
});

/* =============================
   NAVBAR SCROLL
   ============================= */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* =============================
   MOBILE MENU
   ============================= */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileDropdownBtn = document.getElementById('mobile-dropdown-btn');
const mobileDropdownMenu = document.getElementById('mobile-dropdown-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

if (mobileDropdownBtn && mobileDropdownMenu) {
  mobileDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mobileDropdownMenu.classList.toggle('open');
    mobileDropdownBtn.setAttribute('aria-expanded', isOpen);
  });
}

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    if (mobileDropdownMenu) {
      mobileDropdownMenu.classList.remove('open');
      if (mobileDropdownBtn) mobileDropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });
});

/* =============================
   DROPDOWN NAV
   ============================= */
const navMoreBtn = document.getElementById('nav-more-btn');
const navDropdownMenu = document.getElementById('nav-dropdown-menu');

navMoreBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = navDropdownMenu.classList.toggle('open');
  navMoreBtn.setAttribute('aria-expanded', isOpen);
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
  navDropdownMenu.classList.remove('open');
  navMoreBtn.setAttribute('aria-expanded', 'false');
});

// Close dropdown on link click & close mobile menu too
navDropdownMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navDropdownMenu.classList.remove('open');
    navMoreBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
  });
});

/* =============================
   SMOOTH SCROLL OFFSET
   ============================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =============================
   SCROLL ANIMATIONS
   ============================= */
const animEls = document.querySelectorAll('.stat-card, .expertise-card, .contact-wrapper, .about-text, .about-stats, .section-header, .research-stat-card, .research-item, .qual-card, .sup-item, .consult-client-card, .award-card, .impact-card, .social-btn');

// Add fade-up class
animEls.forEach((el, i) => {
  el.classList.add('fade-up');
  // Add staggered delays for a subtle branching effect
  if (i % 3 === 1) el.classList.add('delay-1');
  if (i % 3 === 2) el.classList.add('delay-2');
});

const slideEls = document.querySelectorAll('.timeline-item');
slideEls.forEach((el, i) => {
  el.classList.add('slide-in-right');
  if (i === 1) el.classList.add('delay-1');
  if (i === 2) el.classList.add('delay-2');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animEls.forEach(el => observer.observe(el));
slideEls.forEach(el => observer.observe(el));

/* =============================
   IMPACT COUNTER ANIMATION
   ============================= */
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start);
  }, 16);
}

const impactSection = document.getElementById('impact');
if (impactSection) {
  let counted = false;
  const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        // Animate .impact-num elements
        document.querySelectorAll('.impact-num[data-target]').forEach(el => {
          animateCounter(el, parseInt(el.getAttribute('data-target')));
        });
        // Animate .split-num elements
        document.querySelectorAll('.split-num[data-target]').forEach(el => {
          animateCounter(el, parseInt(el.getAttribute('data-target')));
        });
      }
    });
  }, { threshold: 0.3 });
  impactObserver.observe(impactSection);
}

/* =============================
   BACK TO TOP
   ============================= */
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================
   SCROLL-SPY NAV HIGHLIGHT
   ============================= */
// All section IDs that have nav links
const mainNavSections = ['about', 'expertise', 'roles', 'research', 'qualification'];
const dropdownSections = ['publication', 'commercialisation', 'supervision', 'consultation', 'awards', 'membership', 'contact'];
const allSpySections = [...mainNavSections, ...dropdownSections];

const mainNavLinks = document.querySelectorAll('.nav-links > a');
const mobileLinks = document.querySelectorAll('.mobile-menu a');
// navMoreBtn already declared above in DROPDOWN NAV section


function getActiveSectionId() {
  const scrollY = window.scrollY + 120; // offset for navbar height
  let activeId = null;

  for (const id of allSpySections) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) {
      activeId = id;
    }
  }
  return activeId;
}

function updateScrollSpy() {
  const activeId = getActiveSectionId();
  const isDropdown = dropdownSections.includes(activeId);

  // Update main nav links (desktop)
  mainNavLinks.forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    if (href === activeId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Highlight "More" button if active section is inside dropdown
  if (navMoreBtn) {
    if (isDropdown) {
      navMoreBtn.classList.add('active');
    } else {
      navMoreBtn.classList.remove('active');
    }
  }

  // Update mobile menu links
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    if (href === activeId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update mobile bottom tab bar links
  const bottomNavLinks = document.querySelectorAll('.mobile-tab-bar .tab-item');
  bottomNavLinks.forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    let isActive = false;

    // Logic to map the many sections to the 4 bottom tabs
    if (href === 'hero' && (!activeId || activeId === 'hero' || activeId === 'about')) isActive = true;
    if (href === 'expertise' && (activeId === 'expertise' || activeId === 'impact' || activeId === 'roles')) isActive = true;
    if (href === 'research' && (activeId === 'research' || activeId === 'publication' || activeId === 'supervision' || activeId === 'qualification' || activeId === 'awards')) isActive = true;
    if (href === 'contact' && activeId === 'contact') isActive = true;

    if (isActive) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Run on scroll and on load
window.addEventListener('scroll', updateScrollSpy, { passive: true });
updateScrollSpy();

/* =============================
   TYPEWRITER EFFECT
   ============================= */
const typeText = document.querySelector('.typewriter-text');
if (typeText) {
  const roles = [
    { en: "Director, Alumni Centre", ms: "Pengarah, Pusat Alumni" },
    { en: "University Lecturer", ms: "Pensyarah Universiti" },
    { en: "Industry Consultant", ms: "Perunding Industri" },
    { en: "Sports Researcher", ms: "Penyelidik Sukan" }
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  let erasingDelay = 50;
  let newTextDelay = 2000;

  function type() {
    const currentLang = html.getAttribute('data-lang') || 'en';
    const currentRole = roles[roleIndex][currentLang];

    if (isDeleting) {
      typeText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typeText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = newTextDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500; // Small pause before typing next word
    }

    // Explicitly update data attributes to keep lang toggle in sync
    typeText.setAttribute('data-en', roles[roleIndex].en);
    typeText.setAttribute('data-ms', roles[roleIndex].ms);

    setTimeout(type, typeSpeed);
  }

  // Initial call after small delay
  setTimeout(type, newTextDelay);
}

/* =============================
   TSPARTICLES BACKGROUND
   ============================= */
if (typeof tsParticles !== 'undefined') {
  tsParticles.load("tsparticles", {
    fullScreen: { enable: false },
    particles: {
      number: { value: 40, density: { enable: true, area: 800 } },
      color: { value: "#c8a96e" },
      shape: { type: "circle" },
      opacity: { value: 0.3 },
      size: { value: { min: 1, max: 2 } },
      links: {
        enable: true,
        distance: 150,
        color: "#c8a96e",
        opacity: 0.15,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: "none",
        random: true,
        straight: false,
        outModes: "out"
      }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        resize: true
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.3 } }
      }
    },
    retina_detect: true,
    background: {
      color: "transparent"
    }
  });

  // Theme listener to adjust particle colors slightly
  const observer = new MutationObserver(() => {
    const pInst = tsParticles.domItem(0);
    if (pInst) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      pInst.options.particles.color.value = isDark ? "#c8a96e" : "#1e3050";
      pInst.options.particles.links.color = isDark ? "#c8a96e" : "#1e3050";
      pInst.options.particles.opacity.value = isDark ? 0.3 : 0.15;
      pInst.options.particles.links.opacity = isDark ? 0.15 : 0.08;
      pInst.refresh();
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
