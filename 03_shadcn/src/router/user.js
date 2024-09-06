export default[
    {
        path: '/user',
        name: 'user',
        component:()=>import('../pages/user/Login.vue')
    },
    {
        path:'/user/signup',
        name:'userSignup',
        component:()=>import('../pages/user/Signup.vue')
    },
    {
        path:'/user/social-signup',
        name:'userSocialSignUp',
        component:()=>import('../pages/user/SocialSignup.vue')
    },
    {
        path:'/user/findid',
        name:'userFindId',
        component:()=>import('../pages/user/FindID.vue')
    },
    {
        path:'/user/findpwd',
        name:'userFindPwd',
        component:()=>import('../pages/user/FindPwd.vue')
    }
];