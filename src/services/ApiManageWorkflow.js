import { getRequest, postRequest, ApiEnums } from "./DataRequestService";


async function get_workflows(userId) {
  let apiUrl = ApiEnums.get_workflows;
  let requestObject = {
    url: apiUrl,
    config: {
      params: {
        user_id: userId,
      },
    },
  };
  const responseData = await getRequest(requestObject);
  if (responseData.status === "success") {
    return responseData.data;
  } else if (responseData.status === "failed") {
    console.log(responseData.message);
    return null;
  }
}

//Manage Workflow APIs
// getActPredFcastResults : '/getActPredFcastResults',
// getTopOneModelResults : '/getTopOneModelResults',
// getForecastResults : '/getForecastResults',
// get_sp : '/get_sp',
// getTopThreeModelResults : '/getTopThreeModelResults',

async function getActualPredictedForecastResults(workflow_id) {
  let apiUrl = ApiEnums.getActPredFcastResults;
  let requestObject = {
    url: apiUrl,
    config: {
      params: {
        workflow_id: workflow_id,
      },
    },
  };
  const responseData = await getRequest(requestObject);
  if (responseData.status === "success") {
    return responseData.data;
  } else if (responseData.status === "failed") {
    console.log(responseData.message);
    return null;
  }
}

async function getTopOneModelResults(workflow_id) {
  let apiUrl = ApiEnums.getTopOneModelResults;
  let requestObject = {
    url: apiUrl,
    config: {
      params: {
        workflow_id: workflow_id,
      },
    },
  };
  const responseData = await getRequest(requestObject);
  if (responseData.status === "success") {
    return responseData.data;
  } else if (responseData.status === "failed") {
    console.log(responseData.message);
    return null;
  }
}

async function getForecastResults(workflow_id) {
  let apiUrl = ApiEnums.getForecastResults;
  let requestObject = {
    url: apiUrl,
    config: {
      params: {
        workflow_id: workflow_id,
      },
    },
  };
  const responseData = await getRequest(requestObject);
  if (responseData.status === "success") {
    return responseData.data;
  } else if (responseData.status === "failed") {
    console.log(responseData.message);
    return null;
  }
}

async function getmultipleActPredFcastResults(workflow_id) {
  try {
    let apiUrl = ApiEnums.getmultipleActPredFcastResults;
    let requestObject = {
      url: apiUrl,
      config: {
        params: {
          workflow_id: workflow_id,
        },
      },
    };
    console.log("🔍 getmultipleActPredFcastResults calling API:", apiUrl, "with workflow_id:", workflow_id);
    const responseData = await getRequest(requestObject);
    console.log("🔍 getmultipleActPredFcastResults raw response:", responseData);
    console.log("getmultipleActPredFcastResults response:", { status: responseData.status, hasData: !!responseData.data, hasInnerData: !!responseData.data?.data, hasCities: !!responseData.data?.data?.cities });
    if (responseData.status === "success") {
      const result = responseData.data.data;
      console.log("✅ getmultipleActPredFcastResults returning data:", !!result);
      return result;
    } else if (responseData.status === "failed") {
      console.log("❌ getmultipleActPredFcastResults failed:", responseData.message);
      return null;
    }
    console.log("⚠️ getmultipleActPredFcastResults unexpected status:", responseData.status);
    return null;
  } catch (error) {
    console.error("💥 getmultipleActPredFcastResults exception:", error);
    return null;
  }
}

async function getmultipleModelResults(workflow_id) {
  try {
    let apiUrl = ApiEnums.getmultipleModelResults;
    let requestObject = {
      url: apiUrl,
      config: {
        params: {
          workflow_id: workflow_id,
        },
      },
    };
    console.log("🔍 getmultipleModelResults calling API:", apiUrl, "with workflow_id:", workflow_id);
    const responseData = await getRequest(requestObject);
    console.log("🔍 getmultipleModelResults raw response:", responseData);
    console.log("getmultipleModelResults response:", { status: responseData.status, hasData: !!responseData.data, hasCities: !!responseData.data?.cities });
    if (responseData.status === "success") {
      const result = responseData.data; // SINGLE-wrapped, not double-wrapped like others
      console.log("✅ getmultipleModelResults returning data:", !!result);
      return result;
    } else if (responseData.status === "failed") {
      console.log("❌ getmultipleModelResults failed:", responseData.message);
      return null;
    }
    console.log("⚠️ getmultipleModelResults unexpected status:", responseData.status);
    return null;
  } catch (error) {
    console.error("💥 getmultipleModelResults exception:", error);
    return null;
  }
}

async function getmultipleForecastResults(workflow_id) {
  try {
    let apiUrl = ApiEnums.getmultipleForecastResults;
    let requestObject = {
      url: apiUrl,
      config: {
        params: {
          workflow_id: workflow_id,
        },
      },
    };
    console.log("🔍 getmultipleForecastResults calling API:", apiUrl, "with workflow_id:", workflow_id);
    const responseData = await getRequest(requestObject);
    console.log("🔍 getmultipleForecastResults raw response:", responseData);
    console.log("getmultipleForecastResults response:", { status: responseData.status, hasData: !!responseData.data, hasInnerData: !!responseData.data?.data, hasCities: !!responseData.data?.data?.cities });
    if (responseData.status === "success") {
      const result = responseData.data.data;
      console.log("✅ getmultipleForecastResults returning data:", !!result);
      return result;
    } else if (responseData.status === "failed") {
      console.log("❌ getmultipleForecastResults failed:", responseData.message);
      return null;
    }
    console.log("⚠️ getmultipleForecastResults unexpected status:", responseData.status);
    return null;
  } catch (error) {
    console.error("💥 getmultipleForecastResults exception:", error);
    return null;
  }
}

//cityName should be capitallize first letter
async function getSalesPersons(cityName) {
  let apiUrl = ApiEnums.get_sp;
  let requestObject = {
    url: apiUrl,
    config: {
      params: {
        level5: cityName,
      },
    },
  };
  const responseData = await getRequest(requestObject);
  if (responseData.status === "success") {
    return responseData.data;
  } else if (responseData.status === "failed") {
    console.log(responseData.message);
    return null;
  }
}
async function getWorkkflowCombinations(workflowId) {
  // workflowId = 'bd7c3e51-2e06-42ac-80ae-82157c5f467121'
  let apiUrl = ApiEnums.getWorkflowCombinations;
  let requestObject = {
    url: apiUrl,
    config: {
      params: {
        workflow_id: workflowId,
      },
    },
  };
  const responseData = await getRequest(requestObject);
  if (responseData.status === "success") {
    return responseData.data;
  } else if (responseData.status === "failed") {
    console.log(responseData.message);
    return null;
  }
}


export {
  get_workflows,
  getActualPredictedForecastResults,
  getTopOneModelResults,
  getForecastResults,
  getmultipleActPredFcastResults,
  getmultipleModelResults,
  getmultipleForecastResults,
  getSalesPersons,
  getWorkkflowCombinations,
};