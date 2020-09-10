import "./UpButton.css"
import { defineComponent, PropType } from "vue";
import { emptyFunc } from "../utils/Misc";

export default defineComponent({
  name: 'UpButton',
  props: {
    onClick: Function as PropType<() => void>,
  },
  setup(props) {
    return () => (
      <button
        class="UpButton"
        onClick={props.onClick}
        onTouchstart={emptyFunc}
      >
        <div class="face">
          <span class="icon fas fa-angle-up"></span>
        </div>
      </button>
    );
  }
});