import axios from "axios";
import store from "../store";

export const BASE_URL = process.env.REACT_APP_BASE_ENDPOINT;
export const API_VERSION = process.env.REACT_APP_API_VERSION;

const instance = axios.create({
  baseURL: `${BASE_URL}/${API_VERSION}`,
  timeout: 15000,
  headers: { "content-type": "application/json" },
});

instance.interceptors.request.use(function (config) {
  const method = config.method?.toLowerCase();
  if (!["post", "put", "delete"].includes(method) && !config.url.includes("my") && !config.url.includes("user")) {
    return config;
  }
  const tokenstr = store.getState().userToken;
  console.log(tokenstr);
  if (!tokenstr) {
    return config;
  }

  // const tokenData = parseToken(tokenstr);
  // if (!checkTokenValid(tokenData?.token, tokenData?.token_exp)) {
  //   clearStorage();
  //   return Promise.reject();
  // }

  if (!config.headers) {
    config.headers = {};
  }
  config.headers.Authorization = `Bearer ${tokenstr?.token || ""}`;
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * get
 * @method get
 * @param {url, params, loading}
 */
const get = function (url, params) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, { params })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
/**
 * post
 * @method post
 * @param {url, params}
 */
const post = function (url, data) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * put
 * @method put
 * @param {url, params}
 */
const put = function (url, data) {
  return new Promise((resolve, reject) => {
    instance
      .put(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const rdelete = function (url, params) {
  return new Promise((resolve, reject) => {
    instance
      .delete(url, {
        params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default { get, post, put, delete: rdelete };