import { createStore } from "vuex"
import API from "../utils/API"
import {
  getCurPath,
  joinFileURL,
  popURL,
  normalizeURL,
  getLastDirName,
  getFriendlyFileName
} from "../utils/URL";
import { DirInfo } from "../jsgen/DirInfo";
import { File } from "../jsgen/File";

type HistoryState = {
  rootDir: string;
}

type NavData = {
  contextPath: string;
  isFile?: boolean;
  isForwardNav?: boolean;
}

export default createStore({
  state: {
    rootDir: "/",
    curDir: "/",
    curDirInfo: null as DirInfo | null,
    title: "",
  },
  mutations: {
    setRootDir(state, rootDir: string): void {
      state.rootDir = rootDir;
    },
    setCurDir(state, payload: NavData): void {
      state.curDir = payload.contextPath;
      const newURL = normalizeURL(payload.contextPath, payload.isFile);
      if (payload.isFile === true) {
        window.location.href = newURL;
        return;
      }

      const lastDirName = getLastDirName(payload.contextPath);
      const title = getFriendlyFileName(lastDirName);
      document.title = title;
      state.title = title;

      if (payload.isForwardNav === true) {
        window.history.pushState(
          { rootDir: state.rootDir } as HistoryState,
          lastDirName,
          newURL,
        );
      }
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
      context.commit("setRootDir", historyState?.rootDir ?? getCurPath());
      context.dispatch("updateDir", { contextPath: getCurPath() } as NavData);

      window.addEventListener("popstate", (_: Event) => {
        context.dispatch(
          "updateDir",
          { contextPath: getCurPath() } as NavData,
        );
      });
    },
    updateDir(context, payload: NavData): void {
      context.commit("setCurDir", payload);
      if (payload.isFile == null || !payload.isFile) {
        context.dispatch("fetchCurDir");
      }
    },
    async fetchCurDir(context): Promise<void> {
      const dirInfo = await API.genDirInfo(context.state.curDir);
      context.commit("setCurDirInfo", dirInfo);
    },
    selectFile(context, file: File): void {
      const newContextPath = joinFileURL(context.state.curDir, file);
      context.dispatch(
        "updateDir",
        {
          contextPath: newContextPath,
          isFile: file.is_file,
          isForwardNav: true,
        } as NavData,
      );
    },
    popDir(context): void {
      const newContextPath = popURL(context.state.curDir);
      context.dispatch(
        "updateDir",
        { contextPath: newContextPath, isForwardNav: true } as NavData,
      );
    }
  },
  modules: {
  }
})
