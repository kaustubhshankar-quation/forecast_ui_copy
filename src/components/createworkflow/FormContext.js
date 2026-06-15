
import React, { createContext, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { getCookie } from "../../services/DataRequestService";
import { getDateRanges } from "../../services/ApiWorkflow";
import { displayMessage } from "../../Utils/helper";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  // ✅ After: Asks user if they want to reset
  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem("formData");

    if (!savedData) {
      return createNewFormData();
    } else {
      // Ask user for confirmation
      const isReset = window.confirm('Do you need to reset existing Workflow ?');
      if (isReset) {
        sessionStorage.removeItem("formData");
        return createNewFormData();
      } else {
        return JSON.parse(savedData);
      }
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData) sessionStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (!formData?.stage3 || !formData?.stage4) return;

    const validProductNames = new Set(
      (formData.stage3.products || []).map((p) =>
        p.breadcrumb.split("\\").pop()
      )
    );

    const validGeos = new Set(
      (formData.stage3.geography || []).map((g) => g.breadcrumb)
    );

    const filteredCombinations = (formData.stage4.combinations || []).filter(
      (combo) => {
        const skuName = combo.sku?.sku_name;
        const geoBreadcrumb = [
          combo.geography?.level1,
          combo.geography?.level2,
          combo.geography?.level3,
          combo.geography?.level4,
          combo.geography?.level5,
        ]
          .filter(Boolean)
          .join("\\");

        return validProductNames.has(skuName) && validGeos.has(geoBreadcrumb);
      }
    );

    if (filteredCombinations.length !== formData.stage4.combinations.length) {
      setFormData((prev) => ({
        ...prev,
        stage4: {
          ...prev.stage4,
          combinations: filteredCombinations,
        },
      }));
    }
  }, [formData.stage3]);

  const updateFormData = (tabName, data) => {
    setFormData((prev) => ({
      ...prev,
      [tabName]: { ...prev[tabName], ...data },
    }));
  };

  const resetFormData = () => {
    const newData = createNewFormData();
    setFormData(newData);
    sessionStorage.setItem("formData", JSON.stringify(newData));
  };

  //clone work
  const constructForecastPeriod = (forecastValue, frequency) => {
    if (forecastValue == null || !frequency) return null;

    const adjustedValue = Number(forecastValue) - 1;
    if (adjustedValue < 0) return null;

    let unit = "";
    switch (frequency.toLowerCase()) {
      case "monthly":
        unit = "month" + (adjustedValue > 1 ? "s" : "");
        break;
      case "weekly":
        unit = "week" + (adjustedValue > 1 ? "s" : "");
        break;
      case "quarterly":
        unit = "quarter" + (adjustedValue > 1 ? "s" : "");
        break;
      case "yearly":
      case "annual":
        unit = "year" + (adjustedValue > 1 ? "s" : "");
        break;
      case "daily":
        unit = "day" + (adjustedValue > 1 ? "s" : "");
        break;
      default:
        unit = "period" + (adjustedValue > 1 ? "s" : "");
    }

    return `Next ${adjustedValue} ${unit}`;
  };

  // Helper function to construct product ID from SKU details
  const constructProductId = (skuDetails) => {
    if (!skuDetails) return null;
    return [
      skuDetails.level1_id,
      skuDetails.level2_id,
      skuDetails.level3_id,
      skuDetails.level4_id,
      skuDetails.level5_id,
      skuDetails.level6_id
    ].filter(val => val !== undefined && val !== null).join('_');
  };

  // Helper function to construct geography ID from geoDetails
  const constructGeographyId = (geoDetails) => {
    if (!geoDetails) return null;
    return [
      geoDetails.level1,
      geoDetails.level2,
      geoDetails.level3,
      geoDetails.level4,
      geoDetails.level5
    ].filter(val => val).map((_, idx) => idx + 1).join('_');
  };

  // Helper function to construct product breadcrumb
  const constructProductBreadcrumb = (skuDetails) => {
    console.log("skuDetails in breadcrumb", skuDetails);
    
    if (!skuDetails) return null;
    
    // If the original combination field exists (from cloned workflow), preserve it
    if (skuDetails.combination) {
      return skuDetails.combination;
    }
    
    // Otherwise, construct from sku_name as fallback
    return skuDetails.sku_name || null;
  };

  // Helper function to construct geography breadcrumb
  const constructGeographyBreadcrumb = (geoDetails) => {
    if (!geoDetails) return null;
    return [
      geoDetails.level1,
      geoDetails.level2,
      geoDetails.level3,
      geoDetails.level4,
      geoDetails.level5
    ].filter(val => val).join('\\');
  };

  // Main transformation function for Stage3
  const transformStage3Data = (clonedData) => {
    const products = [];
    const geography = [];
    const productIdSet = new Set(); // Track unique product IDs
    const geoIdSet = new Set();     // Track unique geo IDs

    if (Array.isArray(clonedData) && clonedData.length > 0) {
      const flatData = clonedData.flat();

      flatData.forEach((item) => {
        // Process product (unique by constructed ID)
        if (item.skuDetails) {
          const productId = constructProductId(item.skuDetails);
          if (productId && !productIdSet.has(productId)) {
            productIdSet.add(productId);
            products.push({
              id: productId,
              breadcrumb: constructProductBreadcrumb(item.skuDetails)
            });
          }
        }

        // Process geography (unique by constructed ID)
        if (item.geoDetails) {
          const geoId = constructGeographyId(item.geoDetails);
          if (geoId && !geoIdSet.has(geoId)) {
            geoIdSet.add(geoId);
            geography.push({
              id: geoId,
              breadcrumb: constructGeographyBreadcrumb(item.geoDetails)
            });
          }
        }
      });
    }

    return { products, geography };
  };


  // ✅ NEW: Main transformation function for Stage4
  const transformStage4Data = (clonedData) => {
    const combinations = [];

    if (Array.isArray(clonedData) && clonedData.length > 0) {
      const flatData = clonedData.flat();

      flatData.forEach((item) => {
        if (item.skuDetails && item.geoDetails) {
          // Construct product breadcrumb and geography breadcrumb
          const productBreadcrumb = constructProductBreadcrumb(item.skuDetails);
          const geographyBreadcrumb = constructGeographyBreadcrumb(item.geoDetails);

          // Combine them with __ separator for the ID
          const combinationId = `${productBreadcrumb}__${geographyBreadcrumb}`;

          combinations.push({
            id: combinationId,
            sku: {
              sku_id: item.skuDetails.sku_id,
              sku_name: item.skuDetails.sku_name,
              level1_id: item.skuDetails.level1_id,
              level2_id: item.skuDetails.level2_id,
              level3_id: item.skuDetails.level3_id,
              level4_id: item.skuDetails.level4_id,
              level5_id: item.skuDetails.level5_id,
              level6_id: item.skuDetails.level6_id
            },
            geography: {
              level1: item.geoDetails.level1,
              level2: item.geoDetails.level2,
              level3: item.geoDetails.level3,
              level4: item.geoDetails.level4,
              level5: item.geoDetails.level5
            }
          });
        }
      });
    }

    return combinations;
  };

  const cloneWorkflow = async (wf) => {
    if (!wf) return;

    const base = createNewFormData();

    // --- basic metadata ---
    base.workflow_id = uuidv4();
    base.source_workflow_id = wf.workflow_id;
    base.title = wf.workflow_name || base.title;
    base.workflow_name = base.title;
    base.workflow_description = wf.workflow_description || "";

    base.begin_date = wf.begin_date || null;
    base.process_date = wf.process_date || null;

    // --- stage1 ---
    base.stage1 = {
      ...base.stage1,
      data_upload_id: wf.data_upload_id ?? null,
      forecast_template: wf.forecast_template ?? null,
      workflow_name: wf.workflow_name + " cloned" ?? "",
      workflow_description: wf.workflow_description ?? "",
      file_upload_status: wf.file_upload_status ?? { 0: null, 1: null, 2: null, 3: null }
    };

    // --- stage2 ---
    // ✅ FIXED: Fetch date range from API during clone
    let dateRangeData = { avail_from: wf.begin_date ?? null, avail_to: wf.end_date ?? null };
    try {
      if (wf.data_upload_id) {
        const dateResponse = await getDateRanges(wf.data_upload_id);
        if (dateResponse) {
          dateRangeData = dateResponse;
        }
      }
    } catch (error) {
      console.log("Error fetching date range during clone:", error);
      // Fallback to workflow dates
    }

    base.stage2 = {
      ...base.stage2,
      data_frequency: wf.forecast_frequency ?? null,
      defaultGranValue: wf.granularity ?? "Monthly",
      start_date: dateRangeData.avail_from ?? wf.begin_date ?? null,
      end_date: dateRangeData.avail_to ?? wf.end_date ?? null,
      forecast_frequency: wf.forecast_frequency ?? null,
      forecast_period: constructForecastPeriod(wf.forecast_period, wf.forecast_frequency) ?? "Next 3 months",
      product_category: wf.combination[0]?.[0]?.skuDetails?.level1_id ?? null,
      train_percentage: wf.train_percentage ?? 80,
      test_percentage: wf.test_percentage ?? 20,
    };

    const transformedData = transformStage3Data(wf.combination);

    // --- stage3 ---
    base.stage3 = {
      products: transformedData.products ?? wf.stage3?.products ?? [],
      geography: transformedData.geography ?? wf.stage3?.geography ?? []
    };

    // ✅ FIXED: Use transformStage4Data for proper combination structure
    const transformedCombinations = transformStage4Data(wf.combination);

    // --- stage4 ---
    base.stage4 = {
      combinations: transformedCombinations ?? wf.stage4?.combinations ?? []
    };

    // --- stage5 ---
    base.stage5 = {
      file_upload_status: wf.file_upload_status ?? null,
      seasonality_data: wf.seasonality_data ?? [],
      events: wf.events ?? []
    };

    // --- stage6 ---
    base.stage6 = {
      models: Array.isArray(wf.models)
        ? wf.model_list
        : typeof wf.model_list === "string"
          ? wf.model_list.replace(/[{}]/g, "").split(",").map(m => m.trim()).filter(Boolean)
          : []
    };

    // --- stage7 ---
    base.stage7 = wf.stage7 ?? null;

    // --- other top-level fields ---
    base.approval_status = wf.approval_status ?? null;
    base.granularity = wf.granularity ?? null;
    base.forecast_frequency = wf.forecast_frequency ?? null;

    setFormData(base);
    sessionStorage.setItem("formData", JSON.stringify(base));
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        updateFormData,
        errors,
        setErrors,
        resetFormData,
        cloneWorkflow,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);

const createNewFormData = () => {
  const id = uuidv4();

  return {
    id,
    object: "WorkflowForm",
    user_id: getCookie("sub"),
    email_id: getCookie("email"),
    full_name: getCookie("name"),
    stage1: {
      file_upload_status: { 0: null, 1: null, 2: null, 3: null },
      data_upload_id: null,
      file_upload_option: null,
      forecast_template: null,
      workflow_name: "",
      workflow_description: "",
    },
    stage2: {
      start_date: null,
      end_date: null,
      train_percentage: 80,
      test_percentage: 20,
      data_frequency: null,
      forecast_frequency: null,
      forecast_period: null,
      product_category: null,
      defaultGranValue: "Monthly",
    },
    stage3: { products: [], geography: [] },
    stage4: { combinations: [] },
    stage5: { file_upload_status: null, seasonality_data: [], events: [] },
    stage6: { models: [] },
    stage7: null,
  };
};
