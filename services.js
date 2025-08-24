// services.js
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
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

  // ===== Reveal animations =====
  // Vision steps (right-slide)
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.style.transition = 'transform 600ms cubic-bezier(.2,.75,.2,1), opacity 600ms';
      el.style.transform = 'translate(0,0)';
      el.style.opacity = '1';
      revealIO.unobserve(el);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal-right').forEach((el, idx) => {
    el.style.transform = 'translateX(24px)';
    el.style.opacity = '0';
    el.style.transitionDelay = `${idx * 80}ms`;
    revealIO.observe(el);
  });

  // White lists (up-fade using anime.js when each row enters)
  const rowIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const row = e.target;
      const items = row.querySelectorAll('.svc-list li');
      if (items.length) {
        anime({
          targets: items,
          opacity: [0, 1],
          translateY: [10, 0],
          easing: 'easeOutCubic',
          duration: 550,
          delay: anime.stagger(45)
        });
      }
      rowIO.unobserve(row);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.svc-row').forEach(r => rowIO.observe(r));

  // ===== Underline animation on sticky headings (GSAP) =====
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.svc-row').forEach((row) => {
      const h = row.querySelector('.svc-h');
      if (!h) return;

      // Animate CSS var --u from 0 to 1 while row is in view
      gsap.fromTo(h, { '--u': 0 }, {
        '--u': 1,
        ease: 'none',
        scrollTrigger: {
          trigger: row,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: true
        }
      });
    });
  }
});
