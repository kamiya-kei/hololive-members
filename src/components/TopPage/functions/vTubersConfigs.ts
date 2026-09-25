import { getFromStorage, setToStorage } from '@/functions/storages';
import { vTubers } from '../constants';

// 並び順
export const sortTypes = ['group', 'debut', 'debutDate', 'birthday', 'height', 'graduation'] as const;
export type TSortType = (typeof sortTypes)[number];
export const sortTypeTexts: Record<TSortType, string> = {
  group: 'グループ',
  debut: 'デビュー順',
  debutDate: 'デビュー日順',
  birthday: '誕生日順',
  height: '身長順',
  graduation: '卒業日順',
};

const SORT_TYPE_KEY = 'sortType';
export const loadSortTypeConfig = (): TSortType => {
  const config = getFromStorage(SORT_TYPE_KEY);
  return sortTypes.find((v) => v === config) ?? 'group';
};
export const updateSortTypeConfig = (sortType: TSortType) => setToStorage(SORT_TYPE_KEY, sortType);

// 所属
export const companies = ['hololive', 'individual', 'nijisanji', 'vspo', 'noripro', 'aogiri'] as const;
export type TCompany = (typeof companies)[number];
export const companyTexts: Record<TCompany, string> = {
  hololive: 'ホロライブ',
  individual: '個人勢',
  nijisanji: 'にじさんじ',
  noripro: 'のりプロ',
  vspo: 'ぶいすぽっ！',
  aogiri: 'あおぎり高校',
};

const COMPANY_KEY = 'displayCompanies';
export const loadCompanyConfig = (): TCompany[] => {
  const config = getFromStorage(COMPANY_KEY)?.split(',');
  return config ? companies.filter((v) => config.includes(v)) : [...companies];
};
export const updateCompanyConfig = (companies: readonly TCompany[]) => setToStorage(COMPANY_KEY, companies.join(','));

// ホロライブの期生・ユニット
// groupはカンマ区切りで複数所属を表す(白上フブキの「1期生,ゲーマーズ」)
export const toVTuberGroups = (group: string): string[] => group.split(',');

// 表示順(sort)が若いグループから並べる。メンバーを追加すれば新しい期生・ユニットも自動で増える
export const hololiveGroups: string[] = (() => {
  const minSorts = new Map<string, number>();
  vTubers
    .filter((v) => v.company === 'hololive')
    .forEach((v) =>
      toVTuberGroups(v.group).forEach((group) => minSorts.set(group, Math.min(minSorts.get(group) ?? v.sort, v.sort)))
    );
  return [...minSorts].sort(([, a], [, b]) => a - b).map(([group]) => group);
})();

const HOLOLIVE_GROUP_KEY = 'displayHololiveGroups';
export const loadHololiveGroupsConfig = (): string[] => {
  const config = getFromStorage(HOLOLIVE_GROUP_KEY)?.split(',');
  // 未保存のときは既存のホロライブのチェック状態に合わせる
  if (!config) return loadCompanyConfig().includes('hololive') ? [...hololiveGroups] : [];
  return hololiveGroups.filter((v) => config.includes(v));
};
export const updateHololiveGroupsConfig = (groups: readonly string[]) =>
  setToStorage(HOLOLIVE_GROUP_KEY, groups.join(','));

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
