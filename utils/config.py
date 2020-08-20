from __future__ import annotations
from dataclasses import dataclass
from functools import lru_cache
from typing import Type, TypeVar, ClassVar, Optional
import json
import os
import sys


CONFIG_FILE_NAME = "appconfig.json"
IS_DEBUG = "--debug" in sys.argv


@dataclass
class Config:
  root_dir: str
  is_debug: bool


@lru_cache(maxsize=1)
def get_config() -> Config:
  """
  Parse appconfig.json and put it into the Config dataclass. As much as I'd like
  to use Thrift, TSimpleJSONProtocol is write only and TJSONProtocol is not
  humanly readable. So we have to do some old school parsing here.
  """

  f = open(os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    CONFIG_FILE_NAME,
  ))
  contents = f.read()
  f.close()
  config_dict = json.loads(contents)

  return Config(config_dict["root_dir"], IS_DEBUG)
