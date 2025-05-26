<template>
  <div class="header">
    <a class="logo" :href="store.rootDir" @click.prevent="goToRoot" @touchstart.stop> </a>
    <h1>{{ store.title }}</h1>
    <SearchInput v-model="store.searchQuery" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../stores'
import { ref } from 'vue'
import SearchInput from './SearchInput.vue'

const store = useStore()

const goToRoot = () => {
  store.goToRoot()
}
</script>

<style scoped>
.header {
  align-items: center;
  background: #01a4eb;
  box-shadow: 0 0 0.5em #0045637f;
  color: white;
  display: flex;
  height: 3em;
}

.search-input {
  margin-left: auto;
  margin-right: 2em;
}

.header h1 {
  flex-grow: 1;
  font-size: 1.3em;
  font-weight: 300;
  margin-right: 1.5em;
  overflow: hidden;
  padding: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header .logo {
  background-image: url('/logo_white.png');
  background-size: cover;
  height: 2em;
  margin: 0 0.5em 0 2em;
  min-width: 2em;
  transition: transform 0.1s ease-out;
  width: 2em;
}

.header .logo:active {
  transform: translate(0.1em, 0.1em);
}

@media (hover: hover) {
  .header > .logo:hover {
    transform: translate(0.1em, 0.1em);
  }
}
</style>
