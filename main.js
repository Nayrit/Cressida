document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------
  // Mobile menu (a11y + scroll lock)
  // ------------------------------
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navContainer = document.getElementById('primary-nav');
  const body = document.body;

  function setMenuOpen(isOpen) {
    if (!mobileToggle || !navContainer) return;
    navContainer.hidden = !isOpen;
    navContainer.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
    body.style.overflow = isOpen ? 'hidden' : '';
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-xmark', isOpen);
      icon.classList.add('fa-solid');
    }
    if (isOpen) {
      const firstLink = navContainer.querySelector('.nav-link');
      firstLink && firstLink.focus();
    } else {
      mobileToggle.focus();
    }
  }

  function syncNavToViewport() {
    if (!navContainer) return;
    if (window.innerWidth >= 992) {
      navContainer.hidden = false;
      navContainer.classList.remove('active');
      mobileToggle?.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    } else if (!navContainer.classList.contains('active')) {
      navContainer.hidden = true;
    }
  }

  mobileToggle?.addEventListener('click', () => setMenuOpen(navContainer?.hidden));

  document.addEventListener('keydown', (e) => {
    if (!navContainer || navContainer.hidden) return;
    if (e.key === 'Escape') { setMenuOpen(false); return; }
    if (e.key === 'Tab') {
      const focusables = navContainer.querySelectorAll('a, button');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  navContainer?.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.classList && t.classList.contains('nav-link') && window.innerWidth <= 768) {
      setMenuOpen(false);
    }
  });

  syncNavToViewport();
  window.addEventListener('resize', syncNavToViewport);

  // ------------------------------
  // Gradient "interactive" bubble
  // ------------------------------
  const interBubble = document.querySelector('.interactive');
  let curX = 0, curY = 0, tgX = 0, tgY = 0;

  function move() {
    curX += (tgX - curX) / 20;
    curY += (tgY - curY) / 20;
    if (interBubble) {
      interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    }
    requestAnimationFrame(move);
  }

  window.addEventListener('mousemove', (event) => {
    tgX = event.clientX;
    tgY = event.clientY;
  }, { passive: true });

  if (interBubble) move();

  // ------------------------------
  // Glass cursor + dual-language reveal (no "stuck hole")
  // ------------------------------
  const lens = document.getElementById('reveal-lens');
  const lensContent = document.getElementById('reveal-content');
  const textContainer = document.querySelector('.text-container');
  const englishImage = document.querySelector('.english-layer .text-image');
  const englishLayer = document.querySelector('.english-layer');
  const japaneseImageSrc = document.querySelector('.japanese-layer .text-image')?.src;

  // keep lens always visible (it's the "glass cursor")
  if (lens) {
    lens.style.opacity = '1';
  }

  function collapseMaskOnly() {
    // Collapse the mask so the English text is not punched out,
    // but keep the lens itself visible.
    if (!englishLayer || !lens || !lensContent) return;
    lensContent.style.visibility = 'hidden';
    lensContent.style.opacity = '0';
    englishLayer.style.setProperty('--mask-size', `0px`);
    // keep a subtle glass look even off-hero
    lens.style.backdropFilter = 'saturate(180%) contrast(120%)';
  }

  if (lens && lensContent && textContainer && englishImage && englishLayer && japaneseImageSrc) {
    const japaneseClone = document.createElement('img');
    japaneseClone.src = japaneseImageSrc;
    lensContent.appendChild(japaneseClone);

    let textRect = null;
    const updateTextRect = () => { textRect = textContainer.getBoundingClientRect(); };

    const getLensSize = () =>
      (window.innerWidth <= 576 ? 100 : (window.innerWidth <= 768 ? 150 : 220));

    function updateLens(x, y) {
      if (!lens) return;

      // always move the glass cursor
      const lensSize = getLensSize();
      lens.style.width = `${lensSize}px`;
      lens.style.height = `${lensSize}px`;
      lens.style.left = `${x}px`;
      lens.style.top = `${y}px`;

      if (!textRect) { collapseMaskOnly(); return; }

      const over =
        x >= textRect.left && x <= textRect.right &&
        y >= textRect.top && y <= textRect.bottom;

      if (!over) {
        // outside hero text: keep cursor, remove reveal effect
        collapseMaskOnly();
        return;
      }

      // inside hero text: show reveal
      const maskX = x - textRect.left;
      const maskY = y - textRect.top;

      englishLayer.style.setProperty('--mask-size', `${lensSize / 2}px`);
      englishLayer.style.setProperty('--mask-x', `${maskX}px`);
      englishLayer.style.setProperty('--mask-y', `${maskY}px`);

      lensContent.style.visibility = 'visible';
      lensContent.style.opacity = '1';
      lens.style.backdropFilter = 'blur(5px) saturate(200%) contrast(120%)';

      japaneseClone.style.width = `${englishImage.offsetWidth}px`;
      japaneseClone.style.height = `${englishImage.offsetHeight}px`;
      const cloneX = textRect.left - (x - lensSize / 2);
      const cloneY = textRect.top - (y - lensSize / 2);
      japaneseClone.style.left = `${cloneX}px`;
      japaneseClone.style.top = `${cloneY}px`;
    }

    document.addEventListener('mousemove', (e) => {
      // update rect lazily the first time and on resize/scroll
      if (!textRect) updateTextRect();
      requestAnimationFrame(() => updateLens(e.clientX, e.clientY));
    });

    window.addEventListener('scroll', () => {
      // on scroll, ensure no crop remains, but keep cursor
      collapseMaskOnly();
      requestAnimationFrame(updateTextRect);
    }, { passive: true });

    const ro = new ResizeObserver(updateTextRect);
    ro.observe(textContainer);

    if (englishImage.complete) updateTextRect();
    else englishImage.onload = updateTextRect;
  } else {
    console.warn('Glass cursor / reveal: missing elements; running in cursor-only mode.');
    // Still keep the glass cursor following the mouse even if reveal can’t init
    document.addEventListener('mousemove', (e) => {
      requestAnimationFrame(() => {
        if (!lens) return;
        const size = (window.innerWidth <= 576 ? 100 : (window.innerWidth <= 768 ? 150 : 220));
        lens.style.width = `${size}px`;
        lens.style.height = `${size}px`;
        lens.style.left = `${e.clientX}px`;
        lens.style.top = `${e.clientY}px`;
        lens.style.backdropFilter = 'saturate(180%) contrast(120%)';
      });
    });
  }

  // ------------------------------
  // Nav link hover animation (Anime.js) with a11y
  // ------------------------------
  const animatedNavLinks = document.querySelectorAll('.nav-link');
  animatedNavLinks.forEach(link => {
    const originalText = link.textContent;
    link.setAttribute('aria-label', originalText);
    const letters = originalText
      .split('')
      .map(ch => `<span class="letter" aria-hidden="true">${ch}</span>`)
      .join('');
    link.innerHTML = letters;

    link.addEventListener('mouseenter', () => {
      anime.remove(link.querySelectorAll('.letter'));
      anime({
        targets: link.querySelectorAll('.letter'),
        translateY: [0, -10, 0],
        opacity: [1, 0.5, 1],
        scale: [1, 1.2, 1],
        delay: anime.stagger(30),
        easing: 'easeOutQuad'
      });
    });
  });

  // ------------------------------
  // GSAP horizontal scroll (desktop only) + color theming
  // ------------------------------
  gsap.registerPlugin(ScrollTrigger);

  const track = document.querySelector('.projects-track');
  const panels = gsap.utils.toArray('.project-panel');
  const rootStyles = getComputedStyle(document.documentElement);

  // Auto width based on panel count (fallback CSS is 400%)
  if (track && panels.length) {
    track.style.width = `${panels.length * 100}vw`;
  }

  const applyPanelColors = (id) => {
    if (!id) return;
    gsap.to('.services-page-colors', {
      '--color-bg1': rootStyles.getPropertyValue(`--panel-${id}-bg1`).trim(),
      '--color-bg2': rootStyles.getPropertyValue(`--panel-${id}-bg2`).trim(),
      '--color1': rootStyles.getPropertyValue(`--panel-${id}-c1`).trim(),
      '--color2': rootStyles.getPropertyValue(`--panel-${id}-c2`).trim(),
      '--color3': rootStyles.getPropertyValue(`--panel-${id}-c3`).trim(),
      '--color4': rootStyles.getPropertyValue(`--panel-${id}-c4`).trim(),
      '--color5': rootStyles.getPropertyValue(`--panel-${id}-c5`).trim(),
      '--color-interactive': rootStyles.getPropertyValue(`--panel-${id}-interactive`).trim(),
      duration: 0.6, ease: 'power1.inOut'
    });
  };

  const applyDefaultColors = () => {
    gsap.to('.services-page-colors', {
      '--color-bg1': rootStyles.getPropertyValue('--color-bg1-default').trim(),
      '--color-bg2': rootStyles.getPropertyValue('--color-bg2-default').trim(),
      '--color1': rootStyles.getPropertyValue('--color1-default').trim(),
      '--color2': rootStyles.getPropertyValue('--color2-default').trim(),
      '--color3': rootStyles.getPropertyValue('--color3-default').trim(),
      '--color4': rootStyles.getPropertyValue('--color4-default').trim(),
      '--color5': rootStyles.getPropertyValue('--color5-default').trim(),
      '--color-interactive': rootStyles.getPropertyValue('--color-interactive-default').trim(),
      duration: 0.6, ease: 'power1.inOut'
    });
  };

  ScrollTrigger.matchMedia({
    // Desktop: pinned horizontal scroll
    '(min-width: 992px)': function () {
      if (!track || !panels.length) return;

      const horizontalScroll = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: '.projects-section-horizontal',
          pin: true,
          scrub: 1,
          end: () => '+=' + (track.scrollWidth - window.innerWidth),
          invalidateOnRefresh: true
        }
      });

      // DO NOT apply panel 1 colors immediately on load.
      // Only switch when you actually enter/leave the horizontal section.
      ScrollTrigger.create({
        trigger: '.projects-section-horizontal',
        start: 'top top',
        end: () => '+=' + (track.scrollWidth - window.innerWidth),
        onEnter: () => applyPanelColors('1'),
        onLeave: () => applyDefaultColors(),
        onEnterBack: () => applyPanelColors(String(panels.length)),
        onLeaveBack: () => applyDefaultColors()
      });

      // Per-panel color changes, eager start so it feels immediate
      panels.forEach((panel) => {
        const id = panel.dataset.panelId;
        if (!id) return;
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: horizontalScroll,
          start: 'left 85%',
          end: 'right 15%',
          onEnter: () => applyPanelColors(id),
          onEnterBack: () => applyPanelColors(id)
        });
      });
    },

    // Mobile/tablet: no pinning; ensure colors reset
    '(max-width: 991.98px)': function () {
      applyDefaultColors();
    }
  });
});
