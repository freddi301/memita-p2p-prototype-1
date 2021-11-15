import { store } from "./domain";
import { readFile, writeFile, mkdir } from "fs";

if (!process.env["USER_FOLDER"]) throw new Error(`USER_FOLDER not specified`);
const userFolderPath = `user-data/${process.env["USER_FOLDER"]}`;
const userFilePath = `${userFolderPath}/dump.json`;
mkdir(userFolderPath, { recursive: true }, (err) => {
  if (err) throw err;
});
readFile(userFilePath, (error, data) => {
  if (!error) {
    try {
      store.currentState = JSON.parse(data.toString());
    } catch (error) {}
  }
  persist();
});
function persist() {
  writeFile(userFilePath, JSON.stringify(store.currentState, null, 2), () => {
    setTimeout(persist, 1000);
  });
}
