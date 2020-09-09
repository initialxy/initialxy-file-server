from utils.config import get_config
from utils.thrift import serialize_bin
from utils.tools import get_app_abs_path
import os
import pygen
import tornado.web
import re

CONFIG = get_config()
INDEX_FILE = "../frontend/dist/index.html"
DIR_THUMBNAIL_FILE = "thumbnail.jpg"
THUMBNAILS_DIR = "__thumbnails"


class BaseHandler(tornado.web.RequestHandler):

  def set_default_headers(self) -> None:
    self.set_header("Content-Type", "application/json")
    if CONFIG.is_debug:
      self.set_header("Access-Control-Allow-Origin", "*")
      self.set_header("Access-Control-Allow-Headers", "x-requested-with")
      self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')


class DirHandler(BaseHandler):
  """
  Restful API endpoint to query directory information.
  """

  async def get(self, fpath: str) -> None:
    abs_path = os.path.abspath(os.path.join(CONFIG.root_dir, fpath))
    if not os.path.isdir(abs_path):
      raise tornado.web.HTTPError(404)

    files = [
      pygen.types.File(os.path.isfile(os.path.join(abs_path, i)), i)
      for i in os.listdir(abs_path)
    ]
    visible_files = [
      f
      for f in files
      if (f.name != DIR_THUMBNAIL_FILE or not f.is_file) and
        (f.name != THUMBNAILS_DIR or f.is_file)
    ]
    visible_files.sort(key=lambda f: ("f" if f.is_file else "d") + f.name)

    dir_info = pygen.types.DirInfo(visible_files)
    self.write(serialize_bin(dir_info))
    self.finish()


class ThumbnailHandler(BaseHandler):
  """
  Restful API endpoint to query thumbnail. Try to generate if missing.
  """

  async def get(self, fpath: str) -> None:
    abs_path = os.path.abspath(os.path.join(CONFIG.root_dir, fpath))
    thumbnail_file_path = os.path.join(abs_path, DIR_THUMBNAIL_FILE)
    if os.path.isfile(abs_path):
      dirname, basename = os.path.split(abs_path)
      thumbnail_file_name = re.sub(r"\.\w+$", ".jpg", basename)
      thumbnail_file_path = os.path.join(
        dirname,
        THUMBNAILS_DIR,
        thumbnail_file_name,
      )

    item_thumbnail = pygen.types.Thumbnail(
      "/" + os.path.relpath(thumbnail_file_path, CONFIG.root_dir)
      if os.path.exists(thumbnail_file_path) else None,
    )
    self.write(serialize_bin(item_thumbnail))
    self.finish()


class FileHandler(tornado.web.StaticFileHandler):
  """
  If destination is not a file, serve index.html, otherwise serve file.
  """

  async def get(self, path: str, include_body: bool = True) -> None:
    file_path = os.path.join(self.root, path)
    if os.path.isfile(file_path):
      await super().get(path, include_body)
    else:
      self.absolute_path = os.path.abspath(os.path.join(
        os.path.dirname(__file__),
        INDEX_FILE,
      ))
      f = open(self.absolute_path)
      contents = f.read()
      f.close()
      self.set_header("Content-Type", "text/html")
      self.write(contents)
      self.finish()
