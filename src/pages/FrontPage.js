import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import {
  ArrowRight,
  BrainCircuit,
  Wand2,
  CalendarRange,
  Workflow,
  Clock3,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Play,
  Factory,
  Cog,
  HardHat,
  Package,
  Milk,
  Boxes,
  Store,
  ShoppingBag,
  ShoppingCart,
  Cpu,
  Laptop,
  Server,
  Pill,
  Stethoscope,
  FlaskConical,
} from 'lucide-react'
import * as images from '../assets/images'
import KeyBenefits from '../components/frontpage/KeyBenefits'
import FeaturesSlider from '../components/frontpage/FeaturesSlider'
import ArchitectureSection from '../components/frontpage/ArchitectureSection'
import { createPortal } from 'react-dom';
import LoginPopup from '../components/frontpage/LoginPopup';
import SignupPopup from '../components/frontpage/SignupPopup'

/* ============================================================
   Landing content — short, scannable. Edit here.
   ============================================================ */

const heroStats = [
  { value: '6+', label: 'Forecasting models', icon: BrainCircuit },
  { value: '3', label: 'Granularities supported', icon: CalendarRange },
  { value: '24/7', label: 'Scheduled automation', icon: Clock3 },
  { value: '100%', label: 'Data validation', icon: ShieldCheck },
];

// Ambient floating dots for the hero (fixed values so they don't jump per render).
const heroParticles = [
  { left: '4%', size: 6, delay: 0, duration: 15, opacity: 0.5 },
  { left: '9%', size: 4, delay: 3, duration: 18, opacity: 0.35 },
  { left: '15%', size: 7, delay: 1.5, duration: 14, opacity: 0.45 },
  { left: '21%', size: 5, delay: 4.5, duration: 16, opacity: 0.4 },
  { left: '27%', size: 6, delay: 0.8, duration: 13, opacity: 0.5 },
  { left: '33%', size: 4, delay: 3.5, duration: 19, opacity: 0.35 },
  { left: '39%', size: 8, delay: 2, duration: 15, opacity: 0.45 },
  { left: '45%', size: 5, delay: 5, duration: 17, opacity: 0.4 },
  { left: '50%', size: 6, delay: 1.2, duration: 13, opacity: 0.5 },
  { left: '55%', size: 4, delay: 4, duration: 18, opacity: 0.4 },
  { left: '61%', size: 7, delay: 2.6, duration: 14, opacity: 0.45 },
  { left: '67%', size: 5, delay: 0.5, duration: 16, opacity: 0.45 },
  { left: '72%', size: 6, delay: 3.2, duration: 14, opacity: 0.5 },
  { left: '77%', size: 4, delay: 5.5, duration: 19, opacity: 0.35 },
  { left: '82%', size: 7, delay: 1.8, duration: 15, opacity: 0.45 },
  { left: '87%', size: 5, delay: 4.2, duration: 17, opacity: 0.4 },
  { left: '91%', size: 6, delay: 2.4, duration: 14, opacity: 0.5 },
  { left: '95%', size: 4, delay: 0.9, duration: 18, opacity: 0.35 },
  { left: '98%', size: 6, delay: 3.8, duration: 16, opacity: 0.45 },
];

// Icons drawn strictly from the supported industries — Manufacturing, CPG,
// Retail, Technology, Pharma — floating and reacting to the cursor (antigravity).
const heroIcons = [
  // Manufacturing
  { key: 'mfg-factory', Icon: Factory, top: '13%', left: '6%', size: 30, depth: 42, delay: 0, duration: 7.5 },
  { key: 'mfg-cog', Icon: Cog, top: '18%', left: '47%', size: 26, depth: 30, delay: 2.1, duration: 7.6 },
  { key: 'mfg-hardhat', Icon: HardHat, top: '86%', left: '64%', size: 26, depth: 28, delay: 1.7, duration: 9 },
  // CPG (consumer packaged goods)
  { key: 'cpg-package', Icon: Package, top: '84%', left: '40%', size: 26, depth: 26, delay: 0.5, duration: 9.4 },
  { key: 'cpg-milk', Icon: Milk, top: '40%', left: '60%', size: 26, depth: 38, delay: 0.9, duration: 8.6 },
  { key: 'cpg-boxes', Icon: Boxes, top: '52%', left: '43%', size: 28, depth: 32, delay: 0.4, duration: 9.5 },
  // Retail
  { key: 'retail-store', Icon: Store, top: '30%', left: '18%', size: 28, depth: 36, delay: 0.8, duration: 7 },
  { key: 'retail-bag', Icon: ShoppingBag, top: '22%', left: '56%', size: 28, depth: 46, delay: 1.2, duration: 7.2 },
  { key: 'retail-cart', Icon: ShoppingCart, top: '68%', left: '10%', size: 26, depth: 28, delay: 1.6, duration: 8.5 },
  // Technology
  { key: 'tech-cpu', Icon: Cpu, top: '80%', left: '24%', size: 26, depth: 24, delay: 2.3, duration: 9 },
  { key: 'tech-laptop', Icon: Laptop, top: '46%', left: '13%', size: 28, depth: 34, delay: 1.1, duration: 8.2 },
  { key: 'tech-server', Icon: Server, top: '72%', left: '52%', size: 24, depth: 22, delay: 2, duration: 8.8 },
  // Pharma
  { key: 'pharma-pill', Icon: Pill, top: '9%', left: '33%', size: 26, depth: 40, delay: 1, duration: 8 },
  { key: 'pharma-stetho', Icon: Stethoscope, top: '60%', left: '71%', size: 26, depth: 32, delay: 2.4, duration: 8.4 },
  { key: 'pharma-flask', Icon: FlaskConical, top: '12%', left: '66%', size: 28, depth: 38, delay: 0.6, duration: 7.8 },
];

const differentiators = [
  {
    icon: BrainCircuit,
    title: 'Diverse Model Library',
    text: 'ARIMA, SARIMA, NBEATS, LightGBM, XGBoost, CatBoost, Holt-Winters & more.',
  },
  {
    icon: Wand2,
    title: 'Automatic Feature Selection',
    text: 'Let the engine surface the most relevant features for every series.',
  },
  {
    icon: CalendarRange,
    title: 'Flexible Granularity',
    text: 'Forecast daily, weekly, or monthly with adaptive data handling.',
  },
  {
    icon: Workflow,
    title: 'Deploy as Workflows',
    text: 'Promote chosen models into a smooth, repeatable forecasting pipeline.',
  },
  {
    icon: Clock3,
    title: 'Scheduled Refit & Forecast',
    text: 'Keep models aligned with evolving data through automated runs.',
  },
  {
    icon: BarChart3,
    title: 'Evaluation Metrics',
    text: 'Track RMSE, MAPE & MAE across training, validation and live test sets.',
  },
];

export default function Frontpage() {

  const [showLoginModal, setshowLoginModal] = useState(false);
  const [showSignupModal, setshowSignupModal] = useState(false);

  useEffect(() => {
    // Array of script sources
    const scripts = [
      'js/jquery.min.js',
      'js/js.js',
      'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.2.1/owl.carousel.min.js',
      'js/bannerslider.js',
      'js/menu.js',
      'js/keybenfitstab.js',
      'js/jquery.flexslider.js'
    ];

    // Function to load a script
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    // Load all scripts in order
    const loadScriptsSequentially = async () => {
      try {
        for (const script of scripts) {
          await loadScript(script);
        }
        //console.log('All scripts loaded successfully.');
      } catch (error) {
        console.error(error);
      }
    };

    loadScriptsSequentially();

    // Cleanup function to remove scripts on component unmount
    return () => {
      scripts.forEach((src) => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);

  // Scroll-reveal: fade/slide elements in as they enter the viewport.
  useEffect(() => {
    const revealEls = Array.from(document.querySelectorAll('.de-reveal'));
    if (revealEls.length === 0) return;

    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    revealEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Hero demo card follows the mouse while it moves over the hero, gently
  // drifting toward the cursor and easing back to centre on leave. The motion
  // is clamped so the card always stays inside the hero/header area.
  const demoCardRef = useRef(null);
  useEffect(() => {
    const card = demoCardRef.current;
    const hero = document.querySelector('.de-hero-art');
    if (!card || !hero) return;

    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const PAD = 10; // keep this much gap from the hero edges
    const EASE = 0.08; // lower = more lag / lazier follow
    let tx = 0;
    let ty = 0;
    let targetX = 0;
    let targetY = 0;
    let active = false;
    let frame = 0;

    const computeTarget = (e) => {
      const heroRect = hero.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      // The card's resting position (with current transform removed).
      const baseLeft = cardRect.left - tx;
      const baseTop = cardRect.top - ty;
      const baseCenterX = baseLeft + cardRect.width / 2;
      const baseCenterY = baseTop + cardRect.height / 2;
      // Move the card's centre toward the cursor.
      let desiredTx = e.clientX - baseCenterX;
      let desiredTy = e.clientY - baseCenterY;
      // Clamp so the whole card stays inside the robot-image area.
      const minTx = heroRect.left + PAD - baseLeft;
      const maxTx = heroRect.right - PAD - (baseLeft + cardRect.width);
      const minTy = heroRect.top + PAD - baseTop;
      const maxTy = heroRect.bottom - PAD - (baseTop + cardRect.height);
      targetX = Math.max(minTx, Math.min(maxTx, desiredTx));
      targetY = Math.max(minTy, Math.min(maxTy, desiredTy));
    };

    // Continuously ease the card toward the target so it trails the cursor.
    const tick = () => {
      tx += (targetX - tx) * EASE;
      ty += (targetY - ty) * EASE;
      card.style.transform = `translate(${tx}px, ${ty}px)`;
      if (active || Math.abs(targetX - tx) > 0.4 || Math.abs(targetY - ty) > 0.4) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      active = true;
      computeTarget(e);
      start();
    };

    const onLeave = () => {
      active = false;
      targetX = 0;
      targetY = 0;
      start();
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Futuristic pointer glow: a soft light follows the cursor across the hero.
  useEffect(() => {
    const hero = document.querySelector('.de-hero');
    if (!hero) return;

    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      hero.style.setProperty('--de-mx', `${mx}px`);
      hero.style.setProperty('--de-my', `${my}px`);
      // normalized -1..1 offset from centre for icon parallax
      hero.style.setProperty('--de-px', `${(mx / r.width - 0.5) * 2}`);
      hero.style.setProperty('--de-py', `${(my / r.height - 0.5) * 2}`);
      hero.classList.add('is-pointer');
    };
    const onLeave = () => {
      hero.classList.remove('is-pointer');
      hero.style.setProperty('--de-px', '0');
      hero.style.setProperty('--de-py', '0');
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Antigravity physics (à la Google Gravity): hero icons are repelled by the
  // cursor, fly away with momentum, then spring back to home with a bouncy
  // overshoot. Each icon is a little mass with velocity, friction and a spring.
  useEffect(() => {
    const hero = document.querySelector('.de-hero');
    if (!hero) return;

    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const icons = Array.from(hero.querySelectorAll('.de-hero-icon'));
    if (icons.length === 0) return;

    const RADIUS = 200;      // px of cursor influence
    const PUSH = 5.2;        // repulsion strength
    const SPRING = 0.014;    // pull back to home
    const FRICTION = 0.9;    // velocity damping (momentum)
    const MAX_OFFSET = 190;  // clamp how far an icon can fly

    const state = icons.map((el) => {
      const depth = parseFloat(el.style.getPropertyValue('--depth')) || 28;
      return { el, mass: 40 / depth, cx: 0, cy: 0, x: 0, y: 0, vx: 0, vy: 0, rot: 0 };
    });

    const measure = () => {
      const hr = hero.getBoundingClientRect();
      state.forEach((s) => {
        const r = s.el.getBoundingClientRect();
        s.cx = (r.left - hr.left) + r.width / 2 - s.x;
        s.cy = (r.top - hr.top) + r.height / 2 - s.y;
      });
    };

    const mouse = { x: -9999, y: -9999, active: false };
    let frame = 0;

    const tick = () => {
      let energy = 0;
      state.forEach((s) => {
        // spring back toward home (0,0)
        s.vx += -s.x * SPRING;
        s.vy += -s.y * SPRING;

        // repulsion from cursor
        if (mouse.active) {
          const dx = (s.cx + s.x) - mouse.x;
          const dy = (s.cy + s.y) - mouse.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < RADIUS) {
            const force = (1 - dist / RADIUS) * PUSH * s.mass;
            s.vx += (dx / dist) * force;
            s.vy += (dy / dist) * force;
          }
        }

        // integrate with friction (momentum)
        s.vx *= FRICTION;
        s.vy *= FRICTION;
        s.x += s.vx;
        s.y += s.vy;

        // clamp distance from home
        const off = Math.hypot(s.x, s.y);
        if (off > MAX_OFFSET) {
          s.x = (s.x / off) * MAX_OFFSET;
          s.y = (s.y / off) * MAX_OFFSET;
        }

        // a little spin proportional to horizontal velocity for flair
        s.rot += (s.vx * 0.6 - s.rot) * 0.1;
        s.el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)`;

        energy += Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(s.x) + Math.abs(s.y);
      });

      if (mouse.active || energy > 0.6) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
        state.forEach((s) => { s.x = s.y = s.vx = s.vy = s.rot = 0; s.el.style.transform = ''; });
      }
    };
    const start = () => { if (!frame) frame = requestAnimationFrame(tick); };

    const onMove = (e) => {
      const hr = hero.getBoundingClientRect();
      mouse.x = e.clientX - hr.left;
      mouse.y = e.clientY - hr.top;
      mouse.active = true;
      start();
    };
    const onLeave = () => { mouse.active = false; start(); };

    measure();
    window.addEventListener('resize', measure);
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  const gotoLogin = () => {
    setshowSignupModal(false);
    setshowLoginModal(true);
  }

  const gotoSignUp = () =>{
    setshowSignupModal(true);
    setshowLoginModal(false);
  }

  return (
    <Page>

      {/* ============ Header (unchanged markup so menu/scroll scripts work) ============ */}
      <div className="container-fluid header newheader">
        <div className="row">
          <div className="col-md-2 col-sm-4 col-xs-6 deskpadding">
            <div className="logo">
              <a href="/" aria-label="DE"><img src={images.logo} className="max" alt="Demand Edge"></img></a>
            </div>
          </div>
          <div className="col-md-8 col-sm-8 col-xs-6">
            <div className="mainmenu">
              <nav id="nav">
                <span id='menutoggle' className='test'><span>Menu</span></span>
                <ul className="clearfix">
                  <li><a href="#aboutus" className="scroll" aria-label="DE">About Us</a></li>
                  <li><a href="#keybenefits" className="scroll" aria-label="DE">Key Benefits</a></li>
                  <li><a href="#features" className="scroll" aria-label="DE">Features</a></li>
                  <li><a href="#contactus" className="scroll" aria-label="DE">Contact Us</a></li>
                  <li className="loginmenu">
                    <button onClick={() => { setshowLoginModal(true) }} aria-label="DE">
                      Login <iconify-icon icon="ant-design:login-outlined"></iconify-icon>
                    </button>
                  </li>
                  <li className="signupmenu"><button onClick={() => { setshowSignupModal(true) }} className="popup-btn" aria-label="DE">Signup <iconify-icon icon="hugeicons:lock-key"></iconify-icon></button></li>
                </ul>

              </nav>
            </div>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-12">
            <div className="headcall">
              <iconify-icon icon="fluent:call-16-regular"></iconify-icon>
              <a href="tel:+8049568423" aria-label="DE"><span>Call :</span><br />80-49568423</a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Hero ============ */}
      <section className="de-hero">
        {/* Ambient futuristic layers: pointer-follow glow + floating particles */}
        <div className="de-hero-glow" aria-hidden="true" />
        <div className="de-hero-particles" aria-hidden="true">
          {heroParticles.map((p, i) => (
            <span
              key={i}
              style={{
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
        {/* Themed product icons that drift + parallax with the cursor */}
        <div className="de-hero-icons" aria-hidden="true">
          {heroIcons.map((it) => {
            const Icon = it.Icon;
            return (
              <span
                key={it.key}
                className="de-hero-icon"
                style={{ top: it.top, left: it.left, '--depth': it.depth }}
              >
                <span
                  className="de-hero-icon-in"
                  style={{ animationDelay: `${it.delay}s`, animationDuration: `${it.duration}s` }}
                >
                  <Icon size={it.size} strokeWidth={1.6} />
                </span>
              </span>
            );
          })}
        </div>
        <div className="container mycontainer">
          <div className="de-hero-grid">
            <div className="de-hero-copy">
              <span className="de-eyebrow de-eyebrow-light de-hero-anim">Demand Forecasting Platform</span>
              <h1 className="de-hero-title">
                <span className="de-hero-line"><span className="de-hero-line-in">Predict the future.</span></span>
                <span className="de-hero-line"><span className="de-hero-line-in de-hero-accent">Plan with confidence.</span></span>
              </h1>
              <p className="de-hero-anim">
                Demand Edge turns your data into precise forecasts and actionable
                insight — so your team can anticipate market trends and optimise
                resource allocation in the present.
              </p>
              <div className="de-hero-cta de-hero-anim">
                <button className="de-btn de-btn-primary" onClick={() => setshowSignupModal(true)}>
                  Get Started <ArrowRight size={18} strokeWidth={2.5} />
                </button>
                <a className="de-btn de-btn-ghost scroll" href="#contactus" aria-label="DE">
                  Talk to an Expert
                </a>
              </div>

              <ul className="de-hero-points de-hero-anim">
                <li><CheckCircle2 size={16} strokeWidth={2.5} /> Postgres-backed & scalable</li>
                <li><CheckCircle2 size={16} strokeWidth={2.5} /> Automated workflows</li>
                <li><CheckCircle2 size={16} strokeWidth={2.5} /> Model-driven accuracy</li>
              </ul>
            </div>

            <div className="de-hero-visual">
              <div className="de-hero-art">
                <img className="de-hero-robot" src={images.banner1} alt="Demand Edge AI" />
                <button className="de-hero-play" ref={demoCardRef} type="button" aria-label="Play demo">
                  <span className="de-hero-play-core">
                    <Play size={22} strokeWidth={2.5} fill="currentColor" />
                  </span>
                  <span className="de-hero-play-label">Play Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band — kept OUTSIDE the hero so the hero's overflow:hidden
          does not clip the label text under each number. */}
      <div className="de-stats-wrap">
        <div className="container mycontainer">
          <div className="de-stats de-reveal">
            {heroStats.map((s, i) => (
              <div className="de-stat" style={{ transitionDelay: `${i * 110}ms` }} key={s.label}>
                <strong>{s.value}</strong>
                <span className="de-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ About Us ============ */}
      <span id="aboutus" className="de-anchor" />
      <section className="de-section de-about">
        <div className="container mycontainer">
          <div className="de-about-layout">
            {/* LEFT: narrative */}
            <div className="de-about-intro de-reveal">
              <span className="de-eyebrow">About Us</span>
              <h2>Precision Forecasting for <span>Strategic Decision-Making</span></h2>
              <p>
                Demand Edge is a an essential tool that turns advanced algorithms and data analytics into actionable
                insight — so you can anticipate trends and plan with confidence.
              </p>
              <button className="de-btn de-btn-primary" onClick={() => setshowSignupModal(true)}>
                Get Started <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* RIGHT: horizontal feature cards */}
            <div className="de-about-cards">
              <article className="de-card de-about-card de-reveal">
                <span className="de-about-card-icon">
                  <img src={images.icon1} alt="Data Analytics" />
                </span>
                <div className="de-about-card-body">
                  <h3>Data Analytics</h3>
                  <p>
                    Transform raw historical data into clear, reliable signals. Validate,
                    explore and prepare datasets so every forecast starts from a trusted base.
                  </p>
                  <button className="de-link" onClick={() => setshowSignupModal(true)}>
                    Get Started <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </article>

              <article className="de-card de-about-card de-reveal" style={{ transitionDelay: '120ms' }}>
                <span className="de-about-card-icon">
                  <img src={images.icon2} alt="Advanced Algorithms" />
                </span>
                <div className="de-about-card-body">
                  <h3>Advanced Algorithms</h3>
                  <p>
                    A rich library of statistical and machine-learning models, automatically
                    tuned and evaluated to deliver the most accurate forecast for your data.
                  </p>
                  <button className="de-link" onClick={() => setshowSignupModal(true)}>
                    Get Started <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Key Benefits ============ */}
      <span id="keybenefits" className="de-anchor" />
      <section className="de-section de-benefits">
        <div className="container mycontainer">
          <div className="de-section-head de-reveal">
            <span className="de-eyebrow">Key Benefits</span>
            <h2>Everything Your Team Needs To <span>Achieve Their Goals</span></h2>
            <p>
              From revenue planning to risk mitigation — explore how accurate demand
              forecasting drives better decisions across the business.
            </p>
          </div>
          <KeyBenefits onExplore={() => setshowSignupModal(true)} />
        </div>
      </section>

      {/* ============ Features ============ */}
      <span id="features" className="de-anchor" />
      <section className="de-section de-features">
        <div className="container mycontainer">
          <div className="de-features-grid">
            <div className="de-features-intro de-reveal">
              <span className="de-eyebrow">Features</span>
              <h2>Top Benefits Of Using Demand Edge For <span>Accurate Business Prediction</span></h2>
              <p>
                A complete forecasting workflow — from data prep and feature engineering to
                model selection, scheduling and live evaluation metrics.
              </p>
            </div>
            <div className="de-features-slider de-reveal">
              <FeaturesSlider />
            </div>
          </div>
        </div>
      </section>

      {/* ============ Architecture ============ */}
      <span id="architecture" className="de-anchor" />
      <ArchitectureSection />

      {/* ============ What sets Demand Edge apart ============ */}
      <section className="de-section de-diff">
        <div className="container mycontainer">
          <div className="de-section-head de-reveal">
            <span className="de-eyebrow">Why Demand Edge</span>
            <h2>What Sets <span>Demand Edge Apart</span></h2>
            <p>The capabilities that make forecasting faster, smarter and production-ready.</p>
          </div>

          <div className="de-diff-grid">
            {differentiators.map(({ icon: Icon, title, text }, i) => (
              <article className="de-card de-diff-card de-reveal" style={{ transitionDelay: `${(i % 3) * 90}ms` }} key={title}>
                <span className="de-diff-icon">
                  <Icon size={22} strokeWidth={2} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Contact ============ */}
      <span id="contactus" className="de-anchor" />
      <section className="de-section de-contact">
        <div className="container mycontainer">
          <div className="de-contact-grid">
            <div className="de-contact-copy de-reveal">
              <span className="de-eyebrow de-eyebrow-light">Enquire Now</span>
              <h2>Want To Know More?<br /><span>Connect With Us</span></h2>
              <p>
                Tell us about your forecasting challenge and our team will show you how
                Demand Edge can help you plan with confidence.
              </p>
              <ul className="de-contact-points">
                <li><Phone size={16} strokeWidth={2.5} /> 80-49568423</li>
                <li><CheckCircle2 size={16} strokeWidth={2.5} /> Personalised product walkthrough</li>
                <li><CheckCircle2 size={16} strokeWidth={2.5} /> No commitment required</li>
              </ul>
            </div>

            <div className="de-contact-card de-reveal" style={{ transitionDelay: '120ms' }}>
              <h3>We'd love to hear from you anytime</h3>
              <div className="de-form-row">
                <input type="text" id="fullname" placeholder="Enter Your Full Name" />
                <input type="email" id="emailid" placeholder="Enter Your Email Id" />
              </div>
              <div className="de-form-row">
                <input type="text" id="organisation" placeholder="Enter Your Current Organisation" />
                <input type="text" id="mobileno" placeholder="Enter Your Mobile No." />
              </div>
              <label className="de-checkbox">
                <input type="checkbox" id="ipname" name="ipname" />
                <span>I agree to the Terms of Service and Privacy Policy.</span>
              </label>
              <button className="de-btn de-btn-primary de-btn-block">
                Connect With Me <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Footer (kept) ============ */}
      <div className="container-fluid footerbg">
        <div className="container mycontainer">
          <div className="row">
            <div className="col-md-5 col-sm-6 col-xs-12">
              <img src={images.ftrlogo} className="max ftrlogo" alt="Demand Edge"></img>
              <p>Demand Edge turns your data into precise forecasts and actionable insight, helping teams plan with confidence.</p>
              <div className="ftrsocialmedia">
                <ul>
                  <li><a href="#" aria-label="DE" target="_blank"><iconify-icon icon="ic:baseline-facebook"></iconify-icon></a></li>
                  <li><a href="#" aria-label="DE" target="_blank"><iconify-icon icon="teenyicons:instagram-solid"></iconify-icon></a></li>
                  <li><a href="#" aria-label="DE" target="_blank"><iconify-icon icon="mdi:linkedin"></iconify-icon></a></li>
                </ul>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12">
              <h5>Company</h5>
              <div>
                <ul>
                  <li><a href="#aboutus" className="scroll" aria-label="DE">About Us</a></li>
                  <li><a href="#keybenefits" className="scroll" aria-label="DE">Key Benefits</a></li>
                  <li><a href="#features" className="scroll" aria-label="DE">Features</a></li>
                  <li><a href="#contactus" className="scroll" aria-label="DE">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-xs-12">
              <h5>Contact Us</h5>
              <div>
                <ul>
                  <li className="linehe"><iconify-icon icon="mdi:address-marker-outline"></iconify-icon> Quation Solutions Private Limited
                    6th Floor, Tower 3, WARP SJR I Park, EPIP Zone
                    Opp. Sri Sathya Sai Hospital Whitefield Bangalore</li>
                  <li><a href="mailto:quation@quation.in" target="_blank" aria-label="DE"><iconify-icon icon="tabler:mail"></iconify-icon> contactus@quation.in</a></li>
                  <li><a href="tel:+91-9652415296" target="_blank" aria-label="DE"><iconify-icon icon="fluent:call-16-regular"></iconify-icon> 80-49568423</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <img src={images.copyimg} className="footer-copy-logo" alt="Quation" />
              <span>©2023 Quation Solutions Pvt. Ltd., All rights reserved</span>
            </div>
            <a href="#" className="footer-top-btn" onClick={scrollToTop} aria-label="Back to top">
              <iconify-icon icon="tabler:arrow-top-circle"></iconify-icon>
            </a>
          </div>
        </div>
      </div>

      {showLoginModal && createPortal(
        <LoginPopup onClose={() => setshowLoginModal(false)} gotoSignUp={gotoSignUp} />,
        document.body
      )}
      {showSignupModal && createPortal(
        <SignupPopup onClose={() => setshowSignupModal(false)} gotoLogin={gotoLogin}  />,
        document.body
      )}

    </Page>
  )
}

/* ============================================================
   Styles — scoped to the landing page. Keeps the existing
   navy / blue / red brand palette.
   ============================================================ */

const Page = styled.div`
  --de-navy: #0c3c54;
  --de-navy-deep: #0a324a;
  --de-blue: #1b85ba;
  --de-red: #ac1424;
  --de-yellow: #ffdd00;
  --de-text: #2c3e50;
  --de-muted: #6a7d8c;
  --de-bg: #f4f7fc;
  --de-border: #e8eff5;
  --de-shadow: 0 4px 18px rgba(12, 60, 84, 0.07);
  --de-shadow-hover: 0 16px 38px rgba(12, 60, 84, 0.16);

  font-family: "Exo", sans-serif;
  color: var(--de-text);
  overflow-x: hidden;

  /* ------------------------------------------------------------------
     Global-stylesheet override.
     index.css forces heading / paragraph sizes and font-family with
     !important (e.g. h1 { font-size: 35px !important }), which shrinks
     this page. Re-assert the landing page's intended typ, width and
     font so it fills the screen instead of rendering small.
     ------------------------------------------------------------------ */
  .container.mycontainer {
    width: 92% !important;
    max-width: 1320px;
  }

  h1, h2, h3, h4, h5, h6, p, span, a, li, strong, small, button, label, input {
    font-family: "Exo", sans-serif !important;
  }

  .de-hero-copy h1 { font-size: 56px !important; }
  .de-section-head h2 { font-size: 36px !important; }
  .de-about-intro h2 { font-size: 32px !important; }
  .de-features-intro h2 { font-size: 30px !important; }
  .de-contact-copy h2 { font-size: 36px !important; }
  .de-card-feature h3 { font-size: 22px !important; }
  .de-about-card-body h3 { font-size: 19px !important; }
  .de-diff-card h3,
  .de-contact-card h3 { font-size: 20px !important; }
  .de-section-head p { font-size: 16.5px !important; }
  .de-about-intro p { font-size: 16px !important; }
  .de-about-card-body p { font-size: 14.5px !important; }
  .de-features-intro p { font-size: 16px !important; }
  .de-hero-copy p,
  .de-contact-copy p { font-size: 18px !important; }
  .de-card-feature p { font-size: 15px !important; }
  .de-diff-card p { font-size: 14.5px !important; }

  /* ------------------------------------------------------------------
     Animations
     ------------------------------------------------------------------ */
  /* Scroll-reveal — toggled by IntersectionObserver (adds .is-visible) */
  .de-reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
    will-change: opacity, transform;
  }
  .de-reveal.is-visible { opacity: 1; transform: none; }

  /* Hero entrance is handled per-element via .de-hero-anim / line reveal. */
  @media (prefers-reduced-motion: reduce) {
    .de-reveal { animation: none !important; opacity: 1 !important; transform: none !important; }
  }

  /* ---------- Shared helpers ---------- */
  .de-anchor {
    display: block;
    position: relative;
    top: -90px;
    visibility: hidden;
  }

  .de-eyebrow {
    display: inline-block;
    color: var(--de-blue);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    background: #eff7fc;
    border: 1px solid #c4e0f0;
    padding: 5px 14px;
    border-radius: 999px;
    margin-bottom: 16px;
  }

  .de-eyebrow-light {
    color: #cfe9f7;
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.25);
  }

  .de-section {
    padding: 46px 0;
  }

  .de-section-head {
    text-align: center;
    max-width: 760px;
    margin: 0 auto 30px;
  }

  .de-section-head h2 {
    color: var(--de-navy);
    font-size: 34px;
    font-weight: 400;
    line-height: 1.25;
    margin: 0 0 14px;
  }

  .de-section-head h2 span {
    font-weight: 800;
  }

  .de-section-head p {
    color: var(--de-muted);
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
  }

  /* ---------- Buttons ---------- */
  .de-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: none;
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
    padding: 13px 26px;
    border-radius: 40px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
    text-decoration: none;
  }

  .de-btn svg { transition: transform 0.2s ease; }
  .de-btn:hover svg { transform: translateX(3px); }

  .de-btn-primary {
    background: var(--de-red);
    color: #fff;
    box-shadow: 0 10px 24px rgba(172, 20, 36, 0.28);
  }
  .de-btn-primary:hover {
    background: var(--de-navy);
    color: #fff;
    transform: translateY(-2px);
  }

  .de-btn-ghost {
    background: transparent;
    color: #fff;
    border: 1.5px solid rgba(255, 255, 255, 0.5);
  }
  .de-btn-ghost:hover {
    background: #fff;
    color: var(--de-navy);
  }

  .de-btn-block { width: 100%; justify-content: center; margin-top: 8px; }

  /* ---------- Hero ---------- */
  .de-hero {
    position: relative;
    background:
      radial-gradient(900px 500px at 80% -10%, rgba(27, 133, 186, 0.45), transparent 70%),
      linear-gradient(135deg, var(--de-navy) 0%, var(--de-navy-deep) 60%, #082636 100%);
    padding: 140px 0 68px;
    overflow: hidden;
  }
  .de-hero > .container { position: relative; z-index: 2; }

  /* pointer-follow glow — soft, light, smoothly trailing */
  .de-hero-glow {
    position: absolute;
    left: var(--de-mx, 78%);
    top: var(--de-my, 14%);
    width: 540px;
    height: 540px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(70, 150, 200, 0.18) 0%,
      rgba(40, 120, 175, 0.1) 38%,
      rgba(27, 133, 186, 0) 66%
    );
    opacity: 0.5;
    transition: left 0.45s ease-out, top 0.45s ease-out, opacity 0.5s ease;
    pointer-events: none;
    z-index: 0;
  }
  .de-hero.is-pointer .de-hero-glow { opacity: 0.85; }

  /* ambient rising particles — soft & slow for a calm, smooth drift */
  .de-hero-particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }
  .de-hero-particles span {
    position: absolute;
    bottom: -14px;
    border-radius: 50%;
    background: rgba(150, 195, 225, 0.55);
    box-shadow: 0 0 9px rgba(120, 180, 220, 0.45);
    animation-name: deParticleRise;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
  @keyframes deParticleRise {
    0% { transform: translateY(0) scale(0.7); opacity: 0; }
    15% { opacity: 1; }
    85% { opacity: 1; }
    100% { transform: translateY(-580px) scale(0.4); opacity: 0; }
  }

  /* themed floating product icons with mouse parallax */
  .de-hero-icons {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
  }
  .de-hero-icon {
    position: absolute;
    will-change: transform;
  }
  .de-hero-icon-in {
    display: inline-flex;
    color: rgba(130, 190, 225, 0.4);
    filter: drop-shadow(0 0 10px rgba(27, 133, 186, 0.35));
    transition: color 0.5s ease, filter 0.5s ease;
    animation-name: deIconFloat;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
  /* futuristic reveal: icons brighten + glow as the cursor enters the hero */
  .de-hero.is-pointer .de-hero-icon-in {
    color: rgba(150, 215, 250, 0.7);
    filter: drop-shadow(0 0 16px rgba(54, 170, 224, 0.65));
  }
  @keyframes deIconFloat {
    0%, 100% { transform: translateY(0) rotate(-5deg); }
    50% { transform: translateY(-18px) rotate(5deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .de-hero-icons { display: none; }
  }

  .de-hero-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    gap: 40px;
  }

  .de-hero-copy h1 {
    color: #fff;
    font-size: 54px;
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 18px;
  }
  .de-hero-copy h1 .de-hero-accent { color: var(--de-yellow); }

  /* hero title: each line rises out of a mask on load */
  .de-hero-line {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
  }
  .de-hero-line-in {
    display: inline-block;
    transform: translateY(115%);
    animation: deLineReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .de-hero-line:nth-child(1) .de-hero-line-in { animation-delay: 0.15s; }
  .de-hero-line:nth-child(2) .de-hero-line-in { animation-delay: 0.34s; }

  @keyframes deLineReveal {
    from { transform: translateY(115%); }
    to { transform: translateY(0); }
  }

  /* eyebrow / paragraph / cta / points fade-up in sequence on load */
  .de-hero-anim {
    animation: deHeroUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .de-hero-copy .de-eyebrow.de-hero-anim { animation-delay: 0.05s; }
  .de-hero-copy p.de-hero-anim { animation-delay: 0.52s; }
  .de-hero-cta.de-hero-anim { animation-delay: 0.64s; }
  .de-hero-points.de-hero-anim { animation-delay: 0.76s; }

  @keyframes deHeroUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* hero visual entrance (opacity only on demo card — JS owns its transform) */
  .de-hero-robot {
    animation: deRobotIn 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.3s;
  }
  @keyframes deRobotIn {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .de-hero-line-in,
    .de-hero-anim,
    .de-hero-robot,
    .de-hero-play { animation: none !important; transform: none !important; opacity: 1 !important; }
    .de-hero-particles { display: none; }
  }

  .de-hero-copy p {
    color: #d7e6f0;
    font-size: 18px;
    line-height: 1.6;
    max-width: 540px;
    margin: 0 0 28px;
  }

  .de-hero-cta {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 28px;
  }

  .de-hero-points {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 22px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .de-hero-points li {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #cfe1ee;
    font-size: 14px;
    font-weight: 500;
  }
  .de-hero-points svg { color: var(--de-yellow); }

  .de-hero-visual {
    width: 100%;
  }
  .de-hero-art {
    position: relative;
    width: 100%;
    min-height: 470px;
    display: flex;
    align-items: flex-end;
    perspective: 1200px;
  }
  .de-hero-robot {
    position: absolute;
    right: -8%;
    bottom: -2%;
    width: 100%;
    max-width: 560px;
    z-index: 1;
    filter: drop-shadow(0 26px 44px rgba(0, 0, 0, 0.5));
    pointer-events: none;
  }
  /* Floating play button — blends into the hero, follows the cursor (JS rAF).
     The button is just a positioning wrapper (JS owns its transform); the
     visible circle lives in .de-hero-play-core so hover effects don't clash. */
  .de-hero-play {
    position: absolute;
    left: 30%;
    top: 42%;
    z-index: 2;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    will-change: transform;
    animation: deHeroPlayIn 0.8s ease both;
    animation-delay: 0.6s;
  }
  .de-hero-play-core {
    position: relative;
    width: 74px;
    height: 74px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.28);
    background: linear-gradient(135deg, rgba(200, 50, 74, 0.92) 0%, rgba(172, 20, 36, 0.92) 100%);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 16px 38px rgba(172, 20, 36, 0.42), 0 0 0 6px rgba(255, 255, 255, 0.06);
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
    animation: deHeroPlayPulse 3s ease-in-out infinite;
  }
  .de-hero-play-core svg { position: relative; z-index: 1; margin-left: 2px; }
  /* gentle pulsing rings so it reads as "play demo" */
  .de-hero-play-core::before,
  .de-hero-play-core::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.4);
    animation: deHeroPlayRipple 3s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  }
  .de-hero-play-core::after { animation-delay: 1.5s; }
  .de-hero-play:hover .de-hero-play-core {
    transform: scale(1.12);
    box-shadow: 0 20px 50px rgba(172, 20, 36, 0.62), 0 0 0 10px rgba(255, 255, 255, 0.12);
  }

  /* "Play Demo" label revealed on hover */
  .de-hero-play-label {
    position: absolute;
    top: calc(100% + 14px);
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    white-space: nowrap;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #fff;
    background: rgba(12, 60, 84, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.18);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    padding: 7px 14px;
    border-radius: 9px;
    box-shadow: 0 10px 24px rgba(4, 22, 33, 0.4);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .de-hero-play-label::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 9px;
    height: 9px;
    background: rgba(12, 60, 84, 0.92);
    border-left: 1px solid rgba(255, 255, 255, 0.18);
    border-top: 1px solid rgba(255, 255, 255, 0.18);
  }
  .de-hero-play:hover .de-hero-play-label {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  @keyframes deHeroPlayIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes deHeroPlayPulse {
    0%, 100% { box-shadow: 0 16px 38px rgba(172, 20, 36, 0.42), 0 0 0 6px rgba(255, 255, 255, 0.06); }
    50% { box-shadow: 0 16px 48px rgba(172, 20, 36, 0.6), 0 0 0 6px rgba(255, 255, 255, 0.1); }
  }
  @keyframes deHeroPlayRipple {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .de-hero-play,
    .de-hero-play-core,
    .de-hero-play-core::before,
    .de-hero-play-core::after { animation: none !important; }
  }

  /* ---------- Stats band — premium floating glass KPI panel ---------- */
  .de-stats-wrap {
    position: relative;
    z-index: 5;
    margin-top: -62px;
  }
  .de-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    padding: 18px 16px;
    border-radius: 18px;
    /* frosted glass panel */
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(247, 251, 254, 0.9) 100%);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.85);
    box-shadow:
      0 26px 60px rgba(7, 35, 52, 0.22),
      0 2px 0 rgba(255, 255, 255, 0.6) inset;
    animation: deStatsRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .de-stat {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 4px 16px;
    border-radius: 12px;
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  }
  /* clean divider lines between stats (desktop) */
  .de-stat::after {
    content: '';
    position: absolute;
    top: 18%;
    bottom: 18%;
    right: 0;
    width: 1px;
    background: linear-gradient(180deg, transparent, var(--de-border) 25%, var(--de-border) 75%, transparent);
  }
  .de-stat:last-child::after { display: none; }

  .de-stat strong {
    display: block;
    font-size: 30px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.5px;
    /* theme gradient numbers for a premium feel */
    background: linear-gradient(135deg, var(--de-navy) 0%, var(--de-blue) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: var(--de-navy);
  }
  .de-stat-label {
    display: block;
    margin-top: 7px;
    color: var(--de-muted);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  /* hover: subtle lift + glow */
  .de-stat:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 14px 26px rgba(7, 35, 52, 0.1);
  }

  @keyframes deStatsRise {
    from { opacity: 0; transform: translateY(26px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .de-stats { animation: none !important; }
  }

  /* ---------- (placeholder demo card removed — replaced by .de-hero-play) ---------- */

  /* ---------- About ---------- */
  .de-about { background: linear-gradient(180deg, #ffffff, #f9fcff); }

  .de-about-layout {
    display: grid;
    grid-template-columns: 0.92fr 1.08fr;
    gap: 46px;
    align-items: center;
  }

  .de-about-intro { text-align: left; }
  .de-about-intro h2 {
    color: var(--de-navy);
    font-weight: 400;
    line-height: 1.22;
    margin: 14px 0 16px;
  }
  .de-about-intro h2 span { font-weight: 800; }
  .de-about-intro p {
    color: var(--de-muted);
    line-height: 1.7;
    margin: 0;
  }
  .de-about-intro .de-btn { margin-top: 26px; }

  .de-about-checks {
    list-style: none;
    margin: 20px 0 26px;
    padding: 0;
  }
  .de-about-checks li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--de-navy);
    font-size: 14.5px;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 12px;
  }
  .de-about-checks svg { color: var(--de-blue); flex-shrink: 0; }

  .de-about-cards {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .de-about-card {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    padding: 24px 26px;
    text-align: left;
  }
  .de-about-card-icon {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: linear-gradient(135deg, #eaf4fb 0%, #f3f9fd 100%);
    border: 1px solid var(--de-border);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .de-about-card-icon img {
    width: 34px;
    height: auto;
    margin: 0;
    transition: transform 1.4s cubic-bezier(0.34, 1.4, 0.64, 1);
  }
  .de-about-card:hover .de-about-card-icon {
    transform: scale(1.06);
    box-shadow: 0 10px 22px rgba(27, 133, 186, 0.2);
  }
  /* spin the icon a full turn on hover (card or icon) */
  .de-about-card:hover .de-about-card-icon img,
  .de-about-card-icon:hover img {
    transform: rotate(360deg);
  }
  .de-about-card-body { min-width: 0; }
  .de-about-card-body h3 {
    color: var(--de-navy);
    font-weight: 700;
    margin: 2px 0 8px;
  }
  .de-about-card-body p {
    color: var(--de-muted);
    line-height: 1.6;
    margin: 0 0 14px;
  }

  .de-card {
    background: #fff;
    border: 1px solid var(--de-border);
    border-radius: 18px;
    box-shadow: var(--de-shadow);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .de-card:hover { transform: translateY(-4px); box-shadow: var(--de-shadow-hover); }

  .de-card-feature {
    padding: 30px;
    text-align: left;
  }
  .de-card-feature img { width: 64px; height: auto; margin-bottom: 16px; }
  .de-card-feature h3 {
    color: var(--de-navy);
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 10px;
  }
  .de-card-feature p {
    color: var(--de-muted);
    font-size: 14.5px;
    line-height: 1.6;
    margin: 0 0 18px;
  }

  .de-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--de-red);
    font-size: 14px;
    font-weight: 700;
    padding: 0;
  }
  .de-link svg { transition: transform 0.2s ease; }
  .de-link:hover svg { transform: translateX(3px); }

  /* ---------- Benefits / Features wrappers ---------- */
  /* fade from white edges into the tint so the section blends with its
     white neighbours instead of meeting at a hard line */
  .de-benefits {
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      var(--de-bg) 16%,
      var(--de-bg) 84%,
      #ffffff 100%
    );
  }
  .de-features { background: #fff; }

  /* Features — two-column layout: left intro text, right fitted card slider */
  .de-features-grid {
    display: grid;
    grid-template-columns: 0.82fr 1.18fr;
    gap: 40px;
    align-items: center;
  }
  .de-features-intro { text-align: left; }
  .de-features-intro h2 {
    color: var(--de-navy);
    font-weight: 400 !important;
    line-height: 1.25;
    margin: 14px 0 16px !important;
  }
  .de-features-intro h2 span { font-weight: 800; }
  .de-features-intro p {
    color: var(--de-muted);
    line-height: 1.65;
    margin: 0;
  }
  .de-features-slider { min-width: 0; }

  /* Features slider — align the old .sec3box1 cards with the new card system */
  .de-features-slider { position: relative; padding: 0 0 8px; }
  .de-features-slider .features-slider { height: auto; }
  /* vertical padding so card corners + shadow aren't clipped by the slick list */
  .de-features-slider .slick-list { padding: 10px 0 14px !important; overflow: hidden; }
  .de-features-slider .slick-track { display: flex; align-items: stretch; }
  .de-features-slider .slick-slide {
    height: auto;
    box-sizing: border-box;
    padding: 0 10px;
  }
  .de-features-slider .slick-slide > div { height: 100%; }
  .de-features-slider li {
    list-style: none;
    height: 100%;
    margin: 0;
  }
  .de-features-slider .sec3box1 {
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    padding: 26px 22px 24px !important;
    background: #fff;
    border: 1px solid var(--de-border);
    border-radius: 18px;
    box-shadow: var(--de-shadow);
    text-align: center;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .de-features-slider .sec3box1:hover {
    transform: translateY(-5px);
    box-shadow: var(--de-shadow-hover);
  }
  .de-features-slider .sec3box1 img {
    width: 62px !important;
    height: auto;
    margin: 0 auto 16px !important;
  }
  .de-features-slider .sec3box1 h2 {
    font-size: 18px !important;
    font-weight: 700 !important;
    color: var(--de-navy);
    line-height: 1.35;
    margin: 0 0 10px !important;
    min-height: 48px;
  }
  .de-features-slider .sec3box1 p {
    font-size: 14px !important;
    color: var(--de-muted);
    line-height: 1.6;
    width: 100%;
    margin: 0;
    flex: 1 1 auto;
  }
  .de-features-slider .readmorebtn { margin-top: 18px; margin-bottom: 0; }

  /* Slider prev / next arrows */
  .de-features-slider .de-fs-arrow {
    position: absolute;
    top: 42%;
    transform: translateY(-50%);
    z-index: 5;
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--de-border);
    border-radius: 50%;
    background: #fff;
    color: var(--de-navy);
    box-shadow: 0 6px 16px rgba(4, 22, 33, 0.12);
    cursor: pointer;
    padding: 0;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }
  .de-features-slider .de-fs-arrow:hover {
    background: var(--de-red, #b81d24);
    color: #fff;
    border-color: transparent;
    box-shadow: 0 10px 22px rgba(4, 22, 33, 0.2);
  }
  .de-features-slider .de-fs-prev { left: -14px; }
  .de-features-slider .de-fs-next { right: -14px; }
  .de-features-slider .de-fs-arrow svg { display: block; }
  /* dots row spacing */
  .de-features-slider .slick-dots-cust { margin-top: 6px; }

  /* ---------- Differentiators ---------- */
  .de-diff {
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      var(--de-bg) 16%,
      var(--de-bg) 84%,
      #ffffff 100%
    );
  }
  .de-diff-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }
  .de-diff-card { padding: 26px; }
  .de-diff-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 13px;
    background: #eff7fc;
    color: var(--de-blue);
    margin-bottom: 16px;
  }
  .de-diff-card h3 {
    color: var(--de-navy);
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 8px;
  }
  .de-diff-card p {
    color: var(--de-muted);
    font-size: 14px;
    line-height: 1.55;
    margin: 0;
  }

  /* ---------- Contact ---------- */
  .de-contact {
    background:
      radial-gradient(700px 400px at 15% 0%, rgba(27, 133, 186, 0.4), transparent 70%),
      linear-gradient(135deg, var(--de-navy) 0%, var(--de-navy-deep) 100%);
  }
  .de-contact-grid {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 44px;
    align-items: center;
  }
  .de-contact-copy h2 {
    color: #fff;
    font-size: 36px;
    font-weight: 300;
    line-height: 1.25;
    margin: 0 0 16px;
  }
  .de-contact-copy h2 span { font-weight: 800; }
  .de-contact-copy p {
    color: #d7e6f0;
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 22px;
  }
  .de-contact-points {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 12px;
  }
  .de-contact-points li {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #e7f1f8;
    font-size: 15px;
    font-weight: 500;
  }
  .de-contact-points svg { color: var(--de-yellow); }

  .de-contact-card {
    background: #fff;
    border-radius: 20px;
    padding: 34px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
  }
  .de-contact-card h3 {
    color: var(--de-navy);
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 22px;
    text-align: center;
  }
  .de-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }
  .de-contact-card input[type="text"],
  .de-contact-card input[type="email"] {
    width: 100%;
    height: 48px;
    border: 1px solid #d9e2ea;
    border-radius: 10px;
    padding: 0 14px;
    font-size: 14px;
    font-family: "Exo", sans-serif;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .de-contact-card input:focus {
    outline: none;
    border-color: var(--de-blue);
    box-shadow: 0 0 0 3px rgba(27, 133, 186, 0.15);
  }
  .de-checkbox {
    display: flex;
    align-items: center;
    gap: 9px;
    margin: 6px 0 18px;
    color: var(--de-muted) !important;
    font-size: 13px !important;
    font-weight: 400 !important;
    text-transform: none !important;
  }
  .de-checkbox input { width: 16px; height: 16px; }

  /* ---------- Footer (scoped overrides — the global .footerbg renders oversized) ---------- */
  .footerbg {
    margin-top: 0 !important;
    padding: 26px 0 14px !important;
    background: var(--de-bg);
  }
  .footerbg .ftrlogo { width: 38% !important; margin-bottom: 4px; }
  .footerbg p {
    font-size: 12px !important;
    line-height: 1.45;
    width: 86%;
    margin-bottom: 6px;
  }
  .footerbg h5 {
    font-size: 13.5px !important;
    font-weight: 700 !important;
    margin: 0 0 2px !important;
  }
  .footerbg ul { line-height: 1.6 !important; }
  .footerbg ul li { font-size: 12px !important; }
  .footerbg .linehe { line-height: 1.45 !important; }
  .footerbg .ftrsocialmedia { margin-top: 8px !important; }

  /* merged copyright row inside the footer card */
  .footerbg .footer-bottom {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(12, 60, 84, 0.1);
  }
  .footerbg .footer-bottom-left {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    text-align: center;
  }
  .footerbg .footer-copy-logo { width: 92px; height: auto; }
  .footerbg .footer-bottom-left span {
    font-size: 11.5px;
    color: var(--de-muted);
    line-height: 1.4;
  }
  .footerbg .footer-top-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    color: var(--de-red);
    font-size: 26px;
    line-height: 1;
    transition: transform 0.25s ease;
  }
  .footerbg .footer-top-btn:hover { transform: translateY(-50%) scale(1.12); }

  /* ============================================================
     Responsive
     ============================================================ */
  @media (max-width: 991px) {
    .de-hero { padding-top: 120px; }
    .de-hero-grid { grid-template-columns: 1fr; text-align: center; gap: 30px; }
    .de-hero-copy h1 { font-size: 46px !important; }
    .de-hero-copy p { margin-left: auto; margin-right: auto; }
    .de-hero-cta, .de-hero-points { justify-content: center; }
    .de-hero-art { min-height: 0; display: block; position: relative; }
    .de-hero-play {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .de-hero-robot {
      position: static;
      width: 48%;
      max-width: 280px;
      display: block;
      margin: 20px auto 0;
    }

    /* Tablet: 2x2 grid — hide vertical dividers, separate rows softly */
    .de-stats { grid-template-columns: repeat(2, 1fr); gap: 6px 0; }
    .de-stat::after { display: none; }
    .de-stat:nth-child(odd)::after {
      display: block;
      top: 18%;
      bottom: 18%;
    }

    .de-about-layout,
    .de-diff-grid,
    .de-contact-grid { grid-template-columns: 1fr; }
    .de-about-layout { gap: 30px; }
    .de-about-intro { text-align: center; }
    .de-about-checks { display: inline-block; text-align: left; }

    .de-features-grid { grid-template-columns: 1fr; gap: 24px; }
    .de-features-intro { text-align: center; }
  }

  @media (max-width: 575px) {
    .de-section { padding: 38px 0; }
    .de-hero-copy h1 { font-size: 36px !important; }
    .de-hero-copy p { font-size: 16px !important; }
    .de-section-head h2 { font-size: 26px !important; }
    .de-contact-copy h2 { font-size: 26px !important; }
    /* Mobile: 2 columns if space allows, no vertical dividers */
    .de-stats { grid-template-columns: repeat(2, 1fr); gap: 14px 0; padding: 22px 12px; }
    .de-stat { padding: 8px 10px; }
    .de-stat::after,
    .de-stat:nth-child(odd)::after { display: none; }
    .de-stat strong { font-size: 28px; }
    .de-form-row { grid-template-columns: 1fr; }
    .de-contact-card { padding: 24px; }
  }
`;
