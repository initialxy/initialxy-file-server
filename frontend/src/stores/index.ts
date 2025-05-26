import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import API from '../utils/API'
import {
  getCurPath,
  joinFileURL,
  popURL,
  normalizeURL,
  getLastDirName,
  getFriendlyFileName,
} from '../utils/URL'
import { DirInfo } from '../jsgen/DirInfo'
import { File } from '../jsgen/File'
import { chunk } from '../utils/Misc'

const MAX_API_BATCH = 5

type HistoryState = {
  rootDir: string
}

type NavData = {
  contextPath: string
  isFile?: boolean
  isForwardNav?: boolean
}

type ThumbnailPair = [string, string | null]

type CurDirInfo = {
  baseDir: string
  dirInfo: DirInfo
}

function getVisitedFromStorage(): Set<string> {
  const visited: { [key: string]: boolean } = JSON.parse(
    window.localStorage.getItem('visited') ?? '{}',
  )
  return new Set(Object.keys(visited))
}

function putVisitedToStorage(visited: Set<string>): void {
  const obj: { [key: string]: boolean } = {}
  for (const v of visited) {
    obj[v] = true
  }
  window.localStorage.setItem('visited', JSON.stringify(obj))
}

export const useStore = defineStore('main', () => {
  // State
  const rootDir = ref('/')
  const curDir = ref('/')
  const curDirInfo = ref<CurDirInfo | null>(null)
  const title = ref('')
  const thumbnails = reactive(new Map<string, string | null>())
  const shouldBlockScreen = ref(false)
  const visited = ref(getVisitedFromStorage())
  const isForwardNav = ref(false)
  const searchQuery = ref('')

  // Getters
  const canPopDir = computed(() => {
    return curDir.value !== '/' && curDir.value !== rootDir.value
  })

  const displayContent = computed(() => {
    if (curDirInfo.value == null) {
      return []
    }
    if (searchQuery.value.trim() === '') {
      return curDirInfo.value.dirInfo.contents
    }
    return curDirInfo.value.dirInfo.contents.filter(
      (file) => file.name.toLowerCase().indexOf(searchQuery.value.trim().toLowerCase()) !== -1,
    )
  })

  // Actions
  function setRootDir(newRootDir: string) {
    rootDir.value = newRootDir
  }

  function setCurDir(navData: NavData) {
    isForwardNav.value = !!navData.isForwardNav
    const newURL = normalizeURL(navData.contextPath, navData.isFile)
    if (navData.isFile === true) {
      shouldBlockScreen.value = true
      window.location.href = newURL
      return
    }

    shouldBlockScreen.value = false
    curDir.value = navData.contextPath
    const lastDirName = getLastDirName(navData.contextPath)
    const pageTitle = getFriendlyFileName(lastDirName)
    document.title = pageTitle
    title.value = pageTitle

    if (navData.isForwardNav === true) {
      window.history.pushState({ rootDir: rootDir.value } as HistoryState, lastDirName, newURL)
    }
  }

  function setCurDirInfo(dirInfo: CurDirInfo) {
    curDirInfo.value = dirInfo
    searchQuery.value = ''
  }

  function addThumbnails(thumbnailPairs: ThumbnailPair[]) {
    for (const pair of thumbnailPairs) {
      thumbnails.set(pair[0], pair[1])
    }
  }

  function resetThumbnails() {
    thumbnails.clear()
  }

  function saveVisited(contextPath: string) {
    if (!visited.value.has(contextPath)) {
      visited.value.add(contextPath)
      putVisitedToStorage(visited.value)
    }
  }

  function resetBlockScreen() {
    shouldBlockScreen.value = false
  }

  // Main actions
  function initRootDir() {
    const historyState = window.history.state as HistoryState | undefined
    setRootDir(historyState?.rootDir ?? getCurPath())
    updateDir({ contextPath: getCurPath() } as NavData)

    window.addEventListener('popstate', (_: Event) => {
      updateDir({ contextPath: getCurPath() } as NavData)
    })

    // On some platforms, back will restore page state instead of reload.
    // Reset block screen when page becomes visible again after closing video.
    window.addEventListener('pageshow', (_: Event) => {
      resetBlockScreen()
    })
  }

  function updateDir(navData: NavData) {
    if (curDir.value === navData.contextPath && curDirInfo.value != null) {
      return
    }
    saveVisited(navData.contextPath)
    setCurDir(navData)
    if (navData.isFile == null || !navData.isFile) {
      fetchCurDir()
    }
  }

  async function fetchCurDir() {
    const baseDir = curDir.value
    const dirInfo = await API.genDirInfo(baseDir)
    setCurDirInfo({ baseDir, dirInfo } as CurDirInfo)
    // Clear the thumbnail map to prevent it from growing indefinitely. API is
    // always memoized with a LRU cache. We won't usually end up with a
    // refetch.
    resetThumbnails()
    fetchThumbnails(dirInfo.contents)
  }

  function selectFile(file: File) {
    const newContextPath = joinFileURL(curDir.value, file)
    updateDir({
      contextPath: newContextPath,
      isFile: file.is_file,
      isForwardNav: true,
    } as NavData)
  }

  function popDir() {
    const newContextPath = popURL(curDir.value)
    updateDir({ contextPath: newContextPath, isForwardNav: true } as NavData)
  }

  function goToRoot() {
    updateDir({ contextPath: rootDir.value, isForwardNav: true } as NavData)
  }

  async function fetchThumbnails(files: File[]) {
    const contextPaths = files
      .map((f) => joinFileURL(curDir.value, f))
      .filter((p) => !thumbnails.has(p))
    for (const c of chunk(contextPaths, MAX_API_BATCH)) {
      const thumbnailsData = await Promise.all(
        c.map(async (p) => {
          const thumbnail = await API.genThumbnail(p)
          return [p, thumbnail.thumbnail_absolute_path ?? null] as ThumbnailPair
        }),
      )
      addThumbnails(thumbnailsData)
    }
  }

  function updateSearchQuery(newSearchQuery: string) {
    searchQuery.value = newSearchQuery
  }

  return {
    // State
    rootDir,
    curDir,
    curDirInfo,
    title,
    thumbnails,
    shouldBlockScreen,
    visited,
    isForwardNav,

    // Getters
    canPopDir,
    displayContent,

    // Actions
    setRootDir,
    setCurDir,
    setCurDirInfo,
    addThumbnails,
    resetThumbnails,
    saveVisited,
    resetBlockScreen,
    initRootDir,
    updateDir,
    fetchCurDir,
    selectFile,
    popDir,
    goToRoot,
    fetchThumbnails,
    updateSearchQuery,
  }
})
