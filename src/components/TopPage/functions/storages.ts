const getFromStorage = (key: string) => localStorage.getItem(key);
const setToStorage = (key: string, value: string) => localStorage.setItem(key, value);

export const sortTypes = ['group', 'debut', 'debutDate', 'birthday', 'height'] as const;
export type TSortType = (typeof sortTypes)[number];
export const sortTypeTexts: Record<TSortType, string> = {
  group: 'グループ',
  debut: 'デビュー順',
  debutDate: 'デビュー日順',
  birthday: '誕生日順',
  height: '身長順',
};

const SORT_TYPE_KEY = 'sortType';
export const loadSortTypeConfig = (): TSortType => {
  const config = getFromStorage(SORT_TYPE_KEY);
  return sortTypes.find((v) => v === config) ?? 'group';
};
export const updateSortTypeConfig = (sortType: TSortType) => setToStorage(SORT_TYPE_KEY, sortType);

export const companies = ['hololive', 'individual', 'noripro'] as const;
export type TCompany = (typeof companies)[number];
export const companyTexts: Record<TCompany, string> = {
  hololive: 'ホロライブ',
  individual: '個人勢',
  noripro: 'のりプロ',
};

const COMPANY_KEY = 'displayCompanies';
export const loadCompanyConfig = (): readonly TCompany[] => {
  const config = getFromStorage(COMPANY_KEY)?.split(',') ?? [];
  return config ? companies.filter((v) => config.includes(v)) : companies;
};
export const updateCompanyConfig = (companies: TCompany[]) => setToStorage(COMPANY_KEY, companies.join(','));

const IS_OPEN_LINK_NEW_TAB_KEY = 'isOpenLinkNewTab';
export const loadIsOpenLinkNewTabConfig = (): boolean => {
  const config = localStorage.getItem(IS_OPEN_LINK_NEW_TAB_KEY);
  return config ? config === 'true' : true;
};
export const updateIsOpenLinkNewTabConfig = (isOpenLinkNewTab: boolean) =>
  localStorage.setItem(IS_OPEN_LINK_NEW_TAB_KEY, isOpenLinkNewTab ? 'true' : 'false');
