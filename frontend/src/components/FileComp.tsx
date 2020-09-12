import "./FileComp.css";
import { defineComponent, PropType } from "vue";
import { emptyFunc } from "../utils/Misc";
import { File } from "../jsgen/File";
import { first } from "../utils/Misc";
import { getFriendlyFileName, normalizeURL } from "../utils/URL";

function getFileIconClass(file: File): string {
  if (!file.is_file) {
    return "fa-folder";
  }
  const fileType = first(file.mimetype?.split("/"));
  switch (fileType) {
    case "image":
      return "fa-image";
    case "video":
      return "fa-play";
    case "audio":
      return "fa-headphones";
    case "text":
      return "fa-file-alt";
    case "application":
      return "fa-file-code";
  }
  return "fa-file";
}

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

    return () => {
      const backgroundImage = props.thumbnail != null
        ? `url("${normalizeURL(props.thumbnail, true)}")`
        : null;
      return (
        <div class="FileComp" onClick={onClick} onTouchstart={emptyFunc}>
          <div class="inner">
            <div class="thumbnail_container">
              <div class={`icon fas ${getFileIconClass(props.file)}`} />
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