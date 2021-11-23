import fs from "fs";
import { AbortController } from "node-abort-controller";
import path from "path";

export function watchFile(dirPath: string, fileName: string, onExists: () => void) {
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
