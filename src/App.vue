<script setup lang="ts">
import { defineModel, computed, watch } from 'vue'
import Members from './components/Members.vue'

const isOpenLinkNewTab = defineModel('isOpenLinkNewTab', {
  default: localStorage.getItem('isOpenLinkNewTab') === '1',
})
const openLinkMode = computed(() =>
  isOpenLinkNewTab.value ? '_blank' : '_self'
)

watch(isOpenLinkNewTab, (newIsOpenLinkNewTab) => {
  localStorage.setItem('isOpenLinkNewTab', newIsOpenLinkNewTab ? '1' : '0')
})

</script>

<template>
  <h1>ホロライブメンバー + α 非公式まとめ</h1>
  <h2>設定</h2>
  <p>
    <label
      ><input
        type="checkbox"
        v-model="isOpenLinkNewTab"
        value="_blank"
      />リンクを新しいタブで開く</label
    >
  </p>
  <h2>Links</h2>
  <p>
    ホロライブ公式
    <a
      href="https://twitter.com/hololivetv"
      :target="openLinkMode"
      rel="noopener noreferrer"
    >
      <img src="./assets/twitter1.webp" width="20px" />
    </a>
    <a
      href="https://www.youtube.com/channel/UCJFZiqLMntJufDCHc6bQixg"
      :target="openLinkMode"
      rel="noopener noreferrer"
    >
      <img src="./assets/youtube.png" width="20px" />
    </a>
    ：
    <a
      href="https://www.hololive.tv/"
      :target="openLinkMode"
      rel="noopener noreferrer"
      >Offical HP</a
    >
    ／
    <a
      href="https://schedule.hololive.tv/lives/hololive"
      :target="openLinkMode"
      rel="noopener noreferrer"
      >配信予定スケジュール</a
    >
    ／
    <a
      href="https://ch.nicovideo.jp/hololive"
      :target="openLinkMode"
      rel="noopener noreferrer"
      >ホロライブ公式ファンクラブ</a
    >
  </p>
  <Members :openLinkMode=openLinkMode />
  <div style="margin-top: 200px"></div>
</template>

<style scoped></style>
