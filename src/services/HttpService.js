import axios from "axios";
import UserService from "./UserService";
import AuthService from "./AuthService"

const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

const _axios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    Accept: "application/json"
  }
});

// const configure_old = () => {
//   _axios.interceptors.request.use((config) => {
//     if (UserService.isLoggedIn()) {
//       const cb = () => {
//         config.headers.Authorization = `Bearer ${UserService.getToken()}`;
//         config.headers.access_token = UserService.getToken();
//         return Promise.resolve(config);
//       };
//       return UserService.updateToken(cb);
//     }
//   });
// };

// Function to configure interceptors
const configure = () => {
  _axios.interceptors.request.use(
    (config) => {
      if (AuthService.isAuthenticated()) {
        const accessToken = AuthService.getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          config.headers.access_token = accessToken;
        }
      }
      return config; // Ensure the modified config is returned
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Auto-configure when this file is imported
configure();

const getAxiosClient = () => _axios;

const HttpService = {
  HttpMethods,
  configure,
  getAxiosClient,
};

export default HttpService;
