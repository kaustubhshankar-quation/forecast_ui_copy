import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getSalesPersons } from "../../services/ApiManageWorkflow";
import { displayMessage, zeroIfNegative } from "../../Utils/helper";
import axios from "axios";
import AuthService from "../../services/AuthService";
import { useAppSelector } from '../../store/hooks';
import { removeSKU, removeDescription } from "../../Utils/skuDescriptionConverter";

const { REACT_APP_API_BASE_URL } = process.env;

export default function Report3({ Workflow }) {
  const Product = useAppSelector(state => state.workflow.selectedProduct);
  const Location = useAppSelector(state => state.workflow.selectedLocation);
  const selectedSkuIds = useAppSelector(state => state.workflow.selectedSkuIds);
  const combinations = useAppSelector(state => state.workflow.combinations);
  console.log("combinationsss", combinations);
  const bestForecasteData = useAppSelector(state => state.workflow.bestForecasteData);
  console.log("Report3: bestForecasteData", bestForecasteData);
  const multipleForecastData = useAppSelector(state => state.workflow.multipleForecastData);
  const selectedModel = useAppSelector(state => state.workflow.selectedModel);

  const [forecastData, setForecastData] = useState({ periods: [], skus: [] });
  const [salesPersons, setSalesPersons] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [report3Tab, setReport3Tab] = useState("forecast");
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSkus = forecastData.skus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((forecastData.skus.length || 0) / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const isBestModelMode = selectedModel === "bestModel";

  const selectedSkus = useMemo(() => {
    if (!combinations || !selectedSkuIds) return [];
    return combinations.filter((sku) => selectedSkuIds.includes(sku.sku_id));
  }, [combinations, selectedSkuIds]);

  const selectedSkuNames = useMemo(() => selectedSkus.map((sku) => sku.sku_name), [selectedSkus]);

  const skuMap = useMemo(() => {
    return new Map((combinations || []).map((sku) => [sku.sku_name, sku]));
  }, [combinations]);

  const fetchSalesPersons = useCallback(async (cityname) => {
    const _cityName = capitalizeFirstLetter(cityname);
    const result = await getSalesPersons(_cityName);
    setSalesPersons(result || []);
  }, []);

  useEffect(() => {
    console.log("Report3: useEffect triggered", {
      isBestModelMode,
      bestForecasteData_status: bestForecasteData?.status,
      multipleForecastData_status: multipleForecastData?.status,
      selectedSkuNames_length: selectedSkuNames.length,
      Location,
      selectedModel
    });

    if (isBestModelMode) {
      if (!bestForecasteData || bestForecasteData?.status !== "success" || !selectedSkuNames.length || !Location) {
        console.log("Report3 BEST: Early return - missing data");
        setForecastData({ periods: [], skus: [] });
        return;
      }

      const bestForecastRoot = bestForecasteData.data?.data || bestForecasteData.data;
      const cityData = bestForecastRoot?.cities?.find(city => city.city === Location);
      console.log("Report3 BEST: cityData found:", !!cityData, "cities:", bestForecastRoot?.cities?.map(c => c.city));

      if (!cityData?.data) {
        console.log("Report3 BEST: No city data");
        setForecastData({ periods: [], skus: [] });
        return;
      }

      const matchedSkuData = selectedSkus.map(skuNode => {
        const skuName = skuNode?.sku_name || skuNode?.name;
        return cityData.data.find(item => item.sku === skuName);
      }).filter(Boolean);

      if (!matchedSkuData.length) {
        setForecastData({ periods: [], skus: [] });
        return;
      }

      const allPeriods = new Set();
      matchedSkuData.forEach(skuItem => {
        const rows = skuItem.data || [];
        rows.forEach(row => {
          allPeriods.add(row.frequency_year);
        });
      });

      const sortedPeriods = Array.from(allPeriods).sort((a, b) =>
        String(a).localeCompare(String(b))
      );

      const data = matchedSkuData.map(skuItem => {
        const skuInfo = skuMap.get(skuItem.sku);
        const periodMap = new Map();

        const rows = skuItem.data || [];
        rows.forEach(row => {
          const period = row.frequency_year;
          const forecastValue = Number(row.forecast || row.predicted || 0);
          const range = row.range || "-";
          const aspValue = Number(row.asp || 0);
          periodMap.set(period, { forecast: forecastValue, asp: aspValue, range: range });
        });

        const combinationInfo = skuInfo?.combination
          ? parseCategoryInfo(skuInfo.combination, skuItem.sku)
          : { category: "-", subcategory: "-" };

        return {
          sku: skuItem.sku,
          description: skuInfo?.description || skuInfo?.sku_name || skuItem.sku,
          model: skuItem.top_model_name || "-",
          category: combinationInfo.category,
          subcategory: combinationInfo.subcategory,
          periods: sortedPeriods.map(period => {
            const periodData = periodMap.get(period) || { forecast: 0, asp: 0 };
            return {
              period,
              value: periodData.forecast,
              range: periodData.range,
              asp: periodData.asp,
            };
          })
        };
      });

      setForecastData({ periods: sortedPeriods, skus: data });
      fetchSalesPersons(Location);
      return;
    }

    if (!multipleForecastData || multipleForecastData?.status !== "success" || !selectedSkuNames.length || !Location || !selectedModel) {
      console.log("Report3: Early return - missing data");
      setForecastData({ periods: [], skus: [] });
      return;
    }

    const cityData = multipleForecastData.data?.cities?.find(city => city.city === Location);
    console.log("Report3: cityData found:", !!cityData, "cities:", multipleForecastData.data?.cities?.map(c => c.city));

    if (!cityData?.data) {
      console.log("Report3: No city data");
      setForecastData({ periods: [], skus: [] });
      return;
    }

    const matchedSkuData = selectedSkus.map(skuNode => {
      const skuName = skuNode?.sku_name || skuNode?.name;
      return cityData.data.find(item => item.sku === skuName);
    }).filter(Boolean);

    if (!matchedSkuData.length) {
      setForecastData({ periods: [], skus: [] });
      return;
    }

    const allPeriods = new Set();
    matchedSkuData.forEach(skuItem => {
      const modelData = skuItem.multiple_model_data?.find(model => model.model_name === selectedModel);
      if (modelData?.data) {
        modelData.data.forEach(row => {
          allPeriods.add(row.frequency_year);
        });
      }
    });

    const sortedPeriods = Array.from(allPeriods).sort((a, b) =>
      String(a).localeCompare(String(b))
    );

    const data = matchedSkuData.map(skuItem => {
      const modelData = skuItem.multiple_model_data?.find(model => model.model_name === selectedModel);
      const skuInfo = skuMap.get(skuItem.sku);

      const periodMap = new Map();
      if (modelData?.data) {
        modelData.data.forEach(row => {
          const period = row.frequency_year;
          const forecastValue = Number(row.forecast || row.predicted || 0);
          const range = row.range || "-";
          const aspValue = Number(row.asp || 0);
          periodMap.set(period, { forecast: forecastValue, asp: aspValue, range: range });
        });
      }

      const combinationInfo = skuInfo?.combination
        ? parseCategoryInfo(skuInfo.combination, skuItem.sku)
        : { category: "-", subcategory: "-" };

      return {
        sku: skuItem.sku,
        description: skuInfo?.description || skuInfo?.sku_name || skuItem.sku,
        model: selectedModel,
        category: combinationInfo.category,
        subcategory: combinationInfo.subcategory,
        periods: sortedPeriods.map(period => {
          const periodData = periodMap.get(period) || { forecast: 0, asp: 0, range: 0 };
          return {
            period,
            value: periodData.forecast,
            asp: periodData.asp,
            range: periodData.range
          };
        })
      };
    });

    setForecastData({ periods: sortedPeriods, skus: data });
    fetchSalesPersons(Location);
  }, [bestForecasteData, multipleForecastData, selectedSkuNames, Location, selectedModel, selectedSkus, skuMap, fetchSalesPersons, isBestModelMode]);

  function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function handleSelectMember(e) {
    const sp_id = e.target.value;
    if (!sp_id) return;
    const member = salesPersons.find((p) => p.sp_id === sp_id);
    if (member && !selectedMembers.some((m) => m.sp_id === member.sp_id)) {
      setSelectedMembers([...selectedMembers, member]);
    }
    e.target.value = "";
  }

  function handleRemoveMember(sp_id) {
    setSelectedMembers(selectedMembers.filter((m) => m.sp_id !== sp_id));
  }

  async function handleSendMembers() {
    if (selectedMembers.length === 0) {
      displayMessage(
        "warning",
        "No Members Selected",
        "Please select at least one team member"
      );
      return;
    }

    if (Workflow?.approval_status?.toLowerCase() === "approved") {
      displayMessage("info", "Already Approved", "This workflow is already approved");
      return;
    }

    setIsLoading(true);
    console.log(Workflow);
    try {
      const url = `${REACT_APP_API_BASE_URL}/send_email_f_skus`;
      const sp_ids = selectedMembers.map((member) => member.sp_id);
      const payload = {
        sp_ids: sp_ids,
        workflow_ids: [`${Workflow.workflow_id}`],
        Authorization: AuthService.getAccessToken(),
        access_token: AuthService.getAccessToken(),
      };

      const response = await axios.post(url, payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data.failed === 0) {
        displayMessage(
          "success",
          "Mail Sent Successfully",
          `Sent to ${selectedMembers.length} team member(s)`
        );
      } else {
        displayMessage("danger", "Error", "Failed to send emails");
      }
    } catch (error) {
      console.error("Error sending emails:", error.message);
      displayMessage("danger", "Error", "Failed to send emails. Please try again.");
    }
    setIsLoading(false);
  }

  const forecastAvailable = Array.isArray(forecastData?.skus) && forecastData.skus.length > 0;

  const getActiveTabStyle = (tab) => ({
    padding: "12px 20px",
    borderRadius: 999,
    border: tab === report3Tab ? "2px solid #032B4E" : "1px solid #d1d5db",
    background: tab === report3Tab ? "#032B4E" : "#fff",
    color: tab === report3Tab ? "#fff" : "#032B4E",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
  });

  const parseCategoryInfo = (combination, skuName) => {
    if (!combination) return { category: "-", subcategory: "-" };

    const cleanPath = combination.replace(skuName, '').replace(/\\+$/, '');
    const parts = cleanPath.split('\\').filter(Boolean);

    if (parts.length >= 4) {
      return {
        category: parts[3],
        subcategory: parts[4]
      };
    }

    return { category: parts[2] || "-", subcategory: parts[3] || "-" };
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const stickyHeaderTop = {
    position: "sticky",
    top: 0,
    zIndex: 4,
    background: "#032543",
  };

  const stickyHeaderSecond = {
    position: "sticky",
    top: 44,
    zIndex: 3,
    background: "#032543",
  };

  return (
    <div style={{ padding: "24px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <button style={getActiveTabStyle("forecast")} onClick={() => setReport3Tab("forecast")}>Forecast Report</button>
        <button style={getActiveTabStyle("sales")} onClick={() => setReport3Tab("sales")}>
          Sales Team Assignment
        </button>
      </div>

      {report3Tab === "forecast" ? (
        <div className="space-y-6">
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #d9d9d9",
                borderRadius: 6,
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: "70vh",
                position: "relative",
              }}
            >
              <table
                style={{
                  width: "100%",
                  minWidth: 900,
                  borderCollapse: "collapse",
                  fontFamily: "Inter, sans-serif",
                  background: "#fff",
                }}
              >
                <thead>
                  <tr style={{ background: "#032543", borderBottom: "1px solid #d1d5db" }}>
                    <th style={{ ...thLeft, ...stickyHeaderTop }} rowSpan={2}>SKU</th>
                    <th style={{ ...thLeft, ...stickyHeaderTop }} rowSpan={2}>Description</th>
                    <th style={{ ...thLeft, ...stickyHeaderTop }} rowSpan={2}>Category</th>
                    <th style={{ ...thLeft, ...stickyHeaderTop }} rowSpan={2}>Subcategory</th>
                    <th style={{ ...thModel, ...stickyHeaderTop }} rowSpan={2}>Model</th>
                    <th style={{ ...thASP, ...stickyHeaderTop }} rowSpan={2}>Range</th>
                    <th style={{ ...thASP, ...stickyHeaderTop }} rowSpan={2}>ASP(₹)</th>

                    {forecastData.periods.map((period, idx) => (
                      <React.Fragment key={idx}>
                        <th style={{ ...thCenter, ...stickyHeaderTop }} colSpan={2}>
                          {period}
                        </th>
                      </React.Fragment>
                    ))}

                    <th style={{ ...thCenter, ...stickyHeaderTop }} rowSpan={2}>Total Forecasted QTY</th>
                  </tr>

                  <tr style={{ background: "#032543", borderBottom: "1px solid #d1d5db" }}>
                    {forecastData.periods.map((period, idx) => (
                      <React.Fragment key={`sub-${idx}`}>
                        <th style={{ ...thCenter, ...stickyHeaderSecond }}>Forecasted Qty</th>
                        <th style={{ ...thCenter, ...stickyHeaderSecond }}>Value (L)</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentSkus.map((sku, idx) => {
                    const total = (sku.periods || []).reduce((sum, p) => sum + Number(p.value || 0), 0);
                    const globalIdx = indexOfFirstItem + idx;
                    return (
                      <tr key={sku.sku} style={{ borderBottom: globalIdx === forecastData.skus.length - 1 ? "none" : "1px solid #e6e6e6" }}>
                        <td style={tdSku}>{removeDescription(sku.sku)}</td>
                        <td style={tdDesc}>{removeSKU(sku.description)}</td>
                        <td style={tdDesc}>{sku.category || "-"}</td>
                        <td style={tdDesc}>{sku.subcategory || "-"}</td>
                        <td style={tdDesc}>{sku.model}</td>
                        <td style={tdDesc}>
                          {(sku?.periods?.[0]?.range ?? "-")}
                        </td>
                        <td style={tdDesc}>
                          {Number(sku?.periods?.[0]?.asp ?? 0).toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        {sku.periods.map((periodData, pidx) => (
                          <React.Fragment key={pidx}>
                            <td style={tdValue}>
                              {zeroIfNegative(Number(periodData.value || 0)).toLocaleString()}
                            </td>
                            <td key={`asp-${pidx}`} style={tdValue}>
                              {periodData.asp && periodData.value
                                ? ((periodData.asp * zeroIfNegative(periodData.value)) / 100000).toFixed(2)
                                : "-"}
                            </td>
                          </React.Fragment>
                        ))}

                        <td style={tdTotal}>{total.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {forecastAvailable && totalPages > 1 && (
              <div
                style={{
                  padding: "20px 24px",
                  background: "#f8fafc",
                  borderTop: "1px solid #e2e8f0",
                  position: "relative",
                  minHeight: 72,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: 6,
                      background: currentPage === 1 ? "#f3f4f6" : "#fff",
                      color: currentPage === 1 ? "#9ca3af" : "#032B4E",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Previous
                  </button>

                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {getPageNumbers().map((page, idx) => (
                      <button
                        key={idx}
                        onClick={() => typeof page === "number" && setCurrentPage(page)}
                        disabled={page === "..."}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: 6,
                          background: page === currentPage ? "#032B4E" : "#fff",
                          color: page === currentPage ? "#fff" : "#032B4E",
                          cursor: page === "..." ? "default" : "pointer",
                          fontWeight: page === currentPage ? 700 : 500,
                          opacity: page === "..." ? 0.5 : 1,
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: 6,
                      background: currentPage === totalPages ? "#f3f4f6" : "#fff",
                      color: currentPage === totalPages ? "#9ca3af" : "#032B4E",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Next
                  </button>
                </div>
                <div style={{ color: "#6b7280", fontSize: 14 }}>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, forecastData.skus.length)} of {forecastData.skus.length} SKUs
                </div>
              </div>
            )}

            {!forecastAvailable && (
              <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>
                <p style={{ fontSize: 18, fontWeight: 600, color: "#032B4E" }}>
                  No Forecast Data Available
                </p>
                <p style={{ fontSize: 14, marginTop: 8 }}>
                  Data not found for {Product} in {Location}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "24px 32px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            border: "2px solid #032B4E",
          }}
        >
          <h3
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#0F1116",
              marginBottom: 24,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Sales Team Assignment
          </h3>

          {Workflow?.approval_status?.toLowerCase() === "approved" ? (
            <div
              style={{
                background: "#ecfdf5",
                borderRadius: 12,
                padding: "24px",
                border: "2px solid #86efac",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 32 }}>✅</span>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#15803d",
                  marginTop: 8,
                }}
              >
                Workflow Approved
              </p>
              <p style={{ fontSize: 14, color: "#22c55e", marginTop: 4 }}>
                This workflow has already been approved and processed.
              </p>
            </div>
          ) : (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 12,
                padding: "24px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "20px",
                  border: "2px solid #032B4E",
                  marginBottom: 16,
                }}
              >
                <h4
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#032B4E",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>👥</span> Select Sales Team Member
                </h4>
                <div style={{ position: "relative" }}>
                  <select
                    onChange={handleSelectMember}
                    defaultValue=""
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: "2px solid #e2e8f0",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#032B4E",
                      appearance: "none",
                      cursor: "pointer",
                      background: "#f8fafc",
                    }}
                  >
                    <option value="">Choose a team member...</option>
                    {salesPersons.map((person, index) => (
                      <option key={index} value={person.sp_id}>
                        {person.sp_name}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      right: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#94a3b8",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h5 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: "#0f172a" }}>
                    Selected Members
                  </h5>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {selectedMembers.map((member) => (
                      <span
                        key={member.sp_id}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 12,
                          background: "#eef2ff",
                          color: "#3730a3",
                          fontWeight: 600,
                        }}
                      >
                        {member.sp_name}
                        <button
                          onClick={() => handleRemoveMember(member.sp_id)}
                          style={{
                            marginLeft: 10,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <button
                    onClick={handleSendMembers}
                    disabled={isLoading}
                    style={{
                      background: "#032B4E",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "12px 24px",
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {isLoading ? "Sending..." : "Send Assignment"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div >
  );
}

const thModel = {
  padding: "12px 10px",
  textAlign: "center",
  fontWeight: 700,
  fontSize: 14,
  color: "#fff",
  border: "1px solid #e6e6e6",
};

const thLeft = {
  padding: "12px 14px",
  textAlign: "left",
  fontWeight: 700,
  fontSize: 14,
  color: "#fff",
  border: "1px solid #e6e6e6",
};

const thCenter = {
  padding: "12px 10px",
  textAlign: "center",
  fontWeight: 700,
  fontSize: 14,
  color: "#fff",
  border: "1px solid #e6e6e6",
};

const thASP = {
  padding: "12px 10px",
  textAlign: "center",
  fontWeight: 700,
  color: "#fff",
  fontSize: 14,
  border: "1px solid #e6e6e6",
};

const tdSku = {
  padding: "12px 14px",
  fontWeight: 700,
  color: "#1f2937",
  whiteSpace: "nowrap",
  border: "1px solid #e6e6e6",
};

const tdDesc = {
  padding: "12px 14px",
  color: "#6b7280",
  fontSize: 13,
  maxWidth: 240,
  border: "1px solid #e6e6e6",
};

const tdValue = {
  padding: "12px 10px",
  textAlign: "center",
  color: "#1f2937",
  fontWeight: 500,
  border: "1px solid #e6e6e6",
};

const tdTotal = {
  padding: "12px 14px",
  textAlign: "right",
  fontWeight: 700,
  color: "#d97706",
  border: "1px solid #e6e6e6",
};