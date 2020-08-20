import { defineComponent, onMounted, ref } from "vue";
import { genDirInfo } from "./utils/API"
import HelloWorld from "./components/HelloWorld";

export default defineComponent({
  name: 'App',
  setup() {
    const res = ref("");

    onMounted(async () => {
      res.value = await genDirInfo("");
    });

    const test = (msg: string): void => console.log(msg);
    return () => <HelloWorld msg={res.value} onClick={test}/>;
  }
});