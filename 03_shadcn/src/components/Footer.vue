<template>
    <!-- <footer class="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-lg z-50"> -->
    <footer class="fixed bottom-4 left-4 right-4 bg-[#f3f3f3] rounded-2xl shadow-lg z-50">
        <nav class="h-16 flex items-center justify-around">
            <button @click="goHome" :class="getButtonClass(isHome)">
                <i class="fas fa-home text-lg md:text-lg"></i>
                <span class="text-xs mt-1">홈</span>
            </button>
            <button @click="goAsset" :class="getButtonClass(isAsset)">
                <i class="fas fa-chart-simple text-lg"></i>
                <span class="text-xs mt-1">자산분석</span>
            </button>
            <button @click="goCommunity" :class="getButtonClass(isCommunity)">
                <i class="fas fa-file-lines text-lg"></i>
                <span class="text-xs mt-1">커뮤니티</span>
            </button>
            <button @click="goMypage" :class="getButtonClass(isMypage)">
                <i class="fas fa-user text-lg"></i>
                <span class="text-xs mt-1">마이페이지</span>
            </button>
        </nav>
    </footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import HomeApi from "@/api/HomeApi";
import { useCommunityStore } from "@/stores/community";

const communityStore = useCommunityStore();

const router = useRouter();
const route = useRoute();

// 사용자 정보를 가져오는 함수
const userName = ref('');
const getUser = async () => {
    try {
        const userInfo = await HomeApi.getMyInfoFooter(); // /home/info 호출
        userName.value = userInfo.userName;
    } catch (error) {
       // console.error("사용자 정보 가져오는 함수 API 호출 중 오류 발생:", error);
    }
};
const assetFlag = ref(false);
const getAsset = async () => {
    try {
        const response = await HomeApi.accountListFooter();
        assetFlag.value = true;
    } catch (error) {
        assetFlag.value = false;
    }
};
onMounted(() => {
    getUser();
    getAsset();
});

// 라우팅 정보에 따라 버튼 색상 변경
const isHome = computed(() => route.path === '/home');
const isAsset = computed(() => route.path.startsWith('/asset'));
const isCommunity = computed(() => route.path.startsWith('/community'));
const isMypage = computed(() => route.path === '/mypage');

// 라우터 이동 함수
const goHome = () => {
    router.push({ name: 'main' });
};
const goAsset = () => {
    if(assetFlag.value == false){
        alert('계좌 연결 후 이용해주세요.');
    }
    else{
        router.push({ name: 'asset' });
    }
};
const goCommunity = () => {
    communityStore.setCurrentPage(1);
    router.push({ name: 'communityList' });
};
const goMypage = () => {
    if(userName.value == 'NoLogin'){
        alert('로그인 후 이용해주세요.');
    }
    else{
        router.push({ name: 'mypage' });
    }
};

const getButtonClass = (isActive) => {
    return `flex flex-col items-center justify-center w-1/4 focus:outline-none transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
        }`;
};
</script>

<style scoped></style>
