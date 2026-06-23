import React from 'react'
import '../../assets/css/css.css';
import * as images from '../../assets/images';
import styled from 'styled-components'

export default function SignupPopup({ onClose, gotoLogin }) {

  return (
    <Wrapper>
      <div className="dem-overlay" onClick={onClose}></div>

      <div className="dem-modal" role="dialog" aria-modal="true" aria-label="Signup">
        <button type="button" className="dem-close" onClick={onClose} aria-label="Close">
          <iconify-icon icon="material-symbols:close"></iconify-icon>
        </button>

        <div className="dem-head">
          <span className="dem-head-aurora" aria-hidden="true"></span>
          <span className="dem-head-dots" aria-hidden="true">
            <i></i><i></i><i></i><i></i><i></i><i></i>
          </span>
          <span className="dem-badge">
            <img src={images.loginicon1} alt="Demand Edge" />
          </span>
          <h3>Create your account</h3>
          <p>Start forecasting smarter with Demand Edge.</p>
        </div>

        <div className="dem-body">
          <div className="dem-grid">
            <div className="dem-field">
              <input type="text" id="name" placeholder="Name" />
            </div>
            <div className="dem-field">
              <input type="tel" id="mobileno" placeholder="Mobile No." />
            </div>
            <div className="dem-field">
              <input type="email" id="emailid" placeholder="Email Id" />
            </div>
            <div className="dem-field">
              <input type="password" id="password" placeholder="Password" />
            </div>
          </div>

          <label className="dem-check">
            <input type="checkbox" />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>

          <button type="button" className="dem-submit">
            Signup <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon>
          </button>

          <p className="dem-alt">
            Already have an account?
            <button type="button" onClick={gotoLogin}>Login now</button>
          </p>
        </div>
      </div>
    </Wrapper>
  )
}


const Wrapper = styled.div`
  --de-navy: #0c3c54;
  --de-navy-deep: #0a324a;
  --de-blue: #1b85ba;
  --de-red: #ac1424;
  --de-muted: #6a7d8c;

  .dem-overlay {
    position: fixed;
    inset: 0;
    background: rgba(7, 25, 38, 0.55);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    z-index: 99998;
    animation: demFade 0.25s ease both;
  }

  .dem-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(92vw, 540px);
    max-height: 92vh;
    overflow: auto;
    background: #ffffff;
    border-radius: 22px;
    box-shadow: 0 30px 80px rgba(7, 35, 52, 0.45);
    z-index: 99999;
    font-family: "Exo", sans-serif;
    animation: demPop 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .dem-close {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.16);
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    z-index: 3;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .dem-close:hover { background: rgba(255, 255, 255, 0.3); transform: rotate(90deg); }

  /* ---------- Header ---------- */
  .dem-head {
    position: relative;
    overflow: hidden;
    text-align: center;
    padding: 30px 28px 24px;
    background:
      radial-gradient(420px 160px at 50% -10%, rgba(27, 133, 186, 0.4), transparent 70%),
      linear-gradient(135deg, var(--de-navy) 0%, var(--de-navy-deep) 100%);
    border-radius: 22px 22px 0 0;
  }
  .dem-head > * { position: relative; z-index: 1; }

  /* slow drifting aurora behind the header content */
  .dem-head-aurora {
    position: absolute;
    inset: -40% -20%;
    z-index: 0 !important;
    pointer-events: none;
    background:
      radial-gradient(120px 120px at 25% 30%, rgba(27, 133, 186, 0.55), transparent 60%),
      radial-gradient(140px 140px at 80% 20%, rgba(172, 20, 36, 0.4), transparent 60%),
      radial-gradient(160px 160px at 60% 90%, rgba(27, 133, 186, 0.35), transparent 65%);
    filter: blur(6px);
    opacity: 0.85;
    animation: demAurora 9s ease-in-out infinite alternate;
  }
  @keyframes demAurora {
    0% { transform: translate3d(-6%, -4%, 0) scale(1); }
    50% { transform: translate3d(5%, 3%, 0) scale(1.12); }
    100% { transform: translate3d(-3%, 5%, 0) scale(1.05); }
  }

  /* floating particles rising through the header */
  .dem-head-dots {
    position: absolute;
    inset: 0;
    z-index: 0 !important;
    pointer-events: none;
  }
  .dem-head-dots i {
    position: absolute;
    bottom: -6px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    animation: demRise 6s linear infinite;
  }
  .dem-head-dots i:nth-child(1) { left: 12%; width: 4px; height: 4px; animation-delay: 0s; }
  .dem-head-dots i:nth-child(2) { left: 30%; animation-delay: 1.4s; }
  .dem-head-dots i:nth-child(3) { left: 48%; width: 3px; height: 3px; animation-delay: 2.6s; }
  .dem-head-dots i:nth-child(4) { left: 66%; animation-delay: 0.8s; }
  .dem-head-dots i:nth-child(5) { left: 82%; width: 4px; height: 4px; animation-delay: 3.4s; }
  .dem-head-dots i:nth-child(6) { left: 92%; width: 3px; height: 3px; animation-delay: 2s; }
  @keyframes demRise {
    0% { transform: translateY(0) scale(0.6); opacity: 0; }
    15% { opacity: 0.9; }
    80% { opacity: 0.5; }
    100% { transform: translateY(-120px) scale(1); opacity: 0; }
  }

  .dem-badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 62px;
    height: 62px;
    border-radius: 50%;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #c8324a 0%, var(--de-red) 60%, #8f0f1d 100%);
    box-shadow: 0 10px 24px rgba(172, 20, 36, 0.4), 0 0 0 6px rgba(255, 255, 255, 0.08);
    animation: demBadgeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s backwards;
  }
  /* radar ripple rings around the badge */
  .dem-badge::before,
  .dem-badge::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1.5px solid rgba(172, 20, 36, 0.45);
    animation: demRipple 2.8s ease-out infinite;
  }
  .dem-badge::after { animation-delay: 1.4s; }
  .dem-badge img {
    width: 30px;
    height: auto;
    filter: brightness(0) invert(1);
    animation: demBadgeFloat 3.4s ease-in-out infinite;
  }
  @keyframes demBadgeIn {
    from { opacity: 0; transform: scale(0.4) rotate(-12deg); }
    to { opacity: 1; transform: scale(1) rotate(0); }
  }
  @keyframes demBadgeFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  @keyframes demRipple {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.7); opacity: 0; }
  }

  .dem-head h3 {
    color: #ffffff !important;
    font-size: 21px !important;
    font-weight: 800 !important;
    margin: 0 0 4px !important;
    font-family: "Exo", sans-serif !important;
    animation: demUp 0.5s ease 0.18s backwards;
  }
  .dem-head p {
    color: rgba(255, 255, 255, 0.72) !important;
    font-size: 13px !important;
    line-height: 1.4 !important;
    margin: 0 !important;
    animation: demUp 0.5s ease 0.26s backwards;
  }

  /* ---------- Body ---------- */
  .dem-body { padding: 22px 26px 26px; }

  /* staggered entrance: each field, then the row below the grid */
  .dem-grid .dem-field { animation: demUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards; }
  .dem-grid .dem-field:nth-child(1) { animation-delay: 0.30s; }
  .dem-grid .dem-field:nth-child(2) { animation-delay: 0.37s; }
  .dem-grid .dem-field:nth-child(3) { animation-delay: 0.44s; }
  .dem-grid .dem-field:nth-child(4) { animation-delay: 0.51s; }
  .dem-body > .dem-check { animation: demUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.58s backwards; }
  .dem-body > .dem-submit { animation: demUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.65s backwards; }
  .dem-body > .dem-alt { animation: demUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.72s backwards; }
  @keyframes demUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .dem-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .dem-field input {
    width: 100%;
    height: 48px;
    border: 1px solid #dce6ee;
    border-radius: 11px;
    padding: 0 15px;
    font-size: 14px;
    color: var(--de-navy);
    background: #f7fbfe;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .dem-field input::placeholder { color: #91a3b0; }
  .dem-field input:focus {
    outline: none;
    border-color: var(--de-blue);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(27, 133, 186, 0.15);
  }

  .dem-check {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin: 16px 0 2px;
    font-size: 12.5px;
    line-height: 1.4;
    color: var(--de-muted);
    cursor: pointer;
  }
  .dem-check input { margin-top: 2px; width: 15px; height: 15px; accent-color: var(--de-red); flex-shrink: 0; }

  .dem-submit {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 50px;
    margin-top: 16px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #c8324a 0%, var(--de-red) 60%, #8f0f1d 100%);
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    box-shadow: 0 12px 26px rgba(172, 20, 36, 0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  /* shine sweep across the button on hover */
  .dem-submit::before {
    content: '';
    position: absolute;
    top: 0;
    left: -120%;
    width: 60%;
    height: 100%;
    background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.45), transparent);
    transform: skewX(-18deg);
    transition: left 0.6s ease;
  }
  .dem-submit iconify-icon { position: relative; z-index: 1; font-size: 18px; transition: transform 0.2s ease; }
  .dem-submit:hover { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(172, 20, 36, 0.38); }
  .dem-submit:hover::before { left: 130%; }
  .dem-submit:hover iconify-icon { transform: translateX(3px); }

  .dem-alt {
    text-align: center;
    margin: 18px 0 0;
    font-size: 13.5px;
    color: var(--de-muted);
  }
  .dem-alt button {
    background: none;
    border: none;
    color: var(--de-navy);
    font-weight: 700;
    font-size: 13.5px;
    cursor: pointer;
    padding: 0;
    margin-left: 5px;
    font-family: "Exo", sans-serif;
    transition: color 0.2s ease;
  }
  .dem-alt button:hover { color: var(--de-red); text-decoration: underline; }

  @keyframes demFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes demPop {
    from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .dem-head-aurora,
    .dem-head-dots,
    .dem-badge::before,
    .dem-badge::after,
    .dem-badge img { animation: none !important; }
    .dem-overlay,
    .dem-modal,
    .dem-badge,
    .dem-head h3,
    .dem-head p,
    .dem-grid .dem-field,
    .dem-body > .dem-check,
    .dem-body > .dem-submit,
    .dem-body > .dem-alt {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    .dem-modal { transform: translate(-50%, -50%) !important; }
  }

  @media (max-width: 575px) {
    .dem-modal { width: 94vw; border-radius: 18px; }
    .dem-head { padding: 24px 20px 18px; border-radius: 18px 18px 0 0; }
    .dem-head h3 { font-size: 19px !important; }
    .dem-body { padding: 20px 18px 22px; }
    .dem-grid { grid-template-columns: 1fr; }
  }
`
