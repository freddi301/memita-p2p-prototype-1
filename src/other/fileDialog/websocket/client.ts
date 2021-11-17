export function selectFilesWebsocket() {
  return new Promise<Array<{ name: string; src: string }>>((resolve) => {
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
              src: URL.createObjectURL(file),
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
