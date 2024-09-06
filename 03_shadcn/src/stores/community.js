import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCommunityStore = defineStore('community', () => {
    const currentPage = ref(1); 

    const setCurrentPage = (page) => {
        currentPage.value = page;
    };

    const getCurrentPage = () => {
        return currentPage.value; 
    };

    return { currentPage, setCurrentPage, getCurrentPage};
});
