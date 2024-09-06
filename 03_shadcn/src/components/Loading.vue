<template>
  <Transition name="fade">
    <div v-if="showLoading" class="loading-container">
      <img src="/images/friends-logo.png" class="logo" />
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showLoading = ref(false);

onMounted(() => {
  // 세션 스토리지를 사용하여 현재 세션에서 이미 로딩을 표시했는지 확인
  if (!sessionStorage.getItem('loadingShown')) {
    showLoading.value = true;
    sessionStorage.setItem('loadingShown', 'true');

    // 로컬 스토리지를 사용하여 최초 방문 여부 확인
    if (!localStorage.getItem('hasVisited')) {
      localStorage.setItem('hasVisited', 'true');
    }

    // 1초 동안 로딩 화면을 표시한 후 페이드아웃 시작
    setTimeout(() => {
      showLoading.value = false;
    }, 1000);
  }
});
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  z-index: 1000;
}

.logo {
  width: 300px;
  height: auto;
}


.fade-leave-active {
  transition: opacity 2s ease; /* 페이드아웃 시간을 2초로 늘림 */
}


.fade-leave-to {
  opacity: 0;
}
</style>