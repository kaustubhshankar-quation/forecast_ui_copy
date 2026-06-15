import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  TreePine,
  BarChart3,
  X,
} from "lucide-react";
import ProductTree from "./ProductTree";
import SkuGraphPanel from "./SkuGraphPanel";
import Report1 from "../Report1";
import Report2 from "../Report2";
import Report3 from "../Report3";

/* ───────────── hierarchy builder ───────────── */
const buildDynamicHierarchy = (apiData = []) => {
  const levels = {
    level1: [], level2: [], level3: [],
    level4: [], level5: [], level6: [],
  };
  const maps = {
    level1: new Map(), level2: new Map(), level3: new Map(),
    level4: new Map(), level5: new Map(), level6: new Map(),
  };

  apiData.forEach((sku) => {
    if (!sku?.combination) return;
    const parts = sku.combination.split("\\").filter(Boolean);
    if (parts.length < 6) return;
    const [l1, l2, l3, l4, l5, l6] = parts;

    const level1Key = l1;
    if (!maps.level1.has(level1Key)) {
      const node = { level1_id: `l1-${level1Key}`, name: l1 };
      maps.level1.set(level1Key, node);
      levels.level1.push(node);
    }
    const level1Id = maps.level1.get(level1Key).level1_id;

    const level2Key = `${l1}__${l2}`;
    if (!maps.level2.has(level2Key)) {
      const node = { level2_id: `l2-${level2Key}`, name: l2, level1_id: level1Id };
      maps.level2.set(level2Key, node);
      levels.level2.push(node);
    }
    const level2Id = maps.level2.get(level2Key).level2_id;

    const level3Key = `${l1}__${l2}__${l3}`;
    if (!maps.level3.has(level3Key)) {
      const node = { level3_id: `l3-${level3Key}`, name: l3, level1_id: level1Id, level2_id: level2Id };
      maps.level3.set(level3Key, node);
      levels.level3.push(node);
    }
    const level3Id = maps.level3.get(level3Key).level3_id;

    const level4Key = `${l1}__${l2}__${l3}__${l4}`;
    if (!maps.level4.has(level4Key)) {
      const node = { level4_id: `l4-${level4Key}`, name: l4, level1_id: level1Id, level2_id: level2Id, level3_id: level3Id };
      maps.level4.set(level4Key, node);
      levels.level4.push(node);
    }
    const level4Id = maps.level4.get(level4Key).level4_id;

    const level5Key = `${l1}__${l2}__${l3}__${l4}__${l5}`;
    if (!maps.level5.has(level5Key)) {
      const node = { level5_id: `l5-${level5Key}`, name: l5, level1_id: level1Id, level2_id: level2Id, level3_id: level3Id, level4_id: level4Id };
      maps.level5.set(level5Key, node);
      levels.level5.push(node);
    }
    const level5Id = maps.level5.get(level5Key).level5_id;

    const level6Key = `${l1}__${l2}__${l3}__${l4}__${l5}__${l6}`;
    if (!maps.level6.has(level6Key)) {
      const node = {
        level6_id: sku.sku_id ?? `l6-${level6Key}`,
        name: sku.sku_name || l6,
        description: `SKU ${sku.sku_name || l6}`,
        sku_id: sku.sku_id,
        sku_name: sku.sku_name || l6,
        combination: sku.combination,
        raw: sku,
        level1_id: level1Id, level2_id: level2Id, level3_id: level3Id,
        level4_id: level4Id, level5_id: level5Id,
      };
      maps.level6.set(level6Key, node);
      levels.level6.push(node);
    }
  });

  return levels;
};

/* ───────────── collect SKUs under any node ───────────── */
const collectSkusUnderNode = (hierarchy, level, item) => {
  if (level === 6) return [item];
  const parentKey = `level${level}_id`;
  const parentId = item[parentKey];

  const filterDescendants = (currentLevel, parentIds) => {
    if (currentLevel > 6) return [];
    const key = `level${currentLevel - 1}_id`;
    const items = hierarchy[`level${currentLevel}`].filter((n) =>
      parentIds.includes(n[key])
    );
    if (currentLevel === 6) return items;
    const nextIds = items.map((n) => n[`level${currentLevel}_id`]);
    return filterDescendants(currentLevel + 1, nextIds);
  };

  return filterDescendants(level + 1, [parentId]);
};

/* ───────────── build breadcrumb path ───────────── */
const buildBreadcrumb = (hierarchy, level, item) => {
  const parts = [];
  for (let l = 1; l <= level; l++) {
    const key = `level${l}_id`;
    const id = item[key];
    if (!id) continue;
    const node = hierarchy[`level${l}`].find((n) => n[key] === id);
    if (node) parts.push(node.name);
  }
  return parts;
};

/* ───────────── LEVEL LABELS ───────────── */
const LEVEL_LABELS = ["Brand", "Category", "Sub-Cat", "Group", "Series", "SKU"];

/* ───────────── MAIN COMPONENT ───────────── */
export default function Index({
  combinations = [],
  Product,
  Location,
  Workflow,
  multipleModelData,
  multipleForecastData,
  multipleActPredData,
}) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphNode, setGraphNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReportTab, setActiveReportTab] = useState("Report1");

  const hierarchy = useMemo(
    () => buildDynamicHierarchy(combinations),
    [combinations]
  );
  const skuCount = hierarchy.level6.length;

  /* ── handlers ── */
  const handlePreview = (level, item) => {
    const idKey = `level${level}_id`;
    setSelectedNode({ level, id: item[idKey], item });
    setGraphNode(null);
    setActiveReportTab("Report1");
  };

  const handleShowGraph = (item) => {
    setGraphNode(item);
    setSelectedNode(null);
  };

  const handleDownload = (level, item) => {
    alert(`Download triggered for Level ${level}: ${item.name}`);
  };

  /* ── derived data ── */
  const breadcrumb = selectedNode
    ? buildBreadcrumb(hierarchy, selectedNode.level, selectedNode.item)
    : graphNode
    ? buildBreadcrumb(hierarchy, 6, graphNode)
    : [];

  const selectedSkus = selectedNode
    ? collectSkusUnderNode(hierarchy, selectedNode.level, selectedNode.item)
    : [];

  /* ── SKU-level product name for reports ── */
  const selectedProduct = selectedNode?.level === 6
    ? selectedNode.item.sku_name || selectedNode.item.name
    : Product;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "85vh",
        background: "#fbfcf7",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #475C7E",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      {/* ── Context Bar (breadcrumb + selected model info) ── */}
      {(selectedNode || graphNode) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 24px",
            background: "#eaf6fa",
            borderBottom: "1px solid #d0e8f0",
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 600, color: "#032B4E" }}>
              📍 {Location || "—"}
            </span>
            <span style={{ color: "#999" }}>|</span>
            <span style={{ color: "#06624b" }}>
              {breadcrumb.join(" › ")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {graphNode && (
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 8,
                  background: "#032B4E",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                📊 Graph View
              </span>
            )}
            {selectedNode && (
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 8,
                  background: "#032B4E",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                L{selectedNode.level} {LEVEL_LABELS[selectedNode.level - 1]} — {selectedSkus.length} SKU{selectedSkus.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ── Left: Tree Navigator ── */}
        <aside
          style={{
            width: 380,
            flexShrink: 0,
            borderRight: "1px solid #e2e8f0",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                placeholder="Search hierarchy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: 36,
                  paddingRight: 12,
                  paddingTop: 8,
                  paddingBottom: 8,
                  fontSize: 14,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>
          </div>

          {/* Tree */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0 8px",
            }}
          >
            <ProductTree
              combinations={combinations}
              onPreview={handlePreview}
              onDownload={handleDownload}
              onShowGraph={handleShowGraph}
              selectedNode={
                selectedNode
                  ? { level: selectedNode.level, id: selectedNode.id }
                  : null
              }
              searchQuery={searchQuery}
            />
          </div>

          {/* Legend */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <p
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#94a3b8",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Levels
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {LEVEL_LABELS.map((label, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: "#f1f5f9",
                    color: "#64748b",
                  }}
                >
                  L{i + 1} {label}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Right: Reports / Graph / Empty State ── */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#f8fafc",
          }}
        >
          {graphNode ? (
            /* ── SKU Graph ── */
            <SkuGraphPanel
              skuItem={graphNode}
              onClose={() => setGraphNode(null)}
              Product={graphNode.sku_name || graphNode.name}
              Location={Location}
              multipleActPredData={multipleActPredData}
            />
          ) : selectedNode ? (
            /* ── Report Tabs ── */
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Tab Bar */}
              <div
                style={{
                  display: "flex",
                  gap: 0,
                  borderBottom: "2px solid #e2e8f0",
                  background: "#fff",
                  padding: "0 24px",
                }}
              >
                {[
                  { key: "Report1", label: "Actual vs Prediction", icon: "📈" },
                  { key: "Report2", label: "MAPE Report", icon: "📊" },
                  { key: "Report3", label: "Forecast Report", icon: "🔮" },
                ].map((tab) => {
                  const isActive = activeReportTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveReportTab(tab.key)}
                      style={{
                        padding: "14px 24px",
                        fontSize: 15,
                        fontWeight: isActive ? 700 : 500,
                        fontFamily: "Poppins, sans-serif",
                        color: isActive ? "#032B4E" : "#6B7280",
                        background: "transparent",
                        border: "none",
                        borderBottom: isActive
                          ? "3px solid #f79658"
                          : "3px solid transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "all 0.2s",
                      }}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  );
                })}

                {/* Close button */}
                <button
                  onClick={() => setSelectedNode(null)}
                  style={{
                    marginLeft: "auto",
                    padding: "8px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                  }}
                  title="Close panel"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                {activeReportTab === "Report1" && (
                  <Report1
                    Product={selectedProduct}
                    Location={Location}
                    multipleActPredData={multipleActPredData}
                    bestModelData={multipleActPredData?.data?.top_model_name?.[0]}
                  />
                )}
                {activeReportTab === "Report2" && (
                  <Report2
                    Product={selectedProduct}
                    Location={Location}
                    multipleModelData={multipleModelData}
                    bestModel={multipleModelData?.top_model_name?.[0]}
                  />
                )}
                {activeReportTab === "Report3" && (
                  <Report3
                    Product={selectedProduct}
                    Location={Location}
                    Workflow={Workflow}
                    multipleForecastData={multipleForecastData}
                    bestModelData={multipleForecastData?.data?.top_model_name?.[0]}
                  />
                )}
              </div>

              {/* SKU List Table (cumulative view) */}
              {selectedNode.level < 6 && selectedSkus.length > 0 && (
                <div
                  style={{
                    borderTop: "1px solid #e2e8f0",
                    maxHeight: 200,
                    overflowY: "auto",
                    background: "#fff",
                    padding: "12px 24px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#032B4E",
                      marginBottom: 8,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    📦 {selectedSkus.length} SKUs under this node
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedSkus.map((sku) => (
                      <span
                        key={sku.level6_id}
                        onClick={() => handlePreview(6, sku)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: "#eaf6fa",
                          color: "#032B4E",
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                          border: "1px solid #d0e8f0",
                          transition: "all 0.2s",
                          fontFamily: "Inter, sans-serif",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#032B4E";
                          e.target.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#eaf6fa";
                          e.target.style.color = "#032B4E";
                        }}
                      >
                        {sku.sku_name || sku.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Empty State ── */
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center", maxWidth: 380 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: "#eaf6fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <BarChart3 size={28} color="#032B4E" />
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 4,
                    fontFamily: "Poppins, sans-serif",
                    color: "#032B4E",
                  }}
                >
                  Select a node to preview
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    lineHeight: 1.6,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Click the{" "}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "#f1f5f9",
                      fontSize: 12,
                    }}
                  >
                    👁 Preview
                  </span>{" "}
                  button on any level to view reports, or the{" "}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "#f1f5f9",
                      fontSize: 12,
                    }}
                  >
                    📊 Graph
                  </span>{" "}
                  button on a SKU to see charts.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
