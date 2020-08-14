from thrift.protocol.TJSONProtocol import TJSONProtocolFactory
from thrift.TSerialization import serialize


def serialize_json(thrift_obj: object) -> str:
  return str(serialize(
    thrift_obj,
    protocol_factory=TJSONProtocolFactory(),
  ))