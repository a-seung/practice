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
        <span class="font-bold text-lg absolute left-1/2 transform -translate-x-1/2">회원가입</span>
      </header>

      <form @submit.prevent class="max-w-lg w-full px-6 mt-6">
        <!-- 이름 -->
        <div class="input-bg">
          <Label class="label" for="name">이름</Label>
          <Input id="name" type="text" v-model="User.name" placeholder="이름을 입력하세요" required />
        </div>
        <!-- 아이디 -->
        <div class="input-bg">
          <Label class="label" for="id">아이디</Label>
          <Input id="id" type="text" v-model="User.userLoginId" placeholder="ID를 입력하세요" @input="idDupCheckAPI" required />
          <p class="notification-text" v-if="idDupCheckResult && User.userLoginId">이미 사용 중인 아이디입니다.</p>
          <p class="notification-text" v-if="idDupCheckOk && User.userLoginId" style="color: blue">사용 가능한 아이디입니다.</p>
        </div>

        <!-- 비밀번호 -->
        <div class="input-bg">
          <Label class="label" for="password">비밀번호</Label>
          <Input class="input" id="password" type="password" v-model="User.password" placeholder="비밀번호를 입력하세요" required />
          <p class="notification-text" v-if="passwordError && User.password">비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.</p>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="input-bg">
          <Label class="label" for="password_check">비밀번호 확인</Label>
          <Input id="password_check" class="input" type="password" v-model="checkPassword" placeholder="비밀번호를 다시 한번 입력하세요" required />
          <p class="notification-text" v-if="pwdChecking && checkPassword">비밀번호가 일치하지 않습니다.</p>
        </div>

        <!-- 닉네임 -->
        <div class="input-bg">
          <Label class="label" for="nickname">닉네임</Label>
          <Input class="input" id="nickname" type="text" v-model="User.nickname" placeholder="닉네임을 입력해주세요" @input="nicknameDupCheckAPI" required />
          <p class="notification-text" v-if="nicknameDupCheckResult && User.nickname">이미 사용 중인 닉네임입니다.</p>
          <p class="notification-text" v-if="nicknameDupCheckOk && User.nickname" style="color: blue">사용 가능한 닉네임입니다.</p>
        </div>
        
        <!-- 이메일 -->
        <div class="input-bg">
          <Label class="label" for="email">이메일</Label>
          <Input class="input" id="email" type="text" v-model="User.email" placeholder="이메일을 입력해주세요" @input="validateEmail" @change="emailDupCheckAPI" required />
          <p class="notification-text" v-if="emailError && User.email">이메일 형식에 맞게 입력해주세요.</p>
          <p class="notification-text" v-else-if="emailDupCheckResult && !emailError">이미 사용 중인 이메일입니다.</p>
          <p class="notification-text" v-else-if="emailDupCheckOk && !emailError" style="color: blue">사용 가능한 이메일입니다.</p>
        </div>

        <!-- 성별 -->
        <div class="input-bg">
          <Label class="label" for="gender">성별</Label>
          <RadioGroup v-model="User.gender" class="flex">
            <div class="flex space-x-2">
              <RadioGroupItem class="h-4 w-4" value="true" id="male" />
              <Label for="male">남성</Label>
            </div>

            <div class="flex space-x-2 ml-3">
              <RadioGroupItem class="h-4 w-4" value="false" id="female" />
              <Label for="female">여성</Label>
            </div>
          </RadioGroup>
        </div>

        <!-- 생년월일 -->
        <div class="input-bg">
          <Label class="label" for="birth">생년월일</Label>
          <input class="input" v-model="User.birth" type="text" id="birth" placeholder="YYYY-MM-DD" @input="validateBirthInput" required />
          <p class="notification-text" v-if="birthError && User.birth">올바른 형식(YYYY-MM-DD)으로 입력해주세요.</p>
        </div>

        <!-- 가입하기 버튼 -->
        <Button @click="openTermsModal" type="submit" class="!mt-6" :disabled="!isFormValid">가입하기</Button>
      </form>

      <!-- 약관 동의 모달 -->
      <TermsModal v-if="isTermsModalOpen" :isOpen="isTermsModalOpen" :terms="terms" @close="closeTermsModal" @confirm="handleTermsConfirmation" />
    </div>
  </div>
</template>

<script setup>
import UserApi from '@/api/UserApi';
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TermsModal from './TermsModal.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


const router = useRouter();

const User = reactive({
  name: '',
  nickname: '',
  userLoginId: '',
  password: '',
  email: '',
  gender: '',
  birth: '',
  userLoginType: 'general',
});

const year = ref('');
const month = ref('');
const day = ref('');

//아이디 비번 닉네임 중복 체크 변수
const idDupCheckResult = ref(false);
const idDupCheckOk = ref(false);
const checkPassword = ref('');

// 이메일 중복 체크 변수
const emailDupCheckResult = ref(false);
const emailDupCheckOk = ref(false);

//닉네임 중복 체크 변수
const nicknameDupCheckResult = ref(false);
const nicknameDupCheckOk = ref(false);

// 에러 상태 저장
const emailError = ref(false);
const birthError = ref(false);
const passwordError = ref(false);

// 약관 데이터 배열
const terms = ref([]);
const isTermsModalOpen = ref(false);

// 약관 데이터를 불러오는 함수 (모든 약관의 동의 상태는 false로 초기화)
const getTerms = async () => {
  try {
    const response = await UserApi.getTerms();
    terms.value = response.map((term) => ({
      ...term,
      agreed: false,
    }));
  } catch (error) {
    //console.error("약관 데이터를 불러오는 중 오류 발생:", error);
  }
};

//비밀번호 체크
const pwdChecking = computed(() => {
  return User.password !== checkPassword.value && checkPassword.value.length > 0;
});

// 비밀번호 유효성 검사 함수(정규표현식 사용 / 영어 대소문자 구별함)
const validatePassword = () => {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(User.password);
};

//ID 중복체크
const idDupCheckAPI = async () => {
  try {
    const idDupCheck = await UserApi.idDuplicateCheck(User.userLoginId);
    idDupCheckOk.value = true;
    idDupCheckResult.value = false;
  } catch (error) {
    idDupCheckOk.value = false;
    idDupCheckResult.value = true;
  }
};

// email 중복 체크
const emailDupCheckAPI = async () => {
    try {
        const emailDupCheck = await UserApi.emailDuplicateCheck(User.email);
        emailDupCheckOk.value = true;
        emailDupCheckResult.value = false; 
    } catch (error) {
        emailDupCheckOk.value = false;
        emailDupCheckResult.value = true;
    }
}

// nickname 중복 체크
const nicknameDupCheckAPI = async () => {
    try {
        const nicknameDupCheck = await UserApi.nicknameDuplicateCheck(User.nickname);
        nicknameDupCheckOk.value = true;
        nicknameDupCheckResult.value = false; 
    } catch (error) {
        nicknameDupCheckOk.value = false;
        nicknameDupCheckResult.value = true;
    }
}

// 이메일 유효성 검사 함수
const validateEmail = async () => {
  // 이메일 형식 정규표현식
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 이메일이 유효하지 않으면 emailError를 true로 설정
  emailError.value = !emailPattern.test(User.email);

  // 이메일 형식이 맞으면 중복 검사 실행
  if (!emailError.value) {
    try {
      const emailDupCheck = await UserApi.emailDuplicateCheck(User.email);
      emailDupCheckOk.value = true;
      emailDupCheckResult.value = false;
    } catch (error) {
      emailDupCheckOk.value = false;
      emailDupCheckResult.value = true;
    }
  } else {
    // 이메일 형식이 맞지 않으면 중복 검사 결과 초기화
    emailDupCheckResult.value = false;
    emailDupCheckOk.value = false;
  }
};

// 가입 버튼을 누를 때 모달을 열기
const openTermsModal = () => {
  isTermsModalOpen.value = true;
};

// 모달 닫기
const closeTermsModal = () => {
  isTermsModalOpen.value = false;
};

// 약관 동의 확인 처리
const handleTermsConfirmation = (agreedTerms) => {
  // 약관 동의 처리
  isTermsModalOpen.value = false;
  // 약관에 동의했으면 회원가입 처리
  signup();
};

// 생년월일 입력 유효성 검사 함수
const validateBirthInput = () => {
  const rawInput = User.birth.replace(/-/g, '');

  if (!/^\d*$/.test(rawInput)) {
    alert('숫자만 입력 가능합니다.');
    User.birth = rawInput.replace(/\D/g, '');
  }

  if (rawInput.length > 8) {
    alert('생년월일은 8자리 숫자로 입력해주세요.');
    User.birth = rawInput.slice(0, 8);
  }

  if (rawInput.length === 8) {
    const year = rawInput.slice(0, 4);
    const month = rawInput.slice(4, 6);
    const day = rawInput.slice(6, 8);
    User.birth = `${year}-${month}-${day}`;
  }

  birthError.value = !isValidDateFormat(User.birth);
};

// 모든 함수를 최상단에 선언합니다.
const isValidDateFormat = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date && date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    User.name &&
    User.userLoginId &&
    User.password &&
    validatePassword() &&
    checkPassword.value &&
    User.nickname &&
    User.email &&
    User.gender !== '' &&
    User.birth &&
    !emailError.value &&
    !birthError.value &&
    !idDupCheckResult.value &&
    !pwdChecking.value &&
    !emailDupCheckResult.value &&
    !nicknameDupCheckResult.value
  );
});

// 생년월일 자동 업데이트
watch([year, month, day], () => {
  if (year.value && month.value && day.value) {
    User.birth = `${year.value}-${month.value}-${day.value}`;
  }
});

// 비밀번호 유효성 검사 및 에러 처리
watch(() => User.password, () => {
  passwordError.value = !validatePassword() && User.password.length > 0;
});



//회원가입
const signup = async () => {
  //console.log(User);
  try {
    const response = await UserApi.signup(User);
    //console.log("회원가입 성공: ", response);
    alert("회원가입 성공^^");
    router.push('/user');
  } catch (error) {
    // console.log("에러 =>", error);
  }
};

//뒤로가기
const goBack = () => {
  router.push({ name: 'user' });
};

onMounted(() => {
  getTerms();
});
</script>
