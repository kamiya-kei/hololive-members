import { getFromStorage, setToStorage } from '@/functions/storages';
import { vTubers } from '../constants';

// 並び順
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

// 所属
export const companies = ['hololive', 'individual', 'noripro'] as const;
export type TCompany = (typeof companies)[number];
export const companyTexts: Record<TCompany, string> = {
  hololive: 'ホロライブ',
  individual: '個人勢',
  noripro: 'のりプロ',
};

const COMPANY_KEY = 'displayCompanies';
export const loadCompanyConfig = (): TCompany[] => {
  const config = getFromStorage(COMPANY_KEY)?.split(',') ?? [];
  return config ? companies.filter((v) => config.includes(v)) : [...companies];
};
export const updateCompanyConfig = (companies: readonly TCompany[]) => setToStorage(COMPANY_KEY, companies.join(','));

// 推し一覧
const FAVORITE_V_TUBER_KEYS_KEY = 'favoriteVTubersKeys';
export const loadFavoriteVTubersKeysConfig = (): string[] => {
  const config = getFromStorage(FAVORITE_V_TUBER_KEYS_KEY)?.split(',') ?? [];
  return vTubers.flatMap(({ key }) => (config.includes(key) ? key : []));
};
export const updateFavoriteVTubersKeysConfig = (favoriteVTubersKeys: readonly string[]) =>
  setToStorage(FAVORITE_V_TUBER_KEYS_KEY, favoriteVTubersKeys.join(','));

// 推しフィルター
const FAVORITE_V_TUBER_FILTER_KEY = 'isFilterFavoriteVTubers';
export const loadIsFilterFavoriteVTubersConfig = (): boolean => {
  const config = getFromStorage(FAVORITE_V_TUBER_FILTER_KEY);
  return config ? config === 'true' : false;
};
export const updateIsFilterFavoriteVTubersConfig = (isFilterFavoriteVTubers: boolean) =>
  setToStorage(FAVORITE_V_TUBER_FILTER_KEY, isFilterFavoriteVTubers ? 'true' : 'false');

// 推し強調
const FAVORITE_V_TUBER_HIGHLIGHT_KEY = 'isFavoriteVTuberHighlight';
export const loadIsFavoriteVTuberHighlightConfig = (): boolean => {
  const config = getFromStorage(FAVORITE_V_TUBER_HIGHLIGHT_KEY);
  return config ? config === 'true' : false;
};
export const updateIsFavoriteVTuberHighlightConfig = (isFavoriteVTuberHighlight: boolean) =>
  setToStorage(FAVORITE_V_TUBER_HIGHLIGHT_KEY, isFavoriteVTuberHighlight ? 'true' : 'false');
