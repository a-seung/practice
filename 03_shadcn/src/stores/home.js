import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useHomeStore = defineStore('home', () => {
    const userFintype = ref(null); // 로그인된 사용자의 fintype

    // 사용자의 Fintype 저장하는 함수
    const setuserFintype = (fintype) => {
        userFintype.value = fintype; // 선택된 은행 이름 저장
    };

    // 사용자 fintype을 가져오는 함수
    const getUserFintype = () => {
        return userFintype.value; // 현재 선택된 은행 이름 반환
    };

    return { userFintype, setuserFintype, getUserFintype};
});
