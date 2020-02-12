import axios from "taro-axios";

const baseURL = `https://service-f9fjwngp-1252021671.bj.apigw.tencentcs.com/`
const service = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 300000
});
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error)
  })

export default service
