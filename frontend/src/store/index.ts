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
import { chunk } from "../utils/Misc";

const MAX_API_BATCH = 5;

type HistoryState = {
  rootDir: string;
}

type NavData = {
  contextPath: string;
  isFile?: boolean;
  isForwardNav?: boolean;
}

type ThumbnailPair = [string, string | null];

type CurDirInfo = {
  baseDir: string;
  dirInfo: DirInfo;
}

function getVisitedFromStorage(): Set<string> {
  const visited: {[key: string]: boolean} = JSON.parse(
    window.localStorage.getItem("visited") ?? "{}",
  );
  return new Set(Object.keys(visited));
}

function putVisitedToStorage(visited: Set<string>): void {
  const obj: {[key: string]: boolean} = {};
  for(const v of visited) {
    obj[v] = true;
  }
  window.localStorage.setItem("visited", JSON.stringify(obj));
}

export default createStore({
  state: {
    rootDir: "/",
    curDir: "/",
    curDirInfo: null as CurDirInfo | null,
    title: "",
    thumbnails: new Map<string, string | null>(),
    shouldBlockScreen: false,
    visited: getVisitedFromStorage(),
  },
  mutations: {
    setRootDir(state, rootDir: string): void {
      state.rootDir = rootDir;
    },
    setCurDir(state, navData: NavData): void {
      const newURL = normalizeURL(navData.contextPath, navData.isFile);
      if (navData.isFile === true) {
        state.shouldBlockScreen = true;
        window.location.href = newURL;
        return;
      }

      state.shouldBlockScreen = false;
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
    setCurDirInfo(state, curDirInfo: CurDirInfo): void {
      state.curDirInfo = curDirInfo;
    },
    addThumbnails(state, thumbnailPairs: ThumbnailPair[]): void {
      for (const pair of thumbnailPairs) {
        state.thumbnails.set(
          pair[0],
          pair[1],
        );
      }
    },
    resetThumbnails(state): void {
      state.thumbnails.clear();
    },
    saveVisited(state, contextPath: string): void {
      state.visited.add(contextPath);
      putVisitedToStorage(state.visited);
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
      context.commit("saveVisited", navData.contextPath);
      context.commit("setCurDir", navData);
      if (navData.isFile == null || !navData.isFile) {
        context.dispatch("fetchCurDir");
      }
    },
    async fetchCurDir(context): Promise<void> {
      const baseDir = context.state.curDir;
      const dirInfo = await API.genDirInfo(baseDir);
      context.commit("setCurDirInfo", {baseDir, dirInfo} as CurDirInfo);
      // Clear the thumbnail map to prevent it from growing indefinitely. API is
      // always memoized with a LRU cache. We won't usually end up with a
      // refetch.
      context.commit("resetThumbnails", dirInfo);
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
      for (const c of chunk(contextPaths, MAX_API_BATCH)) {
        const thumbnails = await Promise.all(c.map(async p => {
          const thumbnail = await API.genThumbnail(p);
          return [p, thumbnail.thumbnail_absolute_path ?? null] as ThumbnailPair;
        }));
        context.commit("addThumbnails", thumbnails);
      }
    },
  },
  modules: {
  }
})
