import { ForecastPeriods } from "../Utils/dataTemporialSettings";
import { getRequest, postRequest, ApiEnums } from "./DataRequestService";
import HttpService from "../services/HttpService";

function getForecastPeriods(frequency) {
  let result = ForecastPeriods.find(
    (elem) => elem.frequency == frequency
  )?.periods?.map((el) => ({ label: el, value: el }));

  return result;
}

async function fetchWorkflows({ queryKey }) {
  try {
    const [, userId] = queryKey; // Extract userId from queryKey
    let apiUrl = ApiEnums.wf_name_check;
    let requestObject = {
      url: apiUrl,
      config: {
        params: {
          user_id: userId,
        },
      },
    };
    const responseData = await getRequest(requestObject);
    return responseData?.wf_names;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function getDateRanges(workflowId) {
  //workflowId = 'bd7c3e51-2e06-42ac-80ae-82157c5f467121'
  let apiUrl = ApiEnums.getDateRange;
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

async function stage1fileupload(userId, workflowId, sheetName, file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Construct the URL with query parameters
    const url = `${ApiEnums.upload_exog_files}?user_Id=${encodeURIComponent(
      userId
    )}&data_upload_Id=${encodeURIComponent(
      workflowId
    )}&sheet_name=${encodeURIComponent(sheetName)}`;

    const axiosClient = HttpService.getAxiosClient();
    let response = await axiosClient
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error uploading file:", error);
        return "Error occured while uploading file";
      });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchDataAvailability(payload) {
  try {
    let apiUrl = ApiEnums.getDataAvailability;
    let requestObject = {
      url: apiUrl,
      data: payload
    };
    const responseData = await postRequest(requestObject);
    if (responseData?.status === "success") {
      return responseData?.data;
    } else if (responseData?.status === "failed") {
      console.log(responseData?.message);
      return null;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function sumbitWorkflow(payload) {
  try {
    let apiUrl = ApiEnums.submitTask;
    let requestObject = {
      url: apiUrl,
      data: payload
    };
    const responseData = await postRequest(requestObject);
    if (responseData?.status === "success") {
      return responseData?.data;
    } else if (responseData?.status === "failed") {
      console.log(responseData?.message);
      return null;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getAllSalesPersons() {
  //workflowId = 'bd7c3e51-2e06-42ac-80ae-82157c5f467121'
  let apiUrl = ApiEnums.get_all_sp;
  //let apiUrl = "http://localhost:8300/get_all_sp";
  let requestObject = {
    url: apiUrl,
  };
  const responseData = await getRequest(requestObject);
  if (responseData.status === "success") {
    return responseData.data;
  } else if (responseData.status === "failed") {
    console.log(responseData.message);
    return null;
  }
}

async function getProductHeirarchy() {
  let apiUrl = ApiEnums.getproducthierarchy
  let requestObject = {
    url: apiUrl,
  };
  const responseData = await getRequest(requestObject);
  if (responseData.status === "success") {
    return responseData.data;
  } else if (responseData.status === "failed") {
    console.log(responseData.message);
    return null;
  }
}

/*
//payload format for assignSKUs
{
  "user_id": "test",
  "payload": [
    {
      "geo_location": "India",
      "sku": "Automobile/Automatic",
      "sp_id": "1"
    },
    {
      "geo_location": "India",
      "sku": "CPG/Personal care",
      "sp_id": "2"
    }
  ]
}
*/
async function assignSKUsToSP(userid,sp_id, geo_sku_list) {
  try {
    let payload = {
      user_id : userid,
      sp_id : sp_id,
      geo_sku : geo_sku_list

    }
    //http://localhost:8300/assign_skus
    let apiUrl = ApiEnums.assign_skus
    //let apiUrl = "http://localhost:8300/assign_skus";
    let requestObject = {
      url: apiUrl,
      data: payload
    };
    const responseData = await postRequest(requestObject);
    if (responseData?.status === "success") {
      return responseData?.data;
    } else if (responseData?.status === "failed") {
      console.log(responseData?.message);
      return null;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export {
  getForecastPeriods,
  getDateRanges,
  stage1fileupload,
  fetchDataAvailability,
  sumbitWorkflow,
  fetchWorkflows,
  getAllSalesPersons,
  getProductHeirarchy,
  assignSKUsToSP
};
