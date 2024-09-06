<template>
  <div class="page flex flex-col">
    <!-- 현재 달성도 -->
    <div class="section-style">
      <div class="section-title border-bottom pb-3">이번달 미션 달성도</div>
      <div class="mx-2">
        <div class="flex justify-between items-center mt-3 pb-10">
          <div class="font-semibold">
            현재 미션을 <span class="blue-bold"> {{ monthlyProgress }}</span> % 달성했어요!
          </div>
          <div class="remaining-days">D - {{ remainingDays }}</div>
        </div>

        <div class="progress-bar relative w-11/12 h-2 bg-gray-300 rounded-md mx-auto mt-10 lg:mt-20">
          <!-- 캐릭터 이미지 (진행된 만큼 왼쪽으로 배치) -->
          <img
            :src="runningImage"
            class="w-[50px] absolute duration-200 bottom-3 transform -translate-x-1/2 transition-all ease-linear z-10"
            :style="{ left: monthlyProgress + '%' }"
          />
          <!-- 진행 바 채움 -->
          <div class="progress-fill bg-[#5354ff] h-full rounded-md absolute top-0 left-0 transition-width duration-300" :style="{ width: monthlyProgress + '%' }"></div>

          <!-- 깃발은 오른쪽 끝에 고정 -->
          <img src="/images/flag.png" alt="깃발 이미지" class="flag-image absolute right-0 bottom-3 w-6 transform translate-x-7" />
        </div>
      </div>
    </div>

    <!-- 웹에서는 월간 미션과 일간 미션을 한 행에 배치 -->
    <div class="flex flex-col lg:flex-row lg:gap-4 lg:flex-grow">
      <!-- 월간 미션 -->
      <div class="section-style lg:w-1/2">
        <h1 class="section-title border-bottom pb-3">월간 미션</h1>
        <div class="mx-2 mt-3">
          <div class="flex justify-between items-center">
            <div class="text-sm font-semibold">{{ currentMonth }}</div>
            <div
              class="mission-status"
              :class="{
                'text-red-500': monthlyMission.personalMonthlyMissionCompleted === -1,
                'text-blue-500': monthlyMission.personalMonthlyMissionCompleted === 1,
                'text-green-500': monthlyMission.personalMonthlyMissionCompleted === 0,
              }"
            >
              {{ monthlyMission.personalMonthlyMissionCompleted === -1 ? '미션 실패' : monthlyMission.personalMonthlyMissionCompleted === 1 ? '미션 완료' : '미션 진행 중' }}
            </div>
          </div>

          <div class="mission-text">
            <span
              :class="{
                'line-through': monthlyMission.personalMonthlyMissionCompleted === 1,
              }"
            >
              {{ monthlyMission.missionTopic || '설명이 없습니다.' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 일간 미션 -->
      <div class="section-style lg:w-1/2">
        <h1 class="section-title border-bottom pb-3">일간 미션</h1>
        <div class="mx-2 mt-3">
          <div class="flex justify-between items-center">
            <span class="text-sm font-semibold">{{ todayDate }}</span>
            <div
              class="mission-status"
              :class="{
                'text-blue-500': allDailyMissionsCompleted,
                'text-green-500': !allDailyMissionsCompleted,
              }"
            >
              {{ allDailyMissionsCompleted ? '미션 완료!' : '미션 진행 중' }}
            </div>
          </div>
          <ul>
            <li v-for="mission in dailyMissions" :key="mission.personalDailyMissionId" class="flex justify-between mission-text">
              <div
                :class="{
                  'line-through': mission.personalDailyMissionCompleted,
                }"
              >
                {{ mission.missionTopic || '설명이 없습니다.' }}
              </div>
              <input type="checkbox" :checked="mission.personalDailyMissionCompleted" @change="completeMission(mission)" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MissionApi from '@/api/MissionApi';
import { ref, onMounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import HomeApi from '@/api/HomeApi'; //사용자 Fintype을 불러오기 위함

const router = useRouter();
const todayDate = computed(() => {
  const date = new Date();
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
});
const currentMonth = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
});
const isRunning = ref(false); // 캐릭터 애니메이션 상태

// 페이지 상태

const monthlyProgress = ref(''); // 월간 미션 진척률
const remainingDays = ref(''); // 남은 일수
const dailyMissions = reactive([]); //일간 미션 목록
const monthlyMission = ref(''); // 월간 미션 정보

//사용자 Fintype 불러오기
const getUser = async () => {
  try {
    const userInfo = await HomeApi.getMyInfo(); // /home/info 호출
    user.userName = userInfo.userName;
    user.finTypeCode = userInfo.finTypeCode; // 필요한 정보가 어떤건지 확인 필요
  } catch (error) {
    // console.error('사용자 정보 가져오는 함수 API 호출 중 오류 발생:', error);
  }
};

// 사용자 자산유형에 따른 캐릭터 이미지 설정
const user = reactive({
  userName: '',
  finTypeCode: '',
});

// 미션 진행률 계산 함수
const calculateMonthlyProgress = (missionData) => {
  const totalDays = missionData.totalDays || 30;
  const completedDays = missionData.completedDays || 0;
  return Math.floor((completedDays / totalDays) * 100);
};

//미션 성취도 받아오기
const setAchievement = async () => {
  try {
    const achievement = await MissionApi.getAchievement();
    monthlyProgress.value = Math.min(achievement.currentScore, 100);
    remainingDays.value = achievement.restDays;
  } catch (error) {
    // console.error("미션 성취도 불러오는중 에러 발생 :", error);
  }
};

//일간 미션 받아오기
const daillyMission = async () => {
  try {
    const response = await MissionApi.getDailyMission();
    //  console.log(response);
    for (let i = 0; i < 3; i++) {
      dailyMissions[i] = response[i];
    }
  } catch (error) {
    //console.error("daily mission 불러오는중 에러 발생:", error);
  }
};

//월간 미션 받아오기
const getMonthlyMission = async () => {
  try {
    monthlyMission.value = await MissionApi.getMonthMission();
    //  console.log(monthlyMission.value);
  } catch (error) {
    //  console.error("daily mission 불러오는중 에러 발생:", error);
  }
};

onMounted(() => {
  getUser();
  setAchievement();
  daillyMission();
  getMonthlyMission();
  startAnimation();
});

// 미션 완료 처리
const completeMission = async (mission) => {
  try {
    mission.personalDailyMissionCompleted = !mission.personalDailyMissionCompleted;
    const missionData = {
      personalMissionId: mission.personalDailyMissionId,
      missionType: mission.missionType,
    };
    await MissionApi.updateMission(missionData);

    // 일간 미션 체크 후 미션 진행바 갱신
    await setAchievement();
  } catch (error) {
    //  console.error("미션 업데이트 중 오류 발생", error);
  }
};

const allDailyMissionsCompleted = computed(() => {
  return dailyMissions.length > 0 && dailyMissions.every((mission) => mission.personalDailyMissionCompleted);
});

const startAnimation = () => {
  setInterval(() => {
    isRunning.value = !isRunning.value; // 상태를 반전시켜 이미지 변경
  }, 500); // 0.5초마다 상태 변경
};

const runningImage = computed(() => {
  const baseImage = `/images/${user.finTypeCode}-animated-${isRunning.value ? 2 : 1}.png`;
  return baseImage;
});
</script>
