import "./App.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import { defineComponent, onMounted, Transition } from "vue";
import { File } from "./jsgen/File"
import UpButton from "./components/UpButton";
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
        <Transition>
          <div class="main" key={store.state.curDir}>
            <Browser
              class="browser"
              baseDir={store.state.curDir}
              onSelect={(file: File) => store.dispatch("selectFile", file)}
            />
          </div>
        </Transition>
        <Transition>
          {
            store.getters.canPopDir
              ? <UpButton
                class="up_button"
                onClick={() => store.dispatch("popDir")}
              />
              : null
          }
        </Transition>
      </div>
    );
  }
});