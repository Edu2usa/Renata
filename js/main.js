/* ===========================================
   Renata's Cleaning Services — JavaScript
   =========================================== */

'use strict';

// ---- Sticky Header ----
const header = document.getElementById('header');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  header.classList.toggle('scrolled', scrolled);
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
  // Animate hamburger bars
  const spans = hamburger.querySelectorAll('span');
  if (navMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close menu on nav link click
navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ---- Scroll to top ----
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Fade-up animation on scroll ----
const fadeEls = document.querySelectorAll(
  '.service-card, .area-card, .testimonial-card, .process-step, .value-item, .contact-detail, .section-header, .about__content, .about__image-wrap, .contact__info'
);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0 });

fadeEls.forEach(el => {
  // Only animate if element is below the fold; otherwise show immediately
  const rect = el.getBoundingClientRect();
  if (rect.top >= window.innerHeight) {
    el.classList.add('fade-up');
    observer.observe(el);
  }
});

// ---- Contact Form ----
const contactForm = document.getElementById('contactForm');

// Replace YOUR_FORM_ID with the ID from your Formspree dashboard
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  // Simple validation
  const required = contactForm.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#e05555';
      valid = false;
    }
  });

  if (!valid) {
    showToast('⚠️ Please fill in all required fields.', '#c0392b');
    return;
  }

  const submitBtn = contactForm.querySelector('[type="submit"]');
  const origText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const data = new FormData(contactForm);
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      contactForm.reset();
      showToast('✅ Thanks! Renata will contact you within 24 hours.');
    } else {
      showToast('❌ Something went wrong. Please call (203) 942-5529.', '#c0392b');
    }
  } catch {
    showToast('❌ Something went wrong. Please call (203) 942-5529.', '#c0392b');
  }

  submitBtn.disabled = false;
  submitBtn.textContent = origText;
});

function showToast(message, bg = 'var(--color-primary-dark)') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.background = bg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav__link[href="#${sec.id}"]`);
    if (!link) return;
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
