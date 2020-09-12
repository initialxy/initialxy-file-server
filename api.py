from handlers.handlers import DirHandler, ThumbnailHandler, FileHandler
from utils.config import get_config
import mimetypes
import os
import sys
import tornado.ioloop
import tornado.web

CONFIG = get_config()


def make_app() -> tornado.web.Application:
  return tornado.web.Application(
    [
      (r"/d/(.*)", DirHandler),
      (r"/t/(.*)", ThumbnailHandler),
      (r"/f/(.*)", FileHandler, {"path": CONFIG.root_dir}),
      (
        r"/(.*)",
        tornado.web.StaticFileHandler,
        {
          "path": os.path.join(os.path.dirname(__file__), "frontend/dist"),
          "default_filename": "index.html",
        },
      ),
    ],
    debug=CONFIG.is_debug
  )


if __name__ == "__main__":
  # Python 3.8 can correct guess m4v but not 3.7. So until Raspberry Pi OS gets
  # 3.8, keep this line here.
  mimetypes.add_type("video/mp4", ".m4v")
  app = make_app()
  app.listen(CONFIG.port)
  tornado.ioloop.IOLoop.current().start()
