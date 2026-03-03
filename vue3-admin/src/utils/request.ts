import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { ApiCode } from "@/enums/api";

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, data, msg } = response.data;
    if (code === ApiCode.SUCCESS) {
      return data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default http;
