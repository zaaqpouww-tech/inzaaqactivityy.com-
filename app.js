// ── Nav scrolled state ─────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Hamburger menu ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  navLinks.classList.contains('open')
    ? openHamburger(spans)
    : closeHamburger(spans);
});

function openHamburger(spans) {
  spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
  spans[1].style.opacity   = '0';
  spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
}

function closeHamburger(spans) {
  spans[0].style.transform = '';
  spans[1].style.opacity   = '';
  spans[2].style.transform = '';
}

// ── Section navigation ─────────────────────────
const sections = document.querySelectorAll('.section');
const navLinkEls = document.querySelectorAll('.nav-link');

// Smooth scroll to section from nav click
navLinkEls.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href').replace('#', '');
    scrollToSection(id);
    // Close mobile menu
    navLinks.classList.remove('open');
    closeHamburger(hamburger.querySelectorAll('span'));
  });
});

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// Global helper called by hero buttons
window.goTo = function(id) {
  scrollToSection(id);
};

// ── Active nav link on scroll ──────────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(sec => observer.observe(sec));

// ── Timeline items — fade in on scroll ─────────
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0');
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        timelineObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

timelineItems.forEach(item => timelineObserver.observe(item));

// ── Stat counter animation ─────────────────────
const statNums = document.querySelectorAll('.stat-num');

function animateCount(el, target, duration = 1800) {
  let start = null;
  const startVal = 0;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCount(entry.target, target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach(el => statsObserver.observe(el));

// ── Skill bars animation ───────────────────────
const skillFills = document.querySelectorAll('.skill-fill');

const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.dataset.width;
        setTimeout(() => {
          entry.target.style.width = width + '%';
        }, 200);
        skillsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

skillFills.forEach(el => skillsObserver.observe(el));

// ── Profile cards stagger animation ───────────
const profileCards = document.querySelectorAll('.profile-card');

const cardsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 100);
        cardsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

profileCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  cardsObserver.observe(card);
});

// ── Link cards stagger ─────────────────────────
const linkCards = document.querySelectorAll('.link-card');

const linksObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, i * 120);
        linksObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

linkCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateX(-20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, background 0.35s, border-color 0.35s, box-shadow 0.35s';
  linksObserver.observe(card);
});

// ── Hero content entrance ──────────────────────
function heroEntrance() {
  const heroContent = document.querySelector('.hero-content');
  const heroDeco    = document.querySelector('.hero-deco');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 200);
  }
  if (heroDeco) {
    heroDeco.style.opacity = '0';
    setTimeout(() => {
      heroDeco.style.transition = 'opacity 1.1s ease';
      heroDeco.style.opacity = '1';
    }, 500);
  }
}

// Run on load
document.addEventListener('DOMContentLoaded', heroEntrance);
