import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Prefer environment variable so backend URL can be configured without code changes
const apiBase = process.env.REACT_APP_API_BASE_URL || ''

const axiosInstance = axios.create({
  baseURL: apiBase,
  timeout: 10000,
});

// Mock adapter has been disabled - we use setupProxy.js for API proxying instead
// This ensures all /api requests are forwarded to the real backend via the proxy

axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token to headers
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle errors globally
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

// 创建类型安全的HTTP客户端，响应拦截器返回response.data
interface HttpClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  request<T = any, R = any>(config: AxiosRequestConfig): Promise<R>;
}

const http: HttpClient = axiosInstance as any;

export default http;
