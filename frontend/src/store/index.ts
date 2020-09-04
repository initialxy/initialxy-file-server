import { createStore } from "vuex"
import { API, getCurPath, joinFileURL, popURL } from "../utils/API"
import { DirInfo } from "../jsgen/DirInfo";
import { File } from "../jsgen/File";

type HistoryState = {
  rootDir: string;
}

export default createStore({
  state: {
    rootDir: "/",
    curDir: "/",
    curDirInfo: null as DirInfo | null,
  },
  mutations: {
    setRootDir(state, rootDir: string): void {
      state.rootDir = rootDir;
    },
    setCurDir(state, curDir: string): void {
      state.curDir = curDir;
    },
    setCurDirInfo(state, dirInfo: DirInfo): void {
      state.curDirInfo = dirInfo;
    },
  },
  getters: {
    canPopDir(state): boolean {
      return state.curDir !== "/" && state.curDir !== state.rootDir;
    }
  },
  actions: {
    initRootDir(context): void {
      const historyState = window.history.state as HistoryState | undefined;
      context.commit(
        "setRootDir",
        historyState != null ? historyState.rootDir : getCurPath(),
      );
      context.dispatch("updateCurDir");

      window.addEventListener("popstate", (_: Event) => {
        context.dispatch("updateCurDir");
      });
    },
    updateCurDir(context): void {
      context.commit("setCurDir", getCurPath());
      context.dispatch("fetchCurDir");
    },
    async fetchCurDir(context): Promise<void> {
      const dirInfo = await API.genDirInfo(context.state.curDir);
      context.commit("setCurDirInfo", dirInfo);
    },
    selectFile(context, file: File): void {
      const newContextPath = joinFileURL(context.state.curDir, file);
      if (file.is_file) {
        window.location.href = newContextPath;
        return;
      }
      window.history.pushState(
        { rootDir: context.state.rootDir } as HistoryState,
        file.name,
        newContextPath,
      );
      context.dispatch("updateCurDir");
    },
    popDir(context): void {
      const newContextPath = popURL(context.state.curDir);
      window.history.pushState(
        { rootDir: context.state.rootDir } as HistoryState,
        "",
        newContextPath,
      );
      context.dispatch("updateCurDir");
    }
  },
  modules: {
  }
})
