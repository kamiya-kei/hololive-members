import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { loadIsOpenLinkNewTabConfig, updateIsOpenLinkNewTabConfig } from '../functions/externalLinkConfigs';

export const useIsOpenLinkNewTabConfig = defineStore('isOpenLinkNewTabConfig', () => {
  const isOpenLinkNewTab = ref<boolean>(loadIsOpenLinkNewTabConfig());

  watch(isOpenLinkNewTab, (newIsOpenLinkNewTab) => {
    updateIsOpenLinkNewTabConfig(newIsOpenLinkNewTab);
  });

  return { isOpenLinkNewTab };
});
