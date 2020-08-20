from thriftpy2.protocol import TBinaryProtocolFactory
from thriftpy2.utils import serialize


def serialize_bin(thrift_obj: object) -> bytes:
  return bytes(serialize(
    thrift_obj,
    proto_factory=TBinaryProtocolFactory(),
  ))