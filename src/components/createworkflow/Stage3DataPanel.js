// Stage3DataPanel.jsx
import React, { useState } from "react";
import styled from "styled-components";
import Stage3Heirarchy from "./Stage3Heirarchy";
import Stage3CheckboxList from "./Stage3CheckboxList";
import ItemList from "./Stage3SelectedItems";
import { useFormContext } from './FormContext';
import Stage3GeographyMap from "./Stage3GeographyMapIndia";
import Stage3GeographyMapIndia from "./Stage3GeographyMapIndia";
import Stage3GeographyMapCity from "./Stage3GeographyMapCity";
import Stage3ProductMap from "./Stage3ProductMap";

function Stage3DataPanel({ zone, hierarchyData }) {
  const { formData, updateFormData } = useFormContext();
  const [searchString, setSearchString] = useState("");
  const [hierarchySearch, setHierarchySearch] = useState("");
  const [selectedTreeNode, setSelectedTreeNode] = useState(null);
  const [availableItemsCount, setAvailableItemsCount] = useState(0);

  const [selectedItems, setSelectedItems] = useState(() => {
    const key = zone.zoneId === 1 ? 'products' : 'geography';
    if (!formData?.stage3?.[key]) {
      updateFormData("stage3", {
        ...formData.stage3,
        [key]: [],
      });
      return [];
    }
    return formData.stage3[key];
  });

  const isProduct = zone.zoneId === 1;
  // const hierarchyTitle = isProduct ? 'Product Categories' : 'Geographic Regions';
  const selectionTitle = isProduct ? 'Available SKUs' : 'Available Locations';
  const selectedTitle = isProduct ? 'Selected SKUs' : 'Selected Locations';

  // track selected city (only used to show dot/zoom in Box 2)
  const [selectedCity, setSelectedCity] = useState(null);


  // inside Stage3DataPanel, before return

  const getFamilyKey = () => {
    if (hierarchyData?.context !== "productheirarchy") return "default";

    // pick the level1 node for the current selection, or first level1 as fallback
    const lvl1List = hierarchyData.level1 || [];
    const selectedLvl1 =
      lvl1List.find((n) => n.level1_id === selectedTreeNode?.level1_id) ||
      lvl1List[0];

    if (!selectedLvl1) return "default";

    // normalize name → lower_snake (e.g. "CPG"→"cpg", "Automobile"→"automobile")
    return String(selectedLvl1.name)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
  };

  const familyKey = getFamilyKey();



  return (
    <Wrapper>
      <div className="row-container">
        {/* Column 1: Hierarchy tree + country/state map (mapLevel="country") */}
        <div className="panel-box">
          <div className="panel-header">
            {/* <div className="header-icon">{zone.icon}</div> */}
            <div className="header-content">
              <h3 className="panel-title">{zone.zoneName}</h3>
              {/* <p className="panel-subtitle">{hierarchyTitle}</p> */}
            </div>
          </div>


          {/* Column 1: hierarchy preview icons */}
          {/* {zone.zoneId === 1 && (
            <div className="map-container">
              <Stage3ProductMap
                familyKey={familyKey}
                context="hierarchy"
                selectedTreeNode={selectedTreeNode}
                selectedItems={[]}
              />
            </div>
          )} */}

          {zone.zoneId === 2 && (
            <div className="map-container">
              {/* Box 1: show country/state/regional highlights */}
              <Stage3GeographyMapIndia mapLevel="country" selectedNode={selectedTreeNode} />
            </div>
          )}

          <div className="panel-body">
            <div className="search-box">
              <iconify-icon icon="material-symbols:search"></iconify-icon>
              <input
                type="text"
                placeholder="Search..."
                value={hierarchySearch}
                onChange={(e) => setHierarchySearch(e.target.value)}
              />
            </div>
            <div className="content-scroll">
              <Stage3Heirarchy
                hierarchyData={hierarchyData}
                setSelectedTreeNode={setSelectedTreeNode}
                searchString={hierarchySearch}
              />
            </div>
          </div>
        </div>

        {/* Column 2: Selection list + city map (mapLevel="city") */}
        <div className="panel-box">
          <div className="panel-header">
            {/* <div className="header-icon">🔍</div> */}
            <div className="header-content">
              <h3 className="panel-title">{selectionTitle}</h3>
            </div>
          </div>
          {/* Column 2: SKU selection icons */}
          {/* {zone.zoneId === 1 && (
            <div className="map-container">
              <Stage3ProductMap
                familyKey={familyKey}
                context="sku"
                selectedTreeNode={null}
                selectedItems={selectedItems}
              />
            </div>
          )} */}
          {zone.zoneId === 2 && (
            <div className="map-container">
              {/* Box 2: show marker + zoom only for selectedCity (or fallback to selectedTreeNode) */}
              {/* <Stage3GeographyMap mapLevel="city" selectedNode={selectedCity || selectedTreeNode} /> */}
              <Stage3GeographyMapCity selectedCity={selectedCity} />

            </div>
          )}

          <div className="panel-body">
            <div className="search-box">
              <iconify-icon icon="material-symbols:search"></iconify-icon>
              <input
                type="text"
                placeholder="Search items..."
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
            </div>
            <div className="content-scroll">
              <Stage3CheckboxList
                hierarchyData={hierarchyData}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                searchString={searchString}
                selectedTreeNode={selectedTreeNode}
                zone={zone}
                onAvailableCountChange={setAvailableItemsCount}
                onCityClick={(cityName) => {
                  // cityName is lowercase or null
                  setSelectedCity(cityName);
                }}
              />
            </div>
          </div>
        </div>

        {/* Column 3: Selected Items */}
        <div className="panel-box">
          <div className="panel-header">
            {/* <div className="header-icon">✓</div> */}
            <div className="header-content">
              <h3 className="panel-title">{selectedTitle}</h3>
            </div>
          </div>

          <div className="panel-body no-padding">
            <ItemList
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              zone={zone}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Stage3DataPanel;

// ==================== STYLES ====================
const Wrapper = styled.div`
    margin-bottom: 24px;

    .row-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 20px;
    }

    .panel-box {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      height: 550px;
      overflow: hidden;
      border: 2px solid #1F4280;
      transition: all 0.2s ease;
      background: white;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        border-color: #1F4280;
      }
    }

    .panel-header {
      background: linear-gradient(135deg, #2e3a6f 0%, #202b70 100%);
      color: white;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .header-icon {
      font-size: 24px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.60);
      border-radius: 8px;
      flex-shrink: 0;
    }

    .header-content {
      flex: 1;
      min-width: 0;
    }

    .panel-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.2px;
      line-height: 1.3;
      font-family: 'Poppins', serif;
    }

    .panel-subtitle {
      margin: 3px 0 0 0;
      font-size: 14px;
      opacity: 0.85;
      font-weight: 400;
      font-family: 'Inter', sans-serif;
    }

    .map-container {
      padding: 6px 12px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      flex-shrink: 0;
      height: 160px;
      border-radius: 8px;
      overflow: hidden;
    }

    .panel-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 14px 16px;

      &.no-padding {
        padding: 0;
      }
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 12px;
      flex-shrink: 0;

      iconify-icon {
        font-size: 18px;
        color: #64748b;
        flex-shrink: 0;
      }

      input {
        flex: 1;
        border: none;
        background: transparent;
        outline: none;
        font-size: 14px;
        color: #1e293b;
        min-width: 0;
        font-family: 'Inter', sans-serif;

        &::placeholder {
          color: #94a3b8;
        }
      }
    }

    .content-scroll {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;

        &:hover {
          background: #94a3b8;
        }
      }

      &:not(:hover)::-webkit-scrollbar {
        width: 0;
      }
    }

    @media (max-width: 1024px) {
      .row-container {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .panel-box {
        height: 450px;
      }
    }
  `;