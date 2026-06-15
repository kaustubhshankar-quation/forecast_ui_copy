import { getRequest, postRequest, ApiEnums } from "./DataRequestService";
import HttpService from "../services/HttpService";



 async function getOrderDetails(sku_name, workflow_id){
  let apiUrl = ApiEnums.get_orderdetails;
  let requestObject = {
    url: apiUrl,
    config: {
      params: {
        sku: sku_name,
        workflow_id :workflow_id
      },
    },
  };
  const responseData = await getRequest(requestObject);
  return responseData;
  // if (responseData.status === "success") {
  //   return responseData.data;
  // } else if (responseData.status === "failed") {
  //   console.log(responseData.message);
  //   return null;
  // }
 }

export { getOrderDetails }; 
  