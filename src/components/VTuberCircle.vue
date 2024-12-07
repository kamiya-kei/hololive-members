<script setup lang="ts">

import { defineProps } from 'vue'
import { VTuberData } from './functions/buildVTubers';
import { TCompany } from './functions/storages';

const { vTuber: v, openLinkMode, displayCompanies } = defineProps<{
  openLinkMode: '_blank' | '_self',
  vTuber: VTuberData,
  displayCompanies: TCompany[],
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
          <a
            :href="v.twitter"
            :target="openLinkMode"
            rel="noopener noreferrer"
            ><img src="../assets/twitter1.webp" width="30px"
          /></a>
        </span>
        <span class="holomem-youtube">
          <a
            :href="v.youtube"
            :target="openLinkMode"
            rel="noopener noreferrer"
            ><img src="../assets/youtube.png" width="30px"
          /></a>
        </span>
      </div>
      <div class="character-circle-white"></div>
      <div class="character-out"></div>
      <div class="character-bg" :style="character_bg_img(v.key)"></div>
    </div>

</template>

<style scoped>

</style>
