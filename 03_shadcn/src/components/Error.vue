//모든 에러가 에러페이지로 라우팅되도록
<template>
    <div class="page">
        <h1>Error</h1>
        <button class="back-button" @click="goBack">홈으로 돌아가기</button>
    </div>
</template>



<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
    router.push({ name: 'main' });
};
</script>




<style scoped></style>