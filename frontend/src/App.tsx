import { defineComponent, onMounted, ref } from "vue";
import { genDirInfo } from "./utils/API"
import HelloWorld from "./components/HelloWorld";
import store from './store';

export default defineComponent({
  name: 'App',
  setup() {
    const res = ref("");

    onMounted(async () => {
      store.dispatch("initRootDir");
    });

    const test = (msg: string): void => console.log(msg);
    return () => <HelloWorld
      msg={store.state.curDirInfo?.theme_color || ""} onClick={test}
    />;
  }
});