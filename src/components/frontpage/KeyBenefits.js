import React, { useState, useEffect, useRef } from 'react';
import { KeyBenefitsData } from '../../Utils/dataKeyBenefits';
import styled from 'styled-components';
import { Check, ArrowRight } from 'lucide-react';

const ROTATE_MS = 3000;

function KeyBenefits({ onExplore }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const count = KeyBenefitsData.length;

  useEffect(() => {
    if (paused || count <= 1) return undefined;
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % count);
    }, ROTATE_MS);
    return () => clearTimeout(timerRef.current);
  }, [active, paused, count]);

  if (!KeyBenefitsData || count === 0) {
    return null;
  }

  const item = KeyBenefitsData[active];

  return (
    <Wrapper
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="kb-tabs" role="tablist">
        {KeyBenefitsData.map((kb, i) => (
          <button
            key={kb.Name}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`kb-tab${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            <span className="kb-tab-label">{kb.Name}</span>
            {i === active && (
              <span
                key={active}
                className="kb-tab-progress"
                style={{ animationPlayState: paused ? 'paused' : 'running' }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="kb-panel">
        <div className="kb-copy" key={item.Name}>
          <span className="kb-step">
            {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <h3>{item.Name}</h3>
          <p>{item.Description}</p>
          <ul className="kb-points">
            {item.Points.map((pt) => (
              <li key={pt}>
                <span className="kb-check"><Check size={13} strokeWidth={3.2} /></span>
                {pt}
              </li>
            ))}
          </ul>
          <button type="button" className="kb-link" onClick={onExplore}>
            Explore the platform <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="kb-visual" key={`v-${item.Name}`}>
          <div className="kb-visual-frame">
            <img src={item.Image} alt={item.Name} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default KeyBenefits;

const Wrapper = styled.div`
  --kb-navy: #0c3c54;
  --kb-blue: #1b85ba;
  --kb-border: #e3edf4;
  --kb-muted: #5f7280;

  max-width: 1080px;
  margin: 0 auto;

  /* ---------- Tab bar ---------- */
  .kb-tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 26px;
  }

  .kb-tab {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--kb-border);
    background: #fff;
    color: var(--kb-navy);
    font-size: 14px;
    font-weight: 600;
    padding: 10px 18px;
    border-radius: 999px;
    cursor: pointer;
    outline: none;
    transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
  }

  .kb-tab:hover {
    border-color: var(--kb-blue);
    transform: translateY(-1px);
  }

  .kb-tab.is-active {
    color: #fff;
    border-color: transparent;
    background-image: linear-gradient(to right, var(--kb-navy), var(--kb-blue));
    box-shadow: 0 10px 22px rgba(12, 60, 84, 0.22);
  }

  .kb-tab-label { position: relative; z-index: 2; }

  /* 3-second auto-rotate progress indicator */
  .kb-tab-progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    width: 100%;
    transform-origin: left center;
    background: rgba(255, 255, 255, 0.85);
    animation: kbProgress ${ROTATE_MS}ms linear forwards;
  }

  @keyframes kbProgress {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }

  /* ---------- Content panel ---------- */
  .kb-panel {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    gap: 36px;
    background: #fff;
    border: 1px solid var(--kb-border);
    border-top: 3px solid var(--kb-navy);
    border-radius: 18px;
    padding: 34px 36px;
    box-shadow: 0 18px 44px rgba(12, 60, 84, 0.1);
  }

  .kb-copy { animation: kbFade 0.45s ease both; }

  .kb-step {
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--kb-blue);
    margin-bottom: 10px;
  }

  .kb-copy h3 {
    color: var(--kb-navy);
    font-size: 26px !important;
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 12px;
  }

  .kb-copy p {
    color: var(--kb-muted);
    font-size: 15.5px !important;
    line-height: 1.65;
    margin: 0 0 18px;
    text-align: left;
    width: 100% !important;
  }

  .kb-points {
    list-style: none;
    margin: 0 0 22px;
    padding: 0;
  }

  .kb-points li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: var(--kb-navy);
    font-size: 14.5px;
    font-weight: 500;
    line-height: 1.45;
    margin-bottom: 11px;
  }

  .kb-check {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    margin-top: 1px;
    border-radius: 50%;
    background: #e7f4fb;
    color: var(--kb-blue);
  }

  .kb-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--kb-blue);
    font-size: 14.5px;
    font-weight: 700;
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    transition: gap 0.2s ease;
  }
  .kb-link:hover { gap: 11px; }

  /* ---------- Visual ---------- */
  .kb-visual { animation: kbFade 0.5s ease both; }

  .kb-visual-frame {
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--kb-border);
    box-shadow: 0 16px 40px rgba(12, 60, 84, 0.16);
    background: #fff;
  }

  .kb-visual-frame img {
    display: block;
    width: 100%;
    height: auto;
  }

  @keyframes kbFade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .kb-tab-progress,
    .kb-copy,
    .kb-visual { animation: none !important; }
  }

  /* ---------- Responsive ---------- */
  @media (max-width: 991px) {
    .kb-panel {
      grid-template-columns: 1fr;
      gap: 26px;
      padding: 28px 24px;
    }
    .kb-visual { order: -1; }
    .kb-copy h3 { font-size: 23px !important; }
  }

  @media (max-width: 575px) {
    .kb-tabs {
      flex-wrap: nowrap;
      overflow-x: auto;
      justify-content: flex-start;
      padding-bottom: 6px;
      -webkit-overflow-scrolling: touch;
    }
    .kb-tab {
      flex: 0 0 auto;
      font-size: 13px;
      padding: 9px 14px;
    }
    .kb-panel { padding: 22px 18px; }
  }
`;
