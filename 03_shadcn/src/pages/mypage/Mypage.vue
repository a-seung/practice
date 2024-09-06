<template>
  <div class="page flex flex-col justify-start min-h-screen items-center">
    <!-- 프로필 영역 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-screen-lg items-stretch"
    :class="{ 'lg:grid-cols-1': !isPublic && !isOwner }">
      <section class="section-style flex flex-col justify-between h-full"
       >
        <div v-if="isOwner" class="flex items-center justify-between w-full">
          <!-- 공개/비공개 버튼 (본인일 경우에만 표시) -->
          <div class="flex items-center bg-gray-300 rounded-full">
            <button
              @click="setPublic(true)"
              :class="{
                'bg-primary text-white': isPublic,
                'text-black': !isPublic,
              }"
              class="w-14 h-8 rounded-full transition-all duration-300 relative z-10 text-xs"
            >
              공개
            </button>
            <button
              @click="setPublic(false)"
              :class="{
                'bg-primary text-white': !isPublic,
                'text-black': isPublic,
              }"
              class="w-14 h-8 rounded-full transition-all duration-300 relative z-10 -ml-2 text-xs"
            >
              비공개
            </button>
          </div>

          <button class="text-xl cursor-pointer ml-4" @click="goSettings">
            <i class="fa-solid fa-gear"></i>
          </button>
        </div>
        <div class="flex items-start mt-2">
          <div class="flex items-center">
            <div>
              <div class="home-profile m-2 flex justify-center items-center">
                <img :src="profileImage" alt="Profile Image" @click="openSurveyModal" />
              </div>
            </div>
            <div class="ml-4">
              <div class="flex items-center">
                <div class="text-lg font-bold mr-1">{{ userNickname }} 님</div>

                <!-- badgeCode가 0이 아닐 때만 배지 이미지가 버튼으로 표시됨 -->
                <button v-if="badgeCode !== 0" @click="openBadgeModal">
                  <img :src="badgeImage" alt="Badge" class="w-6 h-6" />
                </button>
              </div>

              <div class="mt-2">
                <p>
                  이번달 미션 달성도 상위
                  <span class="blue-bold">{{ userRank }}</span> %
                </p>
                <p class="mt-1">
                  {{ finTypeCode === '0' ? '유형 검사를 진행해 주세요' : finTypeInfo }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 한줄 소개는 항상 표시 -->
        <div class="py-2 px-4">
          <p class="font-bold">한줄소개</p>
          <p class="pt-1">{{ userIntro ? userIntro : '한 줄 소개를 입력해 주세요.' }}</p>
        </div>
      </section>

        <!-- 비공개 상태이면서 다른 사용자가 볼 때 -->
        <div v-if="!isPublic && !isOwner" class="flex flex-col items-center justify-center mt-16">
        <i class="fa-solid fa-user-lock text-6xl text-gray mb-4"></i>
        <p class="text-gray-600 text-sm">이 사용자의 프로필은 비공개 상태입니다.</p>
      </div>

      <!-- 공개 상태이거나 본인일 경우 모든 정보 표시 -->
      <div v-if="isPublic || isOwner">
        <!-- 월간 미션 진행상황 -->

        <section class="section-style flex flex-col h-full">
          <!-- 계좌가 연결되지 않은 경우 -->
          <div v-if="accountList.length === 0" class="flex flex-col items-center justify-center">
            <div class="text-left w-full border-bottom mb-2 font-semibold text-base pb-3">이번달 미션 달성도</div>
            <div class="text-center mt-8 text-base">계좌연결 후 미션을 받아보세요</div>
          </div>
          <!-- 계좌가 연결된 경우 -->
          <div v-else>
            <div class="mission-info flex flex-col mb-5">
              <div class="section-title border-bottom pb-3">이번달 미션 달성도</div>
              <div class="mt-3 mx-2 flex justify-between items-center pb-10">
                <div class="font-semibold">
                  현재 미션을 <span class="blue-bold">{{ monthlyProgress }}</span> % 달성했어요
                </div>
                <div class="remaining-days">D - {{ remainingDays }}</div>
              </div>
            </div>

            <!-- 진행 바 -->
            <div class="progress-bar relative w-11/12 h-2 bg-gray-300 rounded-md mx-auto mt-10 lg:mt-20">
              <!-- 캐릭터 이미지 (진행된 만큼 왼쪽으로 배치) -->
              <img
                :src="runningImage"
                class="w-[50px] absolute duration-200 bottom-3 transform -translate-x-1/2 transition-all ease-linear"
                :style="{
                  left: monthlyProgress + '%',
                }"
              />

              <!-- 진행 바 채움 -->
              <div
                class="progress-fill bg-[#5354ff] h-full rounded-md absolute top-0 left-0 transition-width duration-300"
                :style="{
                  width: monthlyProgress + '%',
                }"
              ></div>

              <!-- 깃발은 오른쪽 끝에 고정 -->
              <img
                src="/images/flag.png"
                alt="깃발 이미지"
                class="flag-image absolute right-0 bottom-3 w-6 transform translate-x-7"
              />
            </div>
          </div>
        </section>
      </div>

    

      <!-- 내가 작성한 글 & 좋아요한 글 -->
      <div v-if="isPublic || isOwner" class="flex flex-col w-full max-w-screen-lg lg:col-span-2">
        <section class="section-style">
          <div class="flex border-b-2 border-gray-300">
            <button
              @click="selectTab('myPosts')"
              :class="selectedTab === 'myPosts' ? 'border-b-4 border-black font-bold' : 'text-gray-500'"
              class="w-1/2 pb-2 text-center"
            >
              작성한 글
            </button>
            <button
              @click="selectTab('likedPosts')"
              :class="selectedTab === 'likedPosts' ? 'border-b-4 border-black font-bold' : 'text-gray-500'"
              class="w-1/2 pb-2 text-center"
            >
              좋아하는 글
            </button>
          </div>

          <!-- 작성한 글 리스트 -->
          <ul v-if="selectedTab === 'myPosts'" class="mt-4">
            <li
              v-for="(post, index) in myPosts"
              :key="index"
              class="flex justify-between items-center px-2 py-2 border-b border-gray-200 hover:bg-gray-200 transition-colors duration-300 text-sm lg:text-base"
              @click="goToPostDetail(post.postId)"
            >
              <div class="w-1/2 truncate">
                {{ post.title }}
              </div>
              <div class="w-1/6 text-gray-500 whitespace-nowrap">
                {{ formatDate(post.postTime) }}
              </div>
              <div class="w-1/6 flex items-center text-red-500 justify-end">
                ♥
                <div class="pl-1">
                  {{ post.postLikeHits }}
                </div>
              </div>
            </li>
          </ul>

          <!-- 좋아요한 글 리스트 -->
          <ul v-if="selectedTab === 'likedPosts'" class="mt-4">
            <li
              v-for="(post, index) in myLikePosts"
              :key="index"
              class="flex justify-between items-center px-3 py-2 border-b border-gray-200 hover:bg-gray-200 transition-colors duration-300 text-sm lg:text-base"
              @click="goToPostDetail(post.postId)"
            >
              <div class="w-1/2 truncate">
                {{ post.title }}
              </div>
              <div class="w-1/6 text-gray-500 whitespace-nowrap">
                {{ formatDate(post.postTime) }}
              </div>
              <div class="w-1/6 flex items-center text-red-500 justify-end">
                ♥
                <div class="pl-1">
                  {{ post.postLikeHits }}
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <!-- 모달이 활성화될 때 표시 -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click="closeModalOnOverlay"
    >
      <div class="bg-white rounded-lg w-100 mx-10 px-6 py-10 relative" @click.stop>
        <button @click="closeModal" class="absolute top-4 right-4 text-xl">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <img :src="badgeImage" alt="Badge Image" class="mx-auto w-32 h-32 m-4" />
        <p class="text-center text-lg font-semibold mb-4">
          {{ badgeName }}
        </p>

        <h2 class="font-semibold text-center mb-2">메달의 기준이 궁금하신가요?</h2>
        <!-- badgeCode가 0이 아닌 배지 목록만 표시 -->
        <div
          v-for="badge in filteredBadgeList"
          :key="badge.badgeCode"
          class="flex items-center border-t px-4 pt-4 mt-4 space-x-6"
        >
          <div class="text-xs lg:text-sm font-semibold">
            {{ badge.badgeTitle }}
          </div>
          <div>
            <img :src="`/images/badge/badge${badge.badgeCode}.png`" alt="Badge Image" class="w-8 h-8" />
          </div>
          <div class="text-xs lg:text-sm" style="white-space: pre-line">
            {{ badge.badgeDescription }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="showSurveyModal" @click="closeModalOnOverlay">
      <SurveyResult @close-modal="closeSurveyModal" :isModal="true" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // useRouter 가져오기
import MypageApi from '@/api/MypageApi';
import MissionApi from '@/api/MissionApi';
import HomeApi from '@/api/HomeApi'; // 계좌 목록 가져오기 위해 추가
import SurveyResult from '../home/SurveyResult.vue';

// 라우터와 라우트 사용
const router = useRouter();
const route = useRoute();

// 반응형 변수 선언
const isOwner = ref(false); // 본인 여부 확인
const isPublic = ref(true); // 공개 여부 확인
const userNickname = ref('');
const finTypeCode = ref('');
const badgeCode = ref('');
const userRank = ref('');
const finTypeInfo = ref('');
const userIntro = ref('');
const badgeName = ref('');
const loginType = ref('');
const myPosts = ref([]);
const myLikePosts = ref([]);
const selectedTab = ref('myPosts');
const showModal = ref(false); // 모달 표시 여부
const showSurveyModal = ref(false); // Survey 모달
const badgeList = ref([]); // 뱃지 정보 배열
const isRunning = ref(false); // 캐릭터 애니메이션 상태
const accountList = ref([]); // 계좌 리스트

//유형검사 다시하기
const goSurvey = () => {
  router.push('/home/survey-start');
};

// URL에서 userId를 가져오기
const userId = ref(route.params.userId);

// 월간 미션 관련 반응형 변수 추가
const monthlyProgress = ref(''); // 월간 미션 진척률
const remainingDays = ref(''); // 남은 일수

// badgeCode가 0이 아닌 항목만 필터링하여 반환
const filteredBadgeList = computed(() => {
  return badgeList.value.filter((badge) => badge.badgeCode !== 0);
});

// 뱃지 이미지 동적 경로 설정
const badgeImage = computed(() => {
  return `/images/badge/badge${badgeCode.value}.png`; // badgeCode 값에 따라 배지 이미지 설정
});

// 프로필 사진 동적 경로 설정
const profileImage = computed(() => {
  return `/images/${finTypeCode.value}.png`; // 이미지 파일명은 finTypeCode 값과 일치
});

const startAnimation = () => {
  setInterval(() => {
    isRunning.value = !isRunning.value; // 상태를 반전시켜 이미지 변경
  }, 500); // 0.5초마다 상태 변경
};

const runningImage = computed(() => {
  const baseImage = `/images/${finTypeCode.value}-animated-${isRunning.value ? 2 : 1}.png`;
  //console.log('Running image path:', baseImage); // 로그로 경로 확인
  return baseImage;
});

// SurveyResult 모달 열기 함수
const openSurveyModal = () => {
    // finTypeCode가 0인 경우 모달이 뜨지 않도록 조건 추가
    if (finTypeCode.value !== '0') {
    showSurveyModal.value = true; // 모달을 엶
  } else {
    console.log("핀타입 코드가 0이므로 모달이 뜨지 않습니다.");
  }
};

// SurveyResult 모달 닫기 함수
const closeSurveyModal = () => {
  showSurveyModal.value = false;
};

// 모달 열기 함수
const openBadgeModal = () => {
  showModal.value = true;
};

// 모달 닫기 함수
const closeModal = () => {
  showModal.value = false;
};

// 모달 외부 클릭 시 닫기 함수
const closeModalOnOverlay = (e) => {
  if (e.target === e.currentTarget) {
    closeModal();
    closeSurveyModal();
  }
};

// API에서 사용자 정보를 가져오는 함수
const getLoggedInUserInfo = async () => {
  try {
    //console.log('내 정보 API 호출 시작');
    const userInfo = await MypageApi.getMypage(); // 사용자의 정보를 가져오는 API 호출
    //  console.log('내 정보 API 호출 성공, 사용자 정보:', userInfo);

    userNickname.value = userInfo.userNickname; //이름
    finTypeCode.value = userInfo.finTypeCode; // 핀타입 코드
    badgeCode.value = Number(userInfo.badgeCode); // badgeCode를 숫자로 변환하여 할당
    userRank.value = userInfo.userRank; //
    finTypeInfo.value = userInfo.finTypeInfo; // 유형
    userIntro.value = userInfo.userIntro; // 한줄소개
    isPublic.value = userInfo.userVisibility === 1;

    // 로그인한 사용자와 페이지 소유자가 같은지 확인
    const loggedInUserId = await MypageApi.getLoggedInUserId();
    isOwner.value = loggedInUserId === userInfo.userId;
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
  }
};

// 특정 userId에 따른 사용자 정보를 불러오는 함수
const getUserInfoByUserId = async () => {
  try {
    // console.log('API 호출 시작');
    const userInfo = await MypageApi.getUserProfile(userId.value); // 특정 userId의 정보를 가져오는 API 호출
    // console.log('API 호출 성공, 사용자 정보:', userInfo);

    userNickname.value = userInfo.userNickname;
    finTypeCode.value = userInfo.finTypeCode;
    badgeCode.value = Number(userInfo.badgeCode);
    userRank.value = userInfo.userRank;
    finTypeInfo.value = userInfo.finTypeInfo;
    userIntro.value = userInfo.userIntro;
    isPublic.value = userInfo.userVisibility === 1;

    // 로그인한 사용자와 페이지 소유자가 같은지 확인
    const loggedInUserId = await MypageApi.getLoggedInUserId();
    isOwner.value = loggedInUserId === userId.value;
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
  }
};

// 뱃지 정보 가져오는 함수
const getBadgeDetails = async () => {
  try {
    // console.log('뱃지 정보 가져오는 API 호출 시작');
    const badgeInfo = await MypageApi.getBadgeInfo(); // 뱃지 정보를 가져오는 API 호출
    //  console.log('뱃지 정보 API 호출 성공, 사용자 정보:', badgeInfo);

    badgeList.value = badgeInfo;

    // console.log('현재 badgeCode:', Number(badgeCode.value));

    // badgeCode에 해당하는 배지 이름 설정
    const foundBadge = badgeList.value.find((badge) => badge.badgeCode === Number(badgeCode.value));

    if (foundBadge) {
      badgeName.value = foundBadge.badgeTitle;
      // console.log('badgeName 설정됨: ', badgeName.value);
    } else {
      badgeName.value = '배지를 찾을 수 없습니다.';
      //  console.log('해당 badgeCode에 맞는 배지를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('뱃지 정보 가져오기 실패:', error);
  }
};

// 로그인타입 가져오는 함수
const getMyLoginType = async () => {
  try {
    // console.log('로그인 타입 API 호출 시작');
    const userLoginType = await MypageApi.getMyLoginType(); // 사용자의 정보를 가져오는 API 호출
    // console.log('로그인 타입 API 호출 성공 :', userLoginType);

    loginType.value = userLoginType;
  } catch (error) {
    // console.error('사용자 정보 가져오기 실패:', error);
  }
};

const setPublic = async (publicStatus) => {
  try {
    isPublic.value = publicStatus;

    // 서버에 공개/비공개 상태 업데이트 요청
    await MypageApi.updateVisibility(publicStatus ? 1 : 0);

    //  console.log('사용자 공개/비공개 상태 업데이트 성공', publicStatus);
  } catch (error) {
    //  console.error('사용자 공개/비공개 상태 업데이트 실패:', error);
  }
};

// 월간 미션 성취도 받아오는 함수
const setAchievement = async () => {
  try {
    const achievement = await MissionApi.getAchievement();
    monthlyProgress.value = achievement.currentScore;
    remainingDays.value = achievement.restDays;
  } catch (error) {
    console.error('미션 성취도 불러오는 중 에러 발생 :', error);
  }
};

// 특정 userId에 따른 미션 성취도를 불러오는 함수
const setAchievementByUserId = async () => {
  try {
    const achievement = await MissionApi.getAchievementByUser(userId.value);
    monthlyProgress.value = achievement.currentScore;
    remainingDays.value = achievement.restDays;
  } catch (error) {
    console.error('미션 성취도 불러오는 중 에러 발생 :', error);
  }
};

// 계좌 목록 가져오는 함수 추가
const fetchAccountList = async () => {
  try {
    const response = await HomeApi.accountList();
    accountList.value = response; // 계좌 목록을 반응형 변수에 저장
  } catch (error) {
    console.error('계좌 목록 가져오기 실패:', error);
  }
};

// 정보 수정 페이지 이동 함수
const goSettings = () => {
  // loginType에 따라 다른 페이지로 이동
  if (loginType.value === 'kakao') {
    router.push({ name: 'mypageSocialEdit' });
  } else {
    router.push({ name: 'mypageEdit' });
  }
};

// 작성한 글 가져오는 함수
const getUserPosts = async () => {
  try {
    const userPosts = await MypageApi.getMyPosts(); // 사용자의 정보를 가져오는 API 호출
    // console.log('작성한 글 가져오기 API 호출 성공 :', myPosts);

    // 작성 시간 기준으로 내림차순 정렬하여 최신 글이 먼저 나오게 처리
    myPosts.value = userPosts.sort((a, b) => b.postTime - a.postTime);
  } catch (error) {
    console.error('작성한 글 가져오기 실패:', error);
  }
};

//특정 userId에 따른 작성한 글 가져오는 함수
const getUserPostsByUserId = async () => {
  try {
    const userPosts = await MypageApi.getMyPostsUserId(userId.value); // 사용자의 정보를 가져오는 API 호출
    console.log('작성한 글 가져오기 API 호출 성공 :', myPosts);

    // 작성 시간 기준으로 내림차순 정렬하여 최신 글이 먼저 나오게 처리
    myPosts.value = userPosts.sort((a, b) => b.postTime - a.postTime);
  } catch (error) {
    console.error('작성한 글 가져오기 실패:', error);
  }
};

// 좋아요한 글 가져오는 함수
const getUserLikePosts = async () => {
  try {
    const userLikePosts = await MypageApi.getMyLikePosts(); // 사용자의 정보를 가져오는 API 호출
    // console.log('좋아요한 글 가져오기 API 호출 성공 :', userLikePosts);

    // 작성 시간 기준으로 내림차순 정렬하여 최신 글이 먼저 나오게 처리
    myLikePosts.value = userLikePosts.sort(
      (a, b) => b.postTime - a.postTime // 날짜 최신순
    );
  } catch (error) {
    console.error('좋아요한 글 가져오기 실패:', error);
  }
};

//특정 userId에 따른 좋아요한 글 가져오는 함수
const getUserLikePostsByUserId = async () => {
  try {
    const userLikePosts = await MypageApi.getMyLikePostsUserId(userId.value); // 사용자의 정보를 가져오는 API 호출
    // console.log('좋아요한 글 가져오기 API 호출 성공 :', userLikePosts);

    // 작성 시간 기준으로 내림차순 정렬하여 최신 글이 먼저 나오게 처리
    myLikePosts.value = userLikePosts.sort(
      (a, b) => b.postTime - a.postTime // 날짜 최신순
    );
  } catch (error) {
    console.error('좋아요한 글 가져오기 실패:', error);
  }
};

// 게시글 상세 페이지로 이동하는 함수
const goToPostDetail = (postId) => {
  router.push({
    name: 'communityDetail',
    params: { postId },
  });
};

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월을 2자리로 맞춤
  const day = String(date.getDate()).padStart(2, '0'); // 일을 2자리로 맞춤
  return `${year}.${month}.${day}`;
};

// 페이지가 로드될 때 사용자 정보 가져오기
onMounted(async () => {
  const loggedInUserId = await MypageApi.getLoggedInUserId(); // 로그인한 사용자 ID를 먼저 가져옴
  // 페이지의 userId가 로그인한 사용자와 같다면 내 정보를 불러옴
  if (!userId.value || userId.value === loggedInUserId) {
    await getLoggedInUserInfo();
    await getUserPosts();
    await getUserLikePosts();
    await setAchievement();
    isOwner.value = true; // 내 정보일 경우 isOwner를 true로 설정
  } else {
    await getUserInfoByUserId(); // 다르면 해당 userId에 맞는 사용자 정보를 불러옴
    await setAchievementByUserId();
    await getUserPostsByUserId();
    await getUserLikePostsByUserId();
    isOwner.value = false;
  }
  getMyLoginType();
  getBadgeDetails();
  startAnimation();
  await fetchAccountList(); // 계좌 목록 가져오기 호출
});

// 탭 선택 함수
const selectTab = (tabName) => {
  selectedTab.value = tabName;
};
</script>

<style></style>
