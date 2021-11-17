export function fileSrcRenderer(hash: string) {
  return new Promise<string>((resolve) => {
    window.rendererIpc.send("file-src", hash);
    const unsubscribe = window.rendererIpc.subscribe("file-src", (reponse) => {
      if (reponse.hash === hash) {
        resolve(reponse.src);
        unsubscribe();
      }
    });
  });
}
