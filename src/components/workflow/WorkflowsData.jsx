import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCookie } from "../../services/DataRequestService";
import Loader from "../common/Loader";
import { get_workflows } from "../../services/ApiManageWorkflow";
import {
  BarChart3,
  RefreshCcw,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useMetrics } from "../../contexts/MatricsContext";
import { convertServerTimeToLocal } from "../../Utils/helper";

const styles = {
  wrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
    padding: "80px 0",
    boxSizing: "border-box",
    minHeight: "100vh",
  },
  card: {
    width: "95%",
    maxWidth: 1600,
    background: "#fbfcf7ff",
    borderRadius: 24,
    padding: "70px 80px 90px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
    overflow: "hidden",
    border: "2px solid #1F4280",
  },
};



function WorkFlowsData({ PathName }) {
  const { metrics, loading, refreshing, fetchMetrics } = useMetrics();
  const [workFlowdata, setWorkFlowData] = useState([]);
  const [masterWorkFlowdata, setMasterWorkFlowdata] = useState([]);
  const [workFlowPageData, setWorkFlowPageData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customParams, setCustomParams] = useState({
    redirectPath: "",
    fieldHeaderName: "",
    fieldValueName: "",
  });



  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;



  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [filteredData, setFilteredData] = useState([]);

  // 🔹 default = "all" so reset shows everything
  const [modelStatusFilter, setModelStatusFilter] = useState("all"); // all | processing | completed
  const [approvalStatusFilter, setApprovalStatusFilter] = useState("all"); // all | pending | approved

  const [filteredFullList, setFilteredFullList] = useState([]); // full filtered list before slicing



  const totalPages = Math.ceil((filteredFullList.length || 0) / itemsPerPage);





  // 🔁 Build filtered + sorted + paginated data from full list
  useEffect(() => {
    if (!workFlowdata) return;


    // 1) sort full list by date-time desc
    let data = [...workFlowdata].sort((a, b) => {
      const da = a.process_date ? new Date(a.process_date) : 0;
      const db = b.process_date ? new Date(b.process_date) : 0;
      return db - da;
    });


    // 2) apply filters (skip when "all")
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


    // save full filtered list
    setFilteredFullList(data);


    // 3) paginate AFTER filtering
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paged = data.slice(start, end);


    setFilteredData(paged);
    setWorkFlowPageData(paged);
  }, [workFlowdata, modelStatusFilter, approvalStatusFilter, currentPage]);



  useEffect(() => {
    getData(PathName);
    if (PathName === "/manageworkflow") {
      setCustomParams({
        redirectPath: "/workflow",
        fieldHeaderName: "Forecast Report",
        fieldValueName: "Details",
      });
    } else if (PathName === "/comparison") {
      setCustomParams({
        redirectPath: "/wf/comparison",
        fieldHeaderName: "Compare",
        fieldValueName: "Compare",
      });
    } else if (PathName === "/indentation") {
      setCustomParams({
        redirectPath: "/indent",
        fieldHeaderName: "Indentation",
        fieldValueName: "View",
      });
    }
  }, []);



  // NOTE: pagination slice is now handled in the filtering effect above,
  // so this effect is no longer needed to slice and only keeps compatibility.
  useEffect(() => {
    const currentData =
      workFlowdata?.slice(indexOfFirstItem, indexOfLastItem) || [];
    // setWorkFlowPageData(currentData); // handled in main filtering effect
  }, [currentPage, workFlowdata, indexOfFirstItem, indexOfLastItem]);



  const getData = async (pathname) => {
    setIsLoading(true);
    try {
      let _response = await get_workflows(getCookie("sub"));
      if (pathname === "/comparison" || pathname === "/indentation") {
        _response = _response.filter(
          (elem) => elem?.status?.toLowerCase() === "completed"
        );
      }
      _response.reverse();
      setWorkFlowData(_response);
      setMasterWorkFlowdata(_response);
      const currentData =
        _response?.slice(indexOfFirstItem, indexOfLastItem) || [];
      setWorkFlowPageData(currentData);
      // also initialise filteredFullList/full list on load
      setFilteredFullList(_response);
    } catch (error) {
      console.error("Error fetching workflows:", error.message);
    }
    setIsLoading(false);
  };



  const searchByName = (name) => {
    if (name !== "") {
      const newData = masterWorkFlowdata.filter((workflow) =>
        workflow.workflow_name.toLowerCase().includes(name.toLowerCase())
      );
      setWorkFlowData(newData);
      setCurrentPage(1);
    } else {
      setWorkFlowData(masterWorkFlowdata);
      setCurrentPage(1);
    }
  };



  const reset = () => {
    setWorkFlowData(masterWorkFlowdata);
    setCurrentPage(1);
    setModelStatusFilter("all");
    setApprovalStatusFilter("all");
    document.getElementById("workflowName").value = "";
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

  // Completed Workflows: status = "completed" AND approval_status = "approved"
  const completed = masterWorkFlowdata.filter(
    (w) =>
      w.status?.toLowerCase() === "completed" &&
      w.approval_status?.toLowerCase() === "approved"
  ).length;
  const processing = masterWorkFlowdata.filter(
    (w) => w.status?.toLowerCase() === "processing"
  ).length;
  const pending = masterWorkFlowdata.filter(
    (w) => w.approval_status?.toLowerCase() === "pending"
  ).length;






  const accuracy = metrics?.forecast_accuracy?.forecast_accuracy ?? 0;  // or '' or null as needed
  // const accuracy = 95;



  if (isLoading) {
    return (
      <center className="flex flex-col items-center justify-center" style={{ height: "100vh" }}>
        <Loader size={"large"} />
      </center>
    );
  }



  return (
    <div style={{
      background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: "#fbfcf7ff",
        padding: "40px",
        maxWidth: "1400px",
        margin: "40px auto",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        border: "2px solid #1F4280",
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ marginBottom: "48px", textAlign: "left" }}>
          <h1 style={{
            fontSize: "35px",
            fontWeight: "600",
            color: "#0F1116",
            marginBottom: "16px",
            letterSpacing: "-0.02em",
            fontFamily: "'Poppins', sans-serif"
          }}>
            {PathName === "/indentation" ? "Inventory Optimization" : "Forecast Library"}
          </h1>
          <p style={{
            fontSize: "20px",
            color: "#475569",
            marginBottom: "24px",
            letterSpacing: "0.01em",
            lineHeight: "1.6",
            fontWeight: "400",
            fontStyle: "italic",
            fontFamily: "'Inter', sans-serif"
          }}>
            {PathName === "/indentation"
              ? "Turn your approved forecast into a supply → ready replenishment plan."
              : "View and monitor all your workflows here."}
          </p>
        </div>



        {/* 🔹 SCORECARDS / INVENTORY OPTIMIZATION PREVIEW */}
        {PathName === "/indentation" ? (
          /* Inventory Optimization Preview */
          <>
            {/* (inventory preview content commented as in your code) */}
          </>
        ) : (
          /* Enhanced Scorecards matching Dashboard KPI cards */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 24,
            justifyItems: "center",
            alignItems: "stretch",
            width: "100%",
            marginBottom: 48
          }}>
            {[
              {
                title: "Model Accuracy",
                value: `${accuracy}%`,
                icon: <BarChart3 size={80} color="#c79838" strokeWidth={3} />,
              },
              {
                title: "Models Processing",
                value: processing,
                icon: <RefreshCcw size={80} color="#c79838" strokeWidth={3} />,
              },
              {
                title: "Awaiting Approval",
                value: pending,
                icon: <Clock size={80} color="#c79838" strokeWidth={3} />,
              },
              {
                title: "Completed Workflows",
                value: completed,
                icon: <CheckCircle2 size={80} color="#c79838" strokeWidth={3} />,
              },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
                  borderRadius: 20,
                  padding: "35px 20px 30px",
                  textAlign: "center",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  color: "#ffffff",
                  boxShadow: "0 8px 25px rgba(3, 43, 78, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 200,
                  width: "100%",
                  boxSizing: "border-box",
                  cursor: "default",
                  border: "2px solid #1F4280",
                  position: "relative",
                  overflow: "hidden"
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
                  marginBottom: 12,
                  filter: "drop-shadow(0 4px 8px rgba(199, 120, 56, 0.4))",
                  flexShrink: 0
                }}>
                  {card.icon}
                </div>
                <div>
                  <p style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 8,
                    letterSpacing: "0.5px",
                    fontFamily: "'Inter', sans-serif",
                    color: "#ffffff"
                  }}>
                    {card.title}
                  </p>
                  <h2 style={{
                    fontSize: 40,
                    fontWeight: 600,
                    marginTop: 0,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    letterSpacing: "1px",
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: 1,
                    color: "#ffffff"
                  }}>
                    {card.value}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}



        {/* 🔹 SEARCH + RESET - Enhanced Text Sizes */}
        <div className="flex justify-between items-end flex-wrap my-8 gap-6">
          <div className="w-full lg:w-1/3">
            <label
              htmlFor="workflowName"
              className="block text-3xl font-bold text-[#0C3C54] mb-4"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
            >
              Search By Name
            </label>
            <input
              id="workflowName"
              onChange={(e) => searchByName(e.target.value)}
              placeholder="Type workflow name..."
              className="w-full px-6 py-5 border-2 border-[#0C3C54] rounded-lg text-2xl focus:outline-none焦 focus:ring-2 focus:ring-[#0C3C54] placeholder-gray-500"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            />
          </div>


          <div className="flex flex-wrap gap-4 items-end">
            {/* 1️⃣ Model Status button */}
            {PathName !== "/indentation" && (
              <button
                onClick={() => {
                  setModelStatusFilter((prev) => {
                    const next =
                      prev === "processing"
                        ? "completed"
                        : prev === "completed"
                          ? "all"
                          : "processing"; // cycle: all -> processing -> completed -> all
                    setCurrentPage(1);
                    return next;
                  });
                }}
                className="text-white px-12 py-5 text-2xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-bold"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  backgroundColor:
                    modelStatusFilter === "completed"
                      ? "#368E60"
                      : modelStatusFilter === "processing"
                        ? "#CA8B48"
                        : "#6b7280",
                }}
              >
                {modelStatusFilter === "completed"
                  ? "Model Status Completed"
                  : modelStatusFilter === "processing"
                    ? "Model Status Processing"
                    : "Model Status All"}
              </button>
            )}



            {/* 2️⃣ Approval Status button */}
            <button
              onClick={() => {
                setApprovalStatusFilter((prev) => {
                  const next =
                    prev === "pending"
                      ? "approved"
                      : prev === "approved"
                        ? "all"
                        : "pending"; // cycle: all -> pending -> approved -> all
                  setCurrentPage(1);
                  return next;
                });
              }}
              className="text-white px-12 py-5 text-2xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-bold"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                backgroundColor:
                  approvalStatusFilter === "approved"
                    ? "#368E60"
                    : approvalStatusFilter === "pending"
                      ? "#973848"
                      : "#6b7280",
              }}
            >
              {approvalStatusFilter === "approved"
                ? "Approval Status Approved"
                : approvalStatusFilter === "pending"
                  ? "Approval Status Pending"
                  : "Approval Status All"}
            </button>


            {/* 3️⃣ Reset Filter button (unchanged) */}
            <button
              onClick={reset}
              className="bg-[#c79838] hover:bg-[#b8842f] text-white px-12 py-5 text-2xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-bold"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              Reset Filter
            </button>
          </div>


        </div>




        {/* 🔹 TABLE - Enhanced Text Sizes with Proper Alignment */}
        <div className="overflow-x-auto rounded-2xl shadow-2xl" style={{ border: "3px solid #032B4E" }}>
          <table className="w-full text-gray-800 border-collapse" style={{ borderSpacing: 0, fontFamily: "'Inter', sans-serif" }}>
            <thead className="bg-[#032B4E] text-white" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "18px" }}>
              <tr>
                <th className="px-6 py-4 font-bold text-center" style={{ borderRight: "2px solid rgba(255, 255, 255, 0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 600 }}>WORKFLOW NAME</th>
                <th className="px-6 py-4 font-bold text-center" style={{ borderRight: "2px solid rgba(255, 255, 255, 0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 600 }}>WORKFLOW DESCRIPTION</th>
                <th className="px-6 py-4 font-bold text-center" style={{ borderRight: "2px solid rgba(255, 255, 255, 0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 600 }}>GRANULARITY</th>
                <th className="px-6 py-4 font-bold text-center" style={{ borderRight: "2px solid rgba(255, 255, 255, 0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 600 }}>PROCESS TIME</th>
                <th className="px-6 py-4 font-bold text-center" style={{ borderRight: "2px solid rgba(255, 255, 255, 0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 600 }}>PROCESS DATE</th>
                <th className="px-6 py-4 font-bold text-center" style={{ borderRight: "2px solid rgba(255, 255, 255, 0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 600 }}>MODEL STATUS</th>
                <th className="px-6 py-4 font-bold text-center" style={{ borderRight: "2px solid rgba(255, 255, 255, 0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 600 }}>APPROVAL STATUS</th>
                <th className="px-6 py-4 font-bold text-center" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 600 }}>
                  {customParams.fieldHeaderName?.toUpperCase()}
                </th>
              </tr>
            </thead>



            <tbody className="bg-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "13px" }}>
              {filteredData.map((elem, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                  style={{ borderBottom: index < filteredData.length - 1 ? "1px solid #e0e0e0" : "none" }}
                >
                  <td className="px-6 py-6 text-gray-900 text-center" style={{ fontWeight: 600, borderRight: "1px solid #e0e0e0", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>
                    {elem.workflow_name}
                  </td>
                  <td className="px-6 py-6 text-gray-700 text-center" style={{ fontWeight: 500, borderRight: "1px solid #e0e0e0", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>
                    {elem.workflow_description}
                  </td>
                  <td className="px-6 py-6 text-gray-700 text-center" style={{ fontWeight: 500, borderRight: "1px solid #e0e0e0", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>
                    {elem.granularity}
                  </td>
                  <td className="px-6 py-6 text-gray-700 text-center" style={{ fontWeight: 500, borderRight: "1px solid #e0e0e0", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>
                    {convertServerTimeToLocal(elem.process_date) && convertServerTimeToLocal(elem.process_date)}
                  </td>
                  <td className="px-6 py-6 text-gray-700 text-center" style={{ fontWeight: 500, borderRight: "1px solid #e0e0e0", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>
                    {elem.process_date?.split("T")[0]}
                  </td>
                  <td className="px-6 py-6 text-center" style={{ borderRight: "1px solid #e0e0e0", fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
                    <span
                      className="px-5 py-3 rounded-full font-bold uppercase tracking-wide"
                      style={{
                        display: "inline-block",
                        minWidth: "120px",
                        fontSize: "13px",
                        backgroundColor:
                          elem.status?.toLowerCase() === "completed"
                            ? "#368E60"
                            : elem.status?.toLowerCase() === "processing"
                              ? "#ca8b48ff"
                              : elem.status?.toLowerCase() === "failed"
                                ? "#973848"
                                : "#973848",
                        color: "#ffffff",
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      {elem.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center" style={{ borderRight: "1px solid #e0e0e0", fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
                    <span
                      className="px-5 py-3 rounded-full font-bold uppercase tracking-wide"
                      style={{
                        display: "inline-block",
                        minWidth: "120px",
                        fontSize: "13px",
                        backgroundColor: elem.approval_status?.toLowerCase() === "approved" ? "#368E60" : "#973848",
                        color: "#ffffff",
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      {elem.approval_status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
                    {elem.status?.toLowerCase() === "completed" ? (
                      <Link
                        to={customParams.redirectPath}
                        state={{ workflow: elem }}
                        className="font-bold transition-colors duration-200"
                        style={{ textDecoration: "none", color: "#85824c", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                        onMouseEnter={(e) => {
                          e.target.style.textDecoration = "underline";
                          e.target.style.color = "#6d6a3d";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.textDecoration = "none";
                          e.target.style.color = "#85824c";
                        }}
                      >
                        {customParams.fieldValueName}
                      </Link>
                    ) : (
                      <span className="text-gray-400" style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



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
  );
}



export default WorkFlowsData;
