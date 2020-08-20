from thrift.protocol.TBinaryProtocol import TBinaryProtocolFactory
from thrift.TSerialization import serialize


def serialize_bin(thrift_obj: object) -> bytes:
  return serialize(
    thrift_obj,
    protocol_factory=TBinaryProtocolFactory(),
  )