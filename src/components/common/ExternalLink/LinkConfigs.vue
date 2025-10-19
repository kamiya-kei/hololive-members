<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useIsOpenLinkNewTabConfig } from './stores/useIsOpenLinkNewTabConfig';
import { useIsXSubAccount } from './stores/useIsXSubAccount';

const { isOpenLinkNewTab } = storeToRefs(useIsOpenLinkNewTabConfig());
const { isXSubAccount } = storeToRefs(useIsXSubAccount());
</script>

<template>
  <h2>Configs</h2>
  <p class="whiteBox">
    <label><input v-model="isOpenLinkNewTab" type="checkbox" /> リンクを新しいタブで開く</label>　
    <label><input v-model="isXSubAccount" type="checkbox" /> Xのリンクをサブアカウントにする</label>
  </p>
</template>
