import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronRight,
  ChevronDown,
  Download,
  Eye,
  Package,
  Layers,
  Box,
  Tag,
  Barcode,
  Grid3X3,
  BarChart3,
} from "lucide-react";
import { removeDescription, removeSKU } from "../../../Utils/skuDescriptionConverter";


const LEVEL_ICONS = [Package, Layers, Box, Grid3X3, Tag, Barcode];
const LEVEL_COLORS = ["#2563eb", "#0284c7", "#0d9488", "#059669", "#d97706", "#e11d48"];
const LEVEL_BG = ["#eff6ff", "#f0f9ff", "#f0fdfa", "#ecfdf5", "#fffbeb", "#fff1f2"];

/* ───────────── hierarchy builder ───────────── */
const buildDynamicHierarchy = (apiData = []) => {
  const levels = {
    level1: [],
    level2: [],
    level3: [],
    level4: [],
    level5: [],
    level6: [],
  };

  const maps = {
    level1: new Map(),
    level2: new Map(),
    level3: new Map(),
    level4: new Map(),
    level5: new Map(),
    level6: new Map(),
  };

  apiData.forEach((sku) => {
    if (!sku?.combination) return;

    const parts = sku.combination.split(/[\\/]/).filter(Boolean);
    if (parts.length === 0) return;

    const parentIds = {};
    for (let i = 0; i < parts.length && i < 6; i += 1) {
      const level = i + 1;
      const levelKey = `level${level}`;
      const idKey = `${levelKey}_id`;
      const prevLevel = level - 1;
      const prevIdKey = `level${prevLevel}_id`;
      const currentPath = parts.slice(0, level).join("__");

      if (!maps[levelKey].has(currentPath)) {
        const node = {
          [idKey]: `${idKey}-${currentPath}`,
          name: parts[i],
          path: currentPath,
        };

        if (level > 1) {
          node[prevIdKey] = parentIds[prevIdKey];
        }

        if (level === 6) {
          node.sku_id = sku.sku_id;
          node.sku_name = sku.sku_name || parts[i];
          node.description = sku.description || `SKU ${sku.sku_name || parts[i]}`;
          node.combination = sku.combination;
          node.raw = sku;
        }

        maps[levelKey].set(currentPath, node);
        levels[levelKey].push(node);
      }

      parentIds[idKey] = maps[levelKey].get(currentPath)[idKey];
    }
  });

  console.log("✅ buildDynamicHierarchy result:", {
    level1Count: levels.level1.length,
    level6Count: levels.level6.length,
  });

  return levels;
};

/* ───────────── TreeNode ───────────── */
function TreeNode({
  level,
  item,
  children,
  onPreview,
  onDownload,
  onShowGraph,
  isSelected,
  onChange,
}) {
  const [expanded, setExpanded] = useState(level <= 2);
  const hasChildren = !!children;
  const Icon = LEVEL_ICONS[level - 1] || Package;
  const colorHex = LEVEL_COLORS[level - 1] || "#032B4E";
  const bgHex = LEVEL_BG[level - 1] || "#f1f5f9";
  const isSku = level === 6;
  const isLeaf = !item.children || item.children.length === 0;
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 6px",
          paddingLeft: (level - 1) * 10 + 8,
          borderRadius: 8,
          cursor: "pointer",
          background: isSelected
            ? "linear-gradient(135deg, #021a30, #032B4E)"
            : "transparent",
          color: isSelected ? "#fff" : "#1e293b",
          transition: "all 0.15s",
        }}
        className="tree-node-row"
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.background = "#f1f5f9";
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.background = "transparent";
        }}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            style={{
              flexShrink: 0,
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: isSelected ? "#fff" : "#94a3b8",
            }}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span style={{ width: 20, flexShrink: 0 }} />
        )}

        {/* Level Icon */}
        <span
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            borderRadius: 6,
            background: isSelected ? "rgba(255,255,255,0.15)" : bgHex,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={14} color={isSelected ? "#fff" : colorHex} />
        </span>

        {/* Name */}
        <span
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "Inter, sans-serif",
            cursor: hasChildren ? "pointer" : "default",
          }}
          title={item.name}
          onClick={() => hasChildren && setExpanded(!expanded)}
        >
          {!hasChildren ? (
            <span className="text-sm">
              {removeDescription(item.name)} <br />
              {removeSKU(item.name)}
            </span>
          ) : (
            item.name
          )}
        </span>

        {/* Level badge */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "2px 6px",
            borderRadius: 4,
            background: isSelected ? "rgba(255,255,255,0.15)" : bgHex,
            color: isSelected ? "#fff" : colorHex,
          }}
        >
          L{level}
        </span>

        {/* Action buttons */}
        <div
          className="tree-node-actions"
          style={{ display: "flex", gap: 2, opacity: 0, transition: "opacity 0.15s" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Preview clicked =>", { level, item });

              if (typeof onPreview === "function") {
                onPreview(level, item);
              }
            }}
            style={{
              padding: 4,
              borderRadius: 4,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: isSelected ? "#fff" : "#032B4E",
            }}
            title="Preview data"
          >
            <Eye size={14} />
          </button>

          {isSku && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (typeof onShowGraph === "function") {
                  onShowGraph(item);
                }
              }}
              style={{
                padding: 4,
                borderRadius: 4,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: isSelected ? "#fff" : "#f79658",
              }}
              title="Show graph"
            >
              <BarChart3 size={14} />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (typeof onDownload === "function") {
                onDownload(level, item);
              }
            }}
            style={{
              padding: 4,
              borderRadius: 4,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: isSelected ? "#fff" : "#6B7280",
            }}
            title="Download"
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: (level - 1) * 20 + 18,
              borderLeft: "1px solid #e2e8f0",
            }}
          />
          {children}
        </div>
      )}

      <style>{`
        .tree-node-row:hover .tree-node-actions { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

/* ───────────── Main ProductTree ───────────── */
export default function ProductTree({
  combinations,
  onPreview,
  onDownload,
  onShowGraph,
  selectedNode,
  searchQuery = "",
  onChange,
}) {
  const hierarchy = useMemo(() => {
    try {
      const built = buildDynamicHierarchy(combinations);
      return built;
    } catch (err) {
      console.error("❌ buildDynamicHierarchy error:", err);
      return { level1: [], level2: [], level3: [], level4: [], level5: [], level6: [] };
    }
  }, [combinations]);

  const isSelected = useCallback(
    (level, id) => selectedNode?.level === level && selectedNode?.id === id,
    [selectedNode]
  );

  const getChildren = (parentLevel, parentId, data) => {
    const parentKey = `level${parentLevel}_id`;
    return data.filter((item) => item[parentKey] === parentId);
  };

  const matchesSearch = useCallback(
    (item, level) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();

      if (item.name?.toLowerCase().includes(q)) return true;

      if (level < 6) {
        const nextLevel = `level${level + 1}`;
        const parentKey = `level${level}_id`;

        const kids = hierarchy[nextLevel]?.filter(
          (n) => n[parentKey] === item[`level${level}_id`]
        );

        return kids?.some((kid) => matchesSearch(kid, level + 1));
      }

      return false;
    },
    [searchQuery, hierarchy]
  );

  const filteredLevel1 = hierarchy.level1.filter((l1) => matchesSearch(l1, 1));

  return (
    <div style={{ padding: "8px 0" }}>
      {filteredLevel1.map((l1) => (
        <TreeNode
          key={l1.level1_id}
          level={1}
          item={l1}
          onPreview={onPreview}
          onDownload={onDownload}
          onShowGraph={onShowGraph}
          isSelected={isSelected(1, l1.level1_id)}
          onChange={onChange}
        >
          {getChildren(1, l1.level1_id, hierarchy.level2).map((l2) => (
            <TreeNode
              key={l2.level2_id}
              level={2}
              item={l2}
              onPreview={onPreview}
              onDownload={onDownload}
              onShowGraph={onShowGraph}
              isSelected={isSelected(2, l2.level2_id)}
              onChange={onChange}
            >
              {getChildren(2, l2.level2_id, hierarchy.level3).map((l3) => (
                <TreeNode
                  key={l3.level3_id}
                  level={3}
                  item={l3}
                  onPreview={onPreview}
                  onDownload={onDownload}
                  onShowGraph={onShowGraph}
                  isSelected={isSelected(3, l3.level3_id)}
                  onChange={onChange}
                >
                  {getChildren(3, l3.level3_id, hierarchy.level4).map((l4) => (
                    <TreeNode
                      key={l4.level4_id}
                      level={4}
                      item={l4}
                      onPreview={onPreview}
                      onDownload={onDownload}
                      onShowGraph={onShowGraph}
                      isSelected={isSelected(4, l4.level4_id)}
                      onChange={onChange}
                    >
                      {getChildren(4, l4.level4_id, hierarchy.level5).map((l5) => (
                        <TreeNode
                          key={l5.level5_id}
                          level={5}
                          item={l5}
                          onPreview={onPreview}
                          onDownload={onDownload}
                          onShowGraph={onShowGraph}
                          isSelected={isSelected(5, l5.level5_id)}
                          onChange={onChange}
                        >
                          {getChildren(5, l5.level5_id, hierarchy.level6).map((l6) => (
                            <TreeNode
                              key={l6.level6_id}
                              level={6}
                              item={l6}
                              onPreview={onPreview}
                              onDownload={onDownload}
                              onShowGraph={onShowGraph}
                              isSelected={isSelected(6, l6.level6_id)}
                              onChange={onChange}
                            />
                          ))}
                        </TreeNode>
                      ))}
                    </TreeNode>
                  ))}
                </TreeNode>
              ))}
            </TreeNode>
          ))}
        </TreeNode>
      ))}

      {filteredLevel1.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "32px 0",
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          {searchQuery ? "No matches found" : "No hierarchy data available"}
        </div>
      )}
    </div>
  );
}
// la la 