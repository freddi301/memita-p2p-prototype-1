export function selectFilesRenderer() {
  return new Promise<Array<{ name: string; src: { type: "path"; path: string } }>>((resolve, reject) => {
    window.rendererIpc.send("select-files", {});
    const unsubscribe = window.rendererIpc.subscribe("select-files", (filesPaths) => {
      resolve(filesPaths);
      unsubscribe();
    });
  });
}
