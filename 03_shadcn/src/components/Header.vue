<template>
    <header class="top-0 left-0 z-50 fixed w-full bg-white h-[60px] shadow-md">
        <div class=" mx-auto px-4 py-4">
            <img src="/images/logo.png" alt="Logo" @click="goHome" class="w-24 h-auto max-w-full ml-2" />
        </div>
    </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goHome = () => {
    router.push({ name: 'main' })
}

</script>

<style scoped>
/* 헤더 높이를 고정 */
header {
  height: 60px; /* 헤더의 고정된 높이 */
}
</style>