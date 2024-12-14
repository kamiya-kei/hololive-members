<script setup lang="ts">
import VTuberList from './VTuberList.vue';
import ExternalLink from '@/components/common/ExternalLink/ExternalLink.vue';
import ExternalLinkConfig from '@/components/common/ExternalLink/ExternalLinkConfig.vue';
</script>

<template>
  <h1>ホロライブメンバー + α 非公式まとめ</h1>
  <ExternalLinkConfig />
  <h2>Links</h2>
  <p class="linkRow whiteBox">
    ホロライブ公式
    <ExternalLink href="https://twitter.com/hololivetv">
      <img src="../../assets/twitter1.webp" width="20px" />
    </ExternalLink>
    <ExternalLink href="https://www.youtube.com/channel/UCJFZiqLMntJufDCHc6bQixg">
      <img src="../../assets/youtube.png" width="20px" />
    </ExternalLink>
    ：
    <ExternalLink href="https://www.hololive.tv/"> Offical HP </ExternalLink>
    ／
    <ExternalLink href="https://schedule.hololive.tv/lives/hololive"> 配信予定スケジュール </ExternalLink>
  </p>
  <VTuberList />
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
