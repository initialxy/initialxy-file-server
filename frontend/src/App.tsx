import "./App.css";
import { defineComponent, onMounted } from "vue";
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
        <Browser items={store.getters.curDirInfo?.contents ?? []} />
      </div>
    );
  }
});