import { defineComponent, PropType } from "vue";
import { File } from "../jsgen/File"

export default defineComponent({
  name: "FileComp",
  props: {
    file: { type: Object as PropType<File>, required: true },
    onSelect: Function as PropType<(file: File) => void>,
  },
  setup(props) {
    const onClick = (_: Event) => {
      props.onSelect && props.onSelect(props.file);
    }

    return () => (
      <div class="ItemComp" onClick={onClick}>
        {props.file.name + (props.file.is_file ? "" : "/")}
      </div>
    );
  }
});