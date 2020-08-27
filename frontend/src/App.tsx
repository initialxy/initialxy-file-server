import "./App.css";
import { defineComponent, onMounted } from "vue";
import { File } from "./jsgen/File"
import Browser from "./components/Browser";
import Header from "./components/Header";
import store from "./store";

export default defineComponent({
  name: "App",
  setup() {
    onMounted(async () => {
      store.dispatch("initRootDir");
    });

    return () => (
      <div class="App">
        <Header />
        <Browser
          items={store.state.curDirInfo?.contents ?? []}
          onSelect={(file: File) => store.dispatch("selectFile", file)}
        />
      </div>
    );
  }
});