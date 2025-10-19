import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useIsXSubAccount = defineStore('isXSubAccount', () => {
  const isXSubAccount = ref<boolean>(false);

  return { isXSubAccount };
});
