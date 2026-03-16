/* =============================
   DYNAMIC CONTENT RENDERING
   ============================= */
function renderPortfolio() {
  if (typeof portfolioData === 'undefined') return;

  // Render Research
  const researchList = document.querySelector('#research .research-list');
  if (researchList) {
    researchList.innerHTML = portfolioData.research.map(item => `
      <div class="research-item fade-up">
        <div class="ri-meta">
          <span class="ri-year">${item.year}</span>
          <span class="ri-role ri-role--${item.type}" data-en="${item.role}" data-ms="${item.roleMs}">${item.role}</span>
        </div>
        <div class="ri-body">
          <div class="ri-title" data-en="${item.titleEn}" data-ms="${item.titleMs}">${item.titleEn}</div>
        </div>
      </div>
    `).join('');
  }

  // Render Publications
  const pubList = document.querySelector('.pub-list-items');
  if (pubList) {
    pubList.innerHTML = portfolioData.publications.map(pub => {
      const onclickAttr = pub.pdf ? `style="cursor: pointer;" onclick="openPdfModal('${pub.pdf}', '${pub.title.replace(/'/g, "\\'")}')"` : '';
      const titleStyle = pub.pdf ? 'style="color: var(--gold); text-decoration: underline;"' : '';
      return `
        <div class="pub-item" data-index="${pub.index}" ${onclickAttr}>
          <span class="pub-badge pub-badge--${pub.badgeType}">${pub.badge}</span>
          <div class="pub-item-body">
            <div class="pub-item-title" ${titleStyle}>${pub.title}</div>
            <div class="pub-item-journal">${pub.journal}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Supervision
  const supList = document.querySelector('.sup-list');
  if (supList) {
    supList.innerHTML = portfolioData.supervision.map(sup => `
      <div class="sup-item ${sup.active ? '' : 'sup-item--completed'} fade-up">
        <div class="sup-status-dot ${sup.active ? 'sup-status-dot--active' : ''}"></div>
        <div class="sup-detail">
          <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.3rem;">${sup.name} 
            <span style="font-weight: 400; font-size: 0.8rem; color: var(--text-muted);">(${sup.year})</span>
          </div>
          <div class="sup-thesis">${sup.thesis}</div>
          <div class="sup-meta">
            ${sup.tags.map(tag => `<span class="sup-tag ${tag === 'International' ? 'sup-tag--intl' : (tag === 'Completed' ? 'sup-tag--done' : 'sup-tag--pending')}">${tag}</span>`).join('')}
            <span class="sup-role-tag">${sup.role}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Commercialisation
  const commList = document.querySelector('#commercialisation .research-list');
  if (commList) {
    const items = portfolioData.commercialisation.map(item => `
      <div class="research-item fade-up">
        <div class="ri-meta"><span class="ri-year">${item.year}</span><span class="ri-role ri-role--lead">Commercialization</span></div>
        <div class="ri-body">
          <div class="ri-title">${item.title}</div>
          <div class="ri-funder">Value: ${item.value}</div>
        </div>
      </div>
    `).join('');
    
    // Add Total
    const totalValue = portfolioData.commercialisation.reduce((acc, curr) => acc + parseFloat(curr.value.replace(/RM\s|,/g, '')), 0);
    const totalHtml = `
      <div class="research-item fade-up" style="border-left: 4px solid var(--gold); background: var(--bg-secondary);">
        <div class="ri-meta"><span class="ri-year">Total</span><span class="ri-role ri-role--lead">Value</span></div>
        <div class="ri-body">
          <div class="ri-title" style="color: var(--text-primary);">Jumlah Keseluruhan (Total Commercialization Value)</div>
          <div class="ri-funder" style="font-weight: 700; font-size: 1.1rem; color: var(--gold);">RM ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        </div>
      </div>
    `;
    commList.innerHTML = items + totalHtml;
  }

  // Render Copyright
  const copyrightList = document.querySelector('#copyright .research-list');
  if (copyrightList) {
    copyrightList.innerHTML = portfolioData.copyright.map(item => `
      <div class="research-item fade-up">
        <div class="ri-meta"><span class="ri-year">${item.year}</span><span class="ri-role ri-role--member">IP Registration</span></div>
        <div class="ri-body"><div class="ri-title">${item.title}</div></div>
      </div>
    `).join('');
  }

  // Render Awards
  const awardsGrid = document.querySelector('#awards .awards-grid');
  if (awardsGrid) {
    awardsGrid.innerHTML = portfolioData.awards.map(item => `
      <div class="award-card fade-up">
        <div class="award-detail">
          <div class="award-title">${item.title}</div>
          <div class="award-event">${item.event}</div>
          <div class="award-meta"><span class="award-year">${item.year}</span></div>
        </div>
      </div>
    `).join('');
  }

  // Render Contributions
  const contribGrid = document.querySelector('#contributions .awards-grid');
  if (contribGrid) {
    contribGrid.innerHTML = portfolioData.contributions.map(item => `
      <div class="award-card fade-up">
        <div class="award-detail">
          <div class="award-title">${item.title}</div>
          <div class="award-event">${item.event}</div>
          <div class="award-meta"><span class="award-year">${item.year}</span></div>
        </div>
      </div>
    `).join('');
  }

  // Re-run language application for dynamic items
  applyLang(localStorage.getItem('lang') || 'en');
  
  // Re-observe dynamic elements for animation
  const dynamicEls = document.querySelectorAll('.research-item, .pub-item, .sup-item, .award-card');
  dynamicEls.forEach(el => observer.observe(el));
}

/* =============================
   PDF MODAL
   ============================= */
function openPdfModal(pdfPath, title) {
  const modal = document.getElementById('pdfModal');
  const iframe = document.getElementById('pdfIframe');
  const skeleton = document.getElementById('pdfSkeleton');
  
  document.getElementById('pdfModalTitle').innerText = title;
  document.getElementById('pdfDownloadLink').href = pdfPath;
  
  // Reset state
  skeleton.style.display = 'flex';
  iframe.classList.remove('loaded');
  iframe.src = pdfPath;
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; 

  // Iframe load listener
  iframe.onload = function() {
    skeleton.style.display = 'none';
    iframe.classList.add('loaded');
  };
}

function closePdfModal() {
  const modal = document.getElementById('pdfModal');
  const iframe = document.getElementById('pdfIframe');
  if (!modal) return;
  modal.style.display = 'none';
  iframe.src = ''; 
  iframe.classList.remove('loaded');
  document.body.style.overflow = 'auto'; 
}

// Close modal when clicking outside of the content
window.addEventListener('click', (event) => {
  const modal = document.getElementById('pdfModal');
  if (event.target == modal) {
    closePdfModal();
  }
});

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
  if (langLabel) langLabel.textContent = lang === 'en' ? 'BM' : 'EN';

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

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animEls.forEach((el, i) => {
  el.classList.add('fade-up');
  if (i % 3 === 1) el.classList.add('delay-1');
  if (i % 3 === 2) el.classList.add('delay-2');
  observer.observe(el);
});

const slideEls = document.querySelectorAll('.timeline-item');
slideEls.forEach((el, i) => {
  el.classList.add('slide-in-right');
  if (i === 1) el.classList.add('delay-1');
  if (i === 2) el.classList.add('delay-2');
  observer.observe(el);
});

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
        document.querySelectorAll('.impact-num[data-target]').forEach(el => {
          animateCounter(el, parseInt(el.getAttribute('data-target')));
        });
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
const dropdownSections = ['consultation', 'publication', 'supervision', 'commercialisation', 'copyright', 'awards', 'contributions', 'contact'];
const allSpySections = ['about', 'expertise', 'roles', 'qualification', 'research', ...dropdownSections];

function updateScrollSpy() {
  const scrollY = window.scrollY + 120;
  let activeId = null;

  for (const id of allSpySections) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) {
      activeId = id;
    }
  }

  const isDropdown = dropdownSections.includes(activeId);

  document.querySelectorAll('.nav-links > li > a').forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    if (href === activeId) link.classList.add('active');
    else link.classList.remove('active');
  });

  if (navMoreBtn) {
    if (isDropdown) navMoreBtn.classList.add('active');
    else navMoreBtn.classList.remove('active');
  }

  document.querySelectorAll('.mobile-menu a').forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    if (href === activeId) link.classList.add('active');
    else link.classList.remove('active');
  });

  document.querySelectorAll('.mobile-tab-bar .tab-item').forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    let isActive = false;
    if (href === 'hero' && (!activeId || activeId === 'hero' || activeId === 'about')) isActive = true;
    if (href === 'expertise' && (activeId === 'expertise' || activeId === 'impact' || activeId === 'roles')) isActive = true;
    if (href === 'research' && (activeId === 'research' || activeId === 'publication' || activeId === 'supervision' || activeId === 'qualification' || activeId === 'awards')) isActive = true;
    if (href === 'contact' && activeId === 'contact') isActive = true;

    if (isActive) link.classList.add('active');
    else link.classList.remove('active');
  });
}

window.addEventListener('scroll', updateScrollSpy, { passive: true });

/* =============================
   EXPERTISE PROGRESS BAR ANIMATION
   ============================= */
document.querySelectorAll('.exp-progress-fill').forEach(fill => {
  const pct = fill.getAttribute('data-width');
  fill.style.setProperty('--bar-w', pct + '%');
});

/* =============================
   PUBLICATION FILTER
   ============================= */
const pubFilterBtns = document.querySelectorAll('.pub-filter-btn');
pubFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pubFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.pub-list-items .pub-item').forEach(item => {
      if (filter === 'all' || item.getAttribute('data-index') === filter) item.classList.remove('hidden');
      else item.classList.add('hidden');
    });
  });
});

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
  let roleIndex = 0, charIndex = 0, isDeleting = false;
  function type() {
    const lang = html.getAttribute('data-lang') || 'en';
    const currentRole = roles[roleIndex][lang];
    if (isDeleting) {
      typeText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typeText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }
    let speed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentRole.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 500;
    }
    typeText.setAttribute('data-en', roles[roleIndex].en);
    typeText.setAttribute('data-ms', roles[roleIndex].ms);
    setTimeout(type, speed);
  }
  setTimeout(type, 2000);
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
      links: { enable: true, distance: 150, color: "#c8a96e", opacity: 0.15, width: 1 },
      move: { enable: true, speed: 0.6, direction: "none", random: true, straight: false, outModes: "out" }
    },
    interactivity: { events: { onHover: { enable: true, mode: "grab" }, resize: true }, modes: { grab: { distance: 140, links: { opacity: 0.3 } } } },
    retina_detect: true, background: { color: "transparent" }
  });
}

/* =============================
   ABOUT SECTION READ MORE
   ============================= */
const aboutReadMoreBtn = document.getElementById('about-read-more');
const aboutExtra = document.getElementById('about-extra');
if (aboutReadMoreBtn && aboutExtra) {
  aboutReadMoreBtn.addEventListener('click', () => {
    const isHidden = aboutExtra.style.display === 'none';
    const lang = html.getAttribute('data-lang') || 'en';
    const btnSpan = aboutReadMoreBtn.querySelector('span');
    if (isHidden) {
      aboutExtra.style.display = 'block';
      if (btnSpan) {
        btnSpan.setAttribute('data-en', 'Show Less');
        btnSpan.setAttribute('data-ms', 'Tutup');
        btnSpan.textContent = lang === 'en' ? 'Show Less' : 'Tutup';
      }
    } else {
      aboutExtra.style.display = 'none';
      if (btnSpan) {
        btnSpan.setAttribute('data-en', 'Read More');
        btnSpan.setAttribute('data-ms', 'Baca Lanjut');
        btnSpan.textContent = lang === 'en' ? 'Read More' : 'Baca Lanjut';
      }
      window.scrollTo({ top: document.getElementById('about').offsetTop - 80, behavior: 'smooth' });
    }
  });
}

/* =============================
   INITIALIZE
   ============================= */
document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
  updateScrollSpy();
});
