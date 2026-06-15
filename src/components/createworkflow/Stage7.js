import React, { useContext, useState } from "react";
import { useFormContext } from "../createworkflow/FormContext";
import MenuContext from "./MenuContext";
import { displayMessage } from "../../Utils/helper";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { SubmitWorkflowPayloadPrep } from "./helper";
import { sumbitWorkflow } from "../../services/ApiWorkflow";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import {
  ClipboardList,
  CalendarRange,
  Database,
  Layers,
  Brain,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export default function Stage7() {
  const { setActiveTab } = useContext(MenuContext);
  const { formData } = useFormContext();
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const EditButtonClickHandler = () => setActiveTab("Stage6");

  const SubmitButtonClickHandler = async () => {
    if (!formData.stage1?.workflow_name) {
      displayMessage("danger", "Workflow name is mandatory");
      return;
    }
    if (!formData.stage1?.data_upload_id) {
      displayMessage("danger", "Please choose upload type for file upload");
      return;
    }
    if (!formData.stage2?.data_frequency) {
      displayMessage("danger", "Data Frequency is mandatory");
      return;
    }
    if (!formData.stage2?.forecast_period) {
      displayMessage("danger", "Forecast Period is mandatory");
      return;
    }
    if (!formData.stage3?.products?.length) {
      displayMessage("danger", "Please select at least one product");
      return;
    }
    if (!formData.stage3?.geography?.length) {
      displayMessage("danger", "Please select at least one geography");
      return;
    }
    if (!formData.stage4?.combinations?.length) {
      displayMessage("danger", "Please select at least one combination");
      return;
    }
    if (!formData.stage6?.models?.length) {
      displayMessage("danger", "Please select at least one model");
      return;
    }

    setIsLoading(true);
    const payload = SubmitWorkflowPayloadPrep(formData);
    const result = await sumbitWorkflow(payload);

    if (!result) {
      displayMessage("danger", "Error occurred while submitting workflow");
    } else {
      sessionStorage.clear("formData");
      navigate("/ManageWorkflow");
      displayMessage("success", "Workflow submitted successfully");
    }

    setIsLoading(false);
  };

  /** Each section block */
  const Section = ({ icon: Icon, title, children }) => (
    <div className="rounded-2xl bg-white/95 border-2 border-[#032B4E] shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="flex items-center gap-3 bg-[#032B4E] text-white px-6 py-3 text-[20px] tracking-wide" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
        <Icon className="w-11 h-11" />
        {title}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">{children}</div>
    </div>
  );

  /** Each info item (label + value) */
  const Item = ({ label, value }) => (
    <div className="flex flex-col bg-[#f8fafc] border border-[#032B4E]/30 rounded-xl p-3 hover:bg-[#eef6ff] hover:border-[#032B4E] transition-all duration-300">
      <span className="text-[#032B4E] text-[15px] mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{label}</span>
      <span className="text-[16.5px] text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{value || "-"}</span>
    </div>
  );


  return (
    <ErrorBoundary>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          {/* Progress Indicator */}
          <div className="flex items-center justify-start mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center rounded-full ${
                    step === 7 ? 'bg-[#032B4E] text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                  style={{
                    width: '36px',
                    height: '36px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    border: step === 7 ? '2px solid #032B4E' : '2px solid #d1d5db'
                  }}
                >
                  {step}
                </div>
                {index < 6 && (
                  <div
                    className={`h-0.5 ${step < 7 ? 'bg-[#032B4E]' : 'bg-gray-300'}`}
                    style={{ width: '40px' }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <h1 className="text-[30px] text-[#0F1116] text-left mb-8" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            Step 7: Workflow Summary
          </h1>

          <div className="space-y-8">
            <Section icon={ClipboardList} title="Initialize Workflow">
              <Item label="Workflow Name" value={formData.stage1?.workflow_name} />
              <Item label="Description" value={formData.stage1?.workflow_description} />
              {/* <Item label="File Upload Type" value={formData.stage1?.file_upload_option} />
              {formData.stage1?.file_upload_option?.toLowerCase() === "new" && (
                <>
                  <Item
                    label="Forecast File Uploaded"
                    value={formData.stage1?.file_upload_status?.[0]?.success ? "✅ Yes" : "❌ No"}
                  />
                  <Item
                    label="EOQ File Uploaded"
                    value={formData.stage1?.file_upload_status?.[1]?.success ? "✅ Yes" : "❌ No"}
                  />
                  <Item
                    label="Inventory File Uploaded"
                    value={formData.stage1?.file_upload_status?.[2]?.success ? "✅ Yes" : "❌ No"}
                  />
                  <Item
                    label="Safety Stock File Uploaded"
                    value={formData.stage1?.file_upload_status?.[3]?.success ? "✅ Yes" : "❌ No"}
                  />
                </>
              )} */}
            </Section>

            <Section icon={CalendarRange} title="Temporal Settings">
              <Item label="Data Frequency" value={formData.stage2?.data_frequency} />
              <Item label="Train Period (%)" value={formData.stage2?.train_percentage} />
              <Item label="Test Period (%)" value={formData.stage2?.test_percentage} />
              <Item label="Forecast Frequency" value={formData.stage2?.forecast_frequency} />
              <Item label="Forecast Period" value={formData.stage2?.forecast_period} />
            </Section>

            <Section icon={Database} title="Data Selection">
              <Item label="Selected SKUs" value={formData.stage3?.products?.length} />
              <Item label="Selected Locations" value={formData.stage3?.geography?.length} />
            </Section>

            <Section icon={Layers} title="Data Availability">
              <Item label="Selected Combinations" value={formData.stage4?.combinations?.length} />
            </Section>

            <Section icon={Brain} title="Model Selection">
              <Item label="Models Chosen" value={formData.stage6?.models?.join(", ")} />
            </Section>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader size="large" />
            </div>
          ) : (
            <div className="flex justify-center gap-8 mt-10">
              <button
                onClick={EditButtonClickHandler}
                className="flex items-center gap-2 px-7 py-2.5 rounded-lg bg-[#b8842f] hover:bg-[#a67d2e] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 600 }}
              >
                <ArrowLeft className="w-7 h-7" />
                Edit
              </button>

              <button
                onClick={SubmitButtonClickHandler}
                className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-[#b8842f] text-white shadow-lg hover:bg-[#a67d2e] transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 600 }}
              >
                Submit
                <ArrowRight className="w-7 h-7" />
              </button>
            </div>
          )}
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
    background: "linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)",
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
