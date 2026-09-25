<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import {
  loadSortTypeConfig,
  TSortType,
  updateSortTypeConfig,
  sortTypes,
  sortTypeTexts,
  loadCompanyConfig,
  updateCompanyConfig,
  companyTexts,
  companies,
  loadFavoriteVTubersKeysConfig,
  updateFavoriteVTubersKeysConfig,
  updateIsFilterFavoriteVTubersConfig,
  loadIsFilterFavoriteVTubersConfig,
  TCompany,
  loadIsFavoriteVTuberHighlightConfig,
  updateIsFavoriteVTuberHighlightConfig,
  hololiveGroups,
  loadHololiveGroupsConfig,
  updateHololiveGroupsConfig,
  toVTuberGroups,
} from './functions/vTubersConfigs';
import { VTuberData, buildVTubers } from './functions/buildVTubers';
import VTuberCircle from './VTuberCircle.vue';

const vTubers = ref<VTuberData[]>([]);
onMounted(async () => {
  vTubers.value = buildVTubers(sortType.value);
});

const sortType = ref<TSortType>(loadSortTypeConfig());
watch(sortType, (newSortType) => {
  vTubers.value = buildVTubers(newSortType);
  updateSortTypeConfig(newSortType);
});

const displayCompanies = ref<TCompany[]>(loadCompanyConfig());
watch(displayCompanies, (newDisplayCompanies) => {
  updateCompanyConfig(newDisplayCompanies);
});

const displayHololiveGroups = ref<string[]>(loadHololiveGroupsConfig());
watch(displayHololiveGroups, (newDisplayHololiveGroups) => {
  updateHololiveGroupsConfig(newDisplayHololiveGroups);
});

// ホロライブのチェックは期生・ユニットの一括ON/OFFを兼ねる
const handleChangeCompany = (company: TCompany, isChecked: boolean) => {
  const newDisplayCompanies = isChecked
    ? [...displayCompanies.value, company]
    : displayCompanies.value.filter((v) => v !== company);
  displayCompanies.value = companies.filter((v) => newDisplayCompanies.includes(v));
  if (company === 'hololive') displayHololiveGroups.value = isChecked ? [...hololiveGroups] : [];
};

// 期生・ユニットが全部チェックされているときだけホロライブにチェックを付ける
const handleChangeHololiveGroup = (group: string, isChecked: boolean) => {
  const newGroups = isChecked
    ? [...displayHololiveGroups.value, group]
    : displayHololiveGroups.value.filter((v) => v !== group);
  displayHololiveGroups.value = hololiveGroups.filter((v) => newGroups.includes(v));
  const isAllChecked = displayHololiveGroups.value.length === hololiveGroups.length;
  if (isAllChecked === displayCompanies.value.includes('hololive')) return;
  displayCompanies.value = isAllChecked
    ? companies.filter((v) => [...displayCompanies.value, 'hololive'].includes(v))
    : displayCompanies.value.filter((v) => v !== 'hololive');
};

const isFilterFavoriteVTubers = ref<boolean>(loadIsFilterFavoriteVTubersConfig());
watch(isFilterFavoriteVTubers, (newIsFilterFavoriteVTubers) => {
  updateIsFilterFavoriteVTubersConfig(newIsFilterFavoriteVTubers);
});
const isFavoriteVTuberHighlight = ref<boolean>(loadIsFavoriteVTuberHighlightConfig());
watch(isFavoriteVTuberHighlight, (newIsFavoriteVTuberHighlight) => {
  updateIsFavoriteVTuberHighlightConfig(newIsFavoriteVTuberHighlight);
});
const isFavoriteVTuberEditMode = ref<boolean>(false);

const favoriteVTuberKeys = ref<string[]>(loadFavoriteVTubersKeysConfig());
const handleClickVTuber = (vTuber: VTuberData, newIsFavorite: boolean) => {
  const newFavoriteVTuberKeys = newIsFavorite
    ? [...favoriteVTuberKeys.value, vTuber.key]
    : favoriteVTuberKeys.value.filter((key) => key !== vTuber.key);
  favoriteVTuberKeys.value = newFavoriteVTuberKeys;
  updateFavoriteVTubersKeysConfig(newFavoriteVTuberKeys);
};

// ホロライブだけは期生・ユニット単位で絞り込む
const isDisplayVTuber = (v: VTuberData): boolean =>
  v.company === 'hololive'
    ? toVTuberGroups(v.group).some((group) => displayHololiveGroups.value.includes(group))
    : displayCompanies.value.includes(v.company);

const filteredVTubers = computed<VTuberData[]>(() => {
  return vTubers.value.flatMap((v) => {
    if (!isDisplayVTuber(v)) return [];
    if (!isFilterFavoriteVTubers.value) return v;
    return favoriteVTuberKeys.value.includes(v.key) ? { ...v, forceClearBoth: false } : [];
  });
});

// アニメーションがズレないようにVTuber一覧のkeyを変える
const keyVersion = ref(0);
watch([sortType, displayCompanies, displayHololiveGroups, isFilterFavoriteVTubers], () => {
  keyVersion.value++;
});
</script>

<template>
  <h2>VTubers</h2>
  <div class="whiteBox">
    <p class="config">
      <template v-for="sortTypeValue in sortTypes" :key="sortTypeValue">
        <label class="">
          <input v-model="sortType" type="radio" :value="sortTypeValue" />
          {{ sortTypeTexts[sortTypeValue] }}
        </label>
      </template>
    </p>
    <p class="config">
      <template v-for="company in companies" :key="company">
        <label>
          <input
            type="checkbox"
            :checked="displayCompanies.includes(company)"
            @change="handleChangeCompany(company, ($event.target as HTMLInputElement).checked)"
          />
          {{ companyTexts[company] }}
        </label>
      </template>
    </p>
    <p class="config groupConfig">
      <template v-for="group in hololiveGroups" :key="group">
        <label>
          <input
            type="checkbox"
            :checked="displayHololiveGroups.includes(group)"
            @change="handleChangeHololiveGroup(group, ($event.target as HTMLInputElement).checked)"
          />
          {{ group }}
        </label>
      </template>
    </p>
    <p>
      <label>
        <input v-model="isFilterFavoriteVTubers" type="checkbox" />
        推しのみ表示
      </label>
      <label>
        <input v-model="isFavoriteVTuberHighlight" type="checkbox" />
        推し強調表示
      </label>
      <label>
        <input v-model="isFavoriteVTuberEditMode" type="checkbox" />
        推し編集モード
      </label>
    </p>
  </div>
  <br />
  <div class="vTubers">
    <template v-for="vTuber in filteredVTubers" :key="vTuber.key + '-' + keyVersion">
      <VTuberCircle
        :v-tuber="vTuber"
        :display-companies="displayCompanies"
        :is-favorite="favoriteVTuberKeys.includes(vTuber.key)"
        :is-favorite-v-tuber-edit-mode="isFavoriteVTuberEditMode"
        :is-favorite-v-tuber-highlight="isFavoriteVTuberHighlight"
        @change-is-favorite="(newIsFavorite) => handleClickVTuber(vTuber, newIsFavorite)"
      />
    </template>
  </div>
  <br class="cb" />
</template>

<style scoped>
.vTubers {
  min-width: 1200px;
  /* display: flex; */
  /* flex-wrap: wrap; */
}

.config {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* ホロライブの期生・ユニットはホロライブのチェックの下位として字下げする */
.groupConfig {
  padding-left: 16px;
}
</style>
