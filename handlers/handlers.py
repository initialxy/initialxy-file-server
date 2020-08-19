from pygen.types.ttypes import Item, DirInfo, ItemThumbnail
from utils.config import get_config
from utils.thrift import serialize_json
from utils.tools import partition, get_app_abs_path
import os
import tornado.web

CONFIG = get_config()
INDEX_FILE = "frontend/dist/index.html"
DIR_THUMBNAIL_FILE = "thumbnail.jpg"
THUMBNAILS_DIR = "__thumbnails"

class DirHandler(tornado.web.RequestHandler):
  """
  Restful API endpoint to query directory information.
  """

  async def get(self, fpath: str) -> None:
    abs_path = os.path.abspath(os.path.join(CONFIG.root_dir, fpath))
    if not os.path.isdir(abs_path):
      raise tornado.web.HTTPError(404)

    items = [
      Item(os.path.isfile(os.path.join(abs_path, i)), i)
      for i in os.listdir(abs_path)
    ]
    hidden_items, visible_items = partition(
      items,
      lambda i: (
        i.name == DIR_THUMBNAIL_FILE and i.is_file or
        i.name == THUMBNAILS_DIR and not i.is_file
      ),
    )
    thumbnail_file = next(
      (i for i in hidden_items if i.name == DIR_THUMBNAIL_FILE),
      None,
    )
    thumbnail_abs_path = None
    if thumbnail_file:
      thumbnail_abs_path = os.path.join(abs_path, thumbnail_file.name)

    dir_info = DirInfo(
      visible_items,
      get_app_abs_path(thumbnail_abs_path) if thumbnail_abs_path else None,
      "", # TODO: theme_color
    )
    self.set_header("Content-Type", "application/json")
    self.write(serialize_json(dir_info))
    self.finish()


class ThumbnailHandler(tornado.web.RequestHandler):
  """
  Restful API endpoint to query thumbnail. Try to generate if missing.
  """

  async def get(self, fpath: str) -> None:
    item_thumbnail = ItemThumbnail('test_thumbnail.jpg')
    self.set_header("Content-Type", "application/json")
    self.write(serialize_json(item_thumbnail))
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
