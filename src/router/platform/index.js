import Layout from '@/page/index/'

/**
 * 这里是自定义页面的路由
 */
export default [
  {
    path: '/goods/tags',
    component: Layout,
    redirect: '/goods/tags/index',
    children: [{
      path: 'index',
      name: '测试页2',
      meta: {
        keepAlive: true,
        isTab: true,
        isAuth: false,
        parentPath:"/goods/goods",
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/util/tags')
    }]
  },
  {
    path: '/goods/add',
    component: Layout,
    redirect: '/goods/add/index',
    children: [{
      path: 'index',
      name: '新增商品',
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: false,
        parentPath:"/goods/goods",
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/goods/goods_add')
    }]
  },
  {
    path: '/goods/view',
    component: Layout,
    redirect: '/goods/view/index',
    children: [{
      path: 'index',
      name: '商品详情',
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: false,
        parentPath:"/goods/goods",
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/goods/goods_info')
    }]
  },
  {
    path: '/order/view',
    component: Layout,
    redirect: '/order/order/index',
    children: [{
      path: 'index',
      name: '订单详情',
      meta: {
        keepAlive: false,
        isTab: true,
        isAuth: false,
        parentPath:"/order/order",
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/order/order_info')
    }]
  },
 

 
]
