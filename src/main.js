// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import Router from 'vue-router';
// import 'lib-flexible/flexible'
import './assets/js/flexible'
import 'babel-polyfill'
// import $ from 'jquery';
import axios from 'axios';
import Qs from 'qs'
// import 'font-awesome/css/font-awesome.min.css';

import { urls, fetchPost, fetchGet } from '@/utils/http'
import common from '@/utils/common'

Vue.use(ElementUI);
Vue.use(Router);
Vue.prototype.$axios = axios;
Vue.prototype.$qs = Qs;
Vue.prototype.$post = fetchPost;
Vue.prototype.$get = fetchGet;
Vue.prototype.$urls = urls;
Vue.prototype.$common = common;

router.beforeEach((to,from,next)=>{
  if(to.path=='/login'){
    sessionStorage.removeItem(('user'));
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if(!user&&to.path!='/login'){
    next({
      path: '/login'
    });
  }else{
    next();
  }
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

import router from './router/index'


// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
  // components: { App },
  // template: '<App/>'
})
