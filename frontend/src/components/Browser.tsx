import "./Browser.css";
import { defineComponent, PropType } from "vue";
import { File } from "../jsgen/File";
import { joinFileURL } from "../utils/URL";
import ItemComp from "./FileComp";

export default defineComponent({
  name: "Browser",
  props: {
    items: { type: Array as PropType<File[]>, required: true },
    baseDir: { type: String, required: true },
    onSelect: Function as PropType<(file: File) => void>,
  },
  setup(props) {
    return () => (
      <div class="Browser">
        {Array.from(props.items).map(i => (
          <ItemComp
            key={joinFileURL(props.baseDir, i)}
            file={i}
            onSelect={props.onSelect}
          />
        ))}
      </div>
    );
  }
});