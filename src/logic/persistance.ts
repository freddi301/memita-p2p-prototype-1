import { store } from "./domain";
import { readFile, writeFile, mkdir } from "fs";
import path from "path";
import { userFolderPath } from "./folderPaths";
import { JSONB } from "../other/JSONB";

const userFilePath = path.resolve(userFolderPath, "dump.json");
mkdir(userFolderPath, { recursive: true }, (err) => {
  if (err) throw err;
});
readFile(userFilePath, (error, data) => {
  if (!error) {
    try {
      store.publish(JSONB.parse(data.toString()) as any);
    } catch (error) {
      console.error("cannot load dump");
    }
  }
  store.subscribe((state) => {
    writeFile(userFilePath, JSONB.stringify(state, null, 2), (error) => {
      if (error) console.error("cannot save dump");
    });
  });
});
