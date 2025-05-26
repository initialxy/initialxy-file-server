import { Buffer } from 'buffer'
import { DirInfo } from '../jsgen/DirInfo'
import { Thumbnail } from '../jsgen/Thumbnail'
import { getDirEndpoint, getThumbnailEndpoint } from './URL'
import { TFramedTransport, TBinaryProtocol } from 'thrift'
import type { TProtocol } from 'thrift'
import Memoize from './Memoize'

function deserializeThrift<T>(data: Buffer, thriftClass: { read(input: TProtocol): T }): T {
  const trans = new TFramedTransport(data)
  const protocol = new TBinaryProtocol(trans)
  return thriftClass.read(protocol)
}

// In a class, because TypeScript doesn't let you use decorator on functions,
// but static functions in class is ok.
export default class API {
  @Memoize(100)
  static async genDirInfo(dir: string): Promise<DirInfo> {
    const resp = await fetch(getDirEndpoint(dir))
    const respArrayBuffer = await resp.arrayBuffer()
    return deserializeThrift(Buffer.from(respArrayBuffer), DirInfo)
  }

  @Memoize(500)
  static async genThumbnail(contextPath: string): Promise<Thumbnail> {
    const resp = await fetch(getThumbnailEndpoint(contextPath))
    const respArrayBuffer = await resp.arrayBuffer()
    return deserializeThrift(Buffer.from(respArrayBuffer), Thumbnail)
  }
}
