import { defineComponent } from "vue";
import "./Header.css"

export default defineComponent({
  name: 'Header',
  setup() {
    return () => <div class="Header"></div>;
  }
});