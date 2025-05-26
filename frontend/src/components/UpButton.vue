<template>
  <button class="up-button" @click="onClick" @touchstart="emptyFunc">
    <div class="face">
      <span class="icon fas fa-angle-up"></span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { emptyFunc } from '../utils/Misc'

const props = defineProps<{
  onClick: () => void
}>()
</script>

<style scoped>
.up-button {
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  background-color: transparent;
  border: 0;
  display: block;
  height: 5em;
  outline: 0;
  padding: 0;
  position: relative;
  width: 5em;
}

.up-button::after {
  background-color: #ae0a2496;
  border-radius: 2.5em;
  box-shadow: 0 0 1em #ae0a24ff;
  content: '';
  height: 95%;
  left: 5%;
  position: absolute;
  top: 5%;
  transform: scale(0.9);
  width: 95%;
  z-index: 0;
}

.up-button > .face {
  align-items: center;
  background-color: #eb3d59ff;
  border-radius: 2.5em;
  display: flex;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: transform 0.1s ease-out;
  width: 100%;
  z-index: 1;
}

.up-button > .face:active {
  transform: translate(0.2em, 0.2em);
}

.up-button .icon {
  color: white;
  font-size: 3em;
  margin: auto;
}

@media (hover: hover) {
  .up-button > .face:hover {
    transform: translate(0.2em, 0.2em);
  }
}
</style>
