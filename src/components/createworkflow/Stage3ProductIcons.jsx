// Stage3ProductIcons.jsx
import React from "react";

/* ================= CPG / Haircare ================= */

export const CPGIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="12" y="10" width="40" height="44" fill="currentColor" />
        <path d="M12 10l20-8 20 8" fill="currentColor" />
    </svg>
);

export const PersonalCareIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="8" y="20" width="12" height="24" rx="2" fill="currentColor" />
        <circle cx="32" cy="28" r="8" fill="currentColor" />
        <path d="M48 18l8 8v18l-8 8z" fill="currentColor" />
    </svg>
);

export const HaircareIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="22" y="14" width="20" height="36" rx="4" fill="currentColor" />
        <path d="M24 10h16v6h-16z" fill="currentColor" />
        <path d="M28 20Q32 16 36 20T40 28T36 36T32 40T28 36T26 28" fill="currentColor" opacity="0.6" />
    </svg>
);

export const HSIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <path d="M32 12L48 18V32C48 40 40 46 32 48C24 46 16 40 16 32V18Z" fill="currentColor" />
        <path d="M26 32L30 38L40 24" stroke="white" strokeWidth="3" fill="none" />
    </svg>
);

export const HairProductIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="24" y="20" width="16" height="28" rx="3" fill="currentColor" />
        <rect x="22" y="16" width="20" height="5" rx="2" fill="currentColor" />
        <circle cx="32" cy="12" r="4" fill="currentColor" />
    </svg>
);

export const HairShampooIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="24" y="12" width="16" height="38" rx="4" fill="currentColor" />
        <rect x="26" y="10" width="12" height="4" rx="1" fill="currentColor" />
    </svg>
);

export const ConditionerIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="22" y="18" width="20" height="30" rx="3" fill="currentColor" />
        <path d="M28 14h8v6h-4v4h-4z" fill="currentColor" />
    </svg>
);

export const HairMaskIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="14" y="28" width="36" height="16" rx="3" fill="currentColor" />
        <rect x="16" y="24" width="32" height="5" rx="2" fill="currentColor" />
    </svg>
);

export const HairColourIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <path d="M22 14H42L38 44H26Z" fill="currentColor" />
        <rect x="20" y="44" width="16" height="6" rx="2" fill="currentColor" />
    </svg>
);

/* ================= Automobile ================= */

export const AutomobileIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        {/* generic sedan */}
        <path d="M10 34l6-12h24l6 12h6a4 4 0 014 4v8H52a6 6 0 01-12 0H24a6 6 0 01-12 0H6v-8a4 4 0 014-4z" />
    </svg>
);

export const AutomaticIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        {/* gear lever */}
        <circle cx="32" cy="18" r="5" />
        <path d="M30 22v12l-6 10h16l-6-10V22z" />
        <rect x="22" y="44" width="20" height="6" rx="2" />
    </svg>
);

export const CrossoverIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        {/* taller SUV body */}
        <path d="M8 34l6-11h26l8 11h4a4 4 0 014 4v8H52a7 7 0 01-14 0H26a7 7 0 01-14 0H6v-8a4 4 0 014-4z" />
    </svg>
);

export const HondaHRVIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        {/* crossover with badge */}
        <path d="M8 34l6-11h26l8 11h4a4 4 0 014 4v8H52a7 7 0 01-14 0H26a7 7 0 01-14 0H6v-8a4 4 0 014-4z" />
        <rect x="34" y="23" width="6" height="4" rx="1" />
    </svg>
);

export const ModelIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        {/* car side + star (model) */}
        <path d="M10 36l6-10h24l6 10h6v8H50a6 6 0 01-12 0H26a6 6 0 01-12 0H8v-6a4 4 0 014-4z" />
        <path d="M44 14l1.6 3.8 4.1.3-3.2 2.5.9 4-3.4-2.3-3.4 2.3.9-4-3.2-2.5 4.1-.3z" />
    </svg>
);

export const FortunerIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        {/* big SUV / Fortuner */}
        <path d="M6 34l6-12h30l10 12h4a4 4 0 014 4v8H54a7 7 0 01-14 0H24a7 7 0 01-14 0H4v-8a4 4 0 014-4z" />
    </svg>
);

/* ================= Pharma ================= */

export const PharmaIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="16" y="20" width="18" height="28" rx="3" fill="currentColor" />
        <rect x="18" y="16" width="14" height="5" fill="currentColor" />
        <path d="M40 24H52V36H40V24M44 20V32M36 28V40" fill="currentColor" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const OTCDrugsIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="10" y="16" width="44" height="30" rx="4" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="24" r="5" fill="currentColor" />
        <circle cx="32" cy="24" r="5" fill="currentColor" />
        <circle cx="46" cy="24" r="5" fill="currentColor" />
        <circle cx="18" cy="38" r="5" fill="currentColor" />
        <circle cx="32" cy="38" r="5" fill="currentColor" />
        <circle cx="46" cy="38" r="5" fill="currentColor" />
    </svg>
);

export const ColdCoughIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="24" y="18" width="16" height="30" rx="3" fill="currentColor" />
        <rect x="26" y="14" width="12" height="5" fill="currentColor" />
        <path d="M16 28C18 30 20 32 20 36C20 40 18 42 16 44" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const VicksActionIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="12" y="16" width="40" height="32" rx="4" fill="currentColor" />
        <path d="M24 22L32 42L40 22" fill="white" opacity="0.8" strokeWidth="2" />
    </svg>
);

export const StandardTypeIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <ellipse cx="20" cy="32" rx="8" ry="12" fill="currentColor" />
        <ellipse cx="44" cy="32" rx="8" ry="12" fill="currentColor" />
        <line x1="28" y1="32" x2="36" y2="32" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const VicksAdvancedIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="12" y="14" width="40" height="34" rx="4" fill="currentColor" />
        <path d="M32 18L35 24L41 25L37 30L38 36L32 33L26 36L27 30L23 25L29 24Z" fill="white" opacity="0.8" />
    </svg>
);

/* ================= Tyres ================= */

export const TyresIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <circle cx="20" cy="28" r="11" fill="currentColor" />
        <circle cx="20" cy="28" r="6" fill="white" opacity="0.2" />
        <circle cx="44" cy="38" r="11" fill="currentColor" />
        <circle cx="44" cy="38" r="6" fill="white" opacity="0.2" />
    </svg>
);

export const EcoTyresIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <circle cx="32" cy="32" r="13" fill="currentColor" />
        <circle cx="32" cy="32" r="8" fill="white" opacity="0.2" />
        <path d="M48 20L54 14L52 24" fill="currentColor" opacity="0.7" />
    </svg>
);

export const MudTerrainIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <circle cx="32" cy="32" r="13" fill="currentColor" />
        <path d="M20 26L16 18M24 18L18 6M32 16V6M40 18L46 6M44 26L48 18M20 38L16 46M24 46L18 58M32 48V58M40 46L46 58M44 38L48 46" stroke="white" strokeWidth="2" />
    </svg>
);

export const MRFZLRIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <circle cx="32" cy="32" r="13" fill="currentColor" />
        <circle cx="32" cy="32" r="7" fill="white" opacity="0.2" />
        <path d="M20 20L34 34M24 14L38 28M14 24L28 38M22 40L36 54" stroke="white" strokeWidth="1.5" />
    </svg>
);

export const MRFEcoStandardIcon = StandardTypeIcon;

export const MRFRevzIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <circle cx="32" cy="32" r="13" fill="currentColor" />
        <circle cx="32" cy="32" r="7" fill="white" opacity="0.2" />
        <path d="M18 30C22 24 28 20 34 20C41 20 48 24 52 30" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

/* ================= Technology ================= */

export const TechnologyIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="14" y="14" width="36" height="36" rx="3" fill="currentColor" />
        <rect x="22" y="22" width="20" height="20" fill="white" opacity="0.15" />
    </svg>
);

export const LaptopsIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="14" y="14" width="36" height="26" rx="2" fill="currentColor" />
        <path d="M10 42H54L52 50H12Z" fill="currentColor" />
    </svg>
);

export const BusinessLaptopIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="12" y="12" width="40" height="26" rx="2" fill="currentColor" />
        <path d="M8 40H56L54 48H10Z" fill="currentColor" />
        <rect x="22" y="16" width="20" height="6" rx="1" fill="white" opacity="0.2" />
    </svg>
);

export const DellLatitudeIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="14" y="14" width="36" height="26" rx="2" fill="currentColor" />
        <path d="M10 42H54L52 50H12Z" fill="currentColor" />
        <circle cx="44" cy="26" r="4" fill="white" opacity="0.3" />
    </svg>
);

export const WindowsIcon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <path d="M12 16l20-3v17H12zM34 13l18-3v17H34zM12 32h20v17l-20-3zM34 32h18v17l-18-3z" />
    </svg>
);

export const DellLatitude5440Icon = (props) => (
    <svg viewBox="0 0 64 64" {...props}>
        <rect x="14" y="14" width="36" height="26" rx="2" fill="currentColor" />
        <path d="M10 42H54L52 50H12Z" fill="currentColor" />
        <circle cx="22" cy="26" r="2" fill="white" opacity="0.5" />
        <circle cx="32" cy="26" r="2" fill="white" opacity="0.5" />
        <circle cx="42" cy="26" r="2" fill="white" opacity="0.5" />
    </svg>
);
