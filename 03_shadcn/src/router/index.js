import { createRouter, createWebHistory } from "vue-router";

import assetRoutes from './asset';
import communityRoutes from './community';
import homeRoutes from './home';
import missionRoutes from './mission';
import mypageRoutes from './mypage';
import userRoutes from './user';
import utilRoutes from './util';


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes : [
        {
            path: '/',
            redirect: '/user' // 루트 경로를 /login으로 리다이렉트  => 추후에 로그인 코튼 확인해서 로그인 안되있으면 이동으로 수정해야함
        },
        ...assetRoutes,
        ...communityRoutes,
        ...homeRoutes,
        ...missionRoutes,
        ...mypageRoutes,
        ...userRoutes,
        ...utilRoutes
    ]   
})
export default router;