<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useIsOpenLinkNewTabConfig } from './stores/useIsOpenLinkNewTabConfig';

const { href } = defineProps<{
  href: string;
}>();

const { isOpenLinkNewTab } = storeToRefs(useIsOpenLinkNewTabConfig());
</script>

<template>
  <a :href="href" :target="isOpenLinkNewTab ? '_blank' : '_self'" rel="noopener noreferrer"><slot /></a>
</template>
