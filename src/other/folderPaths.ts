import fs from "fs";
import path from "path";

export const userFolderPath = process.env["USER_FOLDER"] || path.resolve();
export const filesFolderPath = path.resolve(userFolderPath, "files");
export const uploadsFolderPath = path.resolve(userFolderPath, "uploads");

fs.promises.mkdir(userFolderPath, { recursive: true });
fs.promises.mkdir(filesFolderPath, { recursive: true });
