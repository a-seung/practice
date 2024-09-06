<template>
  <!-- <button class="text-button" @click="logout">logout</button> -->
  <div class="page flex flex-col lg:flex-row lg:gap-4">
    <div class="flex flex-col lg:w-1/2 lg:gap-4">
      <!-- 프로필 영역 -->
      <div class="section-style lg:mb-0">
        <div class="flex items-center justify-between" v-if="user.userName !== 'NoLogin'">
          <h1 class="text-xl text-left">
            <span class="big-text">{{ user.userName }}</span> 님,<br />안녕하세요.
          </h1>

          <!-- 오른쪽 이미지+텍스트버튼 영역 -->
          <div class="flex items-center space-x-4">
            <button class="flex flex-col items-center hover:font-bold" @click="goSurvey">
              <div class="home-profile flex justify-center items-center">
                <img :src="`/images/${user.finTypeCode}.png`" />
              </div>
              <p class="text-sm mt-2 text-gray-500">
                {{ user.finTypeCode == '1' || user.finTypeCode == '2' || user.finTypeCode == '3' || user.finTypeCode == '4' ? '내 유형 보기' : '유형검사 하러 가기' }}
              </p>
            </button>
          </div>
        </div>

        <div v-else class=" items-stretch bg-gray-100">
          <div class="flex justify-between items-center">
            <div class="text-left text-base">
              <p class="py-4">안녕하세요.<br />우리는 <span class="big-text">beBig </span>입니다.<br />로그인하고 더 많은 기능을<br />이용해보시겠어요?</p>
            </div>
            <div class="w-32 h-32 bg-white rounded-full flex justify-center items-center">
              <img class="w-24" :src="`/images/friends-logo.png`" />
            </div>
          </div>
          <div class="">
            <button class="button mt-6" @click="goLogin">로그인 하러 가기</button>
          </div>
        </div>

        <!-- 모달이 활성화될 경우 표시 -->
        <div v-if="showModal" @click="closeModalOnOverlay">
          <SurveyResult @close-modal="closeModal" :isModal="true" />
        </div>
      </div>

      <!-- 총자산 컴포넌트 -->
      <div class="section-style flex-grow">
        <div class="flex items-center justify-between">
          <p class="section-title">총 자산</p>
        </div>

        <!-- 총 자산 금액 표시 -->
        <div class="flex items-center justify-between mt-1 pb-4 border-bottom">
          <p class="text-xl font-bold">{{ formatCurrency(totalAmount) }} 원</p>
          <!-- 자세히 보러 가기 버튼 -->
          <button v-if="accountList.length > 0" class="text-black px-2 flex items-center justify-center" @click="goToAccountDetails">
            <i class="fa-solid fa-chevron-right icon"></i>
          </button>
        </div>

        <!-- 계좌 목록 출력 -->
        <div class="account-list-bg">
          <div class="flex justify-center items-center">
            <button v-if="user.userName !== 'NoLogin' && accountList.length === 0" class="button !w-2/3 mt-4" @click="goAddBank">계좌 연결하기</button>
          </div>

          <div v-for="account in accountList" :key="accountList.accountNum" class="flex items-center justify-between account-list-inner rounded-lg hover-white"  @click="goBankDetail(account.accountNum)">
            <!-- 은행 아이콘 -->
            <img class="bank-icon" :src="`/public/images/bank/${account.bankName}.png`" alt="Bank Logo" />

            <!-- 계좌 잔액 -->
            <div class="flex-grow ml-2">
              <div class="text-sm text-gray-7--">
                <span class="text-base font-semibold">{{ formatCurrency(account.transactionBalance) }} 원</span>
                <p>{{ account.accountName }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 미션 컴포넌트 -->
    <div class="section-style lg:w-1/2 flex-grow">
      <div class="flex items-center justify-between border-bottom pb-3">
        <h1 class="section-title">나의 미션</h1>
        <!-- 미션 보러가기 버튼 -->
        <button v-if="monthlyMission && dailyMissions" class="hover:font-bold" @click="goToMission">미션 전체 보기</button>
      </div>

      <!-- 연결된 계좌가 없는 경우 -->
      <div v-if="user.userName != 'NoLogin'">
        <div v-if="!monthlyMission || !dailyMissions" class="flex items-center justify-center text-base mt-8 mb-6">
          <p>계좌를 연결해주세요.</p>
        </div>
        <div v-else-if="user.finTypeCode != '1' && user.finTypeCode != '2' && user.finTypeCode != '3' && user.finTypeCode != '4'" class="flex items-center justify-center text-base mt-8 mb-6">
          <p>유형검사를 실시해주세요.</p>
        </div>
      </div>



      <div v-if="monthlyMission && dailyMissions">
        <!-- 월간 미션 -->
        <div class="mb-4 px-2 py-2">
          <div class="flex items-center justify-between mt-2">
            <p class="font-semibold">월간 미션</p>
            <span class="text-sm font-semibold" :class="{ 'text-blue-500': monthlyMission.isRevoked, 'text-green-500': !monthlyMission.isRevoked }">
              {{ monthlyMission.isRevoked ? '미션 완료' : '미션 진행 중' }}
            </span>
          </div>
          <div class="mission-text " :class="{ 'line-through': monthlyMission.isRevoked }">
            {{ monthlyMission.missionTopic }}
          </div>
        </div>

        <!-- 일간 미션 -->
        <div class="mb-4 p-2">
          <div class="flex items-center justify-between mt-2">
            <p class="font-semibold">일간 미션</p>
            <span class="text-sm font-semibold" :class="{ 'text-blue-500': allDailyMissionsCompleted, 'text-green-500': !allDailyMissionsCompleted }">
              {{ allDailyMissionsCompleted ? '미션 완료!' : '미션 진행 중' }}
            </span>
          </div>
          <div class="mt-2">
            <div
              v-for="mission in dailyMissions"
              :key="mission.personalDailyMissionId"
              class="mission-text "
              :class="{ 'line-through': mission.personalDailyMissionCompleted }"
            >
              {{ mission.missionTopic || '설명이 없습니다.' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HomeApi from '@/api/HomeApi';
import MissionApi from '@/api/MissionApi';
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import SurveyResult from './SurveyResult.vue';
import { useHomeStore } from '@/stores/home';
import refreshToken from '@/api/refreshToken';

const homeStore = useHomeStore();

const goBankDetail = (accountNum)=>{
  router.push({
    path: '/home/account-detail',
    query: { accountNum: accountNum },
  });
}

const logout = async () => {
  try {
    const response = refreshToken.logouting();
  } catch (error) {
    // console.log(error);
  }
  router.push('/');
};

const user = reactive({
  userName: '',
  finTypeCode: '',
});

const accountList = reactive([]);

const totalAmount = ref('');

// 사용자 정보를 가져오는 함수
const getUser = async () => {
  try {
    const userInfo = await HomeApi.getMyInfo(); // /home/info 호출
    user.userName = userInfo.userName;
    user.finTypeCode = userInfo.finTypeCode; // 필요한 정보가 어떤건지 확인 필요
    homeStore.setuserFintype(user.finTypeCode);
  } catch (error) {
    // console.error("사용자 정보 가져오는 함수 API 호출 중 오류 발생:", error);
  }
};

const getAsset = async () => {
  try {
    const response = await HomeApi.accountList();
    // 모든 계좌의 transactionBalance 값을 합산
    let total = response.reduce((sum, account) => sum + account.transactionBalance, 0);
    totalAmount.value = total; // totalAmount에 총합을 저장
    // transactionBalance로 내림차순 정렬 후 상위 2개만 추출
    const sortedAccounts = response.sort((a, b) => b.transactionBalance - a.transactionBalance).slice(0, 2);
    sortedAccounts.forEach((account, index) => {
      accountList[index] = account;
      const newName = changeName(accountList[index].bankName);
      accountList[index].bankName = newName;
    });
  } catch (error) {
    // console.error("API 호출 중 오류 발생:", error);
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

const monthlyMission = ref('');

const dailyMissions = reactive([]);
const getMission = async () => {
  try {
    const response = await MissionApi.getDailyMission();
    for (let i = 0; i < 3; i++) {
      dailyMissions[i] = response[i];
    }
    const monthlyResponse = await MissionApi.getMonthMission();
    monthlyMission.value = monthlyResponse;
    monthlyMission.value.isRevoked = monthlyMission.value.personalMonthlyMissionCompleted === 1;
  } catch (error) {
    // console.error("API 호출 중 오류 발생:", error);
  }
};

const allDailyMissionsCompleted = computed(() => dailyMissions.every((mission) => mission.personalDailyMissionCompleted));

// 숫자를 0,000원 형식으로 포맷팅하는 함수
const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol',
  })
    .format(value)
    .replace('₩', '');
};

onMounted(() => {
  getUser();
  getAsset();
  getMission();
});

const router = useRouter();

const goAddBank = () => {
  router.push('/home/bank');
};

const goSurvey = () => {
  if (user.finTypeCode == '1' || user.finTypeCode == '2' || user.finTypeCode == '3' || user.finTypeCode == '4') {
    showModal.value = true;
  } else {
    router.push('/home/survey-start');
  }
};

// 모달 닫기 함수
const closeModal = () => {
  showModal.value = false;
};

// 모달 외부 클릭 시 닫기 함수
const closeModalOnOverlay = (e) => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
};

const goLogin = () => {
  router.push('/');
};

const goToMission = () => {
  router.push('/mission');
};

const goToAccountDetails = (account) => {
  // /home/account 경로로 이동
  router.push('/home/account');
};

// 모달 활성화 상태 변수
const showModal = ref(false);
</script>
