import "./App.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import { defineComponent, onMounted, Transition } from "vue";
import Browser from "./components/Browser";
import Header from "./components/Header";
import store from "./store";
import UpButton from "./components/UpButton";

export default defineComponent({
  name: "App",
  setup() {
    onMounted(async () => {
      store.dispatch("initRootDir");
    });

    const onUpClicked = () => store.dispatch("popDir");

    return () => (
      <div class="App">
        <Header class="header" title={store.state.title} />
        <Transition>
          <div class="main" key={store.state.curDir}>
            <Browser class="browser" />
            <div class="darken" />
          </div>
        </Transition>
        <Transition>
          {
            store.getters.canPopDir
              ? <UpButton
                class="up_button"
                onClick={onUpClicked}
              />
              : null
          }
        </Transition>
        <Transition>
          {
            store.state.shouldBlockScreen
              ? <div class="screen_blocker" />
              : null
          }
        </Transition>
      </div>
    );
  }
});