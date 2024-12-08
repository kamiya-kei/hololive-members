import { getFromStorage, setToStorage } from '@/functions/storages';

// 外部リンクの設定
const IS_OPEN_LINK_NEW_TAB_KEY = 'isOpenLinkNewTab';
export const loadIsOpenLinkNewTabConfig = (): boolean => {
  const config = getFromStorage(IS_OPEN_LINK_NEW_TAB_KEY);
  return config ? config === 'true' : true;
};
export const updateIsOpenLinkNewTabConfig = (isOpenLinkNewTab: boolean) =>
  setToStorage(IS_OPEN_LINK_NEW_TAB_KEY, isOpenLinkNewTab ? 'true' : 'false');
