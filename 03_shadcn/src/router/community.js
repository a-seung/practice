export default[
    {
        path: '/community',
        name: 'communityList',
        component:()=>import('../pages/community/CommunityList.vue')
    },
    {
        path:'/community/add',
        name:'communityAdd',
        component:()=>import('../pages/community/CommunityAdd.vue')
    },
    {
        path:'/community/detail/:postId',
        name:'communityDetail',
        component:()=>import('../pages/community/CommunityDetail.vue')
    }
];