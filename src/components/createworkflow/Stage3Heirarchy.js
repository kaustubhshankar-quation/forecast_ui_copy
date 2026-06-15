import React, { useState, useRef } from "react";
import { useFormContext } from "./FormContext";
import {
  KeyboardArrowRight,
  KeyboardArrowDown,
  AdjustOutlined,
  RadioButtonChecked,
} from "@mui/icons-material";
import styled from "styled-components";

// -------- Build Tree --------
const buildTree = (data, filterObject) => {
  if (!data || typeof data !== "object") return [];

  const {
    level1 = [],
    level2 = [],
    level3 = [],
    level4 = [],
    level5 = [],
    mapping = {},
    context = ""
  } = data;

  if (!mapping || typeof mapping !== "object") return [];

  const levelCount = Object.keys(mapping).length;
  const isProductHierarchy = context === "productheirarchy";
  const levelSize = levelCount - (isProductHierarchy ? 0 : 1);

  const level1Items = isProductHierarchy
    ? level1.filter((el) => el.level1_id === filterObject.level1_id)
    : level1;

  const levelMaps = {
    level1: level1Items
      .map((item) => ({
        ...item,
        children: [],
        level: "level1",
        id: item.level1_id,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };

  if (levelSize >= 2) {
    levelMaps.level2 = level2.map((item) => ({
      ...item,
      children: [],
      level: "level2",
      id: item.level2_id,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  if (levelSize >= 3) {
    levelMaps.level3 = level3.map((item) => ({
      ...item,
      children: [],
      level: "level3",
      id: item.level3_id,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  if (levelSize >= 4) {
    levelMaps.level4 = level4.map((item) => ({
      ...item,
      children: [],
      level: "level4",
      id: item.level4_id,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  if (levelSize >= 5) {
    levelMaps.level5 = level5.map((item) => ({
      ...item,
      children: [],
      level: "level5",
      id: item.level5_id,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  // Mapping parent-child relationships
  if (levelSize >= 5) {
    levelMaps.level5.forEach((item) => {
      const parent = levelMaps.level4.find((lvl4) =>
        lvl4.level1_id === item.level1_id &&
        lvl4.level2_id === item.level2_id &&
        lvl4.level3_id === item.level3_id &&
        lvl4.level4_id === item.level4_id
      );
      if (parent) parent.children.push(item);
    });
  }

  if (levelSize >= 4) {
    levelMaps.level4.forEach((item) => {
      const parent = levelMaps.level3.find((lvl3) =>
        lvl3.level1_id === item.level1_id &&
        lvl3.level2_id === item.level2_id &&
        lvl3.level3_id === item.level3_id
      );
      if (parent) parent.children.push(item);
    });
  }

  if (levelSize >= 3) {
    levelMaps.level3.forEach((item) => {
      const parent = levelMaps.level2.find((lvl2) =>
        lvl2.level1_id === item.level1_id &&
        lvl2.level2_id === item.level2_id
      );
      if (parent) parent.children.push(item);
    });
  }

  if (levelSize >= 2) {
    levelMaps.level2.forEach((item) => {
      const parent = levelMaps.level1.find((lvl1) =>
        lvl1.level1_id === item.level1_id
      );
      if (parent) parent.children.push(item);
    });
  }

  return levelMaps.level1;
};

// Helper function to check if node or its children match search
const nodeMatchesSearch = (node, searchLower) => {
  if (!searchLower) return true;

  // Check if current node matches
  if (node.name.toLowerCase().includes(searchLower)) {
    return true;
  }

  // Check if any child matches
  if (node.children && node.children.length > 0) {
    return node.children.some(child => nodeMatchesSearch(child, searchLower));
  }

  return false;
};

// -------- Tree Node Component --------
const TreeNode = ({
  node,
  parentIds = [],
  parentNames = [],
  onClick,
  selectedNodeId,
  setSelectedTreeNode,
  searchString = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  const nodeId = [...parentIds, node.id].join("_");
  const fullPath = [...parentNames, node.name];

  const targetPaths = [
    ["CPG", "Personal care", "Haircare", "H&S", "Hair Product"],
    ["Technology", "Laptops", "Business Laptop", "Dell Lattitude", "Windows"],
    ["Automobile", "Automatic", "Crossover", "Honda HRV", "Model"],
    ["Pharma", "OTC Drugs", "Cold & Cough", "Vicks Action 500", "Standard Type"],
    ["Tyres", "Eco Tyres", "Mud Terrain Tyres", "MRF ZLR", "Standard Type"],
    ["India", "South", "South-1", "TL"]
  ];

  const isTargetPath = targetPaths.some((targetPath) =>
    fullPath.every((val, idx) => targetPath[idx] === val)
  );

  const isSelected = nodeId === selectedNodeId;

  // Check if this node or its children match search
  const searchLower = searchString.toLowerCase();
  const matchesSearch = nodeMatchesSearch(node, searchLower);

  // Don't render if doesn't match search
  if (searchString && !matchesSearch) {
    return null;
  }

  const handleClick = () => {
    const treeNodeObject = {
      level1_id: null,
      level2_id: null,
      level3_id: null,
      level4_id: null,
      level5_id: null,
      level: node.level,
      name: node.name,  // ✅ ADD THIS LINE
      id: node.id,
    };

    [treeNodeObject.level1_id, treeNodeObject.level2_id, treeNodeObject.level3_id, treeNodeObject.level4_id]
      = [...parentIds, undefined, undefined, undefined].slice(0, 4);

    if (node.level === "level1") treeNodeObject.level1_id = node.id;
    if (node.level === "level2") treeNodeObject.level2_id = node.id;
    if (node.level === "level3") treeNodeObject.level3_id = node.id;
    if (node.level === "level4") treeNodeObject.level4_id = node.id;
    if (node.level === "level5") treeNodeObject.level5_id = node.id;

    setSelectedTreeNode(treeNodeObject);
    if (onClick) onClick(nodeId);
  };

  // Highlight matching text
  const highlightText = (text) => {
    if (!searchString) return text;

    const index = text.toLowerCase().indexOf(searchLower);
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <span style={{ backgroundColor: '#fef3c7', fontWeight: 600 }}>
          {text.substring(index, index + searchString.length)}
        </span>
        {text.substring(index + searchString.length)}
      </>
    );
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <div
        id={nodeId}
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
          handleClick();
        }}
        style={{
          cursor: "pointer",
          fontWeight: node.children?.length || node.level === "level1" ? "bold" : "normal",
          color: isTargetPath ? "#5b84b3" : "",
          fontSize: "13px",
          padding: "4px 0",
        }}
      >
        {node.children?.length ? (
          expanded ? <KeyboardArrowDown fontSize="small" /> : <KeyboardArrowRight fontSize="small" />
        ) : (
          <AdjustOutlined
            fontSize="inherit"
            style={{ marginRight: "8px", marginLeft: "3px", fontSize: "12px" }}
          />
        )}
        {"  "}
        {highlightText(node.name)}{" "}
        {isSelected ? <RadioButtonChecked fontSize="small" style={{ fontSize: "14px" }} /> : null}
      </div>

      {expanded && node.children?.length > 0 &&
        node.children.map((child) => (
          <TreeNode
            key={`${child.level}_id_${child.id}`}
            node={child}
            parentIds={[...parentIds, node.id]}
            parentNames={[...fullPath]}
            setSelectedTreeNode={setSelectedTreeNode}
            onClick={onClick}
            selectedNodeId={selectedNodeId}
            searchString={searchString}
          />
        ))}
    </div>
  );
};

// -------- Main Tree Component --------
const Stage3Heirarchy = ({ hierarchyData: data, setSelectedTreeNode, searchString = "" }) => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const treeviewBoxRef = useRef(null);
  const { formData } = useFormContext();
  const selProductCategory = formData?.stage2?.product_category;

  if (!data || typeof data !== "object") return null;

  const treeData = buildTree(data, { level1_id: selProductCategory });

  if (!Array.isArray(treeData)) return null;

  // Filter tree data based on search
  const filteredTreeData = searchString
    ? treeData.filter(rootNode => nodeMatchesSearch(rootNode, searchString.toLowerCase()))
    : treeData;

  if (searchString && filteredTreeData.length === 0) {
    return (
      <EmptyState>
        <p>No results found for "{searchString}"</p>
      </EmptyState>
    );
  }

  return (
    <Wrapper id="treeview-box" ref={treeviewBoxRef}>
      {filteredTreeData.map((rootNode) => (
        <TreeNode
          key={rootNode.level1_id}
          node={rootNode}
          parentNames={[]}
          setSelectedTreeNode={setSelectedTreeNode}
          onClick={setSelectedNodeId}
          selectedNodeId={selectedNodeId}
          searchString={searchString}
        />
      ))}
    </Wrapper>
  );
};

export default Stage3Heirarchy;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  
  p {
    font-size: 13px;
    color: #94a3b8;
    text-align: center;
  }
`;

const Wrapper = styled.div`
  margin-top: 10px;
`;
