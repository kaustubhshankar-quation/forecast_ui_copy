import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { removeDescription, removeSKU } from "../../Utils/skuDescriptionConverter";
import { zeroIfNegative } from "../../Utils/helper";

export default function Report1() {
  const Product = useAppSelector((state) => state.workflow.selectedProduct);
  const Location = useAppSelector((state) => state.workflow.selectedLocation);

  const selectedModel = useAppSelector((state) => state.workflow.selectedModel);
  const selectedSkuIds = useAppSelector((state) => state.workflow.selectedSkuIds);
  const combinations = useAppSelector((state) => state.workflow.combinations);

  const bestActPredData = useAppSelector(
    (state) => state.workflow.bestActPredData
  );
  console.log("bestActPredDataaaaa", bestActPredData);
  const multipleActPredData = useAppSelector(
    (state) => state.workflow.multipleActPredData
  );
  console.log("multipleActPredDataaaaaaaaaa", multipleActPredData);

  const isBestModelMode = selectedModel === "bestModel";

  const dataSource = isBestModelMode
    ? bestActPredData
    : multipleActPredData;

  const skus = useMemo(() => {
    if (!combinations || !selectedSkuIds) return [];
    return combinations.filter((sku) =>
      selectedSkuIds.includes(sku.sku_id)
    );
  }, [combinations, selectedSkuIds]);

  const skuMap = useMemo(() => {
    return new Map((combinations || []).map((sku) => [sku.sku_name, sku]));
  }, [combinations]);

  const levelName = useAppSelector(
    (state) => state.workflow.selectedNode?.name || "Selected Level"
  );

  const [skuSummaryData, setSkuSummaryData] = useState([]);
  const [skuTablePeriods, setSkuTablePeriods] = useState([]);
  const [showChart, setShowChart] = useState(false);

  // 🔥 PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Show 20 SKUs per page

  const selectedModelName = selectedModel;

  // 🔥 FIXED: Correctly extract city data from new structure
  // 🔥 SUPER FIXED: Handles BOTH data structures dynamically
  const cityData = useMemo(() => {
    console.log("🔍 dataSource full structure:", dataSource);

    if (!dataSource || dataSource?.status !== "success") {
      console.log("❌ Invalid dataSource");
      return null;
    }

    let cities = [];

    // 🔥 Try best model structure first: data.data.cities
    if (dataSource.data?.data?.cities) {
      console.log("✅ Using best model structure: data.data.cities");
      cities = dataSource.data.data.cities;
    }
    // 🔥 Try multiple model structure: data.cities  
    else if (dataSource.data?.cities) {
      console.log("✅ Using multiple model structure: data.cities");
      cities = dataSource.data.cities;
    } else {
      console.log("❌ No cities found in either structure", dataSource.data);
      return null;
    }

    console.log("🔍 Cities found:", cities);

    if (!cities.length) {
      console.log("❌ No cities");
      return null;
    }

    const targetCity = Location || cities[0]?.city;
    const foundCity = cities.find((c) => c.city === targetCity);

    console.log("✅ City Found:", foundCity);
    console.log("✅ City data length:", foundCity?.data?.length);

    return foundCity || null;
  }, [dataSource, Location]);

  console.log("SKU from UI:", skus && skus.map(s => s.sku_name));
  console.log("SKU from API:", cityData && cityData?.data?.map(d => d.sku));

  // 🔥 FIXED: Correctly process new nested data structure
  useEffect(() => {
    if (!cityData?.data?.length || !skus.length) {
      console.log("❌ Missing data:", { cityData: !!cityData, skusLength: skus?.length });
      setShowChart(false);
      setSkuSummaryData([]);
      setSkuTablePeriods([]);
      setCurrentPage(1); // Reset pagination
      return;
    }

    try {
      const citySkuList = cityData?.data || [];

      const matchedSkuData = skus
        .map((skuNode) => {
          const skuName = (skuNode?.sku_name || "")
            .toLowerCase()
            .trim();

          return citySkuList.find((item) => {
            const apiSku = (item?.sku || "")
              .toLowerCase()
              .trim();

            return apiSku === skuName;
          });
        })
        .filter(Boolean);

      if (!matchedSkuData.length) {
        setShowChart(false);
        setSkuSummaryData([]);
        setSkuTablePeriods([]);
        setCurrentPage(1); // Reset pagination
        return;
      }

      console.log("Selected Model:", selectedModel);

      const periodSet = new Set();

      // 🔥 FIXED: Handle both data structures correctly
      const skuSummaryRows = matchedSkuData.map((skuItem) => {
        let rows = [];

        if (isBestModelMode) {
          rows = skuItem?.data || [];
        } else {
          const modelBlock = skuItem?.multiple_model_data?.find(
            (model) => model.model_name === selectedModel
          );
          rows = modelBlock?.data || [];
        }

        rows.forEach((row) => periodSet.add(row.frequency_year));

        return {
          sku: skuItem.sku,
          top_model_name: skuItem?.top_model_name || "",
          rows,
        };
      });

      setSkuSummaryData(skuSummaryRows);
      // 🔥 Sort latest month first (descending chronological order)
      const sortedPeriods = Array.from(periodSet).sort((a, b) => {
        const [aMonth, aYear] = a.split("-").map(Number);
        const [bMonth, bYear] = b.split("-").map(Number);
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      }).reverse(); // Reverse for latest first

      setSkuTablePeriods(sortedPeriods);

      // 🔥 FIXED: Aggregation works with new structure
      const periodMap = new Map();

      matchedSkuData.forEach((skuItem) => {
        let modelRows = [];

        if (isBestModelMode) {
          // ✅ BEST MODEL → direct rows
          modelRows = skuItem?.data || [];
        } else {
          // ✅ MULTIPLE MODEL → selected model's data array
          const modelBlock = skuItem?.multiple_model_data?.find(
            (model) => model.model_name === selectedModel
          );
          modelRows = modelBlock?.data || [];
        }

        modelRows.forEach((row) => {
          const period = row.frequency_year;

          if (!periodMap.has(period)) {
            periodMap.set(period, {
              period,
              actual: 0,
              predicted: 0,
              skuCount: 0,
            });
          }

          const existing = periodMap.get(period);
          existing.actual += Number(row.actual || 0);
          existing.predicted += Number(row.predicted || 0);
          existing.skuCount += 1;
        });
      });

      const aggregated = Array.from(periodMap.values());

      if (!aggregated.length) {
        setShowChart(false);
        return;
      }

      setShowChart(true);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      console.error("Error in Report1 aggregation:", error);
      setShowChart(false);
      setSkuSummaryData([]);
      setSkuTablePeriods([]);
      setCurrentPage(1); // Reset pagination
    }
  }, [cityData, skus, selectedModel, isBestModelMode]);

  // 🔥 PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSkus = skuSummaryData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(skuSummaryData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!showChart) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "#6B7280",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>📈</div>
        <p style={{ fontSize: 18, fontWeight: 600, color: "#032B4E" }}>
          No Actual vs Predicted Data
        </p>
        <p style={{ fontSize: 14, marginTop: 8 }}>
          Data not found for {levelName || Product} in {Location}
        </p>
      </div>
    );
  }

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return Number(value).toLocaleString();
  };

  const pageButtonStyle = (active) => ({
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    background: active ? "#022646" : "#fff",
    color: active ? "#fff" : "#374151",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: active ? "600" : "400",
    minWidth: 40,
  });

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* 🔥 TABLE WITH FIXED HEIGHT */}
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
            minWidth: 1400,
            borderCollapse: "collapse",
            fontFamily: "Inter, sans-serif",
            background: "#fff",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#022646",
                borderBottom: "1px solid #d9d9d9",
              }}
            >
              <th style={headerCellLeft}>SKU</th>
              <th style={headerCellLeft}>Description</th>
              <th style={headerCellLeft}>Model</th>
              <th style={headerCellLeft}>Type</th>
              {skuTablePeriods
                .filter((p) => {
                  const sampleRow = skuSummaryData?.[0]?.rows?.find((r) => r.frequency_year === p);
                  return sampleRow?.ftype !== "forecast_forecast";
                })
                .map((period, idx) => (  // 🔥 Use idx instead of period for key
                  <th key={`header-${idx}`} style={headerCellCenter}>
                    {period}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {currentSkus.map((item, skuIndex) => {  // 🔥 Only render current page SKUs
              const normalRows = item.rows.filter((r) => r.ftype !== "forecast_forecast");
              const forecastRows = item.rows.filter((r) => r.ftype === "forecast_forecast");

              const skuInfo = skuMap.get(item.sku);
              const skuCode = skuInfo?.sku_code || skuInfo?.sku_name || skuInfo?.name || item.sku;
              const modelLabel = selectedModel === "bestModel"
                ? item.top_model_name || "Best Model"
                : selectedModel;

              return (
                <React.Fragment key={item.sku}>
                  {/* Actual row */}
                  <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
                    <td rowSpan={4} style={skuCellStyle}>
                      {removeDescription(skuCode)}
                    </td>
                    <td rowSpan={4} style={descCellStyle}>
                      {removeSKU(skuCode)}
                    </td>
                    <td rowSpan={4} style={descCellStyle}>
                      {modelLabel}
                    </td>
                    <td style={typeCellStyle}>
                      <span style={{ color: "#2f67d8", fontWeight: 600 }}>Actual</span>
                    </td>

                    {/* 🔥 Use skuTablePeriods for consistent ordering */}
                    {skuTablePeriods
                      .filter((p) => {
                        const row = normalRows.find((r) => r.frequency_year === p);
                        return row && row.ftype !== "forecast_forecast";
                      })
                      .map((period, i) => {
                        const row = normalRows.find((r) => r.frequency_year === period);
                        return (
                          <td key={`actual-${period}`} style={valueCellStyle}>
                            {formatNumber(row?.actual || 0)}
                          </td>
                        );
                      })}
                  </tr>

                  {/* Predicted row */}
                  <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
                    <td style={typeCellStyle}>
                      <span style={{ color: "#2ca24f", fontWeight: 600 }}>Predicted</span>
                    </td>

                    {skuTablePeriods
                      .filter((p) => {
                        const row = normalRows.find((r) => r.frequency_year === p);
                        return row && row.ftype !== "forecast_forecast";
                      })
                      .map((period, i) => {
                        const row = normalRows.find((r) => r.frequency_year === period);
                        return (
                          <td key={`predicted-${period}`} style={valueCellStyle}>
                            {formatNumber(zeroIfNegative(row?.predicted || 0))}
                          </td>
                        );
                      })}
                  </tr>

                  {/* Rest of your forecast rows remain the same */}
                  <tr style={{ borderBottom: "1px solid #f0e1d8" }}>
                    <td
                      style={{
                        ...typeCellStyle,
                        background: "#fdf1ec",
                      }}
                      rowSpan={2}
                    >
                      <span style={{ color: "#7a35c8", fontWeight: 600 }}>Forecasted</span>
                    </td>
                    {forecastRows.map((row, i) => (
                      <td
                        key={`fm-${i}`}
                        style={{
                          ...forecastMonthCellStyle,
                          background: "#fdf1ec",
                        }}
                      >
                        {row.frequency_year}
                      </td>
                    ))}
                  </tr>

                  <tr
                    style={{
                      borderBottom:
                        skuIndex === currentSkus.length - 1 ? "none" : "1px solid #d9d9d9",
                    }}
                  >
                    {forecastRows.map((row, i) => (
                      <td
                        key={`fv-${i}`}
                        style={{
                          ...forecastValueCellStyle,
                          background: "#fffaf7",
                        }}
                      >
                        {formatNumber(zeroIfNegative(row.predicted))}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🔥 PAGINATION CONTROLS */}
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
            Page {currentPage} of {totalPages} ({skuSummaryData.length} SKUs)
          </span>
        </div>
      )}
    </div>
  );
}

// 🔥 STYLES (unchanged)
const headerCellLeft = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  background: "#022646",
  color: "#fff",
  textAlign: "left",
  padding: "10px 12px",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #d9d9d9",
};

const headerCellCenter = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  background: "#022646",
  color: "#fff",
  textAlign: "center",
  padding: "10px 12px",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #d9d9d9",
};

const skuCellStyle = {
  padding: "10px 10px",
  fontSize: 15,
  fontWeight: 500,
  color: "#1f2937",
  verticalAlign: "top",
  whiteSpace: "nowrap",
  borderRight: "1px solid #efefef",
};

const descCellStyle = {
  padding: "10px 10px",
  fontSize: 12,
  lineHeight: 1.2,
  color: "#707070",
  textTransform: "uppercase",
  verticalAlign: "top",
  minWidth: 110,
  maxWidth: 140,
  borderRight: "1px solid #efefef",
};

const typeCellStyle = {
  padding: "7px 10px",
  fontSize: 13,
  textAlign: "left",
  whiteSpace: "nowrap",
  minWidth: 90,
  borderRight: "1px solid #efefef",
};

const valueCellStyle = {
  padding: "7px 12px",
  fontSize: 13,
  color: "#222",
  textAlign: "center",
  whiteSpace: "nowrap",
  border: "1px solid #efefef",
};

const forecastMonthCellStyle = {
  padding: "7px 12px",
  fontSize: 13,
  color: "#333",
  textAlign: "center",
  whiteSpace: "nowrap",
  fontWeight: 600,
  border: "1px solid #efefef",
};

const forecastValueCellStyle = {
  padding: "7px 12px",
  fontSize: 13,
  color: "#222",
  textAlign: "center",
  whiteSpace: "nowrap",
  fontWeight: 700,
  border: "1px solid #efefef",
};