import fs from "fs";
import { AbortController } from "node-abort-controller";
import path from "path";

export function waitUntilFileExists(dirPath: string, fileName: string, onExists: () => void) {
  if (fs.existsSync(path.resolve(dirPath, fileName))) {
    setImmediate(() => onExists());
    return () => {};
  }
  const abortController = new AbortController();
  const { signal } = abortController;
  fs.watch(dirPath, { signal }, (event, file) => {
    if (file === fileName) {
      onExists();
      abortController.abort();
    }
  });
  return () => abortController.abort();
}

export function checkFileExists(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (error) => {
      resolve(!error);
    });
  });
}
