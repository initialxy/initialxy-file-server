import { defineComponent, PropType } from "vue";
import { File } from "../jsgen/File"
import ItemComp from "./FileComp";

export default defineComponent({
  name: "Browser",
  props: {
    items: { type: Array as PropType<File[]>, required: true },
  },
  setup(props) {
    return () => (
      <div class="Browser">
        {Array.from(props.items).map(i => <ItemComp file={i} />)}
      </div>
    );
  }
});