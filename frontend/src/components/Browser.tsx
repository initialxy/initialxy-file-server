import "./Browser.css";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { File } from "../jsgen/File";
import { joinFileURL } from "../utils/URL";
import ItemComp from "./FileComp";
import store from "../store";

const MIN_CHILD_WIDTH_EM = 8;
const CHILD_MARGIN_EM = 2;

export default defineComponent({
  name: "Browser",
  setup() {
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

    const onSelect = (file: File) => store.dispatch("selectFile", file);

    return () => {
      const sizePx = `${childSize.value}px`;
      const files = store.state.curDirInfo?.baseDir === store.state.curDir
        ? store.state.curDirInfo?.dirInfo.contents ?? []
        : [];
      const thumbnails = store.state.thumbnails;
      return (
        <div class="Browser">
          {childSize.value > 0 ? Array.from(files).map(i => (
            <ItemComp
              class="child"
              key={joinFileURL(store.state.curDir, i)}
              baseDir={store.state.curDir}
              file={i}
              thumbnail={thumbnails.get(joinFileURL(store.state.curDir, i))}
              onSelect={onSelect}
              isVisited={
                store.state.visited.has(joinFileURL(store.state.curDir, i))
              }
              style={{ height: sizePx, width: sizePx }}
            />
          )) : null}
          <div class="clearfix" />
        </div>
      );
    }
  }
});