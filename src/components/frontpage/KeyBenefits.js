import React, { useState } from 'react';
import { KeyBenefitsData } from '../../Utils/dataKeyBenefits';
import styled from 'styled-components';
import { Check, ArrowRight } from 'lucide-react';

function KeyBenefits({ onExplore }) {
  const [active, setActive] = useState(0);

  const count = KeyBenefitsData.length;

  if (!KeyBenefitsData || count === 0) {
    return null;
  }

  const item = KeyBenefitsData[active];

  return (
    <Wrapper>
      <div className="kb-layout">
        {/* LEFT: just the names */}
        <div className="kb-names" role="tablist">
          {KeyBenefitsData.map((kb, i) => (
            <button
              key={kb.Name}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`kb-name${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              {kb.Name}
            </button>
          ))}
        </div>

        {/* MIDDLE: the data for the selected name */}
        <div className="kb-detail" key={`d-${item.Name}`}>
          <span className="kb-detail-step">
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

        {/* RIGHT: visual */}
        <div className="kb-visual">
          <div className="kb-visual-frame" key={`v-${item.Name}`}>
            <img src={item.Image} alt={item.Name} />
            <span className="kb-visual-badge">
              {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} · {item.Name}
            </span>
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
  --kb-red: #ac1424;
  --kb-border: #e3edf4;
  --kb-muted: #5f7280;

  max-width: 1120px;
  margin: 0 auto;

  .kb-layout {
    display: grid;
    grid-template-columns: 0.85fr 1fr 1.05fr;
    gap: 30px;
    align-items: start;
  }

  /* ---------- Left: names list ---------- */
  .kb-names {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-left: 14px;
    border-left: 3px solid var(--kb-border);
  }

  .kb-name {
    position: relative;
    text-align: left;
    width: 100%;
    background: #fff;
    border: 1px solid var(--kb-border);
    border-radius: 12px;
    color: var(--kb-navy);
    font-size: 15px !important;
    font-weight: 700;
    line-height: 1.3;
    padding: 15px 18px;
    cursor: pointer;
    outline: none;
    transition: color 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
  }

  .kb-name:hover {
    border-color: var(--kb-blue);
    transform: translateX(2px);
  }

  .kb-name.is-active {
    color: #fff;
    border-color: transparent;
    background: linear-gradient(135deg, var(--kb-navy) 0%, var(--kb-blue) 100%);
    box-shadow: 0 12px 26px rgba(12, 60, 84, 0.22);
  }

  /* ---------- Middle: detail ---------- */
  .kb-detail {
    animation: kbFade 0.4s ease both;
    padding-top: 4px;
  }

  .kb-detail-step {
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--kb-blue);
    margin-bottom: 8px;
  }

  .kb-detail h3 {
    color: var(--kb-navy);
    font-size: 23px !important;
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 12px;
  }

  .kb-detail p {
    color: var(--kb-muted);
    font-size: 15px !important;
    line-height: 1.65;
    text-align: left;
    width: 100% !important;
    margin: 0 0 18px;
  }

  .kb-points {
    list-style: none;
    margin: 0 0 20px;
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
    width: 21px;
    height: 21px;
    margin-top: 1px;
    border-radius: 50%;
    background: #e7f4fb;
    color: var(--kb-blue);
  }

  .kb-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--kb-red);
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

  /* ---------- Right: visual ---------- */
  .kb-visual { min-width: 0; }
  .kb-visual-frame {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid var(--kb-border);
    box-shadow: 0 18px 44px rgba(12, 60, 84, 0.16);
    background: #fff;
    animation: kbFade 0.5s ease both;
  }
  .kb-visual-frame img {
    display: block;
    width: 100%;
    height: auto;
  }
  .kb-visual-badge {
    position: absolute;
    left: 14px;
    bottom: 14px;
    display: inline-block;
    padding: 7px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, rgba(12, 60, 84, 0.92), rgba(27, 133, 186, 0.92));
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    box-shadow: 0 8px 18px rgba(12, 60, 84, 0.25);
  }

  @keyframes kbFade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .kb-detail,
    .kb-visual-frame { animation: none !important; }
  }

  /* ---------- Responsive ---------- */
  @media (max-width: 991px) {
    .kb-layout { grid-template-columns: 1fr; gap: 22px; }

    /* names become a horizontal scroll strip */
    .kb-names {
      flex-direction: row;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-left: 0;
      border-left: none;
      padding-bottom: 6px;
      -webkit-overflow-scrolling: touch;
    }
    .kb-name { flex: 0 0 auto; }

    .kb-visual { order: 2; }
  }

  @media (max-width: 575px) {
    .kb-detail h3 { font-size: 21px !important; }
    .kb-name { font-size: 14px !important; padding: 12px 14px; }
  }
`;
