<template>
  <div class="page">
    <header class="w-full flex justify-between items-center mb-6 px-2 relative">
      <button class="text-lg" @click="handleBackClick">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <p
        class="font-bold text-base absolute left-1/2 transform -translate-x-1/2"
      >
        계좌 연결하기
      </p>
    </header>

    <div class="section-style lg:mx-20 lg:pt-4">
      <p class="text-base font-bold text-center mt-2">
        {{ selectedBank }} 계좌 연결
      </p>
      <div class="mt-8 mx-6">
        <div>
          <p class="label">아이디</p>
          <input
            type="text"
            v-model="bankAccount.userBankId"
            placeholder="은행 아이디를 입력하세요."
            class="input"
          />
        </div>
        <div>
          <p class="label">비밀번호</p>
          <input
            type="password"
            v-model="bankAccount.bankPassword"
            placeholder="은행 비밀번호를 입력하세요."
            class="input"
          />
          <p v-if="checkCount" class="text-red-500 pl-2">
            아이디/비밀번호 입력 제한 횟수가 {{ count }}번 남았습니다.
          </p>
        </div>
        <button @click="Connect" class="button !mt-6">계좌 연결하기</button>
      </div>
    </div>

    <!-- 요청이 진행 중일 때 로딩 이미지 추가 -->
    <div v-if="askFlag" class="flex justify-center items-center mt-6">
      <img src="/images/bank/loading.gif" alt="Loading..." class="w-12 h-12" />
      <h1 class="blue-bold lg:big-text ml-2">{{ loadingMessage }}</h1>
    </div>

    <!-- 계좌 목록을 보여주는 섹션 -->
    <div v-if="accountList.length != 0" class="mt-8 mx-12 lg:mx-20 space-y-4">
      <div>
        <p class="font-semibold lg:text-lg text-center">
          아래 계좌를 성공적으로 연결했습니다.
        </p>
      </div>
      <div class="">
        <div
          v-for="account in accountList"
          :key="account.resAccount"
          :class="[
            'flex items-center',
            index !== accountList.length - 1
              ? 'border-b border-gray-300 pb-4'
              : '',
          ]"
          class="space-y-4 mt-4"
        >
          <div class="flex items-center">
            <img
              :src="`/images/bank/${changeNameToEnglish(
                account.bankVo.bankName
              )}.png`"
              alt="Bank Logo"
              class="bank-icon"
            />
            <div class="ml-4">
              <p class="font-bold text-base">{{ account.bankVo.bankName }}</p>
              <p class="text-sm">{{ account.resAccount }}</p>
              <p class="text-sm">{{ account.resAccountName }}</p>
              <p class="text-sm">
                잔액 :
                {{ Number(account.resAccountBalance).toLocaleString() }} 원
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-4">
        <button @click="goHome" class="button">홈으로 이동</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBankStore } from '@/stores/bank'; // Pinia 스토어 가져오기
import HomeApi from '@/api/HomeApi';
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFooterStore } from '@/stores/footerStore';
const router = useRouter();
const footerStore = useFooterStore();

const bankStore = useBankStore(); // Pinia 스토어 사용

const bankAccount = reactive({
  bank: '',
  userBankId: '',
  bankPassword: '',
});
const count = ref(3); // 남은 횟수
const checkCount = ref(false);

// Pinia에서 선택된 은행 이름을 가져옴
const selectedBank = computed(() => bankStore.selectedBank);
bankAccount.bank = bankStore.getSelectedBankNum();

const changeNameToEnglish = (bankName) => {
  const bankNames = {
    국민은행: 'KB',
    신한은행: 'Shinhan',
    기업은행: 'IBK',
    우리은행: 'Woori',
    농협은행: 'NH',
    하나은행: 'Hana',
    카카오뱅크: 'KakaoBank',
    K뱅크: 'KBank',
    우체국: 'PostOfficeBank',
    신협: 'Shinhyup',
    새마을금고: 'SaemaulGeumgo',
    경남은행: 'Gyeongnam',
    광주은행: 'Gwangju',
    부산은행: 'Busan',
    제주은행: 'Jeju',
    전북은행: 'Jeonbuk',
    씨티은행: 'Citi',
    SC: 'SC',
    산업은행: 'IndustrialBank',
    수협은행: 'Suhyup',
  };

  return bankNames[bankName] || bankName; // 매칭되는 영어 이름 반환, 없으면 원래 이름 반환
};

// // 예시 계좌 목록
const accountList = reactive([]);

const askFlag = ref(false);
const loadingMessage = ref(selectedBank.value+' 서버와 연결하는 중...');
const messages = [
  '계좌를 확인하는 중...',
  '거래 내역을 요청하는 중...',
  '나만의 자산 분석 진행 중...',
  '화면을 불러오는 중입니다...',
];
let messageInterval;

// "계좌 연결하기" 버튼 클릭 시 호출될 함수
const Connect = async () => {
  try {
    askFlag.value = true;

    // 3초마다 메시지를 변경하는 함수 실행
    let messageIndex = 0;
    messageInterval = setInterval(() => {
      if (messageIndex < 3) {
        loadingMessage.value = messages[messageIndex];
        messageIndex++;
      } else {
        clearInterval(messageInterval); // messageIndex가 3일 때 멈춤
      }
    }, 3000);

    const response = await HomeApi.getAccountList(bankAccount);

    for (let i = 0; i < response.length; i++) {
      accountList[i] = response[i];
    }
    checkCount.value = false;
    askFlag.value = false;

    // 로딩이 끝났으니 메시지 변경 멈추기
    clearInterval(messageInterval);
  } catch (error) {
    askFlag.value = false;

    // 로딩이 끝났으니 메시지 변경 멈추기
    clearInterval(messageInterval);

    ///console.error('API 호출 중 오류 발생:', error);
   // console.log(error.response.data);

    if (
      error.response.data == '아이디/비밀번호를 확인하세요.' ||
      error.response.data ==
        '비밀번호 자릿수 오류입니다. 확인 후 거래하시기 바랍니다.' ||
      error.response.data ==
        '아이디 또는 비밀번호 오류입니다. 확인 후 거래하시기 바랍니다.' ||
      error.response.data ==
        '아이디 오류입니다. 확인 후 거래하시기 바랍니다.' ||
      error.response.data ==
        '아이디 자릿수 오류입니다. 확인 후 거래하시기 바랍니다.' ||
      error.response.data == '비밀번호 오류입니다. 확인 후 거래하시기 바랍니다.'
    ) {
      if (count.value == 1) {
        alert(
          '은행 홈페이지에 방문하여 아이디/비밀번호를 확인하시기 바랍니다.'
        );
        router.push('/home');
      } else {
        alert(error.response.data);
        checkCount.value = true;
        count.value = count.value - 1;
      }
    } else {
      alert(error.response.data);
      router.push('/home/bank');
    }
  }
};

// "홈으로 이동" 버튼 클릭 시 호출될 함수
const goHome = () => {
  footerStore.incrementFooterKey();
  router.push('/home');
};

// 뒤로가기 버튼 클릭 시 실행되는 함수
const handleBackClick = () => {
  router.push('/home/bank');
};
</script>
