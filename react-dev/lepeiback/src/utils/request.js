import fetch from 'dva/fetch';
import param from './param';
import {message} from 'antd';
import {addKeys} from '../utils/public';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default function request(url, options) {
  let fetchOptions = {};
  let token=sessionStorage.getItem("token");
  let userType=sessionStorage.getItem("userType");  //2:后台账号,3:APP账号
  let userId=sessionStorage.getItem("userId");
  fetchOptions.method = options.method;
  fetchOptions.headers = {
    "Authorization":token?"Bearer "+token:'',
    "User-Id":userId||'',
    "User-Type":userType||'',
  };
  options.formdata||(fetchOptions.headers["Content-Type"] = "application/json")

  // fetchOptions.credentials = 'include';
  if( options.method.toUpperCase() === 'GET' || options.method.toUpperCase() === 'DELETE') {
    if(options.urlParam){
      let params = {};
      params = {
        ...options.urlParam
      }
      let concatStr = '?',
      queryStr = param(params);
      if(url.indexOf(concatStr) > -1) {
        concatStr = '&'
      }
      if(queryStr) {
        url += (concatStr + queryStr);
      }
    }
  } else if(options.method.toUpperCase() === 'POST'||options.method.toUpperCase() === 'PUT'){
      fetchOptions.body = options.formdata ? options.urlParam : JSON.stringify(options.urlParam);
  }
  // console.log(fetchOptions)
  let loading = document.getElementById('ajaxLoading');
  loading.style.display = 'block';
  // debugger
  return fetch(url, fetchOptions)
    // .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      let loading = document.getElementById('ajaxLoading');
      loading.style.display = 'none';
      console.log(data)
      if(data.code !== 200 && data.code !== 401) {
        // throw new Error(data.msg || data.errorData.msg || '网络繁忙，请稍后重试.');
        return message.error(data.msg,3)
      } else if(data.code === 401) {
        window.app._history.push('login');
      }else{
        if(data.data&&data.data.dataList){
          addKeys(data.data.dataList)
        }else if(data.data){
          addKeys(data.data)
        }
        return data || {};
      }
    })
    .catch(e => {
      let loading = document.getElementById('ajaxLoading');
      loading.style.display = 'none';
      console.log(e)
      // if ( e && e.response && e.response.status === 403 ) {
      //   window.location.hash = '#/forbidden';
      // }else if(e && e.response && e.response.status === 504 ){
      //   message.error('网络繁忙,请稍后重试',3)
      // }else if(e && e.response && e.response.status === 502 ){
      //   message.error('服务器正在重启,请稍后重试',3)
      // }else{
      //   // let errmsg=String((e.message).replace(/\s+/g,""));
      //   // if(errmsg=="Failedtofetch" || errmsg=="Networkrequestfailed"){
      //   //   message.error("请检查网络连接是否成功")
      //   // }else{
      //     !options.hideError && message.error(e.message, 3);
      //   // }
      // }
      return Promise.reject(e);
    });
}
