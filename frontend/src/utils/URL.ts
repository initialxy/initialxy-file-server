import { File } from "../jsgen/File";

const ROOT = process.env.NODE_ENV === "development"
  ? "http://localhost:8000/"
  : "/";

export function getDirEndpoint(contextPath: string): string {
  return ROOT + "d" + contextPath;
}

export function normalizeURL(curContextPath: string, isFile = false): string {
  return (isFile ? ROOT : "/") + "f" +
    (curContextPath !== "" ? curContextPath : "/");
}

export function joinFileURL(curContextPath: string, file: File): string {
  const sep = curContextPath.endsWith("/") ? "" : "/";
  return curContextPath + sep + encodeURI(file.name);
}

export function popURL(curContextPath: string): string {
  const segs = curContextPath.split("/");
  const newContextPath = segs.slice(0, -1).join("/");
  return newContextPath !== "" ? newContextPath : "/";
}

export function getLastDirName(curContextPath: string): string {
  const segs = curContextPath.split("/");
  const last = segs.slice(-1);
  return last.length > 0 ? decodeURI(last[0]) : "";
}

export function getCurPath(): string {
  let contextPath = window.location.pathname;
  if (contextPath.startsWith("/f/")) {
    contextPath = contextPath.substring(2);
  }
  return contextPath;
}