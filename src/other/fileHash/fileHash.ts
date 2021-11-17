import isElectron from "is-electron";

export async function fileHash(src: string): Promise<string> {
  if (isElectron()) {
    const { fileHashRenderer } = await import("./electron/renderer");
    return fileHashRenderer(src);
  } else {
    throw new Error("not implemented");
    // const { selectFilesWebsocket: selectFiles } = await import("./websocket/client");
    // return selectFiles();
  }
}
