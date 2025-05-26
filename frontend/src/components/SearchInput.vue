<template>
  <input type="text" v-model="localValue" placeholder="Search..." class="search-input" />
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
  border-radius: 0.5em;
  border: none;
  color: #323232;
  font-size: 1em;
  padding: 0.2em 0.5em;
  width: 5em;
}
</style>
