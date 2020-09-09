import "./FileComp.css";
import { defineComponent, PropType } from "vue";
import { emptyFunc } from "../utils/Misc";
import { File } from "../jsgen/File";
import { getFriendlyFileName, normalizeURL } from "../utils/URL";

export default defineComponent({
  name: "FileComp",
  props: {
    file: { type: Object as PropType<File>, required: true },
    thumbnail: String as PropType<string | null>,
    onSelect: Function as PropType<(file: File) => void>,
  },
  setup(props) {
    const onClick = (_: Event) => {
      props.onSelect && props.onSelect(props.file);
    }
    const faClass = props.file.is_file ? "fa-file" : "fa-folder";

    return () => {
      const backgroundImage = props.thumbnail != null
        ? `url("${normalizeURL(props.thumbnail, true)}")`
        : null;
      return (
        <div class="FileComp" onClick={onClick} onTouchstart={emptyFunc}>
          <div class="inner">
            <div class="thumbnail_container">
              <div class={`icon fas ${faClass}`} />
              {
                backgroundImage != null
                  ? <div class="thumbnail" style={{ backgroundImage }} />
                  : null
              }
            </div>
            <div class="file_name">{getFriendlyFileName(props.file.name)}</div>
          </div>
        </div>
      );
    }
  }
});