import AC from './async_load.js'

export default [
  // 首页
  {
    type: 'Route',
    path: '/',
    exact: true,
    component: AC(() => import('pages/home'))
  }, 
  {
    type: 'Route',
    path: '/user/index',
    exact: true,
    component: AC(() => import('pages/user'))
  },
  // 商品类
  {
    type: 'Route',
    path: '/product/index',
    exact: false,
    component: AC(() => import('pages/product/index'))
  },
  {
    type: 'Route',
    path: '/product/save/:pid?',
    exact: false,
    component: AC(() => import('pages/product/index/save.js'))
  },
  {
    type: 'Route',
    path: '/product/detail/:pid',
    exact: false,
    component: AC(() => import('pages/product/index/detail.js'))
  },
  // 商品类别
  {
    type: 'Route',
    path: '/product-category/index/:categoryId?',
    exact: false,
    component: AC(() => import('pages/product/category'))
  },
  {
    type: 'Route',
    path: '/product-category/add',
    exact: false,
    component: AC(() => import('pages/product/category/add.js'))
  },
  {
    type: 'Route',
    path: '/order/index',
    exact: false,
    component: AC(() => import('pages/order'))
  },
  {
    type: 'Route',
    path: '/order/detail/:orderNumber',
    exact: false,
    component: AC(() => import('pages/order/detail.js'))
  },
  {
    type: 'Redirect',
    fromPath: '/order',
    toPath: '/order/index'
  },
  {
    type: 'Redirect',
    fromPath: '/product',
    toPath: '/product/index'
  },
  {
    type: 'Redirect',
    fromPath: '/product-category',
    toPath: '/product-category/index'
  },
  {
    type: 'Redirect',
    fromPath: '/user',
    toPath: '/user/index'
  },
  {
    type: 'Route',
    path: '*',
    exact: false,
    component: AC(() => import('pages/error'))
  }
]