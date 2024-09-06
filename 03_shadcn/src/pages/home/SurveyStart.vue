<template>
  <div class="page">
    <header class="w-full flex justify-between items-center mb-6 px-2 relative">
      <button class="text-lg" @click="goBack">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <p class="font-bold text-base absolute left-1/2 transform -translate-x-1/2">자산 유형 검사</p>
    </header>

    <div class="flex flex-col items-center justify-center mt-10 px-4">
      <img src="/images/friends-logo.png" class="w-[250px] h-auto" />
      <div class="text-base flex flex-col justify-center text-center mt-6">
        <p>내가 어떤 자산 관리 유형인지</p>
        <p>확인해보시겠어요?</p>
        <p>검사는 2분 정도 걸려요.</p>
        <p>처음 시작하면 뒤로 가기 어려워요.</p>
      </div>
      <button @click="goToSurvey" class="button mt-6 w-full max-w-xs mx-auto">유형 검사 하러 가기</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  // router.push({name: 'main'});
  router.back();
};

const goToSurvey = () => {
  router.push({ name: 'survey' });
};
</script>
