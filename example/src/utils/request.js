import axios from "axios";

// 创建axios实例
const service = axios.create({
  baseURL: "",
  timeout: 10000,
});

service.interceptors.request.use((config) => {
  return config;
});

// 响应拦截器
service.interceptors.response.use(async (response) => {
  const config = response.config;

  // 服务状态
  if (response.status !== 200) {
    return Promise.reject(res);
  }

  // 状态200 处理
  const res = response.data;

  return Promise.resolve(res);
});

export default service;
