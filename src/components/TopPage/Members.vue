<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
} from './functions/storages'
import { VTuberData, buildVTubers } from './functions/buildVTubers'
import VTuberCircle from './VTuberCircle.vue'

const { isOpenLinkNewTab } = defineProps<{
  isOpenLinkNewTab: boolean
}>()

const sortType = defineModel<TSortType>('sortType', {
  default: loadSortTypeConfig(),
})

const displayCompanies = defineModel<TCompany[]>('displayCompanies', {
  default: loadCompanyConfig(),
})

const vTubers = ref<VTuberData[]>([])

onMounted(async () => {
  vTubers.value = buildVTubers(sortType.value)
})

watch(sortType, (newSortType) => {
  vTubers.value = buildVTubers(newSortType)
  updateSortTypeConfig(newSortType)
})

watch(displayCompanies, (newDisplayCompanies) => {
  updateCompanyConfig(newDisplayCompanies)
})
</script>

<template>
  <h2>VTuber一覧</h2>
  <p class="config">
    <template v-for="sortTypeValue in sortTypes" :key="sortTypeValue">
      <label class="">
        <input type="radio" v-model="sortType" :value="sortTypeValue" />
        {{ sortTypeTexts[sortTypeValue] }}
      </label>
    </template>
  </p>
  <p class="config">
    <template v-for="company in companies" :key="company">
      <label>
        <input type="checkbox" v-model="displayCompanies" :value="company" />
        {{ companyTexts[company] }}
      </label>
    </template>
  </p>
  <br />
  <div class="vTubers">
    <template v-for="vTuber in vTubers" :key="vTuber.key">
      <VTuberCircle
        :vTuber="vTuber"
        :isOpenLinkNewTab="isOpenLinkNewTab"
        :displayCompanies="displayCompanies"
      />
    </template>
  </div>
  <br class="cb" />
</template>

<style scoped>
.config {
  display: flex;
  gap: 12px;
}
</style>
