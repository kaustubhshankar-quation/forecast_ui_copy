// UploadFile.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import DisplayExcel from "./DisplayExcel";
import { getCookie } from "../../services/DataRequestService";
import { displayMessage } from "../../Utils/helper";
import AuthService from "../../services/AuthService";
import * as XLSX from "xlsx";
import { FaCloudUploadAlt, FaProjectDiagram, FaFileExcel, FaCheckCircle, FaTable } from "react-icons/fa";
import { MdUploadFile } from "react-icons/md";

const { REACT_APP_API_BASE_URL } = process.env;

const UploadFile = () => {
    const [workflows, setWorkflows] = useState([]);
    const [selectedWorkflowID, setSelectedWorkflowID] = useState("");
    const [selectedWorkflowName, setSelectedWorkflowName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [manualData, setManualData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getWorkflows();
    }, []);

    // AUTO LOAD DATA FOR FIRST WORKFLOW
    useEffect(() => {
        if (workflows.length && selectedWorkflowID && selectedWorkflowName) {
            fetchManualData(selectedWorkflowID, selectedWorkflowName);
        }
    }, [selectedWorkflowID]);

    const getWorkflows = async () => {
        try {
            const url = `${REACT_APP_API_BASE_URL}/get_wf_for_sp?user_id=${getCookie("sub")}`;
            const response = await axios.get(url, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: AuthService.getAccessToken(),
                    access_token: AuthService.getAccessToken(),
                },
            });

            setWorkflows(response.data.data);

            if (response.data.data.length) {
                const first = response.data.data[0];
                setSelectedWorkflowID(first.workflow_id);
                setSelectedWorkflowName(first.workflow_name);
            }

        } catch (error) {
            console.error("Error fetching workflows:", error.message);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setManualData([]);
        setShowTable(true);
    };

    const fetchManualData = async (workflowId, workflowName) => {
        try {

            const url = `${REACT_APP_API_BASE_URL}/get_fp?workflow_id=${workflowId}`;
            setLoading(true);

            const response = await axios.get(url, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: AuthService.getAccessToken(),
                    access_token: AuthService.getAccessToken(),
                },
            });

            if (response.data?.data?.length) {

                const cleaned = [];
                const seen = new Set();

                response.data.data.forEach((item) => {
                    item.skus_data.forEach((sku) => {

                        const key = `${item.level5}-${sku.sku}-${sku.week}`;

                        if (!seen.has(key)) {

                            seen.add(key);

                            cleaned.push({
                                workflow_name: workflowName,
                                sku: sku.sku,
                                week: sku.week,
                                forecast: String(sku.forecast),
                            });
                        }
                    });
                });

                // pivot to wide format
                const pivoted = {};
                const weekSet = new Set();

                cleaned.forEach((row) => {
                    const key = `${row.workflow_name}-${row.sku}`;

                    weekSet.add(row.week);

                    if (!pivoted[key]) {
                        pivoted[key] = {
                            workflow_name: row.workflow_name,
                            sku: row.sku,
                        };
                    }

                    pivoted[key][row.week] = row.forecast;
                });

                // sort weeks properly (12-2025 → 01-2026 → 02-2026)
                const sortedWeeks = Array.from(weekSet).sort((a, b) => {
                    const [m1, y1] = a.split("-");
                    const [m2, y2] = b.split("-");

                    const d1 = new Date(`${y1}-${m1}-01`);
                    const d2 = new Date(`${y2}-${m2}-01`);

                    return d1 - d2;
                });

                // rebuild rows with ordered keys
                const orderedRows = Object.values(pivoted).map((row) => {
                    const ordered = {
                        sku: row.sku,
                    };

                    sortedWeeks.forEach((week) => {
                        ordered[week] = row[week] || "";
                    });

                    return ordered;
                });

                setManualData(orderedRows);

                setSelectedFile(null);
                setShowTable(true);
                setLoading(false);
            }

        } catch (error) {

            console.error("Error fetching manual data:", error.message);
            setLoading(false);

        }
    };

    const generateExcelFile = () => {

        if (!manualData.length) return null;

        const weeks = Array.from(
            manualData.reduce((set, row) => {

                Object.keys(row).forEach((key) => {

                    if (/\d{2}-\d{4}/.test(key)) {

                        set.add(key);

                    }
                });

                return set;

            }, new Set())
        ).sort();

        const headers = ["sku", ...weeks];

        const rows = manualData.map((row) => {

            const rowData = { sku: row.sku };

            weeks.forEach((week) => {

                rowData[week] = row[week] ? Number(row[week]) : null;

            });

            return rowData;

        });

        const ws = XLSX.utils.json_to_sheet(rows, { header: headers });

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Forecast");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        return new File([excelBuffer], "forecast.xlsx", {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

    };

    const handleSubmit = async () => {

        try {

            let fileToUpload = selectedFile;

            if (!selectedFile && manualData.length > 0) {

                fileToUpload = generateExcelFile();

            }

            if (!fileToUpload) {

                alert("Please select a workflow and provide data!");

                return;

            }

            const url =
                `${REACT_APP_API_BASE_URL}/upload_forecast` +
                `?user_id=${encodeURIComponent(getCookie("sub"))}` +
                `&workflow_id=${encodeURIComponent(selectedWorkflowID)}` +
                `&workflow_name=${encodeURIComponent(selectedWorkflowName)}`;

            const formData = new FormData();

            formData.append("file", fileToUpload);

            const response = await axios.post(url, formData, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                    Authorization: AuthService.getAccessToken(),
                    access_token: AuthService.getAccessToken(),
                },
            });

            if (response.status === 200) {

                displayMessage("success", response.data.message, "");

            } else {

                displayMessage("danger", response.data.message, "");

            }

        } catch (error) {

            console.error("Error uploading file:", error);

            alert("An error occurred while uploading the file.");

        }
    };

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
            padding: "50px 50px 60px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            border: "2px solid #1F4280",
            borderRadius: "24px",
            overflow: "hidden",
        },
        heading: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '36px',
            fontWeight: '700',
            color: '#032B4E',
            textAlign: 'center',
            marginBottom: '50px',
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
        },
        label: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: '700',
            color: '#032B4E',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        inputField: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
        },
        sectionTitle: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '22px',
            fontWeight: '600',
            color: '#032B4E',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card} className="mycontainer manage-workflow-box">

                <h2 style={styles.heading}>
                    <MdUploadFile style={{ fontSize: '42px', color: '#c79838' }} />
                    Upload Planned Data
                </h2>

                <div className="flex flex-col md:flex-row gap-8 items-end mb-8">

                    <div className="flex-1 w-full">

                        <label style={styles.label}>
                            <FaProjectDiagram style={{ fontSize: '18px', color: '#c79838' }} />
                            Select Workflow
                        </label>

                        <select
                            value={selectedWorkflowName}
                            className="w-full border-2 border-[#1F4280] rounded-lg px-4 py-3 text-[#032B4E] bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4280] transition-all duration-200 shadow-sm hover:shadow-md"
                            style={styles.inputField}
                            onChange={(e) => {

                                const selectedWorkflow = workflows.find(
                                    (wf) => wf.workflow_name === e.target.value
                                );

                                if (selectedWorkflow) {

                                    setSelectedWorkflowID(selectedWorkflow.workflow_id);
                                    setSelectedWorkflowName(selectedWorkflow.workflow_name);

                                    setSelectedFile(null);
                                    setManualData([]);
                                    setShowTable(false);

                                    fetchManualData(
                                        selectedWorkflow.workflow_id,
                                        selectedWorkflow.workflow_name
                                    );
                                }
                            }}
                        >

                            {workflows.map((workflow, index) => (

                                <option key={index} value={workflow.workflow_name}>
                                    {workflow.workflow_name}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="flex-1 w-full">

                        <label style={styles.label}>
                            <FaFileExcel style={{ fontSize: '18px', color: '#c79838' }} />
                            Select File
                        </label>

                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            className="w-full border-2 border-[#1F4280] rounded-lg px-4 py-3 text-[#032B4E] bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4280] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                            style={styles.inputField}
                            onChange={handleFileChange}
                        />

                    </div>

                </div>

                {showTable && selectedFile && (

                    <div className="mt-10 bg-white p-8 rounded-2xl border-2 border-[#1F4280] shadow-lg">

                        <h3 style={styles.sectionTitle}>
                            <FaTable style={{ color: '#c79838' }} />
                            File Preview
                        </h3>

                        <DisplayExcel file={selectedFile} />

                    </div>

                )}

                {showTable && !selectedFile && manualData.length > 0 && (

                    <div className="mt-10 bg-white p-8 rounded-2xl border-2 border-[#1F4280] shadow-lg">

                        {loading ? (

                            <p
                                className="text-[#032B4E] text-center font-semibold text-lg"
                                style={styles.inputField}
                            >
                                Loading data...
                            </p>

                        ) : (

                            <>
                                <h3 style={styles.sectionTitle}>
                                    <FaCheckCircle style={{ color: '#c79838' }} />
                                    Workflow Data
                                </h3>

                                <DisplayExcel data={manualData} onEdit={setManualData} />

                            </>

                        )}

                    </div>

                )}

                {showTable && (selectedFile || manualData.length > 0) && (

                    <div className="flex flex-col items-center justify-center mt-8 gap-6">

                        <button
                            onClick={handleSubmit}
                            className="bg-[#b8842f] hover:bg-[#a67d2e] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                            style={styles.inputField}
                        >

                            <FaCloudUploadAlt style={{ fontSize: '20px' }} />
                            Upload

                        </button>

                    </div>

                )}

            </div>
        </div>
    );
};

export default UploadFile;