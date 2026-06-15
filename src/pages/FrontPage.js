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
  Database,
  LineChart,
  CheckCircle2,
  Phone,
  Play,
} from 'lucide-react'
import * as images from '../assets/images'
import UserService from '../services/UserService'
import KeyBenefits from '../components/frontpage/KeyBenefits'
import FeaturesSlider from '../components/frontpage/FeaturesSlider'
import ArchitectureSection from '../components/frontpage/ArchitectureSection'
import { createPortal } from 'react-dom';
import { postRequest } from '../services/DataRequestService';
import LoginPopup from '../components/frontpage/LoginPopup';
import SignupPopup from '../components/frontpage/SignupPopup'

import { displayMessage } from '../Utils/helper'

/* ============================================================
   Landing content — short, scannable. Edit here.
   ============================================================ */

const heroStats = [
  { value: '6+', label: 'Forecasting models', icon: BrainCircuit },
  { value: '3', label: 'Granularities supported', icon: CalendarRange },
  { value: '24/7', label: 'Scheduled automation', icon: Clock3 },
  { value: '100%', label: 'Data validation', icon: ShieldCheck },
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

  const test = ()=> {
    displayMessage('success', 'Logged in Successfully', 'Logged in Successfully');
  }


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
        <div className="container mycontainer">
          <div className="de-hero-grid">
            <div className="de-hero-copy">
              <span className="de-eyebrow de-eyebrow-light">Demand Forecasting Platform</span>
              <h1>
                Predict the future. <br />
                <span>Plan with confidence.</span>
              </h1>
              <p>
                Demand Edge turns your data into precise forecasts and actionable
                insight — so your team can anticipate market trends and optimise
                resource allocation in the present.
              </p>
              <div className="de-hero-cta">
                <button className="de-btn de-btn-primary" onClick={() => setshowSignupModal(true)}>
                  Get Started <ArrowRight size={18} strokeWidth={2.5} />
                </button>
                <a className="de-btn de-btn-ghost scroll" href="#contactus" aria-label="DE">
                  Talk to an Expert
                </a>
              </div>

              <ul className="de-hero-points">
                <li><CheckCircle2 size={16} strokeWidth={2.5} /> Postgres-backed & scalable</li>
                <li><CheckCircle2 size={16} strokeWidth={2.5} /> Automated workflows</li>
                <li><CheckCircle2 size={16} strokeWidth={2.5} /> Model-driven accuracy</li>
              </ul>
            </div>

            <div className="de-hero-visual">
              <div className="de-hero-art">
                <img className="de-hero-robot" src={images.banner1} alt="Demand Edge AI" />
                <div className="de-hero-demo" ref={demoCardRef}>
                  <div className="de-hero-demo-bar">
                    <i /><i /><i />
                    <span className="de-demo-url">demandedge.app/forecast</span>
                  </div>
                  {/* TODO: replace this placeholder with the demo video / <iframe> / GIF */}
                  <div className="de-demo-placeholder">
                    <span className="de-demo-play"><Play size={26} strokeWidth={2.5} fill="currentColor" /></span>
                    <p>Demo coming soon</p>
                    <small>This space is reserved — embed your product demo here later.</small>
                  </div>
                </div>
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
            {heroStats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div className="de-stat" style={{ transitionDelay: `${i * 110}ms` }} key={s.label}>
                  {Icon && (
                    <span className="de-stat-icon">
                      <Icon size={18} strokeWidth={2.2} />
                    </span>
                  )}
                  <strong>{s.value}</strong>
                  <span className="de-stat-label">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ About Us ============ */}
      <span id="aboutus" className="de-anchor" />
      <section className="de-section de-about">
        <div className="container mycontainer">
          <div className="de-section-head de-reveal">
            <span className="de-eyebrow">About Us</span>
            <h2>Precision Forecasting for <span>Strategic Decision-Making</span></h2>
            <p>
              Demand Edge is your essential tool for precise forecasting, delivering
              actionable insights to drive strategic decision-making. With advanced
              algorithms and data analytics, it empowers businesses to anticipate market
              trends, optimise resource allocation and sustain competitive advantage.
            </p>
          </div>

          <div className="de-about-grid">
            <article className="de-card de-card-feature de-reveal">
              <img src={images.icon1} alt="Data Analytics" />
              <h3>Data Analytics</h3>
              <p>
                Transform raw historical data into clear, reliable signals. Validate,
                explore and prepare datasets so every forecast starts from a trusted base.
              </p>
              <button className="de-link" onClick={() => setshowSignupModal(true)}>
                Get Started <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </article>

            <article className="de-card de-card-feature de-reveal" style={{ transitionDelay: '120ms' }}>
              <img src={images.icon2} alt="Advanced Algorithms" />
              <h3>Advanced Algorithms</h3>
              <p>
                A rich library of statistical and machine-learning models, automatically
                tuned and evaluated to deliver the most accurate forecast for your data.
              </p>
              <button className="de-link" onClick={() => setshowSignupModal(true)}>
                Get Started <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </article>
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

      {/* ============ Expertise / Skills ============ */}
      <section className="de-section de-expertise">
        <div className="container mycontainer">
          <div className="de-expertise-grid">
            <div className="de-expertise-copy de-reveal">
              <span className="de-eyebrow">Our Skills</span>
              <h2>We Are Masters In <span>Data Analytics & Algorithms</span></h2>
              <p>
                Years of applied data science distilled into a platform that any planning
                team can use — combining rigorous analysis, advanced modelling and AI.
              </p>

              <div className="de-progress">
                <div className="de-progress-item">
                  <div className="de-progress-label"><span>Data Analysis</span><b>88%</b></div>
                  <div className="de-progress-track"><i style={{ width: '88%' }} /></div>
                </div>
                <div className="de-progress-item">
                  <div className="de-progress-label"><span>Advanced Algorithms</span><b>55%</b></div>
                  <div className="de-progress-track"><i style={{ width: '55%' }} /></div>
                </div>
                <div className="de-progress-item">
                  <div className="de-progress-label"><span>AI Solutions</span><b>92%</b></div>
                  <div className="de-progress-track"><i style={{ width: '92%' }} /></div>
                </div>
              </div>
            </div>

            <div className="de-expertise-highlights">
              <div className="de-highlight de-reveal"><LineChart size={24} strokeWidth={2} /><div><b>Forecast Reports</b><span>Clear, decision-ready outputs</span></div></div>
              <div className="de-highlight de-reveal" style={{ transitionDelay: '90ms' }}><Database size={24} strokeWidth={2} /><div><b>Trusted Data Layer</b><span>Datasets, runs & audit logs</span></div></div>
              <div className="de-highlight de-reveal" style={{ transitionDelay: '180ms' }}><ShieldCheck size={24} strokeWidth={2} /><div><b>Validated Inputs</b><span>Integrity checks on every run</span></div></div>
              <div className="de-highlight de-reveal" style={{ transitionDelay: '270ms' }}><BrainCircuit size={24} strokeWidth={2} /><div><b>AI-Driven Models</b><span>Auto-tuned for accuracy</span></div></div>
            </div>
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
            <div className="col-md-4 col-sm-6 col-xs-12">
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
            <div className="col-md-2 col-sm-6 col-xs-12">
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
            <div className="col-md-3 col-sm-6 col-xs-12">
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
            <div className="col-md-3 col-sm-6 col-xs-12">
              <h5>Get In Touch</h5>
              <div className="space1">
                <div className="form-group">
                  <input type="email" className="form-control" id="customeremail" placeholder="Enter Your Email Adress"></input>
                </div>
                <div className="connectbtn"><a href="#" aria-label="DE">Connect With Me <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
              </div>
            </div>
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

      <div className="container-fluid copybg">
        <div className="container mycontainer">
          <div className="row">
            <div className="col-md-11 col-sm-11 col-xs-12">
              <img src={images.copyimg} className="max" alt="Demand Edge"></img><br />©2023 Quation Solutions Pvt. Ltd., All rights reserved
            </div>
            <div className="col-md-1 col-sm-1 col-xs-12">
              <p id="bottom">
                <a href="#" onClick={scrollToTop} aria-label="DE" >
                  <iconify-icon icon="tabler:arrow-top-circle" className="scrollerbottom animate__animated animate__infinite animate__slideInUp"></iconify-icon>
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>
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
  .de-features-intro h2 { font-size: 30px !important; }
  .de-expertise-copy h2 { font-size: 32px !important; }
  .de-contact-copy h2 { font-size: 36px !important; }
  .de-card-feature h3 { font-size: 22px !important; }
  .de-diff-card h3,
  .de-contact-card h3 { font-size: 20px !important; }
  .de-section-head p { font-size: 16.5px !important; }
  .de-features-intro p { font-size: 16px !important; }
  .de-hero-copy p,
  .de-contact-copy p { font-size: 18px !important; }
  .de-card-feature p { font-size: 15px !important; }
  .de-diff-card p { font-size: 14.5px !important; }
  .de-expertise-copy p { font-size: 16px !important; }
  .de-demo-placeholder p { font-size: clamp(13px, 1.5vw, 18px) !important; }

  /* ------------------------------------------------------------------
     Animations
     ------------------------------------------------------------------ */
  @keyframes deFadeUp {
    from { opacity: 0; transform: translateY(26px); }
    to { opacity: 1; transform: none; }
  }
  @keyframes deFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes dePulse {
    0% { box-shadow: 0 14px 30px rgba(172, 20, 36, 0.32), 0 0 0 0 rgba(172, 20, 36, 0.45); }
    70% { box-shadow: 0 14px 30px rgba(172, 20, 36, 0.32), 0 0 0 18px rgba(172, 20, 36, 0); }
    100% { box-shadow: 0 14px 30px rgba(172, 20, 36, 0.32), 0 0 0 0 rgba(172, 20, 36, 0); }
  }

  /* Scroll-reveal — toggled by IntersectionObserver (adds .is-visible) */
  .de-reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
    will-change: opacity, transform;
  }
  .de-reveal.is-visible { opacity: 1; transform: none; }

  /* Hero entrance (above the fold → animate on load) */
  .de-hero-copy > * { animation: deFadeUp 0.7s both; }
  .de-hero-copy .de-eyebrow { animation-delay: 0.05s; }
  .de-hero-copy h1 { animation-delay: 0.15s; }
  .de-hero-copy p { animation-delay: 0.28s; }
  .de-hero-cta { animation-delay: 0.4s; }
  .de-hero-points { animation-delay: 0.52s; }
  .de-hero-visual { animation: deFadeUp 0.8s 0.35s both; }
  .de-demo-play { animation: dePulse 2.6s ease-out 1.6s infinite; }

  @media (prefers-reduced-motion: reduce) {
    .de-reveal,
    .de-hero-copy > *,
    .de-hero-visual,
    .de-hero-demo,
    .de-demo-play {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
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
  .de-hero-copy h1 span { color: var(--de-yellow); }

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
  .de-hero-demo {
    position: relative;
    z-index: 2;
    width: 59%;
    margin-bottom: 17%;
    background: #fff;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 16px;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 34px 74px rgba(4, 22, 33, 0.55);
    transform-style: preserve-3d;
    /* follow easing is handled in JS (rAF lerp); only animate shadow here */
    transition: box-shadow 0.35s ease;
    will-change: transform;
  }
  .de-hero-demo-bar {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 11px 14px;
    background: linear-gradient(135deg, var(--de-navy) 0%, var(--de-navy-deep) 100%);
  }
  .de-hero-demo-bar i {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #e0e6eb;
  }
  .de-hero-demo-bar i:nth-child(1) { background: #ff5f57; }
  .de-hero-demo-bar i:nth-child(2) { background: #febc2e; }
  .de-hero-demo-bar i:nth-child(3) { background: #28c840; }
  .de-demo-url {
    margin-left: 10px;
    font-size: 11px !important;
    font-weight: 500;
    letter-spacing: 0.3px;
    color: #cfe1ee;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 7px;
    padding: 3px 12px;
    white-space: nowrap;
  }
  .de-hero-demo:hover .de-demo-play { transform: scale(1.06); }

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
    padding: 6px 16px;
    border-radius: 12px;
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  }
  /* clean divider lines between stats (desktop) */
  .de-stat::after {
    content: '';
    position: absolute;
    top: 16%;
    bottom: 16%;
    right: 0;
    width: 1px;
    background: linear-gradient(180deg, transparent, var(--de-border) 25%, var(--de-border) 75%, transparent);
  }
  .de-stat:last-child::after { display: none; }

  .de-stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-bottom: 9px;
    border-radius: 10px;
    color: var(--de-blue);
    background: linear-gradient(135deg, #eaf4fb 0%, #f3f9fd 100%);
    border: 1px solid var(--de-border);
    transition: transform 0.3s ease, color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  }

  .de-stat strong {
    display: block;
    color: var(--de-navy);
    font-size: 32px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.5px;
  }
  .de-stat-label {
    display: block;
    margin-top: 6px;
    color: var(--de-muted);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  /* hover: lift + glow */
  .de-stat:hover {
    transform: translateY(-6px);
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 16px 30px rgba(7, 35, 52, 0.12);
  }
  .de-stat:hover .de-stat-icon {
    transform: scale(1.08);
    color: #fff;
    background: linear-gradient(135deg, var(--de-navy) 0%, var(--de-blue) 100%);
    box-shadow: 0 8px 18px rgba(27, 133, 186, 0.32);
  }

  @keyframes deStatsRise {
    from { opacity: 0; transform: translateY(26px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .de-stats { animation: none !important; }
  }

  /* ---------- Demo placeholder (rendered inside the hero) ---------- */
  .de-demo-placeholder {
    aspect-ratio: 16 / 9;
    margin: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 4px;
    border: 1.5px dashed #b6d4e8;
    border-radius: 12px;
    background:
      radial-gradient(420px 220px at 50% 22%, rgba(27, 133, 186, 0.18), transparent 70%),
      linear-gradient(135deg, #eef6fc 0%, #f3f9fd 55%, #e9f3fb 100%);
  }
  .de-demo-play {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: clamp(46px, 4.6vw, 64px);
    height: clamp(46px, 4.6vw, 64px);
    border-radius: 50%;
    background: linear-gradient(135deg, #c8324a 0%, var(--de-red) 60%, #8f0f1d 100%);
    color: #fff;
    margin-bottom: clamp(6px, 1vw, 12px);
    box-shadow: 0 14px 30px rgba(172, 20, 36, 0.4);
    transition: transform 0.2s ease;
  }
  .de-demo-play svg { width: clamp(20px, 2vw, 26px); height: auto; }
  .de-demo-placeholder p {
    color: var(--de-navy);
    font-size: 18px;
    font-weight: 700;
    margin: 0;
  }
  .de-demo-placeholder small {
    color: var(--de-muted);
    font-size: clamp(10px, 1.1vw, 12.5px);
    line-height: 1.4;
    padding: 0 clamp(10px, 2vw, 18px);
  }

  /* ---------- About ---------- */
  .de-about { background: linear-gradient(180deg, #ffffff, #f9fcff); }

  .de-about-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 26px;
    max-width: 1040px;
    margin: 0 auto;
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

  /* ---------- Expertise ---------- */
  .de-expertise { background: #fff; }
  .de-expertise-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    align-items: center;
  }
  .de-expertise-copy h2 {
    color: var(--de-navy);
    font-size: 32px;
    font-weight: 400;
    line-height: 1.25;
    margin: 0 0 14px;
  }
  .de-expertise-copy h2 span { font-weight: 800; }
  .de-expertise-copy p {
    color: var(--de-muted);
    font-size: 15.5px;
    line-height: 1.6;
    margin: 0 0 26px;
  }

  .de-progress-item { margin-bottom: 20px; }
  .de-progress-label {
    display: flex;
    justify-content: space-between;
    color: var(--de-navy);
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .de-progress-label b { color: var(--de-red); }
  .de-progress-track {
    height: 8px;
    background: var(--de-bg);
    border-radius: 10px;
    overflow: hidden;
  }
  .de-progress-track i {
    display: block;
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(to right, var(--de-navy), var(--de-blue));
  }

  .de-expertise-highlights {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .de-highlight {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: linear-gradient(180deg, #ffffff, #f6fbff);
    border: 1px solid var(--de-border);
    border-radius: 16px;
    padding: 20px;
    box-shadow: var(--de-shadow);
  }
  .de-highlight svg { color: var(--de-blue); flex-shrink: 0; }
  .de-highlight b { display: block; color: var(--de-navy); font-size: 15px; }
  .de-highlight span { display: block; color: var(--de-muted); font-size: 13px; margin-top: 3px; }

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
    padding: 34px 0 20px !important;
    background: var(--de-bg);
  }
  .footerbg .ftrlogo { width: 42% !important; margin-bottom: 6px; }
  .footerbg p {
    font-size: 13.5px !important;
    line-height: 1.6;
    width: 94%;
    margin-bottom: 12px;
  }
  .footerbg h5 {
    font-size: 15px !important;
    font-weight: 700 !important;
    margin: 0 0 4px !important;
  }
  .footerbg ul { line-height: 2 !important; }
  .footerbg ul li { font-size: 13.5px !important; }
  .footerbg .linehe { line-height: 1.55 !important; }
  .footerbg .ftrsocialmedia { margin-top: 12px !important; }
  .footerbg .form-control { height: 44px !important; font-size: 13px; }
  .footerbg .connectbtn { margin-top: 12px; }
  .footerbg .connectbtn a { padding: 11px 18px; font-size: 14px; }
  .copybg { padding: 9px 0 !important; font-size: 12px; line-height: 1.4; }
  .copybg img { width: 96px !important; height: auto !important; margin-bottom: 2px; }
  .copybg #bottom { margin: 0 !important; }

  /* ============================================================
     Responsive
     ============================================================ */
  @media (max-width: 991px) {
    .de-hero { padding-top: 120px; }
    .de-hero-grid { grid-template-columns: 1fr; text-align: center; gap: 30px; }
    .de-hero-copy h1 { font-size: 46px !important; }
    .de-hero-copy p { margin-left: auto; margin-right: auto; }
    .de-hero-cta, .de-hero-points { justify-content: center; }
    .de-hero-art { min-height: 0; display: block; }
    .de-hero-demo {
      position: static;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
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

    .de-about-grid,
    .de-diff-grid,
    .de-expertise-grid,
    .de-contact-grid { grid-template-columns: 1fr; }

    .de-features-grid { grid-template-columns: 1fr; gap: 24px; }
    .de-features-intro { text-align: center; }

    .de-expertise-highlights { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 575px) {
    .de-section { padding: 38px 0; }
    .de-hero-copy h1 { font-size: 36px !important; }
    .de-hero-copy p { font-size: 16px !important; }
    .de-section-head h2 { font-size: 26px !important; }
    .de-expertise-copy h2,
    .de-contact-copy h2 { font-size: 26px !important; }
    /* Mobile: 2 columns if space allows, no vertical dividers */
    .de-stats { grid-template-columns: repeat(2, 1fr); gap: 14px 0; padding: 22px 12px; }
    .de-stat { padding: 8px 10px; }
    .de-stat::after,
    .de-stat:nth-child(odd)::after { display: none; }
    .de-stat strong { font-size: 32px; }
    .de-stat-icon { width: 38px; height: 38px; margin-bottom: 9px; }
    .de-form-row { grid-template-columns: 1fr; }
    .de-expertise-highlights { grid-template-columns: 1fr; }
    .de-contact-card { padding: 24px; }
  }
`;
