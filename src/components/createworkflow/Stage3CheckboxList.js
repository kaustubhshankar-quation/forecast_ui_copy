// Stage3CheckboxList.jsx
import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { DataContext } from "./DataContext";
import Loader from "../../components/common/Loader";
import { fetchRecordByKey } from "../../services/IndexedDBUtil";
import { DATABASE_NAME, STORE_NAME } from "../../services/constants";
import { FixedSizeList as List } from "react-window";
import { useFormContext } from './FormContext';
import { filterSelectedItems } from './helper';

const Stage3CheckboxList = ({
  selectedItems,
  setSelectedItems,
  searchString,
  selectedTreeNode,
  zone,
  onAvailableCountChange,
  onCityClick, // NEW
  hierarchyData// NEW
}) => {  
  const [choosenItems, setChoosenItems] = useState([]);
  const [choosenSearchItems, setChoosenSearchItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { geography, products } = useContext(DataContext);
  const { formData, updateFormData } = useFormContext();
  const [level6Data, setLevel6Data] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (zone.zoneId == 1) {
        const result = await fetchRecordByKey(DATABASE_NAME, STORE_NAME, "SKUS");
        if (result.success) {
          setLevel6Data(result.record.data);
        }
      }
      setIsLoading(false);
    };
    init();
  }, [zone.zoneId]);

  useEffect(() => {
    if (onAvailableCountChange) {
      onAvailableCountChange(choosenItems.length);
    }
  }, [choosenItems, onAvailableCountChange]);

  async function GetMasterListOfItems() {
    return zone.zoneId == 1 ? await products : await geography;
  }

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      let masterlist = await GetMasterListOfItems();
      filterItemsOnSelectedTreeNode(masterlist);
      setIsLoading(false);
    };
    init();
  }, [selectedTreeNode]);

  async function filterItemsOnSelectedTreeNode(masterList) {
    if (!selectedTreeNode) {
      setChoosenItems([]);
      setChoosenSearchItems([]);
      return;
    }

    let filteredItems = [];

    switch (selectedTreeNode.level) {
      case "level1":
        filteredItems = masterList?.data?.level2?.filter(elem => elem.level1_id == selectedTreeNode.level1_id) || [];
        break;
      case "level2":
        filteredItems = masterList?.data?.level3?.filter(
          (elem) => elem.level1_id == selectedTreeNode.level1_id &&
            elem.level2_id == selectedTreeNode.level2_id
        ) || [];
        break;
      case "level3":
        filteredItems = masterList?.data?.level4?.filter(
          (elem) => elem.level1_id == selectedTreeNode.level1_id &&
            elem.level2_id == selectedTreeNode.level2_id &&
            elem.level3_id == selectedTreeNode.level3_id
        ) || [];
        break;
      case "level4":
        filteredItems = masterList?.data?.level5?.filter(
          (elem) => elem.level1_id == selectedTreeNode.level1_id &&
            elem.level2_id == selectedTreeNode.level2_id &&
            elem.level3_id == selectedTreeNode.level3_id &&
            elem.level4_id == selectedTreeNode.level4_id
        ) || [];
        break;
      case "level5":
        filteredItems = level6Data?.filter(
          (elem) => elem.level1_id == selectedTreeNode.level1_id &&
            elem.level2_id == selectedTreeNode.level2_id &&
            elem.level3_id == selectedTreeNode.level3_id &&
            elem.level4_id == selectedTreeNode.level4_id &&
            elem.level5_id == selectedTreeNode.level5_id
        ) || [];
        break;
      default:
        filteredItems = [];
    }

    setChoosenItems(filteredItems);
    setChoosenSearchItems(filteredItems);
  }

  useEffect(() => {
    if (searchString.trim() === "") {
      setChoosenItems(choosenSearchItems);
    } else {
      const lowercasedSearch = searchString.toLowerCase();
      const filtered = choosenSearchItems.filter((item) =>
        item.name?.toLowerCase().includes(lowercasedSearch)
      );
      setChoosenItems(filtered);
    }
  }, [searchString, choosenSearchItems]);

  const totalSelected = choosenItems.filter(element =>
    selectedItems.some(item => item.id === element.id)
  ).length;

  const handleCheckboxChangeCore = (e) => {
    const { id, dataset, checked } = e.target;
    const key = zone.zoneId == 1 ? "products" : "geography";

    const hierarchy = hierarchyData;

    if (!hierarchy) return;


    const getLeafNodes = (nodeId) => {

      // get all hierarchy levels dynamically
      const levelKeys = Object.keys(hierarchyData || {})
        .filter(k => k.startsWith("level"))
        .sort((a, b) => parseInt(a.replace("level", "")) - parseInt(b.replace("level", "")));

      const levels = levelKeys.map(k => hierarchyData[k]);

      // find clicked node
      let node = null;

      for (const level of levels) {
        const found = level?.find(x => x.id === nodeId);
        if (found) {
          node = found;
          break;
        }
      }

      if (!node) return [];

      const nodeBreadcrumb = node.breadcrumb;

      // deepest level = leaf nodes
      const deepestLevelKey = levelKeys[levelKeys.length - 1];
      const leaves = hierarchyData[deepestLevelKey] || [];

      // if clicked node already leaf
      const exactLeaf = leaves.find(x => x.id === nodeId);
      if (exactLeaf) {
        return [{ id: exactLeaf.id, breadcrumb: exactLeaf.breadcrumb }];
      }

      // return all descendants
      return leaves
        .filter(x => x.breadcrumb?.startsWith(nodeBreadcrumb))
        .map(x => ({
          id: x.id,
          breadcrumb: x.breadcrumb
        }));
    };

    const leafNodes = getLeafNodes(id);

    if (checked) {
      let merged = [...selectedItems];

      leafNodes.forEach(node => {
        if (!merged.some(el => el.id === node.id)) {
          merged.push(node);
        }
      });

      const finalItems =
        zone.zoneId == 2 ? filterSelectedItems(merged, { id }) : merged;

      setSelectedItems(finalItems);

      updateFormData("stage3", {
        ...formData.stage3,
        [key]: finalItems
      });

    } else {
      const updatedItems = selectedItems.filter(
        (itemSel) => !itemSel.breadcrumb.startsWith(dataset.breadcrumb)
      );

      setSelectedItems(updatedItems);

      updateFormData("stage3", {
        ...formData.stage3,
        [key]: updatedItems
      });
    }
  };

  const handleSelectAllChange = (e) => {
    const key = zone.zoneId == 1 ? "products" : "geography";

    if (e.target.checked) {

      let merged = [...selectedItems];

      choosenItems.forEach(item => {
        const leafNodes = level6Data?.filter(x =>
          x.breadcrumb.startsWith(item.breadcrumb)
        ) || [];

        leafNodes.forEach(node => {
          if (!merged.some(el => el.id === node.id)) {
            merged.push({ id: node.id, breadcrumb: node.breadcrumb });
          }
        });
      });

      setSelectedItems(merged);

      updateFormData("stage3", {
        ...formData.stage3,
        [key]: merged
      });

    } else {

      const updatedItems = selectedItems.filter(
        selected =>
          !choosenItems.some(item =>
            selected.breadcrumb?.startsWith(item.breadcrumb)
          )
      );

      setSelectedItems(updatedItems);

      updateFormData("stage3", {
        ...formData.stage3,
        [key]: updatedItems
      });

      if (onCityClick) onCityClick(null);
    }
  };

  if (isLoading) {
    return (
      <LoaderWrapper>
        <Loader size={"large"} />
      </LoaderWrapper>
    );
  }

  if (!selectedTreeNode) {
    return (
      <EmptyWrapper>
        <iconify-icon icon="mdi:arrow-left-circle" style={{ fontSize: '40px', color: '#cbd5e1' }}></iconify-icon>
        <p>Select a category from hierarchy</p>
      </EmptyWrapper>
    );
  }

  if (choosenItems.length === 0) {
    return (
      <EmptyWrapper>
        <iconify-icon icon="mdi:package-variant-closed" style={{ fontSize: '40px', color: '#cbd5e1' }}></iconify-icon>
        <p>No items found</p>
      </EmptyWrapper>
    );
  }

  return (
    <Wrapper>
      <div className="select-all-row">
        <label className="select-all-label">
          <input
            type="checkbox"
            checked={choosenItems.length > 0 && choosenItems.every(element =>
              selectedItems.some(item =>
                item.breadcrumb?.startsWith(element.breadcrumb)
              )
            )} onChange={handleSelectAllChange}
          />
          <span className="text-[#404D60]">Select All</span>
        </label>
        <span className="count-badge">{totalSelected}/{choosenItems.length}</span>
      </div>

      <VirtualizedCheckboxList
        items={choosenItems}
        selectedItems={selectedItems}
        onItemSelect={handleCheckboxChangeCore}
        zone={zone}
        onCityClick={onCityClick}
      />
    </Wrapper>
  );
};

const VirtualizedCheckboxList = ({ items, selectedItems, onItemSelect, zone, onCityClick }) => {
  // cities we support markers for — when checked we call onCityClick(cityName)
  const citySet = new Set([
    "hyderabad", "kolkatta", "siliguri", "bhubaneshwar", "madurai", "mumbai", "jaipur", "kanpur", "jhansi"
  ]);

  const Row = React.memo(({ index, style }) => {
    const item = items[index];
    const isSelected = selectedItems?.some(
      (el) => el.breadcrumb?.startsWith(item.breadcrumb)
    );
    const handleChange = (e) => {
      // call parent's checkbox logic
      onItemSelect(e);

      // If zone is geography (zoneId==2) then when user CHECKS a city we trigger map update
      if (zone?.zoneId === 2 && onCityClick) {
        // item.name may be the exact city name required to highlight
        const nameLower = (item.name || "").toLowerCase();
        if (citySet.has(nameLower)) {
          // if checked -> show city; if unchecked -> clear city (set null)
          if (e.target.checked) onCityClick(nameLower);
          else onCityClick(null);
        } else {
          // not a city — ensure map can show region/state if needed (clear city)
          // keep existing behavior: do not call onCityClick for non-city
        }
      }
    };

    const targetProducts = [
      "HairShampoo", "Conditioner", "HairMask", "HairColour",
      "Hyderabad", "FortunerGR-S", "Dell Latitude 5440", "MRF Revz", "Vicks Advanced"
    ];

    return (
      <div style={style} className="checkbox-row">
        <label>
          <input
            id={item.id}
            type="checkbox"
            data-breadcrumb={item.breadcrumb}
            checked={isSelected}
            onChange={handleChange}
          />
          <span className={targetProducts.includes(item.name) ? "highlighted-targetmt-1" : "mt-1"}>
            {item.name}
          </span>
        </label>
      </div>
    );
  });

  return (
    <List height={380} itemCount={items.length} itemSize={38} width="100%">
      {Row}
    </List>
  );
};

export default Stage3CheckboxList;

/* the rest of your styled-components (LoaderWrapper, EmptyWrapper, Wrapper) — keep them unchanged */

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #94a3b8;
  
  p {
    margin-top: 12px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .select-all-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 8px;
  }

  .select-all-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
    font-family: 'Inter', sans-serif;

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: #202b70;
    }
  }

  .count-badge {
    background: #202b70;
    color: white;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
  }

  .checkbox-row {
    padding: 0 4px;
    display: flex;
    align-items: center;

    &:hover {
      background: #f8fafc;
    }

    label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      width: 100%;
      padding: 6px 0;

      input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
        accent-color: #202b70;
        flex-shrink: 0;
      }

      span {
        font-size: 12px;
        color: #334155;
        flex: 1;
        font-family: 'Inter', sans-serif;
        margin-top: 2px;
        &.highlighted-target {
          color: #5b84b3;
          font-weight: 500;
        }
      }
    }
  }
`;