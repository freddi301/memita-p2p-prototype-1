export function selectFiles() {
  return new Promise<Array<string>>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.addEventListener("change", (event) => {
      const files = (event.target as HTMLInputElement)?.files;
      if (files) {
        resolve(Array.from(files).map((file) => URL.createObjectURL(file)));
      } else {
        resolve([]);
      }
    });
    input.click();
  });
}
