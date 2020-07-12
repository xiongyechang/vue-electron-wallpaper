import axios from "axios";
let {
  baseURL
} = require("../config/config");

baseURL = `${baseURL}api/`;

// const access_token = localStorage.getItem("access_token");

axios.interceptors.request.use(
  (config) => {
    // if (access_token) {
    // config.headers.authorization = "Bearer " + access_token;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const request = async (method, url, data) => {
  let args = null;

  if (method === "GET" || method === "DELETE") {
    args = {
      params: data,
    };
  } else if (method === "POST" || method === "PUT") {
    args = {
      data,
    };
  } else {
    args = {};
  }

  return await axios({
    baseURL,
    method,
    url,
    ...args,
  });
};

export default class Http {
  static GET = "GET";
  static POST = "POST";
  static DELETE = "DELETE";
  static PUT = "PUT";

  static async get(path, params) {
    return await request(Http.GET, `${path}`, params).then((r) => r.data);
  }
  static async post(path, params) {
    return await request(Http.POST, `${path}`, params).then((r) => r.data);
  }
  static async delete(path, params) {
    return await request(Http.DELETE, `${path}`, params).then((r) => r.data);
  }
  static async put(path, params) {
    return await request(Http.PUT, `${path}`, params).then((r) => r.data);
  }
}