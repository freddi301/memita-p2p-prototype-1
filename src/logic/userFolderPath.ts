import path from "path";

export const userFolderPath = process.env["USER_FOLDER"] || path.resolve();
