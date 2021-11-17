export function selectFiles() {
  return new Promise<Array<string>>((resolve, reject) => {
    window.rendererIpc.send("select-files", {});
    const unsubscribe = window.rendererIpc.subscribe("select-files", (filesPaths) => {
      resolve(filesPaths);
      unsubscribe();
    });
  });
}
