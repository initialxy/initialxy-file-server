<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from './stores'
import Browser from './components/Browser.vue'
import Header from './components/Header.vue'
import UpButton from './components/UpButton.vue'
import { clx, isIOS } from './utils/Misc'

const store = useStore()

onMounted(() => {
  store.initRootDir()
})

const onUpClicked = () => store.popDir()
const shouldAnimateBackNav = !isIOS()
</script>

<template>
  <div
    :class="
      clx({
        app: true,
        is_forward_nav: store.isForwardNav,
        is_backward_nav: !store.isForwardNav && shouldAnimateBackNav,
      })
    "
  >
    <Header class="header" :title="store.title">
    </Header>
    <Transition>
      <div class="main" :key="store.curDir">
        <Browser class="browser" />
        <div class="darken">
        </div>
      </div>
    </Transition>
    <Transition>
      <UpButton v-if="store.canPopDir" class="up_button" @click="onUpClicked" />
    </Transition>
    <Transition>
      <div v-if="store.shouldBlockScreen" class="screen_blocker">
      </div>
    </Transition>
  </div>
</template>

<style scoped>
html,
body,
#app {
  background-color: #01a4eb;
  height: 100%;
  margin: 0;
  width: 100%;
  overflow: hidden;
}

.app {
  background-color: #e3f6ff;
  background-position: center top;
  background-repeat: no-repeat;
  background-size: 100% 20em;
  box-sizing: border-box;
  font-family: Roboto, Arial, Helvetica, sans-serif;
  font-weight: 300;
  height: 100%;
  overflow: hidden;
  position: fixed;
  width: 100%;
}

.app > .up_button {
  bottom: 2em;
  position: fixed;
  right: 2em;
  z-index: 9;
}

.app > .header {
  position: fixed;
  width: 100%;
  z-index: 8;
}

.app > .main {
  background-color: #e3f6ff;
  box-sizing: border-box;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-top: 3em;
  width: 100%;
}

.app > .main > .darken {
  background-color: black;
  display: none;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 3;
}

.app > .main::-webkit-scrollbar {
  display: none;
}

.app > .screen_blocker {
  background-color: #000000c7;
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99;
}

.app > .up_button.v-enter-active,
.app > .up_button.v-leave-active {
  transition: transform 0.3s ease;
}

.app > .up_button.v-enter-from {
  transform: translateX(7em);
}

.app > .up_button.v-enter-to {
  transform: translateX(0em);
}

.app > .up_button.v-leave-from {
  transform: translateX(0em);
}

.app > .up_button.v-leave-to {
  transform: translateX(7em);
}

.app.is_forward_nav > .main.v-enter-active,
.app.is_forward_nav > .main.v-leave-active,
.app.is_backward_nav > .main.v-enter-active,
.app.is_backward_nav > .main.v-leave-active {
  position: absolute;
  transition: transform 0.5s ease;
  z-index: 1;
}

.app.is_backward_nav > .main.v-leave-active {
  z-index: 2;
}

.app.is_forward_nav > .main.v-enter-from {
  transform: translate(100%, 0);
}

.app.is_forward_nav > .main.v-enter-to {
  transform: translate(0, 0);
}

.app.is_forward_nav > .main.v-leave-from {
  transform: translate(0, 0);
}

.app.is_forward_nav > .main.v-leave-to {
  transform: translate(-30%, 0);
}

.app.is_forward_nav > .main.v-leave-active > .darken {
  display: block;
  transition: opacity 0.5s ease;
}

.app.is_forward_nav > .main.v-leave-from > .darken {
  opacity: 0;
}

.app.is_forward_nav > .main.v-leave-to > .darken {
  opacity: 0.3;
}

.app.is_backward_nav > .main.v-enter-from {
  transform: translate(-30%, 0);
}

.app.is_backward_nav > .main.v-enter-to {
  transform: translate(0, 0);
}

.app.is_backward_nav > .main.v-leave-from {
  transform: translate(0, 0);
}

.app.is_backward_nav > .main.v-leave-to {
  transform: translate(100%, 0);
}

.app.is_backward_nav > .main.v-enter-active > .darken {
  display: block;
  transition: opacity 0.5s ease;
}

.app.is_backward_nav > .main.v-enter-from > .darken {
  opacity: 0.3;
}

.app.is_backward_nav > .main.v-enter-to > .darken {
  opacity: 0;
}

.app > .screen_blocker.v-enter-active {
  transition: opacity 1s ease;
}

.app > .screen_blocker.v-enter-from {
  opacity: 0;
}

.app > .screen_blocker.v-enter-to {
  opacity: 1;
}
</style>
