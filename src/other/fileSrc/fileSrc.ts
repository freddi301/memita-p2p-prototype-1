import isElectron from "is-electron";

export async function fileSrc(hash: string): Promise<string> {
  if (isElectron()) {
    const { fileSrcRenderer } = await import("./electron/renderer");
    return fileSrcRenderer(hash);
  } else {
    const { fileSrcWebsocket } = await import("./websocket/client");
    return fileSrcWebsocket(hash);
  }
}
