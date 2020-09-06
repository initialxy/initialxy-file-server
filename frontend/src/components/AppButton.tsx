import "./AppButton.css"
import { defineComponent, PropType } from "vue";
import { emptyFunc } from "../utils/Misc";

export default defineComponent({
  name: 'AppButton',
  props: {
    onClick: Function as PropType<() => void>,
  },
  setup(props) {
    return () => (
      <button
        class="AppButton"
        onClick={props.onClick}
        onTouchstart={emptyFunc}
      >
        <div class="shadow" />
        <div class="face">
          <span class="icon fas fa-angle-up"></span>
        </div>
      </button>
    );
  }
});