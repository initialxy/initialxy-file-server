import "./Image.css";
import { clx } from "../utils/Misc";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Image",
  props: {
    src: { type: String, required: true },
    shouldFadeIn: { type: Boolean, default: false },
  },
  setup(props) {
    const isShown = ref(false);
    const onLoad = (_: Event) => isShown.value = true;
    return () => (
      <img
        class={clx({
          "Image": true,
          "animate": props.shouldFadeIn,
          "shown": isShown.value,
        })}
        src={props.src}
        onLoad={onLoad}
      />
    );
  }
});