struct Item {
  1: required bool is_file,
  2: required string name,
}

struct DirInfo {
  1: required list<Item> contents,
  2: optional string thumbnail_absolute_path,
  3: optional string theme_color,
}

struct ItemThumbnail {
  1: optional string thumbnail_absolute_path,
}