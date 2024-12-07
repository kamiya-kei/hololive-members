<script setup lang="ts">
import { defineProps } from 'vue'

const { href, isOpenLinkNewTab } = defineProps<{
  isOpenLinkNewTab: boolean
  href: string
}>()
</script>

<template>
  <a
    :href="href"
    :target="isOpenLinkNewTab ? '_blank' : '_self'"
    rel="noopener noreferrer"
    ><slot
  /></a>
</template>
