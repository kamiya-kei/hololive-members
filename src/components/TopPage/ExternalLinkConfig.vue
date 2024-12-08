<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useIsOpenLinkNewTabConfig } from './stores/useIsOpenLinkNewTabConfig';

const { isOpenLinkNewTab } = storeToRefs(useIsOpenLinkNewTabConfig());
</script>

<template>
  <h2>設定</h2>
  <p>
    <label><input v-model="isOpenLinkNewTab" type="checkbox" />リンクを新しいタブで開く</label>
  </p>
</template>
