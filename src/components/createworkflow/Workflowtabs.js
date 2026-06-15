import React, { useContext } from 'react';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import Stage4 from './Stage4';
import Stage5 from './Stage5';
import Stage6 from './Stage6';
import Stage7 from './Stage7';

import MenuContext from './MenuContext';
import { useFormContext } from "./FormContext";
import { validateStage1, validateStage2 } from './validation';

const steps = [
  { label: 'Setup & Scope' },
  { label: 'Data & Time Configuration' },
  { label: 'Define Dimensions' },
  { label: 'Data Validation' },
  { label: 'Event & Seasonality Layer' },
  { label: 'Model Selection' },
  { label: 'Review & Execute' },
];

function Workflowtabs() {
  const { activeTab, setActiveTab } = useContext(MenuContext);
  const { formData, updateFormData } = useFormContext();

  const getStepIndex = (tab) => parseInt(tab.replace('Stage', ''), 10) - 1;

  const handleStepClick = (idx) => {
    const menu = `Stage${idx + 1}`;
    const activeTabNumber = getStepIndex(activeTab) + 1;

    if (activeTabNumber === 1) {
      const { isValid, errors } = validateStage1(formData.stage1);
      updateFormData("stage1", { ...formData.stage1, isValid, errors });
    } else if (activeTabNumber === 2) {
      const { isValid, errors } = validateStage2(formData.stage2);
      updateFormData("stage2", { ...formData.stage2, isValid, errors });
    }

    setActiveTab(menu);
  };

  const renderStepContent = () => {
    switch (activeTab) {
      case 'Stage1': return <Stage1 />;
      case 'Stage2': return <Stage2 />;
      case 'Stage3': return <Stage3 />;
      case 'Stage4': return <Stage4 />;
      case 'Stage5': return <Stage5 />;
      case 'Stage6': return <Stage6 />;
      case 'Stage7': return <Stage7 />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px] bg-white rounded-xl shadow-md overflow-hidden">
      {/* Sidebar Steps */}
      <div className="w-full lg:w-[250px] bg-[#fbfcf7ff] p-6">
        <h2 className="text-lg lg:text-2xl font-bold text-[#0F1116] mb-10 tracking-wide">
          Workflow Steps
        </h2>
        <ul className="space-y-12">
          {steps.map((step, idx) => {
            const isActive = activeTab === `Stage${idx + 1}`;
            return (
              <li
                key={idx}
                className={`flex items-center gap-5 px-5 py-5 rounded-lg transition-all duration-150 font-bold tracking-tight text-xl cursor-pointer
                  ${isActive
                    ? "bg-[#1F4280] text-white shadow-xl"
                    : "bg-white text-[#1F4280] border-2 border-[#1F4280] shadow-md hover:bg-[#1F4280] hover:text-white hover:shadow-lg"
                  }`}
                onClick={() => handleStepClick(idx)}
              >
                <span
                  className={`w-11 h-11 flex items-center justify-center rounded-full text-lg font-bold border-2 shrink-0"
                    ${isActive
                      ? "bg-[#f79658] text-[#032B4E] border-[#f79658]"
                      : "bg-[#E8EEF7] text-[#1F4280] border-[#1F4280]"
                    }`}
                >
                  {idx + 1}
                </span>
                <span className="whitespace-normal">{step.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Step Content */}
      <div className="flex-1 px-5 bg-[#f4f3ef] w-[50px]">
        {renderStepContent()}
      </div>
    </div>
  );
}

export default Workflowtabs;
