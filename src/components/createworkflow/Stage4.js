import React, { useState, useEffect, useContext } from "react";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { useFormContext } from "./FormContext";
import { stage4PreparePayload, Stage4TablePrep } from "./helper";
import { fetchDataAvailability } from "../../services/ApiWorkflow";
import Loader from "../common/Loader";
import { getCookie } from "../../services/DataRequestService";
import MenuContext from "./MenuContext";

const styles = {
  wrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
    padding: "60px 0",
    boxSizing: "border-box",
  },
  card: {
    width: "95%",
    maxWidth: 1500,
    background: "#fbfcf7ff",
    padding: "40px 40px 60px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    border: "1px solid #475C7E",
    overflow: "hidden",
  },
};

export default function Stage4() {
  const { formData, setFormData, updateFormData } = useFormContext();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const { setActiveTab } = useContext(MenuContext);

  const falseCondition =
    !!formData?.stage3?.products && !!formData?.stage3?.geography;

  /* -------------------- SINGLE ID GENERATOR -------------------- */

  const buildId = (skuBreadcrumb, geoBreadcrumb) => {
    const sku = skuBreadcrumb.split("\\").pop();
    return `${sku}__${geoBreadcrumb}`;
  };

  /* ------------------------------------------------------------- */

  const isCachedTableDataValid = (data) => {
    try {
      if (!Array.isArray(data)) return false;

      return data.every(
        (row) =>
          row &&
          typeof row === "object" &&
          typeof row.skuBreadcrumb === "string" &&
          row.skuBreadcrumb.includes("\\") &&
          row.sku &&
          typeof row.sku === "object" &&
          row.sku.sku_name &&
          row.geoBreadcrumb &&
          row.geography
      );
    } catch {
      return false;
    }
  };

  /* -------------------- SELECT ALL SYNC -------------------- */

  useEffect(() => {
    const filteredData = tableData.filter((row) => {
      const total_rows =
        Number(row.train_data_available || 0) +
        Number(row.test_data_available || 0);

      const { data_sufficiency_score } = getThreshold(
        formData.stage2.data_frequency,
        formData.stage2.forecast_frequency,
        total_rows
      );

      const status = getDerivedStatus(data_sufficiency_score);

      if (filter === "sufficient") return status === "sufficient";
      if (filter === "insufficient") return status === "insufficient";
      return true;
    });

    const allFilteredIds = filteredData.map((row) =>
      buildId(row.skuBreadcrumb, row.geoBreadcrumb)
    );

    const allSelected = allFilteredIds.every((id) =>
      formData.stage4.combinations.some((combo) => combo.id === id)
    );

    setSelectAllChecked(allSelected);
  }, [tableData, formData.stage4.combinations, filter]);

  /* ---------------------------------------------------------- */

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const storedData = localStorage.getItem(
          getCookie("sub") + "tableData"
        );

        let parsedStoredData = null;
        let cacheValid = false;

        if (storedData) {
          try {
            parsedStoredData = JSON.parse(storedData);
            cacheValid = isCachedTableDataValid(parsedStoredData);
          } catch {
            cacheValid = false;
          }
        }

        const needRefresh = !storedData || !cacheValid || isStage3Changed();

        if (needRefresh) {
          const payload = await stage4PreparePayload(formData);
          const result = await fetchDataAvailability(payload);

          if (result) {
            const data = await Stage4TablePrep(result);
            setTableData(data);

            localStorage.setItem(
              getCookie("sub") + "tableData",
              JSON.stringify(data)
            );

            localStorage.setItem(
              getCookie("sub") + "stage3Meta",
              JSON.stringify({
                products: formData?.stage3?.products,
                geography: formData?.stage3?.geography,
              })
            );
          }
        } else {
          setTableData(parsedStoredData);
        }
      } catch (error) {
        console.error("Error loading table data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (falseCondition) init();
  }, [falseCondition]);

  const isStage3Changed = () => {
    try {
      const storedMeta = localStorage.getItem(
        getCookie("sub") + "stage3Meta"
      );

      const currentMeta = JSON.stringify({
        products: formData?.stage3?.products,
        geography: formData?.stage3?.geography,
      });

      return storedMeta !== currentMeta;
    } catch {
      return true;
    }
  };

  /* -------------------- THRESHOLD -------------------- */

  const getThreshold = (data_frequency, forecast_frequency, total_rows) => {
  const baseMap = {
    Daily: { train: 90, test: 15 },
    Weekly: { train: 32, test: 12 },
    Monthly: { train: 18, test: 5 },
    Quarterly: { train: 8, test: 2 },
  };

  let train_threshold = 0;
  let test_threshold = 0;
  let target_points = 0;

  if (data_frequency === "Transaction") {
    const t = baseMap[forecast_frequency];
    if (t) {
      train_threshold = t.train;
      test_threshold = t.test;
      target_points = t.train + t.test;
    }
  } else {
    const t = baseMap[data_frequency];
    if (t) {
      train_threshold = t.train;
      test_threshold = t.test;
      target_points = t.train + t.test;
    }
  }

  const rows = Number(total_rows);

  const data_sufficiency_score =
    Number.isFinite(rows) && target_points > 0
      ? Math.round((rows / target_points) * 100)
      : 0;

  return { train_threshold, test_threshold, data_sufficiency_score };
};

const stats = tableData.reduce(
  (acc, row) => {
    const total_rows =
      Number(row?.train_data_available ?? 0) +
      Number(row?.test_data_available ?? 0);

    const { data_sufficiency_score } = getThreshold(
      formData?.stage2?.data_frequency,
      formData?.stage2?.forecast_frequency,
      total_rows
    );

    const score = Number(data_sufficiency_score ?? 0);

    if (score >= 100) acc.valid += 1;
    else if (score >= 60) acc.review += 1;
    else acc.insufficient += 1;

    return acc;
  },
  { valid: 0, review: 0, insufficient: 0 }
);


  /* -------------------- CHECKBOX -------------------- */

  const handleCheckboxChange = (e) => {
    const { checked, dataset } = e.target;

    const id = dataset.id;
    const valueSku = JSON.parse(dataset.sku);
    const valueGeography = JSON.parse(dataset.geography);

    setFormData((prev) => {
      let updated = [...(prev.stage4?.combinations || [])];

      if (checked) {
        if (!updated.some((c) => c.id === id)) {
          updated.push({
            id,
            sku: valueSku,
            geography: valueGeography,
          });
        }
      } else {
        updated = updated.filter((c) => c.id !== id);
      }

      return {
        ...prev,
        stage4: {
          ...prev.stage4,
          combinations: updated,
        },
      };
    });
  };

  /* -------------------- SELECT ALL -------------------- */

  const toggleSelectAll = () => {
    const filteredData = tableData.filter((row) => {
      const total_rows =
        Number(row.train_data_available || 0) +
        Number(row.test_data_available || 0);

      const { data_sufficiency_score } = getThreshold(
        formData.stage2.data_frequency,
        formData.stage2.forecast_frequency,
        total_rows
      );

      const status = getDerivedStatus(data_sufficiency_score);

      if (filter === "sufficient") return status === "Excellent";
      if (filter === "insufficient") return status === "Insufficient";
      return true;
    });

    const filteredIds = filteredData.map((row) =>
      buildId(row.skuBreadcrumb, row.geoBreadcrumb)
    );

    if (!selectAllChecked) {
      const newCombos = filteredData.map((row) => ({
        id: buildId(row.skuBreadcrumb, row.geoBreadcrumb),
        sku: row.sku,
        geography: row.geography,
      }));

      const merged = [
        ...formData.stage4.combinations,
        ...newCombos,
      ].reduce((acc, item) => {
        if (!acc.some((x) => x.id === item.id)) acc.push(item);
        return acc;
      }, []);

      updateFormData("stage4", {
        ...formData.stage4,
        combinations: merged,
      });
    } else {
      const remaining = formData.stage4.combinations.filter(
        (combo) => !filteredIds.includes(combo.id)
      );

      updateFormData("stage4", {
        ...formData.stage4,
        combinations: remaining,
      });
    }

    setSelectAllChecked(!selectAllChecked);
  };

  /* -------------------- STATUS -------------------- */

  const getDerivedStatus = (score) => {
    return score >= 100 ? "Sufficient" : "Insufficient";
  };



  /* -------------------- UI (UNCHANGED) -------------------- */

  return (
    <ErrorBoundary>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          {/* Progress Indicator */}
          <div className="flex items-center justify-start mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center rounded-full ${step === 4 ? 'bg-[#032B4E] text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  style={{
                    width: '36px',
                    height: '36px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    border: step === 4 ? '2px solid #032B4E' : '2px solid #d1d5db'
                  }}
                >
                  {step}
                </div>
                {index < 6 && (
                  <div
                    className={`h-0.5 ${step < 4 ? 'bg-[#032B4E]' : 'bg-gray-300'}`}
                    style={{ width: '40px' }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <h2 className="text-[30px] text-[#0F1116] text-left mb-8" style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}>
            Step 4: Data Validation
          </h2>

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-8">
            {[
              { id: "all", label: "Show All", color: "#202b70", bg: "#E3F2F8" },
              { id: "sufficient", label: "Show Only Sufficient", color: "#0E7C53", bg: "#E3FCEF" },
              { id: "insufficient", label: "Show Only Insufficient", color: "#D18A00", bg: "#FFF8E1" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                style={{
                  backgroundColor: filter === btn.id ? btn.color : btn.bg,
                  color: filter === btn.id ? "#ffffff" : btn.color,
                  boxShadow:
                    filter === btn.id
                      ? "0 4px 10px rgba(0,0,0,0.2)"
                      : "0 2px 6px rgba(0,0,0,0.1)",
                  border: `1px solid ${btn.color}`,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600
                }}
                className="px-6 py-2 rounded-md transition-all duration-200"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-hidden">
            <div className="bg-white border-2 border-[#475C7E] rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1.5">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader size="large" />
                </div>
              ) : falseCondition ? (
                <div className="overflow-auto max-h-[500px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#032B4E] text-white sticky top-0 z-10">
                      <tr>
                        <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Sl No</th>
                        <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>SKU</th>
                        <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Geography</th>
                        <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Train Threshold</th>
                        <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Train Data Available</th>
                        <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Test Threshold</th>
                        <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Test Data Available</th>
                        <th className="py-3 px-4 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Data Sufficiency Score</th>
                        {/* ✅ NEW: Select All Header */}
                        <th className="py-3 px-4 text-center text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={selectAllChecked}
                            onChange={toggleSelectAll}
                            className="accent-[#202b70] w-6 h-6 cursor-pointer"
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData
                        .filter((row) => {
                          const total_rows =
                            Number(row.train_data_available || 0) +
                            Number(row.test_data_available || 0);

                          const { data_sufficiency_score } = getThreshold(
                            formData.stage2.data_frequency,
                            formData.stage2.forecast_frequency,
                            total_rows
                          );

                          const status = getDerivedStatus(data_sufficiency_score);

                          if (filter === "sufficient") return status === "Excellent";
                          if (filter === "insufficient") return status === "Insufficient";
                          return true;
                        })
                        .map((row, index) => {
                          const total_rows =
                            Number(row.train_data_available || 0) +
                            Number(row.test_data_available || 0);

                          const threshold = getThreshold(
                            formData.stage2.data_frequency,
                            formData.stage2.forecast_frequency,
                            total_rows
                          );

                          const isTrainMet = threshold.train_threshold <= row.train_data_available;
                          const isTestMet = threshold.test_threshold <= row.test_data_available;

                          return (
                            <tr key={`${row.skuBreadcrumb}-${row.geoBreadcrumb}`}
                              className="border-b border-[#e5e7eb] hover:bg-[#f8faff] transition-all duration-200"
                            >
                              <td
                                className="py-4 px-6 text-gray-900 text-[14px]"
                                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                              >
                                {index + 1}
                              </td>

                              <td
                                className="py-4 px-6 text-gray-900 text-[14px]"
                                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                              >
                                {row?.sku?.sku_name || "-"}
                              </td>

                              <td
                                className="py-4 px-6 text-gray-700 text-[14px]"
                                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                              >
                                {row.geoBreadcrumb}
                              </td>
                              <td className="py-4 px-6 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>{threshold.train_threshold}</td>
                              <td className={`py-4 px-6 text-[14px] ${!isTrainMet ? "text-red-600" : "text-green-700"}`} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                                {row.train_data_available}
                              </td>
                              <td className="py-4 px-6 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>{threshold.test_threshold}</td>
                              <td className={`py-4 px-6 text-[14px] ${!isTestMet ? "text-red-600" : "text-green-700"}`} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                                {row.test_data_available}
                              </td>
                              {/* <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                      <div
                                        className={`h-2 rounded-full ${(threshold.data_sufficiency_score || 95) >= 85
                                          ? "bg-green-500"
                                          : (threshold.data_sufficiency_score || 95) >= 60
                                            ? "bg-yellow-400"
                                            : "bg-red-500"
                                          }`}
                                        style={{ width: `${threshold.data_sufficiency_score || 95}%` }}
                                      ></div>
                                    </div>
                                    <span
                                      className={`text-[14px] ${(threshold.data_sufficiency_score || 95) >= 85
                                        ? "text-green-600"
                                        : (threshold.data_sufficiency_score || 95) >= 60
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                        }`}
                                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                                    >
                                      {threshold.data_sufficiency_score || 95}%
                                    </span>
                                  </div>
                                </td> */}
                              <td className="py-4 px-6">
                                {(() => {
                                  const status = getDerivedStatus(threshold.data_sufficiency_score);

                                  return (
                                    <span
                                      className={`text-[14px] px-3 py-1 rounded-full ${status === "Sufficient"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                        }`}
                                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                                    >
                                      {status}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <input
                                  type="checkbox"
                                  data-id={buildId(row.skuBreadcrumb, row.geoBreadcrumb)}
                                  data-sku={JSON.stringify(row.sku, null, 2)}
                                  data-geography={JSON.stringify(row.geography, null, 2)}
                                  checked={
                                    formData.stage4.combinations.some(
                                      (item) => item.id === buildId(row.skuBreadcrumb, row.geoBreadcrumb)
                                    )
                                  }
                                  onChange={handleCheckboxChange}
                                  className="accent-[#202b70] w-5 h-5"
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center py-20 text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-xl font-semibold">No data available</p>
                    <p className="text-sm mt-2">Please complete Stage 3 first</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex justify-start items-center mt-6 text-gray-800">
            <div className="flex gap-3">
              {[
                { icon: "✅", text: `${stats.valid} Valid`, color: "text-green-700 bg-green-100" },
                { icon: "🕓", text: `${stats.review} Require Review`, color: "text-yellow-700 bg-yellow-100" },
                { icon: "⚠️", text: `${stats.insufficient} Insufficient`, color: "text-red-700 bg-red-100" },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md shadow-sm ${s.color}`}
                >
                  <span className="text-[14px]">{s.icon}</span>
                  <span className="text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
            <button
              onClick={() => setActiveTab("Stage3")}
              className="px-8 py-2.5 bg-[#b8842f] hover:bg-[#a67d2e] text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
            >
              ← Back
            </button>

            <button
              onClick={() => setActiveTab("Stage5")}
              className="px-8 py-2.5 rounded-lg bg-[#b8842f] text-white hover:bg-[#a67d2e] shadow-lg hover:shadow-xl flex items-center gap-2 transition-all"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}