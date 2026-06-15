import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "./FormContext";


const itemsPerPage = 5;


const WorkflowTableModal = ({ isOpen, onClose, workFlowPageData = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageRows, setPageRows] = useState([]);


    const { cloneWorkflow } = useFormContext();
    const navigate = useNavigate();


    const totalPages = Math.ceil((workFlowPageData.length || 0) / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // 🔹 keep a sorted copy of workflows (latest process_date on top)
    const [sortedData, setSortedData] = useState([]);

    useEffect(() => {
        // sort whenever source data changes
        const sorted = [...workFlowPageData].sort((a, b) => {
            const da = a.process_date ? new Date(a.process_date) : 0;
            const db = b.process_date ? new Date(b.process_date) : 0;
            return db - da; // latest first
        });
        setSortedData(sorted);
    }, [workFlowPageData]);

    useEffect(() => {
        if (!isOpen) return;
        const currentData =
            (sortedData || []).slice(indexOfFirstItem, indexOfLastItem) || [];
        setPageRows(currentData);
    }, [isOpen, currentPage, sortedData, indexOfFirstItem, indexOfLastItem]);


    // reset to page 1 whenever modal closes
    useEffect(() => {
        if (!isOpen) setCurrentPage(1);
    }, [isOpen]);


    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    const handleClone = async (elem) => {
        console.log("elem to clone:", elem);

        if (!elem) return;
        
        try {
            // inject workflow into form context + persist to sessionStorage
            // ✅ Now awaits the async cloneWorkflow (which includes date range API call)
            await cloneWorkflow(elem);
            
            // close modal and navigate to create workflow page
            if (typeof onClose === "function") onClose();
            navigate("/createworkflow");
        } catch (error) {
            console.error("Error cloning workflow:", error);
            // Optionally show error message to user
        }
    };


    if (!isOpen) return null;


    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(4px)",
            }}
        >
            <div
                className="relative bg-[#fbfcf7ff] rounded-2xl shadow-2xl w-[96%] max-h-[85vh] flex flex-col"
                style={{ border: "3px solid #032B4E", fontFamily: "'Inter', sans-serif" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#032B4E]">
                    <h2
                        className="text-xl font-semibold text-white"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Workflows
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 text-2xl px-2"
                        aria-label="Close workflows modal"
                    >
                        ×
                    </button>
                </div>


                {/* Table */}
                <div className="p-4 flex-1 overflow-auto">
                    <div className="rounded-2xl shadow-2xl border-[3px] border-[#032B4E]">
                        <table
                            className="w-full text-gray-800 border-collapse"
                            style={{ borderSpacing: 0, fontFamily: "'Inter', sans-serif" }}
                        >
                            <thead
                                className="bg-[#032B4E] text-white"
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "15px",
                                }}
                            >
                                <tr>
                                    <th className="px-6 py-4 text-center" style={{ borderRight: "2px solid rgba(255,255,255,0.1)" }}>WORKFLOW NAME</th>
                                    <th className="px-6 py-4 text-center" style={{ borderRight: "2px solid rgba(255,255,255,0.1)" }}>WORKFLOW DESCRIPTION</th>
                                    <th className="px-6 py-4 text-center" style={{ borderRight: "2px solid rgba(255,255,255,0.1)" }}>GRANULARITY</th>
                                    <th className="px-6 py-4 text-center" style={{ borderRight: "2px solid rgba(255,255,255,0.1)" }}>PROCESS TIME</th>
                                    <th className="px-6 py-4 text-center" style={{ borderRight: "2px solid rgba(255,255,255,0.1)" }}>PROCESS DATE</th>
                                    <th className="px-6 py-4 text-center" style={{ borderRight: "2px solid rgba(255,255,255,0.1)" }}>MODEL STATUS</th>
                                    <th className="px-6 py-4 text-center" style={{ borderRight: "2px solid rgba(255,255,255,0.1)" }}>APPROVAL STATUS</th>
                                    <th className="px-6 py-4 text-center">Clone Forecast</th>
                                </tr>
                            </thead>
                            <tbody
                                className="bg-white"
                                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "13px" }}
                            >
                                {pageRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6 text-gray-500">
                                            No workflows found.
                                        </td>
                                    </tr>
                                ) : (
                                    pageRows.map((elem, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition-colors duration-200"
                                            style={{
                                                borderBottom:
                                                    index < pageRows.length - 1 ? "1px solid #e0e0e0" : "none",
                                            }}
                                        >
                                            <td
                                                className="px-6 py-4 text-center text-gray-900"
                                                style={{
                                                    fontWeight: 600,
                                                    borderRight: "1px solid #e0e0e0",
                                                    fontSize: "13px",
                                                }}
                                            >
                                                {elem.workflow_name}
                                            </td>
                                            <td
                                                className="px-6 py-4 text-center text-gray-700"
                                                style={{
                                                    fontWeight: 500,
                                                    borderRight: "1px solid #e0e0e0",
                                                    fontSize: "13px",
                                                }}
                                            >
                                                {elem.workflow_description}
                                            </td>
                                            <td
                                                className="px-6 py-4 text-center text-gray-700"
                                                style={{
                                                    fontWeight: 500,
                                                    borderRight: "1px solid #e0e0e0",
                                                    fontSize: "13px",
                                                }}
                                            >
                                                {elem.granularity}
                                            </td>
                                            <td
                                                className="px-6 py-4 text-center text-gray-700"
                                                style={{
                                                    fontWeight: 500,
                                                    borderRight: "1px solid #e0e0e0",
                                                    fontSize: "13px",
                                                }}
                                            >
                                                {elem.process_date && elem.process_date.split("T")[1].slice(0, 5)}
                                            </td>
                                            <td
                                                className="px-6 py-4 text-center text-gray-700"
                                                style={{
                                                    fontWeight: 500,
                                                    borderRight: "1px solid #e0e0e0",
                                                    fontSize: "13px",
                                                }}
                                            >
                                                {elem.process_date?.split("T")[0]}
                                            </td>
                                            <td
                                                className="px-6 py-4 text-center"
                                                style={{ borderRight: "1px solid #e0e0e0", fontSize: "13px" }}
                                            >
                                                <span
                                                    className="px-5 py-2 rounded-full font-bold uppercase tracking-wide inline-block"
                                                    style={{
                                                        minWidth: "110px",
                                                        fontSize: "12px",
                                                        backgroundColor:
                                                            elem.status?.toLowerCase() === "completed"
                                                                ? "#368E60"
                                                                : elem.status?.toLowerCase() === "processing"
                                                                    ? "#ca8b48ff"
                                                                    : "#f97316",
                                                        color: "#ffffff",
                                                    }}
                                                >
                                                    {elem.status}
                                                </span>
                                            </td>
                                            <td
                                                className="px-6 py-4 text-center"
                                                style={{ borderRight: "1px solid #e0e0e0", fontSize: "13px" }}
                                            >
                                                <span
                                                    className="px-5 py-2 rounded-full font-bold uppercase tracking-wide inline-block"
                                                    style={{
                                                        minWidth: "110px",
                                                        fontSize: "12px",
                                                        backgroundColor:
                                                            elem.approval_status?.toLowerCase() === "approved"
                                                                ? "#368E60"
                                                                : "#973848",
                                                        color: "#ffffff",
                                                    }}
                                                >
                                                    {elem.approval_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center" style={{ fontSize: "13px" }}>
                                                {true ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleClone(elem)}
                                                        className="font-bold"
                                                        style={{
                                                            background: "transparent",
                                                            border: "none",
                                                            padding: 0,
                                                            cursor: "pointer",
                                                            textDecoration: "none",
                                                            color: "#85824c",
                                                            fontSize: "13px",
                                                        }}
                                                        aria-label={`Clone workflow ${elem.workflow_name}`}
                                                    >
                                                        Clone
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400" style={{ fontSize: "13px" }}>
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* Pagination */}
                <div
                    className="flex justify-center items-center gap-3 py-4 border-t border-gray-200 bg-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-[#1F4280] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c79838] hover:text-white transition"
                    >
                        Previous
                    </button>


                    <span className="text-sm font-medium text-gray-700">
                        Page {currentPage} of {totalPages || 1}
                    </span>


                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-[#1F4280] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c79838] hover:text-white transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};


export default WorkflowTableModal;
