import { File } from "../jsgen/File";

const ROOT = process.env.NODE_ENV === "development"
  ? "http://localhost:8000/"
  : "/";

export function getDirEndpoint(contextPath: string): string {
  return ROOT + "d" + contextPath;
}

export function normalizeURL(contextPath: string, isFile = false): string {
  return (isFile ? ROOT : "/") + "f" +
    (contextPath !== "" ? contextPath : "/");
}

export function joinFileURL(contextPath: string, file: File): string {
  const sep = contextPath.endsWith("/") ? "" : "/";
  return contextPath + sep + encodeURI(file.name);
}

export function popURL(contextPath: string): string {
  const segs = contextPath.split("/");
  const newContextPath = segs.slice(0, -1).join("/");
  return newContextPath !== "" ? newContextPath : "/";
}

export function getLastDirName(contextPath: string): string {
  const segs = contextPath.split("/");
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

export function getFriendlyFileName(name: string): string {
  name = name.replace(/\.\w+$/, "").replace(/_/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}