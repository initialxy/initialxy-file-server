import { Buffer } from "buffer";
import { DirInfo } from "../jsgen/DirInfo";
import { getDirEndpoint } from "./URL";
import { TFramedTransport, TBinaryProtocol, TProtocol } from "thrift";
import Memoize from "./Memoize";

function deserializeThrift<T>(
  data: Buffer,
  thriftClass: { read(input: TProtocol): T },
): T {
  const trans = new TFramedTransport(data);
  const protocal = new TBinaryProtocol(trans);
  return thriftClass.read(protocal);
}

// In a class, because TypeScript doesn't let you use decorator on functions,
// but static functions in class is ok.
export default class API {
  @Memoize(100)
  static async genDirInfo(dir: string): Promise<DirInfo> {
    const resp = await fetch(getDirEndpoint(dir));
    const respArrayBuffer = await resp.arrayBuffer();
    return deserializeThrift(Buffer.from(respArrayBuffer), DirInfo);
  }
}