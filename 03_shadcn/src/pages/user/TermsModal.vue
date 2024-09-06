<!-- TermsModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg w-full max-w-lg mx-8 p-6 md:mx-0">
      <h2 class="text-lg font-bold mb-4 text-center">개인정보 제공 및 약관 동의</h2>

      <!-- 전체 동의 -->
      <div class="flex items-center mb-4">
        <input type="checkbox" v-model="allAgree" @change="toggleAll" class="terms-checkbox" />
        <span class="text-sm font-semibold">전체 동의하기</span>
      </div>

      <!-- 개별 약관 -->
      <div class="divide-y divide-gray-200 max-h-64 overflow-y-auto">
        <div v-for="(term, index) in localTerms" :key="index" class="py-4">
          <div class="flex items-center ml-2">
            <input type="checkbox" v-model="term.agreed" class="terms-checkbox" />
            <span class="text-sm font-semibold">{{ term.utilTitle }}</span>
          </div>

          <!-- 스크롤 가능한 약관 내용 -->
          <div class="bg-gray-100 p-4 rounded-lg mt-4 mx-2 max-h-40 overflow-y-auto text-sm text-gray-600">
            <div v-html="formatContent(term.utilContent)"></div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-4">
        <button @click="closeModal" class="gray-button">취소</button>
        <button @click="confirmAgreement" class="button">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['isOpen', 'terms']);
const emit = defineEmits(['close', 'confirm']);

const allAgree = ref(false);
const localTerms = ref([]);
const allAgreed = ref(false); // 모든 약관이 동의되었는지 여부

// props로 전달된 terms 데이터를 localTerms에 복사
watch(
  () => props.terms,
  (newTerms) => {
    localTerms.value = newTerms.map((term) => ({
      ...term,
      showContent: false, // 내용 보기를 기본적으로 숨긴 상태
    }));
    localTerms.value = [...localTerms.value]; // 반응성 보장
  },
  { immediate: true }
);

// 모든 약관 동의 상태에 따른 전체 동의 상태 업데이트
watch(
  localTerms,
  (newTerms) => {
    allAgree.value = newTerms.every((term) => term.agreed);
    allAgreed.value = allAgree.value; // 모든 약관이 동의된 상태를 저장
  },
  { deep: true }
);

// 전체 동의 토글 함수
const toggleAll = () => {
  // 약관 모두 동의 상태 반영
  localTerms.value.forEach((term) => {
    term.agreed = allAgree.value;
  });
};

// 줄바꿈을 <br>로 변환하는 함수
const formatContent = (content) => {
  return content.replace(/\n/g, '<br>');
};

//모달 닫기
const closeModal = () => {
  emit('close');
};

//약관 동의 확인
const confirmAgreement = () => {
  if (!allAgreed.value) {
    alert('모든 약관에 동의해야 가입이 가능합니다.');
    return;
  }
  emit('confirm', localTerms.value);
};
</script>
