import isElectron from "is-electron";

export async function selectFiles(): Promise<
  Array<{ name: string; src: { type: "path"; path: string } | { type: "file"; file: File } }>
> {
  if (isElectron()) {
    const { selectFilesRenderer } = await import("./electron/renderer");
    return selectFilesRenderer();
  } else {
    const { selectFilesWebsocket } = await import("./websocket/client");
    return selectFilesWebsocket();
  }
}
