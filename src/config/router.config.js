import { UserLayout} from '@/components/layouts'
import Index from '@/views/user/Index'
import Service from '@/views/user/Service'

/**
 * Go to the menu, go to the permission control
 * @type {[null,null]}
 */
export const asyncRouterMap = [


  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * based routing
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/register',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/register/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/register/RegisterResult')
      },
      {
        path: 'alteration',
        name: 'alteration',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/alteration/Alteration')
      },
    ]
  },

  {
    path: '/service',
    component: Service,
    children: [
      {
        path: 'windows',
        name: 'windows',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/ServiceWindows')
      },
      {
        path: 'custom',
        name: 'custom',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Custom')
      },
    ]
  },
  {
    path: '/index',
    component: Index,
    // children: [
    //   {
    //     path: 'index',
    //     name: 'index',
    //     component: () => import(/* webpackChunkName: "user" */ '@/views/user/Index')
    //   },
    // ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

]
