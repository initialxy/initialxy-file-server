struct File {
  1: required bool is_file,
  2: required string name,
}

struct DirInfo {
  1: required list<File> contents,
  2: optional string thumbnail_absolute_path,
}

struct ItemThumbnail {
  1: optional string thumbnail_absolute_path,
}