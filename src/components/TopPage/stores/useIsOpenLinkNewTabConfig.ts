import { loadIsOpenLinkNewTabConfig, updateIsOpenLinkNewTabConfig } from '@/components/TopPage/functions/storages';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useIsOpenLinkNewTabConfig = defineStore('isOpenLinkNewTabConfig', () => {
  const isOpenLinkNewTab = ref<boolean>(loadIsOpenLinkNewTabConfig());

  watch(isOpenLinkNewTab, (newIsOpenLinkNewTab) => {
    updateIsOpenLinkNewTabConfig(newIsOpenLinkNewTab);
  });

  return { isOpenLinkNewTab };
});
