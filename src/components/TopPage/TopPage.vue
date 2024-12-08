<script setup lang="ts">
import { watch } from 'vue';
import VTuberList from './VTuberList.vue';
import ExternalLink from '@/components/ExternalLink.vue';
import { loadIsOpenLinkNewTabConfig, updateIsOpenLinkNewTabConfig } from './functions/storages';

const isOpenLinkNewTab = defineModel<boolean>('isOpenLinkNewTab', {
  default: loadIsOpenLinkNewTabConfig(),
});

watch(isOpenLinkNewTab, (newIsOpenLinkNewTab) => {
  updateIsOpenLinkNewTabConfig(newIsOpenLinkNewTab);
});
</script>

<template>
  <h1>ホロライブメンバー + α 非公式まとめ</h1>
  <h2>設定</h2>
  <p>
    <label><input v-model="isOpenLinkNewTab" type="checkbox" />リンクを新しいタブで開く</label>
  </p>
  <h2>Links</h2>
  <p class="linkRow">
    ホロライブ公式
    <ExternalLink :is-open-link-new-tab="isOpenLinkNewTab" href="https://twitter.com/hololivetv">
      <img src="../../assets/twitter1.webp" width="20px" />
    </ExternalLink>
    <ExternalLink
      :is-open-link-new-tab="isOpenLinkNewTab"
      href="https://www.youtube.com/channel/UCJFZiqLMntJufDCHc6bQixg"
    >
      <img src="../../assets/youtube.png" width="20px" />
    </ExternalLink>
    ：
    <ExternalLink :is-open-link-new-tab="isOpenLinkNewTab" href="https://www.hololive.tv/"> Offical HP </ExternalLink>
    ／
    <ExternalLink :is-open-link-new-tab="isOpenLinkNewTab" href="https://schedule.hololive.tv/lives/hololive">
      配信予定スケジュール
    </ExternalLink>
  </p>
  <VTuberList :is-open-link-new-tab="isOpenLinkNewTab" />
  <div class="emptyBottom" />
</template>

<style scoped>
.linkRow {
  display: flex;
  gap: 4px;
  align-items: center;
}
.emptyBottom {
  margin-bottom: 200px;
}
</style>
