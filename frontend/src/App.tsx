import { defineComponent, onMounted, ref } from "vue";
import { genDirInfo } from "./utils/API"
import HelloWorld from "./components/HelloWorld";

export default defineComponent({
  name: 'App',
  setup() {
    const res = ref("");

    onMounted(async () => {
      const dirInfo = await genDirInfo("");
      res.value = dirInfo.thumbnail_absolute_path || "";
    });

    const test = (msg: string): void => console.log(msg);
    return () => <HelloWorld msg={res.value} onClick={test}/>;
  }
});