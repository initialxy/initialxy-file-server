import { defineComponent, PropType } from "vue";
import { File } from "../jsgen/File"

function getFriendlyName(name: string): string {
  name = name.replace(/\.\w+$/, "").replace(/_/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

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
        {getFriendlyName(props.file.name) + (props.file.is_file ? "" : "/")}
      </div>
    );
  }
});