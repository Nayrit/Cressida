document.addEventListener('DOMContentLoaded', () => {
  const steps = [...document.querySelectorAll('.wizard')];
  let current = 0;

  const animateIn = (el) => {
    if (!window.anime) return;
    anime({
      targets: el.querySelectorAll('.h-eyebrow, .service, .choice, .budget-wrap, .form-lines .line, .wizard-cta'),
      opacity: [0, 1],
      translateY: [16, 0],
      easing: 'easeOutCubic',
      duration: 600,
      delay: anime.stagger(60)
    });
  };

  const showStep = (i) => {
    steps.forEach((s, idx) => { s.hidden = idx !== i; });
    current = i;
    animateIn(steps[i]);
  };
  showStep(0);

  // Selectable services
  document.querySelectorAll('.service').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('is-selected'));
  });

  // Next buttons
  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (current < steps.length - 1) showStep(current + 1);
    });
  });

  // Budget slider label
  const range = document.getElementById('budgetRange');
  const label = document.getElementById('budgetNumber');
  const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  if (range && label){
    const sync = () => { label.textContent = fmt(+range.value); };
    range.addEventListener('input', sync);
    sync();
  }

  // Submit (replace with real backend later)
  const form = document.getElementById('wizardForm');
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      console.log('Wizard submission:', data);
      // On success, send them back or to a thank-you page:
      window.location.href = 'contact.html';
    });
  }
});
