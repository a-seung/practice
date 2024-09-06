<template>
<Loading />
  <div id="app" :class="{ 'user-page': isUserPage }" class="flex flex-col relative">
    <Header v-if="!isUserPage" class="lg:hidden"/>
    <WebHeader v-if="!isUserPage" :key="footerStore.footerKey" class="hidden lg:flex w-full mx-auto" />
    <div :class="['flex-1', isUserPage ? 'mt-0' : 'mt-[50px] lg:mt-[50px] mb-2 overflow-y-auto']">
      <RouterView/>
    </div>
    <Footer v-if="!isUserPage" :key="footerStore.footerKey" class="lg:hidden"/>
  </div>
</template>

<script setup>
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
import WebHeader from "./components/WebHeader.vue";
import Loading from "./components/Loading.vue";

import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFooterStore } from '@/stores/footerStore';

const route = useRoute();
const footerStore = useFooterStore();
const isUserPage = ref(route.path.startsWith('/user'));


const updateBodyClass = (isUser) => {
  if (isUser) {
    document.body.classList.add('user-page');
  } else {
    document.body.classList.remove('user-page');
  }
};

onMounted(() => {
  updateBodyClass(isUserPage.value);
});

watch(isUserPage, (newValue) => {
  updateBodyClass(newValue);
});


watch(route, (newRoute) => {
  isUserPage.value = newRoute.path.startsWith('/user');
});

onUnmounted(() => {
  document.body.classList.remove('user-page');
});



</script>
