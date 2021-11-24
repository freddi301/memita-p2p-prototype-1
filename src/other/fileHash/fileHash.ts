import isElectron from "is-electron";

export async function fileHash(file: { type: "path"; path: string } | { type: "file"; file: File }): Promise<string> {
  if (isElectron() && file.type === "path") {
    const { fileHashRenderer } = await import("./electron/renderer");
    return fileHashRenderer(file.path);
  } else if (file.type === "file") {
    const { fileHashClient } = await import("./websocket/client");
    return fileHashClient(file.file);
  } else {
    throw new Error();
  }
}
