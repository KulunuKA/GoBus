import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Keys";
import { AuthService } from "./auth services";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

const requestHandler = (request) => {
  const TOKENS = AuthService?.getTokens();

  if (TOKENS && !request.headers.Authorization) {
    request.headers.Authorization = `Bearer ${TOKENS}`;
  }

  return request;
};

const responseHandler = (response) => {
  return response.data;
};

const errorHandler = async (error) => {
  //   const TOKENS = AuthService.getTokens();
  //   const originalConfig = error.config;

  //   if (
  //     originalConfig.url !== BASE_URL + "/auth/refresh-token" &&
  //     error.response
  //   ) {
  //     if (
  //       error.response.status === 403 &&
  //       !originalConfig._retry &&
  //       refreshFlag
  //     ) {
  //       originalConfig._retry = true;
  //       refreshFlag = false;

  //       try {
  //         const rs = await axios.post(BASE_URL + "auth/refresh-token", {
  //           refresh_token: TOKENS ? TOKENS.RefreshToken : null,
  //         });

  //         const tokenData = {
  //           access: rs.data.data.access,
  //           refresh: rs.data.data.refresh,
  //         };

  //         AuthService.setTokens(tokenData);
  //         axiosInstance.defaults.headers["Authorization"] =
  //           "Bearer " + rs.data.data.access;
  //         originalConfig.headers["Authorization"] =
  //           "Bearer " + rs.data.data.access;

  //         refreshFlag = true;

  //         return axiosInstance(originalConfig);
  //       } catch (_error) {
  //         refreshFlag = true;
  //         AuthService.logout();

  //         return Promise.reject(_error);
  //       }
  //     }
  //   } else if (originalConfig.url === BASE_URL + "/auth/refresh-token") {
  //     AuthService.logout();
  //     const navigate = useNavigate();
  //     localStorage.setItem("rem", false);
  //     navigate("/login");
  //   }

  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

export default axiosInstance;
