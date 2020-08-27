import { defineComponent, PropType } from "vue";
import { File } from "../jsgen/File"

export default defineComponent({
  name: "FileComp",
  props: {
    file: { type: Object as PropType<File>, required: true },
  },
  setup(props) {
    return () => (
      <div class="ItemComp">
        {props.file.name}
      </div>
    );
  }
});