import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAppSelector } from "../../store/hooks";
import { removeDescription, removeSKU } from "../../Utils/skuDescriptionConverter";

export default function Report2() {
  const Product = useAppSelector((state) => state.workflow.selectedProduct);
  const Location = useAppSelector((state) => state.workflow.selectedLocation);
  const selectedSkuIds = useAppSelector((state) => state.workflow.selectedSkuIds);
  const combinations = useAppSelector((state) => state.workflow.combinations);
  const bestModelData = useAppSelector((state) => state.workflow.bestModelData);
  const multipleModelData = useAppSelector((state) => state.workflow.multipleModelData);
  const selectedModel = useAppSelector((state) => state.workflow.selectedModel);
  const bestModel = useAppSelector(
    (state) => state.workflow.multipleActPredData?.data?.top_model_name?.[0]
  );

  const effectiveModel = selectedModel || bestModel || "ARIMAX";
  const isBestModelMode = selectedModel === "bestModel";

  const [mapeData, setMapeData] = useState([]);
  const [showData, setShowData] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 🔥 PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25); // 25 items per page for this simpler table

  const selectedSkus = useMemo(() => {
    if (!combinations || !selectedSkuIds) return [];
    return combinations.filter((sku) => selectedSkuIds.includes(sku.sku_id));
  }, [combinations, selectedSkuIds]);

  const selectedSkuNames = useMemo(
    () => selectedSkus.map((sku) => sku.sku_name),
    [selectedSkus]
  );

  const skuMap = useMemo(() => {
    return new Map((combinations || []).map((sku) => [sku.sku_name, sku]));
  }, [combinations]);

  // 🔥 PAGINATION HELPER FUNCTION
  const pageButtonStyle = (active) => ({
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    background: active ? "#032341" : "#fff",
    color: active ? "#fff" : "#374151",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: active ? "600" : "400",
    minWidth: 40,
  });

  // 🔥 PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mapeData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mapeData.length / itemsPerPage);

  useEffect(() => {
    console.log("Report2 useEffect triggered", {
      bestModelData: bestModelData?.status,
      multipleModelData: multipleModelData?.status,
      selectedSkuNames: selectedSkuNames.length,
      Location,
      selectedModel,
      effectiveModel,
      selectedSkuIds,
      isBestModelMode,
    });

    if (isBestModelMode) {
      if (
        !bestModelData ||
        bestModelData?.status !== "success" ||
        !selectedSkuNames.length ||
        !Location
      ) {
        console.log("Report2: Early return - missing best model data", {
          bestModelData_status: bestModelData?.status,
          has_location: !!Location,
          selectedSkuNames: selectedSkuNames.length,
        });
        setShowData(false);
        setMapeData([]);
        setCurrentPage(1); // Reset pagination
        return;
      }

      const cityData = bestModelData.data?.cities?.find(
        (city) => city.city === Location
      );

      console.log(
        "Report2 BEST: cityData found",
        !!cityData,
        "cities available:",
        bestModelData.data?.cities?.map((c) => c.city)
      );

      if (!cityData?.data) {
        console.log("Report2 BEST: No city data");
        setShowData(false);
        setMapeData([]);
        setCurrentPage(1); // Reset pagination
        return;
      }

      const matchedSkuData = selectedSkus
        .map((skuNode) => {
          const skuName = skuNode?.sku_name || skuNode?.name;
          const found = cityData.data.find((item) => item.sku === skuName);
          console.log("Report2 BEST: Looking for SKU", skuName, "found:", !!found);
          if (found) {
            console.log(
              "Report2 BEST: SKU data structure:",
              JSON.stringify(found, null, 2)
            );
          }
          return found;
        })
        .filter(Boolean);

      console.log("Report2 BEST: matchedSkuData length", matchedSkuData.length);

      if (!matchedSkuData.length) {
        setShowData(false);
        setMapeData([]);
        setCurrentPage(1); // Reset pagination
        return;
      }

      const data = matchedSkuData
        .map((skuItem) => {
          const bestModelEntry = Array.isArray(skuItem.data) ? skuItem.data[0] : null;

          console.log(
            "Report2 BEST: SKU",
            skuItem.sku,
            "bestModelEntry:",
            bestModelEntry
          );

          if (!bestModelEntry) return null;

          const skuInfo = skuMap.get(skuItem.sku);

          return {
            sku: skuItem.sku,
            description: skuInfo?.description || skuInfo?.sku_name || skuItem.sku,
            model: bestModelEntry.model || "-",
            train_wmape: bestModelEntry.train_mape || bestModelEntry.train_wmape || 0,
            test_wmape: bestModelEntry.test_mape || bestModelEntry.test_wmape || 0,
          };
        })
        .filter(Boolean);

      console.log("Report2 BEST: final data", data);

      setMapeData(data);
      setShowData(data.length > 0);
      setCurrentPage(1); // Reset to first page
      return;
    }

    if (
      !multipleModelData ||
      multipleModelData?.status !== "success" ||
      !selectedSkuNames.length ||
      !Location ||
      !effectiveModel
    ) {
      console.log("Report2: Early return - missing data", {
        multipleModelData_status: multipleModelData?.status,
        has_location: !!Location,
        has_model: !!effectiveModel,
      });
      setShowData(false);
      setMapeData([]);
      setCurrentPage(1); // Reset pagination
      return;
    }

    const cityData = multipleModelData.data?.cities?.find(
      (city) => city.city === Location
    );
    console.log(
      "Report2: cityData found",
      !!cityData,
      "cities available:",
      multipleModelData.data?.cities?.map((c) => c.city)
    );

    if (!cityData?.data) {
      console.log("Report2: No city data");
      setShowData(false);
      setMapeData([]);
      setCurrentPage(1); // Reset pagination
      return;
    }

    const matchedSkuData = selectedSkus
      .map((skuNode) => {
        const skuName = skuNode?.sku_name || skuNode?.name;
        const found = cityData.data.find((item) => item.sku === skuName);
        console.log("Report2: Looking for SKU", skuName, "found:", !!found);
        if (found) {
          console.log(
            "Report2: SKU data structure:",
            JSON.stringify(found, null, 2)
          );
        }
        return found;
      })
      .filter(Boolean);

    console.log("Report2: matchedSkuData length", matchedSkuData.length);

    if (!matchedSkuData.length) {
      setShowData(false);
      setMapeData([]);
      setCurrentPage(1); // Reset pagination
      return;
    }

    const data = matchedSkuData
      .map((skuItem) => {
        const models = skuItem.multiple_model_data || skuItem.data || [];

        let modelData = models.find((m) => {
          const modelName = m.model_name || m.model;
          return modelName === effectiveModel;
        });

        console.log(
          "Report2: SKU",
          skuItem.sku,
          "models found:",
          models.length,
          "modelData for",
          effectiveModel,
          !!modelData
        );
        if (modelData) {
          console.log("Report2: modelData", modelData);
        }

        if (!modelData) return null;

        const skuInfo = skuMap.get(skuItem.sku);
        return {
          sku: skuItem.sku,
          description: skuInfo?.description || skuInfo?.sku_name || skuItem.sku,
          model: modelData.model_name || modelData.model || effectiveModel,
          train_wmape: modelData.train_wmape || 0,
          test_wmape: modelData.test_wmape || 0,
        };
      })
      .filter(Boolean);

    console.log("Report2: final data", data);

    setMapeData(data);
    setShowData(data.length > 0);
    setCurrentPage(1); // Reset to first page
  }, [
    bestModelData,
    multipleModelData,
    selectedSkuNames,
    Location,
    effectiveModel,
    selectedSkus,
    skuMap,
    selectedModel,
    selectedSkuIds,
    isBestModelMode,
  ]);

  const downloadExcel = () => {
    if (!mapeData.length) return;

    setDownloading(true);

    const excelData = mapeData.map((item) => ({
      SKU: item.sku,
      Description: item.description,
      Model: item.model,
      "Train WMAPE": item.train_wmape,
      "Test WMAPE": item.test_wmape,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MAPE_Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${Product}_${Location}_${effectiveModel}_MAPE_Report.xlsx`);

    setTimeout(() => setDownloading(false), 1000);
  };

  if (!showData) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "#6B7280",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
        <p style={{ fontSize: 18, fontWeight: 600, color: "#032B4E" }}>
          No MAPE Data Available
        </p>
        <p style={{ fontSize: 14, marginTop: 8 }}>
          Data not found for {Product} in {Location}
        </p>
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: "#f3f4f6",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "monospace",
            color: "#666",
          }}
        >
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>
            bestModelData: {bestModelData ? "✅ Available" : "❌ Undefined"}
          </p>
          <p>
            multipleModelData: {multipleModelData ? "✅ Available" : "❌ Undefined"}
          </p>
          <p>selectedModel: {selectedModel || "Not set"}</p>
          <p>Location: {Location || "Not set"}</p>
          <p>SKUs: {selectedSkuNames.length}</p>
          <p>Mode: {isBestModelMode ? "Best Model" : "Multiple Model"}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", fontFamily: "Inter, sans-serif" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #d9d9d9",
          borderRadius: 6,
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "70vh",
          marginTop: 16,
          position: "relative",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: 600,
            borderCollapse: "collapse",
            fontFamily: "Inter, sans-serif",
            background: "#fff",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#032341",
                borderBottom: "1px solid #d9d9d9",
              }}
            >
              <th
                style={{
                  padding: "10px 10px",
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  border: "1px solid #e6e6e6",
                }}
              >
                SKU
              </th>
              <th
                style={{
                  padding: "10px 10px",
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  border: "1px solid #e6e6e6",
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  border: "1px solid #e6e6e6",
                }}
              >
                Model
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  border: "1px solid #e6e6e6",
                }}
              >
                Train WMAPE
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  border: "1px solid #e6e6e6",
                }}
              >
                Test WMAPE
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr
                key={item.sku}
                style={{
                  border: idx === currentItems.length - 1 ? "none" : "1px solid #e6e6e6",
                }}
              >
                <td
                  style={{
                    padding: "10px 10px",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#1f2937",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                    border: "1px solid #e6e6e6",
                  }}
                >
                  {removeDescription(item.sku)}
                </td>
                <td
                  style={{
                    padding: "10px 10px",
                    fontSize: 12,
                    lineHeight: 1.2,
                    color: "#707070",
                    textTransform: "uppercase",
                    verticalAlign: "top",
                    minWidth: 110,
                    maxWidth: 140,
                    border: "1px solid #e6e6e6",
                  }}
                >
                  {removeSKU(item.description)}
                </td>
                <td
                  style={{
                    padding: "10px 10px",
                    fontSize: 12,
                    lineHeight: 1.2,
                    color: "#707070",
                    textTransform: "uppercase",
                    verticalAlign: "top",
                    minWidth: 110,
                    maxWidth: 140,
                    border: "1px solid #e6e6e6",
                  }}
                >
                  {item.model}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    fontSize: 13,
                    color: "#222",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    border: "1px solid #e6e6e6",
                  }}
                >
                  {(item.train_wmape || 0).toFixed(2)}%
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    fontSize: 13,
                    color: "#222",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    border: "1px solid #e6e6e6",
                  }}
                >
                  {(item.test_wmape || 0).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 PAGINATION CONTROLS - SAME AS REPORT1 */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            padding: "16px 12px",
            background: "#fff",
            border: "1px solid #d9d9d9",
            borderTop: "none",
            borderRadius: "0 0 6px 6px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              background: currentPage === 1 ? "#f3f4f6" : "#fff",
              color: currentPage === 1 ? "#9ca3af" : "#374151",
              borderRadius: 4,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: 14,
            }}
          >
            Previous
          </button>

          <button
            onClick={() => setCurrentPage(1)}
            style={pageButtonStyle(currentPage === 1)}
          >
            1
          </button>

          {currentPage > 3 && <span style={{ padding: "0 4px" }}>...</span>}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page !== 1 &&
                page !== totalPages &&
                page >= currentPage - 1 &&
                page <= currentPage + 1
            )
            .map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={pageButtonStyle(currentPage === page)}
              >
                {page}
              </button>
            ))}

          {currentPage < totalPages - 2 && (
            <span style={{ padding: "0 4px" }}>...</span>
          )}

          {totalPages > 1 && (
            <button
              onClick={() => setCurrentPage(totalPages)}
              style={pageButtonStyle(currentPage === totalPages)}
            >
              {totalPages}
            </button>
          )}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              background: currentPage === totalPages ? "#f3f4f6" : "#fff",
              color: currentPage === totalPages ? "#9ca3af" : "#374151",
              borderRadius: 4,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: 14,
            }}
          >
            Next
          </button>

          <span style={{ color: "#6B7280", fontSize: 14, marginLeft: 8 }}>
            Page {currentPage} of {totalPages} ({mapeData.length} SKUs)
          </span>
        </div>
      )}
    </div>
  );
}