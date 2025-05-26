<template>
  <a
    :class="{ 'file-comp': true, folder: !file.is_file }"
    @click.prevent="onClick"
    @touchstart="emptyFunc"
    :href="fileURL"
  >
    <div class="inner">
      <div class="thumbnail_container">
        <div class="icon fas" :class="getFileIconClass(file)"></div>
        <ImageComp v-if="thumbnail" class="thumbnail" :src="normalizeURL(thumbnail, true)" />
      </div>
      <div class="file_name">
        {{ getFriendlyFileName(file.name) }}
        <div v-if="isVisited" class="visited"></div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { emptyFunc, first } from '../utils/Misc'
import { File } from '../jsgen/File'
import { getFriendlyFileName, normalizeURL, joinFileURL } from '../utils/URL'
import ImageComp from './ImageComp.vue'

const props = withDefaults(
  defineProps<{
    baseDir: string
    file: File
    thumbnail?: string
    onSelect?: (file: File) => void
    isVisited?: boolean
  }>(),
  {
    isVisited: false,
  },
)

function getFileIconClass(file: File): string {
  if (!file.is_file) {
    return 'fa-folder'
  }
  const fileType = first(file.mimetype?.split('/'))
  switch (fileType) {
    case 'image':
      return 'fa-image'
    case 'video':
      return 'fa-play'
    case 'audio':
      return 'fa-headphones'
    case 'text':
      return 'fa-file-alt'
    case 'application':
      return 'fa-file-code'
  }
  return 'fa-file'
}

const onClick = (e: Event) => {
  e.preventDefault()
  if (props.onSelect) {
    props.onSelect(props.file)
  }
}

const fileURL = normalizeURL(joinFileURL(props.baseDir, props.file), props.file.is_file)
</script>

<style scoped>
.file-comp {
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  border: 0;
  display: block;
  min-height: 5em;
  min-width: 5em;
  outline: 0;
  padding: 0;
  position: relative;
}

.file-comp::after,
.file-comp::before {
  border-radius: 0.5em;
  content: '';
  height: 90%;
  position: absolute;
  width: 90%;
  z-index: 0;
}

.file-comp::after {
  box-shadow: 0 0 1.5em #568499;
  transform: translate(10%, 10%);
}

.file-comp::before {
  background-color: #ffffff7f;
  box-shadow: 0 0 0.5em white;
}

.file-comp > .inner {
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: absolute;
  transition: transform 0.1s ease-out;
  width: 100%;
  z-index: 2;
}

.file-comp > .inner:active {
  transform: translate(0.2em, 0.2em);
}

.file-comp > .inner > .thumbnail_container {
  align-items: center;
  background: linear-gradient(160deg, rgba(80, 190, 189, 1) 0%, rgba(52, 126, 158, 1) 100%);
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
  height: 8em;
  position: relative;
}

.file-comp > .inner > .thumbnail_container > .icon {
  color: white;
  font-size: 3em;
  margin: auto;
}

.file-comp > .inner > .thumbnail_container > .thumbnail {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}

.file-comp > .inner > .file_name {
  background-color: white;
  box-sizing: border-box;
  color: #323232;
  flex-grow: 0;
  overflow: hidden;
  padding: 0.5em;
  position: relative;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-comp.folder > .inner > .file_name {
  background-image: url('/folded_corner.png');
  background-repeat: no-repeat;
  background-position: bottom right;
  background-size: 10%;
  padding-right: 0.8em;
}

.file-comp > .inner > .file_name > .visited {
  width: 1em;
  height: 2em;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #50bebd;
  transform: translate(-0.7em, -0.7em) rotate(45deg);
}

@media (hover: hover) {
  .file-comp > .inner:hover {
    transform: translate(0.2em, 0.2em);
  }
}
</style>
