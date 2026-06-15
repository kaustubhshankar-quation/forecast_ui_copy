// Stage3ProductMap.jsx
import React, { useMemo } from "react";
import styled from "styled-components";
import {
    // CPG / haircare
    CPGIcon,
    PersonalCareIcon,
    HaircareIcon,
    HSIcon,
    HairProductIcon,
    HairShampooIcon,
    ConditionerIcon,
    HairMaskIcon,
    HairColourIcon,

    // Automobile
    AutomobileIcon,
    AutomaticIcon,
    CrossoverIcon,
    HondaHRVIcon,
    ModelIcon,
    FortunerIcon,

    // Pharma
    PharmaIcon,
    OTCDrugsIcon,
    ColdCoughIcon,
    VicksActionIcon,
    StandardTypeIcon,          // generic “standard type” pill/blister
    VicksAdvancedIcon,

    // Tyres
    TyresIcon,
    EcoTyresIcon,
    MudTerrainIcon,
    MRFZLRIcon,
    MRFEcoStandardIcon,        // reuse StandardTypeIcon or tyre variant
    MRFRevzIcon,

    // Technology
    TechnologyIcon,
    LaptopsIcon,
    BusinessLaptopIcon,
    DellLatitudeIcon,
    WindowsIcon,
    DellLatitude5440Icon,
} from "./Stage3ProductIcons";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  padding: 8px 12px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 8px;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
  background: ${(p) => (p.active ? "rgba(37, 99, 235, 0.08)" : "transparent")};
  opacity: ${(p) => (p.dimmed ? 0.25 : 1)};
  transform: ${(p) => (p.active ? "scale(1.05)" : "scale(1)")};
  box-shadow: ${(p) =>
        p.active ? "0 0 0 2px rgba(37, 99, 235, 0.6)" : "none"};
`;

const Icon = styled.div`
  width: 32px;
  height: 32px;
  svg {
    width: 100%;
    height: 100%;
    fill: ${(p) => (p.active ? "#2563eb" : "#cbd5e1")};
    transition: fill 160ms ease;
  }
`;

/* ---------- Icon label sets per family ---------- */

// CPG / haircare
const HAIRCARE_LABELS = {
    CPG: CPGIcon,
    "Personal care": PersonalCareIcon,
    Haircare: HaircareIcon,
    "H&S": HSIcon,
    "Hair Product": HairProductIcon,
    HairShampoo: HairShampooIcon,
    Conditioner: ConditionerIcon,
    HairMask: HairMaskIcon,
    HairColour: HairColourIcon,
};

// Automobile
const AUTOMOBILE_LABELS = {
    Automobile: AutomobileIcon,
    Automatic: AutomaticIcon,
    Crossover: CrossoverIcon,
    "Honda HRV": HondaHRVIcon,
    Model: ModelIcon,
    "FortunerGR-S": FortunerIcon,
};

// Pharma
const PHARMA_LABELS = {
    Pharma: PharmaIcon,
    "OTC Drugs": OTCDrugsIcon,
    "Cold & Cough": ColdCoughIcon,
    "Vicks Action 500": VicksActionIcon,
    "Standard Type": StandardTypeIcon,
    "Vicks Advanced": VicksAdvancedIcon,
};

// Tyres
const TYRES_LABELS = {
    Tyres: TyresIcon,
    "Eco Tyres": EcoTyresIcon,
    "Mud Terrain Tyres": MudTerrainIcon,
    "MRF ZLR": MRFZLRIcon,
    "Standard Type": MRFEcoStandardIcon,
    "MRF Revz": MRFRevzIcon,
};

// Technology
const TECHNOLOGY_LABELS = {
    Technology: TechnologyIcon,
    Laptops: LaptopsIcon,
    "Business Laptop": BusinessLaptopIcon,
    "Dell Lattitude": DellLatitudeIcon,
    Windows: WindowsIcon,
    "Dell Latitude 5440": DellLatitude5440Icon,
};

// familyKey -> labels map
const FAMILY_LABELS = {
    cpg: HAIRCARE_LABELS,
    haircare: HAIRCARE_LABELS,
    automobile: AUTOMOBILE_LABELS,
    pharma: PHARMA_LABELS,
    tyres: TYRES_LABELS,
    technology: TECHNOLOGY_LABELS,
    default: HAIRCARE_LABELS,
};

function Stage3ProductMap({
    familyKey = "default",
    context = "hierarchy",
    selectedTreeNode,
    selectedItems,
}) {
    const LABELS = FAMILY_LABELS[familyKey] || FAMILY_LABELS.default;
    const entries = Object.entries(LABELS);

 const activeKeys = useMemo(() => {
  const s = new Set();

  // Box 1: hierarchy – rely only on tree node name
  if (context === "hierarchy" && selectedTreeNode?.name) {
    const key = String(selectedTreeNode.name).trim();
    if (LABELS[key]) s.add(key);
  }

  // Box 2: SKU – match using last segment of breadcrumb
  if (context === "sku") {
    (selectedItems || []).forEach((sku) => {
      const raw = String(sku.breadcrumb || "").trim();
      if (!raw) return;

      // split on backslash and take last non-empty part
      const parts = raw.split("\\").map((p) => p.trim()).filter(Boolean);
      const last = parts[parts.length - 1];        // e.g. "MRF Revz"
      if (!last) return;

      // exact key match with LABELS
      if (LABELS[last]) {
        s.add(last);
        return;
      }

      // small tolerance: case-insensitive contains
      const lastLower = last.toLowerCase();
      Object.keys(LABELS).forEach((key) => {
        const kLower = key.toLowerCase();
        if (lastLower === kLower || lastLower.includes(kLower) || kLower.includes(lastLower)) {
          s.add(key);
        }
      });
    });
  }

  return s;
}, [context, selectedTreeNode, selectedItems, LABELS]);

    return (
        <Grid>
            {entries.map(([key, IconComp]) => {
                const active = activeKeys.has(key);
                const dimmed = activeKeys.size > 0 && !active;

                return (
                    <Item key={key} active={active} dimmed={dimmed}>
                        <Icon active={active}>
                            <IconComp />
                        </Icon>
                    </Item>
                );
            })}
        </Grid>
    );
}


export default Stage3ProductMap;
