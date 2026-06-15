import React, { useContext, useEffect, useState } from "react";
import models from "../../Utils/SampleDataModels.json";
import { useFormContext } from "../createworkflow/FormContext";
import { ErrorBoundary } from "../common/ErrorBoundary";
import {
  ArrowRight,
  TrendingUp,
  Target,
  Calendar,
  CloudSun,
  Repeat,
  ArrowBigDown,
  ArrowBigUp,
} from "lucide-react";
import MenuContext from "./MenuContext";

export default function Stage6() {
  const { formData, updateFormData } = useFormContext();
  const [selectedModels, setSelectedModels] = useState([]);
  const [expandedModel, setExpandedModel] = useState(null);
  const { setActiveTab } = useContext(MenuContext);

  console.log("formData at Stage6:", formData);
  

  // Toggle selection for multi-select
  const handleSelect = (modelName) => {
    setSelectedModels((prev) =>
      prev.includes(modelName)
        ? prev.filter((name) => name !== modelName)
        : [...prev, modelName]
    );
  };

  // Toggle expand/collapse model details
  const handleExpand = (modelName) =>
    setExpandedModel(expandedModel === modelName ? null : modelName);

  // Update formData.stage6.selectedModels on selection change
  useEffect(() => {
    updateFormData("stage6", {
      ...formData.stage6,
      models: selectedModels,
    });
  }, [selectedModels]);

  // Initialize selection from formData
  useEffect(() => {
  const modelsFromForm = formData.stage6?.models;

  if (Array.isArray(modelsFromForm)) {
    setSelectedModels(modelsFromForm);
  } else if (typeof modelsFromForm === "string" && modelsFromForm.length > 0) {
    // safety if cloneWorkflow didn’t run yet
    const parsed = modelsFromForm
      .replace(/[{}]/g, "")
      .split(",")
      .map(m => m.trim())
      .filter(Boolean);
    setSelectedModels(parsed);
  }
}, []);


  const getModelIcon = (name) => {
    const base = "w-20 h-20 drop-shadow-md";
    switch (name.toUpperCase()) {
      case "ARIMA":
        return <TrendingUp className={`${base} text-[#FFA500]`} />;
      case "ARIMAX":
        return <Target className={`${base} text-[#A855F7]`} />;
      case "SARIMA":
        return <Calendar className={`${base} text-[#22C55E]`} />;
      case "SARIMAX":
        return <CloudSun className={`${base} text-[#3B82F6]`} />;
      case "XGBOOST":
        return <Repeat className={`${base} text-[#FACC15]`} />;
      case "LIGHTGBM":
        return <Repeat className={`${base} text-[#FACC15]`} />;
      default:
        return <TrendingUp className={`${base} text-gray-400`} />;
    }
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
                  className={`flex items-center justify-center rounded-full ${
                    step === 6 ? 'bg-[#032B4E] text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                  style={{
                    width: '36px',
                    height: '36px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    border: step === 6 ? '2px solid #032B4E' : '2px solid #d1d5db'
                  }}
                >
                  {step}
                </div>
                {index < 6 && (
                  <div
                    className={`h-0.5 ${step < 6 ? 'bg-[#032B4E]' : 'bg-gray-300'}`}
                    style={{ width: '40px' }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Header */}
          <h2 className="text-[30px] text-[#0F1116] text-left mb-8" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            Step 6:Model Selection
          </h2>

          {/* Models Grid */}
          <div className="flex flex-col items-center gap-12">
            {/* Row 1 - 3 Models */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
              {models.map((model) => {
                const isSelected = selectedModels.includes(model.name);
                const isExpanded = expandedModel === model.name;
                return (
                  <ModelCard
                    key={model.id}
                    model={model}
                    isSelected={isSelected}
                    isExpanded={isExpanded}
                    onSelect={() => handleSelect(model.name)}
                    onExpand={() => handleExpand(model.name)}
                    getModelIcon={getModelIcon}
                  />
                );
              })}
            </div>

            {/* Row 2 - 2 Models (Centered) */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-center">
              {models.slice(3, 6).map((model) => {
                const isSelected = selectedModels.includes(model.name);
                const isExpanded = expandedModel === model.name;
                return (
                  <ModelCard
                    key={model.id}
                    model={model}
                    isSelected={isSelected}
                    isExpanded={isExpanded}
                    onSelect={() => handleSelect(model.name)}
                    onExpand={() => handleExpand(model.name)}
                    getModelIcon={getModelIcon}
                  />
                );
              })}
            </div> */}
          </div>

          {/* ✅ Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
            <button
              onClick={() => setActiveTab("Stage5")}
              className="px-8 py-2.5 bg-[#b8842f] hover:bg-[#a67d2e] text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
            >
              ← Back
            </button>

            <button
              onClick={() => setActiveTab("Stage7")}
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

/* --- Card Component --- */
const ModelCard = ({
  model,
  isSelected,
  isExpanded,
  onSelect,
  onExpand,
  getModelIcon,
}) => {
  return (
    <div
      className={`relative rounded-2xl transition-all duration-300 transform cursor-pointer overflow-hidden
        border-2 border-[#1F4280] shadow-lg hover:shadow-2xl hover:-translate-y-2
        ${isSelected ? 'bg-white text-[#0F1116]' : 'text-white'}`}
      style={{
        background: isSelected
          ? '#fff'
          : 'linear-gradient(135deg, #021a30 0%, #032B4E 30%, #032B4E 70%, #021a30 100%)',
        boxShadow: isSelected
          ? "0 20px 40px rgba(241,94,34,0.32), 0 12px 28px rgba(241,94,34,0.22), 0 4px 12px rgba(241,94,34,0.14)"
          : "0 8px 20px rgba(31, 66, 128, 0.18), 0 4px 10px rgba(31, 66, 128, 0.09)"
      }}
    >
      {/* Subtle gradient overlay for depth */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none ${isSelected ? '' : 'bg-gradient-to-br from-[#274a7c] via-[#1F4280] to-[#163464] opacity-60'}`}
      ></div>

      <div className="relative z-10 flex flex-col items-center p-8 text-center">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-md bg-white"
        >
          {getModelIcon(model.name)}
        </div>

        <h3
          className={`text-[20px] mt-6 ${isSelected ? 'text-[#0F1116]' : 'text-white'}`}
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
        >
          {model.name}
        </h3>

        <p
          className={`text-[14px] leading-relaxed mt-3 ${isSelected ? 'text-[#0F1116]' : 'text-white'}`}
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
        >
          {isExpanded ? model.description : model.description.slice(0, 130) + "..."}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className={`flex items-center gap-2 px-4 py-2 w-30 rounded-lg border transition-all duration-300 ${isSelected
              ? "border-[#1F4280] text-[#1F4280] hover:bg-[#1F4280] hover:text-white"
              : "border-[#b8842f] text-[#b8842f] hover:bg-[#b8842f] hover:text-white"
              }`}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500 }}
          >
            {isExpanded ? (
              <>
                <ArrowBigUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ArrowBigDown className="w-4 h-4" />
                Show More
              </>
            )}

          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`px-4 py-2 rounded-lg shadow transition-all duration-300 ${isSelected
              ? "bg-[#b8842f] text-white hover:bg-[#a67d2e]"
              : "bg-[#b8842f] text-white hover:bg-[#a67d2e]"
              }`}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
          >
            {isSelected ? "Deselect" : "Select"}
          </button>
        </div>
        
        {/* Inner shadow for depth */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none" 
          style={{
            boxShadow: isSelected 
              ? "inset 0 2px 8px rgba(0, 0, 0, 0.05)" 
              : "inset 0 1px 4px rgba(0, 0, 0, 0.03)"
          }}
        ></div>
      </div>
    </div>
  );
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
  },
  card: {
    width: "95%",
    maxWidth: 1500,
    background: "#fbfcf7ff",
    padding: "40px 40px 60px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    border: "2px solid #1F4280",
    overflow: "hidden",
  },
};
