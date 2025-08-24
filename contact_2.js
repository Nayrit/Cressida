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

  // Ensure the close button always works (and isn't blocked by overlays)
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    // Explicit navigation on click
    closeBtn.addEventListener('click', (e) => {
      // if it's an anchor, let it navigate; we just ensure nothing blocks it
      e.stopPropagation();
      // no preventDefault -> anchor href will navigate
    });

    // Keyboard support
    closeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = closeBtn.getAttribute('href') || 'contact.html';
      }
    });
  }

  // Animate cards entrance
  if (window.anime) {
    anime({
      targets: '.card',
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutCubic',
      duration: 800,
      delay: anime.stagger(150)
    });
  }

  // Subtle floating effect
  if (window.gsap) {
    gsap.to('.card', {
      y: -8,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      stagger: { each: 0.2, yoyo: true }
    });
  }

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
