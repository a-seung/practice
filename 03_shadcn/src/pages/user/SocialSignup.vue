<template>
  <div class="lg:grid lg:grid-cols-3 lg:h-screen">
    <!-- 왼쪽 파란 배경 (웹에서만 적용) -->
    <div class="hidden lg:flex lg:bg-[#5354ff] lg:items-center lg:justify-center">
      <img src="/images/logo-white.png" class="w-[50%]" alt="Logo" />
    </div>

    <div class="flex flex-col justify-start items-center lg:col-span-2 mt-4">
      <header class="w-full flex justify-between items-center mb-6 px-2 relative lg:px-4">
        <button class="text-xl" @click="goBack">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <span class="font-bold text-base absolute left-1/2 transform -translate-x-1/2">소셜 회원가입</span>
      </header>

      <form @submit.prevent class="max-w-lg w-full px-6 mt-6">
        <!-- 이름 -->
        <div class="input-bg">
          <label class="label" for="name">이름</label>
          <input class="disabled-input" v-model="formData.name" type="text" id="name" disabled />
        </div>

        <!-- 이메일 -->
        <div class="input-bg">
          <label class="label" for="email">이메일</label>
          <input class="disabled-input" v-model="formData.email" type="email" id="email" disabled />
        </div>

        <!-- 생년월일 -->
        <div class="input-bg">
          <label class="label" for="birth">생년월일</label>
          <input class="input" v-model="formData.birth" type="text" id="birth" placeholder="YYYY-MM-DD" @input="validateBirthInput" />
          <p class="notification-text" v-if="birthError && formData.birth">올바른 형식(YYYY-MM-DD)으로 입력해주세요.</p>
        </div>

        <!-- 성별 -->
        <div class="input-bg">
          <label class="label" for="gender">성별</label>
          <div class="flex items-centerpx-3 py-2 mb-3">
            <label class="flex items-center space-x-2">
              <input class="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out" type="radio" v-model="formData.gender" :value="false" />
              <span>남성</span>
            </label>

            <label class="flex items-center space-x-2  ml-3">
              <input class="form-radio h-4 w-4 text-pink-600 transition duration-150 ease-in-out" type="radio" v-model="formData.gender" :value="true" />
              <span>여성</span>
            </label>
          </div>
        </div>

        <!-- 닉네임 -->
        <div class="input-bg">
          <label class="label" for="nickname">닉네임</label>
          <input class="input" v-model="formData.nickname" type="text" id="nickname" placeholder="닉네임을 입력하세요" @input="nicknameDupCheckAPI" required />
          <p class="notification-text" v-if="nicknameDupCheckResult && formData.nickname">이미 사용 중인 닉네임입니다.</p>
          <p class="notification-text" v-if="nicknameDupCheckOk && formData.nickname" style="color: blue">사용가능한 닉네임입니다.</p>
        </div>

        <!-- 가입하기 버튼 -->
          <button @click="openTermsModal" type="submit" class="button !mt-6" :disabled="!isFormValid">가입하기</button>
      </form>

      <!-- 약관 동의 모달 -->
      <TermsModal v-if="isTermsModalOpen" :isOpen="isTermsModalOpen" :terms="terms" @close="closeTermsModal" @confirm="handleTermsConfirmation" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import UserApi from '@/api/UserApi';
import { useRouter } from 'vue-router';
import TermsModal from './TermsModal.vue';

// 정규식을 이용한 생년월일 형식 검증
const isValidDateFormat = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) return false;

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}` === dateString;
};

const router = useRouter();

// formData를 ref로 선언
const formData = ref({
  name: '',
  email: '',
  gender: true, // 기본값을 남성으로 설정 (true)
  birth: '',
  nickname: '',
  userLoginType: 'kakao',
  userLoginId: '',
  password: 'kakao',
});

//닉네임 중복 체크 변수
const nicknameDupCheckResult = ref(false);
const nicknameDupCheckOk = ref(false);

// 에러 상태 저장
const birthError = ref(false);

// 생년월일 입력 유효성 검사 함수(input)
const validateBirthInput = () => {
  // '-' 제외한 순수 숫자만 처리
  const rawInput = formData.value.birth.replace(/-/g, '');

  // 숫자가 아닌 문자가 있으면 알림
  if (!/^\d*$/.test(rawInput)) {
    formData.value.birth = rawInput.replace(/\D/g, ''); // 숫자가 아닌 문자는 제거
    // alert 대신 화면에 오류 메시지를 표시
    alert('숫자만 입력 가능합니다.');
  }

  // 입력이 8자리를 초과하면 알림
  if (rawInput.length > 8) {
    alert('생년월일은 8자리 숫자로 입력해주세요.');
    formData.value.birth = rawInput.slice(0, 8); // 8자리까지만 유지
  }

  // 8자리가 입력되면 자동으로 'YYYY-MM-DD' 형식으로 변환
  if (rawInput.length === 8) {
    const year = rawInput.slice(0, 4);
    const month = rawInput.slice(4, 6);
    const day = rawInput.slice(6, 8);
    formData.value.birth = `${year}-${month}-${day}`;
  }

  birthError.value = !isValidDateFormat(formData.value.birth);
};

//폼 유효성 검사
const isFormValid = computed(() => {
  return (
    formData.value.name &&
    formData.value.email &&
    formData.value.nickname &&
    formData.value.birth &&
    !birthError.value &&
    !nicknameDupCheckResult.value
  );
});

// 약관 데이터 배열
const terms = ref([]);
const isTermsModalOpen = ref(false);

// 약관 데이터를 불러오는 함수 (모든 약관의 동의 상태는 false로 초기화)
const getTerms = async () => {
  const response = await UserApi.getTerms(); // API로부터 약관 데이터 불러옴
  terms.value = response.map((term) => ({
    ...term,
    agreed: false, // 모든 약관의 동의 상태를 false로 초기화
    showContent: false, // 약관 내용 표시 여부
  }));
};

// 소셜 로그인 후 localStorage에 저장된 데이터를 불러오는 함수
const loadSocialLoginData = () => {
  const userData = localStorage.getItem('socialUser');
  console.log(userData);
  if (userData) {
    const parsedData = JSON.parse(userData);
    formData.value.name = parsedData.name || '';
    formData.value.email = parsedData.email || '';
    formData.value.gender = parsedData.gender === 'M' ? true : false;
    formData.value.birth = parsedData.birth || '';
    formData.value.userLoginId = parsedData.userLoginId || '';
  }
};

//모달 열기
const openTermsModal = () => {
  isTermsModalOpen.value = true;
};

//모달 닫기
const closeTermsModal = () => {
  isTermsModalOpen.value = false;
};

const handleTermsConfirmation = async (confirmedTerms) => {
  terms.value = confirmedTerms;
  isTermsModalOpen.value = false;

  // 모든 필수 약관에 동의했는지 확인
  const allTermsAgreed = terms.value.every((term) => term.agreed);

  if (allTermsAgreed) {
    await submitSignup();
  } else {
    alert('모든 약관에 동의해야 회원가입이 가능합니다.');
  }
};

// nickname 중복 체크
const nicknameDupCheckAPI = async () => {
    try {
        const nicknameDupCheck = await UserApi.nicknameDuplicateCheck(formData.value.nickname);
        nicknameDupCheckOk.value = true;
        nicknameDupCheckResult.value = false; 
    } catch (error) {
        nicknameDupCheckOk.value = false;
        nicknameDupCheckResult.value = true;
    }
}


// 폼 제출 함수
const submitSignup = async () => {
  try {
    const response = await fetch('http://localhost:8080/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    });

    // 서버 응답 상태 확인
    if (!response.ok) {
      throw new Error('서버 응답 오류: ' + response.status);
    }

    // 회원가입 성공 시 http://localhost:5173/user로 이동
    alert('가입이 완료되었습니다!');
    router.push('/user');
  } catch (error) {
    console.error('가입 중 오류 발생:', error);
    alert('가입 중 오류가 발생했습니다.');
  }
};

// 페이지가 로드되면 소셜 로그인 정보와 약관 데이터 불러오기
onMounted(() => {
  loadSocialLoginData();
  getTerms();
});

// 뒤로가기 함수
const goBack = () => {
  window.history.back();
};
</script>
