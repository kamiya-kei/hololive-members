<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import {
  loadSortTypeConfig,
  TSortType,
  updateSortTypeConfig,
  sortTypes,
  sortTypeTexts,
  loadCompanyConfig,
  TCompany,
  updateCompanyConfig,
  companyTexts,
  companies,
  loadFavoriteVTubersKeysConfig,
  updateFavoriteVTubersKeysConfig,
  updateIsFilterFavoriteVTubersConfig,
  loadIsFavoriteVTuberEditModeConfig,
  loadIsFilterFavoriteVTubersConfig,
  updateIsFavoriteVTuberEditModeConfig,
} from './functions/storages';
import { VTuberData, buildVTubers } from './functions/buildVTubers';
import VTuberCircle from './VTuberCircle.vue';

const { isOpenLinkNewTab } = defineProps<{
  isOpenLinkNewTab: boolean;
}>();

const sortType = defineModel<TSortType>('sortType', {
  default: loadSortTypeConfig(),
});

const displayCompanies = defineModel<TCompany[]>('displayCompanies', {
  default: loadCompanyConfig(),
});

const favoriteVTuberKeys = defineModel<string[]>('favoriteVTuberKeys', {
  default: loadFavoriteVTubersKeysConfig(),
});

const isFilterFavoriteVTubers = defineModel<boolean>('isFilterFavoriteVTubers', {
  default: loadIsFilterFavoriteVTubersConfig(),
});

const isFavoriteVTuberEditMode = defineModel<boolean>('isFavoriteVTuberEditMode', {
  default: loadIsFavoriteVTuberEditModeConfig(),
});

const vTubers = ref<VTuberData[]>([]);

const filteredVTubers = computed<VTuberData[]>(() => {
  return vTubers.value.filter((v) => {
    if (!displayCompanies.value.includes(v.company)) return false;
    if (!isFilterFavoriteVTubers.value) return true;
    return favoriteVTuberKeys.value.includes(v.key);
  });
});

onMounted(async () => {
  vTubers.value = buildVTubers(sortType.value);
});

watch(sortType, (newSortType) => {
  vTubers.value = buildVTubers(newSortType);
  updateSortTypeConfig(newSortType);
});

watch(displayCompanies, (newDisplayCompanies) => {
  updateCompanyConfig(newDisplayCompanies);
});

watch(favoriteVTuberKeys, (newFavoriteVTuberKeys) => {
  updateFavoriteVTubersKeysConfig(newFavoriteVTuberKeys);
});

watch(isFilterFavoriteVTubers, (newIsFilterFavoriteVTubers) => {
  updateIsFilterFavoriteVTubersConfig(newIsFilterFavoriteVTubers);
});

watch(isFavoriteVTuberEditMode, (newIsFavoriteVTuberEditMode) => {
  updateIsFavoriteVTuberEditModeConfig(newIsFavoriteVTuberEditMode);
});

const handleClickVTuber = (vTuber: VTuberData, newIsFavorite: boolean) => {
  const newFavoriteVTuberKeys = newIsFavorite
    ? [...favoriteVTuberKeys.value, vTuber.key]
    : favoriteVTuberKeys.value.filter((key) => key !== vTuber.key);
  favoriteVTuberKeys.value = newFavoriteVTuberKeys;
  updateFavoriteVTubersKeysConfig(newFavoriteVTuberKeys);
};
</script>

<template>
  <h2>VTuber一覧</h2>
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
        <input v-model="displayCompanies" type="checkbox" :value="company" />
        {{ companyTexts[company] }}
      </label>
    </template>
  </p>
  <p>
    <label>
      <input v-model="isFilterFavoriteVTubers" type="checkbox" />
      推しのみ表示
    </label>
    <label>
      <input v-model="isFavoriteVTuberEditMode" type="checkbox" />
      推し編集モード
    </label>
  </p>
  <br />
  <div class="vTubers">
    <template v-for="vTuber in filteredVTubers" :key="vTuber.key">
      <VTuberCircle
        :v-tuber="vTuber"
        :is-open-link-new-tab="isOpenLinkNewTab"
        :display-companies="displayCompanies"
        :is-favorite="favoriteVTuberKeys.includes(vTuber.key)"
        :is-favorite-v-tuber-edit-mode="isFavoriteVTuberEditMode"
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
  gap: 12px;
}
</style>
