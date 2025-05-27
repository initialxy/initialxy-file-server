<template>
  <div class="search-input">
    <i class="fas fa-search search-icon"></i>
    <input type="text" v-model="localValue" />
    <button class="fas fa-xmark clear-icon" @click="clearInput"></button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from '../utils/Misc'

const props = defineProps<{
  value?: string
}>()

const emits = defineEmits<{
  (event: 'input', value: string): void
}>()

const model = defineModel<string>({
  type: String,
  default: '',
})

const localValue = ref(props.value || '')

const clearInput = () => {
  localValue.value = ''
}

watch(
  localValue,
  debounce((newValue: string, oldValue: string) => {
    if (newValue !== oldValue) {
      model.value = newValue
    }
  }, 100),
)

watch(model, (newValue) => {
  if (newValue !== localValue.value) {
    localValue.value = newValue || ''
  }
})
</script>

<style scoped>
.search-input {
  align-items: center;
  display: flex;
  position: relative;
  width: 1em;
}

.search-input input {
  background-color: transparent;
  border: none;
  box-sizing: border-box;
  color: white;
  font-size: 1em;
  left: 0;
  outline: none;
  position: absolute;
  width: 100%;
}

.search-icon,
.clear-icon {
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  outline: none;
  position: absolute;
}

.search-icon {
  font-size: 1.2em;
  left: 0;
}

.clear-icon {
  display: none;
  font-size: 1em;
  right: -1.5em;
}

.search-input:focus-within {
  padding-left: 1.5em;
  padding-right: 1.5em;
  width: 5em;
}

.search-input:focus-within input {
  border-bottom: 1px solid white;
}

.search-input:focus-within .search-icon {
  left: -1.5em;
}

.search-input:focus-within .clear-icon {
  display: block;
}
</style>
