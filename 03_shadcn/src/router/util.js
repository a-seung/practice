export default[
    {
        path:'/util/error',
        name:'error',
        component:()=>import('../components/Error.vue')
    },
    {
        path:'/util/loading',
        name:'loading',
        component:()=>import('../components/Loading.vue')
    }
]