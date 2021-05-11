import "./FileComp.css";
import { defineComponent, PropType } from "vue";
import { emptyFunc } from "../utils/Misc";
import { File } from "../jsgen/File";
import { first, clx } from "../utils/Misc";
import { getFriendlyFileName, normalizeURL, joinFileURL } from "../utils/URL";
import Image from "./Image";

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
    baseDir: { type: String, required: true },
    file: { type: Object as PropType<File>, required: true },
    thumbnail: String as PropType<string | null>,
    onSelect: Function as PropType<(file: File) => void>,
    isVisited: { type: Boolean, default: false },
  },
  setup(props) {
    const onClick = (e: Event) => {
      e.preventDefault();
      props.onSelect && props.onSelect(props.file);
    }

    return () => (
      <a
        class={clx({ "FileComp": true, "folder": !props.file.is_file })}
        onClick={onClick}
        onTouchstart={emptyFunc}
        href={normalizeURL(
          joinFileURL(props.baseDir, props.file),
          props.file.is_file,
        )}
      >
        <div class="inner">
          <div class="thumbnail_container">
            <div class={`icon fas ${getFileIconClass(props.file)}`} />
            {
              props.thumbnail != null
                ? <Image
                  class="thumbnail"
                  src={normalizeURL(props.thumbnail, true)}
                />
                : null
            }
          </div>
          <div class="file_name">
            {getFriendlyFileName(props.file.name)}
            {props.isVisited ? <div class="visited" /> : null}
          </div>
        </div>
      </a>
    );
  }
});