from typing import Callable, Iterable, List, TypeVar, Tuple
from utils.config import get_config
import os

T = TypeVar('T')

CONFIG = get_config()


def get_app_abs_path(p: str) -> str:
  """
  Local file abs path is different from app abs path. Normalize to app abs path.
  """

  root_dir_abs_path = os.path.abspath(CONFIG.root_dir)
  app_abs_path = (p[len(root_dir_abs_path) + 1:]
                  if p[0:len(root_dir_abs_path)] == root_dir_abs_path
                  else p)
  # Just in case we want to run it on Widnows. I'm not testing it though
  return "/" + "/".join(os.path.split(app_abs_path))
