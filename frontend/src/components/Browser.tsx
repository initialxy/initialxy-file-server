import "./Browser.css";
import { defineComponent, PropType, onMounted, onUnmounted, ref } from "vue";
import { File } from "../jsgen/File";
import { joinFileURL } from "../utils/URL";
import ItemComp from "./FileComp";

const MIN_CHILD_WIDTH_EM = 8;
const CHILD_MARGIN_EM = 1;

export default defineComponent({
  name: "Browser",
  props: {
    items: { type: Array as PropType<File[]>, required: true },
    baseDir: { type: String, required: true },
    onSelect: Function as PropType<(file: File) => void>,
  },
  setup(props) {
    const pxInEm = parseFloat(getComputedStyle(document.body).fontSize);
    const childSize = ref(0);
    const reComputeChildSize = () => {
      const windowWidth = window.innerWidth;
      const columns = Math.floor(
        (windowWidth - CHILD_MARGIN_EM * pxInEm) /
        ((MIN_CHILD_WIDTH_EM + CHILD_MARGIN_EM) * pxInEm),
      );
      childSize.value = Math.floor(
        (windowWidth - CHILD_MARGIN_EM * pxInEm) /
        columns,
      ) - CHILD_MARGIN_EM * pxInEm;
    }

    onMounted(() => {
      window.addEventListener("resize", reComputeChildSize);
      reComputeChildSize();
    });

    onUnmounted(() => {
      window.removeEventListener("resize", reComputeChildSize);
    });

    return () => (
      <div class="Browser">
        {Array.from(props.items).map(i => (
          <ItemComp
            class="child"
            key={joinFileURL(props.baseDir, i)}
            file={i}
            onSelect={props.onSelect}
            size={childSize.value}
          />
        ))}
        <div class="clearfix" />
      </div>
    );
  }
});