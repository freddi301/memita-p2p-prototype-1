import { store } from "./domain";
import { readFile, writeFile, mkdir } from "fs";
import path from "path";

const userFolderPath = process.env["USER_FOLDER"] || path.resolve();
const userFilePath = path.resolve(userFolderPath, "dump.json");
mkdir(userFolderPath, { recursive: true }, (err) => {
  if (err) throw err;
});
readFile(userFilePath, (error, data) => {
  if (!error) {
    try {
      store.currentState = JSON.parse(data.toString());
    } catch (error) {
      console.error("cannot load dump");
    }
  }
  persist();
});
function persist() {
  writeFile(userFilePath, JSON.stringify(store.currentState, null, 2), () => {
    setTimeout(persist, 1000);
  });
}