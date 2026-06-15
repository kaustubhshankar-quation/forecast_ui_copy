import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";
import UserService from "../../services/UserService";
import { getCookie } from "../../services/DataRequestService";
import { CheckCircle, Clock, FileText, Users } from "lucide-react";
import Breadcrumb from "../common/Breadcrumb";
import { useMetrics } from "../../contexts/MatricsContext";
import AuthService from "../../services/AuthService";
import { convertServerTimeToLocal } from "../../Utils/helper";
import Loader from "../common/Loader";


const { REACT_APP_API_BASE_URL } = process.env;


function CollaborationPortal() {
  const [workFlowdata, setWorkFlowData] = useState([]);
  const [masterWorkFlowdata, setMasterWorkFlowdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const { metrics } = useMetrics();

  // 🔹 filters + filtered list for pagination
  const [modelStatusFilter, setModelStatusFilter] = useState("all");      // all | processing | completed
  const [approvalStatusFilter, setApprovalStatusFilter] = useState("all"); // all | pending | approved
  const [filteredFullList, setFilteredFullList] = useState([]);           // full filtered list
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const url = `${REACT_APP_API_BASE_URL}/get_workflows?user_id=${getCookie("sub")}`;
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          access_token: AuthService.getAccessToken(),
        },
      });
      const tempArr = response.data.data.reverse();
      setWorkFlowData(tempArr);
      setMasterWorkFlowdata(tempArr);
      setFilteredFullList(tempArr);
    } catch (error) {
      console.error("Error fetching workflows:", error.message);
    }
    setIsLoading(false);
  };

  const reset = () => {
    setWorkFlowData(masterWorkFlowdata);
    setModelStatusFilter("all");
    setApprovalStatusFilter("all");
    setCurrentPage(1);
    const input = document.getElementById("workflowName");
    if (input) input.value = "";
  };

  const getAwaitingReview = () => {
    return (metrics?.notifications ?? []).filter(
      (n) =>
        n.reviewed_get_fp === false &&
        n.task_name === "consensus_plans_to_finalize"
    ).length;
  };


  const collabMatrics = [
    { label: "Outstanding Requests", value: metrics?.outstanding_requests || 0, icon: <FileText size={80} color="#c79838" strokeWidth={3} /> },
    { label: "Awaiting Your Review", value: getAwaitingReview(), icon: <Clock size={80} color="#c79838" strokeWidth={3} /> },
    { label: "Completed This Week", value: metrics?.completed_this_week || 0, icon: <CheckCircle size={80} color="#c79838" strokeWidth={3} /> },
    { label: "Teams Involved", value: metrics?.teams_involved + 1 || 0, icon: <Users size={80} color="#c79838" strokeWidth={3} /> },
  ];

  // 🔁 apply filters on workFlowdata then paginate
  useEffect(() => {

    // 1) sort full list by date-time desc
    let data = [...workFlowdata].sort((a, b) => {
      const da = a.process_date ? new Date(a.process_date) : 0;
      const db = b.process_date ? new Date(b.process_date) : 0;
      return db - da;
    });


    if (modelStatusFilter !== "all") {
      data = data.filter(
        (w) => w.status?.toLowerCase() === modelStatusFilter
      );
    }

    if (approvalStatusFilter !== "all") {
      data = data.filter(
        (w) => w.approval_status?.toLowerCase() === approvalStatusFilter
      );
    }

    setFilteredFullList(data);
    setCurrentPage((prev) => {
      const total = Math.max(1, Math.ceil(data.length / rowsPerPage));
      return prev > total ? total : prev;
    });
  }, [workFlowdata, modelStatusFilter, approvalStatusFilter]);

  const totalPages = Math.ceil(filteredFullList.length / rowsPerPage) || 1;
  const currentData = filteredFullList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // ✅ Deep blue gradient wrapper + card style
  const styles = {
    wrapper: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
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
      overflow: "hidden",
    },
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const getVisiblePages = (currentPage, totalPages) => {
    const PAGES_TO_SHOW = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // Adjust start if not enough pages at end
    if (endPage - startPage + 1 < PAGES_TO_SHOW) {
      startPage = Math.max(1, endPage - 4);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  if (isLoading) {
    return (
      <center className="flex flex-col items-center justify-center" style={{ height: "100vh" }}>
        <Loader size={"large"} />
      </center>
    );
  }


  return (
    <>
      <Breadcrumb List={[{ path: "/Dashboard", name: "Dashboard" }, { path: "#", name: "Collaboration Portal" }]} />
      <div style={styles.wrapper}>
        <div style={styles.card}>
          {/* ===== PAGE HEADER ===== */}
          <div style={{ marginBottom: "50px" }}>
            <h1
              style={{
                fontSize: "35px",
                fontWeight: "600",
                color: "#0F1116",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Collaboration Portal
            </h1>
            <p style={{ color: "#6B7280", fontSize: "20px", fontWeight: "400", letterSpacing: "0.01em", lineHeight: "1.5", fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
              Monitor and manage all your workbench workflows here.
            </p>
          </div>


          {/* ===== ENHANCED SCORECARDS ===== */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "25px",
              marginBottom: "45px",
            }}
          >
            {collabMatrics.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
                  borderRadius: "20px",
                  padding: "35px 20px 30px",
                  color: "white",
                  textAlign: "center",
                  boxShadow: "0 8px 25px rgba(3, 43, 78, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.1)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  border: "2px solid #1F4280",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(241,94,34,0.32), 0 12px 28px rgba(241,94,34,0.22), 0 4px 12px rgba(241,94,34,0.14)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(3, 43, 78, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.1)";
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "12px",
                  filter: "drop-shadow(0 4px 8px rgba(199, 120, 56, 0.4))",
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    letterSpacing: "0.5px",
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {item.label}
                  </p>
                  <h2 style={{
                    fontSize: "40px",
                    fontWeight: "600",
                    marginTop: "0",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    letterSpacing: "1px",
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: "1"
                  }}>
                    {item.value}
                  </h2>
                </div>
              </div>
            ))}
          </div>


          {/* ===== ENHANCED SEARCH + FILTERS + RESET ===== */}
          <div
            style={{
              marginBottom: "40px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <input
              id="workflowName"
              placeholder="Search by workflow name..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = e.target.value.toLowerCase();
                  if (value) {
                    const newData = masterWorkFlowdata.filter((w) =>
                      w.workflow_name.toLowerCase().includes(value)
                    );
                    setWorkFlowData(newData);
                    setCurrentPage(1);
                  } else {
                    reset();
                  }
                }
              }}
              style={{
                width: "40%",
                padding: "20px 25px",
                borderRadius: "10px",
                border: "2px solid #1F4280",
                fontSize: "14px",
                outline: "none",
                fontWeight: "400",
                transition: "all 0.3s ease",
                fontFamily: "'Inter', sans-serif",
              }}
            />

            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              {/* Model Status button (same behavior as previous component) */}
              <button
                onClick={() => {
                  setModelStatusFilter((prev) => {
                    const next =
                      prev === "processing"
                        ? "completed"
                        : prev === "completed"
                          ? "all"
                          : "processing"; // all -> processing -> completed -> all
                    setCurrentPage(1);
                    return next;
                  });
                }}
                style={{
                  background:
                    modelStatusFilter === "completed"
                      ? "#368E60"
                      : modelStatusFilter === "processing"
                        ? "#CA8B48"
                        : "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "20px 30px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  boxShadow: "0 8px 20px rgba(184, 132, 47, 0.3)",
                  transition: "all 0.3s ease",
                  fontFamily: "'Inter', sans-serif",
                  minWidth: "200px",
                }}
              >
                {modelStatusFilter === "completed"
                  ? "Model Status Completed"
                  : modelStatusFilter === "processing"
                    ? "Model Status Processing"
                    : "Model Status All"}
              </button>

              {/* Approval Status button */}
              <button
                onClick={() => {
                  setApprovalStatusFilter((prev) => {
                    const next =
                      prev === "pending"
                        ? "approved"
                        : prev === "approved"
                          ? "all"
                          : "pending"; // all -> pending -> approved -> all
                    setCurrentPage(1);
                    return next;
                  });
                }}
                style={{
                  background:
                    approvalStatusFilter === "approved"
                      ? "#368E60"
                      : approvalStatusFilter === "pending"
                        ? "#973848"
                        : "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "20px 30px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  boxShadow: "0 8px 20px rgba(184, 132, 47, 0.3)",
                  transition: "all 0.3s ease",
                  fontFamily: "'Inter', sans-serif",
                  minWidth: "220px",
                }}
              >
                {approvalStatusFilter === "approved"
                  ? "APPROVAL STATUS Approved"
                  : approvalStatusFilter === "pending"
                    ? "APPROVAL STATUS Pending"
                    : "APPROVAL STATUS All"}
              </button>

              <button
                onClick={reset}
                style={{
                  background: "#b8842f",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "20px 30px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  boxShadow: "0 8px 20px rgba(184, 132, 47, 0.3)",
                  transition: "all 0.3s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Reset Filter
              </button>
            </div>
          </div>


          {/* ===== ENHANCED WORKFLOW TABLE ===== */}
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
              overflowX: "auto",
              border: "2px solid #1F4280",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                wordWrap: "break-word",
                tableLayout: "fixed",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <thead style={{ background: "#032B4E", color: "white" }}>
                <tr>
                  <th style={thStyle}>Workflow Name</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Granularity</th>
                  <th style={thStyle}>Process Time</th>
                  <th style={thStyle}>Process Date</th>
                  <th style={thStyle}>Model Status</th>
                  <th style={thStyle}>Approval</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((elem, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: "2px solid #e2e8f0",
                        background: index % 2 === 0 ? "#f8fafc" : "#fff",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f0f4ff";
                        e.currentTarget.style.transform = "scale(1.01)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? "#f8fafc" : "#fff";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <td style={tdStyle}>{elem.workflow_name}</td>
                      <td style={tdStyle}>{elem.workflow_description}</td>
                      <td style={tdStyle}>{elem.granularity}</td>
                      <td style={tdStyle}>
                        {convertServerTimeToLocal(elem.process_date) && convertServerTimeToLocal(elem.process_date)}
                      </td>
                      <td style={tdStyle}>
                        {elem?.process_date?.split("T")[0] || "-"}
                      </td>
                      <td style={tdStyle}>
                        <StatusTag status={elem?.status} />
                      </td>
                      <td style={tdStyle}>
                        <StatusTag
                          status={elem?.approval_status}
                          type={
                            elem.approval_status === "APPROVED"
                              ? "success"
                              : "pending"
                          }
                        />
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {elem?.status?.toLowerCase() === "completed" ? (
                          <Link
                            to={`/wf/comparison`}
                            state={{ workflow: elem }}
                            style={{
                              color: "#b8842f",
                              fontWeight: "600",
                              fontSize: "13px",
                              textDecoration: "underline",
                              transition: "all 0.3s ease",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            View Workbench
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "40px", fontSize: "14px", fontFamily: "'Inter', sans-serif" }}>
                      No workflows found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          {/* ===== ENHANCED PAGINATION ===== */}
          {/* 🔹 PAGINATION - Enhanced Text Sizes */}
          <div className="flex justify-center mt-12" style={{ fontFamily: "'Inter', sans-serif" }}>
            <nav>
              <ul className="flex items-center space-x-4 text-2xl">
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-8 py-4 border-2 border-[#1F4280] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c79838] hover:text-white transition-all duration-300 transform hover:scale-105 font-bold text-2xl"
                    style={{ fontWeight: 500 }}
                  >
                    Previous
                  </button>
                </li>

                {/* ✅ ONLY THIS PART CHANGED - Shows 5 pages that slide */}
                {getVisiblePages(currentPage, totalPages).map((pageNum) => (
                  <li key={pageNum}>
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-6 py-4 rounded-xl border-2 border-[#1F4280] font-bold transition-all duration-300 transform hover:scale-105 text-2xl ${currentPage === pageNum
                        ? "bg-[#c79838] text-white shadow-lg"
                        : "hover:bg-[#c79838] hover:text-white text-[#032B4E]"
                        }`}
                      style={{ fontWeight: 500 }}
                    >
                      {pageNum}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-8 py-4 border-2 border-[#1F4280] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c79838] hover:text-white transition-all duration-300 transform hover:scale-105 font-bold text-2xl"
                    style={{ fontWeight: 500 }}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}


const thStyle = {
  padding: "12px 16px",
  fontWeight: 600,
  fontSize: "15px", // reduced by 2px
  whiteSpace: "normal",
  textShadow: "0 1px 3px rgba(0,0,0,0.3)",
  letterSpacing: "0.3px",
  borderRight: "1px solid rgba(255, 255, 255, 0.2)",
  fontFamily: "'Poppins', sans-serif",
  textAlign: "center",
};


const workflowNameThStyle = {
  ...thStyle,
  maxWidth: "350px",
  minWidth: "200px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};


const tdStyle = {
  padding: "12px 16px",
  fontSize: "13px",
  color: "#0F1116",
  wordBreak: "break-word",
  fontWeight: 400,
  lineHeight: "1.4",
  borderRight: "1px solid #e2e8f0",
  fontFamily: "'Inter', sans-serif",
  textAlign: "center",
};


const pageBtn = {
  background: "#b8842f",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "15px 25px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "14px",
  boxShadow: "0 8px 20px rgba(184, 132, 47, 0.3)",
  transition: "all 0.3s ease",
  minWidth: "120px",
  fontFamily: "'Inter', sans-serif",
};


function StatusTag({ status, type }) {
  let bg = "#e5e7eb",
    color = "#374151";


  // COMPLETED status - green
  if (status?.toUpperCase() === "COMPLETED") {
    bg = "#368e60";
    color = "#ffffff";
  }
  // APPROVED status - green  
  else if (type === "success" || status?.toUpperCase() === "APPROVED") {
    bg = "#368e60";
    color = "#ffffff";
  }
  // PENDING status - red/maroon
  else if (type === "pending" || status?.toUpperCase() === "PENDING") {
    bg = "#973848";
    color = "#ffffff";
  }
  // PROCESSING status - orange
  else if (status?.toUpperCase() === "PROCESSING") {
    bg = "#ca8b48ff";
    color = "#ffffff";
  }


  return (
    <span
      style={{
        backgroundColor: bg,
        color,
        fontWeight: 600,
        padding: "8px 16px",
        borderRadius: "16px",
        fontSize: "11px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        letterSpacing: "0.3px",
        display: "inline-block",
        textTransform: "uppercase",
        fontFamily: "'Inter', sans-serif",
        minWidth: "120px",
        textAlign: "center",
      }}
    >
      {status?.toUpperCase() || "-"}
    </span>
  );
}


export default CollaborationPortal;
