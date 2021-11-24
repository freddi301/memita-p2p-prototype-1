export function selectFilesWebsocket() {
  return new Promise<Array<{ name: string; src: { type: "file"; file: File } }>>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.addEventListener("change", (event) => {
      const files = (event.target as HTMLInputElement)?.files;
      if (files) {
        resolve(
          Array.from(files).map((file) => {
            return {
              name: file.name,
              src: { type: "file", file },
            };
          })
        );
      } else {
        resolve([]);
      }
    });
    input.click();
  });
}
