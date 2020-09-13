from cv2 import cv2
from numpy import ndarray
from utils.config import get_config
from utils.thrift import serialize_bin
from utils.tools import get_app_abs_path
import mimetypes
import os
import pygen
import re
import tornado.web

CONFIG = get_config()
INDEX_FILE = "../frontend/dist/index.html"
DIR_THUMBNAIL_FILE = "thumbnail.jpg"
THUMBNAILS_DIR = "__thumbnails"


class BaseEndpointHandler(tornado.web.RequestHandler):

  def set_default_headers(self) -> None:
    self.set_header("Content-Type", "application/octet-stream")
    if CONFIG.is_debug:
      self.set_header("Access-Control-Allow-Origin", "*")
      self.set_header("Access-Control-Allow-Headers", "x-requested-with")
      self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')


class DirHandler(BaseEndpointHandler):
  """
  Restful API endpoint to query directory information.
  """

  async def get(self, fpath: str) -> None:
    abs_path = os.path.abspath(os.path.join(CONFIG.root_dir, fpath))
    if not os.path.isdir(abs_path):
      raise tornado.web.HTTPError(404)

    files_raw = [
      (os.path.isfile(os.path.join(abs_path, i)), i)
      for i in os.listdir(abs_path)
    ]
    files = [
      pygen.types.File(
        is_file,
        name,
        mimetypes.guess_type(name)[0] if is_file else None,
      )
      for is_file, name in files_raw
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


class ThumbnailHandler(BaseEndpointHandler):
  """
  Restful API endpoint to query thumbnail. Try to generate if missing.
  """

  async def get(self, fpath: str) -> None:
    abs_path = os.path.abspath(os.path.join(CONFIG.root_dir, fpath))
    if os.path.isfile(abs_path):
      dirname, basename = os.path.split(abs_path)
      thumbnail_file_name = re.sub(r"\.\w+$", ".jpg", basename)
      thumbnail_file_path = os.path.join(
        dirname,
        THUMBNAILS_DIR,
        thumbnail_file_name,
      )

      mimetype, _ = mimetypes.guess_type(abs_path)
      file_type = mimetype.split("/")[0] if mimetype is not None else None
      if (
        not os.path.exists(thumbnail_file_path) and
        file_type in {"video", "image"}
      ):
        try:
          thumbnail_dir = os.path.join(dirname, THUMBNAILS_DIR)
          if not os.path.exists(thumbnail_dir):
            os.mkdir(thumbnail_dir)
          if file_type == "video":
            self.create_video_thumbnail(abs_path, thumbnail_file_path)
          else:
            self.create_image_thumbnail(abs_path, thumbnail_file_path)
        except:
          # If OpenCV can't do it, then just leave it empty
          pass
    else:
      thumbnail_file_path = os.path.join(abs_path, DIR_THUMBNAIL_FILE)

    item_thumbnail = pygen.types.Thumbnail(
      "/" + os.path.relpath(thumbnail_file_path, CONFIG.root_dir)
      if os.path.exists(thumbnail_file_path) else None,
    )
    self.write(serialize_bin(item_thumbnail))
    self.finish()

  def get_extention(self, abs_path: str) -> str:
    m = re.match(r".*\.(\w+)$", abs_path)
    return (m.group(1) if m else "").lower()

  def create_video_thumbnail(self, abs_path: str, out_path: str) -> bool:
    vc = cv2.VideoCapture(abs_path)
    frame_cnt = int(vc.get(cv2.CAP_PROP_FRAME_COUNT))
    if not vc.isOpened() or frame_cnt == 0:
      return False
    vc.set(cv2.CAP_PROP_POS_FRAMES, (frame_cnt - 1) // 5)
    is_successful, frame = vc.read()
    if not is_successful:
      return False

    self.resize_and_save_image(frame, out_path)
    return True

  def create_image_thumbnail(self, abs_path: str, out_path: str) -> None:
    image = cv2.imread(abs_path)
    self.resize_and_save_image(image, out_path)

  def resize_and_save_image(self, image: ndarray, out_path: str) -> None:
    height, width, _ = image.shape
    if height > 300:
      height, width = 300, int(300 / height * width)
    image = cv2.resize(image, (width, height))
    cv2.imwrite(out_path, image)


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
