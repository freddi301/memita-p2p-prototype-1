export function fileHashRenderer(path: string) {
  return new Promise<string>((resolve) => {
    window.rendererIpc.send("file-hash", path);
    const unsubscribe = window.rendererIpc.subscribe("file-hash", (response) => {
      if (response.path === path) {
        resolve(response.hash);
        unsubscribe();
      }
    });
  });
}
