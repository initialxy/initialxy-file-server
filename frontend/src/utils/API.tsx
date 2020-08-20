import { Buffer } from 'buffer';
import { TFramedTransport, TBinaryProtocol, TProtocol } from "thrift";
import { DirInfo } from "../jsgen/DirInfo";


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

export async function genDirInfo(dir: string): Promise<DirInfo> {
  const resp = await fetch(ROOT + "d/" + dir);
  const respArrayBuffer = await resp.arrayBuffer();
  return deserializeThrift(Buffer.from(respArrayBuffer), DirInfo);
}