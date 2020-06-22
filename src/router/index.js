import Vue from 'vue';
import Router from 'vue-router';

//路由懒加载
// () => import('./Foo.vue')

//引入组建
import login from '../login';
import home from '../home';
import notFound from '../404';
import upload from "../page/upload";
import download from "../page/download";
import changePassword from "../page/changePassword";

Vue.use(Router);

let routes = [{
  path: '/login',
  component: login,
  name: 'login',
  hidden: true
},
{
  path: '*',
  component: notFound,
  name: 'notFound',
  hidden: true
},
{
  path: '/',
  component: home,
  name: 'file',
  iconCls: 'el-icon-message',
  children: [
    {
      path: 'upload',
      component: upload,
      name: 'upload'
    },
    {
      path: 'download',
      component: download,
      name: 'download'
    },
    {
      path: 'changePassword',
      component: changePassword,
      name: 'changePassword'
    }
  ]
}

]



export default new Router({
  mode: 'history',
  routes
})
