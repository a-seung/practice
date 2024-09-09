<template>
  <div class="lg:grid lg:grid-cols-3 lg:h-screen">
    <!-- 왼쪽 파란 배경 (웹에서만 적용) -->
    <div class="hidden lg:flex lg:bg-[#5354ff] lg:items-center lg:justify-center">
      <img src="/images/logo-white.png" class="w-[50%]" alt="Logo" />
    </div>

    <div class="flex flex-col justify-start items-center lg:col-span-2 mt-4">
      <header class="w-full flex justify-between items-center mb-6 px-6 lg:px-4 relative">
        <button class="text-xl" @click="goBack">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <span class="font-bold text-base absolute left-1/2 transform -translate-x-1/2">비밀번호 찾기</span>
      </header>

      <div class=" max-w-lg w-full px-6">
        <form @submit.prevent="findPassword" class=" py-10">
          <!-- 이름 -->
          <div class="input_name">
            <Label for="name">이름</Label>
            <Input class="input" v-model="name" type="text" id="name" autocomplete="name" required />
          </div>
          <!-- 아이디 -->
          <div class="input_id">
            <Label for="userLoginId">아이디</Label>
            <Input class="input" v-model="userLoginId" type="text" id="userLoginId" autocomplete="username" required />
          </div>
          <!-- 이메일 -->
          <div class="input_email">
            <Label for="email">이메일</Label>
            <Input class="input" v-model="email" type="email" id="email" autocomplete="email" @input="validateEmail" required />
            <p class="notification-text" v-if="emailError && email">이메일 형식이 올바르지 않습니다.</p>
          </div>

          <Button class="!mt-6" type="submit">비밀번호 찾기</Button>
        </form>

        <!-- 결과 표시 -->
        <div v-if="message" class="result text-center text-base mt-10">
          <p>입력하신 이메일로 <br />임시 비밀번호가 전송되었어요!</p>
        </div>
        <div v-else-if="errorMessage" class="result_error text-center text-base mt-10">
          <p>{{ errorMessage }}</p>
        </div>
        <div v-else-if="flag == true" class="result text-center text-base mt-10">
          <p>이메일 보내는중...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UserApi from '@/api/UserApi'; // 실제 API 모듈 경로 확인
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const router = useRouter();

const name = ref(''); // 사용자 이름
const userLoginId = ref(''); // 사용자 아이디
const email = ref(''); // 사용자 이메일
const message = ref(null); // 성공 메시지
const errorMessage = ref(null); // 오류 메시지
const flag = ref(false);
const emailError = ref(false); // 이메일 유효성 오류 여부

// 이메일 유효성 검사 함수
const validateEmail = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 정규표현식
  emailError.value = !emailPattern.test(email.value); // 이메일 형식이 유효하지 않으면 오류 발생
};

const findPassword = async () => {
  // 이메일 형식이 유효하지 않으면 요청 중단
  if (emailError.value) {
    return;
  }

  try {
    flag.value = true;
    const response = await UserApi.findUserPwd({
      name: name.value,
      userLoginId: userLoginId.value,
      email: email.value,
    });

    name.value = '';
    userLoginId.value = '';
    email.value = '';

    message.value = '임시 비밀번호를 입력하신 이메일로 보냈어요!';
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    if (error.response && error.response.status === 404) {
      errorMessage.value = '해당 정보로 등록된 계정을 찾을 수 없습니다.';
    } else {
      errorMessage.value = '서버와 통신 중 오류가 발생했습니다.';
    }
    message.value = null;
  }
};

// 뒤로가기 함수
const goBack = () => {
  router.push({ name: 'user' });
};
</script>
