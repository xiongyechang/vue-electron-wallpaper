import axios from "axios";

import { baseURL as bUrl } from "../config/config";

import { Response } from '@/constants/constants';

const baseURL = `${bUrl}api/`;

enum Method {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

// const access_token = localStorage.getItem("access_token");

axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `%7B%22roles%22%3A%5B%22admin%22%5D%2C%22_id%22%3A%22613c4c7cfab82939d483d145%22%2C%22username%22%3A%22%E7%86%8A%E4%B8%9A%E6%98%8C%22%2C%22age%22%3A24%2C%22telephone%22%3A%2218271532075%22%2C%22email%22%3A%222226791767%40qq.com%22%7D`;
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
    const data: Response = response.data as Response;
    return data;
  },
  async (error) => {
    console.log(error.response);
    return Promise.reject(error);
  }
);

const request = async (method: Method, url: string, data: any) => {
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

  return axios({
    baseURL,
    method,
    url,
    ...args,
  });
};

export default class Http {
  static GET = Method.Get;
  static POST = Method.Post;
  static DELETE = Method.Delete;
  static PUT = Method.Put;

  static async get(path: string, params: any) {
    return request(Http.GET, `${path}`, params);
  }
  static async post(path: string, params: any) {
    return request(Http.POST, `${path}`, params);
  }
  static async delete(path: string, params: any) {
    return request(Http.DELETE, `${path}`, params);
  }
  static async put(path: string, params: any) {
    return request(Http.PUT, `${path}`, params);
  }
}