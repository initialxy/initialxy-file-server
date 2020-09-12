struct File {
  1: required bool is_file,
  2: required string name,
  3: optional string mimetype,
}

struct DirInfo {
  1: required list<File> contents,
}

struct Thumbnail {
  1: optional string thumbnail_absolute_path,
}