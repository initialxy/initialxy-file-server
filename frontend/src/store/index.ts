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

type ThumbnailPair = [string, string | null];

export default createStore({
  state: {
    rootDir: "/",
    curDir: "/",
    curDirInfo: null as DirInfo | null,
    title: "",
    thumbnails: new Map<string, string | null>(),
  },
  mutations: {
    setRootDir(state, rootDir: string): void {
      state.rootDir = rootDir;
    },
    setCurDir(state, navData: NavData): void {
      const newURL = normalizeURL(navData.contextPath, navData.isFile);
      if (navData.isFile === true) {
        window.location.href = newURL;
        return;
      }

      state.curDir = navData.contextPath;
      const lastDirName = getLastDirName(navData.contextPath);
      const title = getFriendlyFileName(lastDirName);
      document.title = title;
      state.title = title;

      if (navData.isForwardNav === true) {
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
    addThumbnails(state, thumbnailPairs: ThumbnailPair[]): void {
      for (const pair of thumbnailPairs) {
        state.thumbnails.set(
          pair[0],
          pair[1],
        );
      }
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
    updateDir(context, navData: NavData): void {
      context.commit("setCurDir", navData);
      if (navData.isFile == null || !navData.isFile) {
        context.dispatch("fetchCurDir");
      }
    },
    async fetchCurDir(context): Promise<void> {
      const dirInfo = await API.genDirInfo(context.state.curDir);
      context.commit("setCurDirInfo", dirInfo);
      context.dispatch("fetchThumbnails", dirInfo.contents);
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
    },
    async fetchThumbnails(context, files: File[]): Promise<void> {
      const contextPaths = files
        .map(f => joinFileURL(context.state.curDir, f))
        .filter(p => !context.state.thumbnails.has(p));
      const thumbnails = await Promise.all(contextPaths.map(async p => {
        const thumbnail = await API.genThumbnail(p);
        return [p, thumbnail.thumbnail_absolute_path ?? null] as ThumbnailPair;
      }));

      context.commit("addThumbnails", thumbnails);
    },
  },
  modules: {
  }
})
