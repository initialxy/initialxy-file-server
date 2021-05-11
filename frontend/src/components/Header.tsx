import "./Header.css";
import { defineComponent } from "vue";
import { emptyFunc } from "../utils/Misc";
import store from "../store";

export default defineComponent({
  name: "Header",
  props: {
    title: { type: String, required: true },
  },
  setup(props) {
    const onClick = (e: Event) => {
      e.preventDefault();
      store.dispatch("goToRoot");
    }

    return () => (
      <div class="Header">
        <a
          class="logo" href={store.state.rootDir}
          onClick={onClick}
          onTouchstart={emptyFunc}
        />
        <h1>{props.title}</h1>
      </div>
    );
  }
});