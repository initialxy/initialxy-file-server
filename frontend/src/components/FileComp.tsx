import "./FileComp.css";
import { defineComponent, PropType } from "vue";
import { File } from "../jsgen/File";
import { getFriendlyFileName } from "../utils/URL";

export default defineComponent({
  name: "FileComp",
  props: {
    file: { type: Object as PropType<File>, required: true },
    size: { type: Number, required: true },
    onSelect: Function as PropType<(file: File) => void>,
  },
  setup(props) {
    const onClick = (_: Event) => {
      props.onSelect && props.onSelect(props.file);
    }

    return () => {
      if (props.size === 0) {
        return null;
      }
      const sizePx = `${props.size}px`;
      const faClass = props.file.is_file ? "fa-file" : "fa-folder";
      return (
        <div class="FileComp" onClick={onClick} style={{ width: sizePx }}>
          <div class="thumbnail" style={{ height: sizePx }}>
            <div class={`icon fas ${faClass}`} />
          </div>
          <div class="file_name">{getFriendlyFileName(props.file.name)}</div>
        </div>
      );
    };
  }
});