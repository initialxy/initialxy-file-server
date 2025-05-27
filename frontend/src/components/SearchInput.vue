<template>
  <div class="search-input">
    <i class="fas fa-search search-icon"></i>
    <input type="text" v-model="localValue" placeholder="Search" />
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
  border-radius: 0;
  border: none;
  box-sizing: border-box;
  color: transparent;
  font-size: 1em;
  left: 0;
  outline: none;
  position: absolute;
  width: 100%;
}

.search-input input::placeholder {
  color: transparent;
}

.search-icon {
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2em;
  left: 0;
  outline: none;
  position: absolute;
}

.search-input:focus-within {
  padding-left: 1.5em;
  padding-right: 1.5em;
  width: 5em;
}

.search-input:focus-within input {
  background-color: #0045633f;
  border-radius: 2em;
  border: 1px solid white;
  color: white;
  padding: 0.5em 0.5em 0.5em 2.5em;
}

.search-input:focus-within input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:focus-within .search-icon {
  left: 0.6em;
  z-index: 2;
}
</style>
