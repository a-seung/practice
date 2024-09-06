<template>
  <div class="modal-background" @click="closeModalOnOverlay">
    <div class="modal-inner" @click.stop>
      <p class="text-lg text-center font-bold">{{ finTypeTitle }}</p>

      <div class="flex flex-col items-center justify-center mt-4">
        <img :src="`/images/${finTypeCode}.png`" alt="finType 이미지" class="w-[100px] h-auto" />
        <p class="text-lg text-center mt-2 font-semibold">{{ finTypeSubtitle }}</p>
      </div>

      <div class="mt-4 text-[14px]">
        <div>
          <p class="text-justify">
            <span class="text-[#5354ff] font-semibold">{{ userName }}</span> 님은 {{ finTypeTitleDescription }}
          </p>
        </div>
        <div>
          <p class="text-justify mt-2">{{ finTypeAnimalDescription }}</p>
        </div>
        <ul class="list-none text-justify mt-4">
          <li :key="advice">{{ finTypeHabit1 }}</li>
          <li :key="advice">{{ finTypeHabit2 }}</li>
        </ul>
      </div>
      <div class="flex flex-col justify-center">
        <button class="button mt-5" @click="handleButtonClick">{{ buttonText }}</button>
        <button @click="goSurvey" class="text-button">유형검사 다시하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import HomeApi from '@/api/HomeApi';
const router = useRouter();

const finTypeTitle = ref('');
const finTypeSubtitle = ref('');
const finTypeCode = ref('');
const finTypeAnimalDescription = ref('');
const finTypeHabit1 = ref('');
const finTypeHabit2 = ref('');
const finTypeTitleDescription = ref('');
const userName = ref('');

const getSurveyResult = async () => {
  try {
    const surveyResults = await HomeApi.surveyResult();
    // console.log(surveyResults);
    finTypeTitle.value = surveyResults.finTypeAnimal;
    finTypeSubtitle.value = surveyResults.finTypeTitle;
    finTypeCode.value = surveyResults.finTypeCode;
    finTypeAnimalDescription.value = surveyResults.finTypeAnimalDescription;
    finTypeHabit1.value = surveyResults.finTypeHabit1;
    finTypeHabit2.value = surveyResults.finTypeHabit2;
    finTypeTitleDescription.value = surveyResults.finTypeTitleDescription;
  } catch (error) {
    //  console.error("API 호출 중 오류 발생:", error);
  }
};

const getUser = async () => {
  try {
    const response = await HomeApi.getMyInfo();
    userName.value = response.userName;
    //  console.log(userName.value);
  } catch (error) {
    //  console.error("API 호출 중 오류 발생:", error);
  }
};

// 페이지가 마운트될 때 finType에 맞는 데이터를 설정
onMounted(() => {
  getSurveyResult();
  getUser();
});

const props = defineProps({
  isModal: {
    type: Boolean,
    default: false,
  },
});

const buttonText = computed(() => (props.isModal ? '닫기' : '홈으로 돌아가기'));

// 버튼 클릭 처리 함수
const handleButtonClick = () => {
  if (props.isModal) {
    emit('close-modal');
  } else {
    router.push({ name: 'main' });
  }
};

// 모달 외부 클릭 시 모달 닫기 함수
const closeModalOnOverlay = (e) => {
  if (e.target === e.currentTarget) {
    emit('close-modal'); // 부모 컴포넌트로 이벤트 전달
  }
};

const goSurvey = () => {
  router.push('/home/survey-start');
};

// emit 정의
const emit = defineEmits(['close-modal']);
</script>
