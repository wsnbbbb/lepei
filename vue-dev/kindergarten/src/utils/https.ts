import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Toast } from "vant";

export interface ResponseData {
  code: number;
  data?: any;
  msg: string;
}

// 创建 axios 实例
let service: AxiosInstance | any;
let userInfo = {
  "User-Id": '',
  "Person-Id": '',
  "Token": '',
  "App-Identify": ''
}
if(localStorage.getItem("userInfo")){
  userInfo["User-Id"] = JSON.parse(localStorage.getItem("userInfo"))["User-Id"]
  userInfo["Person-Id"] = JSON.parse(localStorage.getItem("userInfo"))["Person-Id"]
  userInfo["Token"] = JSON.parse(localStorage.getItem("userInfo"))["Access-Token"]
  userInfo["App-Identify"] = JSON.parse(localStorage.getItem("userInfo"))["App-Identify"]
}

if (process.env.NODE_ENV === "development") {
  service = axios.create({
    baseURL: "http://39.108.73.183:7017/", 
    // baseURL: "http://192.168.10.25:8099/", // 飞飞电脑
    timeout: 50000,// 请求超时时间
    headers:{ // 教师端
      "User-Id": userInfo["User-Id"],
      "Person-Id": userInfo["Person-Id"],
      "Access-Token": userInfo["Token"],
      "App-Identify": userInfo["App-Identify"],
    },
  
  });
} else {
  // 生产环境下
  service = axios.create({
    baseURL: "http://yeyapp.lepayedu.com/", 
    timeout: 50000,// 请求超时时间
    headers:{ // 教师端
      "User-Id": userInfo["User-Id"],
      "Person-Id": userInfo["Person-Id"],
      "Access-Token": userInfo["Token"],
      "App-Identify": userInfo["App-Identify"],
    },
  
  });

}

// request 拦截器 axios 的一些配置
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error: any) => {
    // Do something with request error
    console.error("error:", error); // for debug
    Promise.reject(error);
  }
);

// respone 拦截器 axios 的一些配置
service.interceptors.response.use(
  (res: AxiosResponse) => {
    // Some example codes here:
    // code == 0: success
    if (res.status === 200) {
      const data: ResponseData = res.data
      if (data.code === 0) {
        return data.data;
      } else {
        Toast(data.msg);
      }
    } else {
      Toast("网络错误!");
      return Promise.reject(new Error(res.data.msg || "Error"));
    }
  },
  (error: any) => Promise.reject(error)
);

export default service;