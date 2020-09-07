import "./App.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";
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
        <Header class="header" title={store.state.title} />
        <Browser
          class="browser"
          key={store.state.curDir}
          baseDir={store.state.curDir}
          items={store.state.curDirInfo?.contents ?? []}
          onSelect={(file: File) => store.dispatch("selectFile", file)}
        />
        {
          store.getters.canPopDir
            ? <AppButton
              class="up_button"
              onClick={() => store.dispatch("popDir")}
            />
            : null
        }
      </div>
    );
  }
});