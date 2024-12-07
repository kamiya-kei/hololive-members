<script setup lang="ts">
import { watch } from 'vue'
import Members from './Members.vue'
import Link from '../Link.vue'
import {
  loadIsOpenLinkNewTabConfig,
  updateIsOpenLinkNewTabConfig,
} from './functions/storages'

const isOpenLinkNewTab = defineModel<boolean>('isOpenLinkNewTab', {
  default: loadIsOpenLinkNewTabConfig(),
})

watch(isOpenLinkNewTab, (newIsOpenLinkNewTab) => {
  updateIsOpenLinkNewTabConfig(newIsOpenLinkNewTab)
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
      />リンクを新しいタブで開く</label
    >
  </p>
  <h2>Links</h2>
  <p>
    ホロライブ公式
    <Link
      :isOpenLinkNewTab="isOpenLinkNewTab"
      href="https://twitter.com/hololivetv"
    >
      <img src="../../assets/twitter1.webp" width="20px" />
    </Link>
    <Link
      :isOpenLinkNewTab="isOpenLinkNewTab"
      href="https://www.youtube.com/channel/UCJFZiqLMntJufDCHc6bQixg"
    >
      <img src="../../assets/youtube.png" width="20px" />
    </Link>
    ：
    <Link :isOpenLinkNewTab="isOpenLinkNewTab" href="https://www.hololive.tv/"
      >Offical HP</Link
    >
    ／
    <Link
      :isOpenLinkNewTab="isOpenLinkNewTab"
      href="https://schedule.hololive.tv/lives/hololive"
      >配信予定スケジュール</Link
    >
    ／
    <Link
      :isOpenLinkNewTab="isOpenLinkNewTab"
      href="https://ch.nicovideo.jp/hololive"
      >ホロライブ公式ファンクラブ</Link
    >
  </p>
  <Members :isOpenLinkNewTab="isOpenLinkNewTab" />
  <div class="emptyBottom"></div>
</template>

<style scoped>
.emptyBottom {
  margin-bottom: 200px;
}
</style>
