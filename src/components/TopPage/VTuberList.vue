<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
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

const vTubers = ref<VTuberData[]>([]);

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
  <br />
  <div class="vTubers">
    <template v-for="vTuber in vTubers" :key="vTuber.key">
      <VTuberCircle :v-tuber="vTuber" :is-open-link-new-tab="isOpenLinkNewTab" :display-companies="displayCompanies" />
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
