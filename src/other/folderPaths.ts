import path from "path";

export const userFolderPath = process.env["USER_FOLDER"] || path.resolve();
export const filesFolderPath = path.resolve(userFolderPath, "files");
