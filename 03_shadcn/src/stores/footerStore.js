import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFooterStore = defineStore('footer', () => {
  const footerKey = ref(0);

  const incrementFooterKey = () => {
    footerKey.value += 1;
  };

  return {
    footerKey,
    incrementFooterKey,
  };
});
