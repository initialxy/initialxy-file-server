import { defineComponent, onMounted } from "vue";
import Header from "./components/Header";
import Browser from "./components/Browser";
import store from './store';

export default defineComponent({
  name: 'App',
  setup() {
    onMounted(async () => {
      store.dispatch("initRootDir");
    });

    return () => (
      <div class="App">
        <Header />
        <Browser />
      </div>
    );
  }
});