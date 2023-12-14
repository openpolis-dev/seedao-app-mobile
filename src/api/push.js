import axios from "axios";
import { isMobile } from "utils/userAgent";
import store from "../store";

const TEMP_ENDPPOINT = "https://test-push-api.seedao.tech/v1";
const PATH_PREFIX = "/push";

const getHeaders = () => {
 
  const tokenstr = store.getState().userToken;
  return {
    Authorization: `Bearer ${tokenstr?.token || ""}`,
  };
};

export const registerDevice = (data) => {
  const headers = getHeaders();
  axios.post(`${TEMP_ENDPPOINT}/register`, data, {
    headers,
  });
};

export const requestSetDeviceLanguage = (data) => {
  const headers = getHeaders();
  return axios.post(`${TEMP_ENDPPOINT}/set_language`, data, {
    headers,
  });
};

export const getPushDevice = () => {
  return isMobile ? "mobile" : "pc";
};
