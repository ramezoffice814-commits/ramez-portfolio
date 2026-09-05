// =====================================================
// RAMEZ PORTFOLIO (EN) — MAIN SCRIPT
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= PRELOADER ================= */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloaderFill');
    const percent = document.getElementById('preloaderPercent');
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 18 + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        gsap.to(fill, { width: '100%', duration: 0.3 });
        percent.textContent = '100%';
        setTimeout(hidePreloader, 350);
      } else {
        gsap.to(fill, { width: progress + '%', duration: 0.3 });
        percent.textContent = String(Math.floor(progress)).padStart(2, '0') + '%';
      }
    }, 180);

    function hidePreloader() {
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.classList.add('loaded');
          runHeroIntro();
        }
      });
    }
  }

  /* ================= CUSTOM CURSOR ================= */
  function initCursor() {
    if (window.matchMedia('(max-width: 860px)').matches) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      gsap.set(dot, { x: mx, y: my });
    });

    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      gsap.set(ring, { x: rx, y: ry });
    });

    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ================= BACKGROUND PARTICLES ================= */
  function initParticles() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let w, h, particles;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(70, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.4
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(109, 240, 255, 0.6)';

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(109, 240, 255, ${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    if (!reduceMotion) draw();
    window.addEventListener('resize', () => { resize(); createParticles(); });
  }

  /* ================= NAVBAR ================= */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navLinkEls = document.querySelectorAll('.nav-link');

    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: { targets: navbar, className: 'scrolled' }
    });

    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    navLinkEls.forEach(link => {
      link.addEventListener('click', () => links.classList.remove('open'));
    });

    const sections = document.querySelectorAll('main section[id]');
    sections.forEach(sec => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActive(sec.id),
        onEnterBack: () => setActive(sec.id)
      });
    });

    function setActive(id) {
      navLinkEls.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    }
  }

  /* ================= MAGNETIC BUTTONS ================= */
  function initMagnetic() {
    if (window.matchMedia('(max-width: 860px)').matches) return;
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power3.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ================= HERO INTRO ================= */
  function runHeroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0)
      .fromTo('.hero-title .line', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.1)
      .to('.hero-desc', { opacity: 1, y: 0, duration: 0.7 }, 0.55)
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.7 }, 0.68)
      .to('.info-strip', { opacity: 1, y: 0, duration: 0.7 }, 0.8);

    gsap.set(['.hero-eyebrow', '.hero-desc', '.hero-cta', '.info-strip'], { y: 30 });
  }

  /* ================= SCROLL REVEALS ================= */
  function initReveals() {
    document.querySelectorAll('.reveal-up').forEach(el => {
      if (el.closest('.hero')) return; // hero handled by intro timeline
      gsap.fromTo(el, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  }

  /* ================= WORK FILTER ================= */
  function initFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.work-card');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const match = filter === 'all' || card.getAttribute('data-category') === filter;
          if (match) {
            card.classList.remove('hide');
            gsap.fromTo(card, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
          } else {
            gsap.to(card, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => card.classList.add('hide') });
          }
        });
        ScrollTrigger.refresh();
      });
    });
  }

  /* ================= TILT CARDS ================= */
  function initTilt() {
    if (window.matchMedia('(max-width: 860px)').matches) return;
    document.querySelectorAll('.tilt').forEach(card => {
      const inner = card.querySelector('.work-card-inner');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(inner, {
          rotateY: x * 10,
          rotateX: -y * 10,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(inner, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
      });
    });
  }

  /* ================= CONTACT FORM ================= */
  function initForm() {
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"] span');
      const original = btn.textContent;
      btn.textContent = 'Sending...';

      setTimeout(() => {
        btn.textContent = original;
        note.textContent = 'Message received — I\'ll get back to you shortly. ✓';
        form.reset();
        setTimeout(() => note.textContent = '', 5000);
      }, 1200);
    });
  }

  /* ================= FOOTER / TO TOP ================= */
  function initFooter() {
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('toTop').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================= SMOOTH ANCHOR SCROLL ================= */
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ================= INIT ALL ================= */
  initCursor();
  initParticles();
  initNavbar();
  initMagnetic();
  initReveals();
  initFilter();
  initTilt();
  initForm();
  initFooter();
  initAnchorScroll();
  initPreloader();
});
