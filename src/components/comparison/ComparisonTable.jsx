import axios from "axios";
import React, { useEffect, useState } from "react";
import { displayMessage, zeroIfNegative } from "../../Utils/helper";
import { useLocation, Link } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import Banner from "./Banner";
import Loader from "../common/Loader";
import AuthService from "../../services/AuthService";
import { removeSKU, removeDescription } from "../../Utils/skuDescriptionConverter";
const { REACT_APP_API_BASE_URL } = process.env;

const ComparisonTable = () => {
  const location = useLocation();
  const { workflow } = location.state || {};

  // 1️⃣ workflow id from query or state
  const searchParams = new URLSearchParams(location.search);
  const workflowIdFromQuery = searchParams.get("workflow_id");
  const workflow_id = workflowIdFromQuery || workflow?.workflow_id;

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSalesPerson, setSelectedSalesPerson] = useState("");

  const [tableData, setTableData] = useState([]);
  const [cities, setCities] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);

  const [filteredCityData, setFilteredCityData] = useState([]);
  const [allWeeks, setAllWeeks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (!workflow_id) {
      displayMessage("danger", "Workflow ID missing in URL.");
      return;
    }
    getComparisonTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow_id]);

  const getComparisonTable = async () => {
    setIsLoading(true);
    try {
      const url = `${REACT_APP_API_BASE_URL}/get_fp?workflow_id=${workflow_id}`;
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: AuthService.getAccessToken(),
          access_token: AuthService.getAccessToken(),
        },
      });

      const data = response.data.data || [];
      setTableData(data);

      // const uniqueCities = [...new Set(data.map((entry) => entry.level5))];
      // setCities(uniqueCities);

      // const allSpNames = [
      //   ...new Set(
      //     data
      //       .flatMap((entry) => entry.skus_data || [])
      //       .map((sku) => sku.sp_name)
      //       .filter((n) => n && n.trim() !== "")
      //   ),
      // ];
      // setSalesPersons(allSpNames);

      const uniqueCities = [...new Set(data.map((entry) => entry.level5))];
      setCities(uniqueCities);

      // 👇 auto select first city
      if (uniqueCities.length > 0) {
        setSelectedCity(uniqueCities[0]);
      }

      const allSpNames = [
        ...new Set(
          data
            .flatMap((entry) => entry.skus_data || [])
            .map((sku) => sku.sp_name)
            .filter((n) => n && n.trim() !== "")
        ),
      ];

      setSalesPersons(allSpNames);

      // 👇 auto select first salesperson (optional)
      if (allSpNames.length > 0) {
        setSelectedSalesPerson(allSpNames[0]);
      }
    } catch (error) {
      console.error("Error fetching workflows:", error.message);
      displayMessage("danger", "Error fetching workflow comparison data");
    }
    setIsLoading(false);
  };

  // whenever city or salesperson changes, recompute filteredCityData/allWeeks/editedData
  useEffect(() => {
    if (!selectedCity) {
      setFilteredCityData([]);
      setAllWeeks([]);
      setEditedData([]);
      return;
    }

    const cityData = tableData.find((entry) => entry.level5 === selectedCity);
    if (!cityData) {
      setFilteredCityData([]);
      setAllWeeks([]);
      setEditedData([]);
      return;
    }

    const skusForFilter = selectedSalesPerson
      ? cityData.skus_data.filter((s) => s.sp_name === selectedSalesPerson)
      : cityData.skus_data;

    const groupedData = Object.values(
      skusForFilter.reduce((acc, skuEntry) => {
        if (!acc[skuEntry.sku]) {
          acc[skuEntry.sku] = { sku: skuEntry.sku, data: [] };
        }
        let existing = acc[skuEntry.sku].data.find(
          (d) => d.week === skuEntry.week
        );
        if (!existing) acc[skuEntry.sku].data.push({ ...skuEntry });
        else if (
          (!existing.p_value || existing.p_value === 0) &&
          skuEntry.p_value > 0
        )
          existing.p_value = skuEntry.p_value;
        return acc;
      }, {})
    );

    setFilteredCityData(groupedData);
    const weeks = [...new Set(skusForFilter.map((s) => s.week))];

    weeks.sort((a, b) => {
      const [m1, y1] = a.split("-");
      const [m2, y2] = b.split("-");

      const d1 = new Date(`${y1}-${m1}-01`);
      const d2 = new Date(`${y2}-${m2}-01`);

      return d1 - d2;
    });

    setAllWeeks(weeks); setEditedData(groupedData.flatMap((g) => g.data.map((e) => ({ ...e }))));
  }, [selectedCity, selectedSalesPerson, tableData]);

  const handleForecastChange = (sku, week, value) => {
    setEditedData((prev) =>
      prev.map((e) =>
        e.sku === sku && e.week === week ? { ...e, forecast: value } : e
      )
    );
  };

  const approveChanges = async () => {
    if (!workflow_id || !selectedCity) {
      displayMessage("warning", "Select a city and ensure workflow is loaded.");
      return;
    }

    setIsLoading2(true); // 👈 START LOADER

    const payload = {
      workflow_id,
      city: selectedCity,
      skus_data: editedData.map((e) => ({
        sku: e.sku,
        week: e.week,
        f_value: parseFloat(e.forecast),
      })),
    };

    try {
      const url = `${REACT_APP_API_BASE_URL}/update_fcast_values`;

      const res = await axios.post(url, payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: AuthService.getAccessToken(),
          access_token: AuthService.getAccessToken(),
        },
      });

      if (res.status === 200) {
        displayMessage("success", "Changes approved successfully!");
        setIsApproved(true);
      } else {
        throw new Error("Approval failed");
      }
    } catch (err) {
      console.error("Error approving:", err.message);
      setIsApproved(false);
      displayMessage("danger", "Approval failed!");
    } finally {
      setIsLoading2(false); // 👈 STOP LOADER
      getComparisonTable();
    }
  };

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
      minHeight: "100vh",
    },
    card: {
      width: "95%",
      maxWidth: 1500,
      background: "#fbfcf7ff",
      padding: "50px 60px 80px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
      border: "2px solid #1F4280",
    },
  };

  const isWorkflowApproved = workflow?.approval_status?.toUpperCase() === "APPROVED" || isApproved;

  return (
    <>
      <Breadcrumb
        List={[
          { path: "/Dashboard", name: "Dashboard" },
          { path: "#", name: "Comparison Workbench" },
        ]}
      />
      <Banner />
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "35px",
              fontWeight: 600,
              color: "#0F1116",
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            Comparison Workbench
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#6B7280",
              marginBottom: "40px",
              letterSpacing: "0.01em",
              lineHeight: "1.5",
            }}
          >
            Reconciling model forecast with sales input.
          </p>
          {/* Info Cards */}
          {/* <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}>
            <InfoCard icon={<TrendingUp color="#c79838" size={48} />} title="Avg Deviation (%)" value="+4.2%" />
            <InfoCard icon={<Users color="#c79838" size={48} />} title="Sales Teams Completed" value="3 / 5" />
            <InfoCard icon={<LineChart color="#c79838" size={48} />} title="Accuracy vs Baseline" value="+0.8%" />
          </div> */}
          {/* City & Sales Person selectors */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "25px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#0F1116",
              }}
            >
              Workflow: {workflow?.workflow_name.slice(0, 40) || "N/A"}
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <label
                htmlFor="city"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0F1116",
                }}
              >
                Select City:
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "2px solid #032B4E",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0F1116",
                }}
              >
                <option value="">-- Select City --</option>
                {cities.map((city, i) => (
                  <option key={i} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <label
                htmlFor="sp"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0F1116",
                }}
              >
                Sales Person:
              </label>
              <select
                id="sp"
                value={selectedSalesPerson}
                onChange={(e) => setSelectedSalesPerson(e.target.value)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "2px solid #032B4E",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0F1116",
                }}
              >
                <option value="">-- All --</option>
                {salesPersons.map((name, i) => (
                  <option key={i} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              {
                isLoading2 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader size="medium" />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!isWorkflowApproved) {
                        approveChanges();
                      }
                    }}
                    style={approveBtn}
                  >
                    {isWorkflowApproved ? "Approved" : "Approve"}
                  </button>
                )
                // : (
                //   <Link
                //     // to="/indentation"
                //     state={{ workflow }}
                //     style={goBtn}
                //   >
                //     {/* Go to Indentation */}
                //     Approved
                //   </Link>
                // )
              }

            </div>
          </div>

          {/* Table */}
          <div
            style={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
            }}
          >
            <table
              style={{
                borderCollapse: "collapse",
                fontFamily: "Inter, sans-serif",
                background: "#fff",
                minWidth: "1400px",
                width: "max-content",
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
                  <th style={headerCellLeft}>Type</th>

                  {allWeeks.map((week) => (
                    <th key={week} style={headerCellCenter}>
                      {week}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredCityData.map((skuGroup, skuIndex) => {
                  return (
                    <React.Fragment key={skuGroup.sku}>
                      <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
                        <td rowSpan={2} style={skuCellStyle}>
                          {removeDescription(skuGroup.sku)}
                        </td>
                        <td rowSpan={2} style={skuCellStyle}>
                          {removeSKU(skuGroup.sku)}
                        </td>

                        <td style={typeCellStyle}>
                          <span style={{ color: "#7a35c8", fontWeight: 600 }}>
                            Forecasted
                          </span>
                        </td>

                        {allWeeks.map((week) => {
                          const matchedEntry = editedData.find(
                            (entry) =>
                              entry.sku === skuGroup.sku && entry.week === week
                          );

                          const forecastValue =
                            matchedEntry?.forecast === undefined
                              ? "-"
                              : zeroIfNegative(matchedEntry.forecast);


                          return (
                            <td key={`f-${week}`} style={valueCellStyle}>
                              <input
                                type="text"
                                value={forecastValue}
                                onChange={(e) =>
                                  handleForecastChange(
                                    skuGroup.sku,
                                    week,
                                    e.target.value
                                  )
                                }
                                style={{
                                  width: "70px",
                                  height: "28px",
                                  textAlign: "center",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                  fontWeight: "600",
                                }}
                              />
                            </td>
                          );
                        })}
                      </tr>

                      <tr
                        style={{
                          borderBottom:
                            skuIndex === filteredCityData.length - 1
                              ? "none"
                              : "1px solid #d9d9d9",
                        }}
                      >
                        <td style={typeCellStyle}>
                          <span style={{ color: "#2ca24f", fontWeight: 600 }}>
                            Planned
                          </span>
                        </td>

                        {allWeeks.map((week) => {
                          const weekData = skuGroup.data.find((e) => e.week === week);
                          const matchedEntry = editedData.find(
                            (entry) => entry.sku === skuGroup.sku && entry.week === week
                          );

                          const forecastValue =
                            matchedEntry?.forecast === undefined
                              ? "-"
                              : zeroIfNegative(matchedEntry.forecast);

                          const plannedValue =
                            weekData?.p_value === undefined ? "-" : weekData.p_value;

                          const isMismatch =
                            plannedValue !== 0 &&
                            forecastValue !== 0 &&
                            plannedValue !== "-" &&
                            forecastValue !== "-" &&
                            Number(plannedValue) !== Number(forecastValue);

                          return (
                            <td key={`p-${week}`} style={valueCellStyle}>
                              <input
                                type="text"
                                disabled
                                value={plannedValue}
                                style={{
                                  width: "70px",
                                  height: "28px",
                                  textAlign: "center",
                                  border: isMismatch ? "1px solid #B8842F" : "1px solid #ccc",
                                  borderRadius: "4px",
                                  fontWeight: "600",
                                  backgroundColor: isMismatch ? "#fff1f0" : "transparent",
                                  color: isMismatch ? "#B8842F" : "inherit",
                                }}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};


// ===== Subcomponents / styles (unchanged) =====
function InfoCard({ icon, title, value }) {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
        borderRadius: "20px",
        padding: "40px 20px",
        textAlign: "center",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        color: "#ffffff",
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "180px",
        width: "100%",
        boxSizing: "border-box",
        cursor: "default",
        border: "2px solid #1F4280",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow =
          "0 20px 40px rgba(241,94,34,0.32), 0 12px 28px rgba(241,94,34,0.22), 0 4px 12px rgba(241,94,34,0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon, { strokeWidth: 4, size: 56 })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#e1e4f2",
            marginBottom: "12px",
            textAlign: "center",
            width: "100%",
          }}
        >
          {title}
        </p>
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "28px",
            fontWeight: 700,
            color: "#ffffff",
            marginTop: "0",
            lineHeight: 1,
            textAlign: "center",
            width: "100%",
          }}
        >
          {value}
        </h2>
      </div>
    </div>
  );
}



const approveBtn = {
  fontFamily: "'Inter', sans-serif",
  backgroundColor: "#b8842f",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px 24px",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.3s ease",
};


const headerCellLeft = {
  padding: "10px 10px",
  textAlign: "left",
  fontSize: 13,
  fontWeight: 700,
  color: "#fff",
  whiteSpace: "nowrap",
  width: "5vw"
};

const headerCellCenter = {
  padding: "10px 8px",
  textAlign: "center",
  fontSize: 13,
  fontWeight: 700,
  color: "#fff",
  whiteSpace: "nowrap",
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
};


export default ComparisonTable;
