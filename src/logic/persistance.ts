import { store } from "./domain";
import { readFile, writeFile, mkdir } from "fs";
import path from "path";
import { userFolderPath } from "./userFolderPath";

const userFilePath = path.resolve(userFolderPath, "dump.json");
mkdir(userFolderPath, { recursive: true }, (err) => {
  if (err) throw err;
});
readFile(userFilePath, (error, data) => {
  if (!error) {
    try {
      store.currentState = JSON.parse(data.toString(), (key, value) => {
        if (value && value.Uint8Array) {
          return Buffer.from(value.Uint8Array, "base64");
        }
        return value;
      });
    } catch (error) {
      console.error("cannot load dump");
    }
  }
  persist();
});
function persist() {
  writeFile(
    userFilePath,
    JSON.stringify(
      store.currentState,
      (key, value) => {
        if (value instanceof Uint8Array) {
          return { Uint8Array: Buffer.from(value).toString("base64") };
        }
        return value;
      },
      2
    ),
    () => {
      setTimeout(persist, 1000);
    }
  );
}
