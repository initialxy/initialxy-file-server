import { defineComponent, PropType } from "vue";
import "./AppButton.css"

export default defineComponent({
  name: 'AppButton',
  props: {
    onClick: Function as PropType<() => void>,
  },
  setup(props) {
    return () => <button class="AppButton" onClick={props.onClick}>Up</button>;
  }
});