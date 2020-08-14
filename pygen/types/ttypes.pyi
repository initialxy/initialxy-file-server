from dataclasses import dataclass
from typing import *
@dataclass
class Item:
    is_file: bool
    name: str

@dataclass
class DirInfo:
    contents: List[Item]
    thumbnail_absolute_path: Optional[str] = None
    theme_color: Optional[str] = None

@dataclass
class ItemThumbnail:
    thumbnail_absolute_path: Optional[str] = None
