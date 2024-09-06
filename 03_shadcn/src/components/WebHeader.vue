<template>
  <nav class="hidden lg:flex justify-between items-center px-8 py-2 bg-white shadow-md fixed top-0 left-0 w-full h-[60px] z-50 ">
    <div><img src="/images/logo.png" alt="Logo" @click="goHome" class="w-28 mt-2 cursor-pointer" /></div>
    <div>
      <ul class="flex space-x-10 text-base">
        <li><button @click="goHome" class="hover:text-primary" :class="{ 'text-primary font-bold': isHomeActive }">홈</button></li>
        <li><button @click="goMission" class="hover:text-primary" :class="{ 'text-primary font-bold': isMissionActive }">미션</button></li>
        <li><button @click="goAsset" class="hover:text-primary" :class="{ 'text-primary font-bold': isAssetActive }">내 자산분석</button></li>
        <li><button @click="goCommunity" class="hover:text-primary" :class="{ 'text-primary font-bold': isCommunityActive }">커뮤니티</button></li>
        <li><button @click="goMypage" class="hover:text-primary" :class="{ 'text-primary font-bold': isMypageActive }">마이페이지</button></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import HomeApi from "@/api/HomeApi";
import { useCommunityStore } from "@/stores/community";
const communityStore = useCommunityStore();

const router = useRouter();
const route = useRoute();


// mount 할 때 정보 가져오기
onMounted(() => {
    getUser();
    getAsset();
});

// 사용자 정보를 가져오는 함수
const userName = ref('');
const userType = ref('0');
const getUser = async () => {
    try {
        const userInfo = await HomeApi.getMyInfoFooter(); // /home/info 호출
        userName.value = userInfo.userName;
        userType.value = userInfo.finTypeCode;
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


//라우터 이동 함수
const goHome = () => {
  router.push({ name: 'main' });
};

const goMission = () =>{
    if(userType.value == '0'){
        alert('유형검사 후 이용해주세요.');
    }else if(assetFlag.value == false){
        alert('계좌 연결 후 이용해주세요.');
    }
    else{
        router.push({ name: 'mission' });
    }
 }
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

// 메뉴 활성화 상태를 체크
const isHomeActive = computed(() => route.path === '/home');
const isMissionActive = computed(() => route.path === '/mission');
const isAssetActive = computed(() => route.path.startsWith('/asset'));
const isCommunityActive = computed(() => route.path.startsWith('/community'));
const isMypageActive = computed(() => route.path === '/mypage');
</script>
