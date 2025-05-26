<template>
  <div class="browser">
    <template v-if="childSize > 0">
      <ItemComp
        v-for="file in files"
        :key="joinFileURL(curDir, file)"
        :base-dir="curDir"
        :file="file"
        :thumbnail="thumbnails.get(joinFileURL(curDir, file))"
        @select="onSelect(file)"
        :is-visited="visited.has(joinFileURL(curDir, file))"
        :style="{ height: sizePx, width: sizePx }"
        class="child"
      />
    </template>
    <div class="clearfix"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue'
import { useStore } from '../stores'
import ItemComp from './FileComp.vue'
import { File } from '../jsgen/File'
import { joinFileURL } from '../utils/URL'

const MIN_CHILD_WIDTH_EM = 8
const CHILD_MARGIN_EM = 2

export default defineComponent({
  name: 'Browser',
  components: {
    ItemComp,
  },
  setup() {
    const store = useStore()
    const pxInEm = parseFloat(getComputedStyle(document.body).fontSize)
    const childSize = ref(0)

    const reComputeChildSize = () => {
      const windowWidth = window.innerWidth
      const columns = Math.floor(
        (windowWidth - CHILD_MARGIN_EM * pxInEm) /
          ((MIN_CHILD_WIDTH_EM + CHILD_MARGIN_EM) * pxInEm),
      )
      childSize.value =
        Math.floor((windowWidth - CHILD_MARGIN_EM * pxInEm) / columns) - CHILD_MARGIN_EM * pxInEm
    }

    onMounted(() => {
      window.addEventListener('resize', reComputeChildSize)
      reComputeChildSize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', reComputeChildSize)
    })

    const sizePx = computed(() => `${childSize.value}px`)

    const files = computed(() =>
      store.curDirInfo?.baseDir === store.curDir ? (store.curDirInfo.dirInfo.contents ?? []) : [],
    )

    const thumbnails = computed(() => store.thumbnails)
    const visited = computed(() => store.visited)
    const curDir = computed(() => store.curDir)

    const onSelect = (file: File) => {
      store.selectFile(file)
    }

    return {
      childSize,
      sizePx,
      files,
      thumbnails,
      visited,
      curDir,
      joinFileURL,
      onSelect,
    }
  },
})
</script>

<style scoped>
.browser {
  box-sizing: border-box;
  margin: 0;
  padding-bottom: 2em;
}

.browser > .child {
  float: left;
  margin: 2em 0 0 2em;
}

.browser > .clearfix {
  clear: both;
}
</style>
