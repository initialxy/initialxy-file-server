import { defineComponent } from "vue";

export default defineComponent({
  name: 'Header',
  setup() {
    return () => <div class="Header">Hello World</div>;
  }
});