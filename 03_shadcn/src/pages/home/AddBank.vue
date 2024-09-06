<template>
  <div class="page">
    <header class="w-full flex justify-between items-center mb-6 px-2 relative">
      <button class="text-lg" @click="handleBackClick">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <p class="font-bold text-base absolute left-1/2 transform -translate-x-1/2">계좌 연결하기</p>
    </header>

    <div class="section-style lg:mx-20 lg:pt-4">
      <div class="text-center mt-2 mb-4 lg:mb-4">
        <p class="font-bold text-base">은행 선택</p>
      </div>
      <!-- 은행 선택 섹션 -->
      <div class="grid grid-cols-3 gap-4 text-center">
        <button v-for="(bankName, index) in bankNames" :key="index" class="flex flex-col items-center cursor-pointer" @click="selectBank(bankName)">
          <img :src="`/images/bank/${bankName}.png`" :alt="bankName" class="w-20 h-20 object-contain" />
          <span class="mt-2 text-sm">{{ changeName(bankName) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useBankStore } from '@/stores/bank'; // Pinia 스토어 가져오기

const router = useRouter();
const bankStore = useBankStore(); // Pinia 스토어 사용

const bankNames = [
  'KB', // 국민은행
  'Shinhan', // 신한은행
  'IBK', // 기업은행
  'Woori', // 우리은행
  'NH', // 농협은행
  'Hana', // 하나은행
  'KakaoBank', // 카카오뱅크
  'KBank', // K뱅크
  'PostOfficeBank', // 우체국
  'Shinhyup', // 신협
  'SaemaulGeumgo', // 새마을금고
  'Gyeongnam', // 경남은행
  'Jeonbuk', // 전북은행
  'Jeju', // 제주은행
  'Gwangju', // 광주은행
  'Busan', // 부산은행
  'IM', // IM
  'Citi', // 씨티은행
  'SC', // SC
  'IndustrialBank', // 산업은행
  'Suhyup', // 수협은행
];

// 뒤로가기 버튼 클릭 시 실행되는 함수
const handleBackClick = () => {
  router.push({ name: 'main' });
};

const changeName = (name) => {
  if (name == 'Gyeongnam') {
    return '경남은행';
  } else if (name == 'Gwangju') {
    return '광주은행';
  } else if (name == 'Busan') {
    return '부산은행';
  } else if (name == 'IndustrialBank') {
    return '산업은행';
  } else if (name == 'SaemaulGeumgo') {
    return '새마을금고은행';
  } else if (name == 'Suhyup') {
    return '수협은행';
  } else if (name == 'Shinhan') {
    return '신한은행';
  } else if (name == 'Shinhyup') {
    return '신협은행';
  } else if (name == 'Citi') {
    return '씨티은행';
  } else if (name == 'Woori') {
    return '우리은행';
  } else if (name == 'PostOfficeBank') {
    return '우체국은행';
  } else if (name == 'Jeonbuk') {
    return '전북은행';
  } else if (name == 'Jeju') {
    return '제주은행';
  } else if (name == 'KakaoBank') {
    return '카카오뱅크';
  } else if (name == 'Hana') {
    return '하나은행';
  } else if (name == 'IBK') {
    return 'IBK기업은행';
  } else if (name == 'IM') {
    return 'IM';
  } else if (name == 'KBank') {
    return 'K뱅크';
  } else if (name == 'KB') {
    return '국민은행';
  } else if (name == 'NH') {
    return '농협은행';
  } else if (name == 'SC') {
    return 'SC';
  }
};

// 은행 선택 시 실행되는 함수
const selectBank = (bankName) => {
  if(bankName == 'KakaoBank' ||
    bankName == 'KBank'|| 
    bankName == 'PostOfficeBank' || 
    bankName == 'Shinhyup' || 
    bankName == 'SaemaulGeumgo' || 
    bankName == 'Gyeongnam'||  
    bankName == 'Jeonbuk'||  
    bankName == 'Jeju' || 
    bankName == 'Gwangju' || 
    bankName == 'Busan' || 
    bankName == 'IM' || 
    bankName == 'Citi' || 
    bankName == 'SC' || 
    bankName == 'IndustrialBank' ||
    bankName == 'Suhyup'){
    alert("서비스 준비중입니다...");
  }
  else{
    bankStore.setSelectedBank(changeName(bankName)); // Pinia 스토어에 선택된 은행 저장
    //  console.log("선택된 은행:", bankName); // 테스트용 콘솔 출력

    // 은행 선택 후 /home/bank-login 경로로 이동
    router.push('/home/bank-login');
  }
};
</script>

<style scoped>
</style>