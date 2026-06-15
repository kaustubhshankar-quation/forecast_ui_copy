import React, { useState, useEffect, useRef, useContext } from "react";
import { useFormContext } from "../createworkflow/FormContext";
import MenuContext from "../createworkflow/MenuContext";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { fetchWorkflows, stage1fileupload } from "../../services/ApiWorkflow";
import { getCookie } from "../../services/DataRequestService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AuthService from "../../services/AuthService";
import { getValue } from "../../Utils/helper";
import UserService from "../../services/UserService";
import WorkflowTableModal from "./WorkflowTableModal";
import { useNavigate } from "react-router-dom";
import QCModal from "../QC/QCModal";
import Base from "../QC/Base";

const { REACT_APP_API_BASE_URL } = process.env;

export default function Stage1() {
  const refWorkflowName = useRef();
  const refLblerrWorkflowName = useRef();
  const { formData, updateFormData } = useFormContext();
  const { setActiveTab } = useContext(MenuContext);
  const queryClient = useQueryClient();

  const [existingWorkFlowData, setExistingWorkflowData] = useState(null);
  const [uploadOption, setUploadOption] = useState("use_existing");
  const [workFlowdata, setWorkFlowData] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()


  const [openQC, setOpenQC] = useState(false);


  // inside Stage1 component
  useEffect(() => {
    // 1) load cached workflows immediately (if any)
    const cached = localStorage.getItem("clone_workflows_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setWorkFlowData(parsed);
        }
      } catch (e) {
        console.error("Error parsing cached workflows", e);
      }
    }

    // 2) fetch latest in background
    getExistingWorkflows();
    getData();
  }, []);

  const getData = async () => {
    try {
      const url = `${REACT_APP_API_BASE_URL}/get_workflows?user_id=${getCookie(
        "sub"
      )}`;
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          access_token: AuthService.getAccessToken(),
        },
      });

      const tempArr = (response.data?.data || []).slice().reverse();

      // read previous cached array (from state OR localStorage)
      const prev =
        workFlowdata && workFlowdata.length
          ? workFlowdata
          : (() => {
            const cached = localStorage.getItem("clone_workflows_cache");
            if (!cached) return [];
            try {
              const parsed = JSON.parse(cached);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          })();

      const prevStr = JSON.stringify(prev);
      const nextStr = JSON.stringify(tempArr);

      // only update state + cache if changed
      if (prevStr !== nextStr) {
        setWorkFlowData(tempArr);
        localStorage.setItem("clone_workflows_cache", nextStr);
      }
    } catch (error) {
      console.error("Error fetching workflows:", error.message);
    }
  };

  const prefetchWorkflows = () => {
    queryClient.prefetchQuery({
      queryKey: ["workflows", getCookie("sub")],
      queryFn: fetchWorkflows,
    });
  };

  // This is only for name duplicate check (wf_name_check equivalent)
  const { data: fetchedworkflows = [] } = useQuery({
    queryKey: ["workflows", getCookie("sub")],
    queryFn: fetchWorkflows,
    staleTime: 60000,
    enabled: true,
  });

  // 🔁 Re‑run name duplicate validation when name changes (e.g. after clone)
  useEffect(() => {
    const name = formData.stage1?.workflow_name?.trim();
    if (!name || !refLblerrWorkflowName.current) return;

    const alreadyExists = fetchedworkflows.some(
      (wf) => wf.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      refLblerrWorkflowName.current.textContent =
        "Workflow name already exists!";
      refLblerrWorkflowName.current.classList.remove("hidden");
    } else {
      refLblerrWorkflowName.current.classList.add("hidden");
    }
  }, [formData.stage1?.workflow_name, fetchedworkflows]);

  const handleWorkflowNameChange = (e) => {
    console.log("formData before name change:", formData);

    const { name, value } = e.target;
    const alreadyExists = fetchedworkflows.some(
      (wf) => wf.toLowerCase() === value.toLowerCase()
    );

    updateFormData("stage1", {
      ...formData.stage1,
      [name]: value,
    });

    if (alreadyExists) {
      refLblerrWorkflowName.current.textContent =
        "Workflow name already exists!";
      refLblerrWorkflowName.current.classList.remove("hidden");
    } else {
      refLblerrWorkflowName.current.classList.add("hidden");
    }
  };

  const handleWorkflowDescriptionChange = (e) => {
    const { name, value } = e.target;
    updateFormData("stage1", {
      ...formData.stage1,
      [name]: value,
    });
  };

  const handleUploadOptionChange = (e) => {
    setUploadOption(e.target.value);
    updateFormData("stage1", {
      ...formData.stage1,
      file_upload_option: e.target.value === "upload_new" ? "New" : "Existing",
    });
  };

  const getExistingWorkflows = async () => {
    const user_id = getCookie("sub");
    const url = `${REACT_APP_API_BASE_URL}/getSalesDataInfo?user_id=${user_id}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: AuthService.getAccessToken(),
          access_token: AuthService.getAccessToken(),
        },
      });
      setExistingWorkflowData(response.data.data);
    } catch (error) {
      console.error("Error fetching workflows:", error.message);
    }
  };

  const forecastTemplates = [
    { label: "New Product Launch", value: "new_product" },
    { label: "Seasonal Promotion", value: "seasonal_promotion" },
    { label: "Stable Product Line", value: "stable_product" },
    { label: "Start from Scratch", value: "scratch" },
  ];

  const handleTemplateChange = (e) => {
    updateFormData("stage1", {
      ...formData.stage1,
      forecast_template: e.target.value,
    });
  };

  const handleNext = () => {
    if (!formData.stage1?.workflow_name) {
      refLblerrWorkflowName.current.textContent = "* Required";
      refLblerrWorkflowName.current.classList.remove("hidden");
      refWorkflowName.current.focus();
      return;
    }
    setActiveTab("Stage2");
  };

  return (
    <ErrorBoundary>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          {/* Progress Indicator */}
          <div className="flex items-center justify-start mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center rounded-full ${step === 1
                    ? "bg-[#032B4E] text-white"
                    : "bg-gray-200 text-gray-600"
                    }`}
                  style={{
                    width: "36px",
                    height: "36px",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    border:
                      step === 1 ? "2px solid #032B4E" : "2px solid #d1d5db",
                  }}
                >
                  {step}
                </div>
                {index < 6 && (
                  <div
                    className={`h-0.5 ${step < 1 ? "bg-[#032B4E]" : "bg-gray-300"
                      }`}
                    style={{ width: "40px" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Header */}
          <h2
            className="text-[30px] text-[#0F1116] text-left mb-8"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
          >
            Step 1: Initialize Workflow
          </h2>

          {/* Workflow Name */}
          <div className="mb-6">
            <label
              className="block text-[20px] text-[#0F1116] mb-2"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
            >
              Forecast Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={refWorkflowName}
              name="workflow_name"
              className="w-full px-5 py-4 border-2 border-[#032B4E] rounded-xl text-[#0d1b4c] bg-[#f8fafc] outline-none focus:border-[#032B4E] transition-shadow shadow-md focus:shadow-lg"
              placeholder="Enter Here"
              value={formData.stage1?.workflow_name || ""}
              onChange={handleWorkflowNameChange}
              onFocus={prefetchWorkflows}
              autoComplete="off"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
            />
            <span
              ref={refLblerrWorkflowName}
              className="text-red-500 text-sm hidden mt-1"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
            >
              * Required
            </span>
          </div>

          {/* Description */}
          <div className="mb-10">
            <label
              className="block text-[20px] text-[#0F1116] mb-2"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="workflow_description"
              className="w-full px-5 py-4 border-2 border-[#032B4E] rounded-xl text-[#0d1b4c] bg-[#f8fafc] outline-none focus:border-[#032B4E] min-h-[90px] transition-shadow shadow-md focus:shadow-lg"
              placeholder="Enter Here"
              value={formData.stage1?.workflow_description || ""}
              onChange={handleWorkflowDescriptionChange}
              rows={3}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
            />
          </div>

          {/* Forecast Options */}
          <div className="mb-10">
            <h3
              className="text-[20px] text-[#0F1116] mb-4"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
            >
              Forecast Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-4 border-2 border-[#032B4E] bg-[#f8fafc] hover:bg-[#e4f0ff] px-6 py-6 rounded-xl w-full shadow-md hover:shadow-lg transition font-semibold"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#0F1116",
                }}
              >
                <iconify-icon
                  icon="mdi:content-copy"
                  width="32"
                  height="32"
                />
                Clone Existing Forecast
              </button>

              <WorkflowTableModal
                isOpen={open}
                onClose={() => setOpen(false)}
                workFlowPageData={workFlowdata}
              />
            </div>
          </div>

          {/* Upload Option Toggle */}
          <div className="mb-10">
            <h3
              className="text-[20px] text-[#0F1116] mb-4"
              style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}
            >
              Data Source
            </h3>
            <div className="flex items-center gap-10 mb-6">
              <label
                className="flex items-center gap-3 cursor-pointer text-[#0F1116]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <input
                  type="radio"
                  name="upload_option"
                  value="upload_new"
                  checked={uploadOption === "upload_new"}
                  onChange={handleUploadOptionChange}
                  className="w-6 h-6 accent-[#202b70]"
                />
                Upload New
              </label>
              <label
                className="flex items-center gap-3 cursor-pointer text-[#0F1116]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <input
                  type="radio"
                  name="upload_option"
                  value="use_existing"
                  checked={uploadOption === "use_existing"}
                  onChange={handleUploadOptionChange}
                  className="w-6 h-6 accent-[#202b70]"
                />
                Use Existing
              </label>
            </div>

            {uploadOption === "use_existing" ? (
              <div className="border-2 border-[#032B4E] rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#032B4E] text-white">
                    <tr>
                      <th
                        className="py-3 px-5 text-[14px]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Dataset Name
                      </th>
                      <th
                        className="py-3 px-5 text-[14px]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Data Cadence
                      </th>
                      <th
                        className="py-3 px-5 text-[14px]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Start Date
                      </th>
                      <th
                        className="py-3 px-5 text-[14px]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        End Date
                      </th>
                      <th
                        className="py-3 px-5 text-[14px]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Remarks
                      </th>
                      <th
                        className="py-3 px-5 text-[14px]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Select
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#f7f8fa] text-[#333]">
                    {existingWorkFlowData && existingWorkFlowData.length > 0 ? (
                      existingWorkFlowData.map((item, index) => (
                        <tr
                          key={index}
                          className="border-t border-gray-200 hover:bg-[#e8f0fe] transition"
                        >
                          <td
                            className="py-3 px-5 text-[14px]"
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 400,
                            }}
                          >
                            {item.dataset_name}
                          </td>
                          <td
                            className="py-3 px-5 text-[14px]"
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 400,
                            }}
                          >
                            {item.data_cadence}
                          </td>
                          <td
                            className="py-3 px-5 text-[14px]"
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 400,
                            }}
                          >
                            {item.start_date}
                          </td>
                          <td
                            className="py-3 px-5 text-[14px]"
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 400,
                            }}
                          >
                            {item.end_date}
                          </td>
                          <td
                            className="py-3 px-5 text-[14px]"
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 400,
                            }}
                          >
                            {item.remark}
                          </td>
                          <td className="py-3 px-5">
                            <input
                              type="radio"
                              name="clone_forecast_group"
                              value={item.data_upload_id}
                              checked={
                                formData.stage1?.data_upload_id ===
                                item.data_upload_id
                              }
                              onChange={() =>
                                updateFormData("stage1", {
                                  ...formData.stage1,
                                  data_upload_id: item.data_upload_id,
                                })
                              }
                              className="form-radio text-[#202b70] accent-[#202b70] h-7 w-7 cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-5 text-[#555] text-[14px]"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                          }}
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
                <button
                  // onClick={() => setOpenQC(true)}
                  
                  type="button"
                  className="flex items-center justify-center gap-3 border-2 border-[#032B4E] bg-[#6b7280] px-5 py-6 rounded-xl w-full shadow-md hover:shadow-lg transition text-white cursor-not-allowed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  <iconify-icon icon="mdi:upload" width="36" height="36" />
                  Upload dataset
                </button>
                <QCModal open={openQC} onClose={() => setOpenQC(false)}>
                  <Base workflow_name={refWorkflowName.current.value} description={formData.stage1?.workflow_description} />
                </QCModal>
              </div>
            )}
          </div>

          {/* Next Button */}
          <div className="flex justify-end mt-10">
            <button
              onClick={handleNext}
              className="px-8 py-2.5 bg-[#b8842f] text-white rounded-lg shadow-lg hover:bg-[#a67d2e] hover:shadow-xl transition-all"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

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
