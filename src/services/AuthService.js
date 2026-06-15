import { Navigate } from 'react-router-dom';
import { postRequest,getRequest,setCookie,getCookie,deleteCookie } from '../services/DataRequestService';
import { useNavigate } from "react-router-dom";
import { displayMessage } from '../Utils/helper';
import { clearAllRecords }  from '../services/IndexedDBUtil';


const client_secret = process.env.REACT_APP_CLIENT_SECRET; 
const clientID = process.env.REACT_APP_CLIENT_ID;
const server = process.env.REACT_APP_KEYCLOAK_SERVER;
const realmname = process.env.REACT_APP_REALM_NAME;

// Login function
const login = async (credentials) => {
    let loginStatus = false;
    try {
   
    let requestObject = {
      
        url: `${server}/realms/${realmname}/protocol/openid-connect/token`,
        url: `${server}/realms/${realmname}/protocol/openid-connect/token`,
        config: {
          params: {
            "clientId":clientID
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        },
        data: {
          "username": credentials.username,
          "password": credentials.password,
          "client_id": clientID,
          "client_secret": client_secret,
          "grant_type": "password"
        }
      }
      const responseObject = await postRequest(requestObject); 

      if(responseObject?.status === "error"){
        displayMessage('danger','Login failed', responseObject.output);
        return false;
      }
      
      const responseUserInfoApi = await getUserInfo(responseObject.access_token);
  
      if (responseObject.access_token && responseObject.refresh_token) {
        // Store tokens in cookies
        let isAdminRole = responseUserInfoApi?.realm_access?.roles.includes('adminrole');
        setCookie('access_token', responseObject.access_token);
        setCookie('isadminrole', isAdminRole)
        setCookie('refresh_token', responseObject.refresh_token);
        setCookie('username', responseUserInfoApi.name);
        setCookie('sub', responseUserInfoApi.sub);
        setCookie('email', responseUserInfoApi.email);
        setCookie('preferred_username', responseUserInfoApi.preferred_username);

        // Redirect user after successful login
        window.location.href = '/Dashboard';  // or use useNavigate() from react-router-dom
        loginStatus = true;
        return loginStatus;
        
      }
    } catch (error) {
      console.error('Login failed', error);
      displayMessage('danger','Login failed', error);
    }
    return loginStatus;
  };

  const  getUserInfo = async(token)=>{
    let requestObject = {
      
        url: `${server}/realms/${realmname}/protocol/openid-connect/userinfo`,
        url: `${server}/realms/${realmname}/protocol/openid-connect/userinfo`,
        config: {
          params: {
            "clientId":clientID
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization' : `Bearer ${token}`
        }
        }
      }
      const responseObject = await getRequest(requestObject);
      return responseObject;
    }

  
  //When the access token expires, use the refresh token to obtain a new access token.
  const refreshaccess_token = async () => {
    const refresh_token = getCookie('refresh_token');
  
    if (!refresh_token) {
      logout();  // Handle user logout if no refresh token is available
      return;
    }
  
    try {
      const response = await fetch('YOUR_REFRESH_TOKEN_API_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token }),
      });
  
      const data = await response.json();
  
      if (data.access_token) {
        setCookie('access_token', data.access_token);
      } else {
        logout();  // Handle user logout if refreshing token fails
      }
    } catch (error) {
      console.error('Token refresh failed', error);
      logout();
    }
  };
  

  //Create a function to check if the user is logged in by verifying the access token.
  const isAuthenticated = () => {
    const access_token = getCookie('access_token');
    return !!access_token;  // Return true if access token exists
  };

  const getAccessToken = () => {
    return getCookie('access_token');
  }
  
  //Remove tokens from storage and redirect the user to the login page on logout.
  const logout = () => {    
    // Clear tokens    
    deleteCookie('access_token');
    deleteCookie('refresh_token');  
    deleteCookie('username'); 
    deleteCookie('sub');
    deleteCookie('email');
    deleteCookie('preferred_username');
    sessionStorage.clear('formData');
    // clearAllRecords("MyDatabase", "myStore").then(() => {
    //   console.log("All records cleared");
    // });
    // Redirect to login
    window.location.href = '/';  // or useNavigate() from react-router-dom
  };
  

  //Use a higher-order component (HOC) or React Router to protect certain routes.
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!getCookie('access_token');
    return isAuthenticated ? children : <Navigate to="/login" />;
  };



  const AuthService = {
    login,
    logout,
    ProtectedRoute, 
    isAuthenticated,
    refreshaccess_token,
    getAccessToken
  }

  export default AuthService;