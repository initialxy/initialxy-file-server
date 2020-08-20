const ROOT = process.env.NODE_ENV === "development"
  ? "http://localhost:8000/"
  : "/";

export async function genDirInfo(dir: string): Promise<string> {
  const resp = await fetch(ROOT + "d/" + dir);
  return resp.text();
}