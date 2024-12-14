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

const filteredVTubers = computed<VTuberData[]>(() => {
  return vTubers.value.flatMap((v) => {
    if (!displayCompanies.value.includes(v.company)) return [];
    if (!isFilterFavoriteVTubers.value) return v;
    return favoriteVTuberKeys.value.includes(v.key) ? { ...v, forceClearBoth: false } : [];
  });
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
    <template v-for="vTuber in filteredVTubers" :key="vTuber.key">
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
  gap: 12px;
}
</style>
