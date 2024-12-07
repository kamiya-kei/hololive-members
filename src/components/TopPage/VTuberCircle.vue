<script setup lang="ts">
import { VTuberData } from './functions/buildVTubers'
import { TCompany } from './functions/storages'
import Link from '../Link.vue'

const {
  vTuber: v,
  isOpenLinkNewTab,
  displayCompanies,
} = defineProps<{
  isOpenLinkNewTab: boolean
  vTuber: VTuberData
  displayCompanies: TCompany[]
}>()

const character_bg_img = (key: string) =>
  `background-image: url('img/${key}.webp');`
</script>

<template>
  <div
    v-if="displayCompanies.includes(v.company)"
    class="character-item"
    :class="[v.class]"
  >
    <div class="character-circle">
      <span class="holomem-name">{{ v.name }}</span>
      <span class="holomem-msg">{{ v.msg }}</span>
      <span class="holomem-msg2">{{ v.msg2 }}</span>
      <span class="holomem-msg0">{{ v.msg0 }}</span>
      <span class="holomem-twitter">
        <Link :isOpenLinkNewTab="isOpenLinkNewTab" :href="v.twitter"
          ><img src="../../assets/twitter1.webp" width="30px"
        /></Link>
      </span>
      <span class="holomem-youtube">
        <Link :isOpenLinkNewTab="isOpenLinkNewTab" :href="v.youtube"
          ><img src="../../assets/youtube.png" width="30px"
        /></Link>
      </span>
    </div>
    <div class="character-circle-white"></div>
    <div class="character-out"></div>
    <div class="character-bg" :style="character_bg_img(v.key)"></div>
  </div>
</template>

<style scoped></style>
