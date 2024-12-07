<script setup lang="ts">
import { ref, defineModel, onMounted, watch } from 'vue'
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

const { openLinkMode } = defineProps<{
  openLinkMode: '_blank' | '_self'
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

const character_bg_img = (key: string) =>
  `background-image: url('img/${key}.webp');`
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
    <template v-for="m in vTubers" :key="m.key">
      <div
        v-if="displayCompanies.includes(m.company)"
        class="character-item"
        :class="[m.class]"
      >
        <div class="character-circle">
          <span class="holomem-name">{{ m.name }}</span>
          <span class="holomem-msg">{{ m.msg }}</span>
          <span class="holomem-msg2">{{ m.msg2 }}</span>
          <span class="holomem-msg0">{{ m.msg0 }}</span>
          <span class="holomem-twitter">
            <a
              :href="m.twitter"
              :target="openLinkMode"
              rel="noopener noreferrer"
              ><img src="../assets/twitter1.webp" width="30px"
            /></a>
          </span>
          <span class="holomem-youtube">
            <a
              :href="m.youtube"
              :target="openLinkMode"
              rel="noopener noreferrer"
              ><img src="../assets/youtube.png" width="30px"
            /></a>
          </span>
        </div>
        <div class="character-circle-white"></div>
        <div class="character-out"></div>
        <div class="character-bg" :style="character_bg_img(m.key)"></div>
      </div>
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
