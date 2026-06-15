import React, { useEffect, useMemo, useState, useRef } from "react";
import { Search, BarChart3, Download } from "lucide-react";
import ProductTree from "./treecombination/ProductTree";
import SkuGraphPanel from "./treecombination/SkuGraphPanel";
import Report1 from "./Report1";
import Report2 from "./Report2";
import Report3 from "./Report3";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedNode, setSelectedSkuIds, setSelectedModel, setSelectedProductLocation } from '../../store/slices/workflowSlice';
import { removeDescription, removeSKU } from "../../Utils/skuDescriptionConverter";
import Loader from "../common/Loader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { zeroIfNegative } from "../../Utils/helper";

const collectSkusUnderNode = (apiData, node) => {
  if (!node || !apiData) return [];
  if (node.level6_id) return [node.raw || node]; // if it's SKU, return the full object

  const path = node.path;
  const level = path.split('__').length;

  return apiData
    .filter(sku => {
      const skuParts = sku.combination.split(/[\\/]/).filter(Boolean);
      const skuPath = skuParts.slice(0, level).join('__');
      return skuPath === path;
    });
};

export default function WorkflowReportMenu({
  Workflow,
  onChange
}) {
  console.log("🚀 WorkflowReportMenu rendering");
  const dispatch = useAppDispatch();
  const combinations = useAppSelector(state => state.workflow.combinations);
  const selectedNode = useAppSelector(state => state.workflow.selectedNode);
  const selectedSkuIds = useAppSelector(state => state.workflow.selectedSkuIds);
  const selectedLocation = useAppSelector(state => state.workflow.selectedLocation);
  const selectedProduct = useAppSelector(state => state.workflow.selectedProduct);
  const selectedModel = useAppSelector(state => state.workflow.selectedModel);
  const bestModelData = useAppSelector(state => state.workflow.bestModelData);
  const multipleModelData = useAppSelector(state => state.workflow.multipleModelData);
  const bestActPredData = useAppSelector(state => state.workflow.bestActPredData);
  const multipleActPredData = useAppSelector(state => state.workflow.multipleActPredData);
  const bestForecasteData = useAppSelector(state => state.workflow.bestForecasteData);
  const multipleForecastData = useAppSelector(state => state.workflow.multipleForecastData);
  const graphRef = useRef(null);
  const [hierarchyLoading, setHierarchyLoading] = useState(true);


  console.log("✅ WorkflowReportMenu Redux State:", {
    multipleModelData_status: multipleModelData?.status || "❌ NOT SET",
    bestActPredData_status: bestActPredData?.status || "❌ NOT SET",
    multipleForecastData_status: multipleForecastData?.status || "❌ NOT SET",
    selectedSkuIds_length: selectedSkuIds?.length || 0,
    selectedLocation,
    selectedModel,
  });
  const [activeTab, setActiveTab] = useState("Report1");

  const apiData = combinations;

  const [graphNode, setGraphNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedSkus = useMemo(() => {
    if (!combinations || !selectedSkuIds?.length) return [];
    return combinations.filter((sku) => selectedSkuIds.includes(sku.sku_id));
  }, [combinations, selectedSkuIds]);

  useEffect(() => {
    if (combinations && combinations.length > 0) {
      setHierarchyLoading(false);
    }
  }, [combinations]);

  // Extract models from API data dynamically based on selected SKUs
  const models = useMemo(() => {
    console.log("WorkflowReportMenu: Calculating models", {
      multipleModelData: multipleModelData?.status,
      selectedSkuIds: selectedSkuIds?.length,
      selectedLocation
    });

    if (!multipleModelData || multipleModelData?.status !== "success" || !selectedSkuIds?.length || !selectedLocation) {
      console.log("WorkflowReportMenu: Using fallback models");
      return ["ARIMAX", "SARIMAX", "ARIMA", "SARIMA"];
    }

    const cityData = multipleModelData.data?.cities?.find(city => city.city === selectedLocation);
    console.log("WorkflowReportMenu: cityData found", !!cityData);

    if (!cityData?.data) {
      console.log("WorkflowReportMenu: No city data, using fallback");
      return ["ARIMAX", "SARIMAX", "ARIMA", "SARIMA"];
    }

    const skus = combinations.filter(sku => selectedSkuIds.includes(sku.sku_id));
    console.log("WorkflowReportMenu: filtered skus", skus.length);

    const matchedSkuData = skus.map(skuNode => {
      const skuName = skuNode?.sku_name || skuNode?.name;
      return cityData.data.find(item => item.sku === skuName);
    }).filter(Boolean);

    console.log("WorkflowReportMenu: matchedSkuData", matchedSkuData.length);

    const modelStats = new Map();
    matchedSkuData.forEach(skuItem => {
      const models = skuItem.multiple_model_data || skuItem.data || [];
      models.forEach(model => {
        const modelName = model.model_name || model.model;
        if (!modelName) return;
        const rawTest = Number(model.test_wmape || model.test_wmape === 0 ? model.test_wmape : model.test_wmape);
        const testValue = Number.isFinite(rawTest) ? rawTest : null;
        const stats = modelStats.get(modelName) || { total: 0, count: 0 };
        if (testValue !== null) {
          stats.total += testValue;
          stats.count += 1;
        }
        modelStats.set(modelName, stats);
      });
    });

    const modelList = Array.from(modelStats.keys());
    modelList.sort((a, b) => {
      const aStats = modelStats.get(a) || { total: 0, count: 0 };
      const bStats = modelStats.get(b) || { total: 0, count: 0 };
      const aAvg = aStats.count ? aStats.total / aStats.count : Number.POSITIVE_INFINITY;
      const bAvg = bStats.count ? bStats.total / bStats.count : Number.POSITIVE_INFINITY;
      return aAvg - bAvg;
    });

    console.log("WorkflowReportMenu: final models", modelList);
    return modelList.length ? modelList : ["ARIMAX", "SARIMAX", "ARIMA", "SARIMA"];
  }, [multipleModelData, selectedSkuIds, selectedLocation, combinations]);

  const bestModel = useMemo(() => {
    return multipleActPredData?.data?.top_model_name?.[0] || models[0] || "ARIMAX";
  }, [multipleActPredData, models]);

  const activeModel = selectedModel || bestModel || models[0] || "ARIMAX";

  useEffect(() => {
    console.log("WorkflowReportMenu: selectedModel check", { selectedModel, bestModel, models });
    if (models.length > 0 && !selectedModel) {
      console.log("WorkflowReportMenu: Setting initial selectedModel to", bestModel);
      dispatch(setSelectedModel(bestModel));
    }
  }, [dispatch, models, bestModel, selectedModel]);

  const getCityData = (dataSource) => {
    if (!dataSource || dataSource?.status !== "success") return null;

    let cities = [];

    // best model structure
    if (dataSource?.data?.data?.cities) {
      cities = dataSource.data.data.cities;
    }
    // normal structure
    else if (dataSource?.data?.cities) {
      cities = dataSource.data.cities;
    }

    if (!cities.length) return null;

    const targetCity = selectedLocation || cities[0]?.city;
    return cities.find((c) => c.city === targetCity) || cities[0] || null;
  };

  const getSelectedSkuRows = (cityData) => {
    if (!cityData?.data?.length) return [];
    return selectedSkus
      .map((skuNode) => {
        const skuName = skuNode?.sku_name || skuNode?.name;
        return cityData.data.find((item) => item.sku === skuName || item.sku_name === skuName || item.name === skuName);
      })
      .filter(Boolean);
  };

  const getSkuName = (skuItem) => skuItem?.sku || skuItem?.sku_name || skuItem?.name || "Unknown SKU";
  const getSkuDescription = (skuItem, skuInfo) => {
    return skuInfo?.description || skuInfo?.sku_name || skuItem?.sku || skuItem?.sku_name || skuItem?.name || "Unknown SKU";
  };

  const downloadReport1 = () => {
    const isBestModelMode = activeModel === "bestModel";
    const dataSource = isBestModelMode ? bestActPredData : multipleActPredData;
    const cityData = getCityData(dataSource);
    if (!cityData) return;

    const selectedSkuData = getSelectedSkuRows(cityData);
    if (!selectedSkuData.length) return;

    const skuMap = new Map((combinations || []).map((sku) => [sku.sku_name, sku]));
    const selectedModelName = activeModel;
    const intervalPeriods = new Set();

    selectedSkuData.forEach((skuItem) => {
      let modelRows = [];

      if (isBestModelMode) {
        modelRows = skuItem.data || [];
      } else {
        const modelBlock = skuItem.multiple_model_data?.find(
          (model) => model.model_name === selectedModelName
        );
        modelRows = modelBlock?.data || [];
      }

      modelRows.forEach((row) => intervalPeriods.add(row.frequency_year));
    });

    const sortedPeriods = Array.from(intervalPeriods).sort((a, b) => {
      const [am, ay] = String(a).split("-");
      const [bm, by] = String(b).split("-");
      return new Date(`${ay}-${am}-01`) - new Date(`${by}-${bm}-01`);
    });

    const cutoff = Math.max(sortedPeriods.length - 3, 0);
    const periodIndex = Object.fromEntries(sortedPeriods.map((period, idx) => [period, idx]));

    const excelRows = selectedSkuData.flatMap((skuItem) => {
      const skuName = getSkuName(skuItem);
      const skuInfo = skuMap.get(skuName);

      let modelRows = [];
      if (isBestModelMode) {
        modelRows = skuItem.data || [];
      } else {
        const modelBlock = skuItem.multiple_model_data?.find(
          (model) => model.model_name === selectedModelName
        );
        modelRows = modelBlock?.data || [];
      }

      return modelRows.map((row) => ({
        SKU: removeDescription(skuName),
        Level: selectedNode?.name || selectedProduct || "Preview",
        Location: selectedLocation,
        Description: removeSKU(getSkuDescription(skuItem, skuInfo)),
        Model: isBestModelMode ? (skuItem?.top_model_name || "Best Model") : selectedModelName,
        Period: row.frequency_year,
        Actual: row.actual || 0,
        Predicted: zeroIfNegative(periodIndex[row.frequency_year] < cutoff ? row.predicted || 0 : ""),
        Forecasted: zeroIfNegative(periodIndex[row.frequency_year] >= cutoff ? row.predicted || 0 : ""),
      }));
    });

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Actual_vs_Predicted");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `${selectedNode?.name || selectedProduct || "Preview"}_${selectedLocation}_${selectedModelName}_Report1.xlsx`);
  };

  const downloadReport2 = () => {
    const isBestModelMode = selectedModel === "bestModel";
    const modelToMatch = isBestModelMode ? null : (selectedModel || bestModel || "ARIMAX");

    const cityData = getCityData(isBestModelMode ? bestModelData : multipleModelData);
    if (!cityData) return;

    const selectedSkuData = getSelectedSkuRows(cityData);
    if (!selectedSkuData.length) return;

    const excelRows = selectedSkuData
      .map((skuItem) => {
        const skuName = getSkuName(skuItem);

        let modelBlock = null;

        if (isBestModelMode) {
          modelBlock = skuItem?.data?.[0];
        } else {
          const models = skuItem.multiple_model_data || skuItem.data || [];
          modelBlock = models.find((model) => {
            const modelName = model.model_name || model.model;
            return modelName === modelToMatch;
          });
        }

        if (!modelBlock) return null;

        const skuInfo = combinations.find(
          (sku) =>
            sku.sku_name === skuName ||
            sku.sku === skuName ||
            sku.name === skuName
        );

        return {
          SKU: removeDescription(skuName),
          Level: selectedNode?.name || selectedProduct || "Preview",
          Location: selectedLocation,
          Description: removeSKU(getSkuDescription(skuItem, skuInfo)),
          Model: isBestModelMode
            ? (modelBlock.model || skuItem.top_model_name || "Best Model")
            : (modelBlock.model_name || modelBlock.model || modelToMatch),
          "Train WMAPE": isBestModelMode
            ? (modelBlock.train_mape || modelBlock.train_wmape || 0)
            : (modelBlock.train_wmape || 0),
          "Test WMAPE": isBestModelMode
            ? (modelBlock.test_mape || modelBlock.test_wmape || 0)
            : (modelBlock.test_wmape || 0),
        };
      })
      .filter(Boolean);

    if (!excelRows.length) {
      console.log("❌ No rows for Report2", {
        isBestModelMode,
        selectedModel,
        bestModel,
        modelToMatch,
        selectedSkuData,
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MAPE_Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      blob,
      `${selectedNode?.name || selectedProduct || "Preview"}_${selectedLocation}_${selectedModel || bestModel || "ARIMAX"}_Report2.xlsx`
    );
  };

  // Parse category/subcategory from combination path
  const parseCategoryInfo = (combination, skuName) => {
    if (!combination) return { category: "-", subcategory: "-" };

    // Remove SKU name from end and split by backslash
    const cleanPath = combination.replace(skuName, '').replace(/\\+$/, '');
    const parts = cleanPath.split('\\').filter(Boolean);

    // Structure: ['Hindware', 'Faucet', 'MFG_Faucet', 'BIB COCK', '2in1']
    if (parts.length >= 4) {
      return {
        category: parts[3],    // BIB COCK
        subcategory: parts[4]  // 2in1, Long Body, etc.
      };
    }

    return { category: parts[2] || "-", subcategory: parts[3] || "-" };
  };
  const downloadReport3 = () => {
    const isBestModelMode = activeModel === "bestModel";
    const dataSource = isBestModelMode ? bestForecasteData : multipleForecastData;
    const cityData = getCityData(dataSource);
    if (!cityData) return;

    const selectedSkuData = getSelectedSkuRows(cityData);
    if (!selectedSkuData.length) return;

    const allPeriods = new Set();

    selectedSkuData.forEach((skuItem) => {
      let modelRows = [];

      if (isBestModelMode) {
        modelRows = skuItem.data || [];
      } else {
        const modelBlock = skuItem.multiple_model_data?.find((model) => {
          const modelName = model.model_name || model.model;
          return modelName === activeModel;
        });
        modelRows = modelBlock?.data || [];
      }

      modelRows.forEach((row) => {
        if (row.frequency_year) allPeriods.add(row.frequency_year);
      });
    });

    const sortedPeriods = Array.from(allPeriods).sort((a, b) => {
      const [am, ay] = String(a).split("-");
      const [bm, by] = String(b).split("-");
      return new Date(`${ay}-${am}-01`) - new Date(`${by}-${bm}-01`);
    });

    const headerRow1 = [
      "SKU",
      "Description",
      "Category",
      "Subcategory",
      "Model",
      "Range",
      "ASP(₹)",
    ];
    const headerRow2 = ["", "", "", "", "", "", ""];

    sortedPeriods.forEach((period) => {
      headerRow1.push(`(${period})`, "");
      headerRow2.push("Forecasted Qty", "Value (L)");
    });

    headerRow1.push("Total Forecasted QTY");
    headerRow2.push("");

    const bodyRows = selectedSkuData.map((skuItem) => {
      const skuName = getSkuName(skuItem);

      const skuInfo = combinations.find(
        (sku) =>
          sku.sku_name === skuName ||
          sku.sku === skuName ||
          sku.name === skuName
      );

      let modelRows = [];
      let modelName = activeModel;

      if (isBestModelMode) {
        modelRows = skuItem.data || [];
        modelName = skuItem?.top_model_name || "Best Model";
      } else {
        const modelBlock = skuItem.multiple_model_data?.find((model) => {
          const name = model.model_name || model.model;
          return name === activeModel;
        });
        modelRows = modelBlock?.data || [];
        modelName = modelBlock?.model_name || modelBlock?.model || activeModel;
      }

      const combinationInfo = skuInfo?.combination
        ? parseCategoryInfo(skuInfo.combination, skuName)
        : { category: "-", subcategory: "-" };

      const asp = zeroIfNegative(
        modelRows?.[0]?.asp ??
        skuItem?.data?.[0]?.asp ??
        0
      );

      const range =
        modelRows?.find((row) => row?.range)?.range ??
        skuItem?.data?.find((row) => row?.range)?.range ??
        "-";

      let totalQty = 0;

      const row = [
        removeDescription(skuName),
        removeSKU(getSkuDescription(skuItem, skuInfo)),
        combinationInfo.category || "-",
        combinationInfo.subcategory || "-",
        modelName,
        range,
        Math.trunc(Number(asp || 0)),
      ];

      sortedPeriods.forEach((period) => {
        const periodRow = modelRows.find((r) => r.frequency_year === period);

        const qty =
          zeroIfNegative(periodRow?.forecast ??
            periodRow?.quantity ??
            periodRow?.qty ??
            0)

        const value = zeroIfNegative(
          periodRow?.value_l ??
          periodRow?.value ??
          ((Number(qty) * Number(asp)) / 100000)
        );

        row.push(Number(qty) || 0);
        row.push(Number(Number(value || 0).toFixed(2)));

        totalQty += Number(qty) || 0;
      });

      row.push(totalQty);

      return row;
    });

    const wsData = [headerRow1, headerRow2, ...bodyRows];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    if (!worksheet["!merges"]) worksheet["!merges"] = [];

    worksheet["!merges"].push(
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // SKU
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Description
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Category
      { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // Subcategory
      { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } }, // Model
      { s: { r: 0, c: 6 }, e: { r: 1, c: 6 } },  // Range
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }, // ASP
    );

    let col = 7;
    sortedPeriods.forEach(() => {
      worksheet["!merges"].push({
        s: { r: 0, c: col },
        e: { r: 0, c: col + 1 },
      });
      col += 2;
    });

    worksheet["!merges"].push({
      s: { r: 0, c: col },
      e: { r: 1, c: col },
    });

    worksheet["!cols"] = [
      { wch: 18 }, // SKU
      { wch: 35 }, // Description
      { wch: 18 }, // Category
      { wch: 20 }, // Subcategory
      { wch: 15 }, // Model
      { wch: 15 }, // Range
      { wch: 12 }, // ASP
      ...sortedPeriods.flatMap(() => [{ wch: 16 }, { wch: 14 }]),
      { wch: 18 }, // Total Forecasted QTY
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Forecast_Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      blob,
      `${selectedNode?.name || selectedProduct || "Preview"}_${selectedLocation}_${activeModel}_Report3.xlsx`
    );
  };

  const handleDownload = (level, item) => {
    const tab = activeTab || "Report1";

    console.log(`Download requested for level ${level}, tab ${tab}`);

    // ✅ ADD THIS BLOCK
    if (graphNode) {
      downloadGraph(); // <-- you are missing this entirely
      return;
    }

    // existing logic stays untouched
    if (tab === "Report1") {
      downloadReport1();
    } else if (tab === "Report2") {
      downloadReport2();
    } else if (tab === "Report3") {
      downloadReport3();
    }
  };


  const downloadGraph = async () => {
    try {
      if (!graphRef.current) {
        console.error("Graph container not found");
        return;
      }

      const canvas = await html2canvas(graphRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");

      pdf.setFontSize(14);
      pdf.text("Forecast Comparison", 14, 15);

      pdf.addImage(imgData, "PNG", 10, 25, 270, 150);

      pdf.save("forecast-graph.pdf");
    } catch (err) {
      console.error("Graph download failed:", err);
    }
  };

  // 🔥 FIXED: handlePreview now properly shows reports immediately
  const handlePreview = (level, item) => {
    console.log("🔥 Preview clicked:", level, item);

    let path;
    if (item.combination) {
      const parts = item.combination.split(/[\\/]/).filter(Boolean);
      path = parts.slice(0, level).join('__');
    } else {
      path = item.path || item.name;
    }
    const node = { ...item, path, level };
    dispatch(setSelectedNode(node));

    // Collect full SKU objects for aggregation
    const skuObjects = collectSkusUnderNode(apiData, node);
    const skuIds = skuObjects.map(sku => sku.sku_id);

    // Set location from available cities in API data (best practice)
    // If no multipleActPredData, use first available city or 'India' as fallback
    let defaultLocation = 'India';
    if (multipleActPredData?.status === "success" && multipleActPredData?.data?.cities?.length > 0) {
      defaultLocation = multipleActPredData.data.cities[0].city;
      console.log("🏙️ Using first available city from API:", defaultLocation);
    } else {
      console.log("⚠️ No cities in multipleActPredData, using fallback 'India'");
    }

    dispatch(setSelectedProductLocation({ product: item.name, location: defaultLocation }));

    console.log("📦 Collected SKUs:", {
      skuObjects: skuObjects.map(s => s.sku_name),
      skuIds,
      level,
      itemName: item.name,
      path,
      location: defaultLocation,
      availableCities: multipleActPredData?.data?.cities?.map(c => c.city) || []
    });

    dispatch(setSelectedSkuIds(skuIds));
    setGraphNode(null);
    console.log("⏳ Setting activeTab to 'Report1' for aggregation");
    setActiveTab("Report1");
    console.log("✅ activeTab set to 'Report1'");
  };

  const handleShowGraph = (item) => {
    setGraphNode(item);
    dispatch(setSelectedNode(null));
  };

  return (
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
      padding: "40px 0",
      minHeight: "100vh",
      boxSizing: "border-box",
    }}>
      <div style={{
        width: "98%",
        maxWidth: "1600px",
        margin: "0 auto",
        background: "#fff",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        border: "1px solid #475C7E",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "120vh",
      }}>
        {/* Main Content */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left Panel - Tree */}
          <div style={{
            width: "360px", flexShrink: 0, borderRight: "1px solid #e5e7eb",
            background: "#fafbfc", display: "flex", flexDirection: "column",
          }}>
            {/* Search */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input
                  type="text"
                  placeholder="Search hierarchy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%", paddingLeft: "32px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px",
                    fontSize: "13px", borderRadius: "6px", border: "1px solid #d1d5db",
                    background: "#fff", outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Tree - 🔥 NOW WORKS WITH FIXED PROPS */}
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 4px" }}>
              {hierarchyLoading ? (
                <div style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  padding: 24,
                  color: "#334155",
                }}>
                  <Loader size={"large"} />
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Loading hierarchy...
                  </div>
                </div>
              ) : (
                <ProductTree
                  combinations={combinations}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                  onShowGraph={handleShowGraph}
                  selectedNode={selectedNode ? {
                    level: selectedNode.level,
                    id: selectedNode[`level${selectedNode.level}_id`]
                  } : null}
                  searchQuery={searchQuery}
                  onChange={onChange}
                />
              )}
            </div>

            {/* Legend */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px", color: "#9ca3af", fontWeight: 600, marginBottom: "8px" }}>
                Levels
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {["Brand", "Product Type", "Source Type", "Category", "Subcategory", "SKU"].map((label, i) => (
                  <span key={i} style={{
                    fontSize: "9px", padding: "2px 6px", borderRadius: "4px",
                    background: "#f3f4f6", color: "#6b7280",
                  }}>
                    L{i + 1} {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Reports */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fff" }}>
            {(selectedNode || graphNode) ? (
              <>
                {/* Report Header */}
                <div style={{
                  background: "linear-gradient(135deg, #021a30 0%, #032B4E 50%, #021a30 100%)",
                  padding: "20px 24px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div>
                    <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, margin: 0, fontFamily: "Poppins, sans-serif" }}>
                      Forecast Comparisons
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: "4px 0 0" }}>
                      {/* 🔥 Show selected node info */}
                      L{selectedNode?.level || "?"}: {selectedNode?.name || "Unknown"}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => {
                        const node = selectedNode || graphNode;
                        if (!node) {
                          console.error("No node available for download");
                          return;
                        }

                        handleDownload(node.level, node);
                      }}
                      style={{
                        background: "#f79658", color: "#fff", border: "none", borderRadius: "6px",
                        padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "6px",
                      }}
                    >
                      <Download size={14} /> Download Report
                    </button>
                    <button
                      onClick={() => setSelectedNode(null)}
                      style={{
                        background: "transparent", border: "none", color: "#fff",
                        cursor: "pointer", padding: "4px",
                      }}
                    >
                    </button>
                  </div>
                </div>

                {/* 🔥 Report Tabs - NOW WORKS */}
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", gap: "12px" }}>
                  {[
                    { key: "Report1", label: "Actual vs Prediction", num: 1 },
                    { key: "Report2", label: "MAPE Report", num: 2 },
                    { key: "Report3", label: "Forecast Report", num: 3 },
                  ].map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "10px 20px", borderRadius: "24px", border: "none",
                          cursor: "pointer", fontWeight: 600, fontSize: "14px",
                          fontFamily: "Poppins, sans-serif",
                          background: isActive
                            ? "linear-gradient(135deg, #021a30 0%, #032B4E 100%)"
                            : "#f3f4f6",
                          color: isActive ? "#fff" : "#374151",
                          boxShadow: isActive ? "0 4px 12px rgba(3, 43, 78, 0.3)" : "none",
                          transition: "all 0.25s ease",
                        }}
                      >
                        <span style={{
                          width: "28px", height: "28px", borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: "13px",
                          background: isActive ? "#f79658" : "#fff",
                          color: "#032B4E", border: "2px solid #f79658",
                        }}>
                          {tab.num}
                        </span>
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Model Selection */}
                <div style={{ padding: "12px 24px", borderBottom: "1px solid #e5e7eb", background: "#fafbfc" }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>
                    📊 Best Model
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => dispatch(setSelectedModel("bestModel"))}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "6px",
                        border:
                          ((selectedModel || bestModel) === "bestModel")
                            ? "2px solid #f79658"
                            : "1px solid #d1d5db",
                        background:
                          ((selectedModel || bestModel) === "bestModel")
                            ? "#f79658"
                            : "#fff",
                        color:
                          ((selectedModel || bestModel) === "bestModel")
                            ? "#fff"
                            : "#374151",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Best Model Result
                    </button>
                  </div>
                </div>
                {/* Model Selection */}
                <div style={{ padding: "12px 24px", borderBottom: "1px solid #e5e7eb", background: "#fafbfc" }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>
                    📊 Available Model Selection
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {models.map((model) => {
                      const isActive = (selectedModel || bestModel) === model;
                      return (
                        <button
                          key={model}
                          onClick={() => {
                            console.log("Model button clicked:", model);
                            dispatch(setSelectedModel(model));
                          }}
                          style={{
                            padding: "8px 18px", borderRadius: "6px",
                            border: isActive ? "2px solid #f79658" : "1px solid #d1d5db",
                            background: isActive ? "#f79658" : "#fff",
                            color: isActive ? "#fff" : "#374151",
                            fontWeight: 700, fontSize: "13px", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: "6px",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {model}
                          {/* {isBest && <span style={{ fontSize: "10px" }}>⭐</span>} */}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🔥 Report Content - PASSES CORRECT PROPS */}
                <div ref={graphRef} style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
                  {graphNode ? (
                    <SkuGraphPanel
                      skuItem={graphNode}
                      onClose={() => setGraphNode(null)}
                      Product={selectedProduct}
                      Location={selectedLocation}
                      bestActPredData={bestActPredData}
                      multipleActPredData={multipleActPredData}
                      selectedModel={selectedModel}
                    />
                  ) : (
                    <>
                      {activeTab === "Report1" && <Report1 />}
                      {activeTab === "Report2" && <Report2 />}
                      {activeTab === "Report3" && <Report3 Workflow={Workflow} />}
                    </>
                  )}
                </div>
              </>
            ) : (
              /* Empty State */
              <div style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ textAlign: "center", maxWidth: "320px" }}>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "16px", background: "#f3f4f6",
                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                  }}>
                    <BarChart3 size={28} color="#9ca3af" />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px", color: "#111" }}>
                    Select a node to preview
                  </h3>
                  <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>
                    Click the 👁 Preview button on any level to view SKU data, or the 📊 Graph button on a SKU to see charts.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
