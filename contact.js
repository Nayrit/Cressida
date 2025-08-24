document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle — same behavior as your other pages
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const opening = !nav.classList.contains('active');
      toggle.setAttribute('aria-expanded', String(opening));
      nav.classList.toggle('active', opening);
      document.body.style.overflow = opening ? 'hidden' : '';
    });
  }

  // Animate title + CTA in (Anime.js)
  const heroBits = document.querySelectorAll('.contact-title, .cta');
  if (heroBits.length && window.anime) {
    anime({
      targets: heroBits,
      opacity: [0, 1],
      translateY: [16, 0],
      easing: 'easeOutCubic',
      duration: 650,
      delay: anime.stagger(90)
    });
  }

  // Gentle breathing on CTA (GSAP)
  if (window.gsap) {
    gsap.to('.cta', { scale: 1.02, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Accessibility: focus main after load
  const main = document.getElementById('main');
  if (main) window.setTimeout(() => main.focus(), 120);
});
