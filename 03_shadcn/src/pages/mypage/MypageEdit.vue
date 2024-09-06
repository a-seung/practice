<template>
  <div class="page flex flex-col">
    <!-- 상단 바 -->
    <header class="flex justify-between items-center mb-3">
      <button class="text-xl" @click="goBack">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <h2 class="font-bold text-base absolute left-1/2 transform -translate-x-1/2">내 정보 수정</h2>
      <button class="text-button text-sm" @click="logout">
        로그아웃
      </button>
    </header>

    <div class="flex justify-center mt-2">
    <!-- 입력 폼 -->
    <form @submit.prevent="handleSubmit" class="max-w-lg w-full px-6">
      <div class="input_group">
        <label class="label">한줄 소개</label>
        <input type="text" v-model="intro" class="input" />
      </div>

      <div class="input_group">
        <label class="label">닉네임</label>
        <input type="text" v-model="nickname" class="input" />
      </div>

      <div class="input_group">
        <label class="label">이름</label>
        <input type="text" v-model="name" class="input" disabled />
      </div>

      <div class="input_group">
        <label class="label">아이디</label>
        <input type="text" v-model="loginId" class="input" disabled />
      </div>

      <div>
        <label class="label">기존 비밀번호</label>
        <div class="flex">
          <input type="password" v-model="currentPassword" class="input" />
          <button
            type="button"
            @click="checkCurrentPassword"
            class="button !w-1/5 ml-2 mt-1 !mb-3 border-primary rounded-lg bg-primary text-white"
          >
            확인
          </button>
        </div>
      </div>

      <div class="input_group">
        <label class="label">새 비밀번호</label>
        <input type="password" v-model="newPassword" class="input" :disabled="!isPasswordConfirmed" />
      </div>

      <div class="input_group">
        <label class="label">새 비밀번호 확인</label>
        <input type="password" v-model="confirmNewPassword" class="input" :disabled="!isPasswordConfirmed" />
      </div>

      <div class="input_group">
        <label class="label">이메일</label>
        <input type="email" v-model="email" class="input" disabled />
      </div>

      <div class="input_group">
        <label class="label">성별</label>
        <input type="text" v-model="gender" class="input" disabled />
      </div>

      <div class="input_group">
        <label class="label">생년월일</label>
        <input type="text" v-model="birth" class="input" disabled />
      </div>

      <button type="submit" class="button !mt-6">수정하기</button>
    </form>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import MypageApi from '@/api/MypageApi';
import refreshToken from "@/api/refreshToken";

// 데이터 저장 변수
const intro = ref('');
const nickname = ref('');
const name = ref('');
const loginId = ref('');
const currentPassword = ref(''); // 기존 비밀번호 필드 추가
const newPassword = ref('');
const confirmNewPassword = ref('');
const email = ref('');
const gender = ref('');
const birth = ref('');

// 새 비밀번호 입력창 활성화 상태 관리 변수 (처음엔 false로 비활성화)
const isPasswordConfirmed = ref(false);

const router = useRouter(); // router 사용을 위한 선언
const userStore = useUserStore(); // userStore 사용을 위한 선언

// 이전 페이지(Mypage.vue)로 이동하는 함수
const goBack = () => {
  router.push({ name: 'mypage' }); // mypage로 이동
};

// 로그아웃 함수 추가
const logout = async () => {
  // 확인 창 표시
  if (confirm('정말 로그아웃 하시겠습니까?')) {
    try {
      const response = await refreshToken.logouting();
      // 로그아웃 성공 시 알림 창 표시
      alert('다음에 또 만나요!');
      router.push("/");
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  }
};

// 기존 정보 불러오는 함수
const getUserExistingInfo = async () => {
  try {
   // console.log('회원 기존정보 불러오는 API 호출 시작');
    const userExistingInfo = await MypageApi.getMyExistingInfo(); // 사용자의 정보를 가져오는 API 호출
  //  console.log('회원 기존정보 불러오는 API 호출 성공:', userExistingInfo);

    // 받아온 데이터를 변수에 저장
    intro.value = userExistingInfo.userIntro;
    nickname.value = userExistingInfo.userNickname;
    name.value = userExistingInfo.userName;
    loginId.value = userExistingInfo.userLoginId;
    email.value = userExistingInfo.userEmail;
    gender.value = userExistingInfo.userGender === 1 ? '여성' : '남성'; // 성별은 숫자로 올 가능성이 있으니 변환
    birth.value = userExistingInfo.userBirth2; // 포맷된 생일
  } catch (error) {
    console.error('회원 기존정보 가져오기 실패:', error);
  }
};

// 비밀번호 확인 함수
const checkCurrentPassword = async () => {
  try {
    const result = await MypageApi.checkPassword(currentPassword.value); // 비밀번호 확인 API 호출
   // console.log('API 응답 결과:', result); // 응답 데이터 구조 확인

    if (result === 'password match') {
      alert('비밀번호가 일치합니다.');
      isPasswordConfirmed.value = true; // 비밀번호 일치 시 새 비밀번호 입력창 활성화
    } else if (result === 'password does not match') {
      alert('기존 비밀번호와 일치하지 않습니다.');
      isPasswordConfirmed.value = false; // 비밀번호 불일치 시 새 비밀번호 입력창 비활성화
    }
  } catch (error) {
    console.error('비밀번호 확인 중 오류 발생:', error);
    alert('기존 비밀번호와 일치하지 않습니다.(오류)');
    isPasswordConfirmed.value = false; // 오류 발생 시 비활성화
  }
};

// 수정한 정보 백엔드로 전송하는 함수
const handleSubmit = async () => {
  // 비밀번호 변경을 원할 경우
  if (currentPassword.value || newPassword.value || confirmNewPassword.value) {
    // 비밀번호 관련 필드 중 하나라도 입력되었으면 나머지도 모두 입력되어야 함
    if (!currentPassword.value || !newPassword.value || !confirmNewPassword.value) {
      alert('기존 비밀번호, 새 비밀번호, 새 비밀번호 확인 필드를 모두 입력해 주세요.');
      return; // 제출 중단
    }

    // 새 비밀번호와 새 비밀번호 확인이 일치하는지 확인
    if (newPassword.value !== confirmNewPassword.value) {
      alert('새 비밀번호가 일치하지 않습니다.');
      // 비밀번호와 비밀번호 확인 필드 초기화
      newPassword.value = '';
      confirmNewPassword.value = '';
      return; // 제출 중단
    }

    // 기존 비밀번호 확인이 아직 이루어지지 않은 경우 경고 메시지 출력
    if (!isPasswordConfirmed.value) {
      alert('기존 비밀번호를 확인해 주세요.');
      return; // 제출 중단
    }
  }

  // 수정된 정보 전송
  try {
    const userData = {
      user_intro: intro.value,
      user_nickname: nickname.value,
      user_login_type: 'general', // 일반 로그인으로 설정
    };

    // 비밀번호 변경을 원할 경우에만 비밀번호 전송
    if (currentPassword.value && newPassword.value && confirmNewPassword.value) {
      userData.user_password = newPassword.value; // 새 비밀번호가 있는 경우에만 전송
    }

    const response = await MypageApi.edit(userData); // 백엔드로 정보 전송
   // console.log('프로필 수정 완료:', response);

    alert('프로필이 성공적으로 수정되었습니다.');
    router.push({ name: 'mypage' }); // 성공 후 mypage로 이동
  } catch (error) {
    console.error('프로필 수정 실패:', error);
    alert('프로필 수정에 실패했습니다.');
  }
};

onMounted(() => {
  getUserExistingInfo();
});
</script>
<style></style>
