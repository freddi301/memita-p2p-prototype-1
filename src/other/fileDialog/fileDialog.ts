import isElectron from "is-electron";

export async function selectFiles(): Promise<Array<string>> {
  if (isElectron()) {
    const { selectFiles } = await import("./electron/renderer");
    return selectFiles();
  } else {
    const { selectFiles } = await import("./websocket/client");
    return selectFiles();
  }
}
