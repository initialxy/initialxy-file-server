from handlers.handlers import DirHandler, ThumbnailHandler, FileHandler
from utils.config import get_config
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
  app = make_app()
  app.listen(8000)
  tornado.ioloop.IOLoop.current().start()
