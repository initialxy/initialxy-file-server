import { defineComponent, ref } from "vue";
import "./Image.css"

export default defineComponent({
  name: 'Image',
  props: {
    src: { type: String, required: true },
  },
  setup(props) {
    const isShown = ref(false);
    return () => <img
      class={`Image ${isShown.value ? "shown" : ""}`} src={props.src}
      onLoad={(_: Event) => isShown.value = true}
    />;
  }
});