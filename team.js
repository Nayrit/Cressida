document.addEventListener('DOMContentLoaded', () => {
  // Mark page as animation-enabled (so CSS start states apply)
  document.body.classList.add('has-anim');

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

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ===== GSAP reveals + parallax =====
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.member-section').forEach((section, idx) => {
      const wrap = section.querySelector('.member-in');
      const nameEl = wrap.querySelector('.member-name');
      const copyBox = wrap.querySelector('.member-copy');
      const copyPs  = copyBox ? copyBox.querySelectorAll('p') : [];
      const portrait = wrap.querySelector('.member-portrait');

      // Safe start states (ensure parent boxes are animated, not only <p>)
      gsap.set([nameEl, copyBox, portrait], {autoAlpha:0, y:18});

      const tl = gsap.timeline({
        defaults: {ease:'power2.out'},
        scrollTrigger: {
          trigger: section,
          start: 'top 68%',
          end: 'top 10%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.to(nameEl, {autoAlpha:1, y:0, duration:0.5})
        .to(copyBox, {autoAlpha:1, y:0, duration:0.5}, '-=0.25')
        .from(copyPs, {autoAlpha:0, y:8, duration:0.5, stagger:0.08}, '<0.05')
        .to(portrait, {autoAlpha:1, y:0, duration:0.6}, '-=0.35');

      // Parallax (alternate direction by section)
      const dir = idx % 2 === 0 ? -12 : 12;
      gsap.to(portrait, {
        y: dir,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  } else {
    // If GSAP missing, don’t hide content
    document.body.classList.remove('has-anim');
  }

  // ===== Magnetic tilt on portraits (desktop only) =====
  const canHover = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (canHover && window.gsap) {
    document.querySelectorAll('.member-portrait').forEach(card => {
      const qx = gsap.quickTo(card, 'rotateY', {duration:0.4, ease:'power3.out'});
      const qy = gsap.quickTo(card, 'rotateX', {duration:0.4, ease:'power3.out'});
      const qt = gsap.quickTo(card, 'y', {duration:0.4, ease:'power3.out'});

      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const cx = e.clientX - r.left;
        const cy = e.clientY - r.top;
        const rx = ((cy / r.height) - 0.5) * -10;
        const ry = ((cx / r.width)  - 0.5) *  12;
        qx(ry); qy(rx); qt(-2);
      };
      const onLeave = () => { qx(0); qy(0); qt(0); };

      card.style.transformPerspective = '800px';
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  // ===== Name word fade (Anime.js) =====
  if (window.anime) {
    document.querySelectorAll('.member-name').forEach(h => {
      const words = h.textContent.trim().split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
      h.innerHTML = words;
    });

    const runNameAnim = (el) => anime({
      targets: el.querySelectorAll('.w'),
      translateY: ['0.4em', '0em'],
      opacity: [0, 1],
      easing: 'easeOutCubic',
      duration: 600,
      delay: anime.stagger(60)
    });

    // First visible
    const first = document.querySelector('.member-section .member-name');
    if (first) runNameAnim(first);

    // When sections enter
    if (window.gsap && window.ScrollTrigger) {
      document.querySelectorAll('.member-section').forEach(sec => {
        ScrollTrigger.create({
          trigger: sec, start: 'top 70%',
          once: true,
          onEnter: () => {
            const h = sec.querySelector('.member-name');
            if (h) runNameAnim(h);
          }
        });
      });
    }
  }
});
