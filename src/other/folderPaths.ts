import fs from "fs";
import path from "path";

export const userFolderPath = process.env["USER_FOLDER"] || path.resolve();
export const filesFolderPath = path.resolve(userFolderPath, "files");
export const uploadsFolderPath = path.resolve(userFolderPath, "uploads");

setupFolders();
async function setupFolders() {
  await fs.promises.mkdir(userFolderPath, { recursive: true });
  await fs.promises.mkdir(filesFolderPath, { recursive: true });
  await fs.promises.mkdir(uploadsFolderPath, { recursive: true });
  for (const file of await fs.promises.readdir(uploadsFolderPath)) {
    await fs.promises.unlink(path.join(uploadsFolderPath, file));
  }
  for (const file of await fs.promises.readdir(filesFolderPath)) {
    if (file.endsWith(".materializing")) {
      await fs.promises.unlink(path.join(filesFolderPath, file));
    }
  }
}
