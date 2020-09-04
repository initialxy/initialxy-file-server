import "./App.css";
import { defineComponent, onMounted } from "vue";
import { File } from "./jsgen/File"
import AppButton from "./components/AppButton";
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
        {
          store.getters.canPopDir
            ? <AppButton
              class="UpButton"
              onClick={() => store.dispatch("popDir")}
            />
            : null
        }
        <Browser
          items={store.state.curDirInfo?.contents ?? []}
          onSelect={(file: File) => store.dispatch("selectFile", file)}
        />
      </div>
    );
  }
});