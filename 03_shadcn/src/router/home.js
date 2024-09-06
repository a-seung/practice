export default[
    {
        path: '/home',
        name: 'main',
        component:()=>import('../pages/home/Main.vue')
    },
    {
        path:'/home/account',
        name:'accountList',
        component:()=>import('../pages/home/AccountList.vue')
    },
    {
        path:'/home/account-detail',
        name:'accountDetail',
        component:()=>import('../pages/home/AccountDetail.vue')
    },
    {
        path:'/home/bank',
        name:'addBank',
        component:()=>import('../pages/home/AddBank.vue')
    },
    {
        path: '/home/bank-login',
        name: 'bankLogin',
        component:()=>import('../pages/home/BankLogin.vue')
    },
    {
        path:'/home/survey-start',
        name:'surveyStart',
        component:()=>import('../pages/home/SurveyStart.vue')
    },
    {
        path:'/home/survey',
        name:'survey',
        component:()=>import('../pages/home/Survey.vue')
    },
    {
        path:'/home/survey-result',
        name:'surveyResult',
        component:()=>import('../pages/home/SurveyResult.vue')
    }
];