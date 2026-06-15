import HttpService from '../services/HttpService'

const ApiEnums = {
  masterdata: "/masterdata",
  getproducthierarchy: "/getproducthierarchy",
  getDateRange: "/getDateRange",
  // upload_exog_files : '/upload_exog_files',
  upload_exog_files: '/upload_exog_files',
  getgeohierarchy: '/getgeohierarchy',
  getDataAvailability: '/getDataAvailability',
  submitTask: '/submitTask',
  get_workflows: '/get_workflows',
  wf_name_check: '/wf_name_check',

  // Indentation APIs
  getWorkflowCombinations: '/getCombinedSKUs',
  get_orderdetails: '/getIndentationforecastEOQ',

  //Manage Workflow APIs
  getActPredFcastResults: '/getActPredFcastResults',
  getForecastResults: '/getForecastResults',
  getTopOneModelResults: '/getTopOneModelResults',
  getmultipleModelResults: '/getmultipleModelResults',
  getmultipleActPredFcastResults: '/getmultipleActPredFcastResults',
  getmultipleForecastResults: '/getmultipleForecastResults',


  get_sp: '/get_sp',
  getTopThreeModelResults: '/getTopThreeModelResults',
  get_sp_sku_mapping:'/get_sp_sku_mapping',
  assign_skus:'/assign_skus',
  get_all_sp:'/get_all_sp',
  send_email_f_skus: '/send_email_f_skus'
}


async function postRequest(requestObject) {
  try {
    const axiosClient = HttpService.getAxiosClient();
    const responseObject = await axiosClient.post(
      requestObject?.url,
      requestObject?.data,
      requestObject?.config
    );

    if (responseObject?.status === 200 || responseObject?.status === 201) {
      return responseObject.data;
    } else {
      console.error("Unexpected response status in postRequest:", responseObject?.status);
      return {
        status: 'error',
        output: `Unexpected response status: ${responseObject?.status}`
      };
    }
  } catch (error) {
    console.error("Error in postRequest:", error);

    const errorMessages = {
      400: "Bad Request",
      401: "Unauthorized Access",
      403: "Forbidden",
      404: "Resource Not Found",
      405: "Method Not Allowed",
      408: "Request Timeout",
      429: "Too Many Requests",
      500: "Internal Server Error",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
    };

    let statusCode = error?.response?.status;
    let message = errorMessages[statusCode] || "An unexpected error occurred";

    if (error.response) {
      // Server responded with a status outside 2xx
      return {
        status: 'error',
        output: message,
        details: error.response?.data || null
      };
    } else if (error.request) {
      // Request made but no response
      return {
        status: 'error',
        output: "No response received from server. Please check your network connection."
      };
    } else {
      // Something else happened while setting up the request
      return {
        status: 'error',
        output: `Request setup failed: ${error.message}`
      };
    }
  }
}


function getRequest(requestObject) {
  const axiosClient = HttpService.getAxiosClient();
  let responseObject = axiosClient.get(requestObject.url, requestObject.config)
    .then(response => responseObject = response.data)
    .catch(error => {
      console.log('Error in DataRequestService.getRequest');
      console.error(error);
      return responseObject = 'error';
    });

  return responseObject;
}

/*
setCookie("access_token", "abcdef123456", 7); // Set access_token for 7 days
*/

function setCookie(name, value, days, options = {}) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  let cookieString = name + "=" + (value || "") + expires + "; path=/";

  if (options.secure) cookieString += "; Secure";
  if (options.httpOnly) cookieString += "; HttpOnly";  // Note: This won't actually work on client-side JavaScript, only server-side.
  if (options.sameSite) cookieString += "; SameSite=" + options.sameSite;

  document.cookie = cookieString;
}

/*
let token = getCookie("access_token");
console.log(token); // Outputs the stored token value or null if not found

*/
function getCookie(name) {
  let nameEQ = name + "=";
  let cookiesArray = document.cookie.split(';');
  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i];
    while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length); // Remove leading spaces
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

/*
Explanation:function deleteCookie(name)
name + "=": Sets the cookie value to an empty string.
expires=Thu, 01 Jan 1970 00:00:00 UTC: Sets the expiration date to a past date, which effectively deletes the cookie.
path=/: Ensures the cookie is deleted for the entire site. This is important because cookies are path-specific, and without this, the cookie might persist on other paths.
*/

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}



export { ApiEnums, postRequest, getRequest, setCookie, getCookie, deleteCookie }