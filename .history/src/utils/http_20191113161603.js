import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers['Content-Type'] = 'application/json';        //配置请求头
axios.defaults.baseURL = window.location.protocol;   //配置接口地址
//定义地址
export const urls = {
  loginUrl:"/dataRegisterApi/apiLogin/auth",
  logoutUrl:"/dataRegisterApi/apiLogin/logout",
  getResourcesUrl:"/dataRegisterApi/apiLogin/getResources",
  uploadUrl:"/dataRegisterApi/fileManager/upload",
  seachUrl:"/dataRegisterApi/fileManager/ls",
  downloadUrl:"/dataRegisterApi/fileManager/download",
  updatePasswordUrl:"/ums/updatePassword"
}

// http request 请求拦截器，有token值则配置上token值
axios.interceptors.request.use(
  config => {
    // if (config.method === 'post') {
    //   config.data = qs.stringify(config.data);
    // }
    if(config.headers.Authorization==''||config.headers.Authorization==undefined||config.headers.Authorization==null){
      if (localStorage.getItem('access_token')) {
        config.headers['Authorization-Access'] = 'Bearer ' + localStorage.getItem('access_token');
      }
      if (localStorage.getItem('dataRegister_token')) {
        config.headers['Authorization-DataRegister'] = 'Bearer ' + localStorage.getItem('dataRegister_token');
      }
    }
    let url = config.url
    // get参数编码
    if (config.method === 'get' && config.params) {
      
      config.headers["Content-Type"] = "multipart/form-data";
      config.responseType = 'blob';
      url += '?'
      let keys = Object.keys(config.params)
      for (let key of keys) {
        // url += `${key}=${encodeURIComponent(config.params[key])}&`
        url += `${key}=${config.params[key]}&`
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
    }
    config.url = url
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
  response => {
    //对响应数据做些事
    // if (!res.data.success) {
    //   return Promise.resolve(res);
    // }
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 清除token
          localStorage.removeItem('access_token');
          localStorage.removeItem('dataRegister_token');
          this.$router.push('/login');
      }
      // return Promise.reject(error.response.data)
    }else{
      
    }
    return Promise.reject(error)
  });
//返回一个Promise(发送post请求)
export function fetchPost(url, params,headerData) {
  return new Promise((resolve, reject) => {
    axios.post(url, params,headerData)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}
////返回一个Promise(发送get请求)
export function fetchGet(url, param) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params: param })
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// loginPost: function () {
//   let params ={'username': 'admin', 'password': 'admin123', 'rememberMe': 'true','isMobile':'1'}
//   https.fetchPost('/login',params ).then((data) => {
//       this.base.token = data.data.token　　　　
//       // console.log("this.base.tokenthis.base.token",this.base.token)
//       this.indexPost2(this.rres)
//   }).catch(err=>{
//           console.log(err)
//       }
//   )
// },
// indexPost2:function (date) {
//   var this_ = this
//   this_.check = false
//   var jobj ={data:{'menuDate': date,'token':this.base.token}}
//   let string  = JSON.stringify(jobj)
//   let params = {dailyInfo:string}
//   https.fetchPost('/meals/mobile/getDailyMenuByDate', params)
//   .then((data) => {
//       this_.base.indexData = data
//       this_.check = true
//       // console.log('thenthenthenthen',data)
//   })
//   .catch((err)=>{
//       console.log(err)

//   })
// },
// // ================================================
// },
export default {
  fetchPost,
  fetchPost,
}