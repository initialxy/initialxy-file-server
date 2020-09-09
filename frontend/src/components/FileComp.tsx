import "./FileComp.css";
import { defineComponent, PropType } from "vue";
import { File } from "../jsgen/File";
import { getFriendlyFileName } from "../utils/URL";
import { emptyFunc } from "../utils/Misc";

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
    const faClass = props.file.is_file ? "fa-file" : "fa-folder";

    return () => (
      <div class="FileComp" onClick={onClick} onTouchstart={emptyFunc}>
        <div class="inner">
          <div class="thumbnail">
            <div class={`icon fas ${faClass}`} />
          </div>
          <div class="file_name">{getFriendlyFileName(props.file.name)}</div>
        </div>
      </div>
    );
  }
});