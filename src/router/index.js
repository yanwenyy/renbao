/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo ,treeDataTranslate} from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV);
import data from '../utils/fakeMenuData'

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
    { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } },
    { path: '/summary-detail', component: _import('modules/summary/summary-detailed'), name: 'summary-detail', meta: { title: '明细表', isTab: true } },
    { path: '/authoriza', component: _import('modules/authoriza/list'), name: 'authoriza', meta: { title: '授权管理', isTab: true } },
    { path: '/rule', component: _import('modules/data/rule'), name: 'rule', meta: { title: '规则管理', isTab: true } },
    { path: '/auditRuleConfig', component: _import('modules/auditRuleConfig/auditRuleConfig'), name: 'auditRuleConfig', meta: { title: '审核规则配置', isTab: true } },
    { path: '/auditRuleMonitoring', component: _import('modules/auditRuleMonitoring/auditRuleMonitoring'), name: 'auditRuleMonitoring', meta: { title: '审核执行监控', isTab: true } },
    { path: '/resultDetailOut', component: _import('modules/resultDetailOut/resultDetailOut'), name: 'resultDetailOut', meta: { title: '结果明细导出', isTab: true } },

    { path: '/projectList', component: _import('modules/projectManage/projectList'), name: 'projectList', meta: { title: '立项管理', isTab: true } },
    { path: '/codemirror', component: _import('modules/projectManage/codemirror'), name: 'codemirror', meta: { title: 'sql编译器', isTab: true } },
    { path: '/ruleConfig', component: _import('modules/dataFirstExplore/ruleConfig'), name: 'ruleConfig', meta: { title: '初探规则配置', isTab: true } },
    { path: '/ruleMoniter', component: _import('modules/dataFirstExplore/ruleMoniter'), name: 'ruleMoniter', meta: { title: '初探规则监控', isTab: true } },
    { path: '/detailExport', component: _import('modules/dataFirstExplore/detailExport'), name: 'detailExport', meta: { title: '结果明细导出', isTab: true } },
    { path: '/reportExport', component: _import('modules/dataFirstExplore/reportExport'), name: 'reportExport', meta: { title: '初探报告导出', isTab: true } },
    { path: '/baseList', component: _import('modules/BaseCodeInfo/baseList'), name: 'baseList', meta: { title: '字典管理', isTab: true } },
    { path: '/component/BaseCodeInfo/:dataSortId/:dataSortName', component: _import('modules/BaseCodeInfo/component/BaseCodeInfo'), name: 'BaseCodeInfo', meta: { title: '基础数据', isTab: true } },
    // { path: '/component/BaseCodeTreeInfo', component: _import('modules/BaseCodeInfo/component/BaseCodeTreeInfo'), name: 'BaseCodeTreeInfo', meta: { title: '基础数据', isTab: true } },
  ],
    beforeEnter (to, from, next) {
      let token = Vue.cookie.get('token')
      if (!token || !/\S/.test(token)) {
        clearLoginInfo()
        next({ name: 'login' })
      }
      next()
    }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
      // if (data && data.code === 0) {
      //   fnAddDynamicMenuRoutes(data.menuList);
      //   router.options.isAddDynamicMenuRoutes = true
      //   sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
      //   sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
      //   next({ ...to, replace: true })
      // } else {
      //   sessionStorage.setItem('menuList', '[]')
      //   sessionStorage.setItem('permissions', '[]')
      //   next()
      // }


    http({
      url: http.adornUrl('/menu/getCurrentUserMenuList'),
      method: 'get',
    }).then(({data}) => {
      if (data && data.code === 200) {
        var datas=treeDataTranslate(data.result ,'menuId','menuParentId');
        changeName(datas)
        // console.log(datas)
        fnAddDynamicMenuRoutes(datas)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(datas || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
    })
  }
})
function changeName(list){
  list.forEach(item=>{
    item.url=item.menuUrl;
    item.type=item.menuUrl?1:0;
    item.name=item.menuName;
    item.orderNum=item.menuUrl;
    item.parentId=item.menuParentId;
    item.orderNum=item.menuSort;
    if(item.children&&item.children.length>0){
      changeName(item.children)
    }
  });
}
/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    // console.log(routes,mainRoutes)
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])

    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    // console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
