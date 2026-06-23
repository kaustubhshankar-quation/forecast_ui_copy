import React, { useState } from 'react';
import styled from 'styled-components';
import {
  UserCog,
  Users,
  UploadCloud,
  Workflow,
  AppWindow,
  Server,
  BrainCircuit,
  Database,
  TrendingUp,
  BellRing,
  Handshake,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

/* ============================================================
   Content data - short, scannable labels only.
   Edit here; the UI renders from these arrays.
   ============================================================ */

const heading = {
  eyebrow: 'Platform Overview',
  title: 'How Demand Edge Works',
  subtitle: 'From inputs to outcomes — one connected demand planning flow.',
};

const inputs = [
  { id: 'planner', title: 'Planner / Admin', caption: 'Plan & configure', icon: 'user-cog' },
  { id: 'sales', title: 'Sales Head / User', caption: 'Review & approve', icon: 'users' },
  { id: 'upload', title: 'Data Upload', caption: 'Bring your data', icon: 'upload' },
  { id: 'setup', title: 'Workflow Setup', caption: 'Design the flow', icon: 'workflow' },
];

const platform = [
  {
    id: 'web',
    title: 'Web App',
    caption: 'Plan, upload, review',
    theme: 'blue',
    icon: 'app',
    tags: ['Dashboard', 'Workflow', 'Reports'],
  },
  {
    id: 'services',
    title: 'Workflow Services',
    caption: 'Manage approvals & collaboration',
    theme: 'green',
    icon: 'server',
    tags: ['Roles', 'Approvals', 'Collaboration'],
  },
  {
    id: 'engine',
    title: 'Forecasting Engine',
    caption: 'Train, evaluate, generate forecast',
    theme: 'purple',
    icon: 'brain',
    tags: ['Prep', 'Train', 'Evaluate', 'Forecast'],
    pipeline: ['Data Prep', 'Features', 'Training', 'Evaluation', 'Forecast'],
    models: ['ARIMA', 'SARIMA', 'XGBoost', 'LightGBM'],
  },
  {
    id: 'data',
    title: 'Data Layer',
    caption: 'Store datasets, workflows & audit logs',
    theme: 'orange',
    icon: 'database',
    tags: ['Datasets', 'Runs', 'Audit Logs'],
  },
];

const outputs = [
  { id: 'reports', title: 'Forecast Reports', icon: 'trending-up', theme: 'blue' },
  { id: 'notify', title: 'Notifications', icon: 'bell', theme: 'teal' },
  { id: 'collab', title: 'Sales Collaboration', icon: 'handshake', theme: 'purple' },
  { id: 'approvals', title: 'Approvals', icon: 'check', theme: 'green' },
  { id: 'audit', title: 'Audit Trail', icon: 'shield', theme: 'orange' },
];

const stages = [
  {
    id: 'inputs',
    no: '01',
    title: 'Inputs',
    caption: 'Who and what feed the platform',
    icon: 'upload',
    theme: 'blue',
  },
  {
    id: 'platform',
    no: '02',
    title: 'Demand Edge Platform',
    caption: 'Where forecasting actually happens',
    icon: 'brain',
    theme: 'purple',
  },
  {
    id: 'outputs',
    no: '03',
    title: 'Outputs',
    caption: 'What the platform delivers back',
    icon: 'trending-up',
    theme: 'green',
  },
];

// Light ambient dots drifting behind the architecture section.
const archParticles = [
  { left: '7%', size: 6, delay: 0, duration: 17, opacity: 0.4 },
  { left: '19%', size: 4, delay: 4, duration: 20, opacity: 0.3 },
  { left: '32%', size: 7, delay: 2, duration: 16, opacity: 0.38 },
  { left: '46%', size: 5, delay: 6, duration: 19, opacity: 0.32 },
  { left: '58%', size: 6, delay: 1.5, duration: 18, opacity: 0.4 },
  { left: '71%', size: 4, delay: 5, duration: 21, opacity: 0.3 },
  { left: '83%', size: 7, delay: 3, duration: 16, opacity: 0.36 },
  { left: '93%', size: 5, delay: 6.5, duration: 20, opacity: 0.32 },
];

/* ============================================================
   Icon helpers
   ============================================================ */

const ICONS = {
  'user-cog': UserCog,
  users: Users,
  upload: UploadCloud,
  workflow: Workflow,
  app: AppWindow,
  server: Server,
  brain: BrainCircuit,
  database: Database,
  'trending-up': TrendingUp,
  bell: BellRing,
  handshake: Handshake,
  check: CheckCircle2,
  shield: ShieldCheck,
};

function ThemedIcon({ name, theme = 'navy', size = 18 }) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return (
    <span className={`arch-icon arch-icon-${theme}`}>
      <Icon size={size} strokeWidth={2} />
    </span>
  );
}

/* ============================================================
   Detail cards
   ============================================================ */

function InputNode({ item, order = 0 }) {
  return (
    <div className="arch-node arch-rise" style={{ '--i': order }}>
      <ThemedIcon name={item.icon} theme="navy" size={18} />
      <div className="arch-node-text">
        <h5>{item.title}</h5>
        {item.caption && <span>{item.caption}</span>}
      </div>
    </div>
  );
}

function OutputNode({ item, order = 0 }) {
  return (
    <div className={`arch-out arch-out-${item.theme} arch-rise`} style={{ '--i': order }}>
      <ThemedIcon name={item.icon} theme={item.theme} size={20} />
      <h6>{item.title}</h6>
    </div>
  );
}

function PlatformCard({ card, feature = false, order = 0 }) {
  // internal stagger so tags build first, then the pipeline steps
  const tagBase = order + 1;
  const pipeBase = tagBase + card.tags.length;
  return (
    <div
      className={`arch-platform-card arch-accent-${card.theme} arch-rise${feature ? ' arch-platform-card--feature' : ''}`}
      style={{ '--i': order }}
    >
      <div className="arch-platform-head">
        <ThemedIcon name={card.icon} theme={card.theme} size={19} />
        <div className="arch-platform-titles">
          <h4>{card.title}</h4>
          <span>{card.caption}</span>
        </div>
      </div>

      <div className="arch-tags">
        {card.tags.map((tag, i) => (
          <span
            className={`arch-tag arch-tag-${card.theme}${feature ? ' arch-rise-in' : ''}`}
            style={feature ? { '--i': tagBase + i } : undefined}
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>

      {card.pipeline && (
        <div className="arch-pipeline">
          {card.pipeline.map((step, i) => (
            <React.Fragment key={step}>
              <span className="arch-pipeline-step arch-rise-in" style={{ '--i': pipeBase + i }}>
                {step}
              </span>
              {i < card.pipeline.length - 1 && (
                <ChevronRight className="arch-pipeline-arrow" size={13} strokeWidth={2.5} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {card.models && (
        <div className="arch-models">
          <span className="arch-models-label">Models</span>
          {card.models.join('  ·  ')}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Stage detail renderer
   ============================================================ */

function StageDetail({ stageId }) {
  if (stageId === 'inputs') {
    return (
      <div className="arch-detail-grid arch-detail-grid--two">
        {inputs.map((item, i) => (
          <InputNode key={item.id} item={item} order={i} />
        ))}
      </div>
    );
  }

  if (stageId === 'outputs') {
    return (
      <div className="arch-detail-grid arch-detail-grid--three">
        {outputs.map((item, i) => (
          <OutputNode key={item.id} item={item} order={i} />
        ))}
      </div>
    );
  }

  const featureCards = platform.filter((c) => c.pipeline);
  const standardCards = platform.filter((c) => !c.pipeline);
  // sub cards continue the stagger after the feature card has built its
  // internal tags + pipeline steps, so the whole diagram assembles in order.
  const feature = featureCards[0];
  const subBase = 1 + (feature ? feature.tags.length + feature.pipeline.length : 0);

  return (
    <div className="arch-platform-body">
      {featureCards.map((card) => (
        <PlatformCard key={card.id} card={card} feature order={0} />
      ))}
      <div className="arch-platform-sub">
        {standardCards.map((card, i) => (
          <PlatformCard key={card.id} card={card} order={subBase + i} />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Main section
   ============================================================ */

export default function ArchitectureSection() {
  const [active, setActive] = useState('platform');
  const activeIndex = stages.findIndex((s) => s.id === active);
  const activeStage = stages[activeIndex] || stages[0];

  return (
    <Wrapper className="container-fluid">
      <div className="arch-particles" aria-hidden="true">
        {archParticles.map((p, i) => (
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
      <div className="container mycontainer">
        <div className="arch-header de-reveal">
          <span className="arch-eyebrow">{heading.eyebrow}</span>
          <h2>{heading.title}</h2>
          <p>{heading.subtitle}</p>
        </div>

        <div className="arch-layout de-reveal">
          {/* LEFT: numbered stage selector */}
          <div className="arch-stages" role="tablist">
            {stages.map((stage) => {
              const isActive = stage.id === active;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`arch-stage arch-stage-${stage.theme}${isActive ? ' is-active' : ''}`}
                  onClick={() => setActive(stage.id)}
                >
                  <span className="arch-stage-no">{stage.no}</span>
                  <span className="arch-stage-text">
                    <h4>{stage.title}</h4>
                    <span>{stage.caption}</span>
                  </span>
                  <ChevronRight className="arch-stage-chevron" size={18} strokeWidth={2.5} />
                </button>
              );
            })}
          </div>

          {/* RIGHT: live detail panel */}
          <div className={`arch-detail arch-detail-${activeStage.theme}`} key={active}>
            <div className="arch-detail-head">
              <ThemedIcon name={activeStage.icon} theme={activeStage.theme} size={22} />
              <div className="arch-detail-titles">
                <h3>{activeStage.title}</h3>
                <span>{activeStage.caption}</span>
              </div>
              <span className="arch-detail-step">
                Step {activeStage.no} <em>of {String(stages.length).padStart(2, '0')}</em>
              </span>
            </div>

            <StageDetail stageId={active} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

/* ============================================================
   Styles - everything scoped inside this wrapper
   ============================================================ */

const Wrapper = styled.div`
  --arch-navy: #0c3c54;
  --arch-blue: #1b85ba;
  --arch-blue-bg: #eff7fc;
  --arch-blue-border: #c4e0f0;
  --arch-green: #1e8e5a;
  --arch-green-bg: #effaf4;
  --arch-green-border: #c2e7d3;
  --arch-purple: #6d4fc2;
  --arch-purple-bg: #f5f2fd;
  --arch-purple-border: #dbd1f5;
  --arch-orange: #d4751a;
  --arch-orange-bg: #fef6ec;
  --arch-orange-border: #f3dcbb;
  --arch-teal: #0e7c7b;
  --arch-teal-bg: #ecf8f8;
  --arch-teal-border: #c0e4e3;
  --arch-text: #2c3e50;
  --arch-muted: #6a7d8c;
  --arch-shadow: 0 4px 18px rgba(12, 60, 84, 0.07);
  --arch-shadow-hover: 0 14px 34px rgba(12, 60, 84, 0.14);

  position: relative;
  background: radial-gradient(
      1200px 480px at 50% -12%,
      #eaf3fb 0%,
      rgba(234, 243, 251, 0) 72%
    ),
    linear-gradient(180deg, #ffffff 0%, #f5fafe 100%);
  padding: 48px 0 56px;
  overflow: hidden;

  & > .container { position: relative; z-index: 1; }

  /* ---------- Ambient floating dots ---------- */
  .arch-particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }
  .arch-particles span {
    position: absolute;
    bottom: -12px;
    border-radius: 50%;
    background: rgba(27, 133, 186, 0.32);
    box-shadow: 0 0 8px rgba(27, 133, 186, 0.28);
    animation-name: archFloatUp;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
  @keyframes archFloatUp {
    0% { transform: translateY(0) scale(0.7); opacity: 0; }
    15% { opacity: 1; }
    85% { opacity: 1; }
    100% { transform: translateY(-440px) scale(0.4); opacity: 0; }
  }

  /* ---------- Header ---------- */
  .arch-header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 34px;
  }

  .arch-eyebrow {
    display: inline-block;
    color: var(--arch-blue);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    background: var(--arch-blue-bg);
    border: 1px solid var(--arch-blue-border);
    padding: 5px 14px;
    border-radius: 999px;
    margin-bottom: 14px;
  }

  .arch-header h2 {
    color: var(--arch-navy);
    font-size: 34px !important;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 10px;
  }

  .arch-header p {
    color: var(--arch-muted);
    font-size: 16.5px !important;
    line-height: 1.55;
    margin: 0;
  }

  /* ---------- Layout: stage selector + detail ---------- */
  .arch-layout {
    display: grid;
    grid-template-columns: 0.82fr 1.18fr;
    gap: 26px;
    align-items: stretch;
    max-width: 1140px;
    margin: 0 auto;
  }

  /* ---------- Left: numbered stages ---------- */
  .arch-stages {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .arch-stage {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    gap: 14px;
    text-align: left;
    width: 100%;
    background: #ffffff;
    border: 1px solid #e8eff5;
    border-radius: 16px;
    padding: 18px 18px;
    cursor: pointer;
    outline: none;
    overflow: hidden;
    box-shadow: var(--arch-shadow);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;
  }

  .arch-stage::before {
    content: '';
    position: absolute;
    top: 14px;
    bottom: 14px;
    left: 0;
    width: 4px;
    border-radius: 0 4px 4px 0;
    background: transparent;
    transition: background 0.25s ease;
  }

  .arch-stage:hover {
    transform: translateY(-2px);
    box-shadow: var(--arch-shadow-hover);
  }
  .arch-stage:focus-visible {
    outline: 2px solid var(--arch-blue);
    outline-offset: 2px;
  }
  /* active card: soft glow + a slow moving sheen */
  .arch-stage.is-active { box-shadow: var(--arch-shadow-hover); }
  .arch-stage.is-active::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    pointer-events: none;
    background: linear-gradient(120deg, transparent 35%, rgba(255, 255, 255, 0.5) 50%, transparent 65%);
    background-size: 220% 100%;
    animation: archStageSheen 4.5s ease-in-out infinite;
  }
  @keyframes archStageSheen {
    0% { background-position: 220% 0; }
    100% { background-position: -120% 0; }
  }

  .arch-stage-no {
    flex-shrink: 0;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0.5px;
    color: #c0ced8;
    transition: color 0.25s ease;
    min-width: 30px;
  }

  .arch-stage-text {
    flex: 1;
    min-width: 0;
  }

  .arch-stage-text h4 {
    color: var(--arch-navy);
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
    margin: 0 0 2px;
  }

  .arch-stage-text span {
    display: block;
    color: var(--arch-muted);
    font-size: 12.5px;
    line-height: 1.35;
  }

  .arch-stage-chevron {
    flex-shrink: 0;
    color: #c0ced8;
    transition: transform 0.25s ease, color 0.25s ease;
  }

  /* active states per theme */
  .arch-stage.is-active { border-color: transparent; }
  .arch-stage.is-active .arch-stage-chevron { transform: translateX(3px); }

  .arch-stage-blue.is-active { background: var(--arch-blue-bg); }
  .arch-stage-blue.is-active::before { background: var(--arch-blue); }
  .arch-stage-blue.is-active .arch-stage-no,
  .arch-stage-blue.is-active .arch-stage-chevron { color: var(--arch-blue); }

  .arch-stage-purple.is-active { background: var(--arch-purple-bg); }
  .arch-stage-purple.is-active::before { background: var(--arch-purple); }
  .arch-stage-purple.is-active .arch-stage-no,
  .arch-stage-purple.is-active .arch-stage-chevron { color: var(--arch-purple); }

  .arch-stage-green.is-active { background: var(--arch-green-bg); }
  .arch-stage-green.is-active::before { background: var(--arch-green); }
  .arch-stage-green.is-active .arch-stage-no,
  .arch-stage-green.is-active .arch-stage-chevron { color: var(--arch-green); }

  /* ---------- Right: detail panel ---------- */
  .arch-detail {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid #e8eff5;
    border-radius: 18px;
    padding: 20px 20px 20px;
    box-shadow: 0 14px 38px rgba(12, 60, 84, 0.1);
    overflow: hidden;
    transform-origin: center top;
    animation: archFade 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  /* blueprint dot-grid that prints in behind the cards as it builds */
  .arch-detail::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: radial-gradient(rgba(27, 133, 186, 0.12) 1px, transparent 1px);
    background-size: 18px 18px;
    -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 60%, transparent 100%);
    mask-image: linear-gradient(180deg, #000 0%, #000 60%, transparent 100%);
    opacity: 0;
    animation: archGridIn 1.35s ease 0.08s both;
  }
  @keyframes archGridIn {
    from { opacity: 0; transform: scale(1.04); }
    to { opacity: 1; transform: scale(1); }
  }
  /* keep real content above the blueprint grid */
  .arch-detail > * { position: relative; z-index: 1; }
  /* a glowing blue "render scan" sweeps across the panel as it builds */
  .arch-detail::after {
    content: '';
    position: absolute;
    top: 0;
    left: -40%;
    width: 42%;
    height: 100%;
    z-index: 2;
    background: linear-gradient(
      105deg,
      transparent,
      rgba(27, 133, 186, 0.16),
      rgba(255, 255, 255, 0.55),
      transparent
    );
    transform: skewX(-16deg);
    pointer-events: none;
    animation: archShine 2.2s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both;
  }
  @keyframes archShine {
    0% { left: -45%; opacity: 0; }
    25% { opacity: 1; }
    100% { left: 125%; opacity: 0; }
  }

  .arch-detail-blue { border-top: 3px solid var(--arch-blue); }
  .arch-detail-purple { border-top: 3px solid var(--arch-purple); }
  .arch-detail-green { border-top: 3px solid var(--arch-green); }

  .arch-detail-head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 14px;
    margin-bottom: 14px;
    border-bottom: 1px solid #eef4f8;
  }

  .arch-detail-titles {
    flex: 1;
    min-width: 0;
  }

  .arch-detail-titles h3 {
    color: var(--arch-navy);
    font-size: 17px !important;
    font-weight: 800;
    line-height: 1.2;
    margin: 0;
  }

  .arch-detail-titles span {
    display: block;
    color: var(--arch-muted);
    font-size: 12px;
    line-height: 1.3;
    margin-top: 2px;
  }

  .arch-detail-step {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: var(--arch-navy);
  }
  .arch-detail-step em {
    font-style: normal;
    color: var(--arch-muted);
    font-weight: 600;
  }

  @keyframes archFade {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ---------- Build-in stagger (re-runs on stage change via key) ----------
     Uses fill-mode: backwards so the from-state shows during the stagger
     delay, but the element reverts to its normal styles afterwards — that
     keeps hover transforms/shadows fully working once the build finishes. */
  .arch-detail-head > * {
    animation: archRiseSoft 0.75s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  }
  .arch-detail-head > *:nth-child(1) { animation-delay: 0.1s; }
  .arch-detail-head > *:nth-child(2) { animation-delay: 0.22s; }
  .arch-detail-head > *:nth-child(3) { animation-delay: 0.34s; }

  .arch-rise {
    animation: archMaterialize 0.9s cubic-bezier(0.22, 1, 0.36, 1) backwards;
    animation-delay: calc(0.42s + var(--i, 0) * 0.14s);
  }
  .arch-rise-in {
    animation: archMaterialize 0.78s cubic-bezier(0.22, 1, 0.36, 1) backwards;
    animation-delay: calc(0.52s + var(--i, 0) * 0.11s);
  }
  @keyframes archRiseSoft {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  /* "render in": blocks fade up out of blur with a brief blueprint glow */
  @keyframes archMaterialize {
    0% {
      opacity: 0;
      transform: translateY(14px) scale(0.92);
      filter: blur(6px);
    }
    55% {
      opacity: 1;
      filter: blur(0);
      box-shadow: 0 0 0 2px rgba(27, 133, 186, 0.5), 0 0 18px rgba(27, 133, 186, 0.28);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
      box-shadow: 0 0 0 0 rgba(27, 133, 186, 0);
    }
  }

  /* ---------- Detail grids ---------- */
  .arch-detail-grid {
    display: grid;
    gap: 14px;
    flex: 1;
    align-content: stretch;
  }
  .arch-detail-grid--two { grid-template-columns: repeat(2, 1fr); }
  .arch-detail-grid--three { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }

  /* ---------- Icon ---------- */
  .arch-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 11px;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  /* icon glow on card hover */
  .arch-node:hover .arch-icon,
  .arch-out:hover .arch-icon,
  .arch-platform-card:hover .arch-icon {
    transform: scale(1.1);
    box-shadow: 0 0 0 4px rgba(27, 133, 186, 0.1);
  }

  .arch-icon-navy { background: rgba(12, 60, 84, 0.08); color: var(--arch-navy); }
  .arch-icon-blue { background: var(--arch-blue-bg); color: var(--arch-blue); }
  .arch-icon-green { background: var(--arch-green-bg); color: var(--arch-green); }
  .arch-icon-purple { background: var(--arch-purple-bg); color: var(--arch-purple); }
  .arch-icon-orange { background: var(--arch-orange-bg); color: var(--arch-orange); }
  .arch-icon-teal { background: var(--arch-teal-bg); color: var(--arch-teal); }

  /* ---------- Input nodes ---------- */
  .arch-node {
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
    background: #fbfdff;
    border: 1px solid #e8eff5;
    border-radius: 14px;
    padding: 14px 16px;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  }

  .arch-node:hover {
    transform: translateY(-3px);
    background: #fff;
    border-color: var(--arch-blue-border);
    box-shadow: var(--arch-shadow-hover);
  }

  .arch-node-text h5 {
    color: var(--arch-navy);
    font-size: 13.5px;
    font-weight: 700;
    line-height: 1.25;
    margin: 0;
  }

  .arch-node-text span {
    display: block;
    color: var(--arch-muted);
    font-size: 11.5px;
    line-height: 1.3;
    margin-top: 2px;
  }

  /* ---------- Platform cards ---------- */
  .arch-platform-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }

  .arch-platform-sub {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    flex: 1;
    align-items: stretch;
  }

  .arch-platform-card {
    position: relative;
    text-align: left;
    background: #ffffff;
    border: 1px solid #e8eff5;
    border-radius: 14px;
    padding: 15px 16px;
    box-shadow: var(--arch-shadow);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    overflow: hidden;
  }

  .arch-platform-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
  }

  .arch-accent-blue::before { background: var(--arch-blue); }
  .arch-accent-green::before { background: var(--arch-green); }
  .arch-accent-purple::before { background: var(--arch-purple); }
  .arch-accent-orange::before { background: var(--arch-orange); }

  .arch-platform-card:hover {
    transform: translateY(-4px);
    border-color: var(--arch-blue-border);
    box-shadow: var(--arch-shadow-hover);
  }

  .arch-platform-card--feature {
    background:
      radial-gradient(420px 160px at 100% 0%, rgba(109, 79, 194, 0.07), transparent 70%),
      #ffffff;
    border-color: var(--arch-purple-border);
  }

  .arch-platform-head {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-bottom: 12px;
  }

  .arch-platform-titles h4 {
    color: var(--arch-navy);
    font-size: 14.5px;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
  }

  .arch-platform-titles span {
    display: block;
    color: var(--arch-muted);
    font-size: 11.5px;
    line-height: 1.3;
    margin-top: 2px;
  }

  /* ---------- Tags ---------- */
  .arch-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .arch-tag {
    font-size: 11px;
    font-weight: 600;
    line-height: 1.2;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid;
    background: #fff;
  }

  .arch-tag-blue { color: var(--arch-blue); border-color: var(--arch-blue-border); background: var(--arch-blue-bg); }
  .arch-tag-green { color: var(--arch-green); border-color: var(--arch-green-border); background: var(--arch-green-bg); }
  .arch-tag-purple { color: var(--arch-purple); border-color: var(--arch-purple-border); background: var(--arch-purple-bg); }
  .arch-tag-orange { color: var(--arch-orange); border-color: var(--arch-orange-border); background: var(--arch-orange-bg); }

  /* ---------- Forecasting pipeline ---------- */
  .arch-pipeline {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    padding: 11px 13px;
    background: var(--arch-purple-bg);
    border: 1px dashed var(--arch-purple-border);
    border-radius: 12px;
  }

  .arch-pipeline-step {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--arch-purple);
    background: #ffffff;
    border: 1px solid var(--arch-purple-border);
    border-radius: 7px;
    padding: 4px 9px;
    white-space: nowrap;
  }

  .arch-pipeline-arrow {
    color: var(--arch-purple);
    opacity: 0.55;
    flex-shrink: 0;
  }

  .arch-models {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.4px;
    color: var(--arch-muted);
  }

  .arch-models-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--arch-purple);
    background: var(--arch-purple-bg);
    border: 1px solid var(--arch-purple-border);
    border-radius: 6px;
    padding: 3px 8px;
  }

  /* ---------- Output nodes ---------- */
  .arch-out {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    text-align: center;
    background: #fbfdff;
    border: 1px solid #e8eff5;
    border-top: 3px solid transparent;
    border-radius: 14px;
    padding: 16px 12px;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  }

  .arch-out:hover {
    transform: translateY(-3px);
    background: #fff;
    box-shadow: var(--arch-shadow-hover);
  }
  .arch-out:hover .arch-icon { transform: scale(1.12); }

  .arch-out h6 {
    color: var(--arch-navy);
    font-size: 12px;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
  }

  .arch-out-blue { border-top-color: var(--arch-blue); }
  .arch-out-teal { border-top-color: var(--arch-teal); }
  .arch-out-purple { border-top-color: var(--arch-purple); }
  .arch-out-green { border-top-color: var(--arch-green); }
  .arch-out-orange { border-top-color: var(--arch-orange); }

  /* ---------- Pipeline arrow motion ---------- */
  @keyframes archPipelineNudge {
    0%, 100% { transform: translateX(0); opacity: 0.45; }
    50% { transform: translateX(3px); opacity: 0.85; }
  }
  .arch-pipeline-arrow { animation: archPipelineNudge 1.7s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .arch-pipeline-arrow,
    .arch-detail,
    .arch-detail::before,
    .arch-detail::after,
    .arch-detail-head > *,
    .arch-rise,
    .arch-rise-in,
    .arch-stage.is-active::after,
    .arch-particles span { animation: none !important; }
    .arch-detail::before { opacity: 1 !important; transform: none !important; }
    .arch-detail-head > *,
    .arch-rise,
    .arch-rise-in { opacity: 1 !important; transform: none !important; filter: none !important; }
    .arch-particles { display: none; }
  }

  /* ============================================================
     Responsive
     ============================================================ */

  @media (max-width: 991px) {
    .arch-layout {
      grid-template-columns: 1fr;
      gap: 18px;
      max-width: 620px;
    }

    .arch-stages {
      flex-direction: row;
      overflow-x: auto;
      padding-bottom: 6px;
      -webkit-overflow-scrolling: touch;
    }

    .arch-stage {
      flex: 0 0 auto;
      min-width: 220px;
    }
    .arch-stage::before { display: none; }
    .arch-stage-chevron { display: none; }
  }

  @media (max-width: 575px) {
    padding: 40px 0 46px;

    .arch-header h2 { font-size: 26px !important; }
    .arch-header p { font-size: 14.5px !important; }

    .arch-detail { padding: 20px 16px 22px; }
    .arch-detail-grid--two { grid-template-columns: 1fr; }
    .arch-platform-sub { grid-template-columns: 1fr; }
    .arch-detail-step { display: none; }
    .arch-pipeline-step { flex: 1; text-align: center; }
  }
`;
