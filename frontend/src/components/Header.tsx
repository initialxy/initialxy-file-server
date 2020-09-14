import "./Header.css"
import { defineComponent } from "vue";

export default defineComponent({
  name: 'Header',
  props: {
    title: { type: String, required: true },
  },
  setup(props) {
    return () => (
      <div class="Header">
        <div class="logo" />
        <h1>{props.title}</h1>
      </div>
    );
  }
});