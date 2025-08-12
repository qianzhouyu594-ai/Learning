import {createRouter, createWebHashHistory} from 'vue-router'

import Layout from '../pages/Main.vue'
import Login from '../pages/login/index.vue'
import Dashboard from '../pages/dashboard/index.vue'
import Admin from '../pages/auth/admin/index.vue'
import Group from '../pages/auth/group/index.vue'
import Staff from '../pages/vppz/staff/index.vue'
import Order from '../pages/vppz/order/index.vue'

const routes =[
    {
        path:'/',
        component:Layout,
        name:'main',
        children:[
            {
                path:'dashboard',
                meta:{id:1,name:'控制台',icon:'Platform',path:'/dashboard',descrice:'展示当前系统中的统计数据'},
                component:Dashboard
            },
            {
                path:'auth',
                meta:{id:2,name:'权限管理',icon:'Grid'},
                children:[
                    {
                        path:'',
                        alias:['admin'],
                        meta:{id:'1',name:'账号管理',icon:'Avatar',path:'/auth/admin',descrice:'管理员可以编辑'},
                        component:Admin
                    },
                    {
                        path:'group',
                        meta:{id:'2',name:'菜单管理',icon:'Menu',path:'/auth/group',descrice:'菜单规则对应控制方法'},
                        component:Group
                    },
                ],
            },
            {
                path:'vppz',
                meta:{id:'3',name:'美女陪诊',icon:'BellFilled'},
                children:[
                    {
                        path:'',
                        alias:['staff'],
                        meta:{id:'1',name:'陪护管理',icon:'Checked',path:'/vppz/staff',descrice:'陪护师可以进行创建和修改'},
                        component:Staff
                    },
                    {
                        path:'order',
                        meta:{id:'2',name:'订单管理',icon:'List',path:'/vppz/order',descrice:'查看所有订单状态'},
                        component:Order
                    },
                ]
                        
            },
        ],
    },
    {
        path:'/login',
        component:Login
        
    }
]

const router = createRouter({
    //创建路由规则
    routes,
    //选择显示模式
    history:createWebHashHistory()
})

export default router