<template>
  <img
    :class="{
      animate: shouldFadeIn,
      shown: isShown,
    }"
    :src="src"
    @load="onLoad"
  />
</template>

<script setup lang="ts">
import { ref, withDefaults, defineProps } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  shouldFadeIn?: boolean
}>(), {
  shouldFadeIn: false,
})

const isShown = ref(false)
const onLoad = () => (isShown.value = true)
</script>

<style scoped>
img {
  object-fit: cover;
  object-position: center top;
  display: none;
}

.animate {
  display: block;
  opacity: 0;
  transition: opacity 0.1s ease-out;
}

.shown {
  display: block;
  opacity: 1;
}
</style>
