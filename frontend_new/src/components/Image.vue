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

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Image',
  props: {
    src: { type: String, required: true },
    shouldFadeIn: { type: Boolean, default: false },
  },
  setup() {
    const isShown = ref(false)
    const onLoad = () => (isShown.value = true)

    return {
      isShown,
      onLoad,
    }
  },
})
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
