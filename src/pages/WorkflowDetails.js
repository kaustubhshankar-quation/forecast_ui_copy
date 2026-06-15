import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import Breadcrumb from "../components/common/Breadcrumb";
import WorkflowReportMenu from '../components/workflow/WorkflowReportMenu';
import DetailsPopup from '../components/workflow/DetailsPopup';
import { MenuProvider } from '../components/workflow/MenuContext';
import {
  getWorkkflowCombinations,
  getActualPredictedForecastResults,
  getTopOneModelResults,
  getForecastResults,
  getmultipleModelResults,
  getmultipleActPredFcastResults,
  getmultipleForecastResults,
} from '../services/ApiManageWorkflow';
import { upsertRecord, deleteRecord } from "../services/IndexedDBUtil";
import { DATABASE_NAME, STORE_NAME } from '../services/constants';
import { displayMessage } from '../Utils/helper';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setCombinations,
  setSelectedProductLocation,
  setApiPayloads,
  setApiPayloadsBestModel,
} from '../store/slices/workflowSlice';

function WorkflowDetails() {
  const location = useLocation();
  const { state } = location;
  const dispatch = useAppDispatch();
  const combinations = useAppSelector(state => state.workflow.combinations);

  // read workflow_id from URL query param if present
  const searchParams = new URLSearchParams(location.search);
  const workflowIdFromQuery = searchParams.get("workflow_id");

  // fallback to workflow from state (old navigation)
  const workflowFromState = state?.workflow;
  const workflow_id = workflowIdFromQuery || workflowFromState?.workflow_id;

  const [showWFDetailsModal, setShowWFDetailsModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!workflow_id) {
        displayMessage("danger", "Workflow ID is missing. Please open this page from the workflow list.");
        return;
      }

      try {
        const [
          combinationsRes,
          data1,
          data2,
          data3,
          data4,
          data5,
          data6,
        ] = await Promise.all([
          getWorkkflowCombinations(workflow_id),
          getActualPredictedForecastResults(workflow_id),
          getTopOneModelResults(workflow_id),
          getForecastResults(workflow_id),
          getmultipleModelResults(workflow_id),
          getmultipleForecastResults(workflow_id),
          getmultipleActPredFcastResults(workflow_id)
        ]);

        console.log("Individual API results:", {
          data1_getActualPredictedForecastResults: data1,
          data2_getTopOneModelResults: data2,
          data3_getForecastResults: data3,
          data4_getmultipleModelResults: data4,
          data5_getmultipleForecastResults: data5,
          data6_getmultipleActPredFcastResults: data6,
        });

        console.log("API responses received:", {
          data4_exists: !!data4,
          data4_hasCities: !!data4?.cities,
          data4_type: typeof data4,
          data5_exists: !!data5,
          data5_hasCities: !!data5?.cities,
          data5_type: typeof data5,
          data6_exists: !!data6,
          data6_hasCities: !!data6?.cities,
          data6_type: typeof data6,
        });

        dispatch(setCombinations(combinationsRes));

        // Wrap API data responses with status for Redux state
        // API functions return just the .data part, so we wrap it
        const wrappedBestModelData = {
          skuData: combinationsRes,
          bestActPredData: data1 ? { status: "success", data: data1 } : null,
          bestModelData: data2 ? { status: "success", data: data2 } : null,
          bestForecasteData: data3 ? { status: "success", data: data3 } : null,
        };
        const wrappedData = {
          skuData: combinationsRes,
          multipleActPredData: data6 ? { status: "success", data: data6 } : null,
          multipleModelData: data4 ? { status: "success", data: data4 } : null,
          multipleForecastData: data5 ? { status: "success", data: data5 } : null,
        };

        console.log("wrappedBestModelData.bestActPredData?.data?.", wrappedBestModelData);

        console.log("Wrapping and dispatching:", {
          bestActPredData_status: wrappedBestModelData.bestActPredData?.status,
          bestActPredData_hasCities: !!wrappedBestModelData.bestActPredData?.data?.data?.cities,
          bestModelData_status: wrappedBestModelData.bestModelData?.status,
          multipleActPredData_status: wrappedData.multipleActPredData?.status,
          multipleActPredData_hasCities: !!wrappedData.multipleActPredData?.data?.cities,
          multipleModelData_status: wrappedData.multipleModelData?.status,
          multipleModelData_hasCities: !!wrappedData.multipleModelData?.data?.cities,
          multipleForecastData_status: wrappedData.multipleForecastData?.status,
          multipleForecastData_hasCities: !!wrappedData.multipleForecastData?.data?.cities,
        });

        dispatch(setApiPayloadsBestModel(wrappedBestModelData));
        dispatch(setApiPayloads(wrappedData));

        console.log("✅ setApiPayloads dispatched successfully");

        // Clear old cached data
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFActualPredictedData");
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFModelResult");
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFForecastResult");
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFTOPThreeModelResult");
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFMultipleForecastResult");
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFMultipleActPredResult");

        // Save new data in IndexedDB (if other parts still use it)
        await upsertRecord(DATABASE_NAME, STORE_NAME, {
          id: "WFActualPredictedData",
          data: data1,
        });
        await upsertRecord(DATABASE_NAME, STORE_NAME, {
          id: "WFModelResult",
          data: data2,
        });
        await upsertRecord(DATABASE_NAME, STORE_NAME, {
          id: "WFForecastResult",
          data: data3,
        });
        await upsertRecord(DATABASE_NAME, STORE_NAME, {
          id: "WFMultipleModelResult",
          data: data4,
        });
        await upsertRecord(DATABASE_NAME, STORE_NAME, {
          id: "WFMultipleForecastResult",
          data: data5,
        });
        await upsertRecord(DATABASE_NAME, STORE_NAME, {
          id: "WFMultipleActPredResult",
          data: data6,
        });

        console.log("WorkflowDetails: data fetched successfully");
      } catch (err) {
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFActualPredictedData");
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFModelResult");
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFForecastResult");
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFMultipleModelResult");
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFMultipleForecastResult");
        await deleteRecord(DATABASE_NAME, STORE_NAME, "WFMultipleActPredResult");
        console.error(`Error while fetching data : ${err}`);
        displayMessage("danger", "Error while loading workflow details");
      }
    };

    init();
  }, [workflow_id]);

  if (!workflow_id) {
    // hard guard
    return null;
  }

  if (!combinations) {
    return false;
  }


  const combinationSelectChangeHandler = async (selected) => {
    console.log("selected", selected);

    try {
      console.log(selected);
      const locParts = (selected?.value?.location || "").split("/").filter(Boolean);
      let derivedLocation = locParts[0] || selected?.value?.location || "";
      // If the path looks like India/Region/..., we use top-level geo for city-based report data
      if (locParts.length > 1 && locParts[0].toLowerCase() !== "india") {
        derivedLocation = locParts[0];
      }
      dispatch(setSelectedProductLocation({
        product: selected?.value?.sku_name,
        location: derivedLocation,
      }));
    } catch (err) {
      console.error(err);
      displayMessage("danger", "Error", "Error occured while fetching details");
    }
  };

  return (
    <>
      <Breadcrumb
        List={[
          { path: "/Dashboard", name: "Dashboard" },
          { path: "/ManageWorkflow", name: "Workflow" },
          {
            path: "#",
            name: workflowFromState?.workflow_name || `Workflow #${workflow_id}`
          }
        ]}
      />
      <div className="manage-workflow-box" style={{ margin: 0, padding: 0, maxWidth: "100%" }}>

        <MenuProvider>
          <WorkflowReportMenu
            key={workflow_id}  // force remount when workflow changes
            Workflow={workflowFromState || { workflow_id }}
            onChange={combinationSelectChangeHandler}
          >
            <div
              className="workflow-header"
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                padding: "0 20px"
              }}
            >
              <div
                className="row"
                style={{
                  alignItems: "center",
                  marginBottom: "0px"
                }}
              >
              </div>
            </div>
          </WorkflowReportMenu>
        </MenuProvider>
      </div>
      {showWFDetailsModal &&
        createPortal(
          <DetailsPopup
            onClose={() => setShowWFDetailsModal(false)}
            workflowData={workflowFromState || { workflow_id }}
          />,
          document.body
        )}
    </>
  );
}

export default WorkflowDetails;
