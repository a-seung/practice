<template>
  <div class="page">
    <header class="w-full flex justify-between items-center mb-6 px-2 relative">
      <button class="text-lg" @click="goBack">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <span class="font-bold text-base absolute left-1/2 transform -translate-x-1/2">내 계좌</span>
    </header>

    <div class="section-style lg:mx-20">
      <div class="">
        <div class="flex items-center justify-between">
          <p class="section-title">총 자산</p>
        </div>

        <div class="flex items-center justify-between mt-1 pb-2 border-bottom">
          <p class="text-xl font-bold">{{ totalAmount.toLocaleString() }}원</p>
          <button v-if="NoLoginFlag" @click="goAddBank" class="p-2 flex items-center justify-center">
            <i class="fa-solid fa-plus text-xl"></i>
          </button>
        </div>
      </div>

      <!-- 계좌 목록 출력 -->
      <div class="account-list-bg">
        <div
          v-for="(account, index) in accountList"
          :key="index"
          class="flex items-center justify-between rounded-lg account-list-inner hover-white"
          @click="goBankDetail(account.accountNum)"
        >
          <img :src="`/images/bank/${account.bankName}.png`" alt="Bank Logo" class="bank-icon" />
          <div class="flex-grow ml-4">
            <span class="text-xs lg:text-sm">{{ account.accountName }}</span>
            <span class="text-xs lg:text-sm ml-2"> {{ account.accountNum }}</span>
            <p class="text-base lg:text-lg font-semibold">{{ account.transactionBalance.toLocaleString() }} 원</p>
          </div>
          <div class="mr-2"><i class="fa-solid fa-chevron-right text-base"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HomeApi from '@/api/HomeApi';
const router = useRouter();

const totalAmount = ref(''); // 총 자산 예시
const accountList = reactive([]);
const NoLoginFlag = ref(true);
const getList = async () => {
  try {
    const response = await HomeApi.accountList();
    for (let i = 0; i < response.length; i++) {
      accountList[i] = response[i];
      const newName = changeName(accountList[i].bankName);
      accountList[i].bankName = newName;
    }
    if (accountList[0].accountNum == 11013154513) {
      NoLoginFlag.value = false;
    }
    // 총 자산 계산
    const total = accountList.reduce((acc, account) => acc + account.transactionBalance, 0);
    totalAmount.value = total;
  } catch (error) {
    //      console.error('API 호출 중 오류 발생:', error);
  }
};
const changeName = (name) => {
  if (name == '경남은행') {
    return 'Gyeongnam';
  } else if (name == '광주은행') {
    return 'Gwangju';
  } else if (name == '부산은행') {
    return 'Busan';
  } else if (name == '산업은행') {
    return 'IndustrialBank';
  } else if (name == '새마을금고은행') {
    return 'SaemaulGeumgo';
  } else if (name == '수협은행') {
    return 'Suhyup';
  } else if (name == '신한은행') {
    return 'Shinhan';
  } else if (name == '신협은행') {
    return 'Shinhyup';
  } else if (name == '씨티은행') {
    return 'Citi';
  } else if (name == '우리은행') {
    return 'Woori';
  } else if (name == '우체국은행') {
    return 'PostOfficeBank';
  } else if (name == '전북은행') {
    return 'Jeonbuk';
  } else if (name == '제주은행') {
    return 'Jeju';
  } else if (name == '카카오뱅크') {
    return 'KakaoBank';
  } else if (name == '하나은행') {
    return 'Hana';
  } else if (name == '기업은행') {
    return 'IBK';
  } else if (name == 'IM') {
    return 'IM';
  } else if (name == 'K뱅크') {
    return 'KBank';
  } else if (name == '국민은행') {
    return 'KB';
  } else if (name == '농협은행') {
    return 'NH';
  }
};

const goAddBank = () => {
  router.push('/home/bank');
};

const goBack = () => {
  router.push('/home');
};

const goBankDetail = (accountNum) => {
  router.push({
    path: '/home/account-detail',
    query: { accountNum: accountNum }, // 계좌 이름을 쿼리 파라미터로 전달
  });
};

onMounted(() => {
  getList();
});
</script>

<style scoped></style>
