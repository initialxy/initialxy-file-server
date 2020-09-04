import { Buffer } from "buffer";
import { DirInfo } from "../jsgen/DirInfo";
import { File } from "../jsgen/File";
import { TFramedTransport, TBinaryProtocol, TProtocol } from "thrift";
import Memoize from "./Memoize";


const ROOT = process.env.NODE_ENV === "development"
  ? "http://localhost:8000/"
  : "/";

function deserializeThrift<T>(
  data: Buffer,
  thriftClass: { read(input: TProtocol): T },
): T {
  const trans = new TFramedTransport(data);
  const protocal = new TBinaryProtocol(trans);
  return thriftClass.read(protocal);
}

function normalizeURL(curContextPath: string, isFile = false): string {
  return (isFile ? ROOT : "/") + "f" +
    (curContextPath !== "" ? curContextPath : "/");
}

export function joinFileURL(curContextPath: string, file: File): string {
  const sep = curContextPath.endsWith("/") ? "" : "/";
  const newContextPath = curContextPath + sep + encodeURI(file.name);
  return normalizeURL(newContextPath, file.is_file);
}

export function popURL(curContextPath: string): string {
  const segs = curContextPath.split("/");
  return normalizeURL(segs.slice(0, -1).join("/"));
}

export function getCurPath(): string {
  let contextPath = window.location.pathname;
  if (contextPath.startsWith("/f/")) {
    contextPath = contextPath.substring(2);
  }
  return contextPath;
}

// In a class, because TypeScript doesn't let you use decorator on functions,
// but static functions in class is ok.
export class API {
  @Memoize(100)
  static async genDirInfo(dir: string): Promise<DirInfo> {
    const resp = await fetch(ROOT + "d" + dir);
    const respArrayBuffer = await resp.arrayBuffer();
    return deserializeThrift(Buffer.from(respArrayBuffer), DirInfo);
  }
}