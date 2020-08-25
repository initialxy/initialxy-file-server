import { createStore } from "vuex"
import API from "../utils/API"
import { DirInfo } from "../jsgen/DirInfo";

export default createStore({
  state: {
    rootDir: "/",
    curDir: "/",
    curDirInfo: null as DirInfo | null,
  },
  getters: {
    curDirInfo: state => state.curDirInfo,
  },
  mutations: {
    setRootDir(state, rootDir: string): void {
      state.rootDir = rootDir;
      state.curDir = rootDir;
    },
    setCurDirInfo(state, dirInfo: DirInfo): void {
      state.curDirInfo = dirInfo;
    },
  },
  actions: {
    initRootDir(context): void {
      let contextPath = window.location.pathname;
      if (contextPath.startsWith("/p/")) {
        contextPath = contextPath.substring(2);
      }
      context.commit('setRootDir', contextPath);
      context.dispatch('fetchCurDir');
    },
    async fetchCurDir(context): Promise<void> {
      const dirInfo = await API.genDirInfo(context.state.curDir);
      context.commit("setCurDirInfo", dirInfo);
    }
  },
  modules: {
  }
})
