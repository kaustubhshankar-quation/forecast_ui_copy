// Stage2.jsx
import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { useFormContext } from "../createworkflow/FormContext";
import CustomizedDialogs from "./CustomizedDialogs";
import { ErrorBoundary } from "../common/ErrorBoundary";
import Select from "react-select";
import { FcDatabase } from "react-icons/fc";
import { MdCategory } from "react-icons/md";

import {
  DataFrequency,
  ForecastPeriods,
  GranularityList
} from "../../Utils/dataTemporialSettings";
import styled from "styled-components";
import { getForecastPeriods } from "../../services/ApiWorkflow";
import { setValue, isEmpty, displayMessage, generateMonthYearLabels } from "../../Utils/helper";
import { getDateRanges } from '../../services/ApiWorkflow';
import Loader from '../common/Loader'
import { toggleErrorVisibility } from "./helper";
import { DataContext } from './DataContext';
import { months, weeks } from '../../Utils/dataSeasonality'

// ADD: import MenuContext to control tab navigation
import MenuContext from "./MenuContext";

export default function Stage2() {

  const { formData, updateFormData } = useFormContext();
  const { activeTab, setActiveTab } = useContext(MenuContext);
  const [modalShow, setModalShow] = React.useState(false);

  console.log("Stage2 Rendered: ", formData);
  // State variables
  const [selDataFrequency, setSelDataFrequency] = useState(formData?.stage2?.data_frequency);
  const [selProductCategory, setSelProductCategory] = useState(formData?.stage2?.product_category);
  const [selForecastFrequency, setSelForecastFrequency] = useState(formData?.stage2?.forecast_frequency);
  const [disabledGranularity, setDisabledGranularity] = useState([]);
  const [defaultGranularity, setDefaultGranularity] = useState(formData?.stage2?.forecast_frequency);

  const [trainPercentage, setTrainPercentage] = useState(formData?.stage2?.train_percentage || 80);
  const [testPercentage, setTestPercentage] = useState(formData?.stage2?.test_percentage || 20);

  const [dateObject, setDateObject] = useState({});
  const [error, setError] = useState(null);
  const [isLoadingDateRange, setIsLoadingDateRange] = useState(false); // ✅ Specific loader for date range

  const trainPercentageRef = useRef();
  const testPercentageRef = useRef();

  const refDataFrequency = useRef(null);
  const refLblerrDataFrequency = useRef();
  const refForecastPeriod = useRef();
  const refLblerrForecastPeriod = useRef();
  const refLblerrProductCategory = useRef();

  const { products, isDataloading } = useContext(DataContext);
  const productCategories = useMemo(() => products?.data?.level1?.map(elem => { return { label: elem.name, value: elem.level1_id } }), [products]);

  // ✅ FIXED: Only load date range data
  useEffect(() => {
    const init = async () => {
      try {
        if (!formData?.stage1?.data_upload_id) {
          displayMessage('danger', 'Insufficient Data', 'Please Upload file in Initialize workflow');
          return;
        }

        setIsLoadingDateRange(true);
        let _dateObject = await getDateRanges(formData?.stage1?.data_upload_id);

        if (_dateObject) {
          setDateObject(_dateObject);
          setDate(_dateObject);
        } else {
          displayMessage('danger', 'Data Error', 'Failed to fetch date ranges');
        }
      } catch (err) {
        console.error("Error initializing Stage2:", err);
        displayMessage('danger', 'Initialization Error', err.message || 'Failed to initialize data');
        setError(err);
      } finally {
        setIsLoadingDateRange(false);
      }
    };

    init();
  }, []); // eslint-disable-line

  useEffect(() => {
    try {
      if (!formData?.stage2?.isValid) {
        const { data_frequency, forecast_period, product_category } = formData?.stage2?.errors || {};

        toggleErrorVisibility(data_frequency, refDataFrequency.current?.controlRef, refLblerrDataFrequency.current);
        toggleErrorVisibility(forecast_period, refForecastPeriod.current?.controlRef, refLblerrForecastPeriod.current);
        toggleErrorVisibility(product_category, refLblerrProductCategory.current?.controlRef, refLblerrProductCategory.current);
      }
    } catch (error) {
      console.log(error);
    }
  }, []); // eslint-disable-line

  const setDate = (_dateObject) => {
    updateFormData("stage2", {
      ...formData.stage2,
      ['start_date']: _dateObject.avail_from,
      ['end_date']: _dateObject.avail_to,
    });
  };

  const changeDate = (e) => {
    if (isLoadingDateRange || !dateObject?.avail_to) {
      displayMessage('warning', 'Please Wait', 'Data is still loading');
      return;
    }

    updateFormData("stage2", {
      ...formData.stage2,
      ['start_date']: e.target.value,
      ['end_date']: dateObject.avail_to
    });
  };

  const handleTrainingPeriodChange = (e) => {
    const value = parseInt(e.target.value);
    setTrainPercentage(value);
    setTestPercentage(100 - value);

    updateFormData("stage2", {
      ...formData.stage2,
      ['train_percentage']: value,
      ['test_percentage']: 100 - value
    });
  };

  const handleModelItemClick = (e) => {
    setModalShow(true);
  };

  const handleChangeDataFrequency = (selected) => {
    setSelDataFrequency(selected.value);
    let result = DataFrequency.find(elem => elem.value === selected.value)?.disabledValues || [];

    setDisabledGranularity(result);
    let defaultGranValue = ['transaction', 'daily'].includes(selected.value.toLowerCase()) ? 'Weekly' : selected.value;
    setDefaultGranularity(defaultGranValue);

    setSelForecastFrequency(defaultGranValue);
    funcUpdateSeasonalityData(defaultGranValue);

    updateFormData("stage2", {
      ...formData.stage2,
      ['data_frequency']: selected.value,
      ['forecast_frequency']: defaultGranValue,
      ['defaultGranValue']: defaultGranValue
    });

    toggleErrorVisibility(selected.value === null, refDataFrequency.current?.controlRef, refLblerrDataFrequency.current);
  };

  const handleChangeProductCategory = (selected) => {
    setSelProductCategory(selected.value);
    updateFormData("stage2", {
      ...formData.stage2,
      ['product_category']: selected.value
    });
  };

  function funcUpdateSeasonalityData(frequency) {
    let seasonality_data = [];
    switch (frequency.toLowerCase()) {
      case 'weekly': seasonality_data = weeks; break;
      case 'monthly': seasonality_data = months; break;
      default: seasonality_data = []; break;
    }

    updateFormData("stage5", {
      ...formData.stage5,
      ['seasonality_data']: seasonality_data
    });
  }

  const rdGranularityOnChangeHandler = (e) => {
    setValue('session', 'form', "granularity", e.target.id);
    setSelForecastFrequency(e.target.id);

    updateFormData("stage2", {
      ...formData.stage2,
      ['forecast_frequency']: e.target.id
    });
    funcUpdateSeasonalityData(e.target.id);
  };

  const handleChangeForecastPeriod = (selected) => {
    console.log("hihello");

    console.log("selectedddddddd", selected);

    updateFormData("stage2", {
      ...formData.stage2,
      ['forecast_period']: selected.value
    });

    toggleErrorVisibility(selected.value === null, refForecastPeriod.current?.controlRef, refLblerrForecastPeriod.current);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const customSelectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused ? '#7aceb6' : '#85acc7',
      outline: 0,
      boxShadow: state.isFocused ? '0 0 0 2px rgba(122, 206, 182, 0.2)' : 'none',
      fontSize: '20px',
      padding: '4px'
    }),
  };

  // Navigation handlers
  const handleNext = () => {
    // Validate required fields
    if (!formData?.stage2?.data_frequency) {
      displayMessage('warning', 'Validation Error', 'Please select a data frequency');
      toggleErrorVisibility(true, refDataFrequency.current?.controlRef, refLblerrDataFrequency.current);
      return;
    }

    if (!formData?.stage2?.forecast_period) {
      displayMessage('warning', 'Validation Error', 'Please select a forecast horizon');
      toggleErrorVisibility(true, refForecastPeriod.current?.controlRef, refLblerrForecastPeriod.current);
      return;
    }

    if (!formData?.stage2?.product_category) {
      displayMessage('warning', 'Validation Error', 'Please select a product category');
      toggleErrorVisibility(true, refLblerrProductCategory.current?.controlRef, refLblerrProductCategory.current);
      return;
    }

    updateFormData("stage2", {
      ...formData.stage2
    });
    setActiveTab && setActiveTab("Stage3");
  };

  const handleBack = () => {
    updateFormData("stage2", {
      ...formData.stage2
    });
    setActiveTab && setActiveTab("Stage1");
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
                  className={`flex items-center justify-center rounded-full ${step === 2 ? 'bg-[#032B4E] text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  style={{
                    width: '36px',
                    height: '36px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    border: step === 2 ? '2px solid #032B4E' : '2px solid #d1d5db'
                  }}
                >
                  {step}
                </div>
                {index < 6 && (
                  <div
                    className={`h-0.5 ${step < 2 ? 'bg-[#032B4E]' : 'bg-gray-300'}`}
                    style={{ width: '40px' }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Header */}
          <h1 className="text-[30px] text-[#0F1116] text-left mb-8 m-0" style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}>
            Step 2: Data & Time Configuration
          </h1>

          {/* Chart Section */}
          {/* <div className="bg-[#e6f4ea] border-2 border-[#1F4280] rounded-xl p-6 mb-10 relative shadow-md overflow-hidden">
            <style>{`
              @keyframes month-fade-in {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes shimmer {
                0%   { transform: translateX(-40%); }
                100% { transform: translateX(140%); }
              }
            `}</style>

            <h2
              className="text-[18px] text-[#0F1116] mb-4 mt-0"
              style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}
            >
              Data Availability Timeline
            </h2>

            subtle gradient strip behind pills
            <div className="absolute left-4 right-4 top-[72px] h-10 pointer-events-none">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-[#c5e7d4] via-[#f5f9f7] to-[#c5e7d4] opacity-70" />
              animated shimmer bar
              <div
                className="h-full rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
                style={{
                  animation: "shimmer 2.4s linear infinite",
                }}
              />
            </div>

            animated month pills
            <div
              className="relative flex overflow-x-auto gap-3 px-1 py-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {formData?.stage2?.start_date && formData?.stage2?.end_date ? (
                generateMonthYearLabels(
                  formData.stage2.start_date,
                  formData.stage2.end_date
                ).map((month, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 rounded-full border-[2px] whitespace-nowrap bg-white/95 text-[#032B4E] border-[#1F4280] text-[13px] font-semibold shadow-sm hover:shadow-md hover:-translate-y-[2px] hover:bg-[#fef9e7] transition-transform transition-shadow duration-200"
                    style={{
                      animation: "month-fade-in 0.35s ease-out forwards",
                      animationDelay: `${idx * 40}ms`,
                      opacity: 0,
                    }}
                  >
                    {month}
                  </div>
                ))
              ) : (
                <span className="text-gray-400 text-[14px]">
                  Loading dates...
                </span>
              )}
            </div>

            summary chips
            {formData?.stage2?.start_date && formData?.stage2?.end_date && (
              <div
                className="mt-4 flex flex-wrap gap-3 text-[13px]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                <span className="px-3 py-1 rounded-lg bg-white border border-[#d1d5db] text-[#032B4E] shadow-sm">
                  Months of data:{" "}
                  <strong>
                    {
                      generateMonthYearLabels(
                        formData.stage2.start_date,
                        formData.stage2.end_date
                      ).length
                    }
                  </strong>
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-[#d1d5db] text-[#032B4E] shadow-sm">
                  Coverage:{" "}
                  <strong>
                    {
                      generateMonthYearLabels(
                        formData.stage2.start_date,
                        formData.stage2.end_date
                      )[0]
                    }
                  </strong>{" "}
                  –{" "}
                  <strong>
                    {
                      generateMonthYearLabels(
                        formData.stage2.start_date,
                        formData.stage2.end_date
                      ).slice(-1)[0]
                    }
                  </strong>
                </span>
              </div>
            )}
          </div> */}


          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Left Column */}
            <div className="">
              {/* ✅ Data Availability Range - Loader ONLY here */}
              <div className="items-center mb-6 bg-white border-2 border-[#1F4280] rounded-xl p-6 shadow-md">
                <h2 className="text-[20px] text-[#0F1116] flex mt-0" style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}>
                  Data Availability Range
                </h2>

                {isLoadingDateRange ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader size="small" />
                  </div>
                ) : (
                  <>
                    <div className="mt-2 flex items-center gap-2 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                      Data available for forecast is between
                      <br />
                      {dateObject?.avail_from ? formatDate(dateObject.avail_from) : "Not available"} to{" "}
                      {dateObject?.avail_to ? formatDate(dateObject.avail_to) : "Not available"}
                    </div>
                    <div className="mt-4 space-x-2 text-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                      <label>Change Start Date</label>
                      <input
                        type="date"
                        value={formData?.stage2?.start_date || ""}
                        onChange={(e) => changeDate(e)}
                        min={dateObject?.avail_from || ""}
                        max={dateObject?.avail_to || ""}
                        disabled={!dateObject?.avail_from}
                        className={`px-2 border border rounded ${!dateObject?.avail_from ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* ✅ Data frequency Section - Loader ONLY here */}
              <div className="bg-white border-2 border-[#1F4280] rounded-xl p-6 mb-6 shadow-md">
                <div className="flex items-center mb-6">
                  <h2 className="text-[20px] text-[#0F1116] mt-0" style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}>Data Frequency</h2>
                </div>

                {isLoadingDateRange ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader size="small" />
                  </div>
                ) : (
                  <>
                    <div className="text-[14px] mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                      Selected frequency:{" "}
                      <span style={{ fontWeight: 600 }}>{formData?.stage2?.data_frequency || "Monthly"}</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {DataFrequency.map((opt) => {
                        const isSelected = formData?.stage2?.data_frequency === opt.value;
                        const isDisabled = opt.value !== "Monthly";

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => !isDisabled && handleChangeDataFrequency(opt)}
                            className={`px-6 py-3 rounded-lg border-2 transition ${isSelected
                              ? "bg-[#b8842f] text-white border-[#b8842f]"
                              : "bg-white text-[#032B4E] border-[#1F4280] hover:bg-[#f0f7ff]"
                              } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Forecast Horizon - No loader needed */}
              <div className="bg-white border-2 border-[#1F4280] rounded-xl p-6 shadow-md">
                <h2 className="text-[20px] text-[#0F1116] mb-4 mt-0" style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}>Forecast Horizon</h2>
                <div className="text-[14px] mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                  Current horizon: <span style={{ fontWeight: 600 }}>{formData?.stage2?.forecast_period || "Not Selected"}</span>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-4 overflow-x-auto py-2">
                  {selForecastFrequency && getForecastPeriods(selForecastFrequency)
                    .slice(0, 3)
                    .map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleChangeForecastPeriod(option)}
                        className={`px-6 py-3 rounded-lg border-2 flex-shrink-0 transition ${formData?.stage2?.forecast_period === option.value
                          ? "bg-[#b8842f] text-white border-[#b8842f]"
                          : "bg-white text-[#032B4E] border-[#1F4280] hover:bg-[#f0f7ff]"
                          }`}
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
                      >
                        {option.label}
                      </button>
                    ))}

                  {selForecastFrequency && getForecastPeriods(selForecastFrequency).length > 3 && (
                    <select
                      value={formData?.stage2?.forecast_period || ""}
                      onChange={(e) => handleChangeForecastPeriod({ label: e.target.value, value: e.target.value })}
                      className="px-4 py-3 border-2 border-[#85acc7] rounded-lg flex-shrink-0 text-[#0d1b4c]"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
                    >
                      <option value="">--Select Period--</option> {/* Placeholder */}
                      {getForecastPeriods(selForecastFrequency)
                        .slice(3)
                        .map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div>
              {/* Training / Testing Split */}
              <div className="mb-6 bg-white border-2 border-[#1F4280] rounded-xl p-6 shadow-md">
                <h2 className="text-[20px] text-[#0F1116] mb-4 mt-0" style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}>
                  Training / Testing Split
                </h2>

                <div className="text-[14px] mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                  Split ratio:{" "}
                  <span style={{ fontWeight: 600 }}>{trainPercentage}% Training</span> /{" "}
                  <span style={{ fontWeight: 600 }}>{testPercentage}% Testing</span>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[20px] text-[#032B4E]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{trainPercentage}%</span>
                  <span className="text-[20px] text-[#032B4E]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{testPercentage}%</span>
                </div>

                <div className="relative mb-2">
                  <div className="h-4 bg-gray-200 rounded-full relative">
                    {/* Filled Bar */}
                    <div
                      className="h-4 bg-[#b8842f] rounded-full transition-all duration-300"
                      style={{ width: `${trainPercentage}%` }}
                    ></div>

                    {/* Thumb */}
                    <div
                      className="absolute top-1/2 w-8 h-8 bg-[#b8842f] rounded-full transform -translate-y-1/2 cursor-pointer shadow-lg border-2 border-white"
                      style={{ left: `calc(${trainPercentage}% - 16px)` }}
                    ></div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={trainPercentage}
                    onChange={handleTrainingPeriodChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

              </div>

              {/* Data Granularity Section */}
              <div className="bg-white border-2 border-[#1F4280] rounded-xl p-6 mb-6 shadow-md">
                <div className="flex items-center mb-6">
                  <h2 className="text-[20px] text-[#0F1116] mt-0" style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}>Forecast Granularity</h2>
                </div>
                <div className="text-[14px] mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                  Current granularity:{" "}
                  <span style={{ fontWeight: 600 }}>{formData?.stage2?.defaultGranValue || "Monthly"}</span>
                </div>
                <Stage2RadiobuttonList
                  DefaultValue={formData?.stage2?.defaultGranValue || "Monthly"}
                  DisabledValues={disabledGranularity}
                  OnSelectChange={rdGranularityOnChangeHandler}
                />
              </div>

              {/* Product Category */}
              <div className="bg-white border-2 border-[#1F4280] rounded-xl p-6 mb-6 shadow-md">
                <div className="form-group1">
                  <label className="flex items-center text-[20px] text-[#0F1116] mb-4" style={{ fontFamily: "'Poppins', serif", fontWeight: 600 }}>
                    Product Category <span>*</span>
                  </label>
                  <div className="text-[14px] mb-2 flex items-center gap-2 text-[#032B4E]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                    Selected category:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {(() => {
                        const selected = productCategories?.find(
                          (opt) => opt.value === formData?.stage2?.product_category
                        );
                        return selected ? selected.label : "Not Selected";
                      })()}
                    </span>
                  </div>
                  {isDataloading || !productCategories?.length ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader size="small" />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {productCategories.map((opt) => {
                        const isSelected = formData?.stage2?.product_category === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleChangeProductCategory(opt)}
                            className={`px-6 py-3 rounded-lg border-2 transition ${isSelected
                              ? "bg-[#b8842f] text-white border-[#b8842f]"
                              : "bg-white text-[#032B4E] border-[#1F4280] hover:bg-[#f0f7ff]"
                              }`}
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <label
                    id="lblerr_product_category"
                    ref={refLblerrProductCategory}
                    className="invalid-feedback hidden"
                  >
                    * Required
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden form elements */}
          <div className="hidden">
            <Select
              key="dataFrequency"
              ref={refDataFrequency}
              options={DataFrequency.map(opt => ({
                ...opt,
                isDisabled: opt.value !== 'Monthly'
              }))}
              onChange={handleChangeDataFrequency}
              defaultValue={{ label: formData?.stage2?.data_frequency, value: formData?.stage2?.data_frequency }}
              styles={customSelectStyles}
            />

            {!isDataloading && productCategories?.length && (
              <Select
                key="productCategory"
                onChange={handleChangeProductCategory}
                options={productCategories}
                defaultValue={productCategories?.find(elem => elem.value === formData?.stage2?.product_category) || null}
                styles={customSelectStyles}
              />
            )}

            <Select
              key="forecastPeriod"
              ref={refForecastPeriod}
              options={getForecastPeriods(selForecastFrequency)}
              onChange={handleChangeForecastPeriod}
              defaultValue={{ label: formData?.stage2?.forecast_period, value: formData?.stage2?.forecast_period }}
              styles={customSelectStyles}
            />

            <input ref={trainPercentageRef} type="hidden" value={trainPercentage} />
            <input ref={testPercentageRef} type="hidden" value={testPercentage} />

            <label ref={refLblerrDataFrequency} className="text-red-600 text-base hidden">* Required</label>
            <label ref={refLblerrProductCategory} className="text-red-600 text-base hidden">* Required</label>
            <label ref={refLblerrForecastPeriod} className="text-red-600 text-base hidden">* Required</label>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between items-center">
            <button
              onClick={handleBack}
              className="px-8 py-2.5 bg-[#b8842f] hover:bg-[#a67d2e] text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
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

function Stage2RadiobuttonList({
  DefaultValue,
  DisabledValues,
  OnSelectChange,
}) {
  const { formData, updateFormData } = useFormContext();
  const [checkedOption, setCheckedOption] = useState(DefaultValue || 'Monthly');

  useEffect(() => {
    setCheckedOption(DefaultValue || 'Monthly');
  }, [DefaultValue]);

  const handleRadioChange = (e) => {
    setCheckedOption(e.target.value);
    OnSelectChange(e);
  };

  const isItemDisabled = (item) => {
    return DisabledValues.includes(item);
  };

  // const granularityOptions = ['Weekly', 'Monthly', 'Quarterly'];
  const granularityOptions = ['Weekly', 'Monthly', 'Quarterly'];

  return (
    <div className="flex space-x-2">
      {granularityOptions.map((option, index) => (
        <label key={index} className="flex items-center cursor-pointer">
          <button
            type="button"
            onClick={() => {
              if (!isItemDisabled(option)) {
                const event = { target: { value: option, id: option } };
                handleRadioChange(event);
              }
            }}
            disabled={isItemDisabled(option)}
            className={`px-6 py-3 rounded-xl transition ${checkedOption === option
              ? 'bg-[#b8842f] text-white border-2 border-[#b8842f]'
              : isItemDisabled(option)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                : 'bg-white text-[#032B4E] hover:bg-gray-100 border-2 border-[#1F4280]'
              }`}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}
          >
            {option}
          </button>
          <input
            id={option}
            type="radio"
            name="granularity"
            value={option}
            checked={checkedOption === option}
            disabled={isItemDisabled(option)}
            onChange={handleRadioChange}
            className="hidden"
          />
        </label>
      ))}
    </div>
  );
}
